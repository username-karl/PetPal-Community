import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    Circle,
    Clock,
    Trash2,
    Calendar as CalendarIcon,
    List,
    ChevronLeft,
    ChevronRight,
    Filter,
    Plus
} from 'lucide-react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    isToday
} from 'date-fns';
import AddReminderModal from '../components/AddReminderModal';

const Reminders = ({ user }) => {
    const { reminders, toggleReminder, deleteReminder, pets } = useData();
    const [filter, setFilter] = useState('all');
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showAddReminderModal, setShowAddReminderModal] = useState(false);

    // --- Calendar Logic ---
    const headerDate = format(currentDate, "MMMM yyyy");

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const goToToday = () => setCurrentDate(new Date());

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // --- Filter Logic ---
    const filteredReminders = reminders.filter(reminder => {
        if (filter === 'all') return true;
        if (filter === 'today') return new Date(reminder.date).toDateString() === new Date().toDateString();
        if (filter === 'upcoming') return new Date(reminder.date) > new Date();
        if (filter === 'completed') return reminder.completed;
        return true;
    });

    const getRemindersForDate = (date) => {
        return reminders.filter(r => isSameDay(new Date(r.date), date));
    };

    const categories = [
        { id: 'all', label: 'All Tasks', count: reminders.length },
        { id: 'today', label: 'Today', count: reminders.filter(r => new Date(r.date).toDateString() === new Date().toDateString()).length },
        { id: 'upcoming', label: 'Upcoming', count: reminders.filter(r => new Date(r.date) > new Date()).length },
        { id: 'completed', label: 'Completed', count: reminders.filter(r => r.completed).length },
    ];

    return (
        <div className="fade-in max-w-6xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Reminders</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage your pet care schedule and tasks.</p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowAddReminderModal(true)}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> Add Reminder
                    </button>
                    {/* View Toggle */}
                    <div className="flex bg-slate-100 p-1 rounded-lg self-start md:self-auto">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'list'
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-900'
                                }`}
                        >
                            <List className="w-4 h-4" /> List
                        </button>
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'calendar'
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-900'
                                }`}
                        >
                            <CalendarIcon className="w-4 h-4" /> Calendar
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">

                {/* Sidebar Filters (Only relevant for List View, or generic stats) */}
                {viewMode === 'list' && (
                    <aside className="w-full lg:w-64 space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Filters</h3>
                            <div className="space-y-1">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setFilter(category.id)}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${filter === category.id
                                                ? 'bg-slate-900 text-white'
                                                : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        <span>{category.label}</span>
                                        <span className={`text-xs ml-2 px-2 py-0.5 rounded-full ${filter === category.id ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {category.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>
                )}

                {/* Main Content Area */}
                <div className="flex-1">
                    {viewMode === 'list' ? (
                        // --- LIST VIEW ---
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-slate-400" />
                                    {categories.find(c => c.id === filter)?.label}
                                </h3>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {filteredReminders.length > 0 ? (
                                    filteredReminders.map((reminder) => {
                                        const pet = pets.find(p => p.id === reminder.petId);

                                        return (
                                            <div
                                                key={reminder.id}
                                                className={`p-4 flex items-center gap-4 hover:bg-slate-50 transition-all group ${reminder.completed ? 'opacity-60 bg-slate-50/50' : ''}`}
                                            >
                                                <button
                                                    onClick={() => toggleReminder(reminder.id)}
                                                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${reminder.completed
                                                            ? 'bg-emerald-500 border-emerald-500 text-white'
                                                            : 'border-slate-300 text-transparent hover:border-slate-400'
                                                        }`}
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                </button>

                                                <div className="flex-1 min-w-0">
                                                    <h4 className={`text-sm font-medium truncate ${reminder.completed ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                                                        {reminder.title}
                                                    </h4>
                                                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(reminder.date).toLocaleDateString()}
                                                        </span>
                                                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${reminder.type === 'Medical' ? 'bg-red-50 text-red-600 border-red-100' :
                                                                reminder.type === 'Grooming' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                                    'bg-blue-50 text-blue-600 border-blue-100'
                                                            }`}>
                                                            {reminder.type}
                                                        </span>
                                                        {reminder.recurrence && reminder.recurrence !== 'None' && (
                                                            <span className="bg-orange-50 text-orange-600 border border-orange-100 px-1.5 py-0.5 rounded text-[10px] font-medium">
                                                                {reminder.recurrence}
                                                            </span>
                                                        )}
                                                        {pet && ` • ${pet.name}`}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => deleteReminder(reminder.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <div className="p-12 text-center text-slate-400">
                                        <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                                        <p>No tasks found in this view.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        // --- CALENDAR VIEW ---
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px] md:h-auto">

                            {/* Calendar Header */}
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-lg font-bold text-slate-900 w-40">{headerDate}</h3>
                                    <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                                        <button onClick={prevMonth} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-slate-600">
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button onClick={nextMonth} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-slate-600">
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={goToToday}
                                    className="text-xs font-semibold text-primary hover:text-primary-dark border border-primary/20 px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors"
                                >
                                    Today
                                </button>
                            </div>

                            {/* Days Header */}
                            <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">
                                {weekDays.map(day => (
                                    <div key={day} className="py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Days Grid */}
                            <div className="grid grid-cols-7 auto-rows-fr h-full">
                                {calendarDays.map((day, dayIdx) => {
                                    const dayReminders = getRemindersForDate(day);
                                    const isCurrentMonth = isSameMonth(day, currentDate);
                                    const isDayToday = isToday(day);

                                    return (
                                        <div
                                            key={day.toString()}
                                            className={`min-h-[100px] p-2 border-b border-r border-slate-100 relative group transition-colors ${!isCurrentMonth ? 'bg-slate-50/50 text-slate-400' : 'bg-white'
                                                } ${isDayToday ? 'bg-primary/5' : ''}`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${isDayToday ? 'bg-primary text-white' : 'text-slate-700'
                                                    }`}>
                                                    {format(day, 'd')}
                                                </span>
                                            </div>

                                            {/* Reminder Dots/Pills */}
                                            <div className="mt-2 space-y-1">
                                                {dayReminders.slice(0, 3).map((rem, i) => (
                                                    <div
                                                        key={i}
                                                        className={`text-[10px] truncate px-1.5 py-0.5 rounded border border-transparent ${rem.completed
                                                                ? 'bg-slate-100 text-slate-400 line-through'
                                                                : rem.type === 'Medical'
                                                                    ? 'bg-red-50 text-red-700 border-red-100'
                                                                    : 'bg-blue-50 text-blue-700 border-blue-100'
                                                            }`}
                                                        title={rem.title}
                                                    >
                                                        {rem.title}
                                                    </div>
                                                ))}
                                                {dayReminders.length > 3 && (
                                                    <div className="text-[10px] text-slate-400 pl-1">
                                                        +{dayReminders.length - 3} more
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showAddReminderModal && (
                <AddReminderModal onClose={() => setShowAddReminderModal(false)} />
            )}
        </div>
    );
};

export default Reminders;
