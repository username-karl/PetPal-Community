import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
    Plus,
    AlertCircle,
    PawPrint
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
    isToday,
    isTomorrow,
    isYesterday,
    isPast,
    differenceInDays,
    startOfDay
} from 'date-fns';
import AddReminderModal from '../components/AddReminderModal';
import ReminderDetailsModal from '../components/ReminderDetailsModal';

// Helper function to get due date info
const getDueDateInfo = (dateStr, completed) => {
    const date = startOfDay(new Date(dateStr));
    const today = startOfDay(new Date());
    const daysDiff = differenceInDays(date, today);

    if (completed) {
        return {
            label: format(date, 'MMM d'),
            status: 'completed',
            bgColor: 'bg-slate-100',
            textColor: 'text-slate-400',
            borderColor: 'border-slate-200',
            icon: null
        };
    }

    if (isToday(date)) {
        return {
            label: 'Today',
            status: 'today',
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-700',
            borderColor: 'border-amber-200',
            icon: null
        };
    }

    if (isTomorrow(date)) {
        return {
            label: 'Tomorrow',
            status: 'upcoming',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
            borderColor: 'border-blue-200',
            icon: null
        };
    }

    if (isPast(date)) {
        const daysOverdue = Math.abs(daysDiff);
        return {
            label: daysOverdue === 1 ? 'Yesterday' : `${daysOverdue} days overdue`,
            status: 'overdue',
            bgColor: 'bg-red-50',
            textColor: 'text-red-600',
            borderColor: 'border-red-200',
            icon: AlertCircle
        };
    }

    if (daysDiff <= 7) {
        return {
            label: `In ${daysDiff} days`,
            status: 'upcoming',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
            borderColor: 'border-blue-200',
            icon: null
        };
    }

    return {
        label: format(date, 'MMM d'),
        status: 'future',
        bgColor: 'bg-slate-50',
        textColor: 'text-slate-600',
        borderColor: 'border-slate-200',
        icon: null
    };
};

const Reminders = ({ user }) => {
    const location = useLocation();
    const { reminders, toggleReminder, deleteReminder, pets } = useData();
    const [filter, setFilter] = useState('all');
    const [viewMode, setViewMode] = useState(location.state?.viewMode || 'list');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showAddReminderModal, setShowAddReminderModal] = useState(false);
    const [selectedReminder, setSelectedReminder] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);

    // Update viewMode if coming from navigation with state
    useEffect(() => {
        if (location.state?.viewMode) {
            setViewMode(location.state.viewMode);
        }
    }, [location.state]);

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
    }).sort((a, b) => {
        // Sort completed tasks to the bottom
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        // Then sort by date (earliest first)
        return new Date(a.date) - new Date(b.date);
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
                                                className={`p-4 flex items-center gap-4 hover:bg-slate-50 transition-all group cursor-pointer ${reminder.completed ? 'opacity-60 bg-slate-50/50' : ''}`}
                                                onClick={() => setSelectedReminder(reminder)}
                                            >
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleReminder(reminder.id); }}
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
                                                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 flex-wrap">
                                                        {(() => {
                                                            const dueDateInfo = getDueDateInfo(reminder.date, reminder.completed);
                                                            const IconComponent = dueDateInfo.icon;
                                                            return (
                                                                <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded border ${dueDateInfo.bgColor} ${dueDateInfo.textColor} ${dueDateInfo.borderColor} font-medium`}>
                                                                    {IconComponent && <IconComponent className="w-3 h-3" />}
                                                                    <Clock className="w-3 h-3" />
                                                                    {dueDateInfo.label}
                                                                </span>
                                                            );
                                                        })()}
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
                                                        {pet && <span className="text-slate-400">• {pet.name}</span>}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={(e) => { e.stopPropagation(); deleteReminder(reminder.id); }}
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
                        <div className="flex gap-6">
                            {/* Calendar Grid */}
                            <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                {/* Calendar Header */}
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-xl font-bold text-slate-900 min-w-[180px]">{headerDate}</h3>
                                        <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                                            <button onClick={prevMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-slate-600">
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                            <button onClick={nextMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-slate-600">
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={goToToday}
                                        className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Today
                                    </button>
                                </div>

                                {/* Days Header */}
                                <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">
                                    {weekDays.map(day => (
                                        <div key={day} className="py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Days Grid */}
                                <div className="grid grid-cols-7">
                                    {calendarDays.map((day, dayIdx) => {
                                        const dayReminders = getRemindersForDate(day);
                                        const isCurrentMonth = isSameMonth(day, currentDate);
                                        const isDayToday = isToday(day);
                                        const isSelected = selectedDay && isSameDay(day, selectedDay);
                                        const hasReminders = dayReminders.length > 0;
                                        const hasOverdue = dayReminders.some(r => !r.completed && isPast(new Date(r.date)) && !isToday(new Date(r.date)));
                                        const hasCompleted = dayReminders.every(r => r.completed) && hasReminders;

                                        return (
                                            <div
                                                key={day.toString()}
                                                onClick={() => setSelectedDay(day)}
                                                className={`min-h-[110px] p-2 border-b border-r border-slate-100 relative cursor-pointer transition-all
                                                    ${!isCurrentMonth ? 'bg-slate-50/50' : 'bg-white hover:bg-slate-50'}
                                                    ${isDayToday ? 'bg-blue-50/50' : ''}
                                                    ${isSelected ? 'bg-slate-100 ring-2 ring-slate-900 ring-inset' : ''}
                                                `}
                                            >
                                                {/* Day Number */}
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full transition-colors
                                                        ${isDayToday ? 'bg-slate-900 text-white' : ''}
                                                        ${!isCurrentMonth ? 'text-slate-300' : 'text-slate-700'}
                                                        ${isSelected && !isDayToday ? 'bg-slate-200' : ''}
                                                    `}>
                                                        {format(day, 'd')}
                                                    </span>
                                                    {/* Indicator dots */}
                                                    {hasReminders && (
                                                        <div className="flex gap-0.5">
                                                            {hasOverdue && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                                                            {!hasOverdue && !hasCompleted && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                                                            {hasCompleted && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Reminder Pills */}
                                                <div className="space-y-1">
                                                    {dayReminders.slice(0, 2).map((rem, i) => {
                                                        const typeColors = {
                                                            'Medical': 'bg-red-100 text-red-700 border-red-200',
                                                            'Vaccination': 'bg-green-100 text-green-700 border-green-200',
                                                            'Vet Visit': 'bg-red-100 text-red-700 border-red-200',
                                                            'Medication': 'bg-blue-100 text-blue-700 border-blue-200',
                                                            'Grooming': 'bg-purple-100 text-purple-700 border-purple-200',
                                                            'Routine': 'bg-orange-100 text-orange-700 border-orange-200',
                                                        };
                                                        const colorClass = rem.completed
                                                            ? 'bg-slate-100 text-slate-400 line-through border-slate-200'
                                                            : (typeColors[rem.type] || 'bg-slate-100 text-slate-600 border-slate-200');

                                                        return (
                                                            <div
                                                                key={i}
                                                                onClick={(e) => { e.stopPropagation(); setSelectedReminder(rem); }}
                                                                className={`text-[10px] truncate px-1.5 py-0.5 rounded border cursor-pointer hover:opacity-80 transition-opacity ${colorClass}`}
                                                                title={rem.title}
                                                            >
                                                                {rem.title}
                                                            </div>
                                                        );
                                                    })}
                                                    {dayReminders.length > 2 && (
                                                        <div className="text-[10px] text-slate-400 font-medium pl-1">
                                                            +{dayReminders.length - 2} more
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Selected Day Detail Panel */}
                            <div className="w-80 flex-shrink-0 hidden lg:block">
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm sticky top-6">
                                    {/* Panel Header */}
                                    <div className="p-4 border-b border-slate-100">
                                        <h4 className="font-semibold text-slate-900">
                                            {selectedDay ? format(selectedDay, 'EEEE, MMM d') : format(new Date(), 'EEEE, MMM d')}
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {getRemindersForDate(selectedDay || new Date()).length} reminders
                                        </p>
                                    </div>

                                    {/* Day's Reminders */}
                                    <div className="max-h-[400px] overflow-y-auto">
                                        {getRemindersForDate(selectedDay || new Date()).length > 0 ? (
                                            getRemindersForDate(selectedDay || new Date()).map((reminder) => {
                                                const pet = pets.find(p => p.id === reminder.petId);
                                                return (
                                                    <div
                                                        key={reminder.id}
                                                        onClick={() => setSelectedReminder(reminder)}
                                                        className={`p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors ${reminder.completed ? 'opacity-60' : ''}`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); toggleReminder(reminder.id); }}
                                                                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors mt-0.5 ${reminder.completed
                                                                    ? 'bg-emerald-500 border-emerald-500 text-white'
                                                                    : 'border-slate-300 hover:border-slate-400'
                                                                    }`}
                                                            >
                                                                {reminder.completed && <CheckCircle2 className="w-3 h-3" />}
                                                            </button>
                                                            <div className="flex-1 min-w-0">
                                                                <h5 className={`text-sm font-medium truncate ${reminder.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                                                                    {reminder.title}
                                                                </h5>
                                                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${reminder.type === 'Medical' ? 'bg-red-50 text-red-600' :
                                                                            reminder.type === 'Vaccination' ? 'bg-green-50 text-green-600' :
                                                                                reminder.type === 'Grooming' ? 'bg-purple-50 text-purple-600' :
                                                                                    'bg-blue-50 text-blue-600'
                                                                        }`}>
                                                                        {reminder.type}
                                                                    </span>
                                                                    {pet && (
                                                                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                                            <PawPrint className="w-3 h-3" /> {pet.name}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="p-8 text-center">
                                                <CalendarIcon className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                                                <p className="text-slate-400 text-sm">No reminders for this day</p>
                                                <button
                                                    onClick={() => setShowAddReminderModal(true)}
                                                    className="mt-3 text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 mx-auto"
                                                >
                                                    <Plus className="w-3 h-3" /> Add reminder
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showAddReminderModal && (
                <AddReminderModal onClose={() => setShowAddReminderModal(false)} />
            )}

            {selectedReminder && (
                <ReminderDetailsModal
                    reminder={selectedReminder}
                    onClose={() => setSelectedReminder(null)}
                />
            )}
        </div>
    );
};

export default Reminders;
