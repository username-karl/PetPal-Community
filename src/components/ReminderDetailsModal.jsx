import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    X,
    Clock,
    Calendar,
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    PawPrint
} from 'lucide-react';
import { format, isToday, isTomorrow, isPast, differenceInDays, startOfDay } from 'date-fns';
import { useData } from '../context/DataContext';
import { getPetIcon } from './Shared';

// Helper function to get due date info
const getDueDateInfo = (dateStr, completed = false) => {
    const date = startOfDay(new Date(dateStr));
    const today = startOfDay(new Date());
    const daysDiff = differenceInDays(date, today);

    if (completed) {
        return { label: format(date, 'MMMM d, yyyy'), status: 'completed', bgColor: 'bg-emerald-50', textColor: 'text-emerald-600', borderColor: 'border-emerald-200', icon: CheckCircle2 };
    }
    if (isToday(date)) {
        return { label: 'Today', status: 'today', bgColor: 'bg-amber-50', textColor: 'text-amber-700', borderColor: 'border-amber-200', icon: Clock };
    }
    if (isTomorrow(date)) {
        return { label: 'Tomorrow', status: 'upcoming', bgColor: 'bg-blue-50', textColor: 'text-blue-600', borderColor: 'border-blue-200', icon: Calendar };
    }
    if (isPast(date)) {
        const daysOverdue = Math.abs(daysDiff);
        return { label: daysOverdue === 1 ? 'Yesterday (Overdue)' : `${daysOverdue} days overdue`, status: 'overdue', bgColor: 'bg-red-50', textColor: 'text-red-600', borderColor: 'border-red-200', icon: AlertCircle };
    }
    if (daysDiff <= 7) {
        return { label: `In ${daysDiff} days`, status: 'upcoming', bgColor: 'bg-blue-50', textColor: 'text-blue-600', borderColor: 'border-blue-200', icon: Calendar };
    }
    return { label: format(date, 'MMMM d, yyyy'), status: 'future', bgColor: 'bg-slate-50', textColor: 'text-slate-600', borderColor: 'border-slate-200', icon: Calendar };
};

const ReminderDetailsModal = ({ reminder, onClose }) => {
    const navigate = useNavigate();
    const { pets, toggleReminder, deleteReminder } = useData();

    const pet = pets.find(p => p.id === reminder.petId);
    const dueDateInfo = getDueDateInfo(reminder.date, reminder.completed);
    const DueDateIcon = dueDateInfo.icon;

    const handleToggle = () => {
        toggleReminder(reminder.id);
        onClose(); // Close modal so UI refreshes with updated state
    };

    const handleDelete = () => {
        deleteReminder(reminder.id);
        onClose();
    };

    const handlePetClick = () => {
        onClose();
        navigate(`/pets/${pet.id}`);
    };

    return (
        <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform scale-100 transition-all overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with status banner */}
                <div className={`px-6 py-4 ${dueDateInfo.bgColor} border-b ${dueDateInfo.borderColor}`}>
                    <div className="flex justify-between items-center">
                        <div className={`flex items-center gap-2 ${dueDateInfo.textColor} font-semibold`}>
                            <DueDateIcon className="w-5 h-5" />
                            <span>{reminder.completed ? 'Completed' : dueDateInfo.label}</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-white/50 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Title */}
                    <h3 className={`text-xl font-bold mb-1 ${reminder.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                        {reminder.title}
                    </h3>

                    {/* Type badge */}
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium border ${reminder.type === 'Medical' ? 'bg-red-50 text-red-600 border-red-100' :
                        reminder.type === 'Grooming' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                            reminder.type === 'Vaccination' ? 'bg-green-50 text-green-600 border-green-100' :
                                'bg-blue-50 text-blue-600 border-blue-100'
                        }`}>
                        {reminder.type}
                    </span>

                    {/* Details Grid */}
                    <div className="mt-6 space-y-4">
                        {/* Due Date */}
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-medium tracking-wider">Due Date</p>
                                <p className="text-slate-900 font-medium">{format(new Date(reminder.date), 'EEEE, MMMM d, yyyy')}</p>
                            </div>
                        </div>

                        {/* Recurrence */}
                        {reminder.recurrence && reminder.recurrence !== 'None' && (
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                                    <RefreshCw className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-medium tracking-wider">Repeats</p>
                                    <p className="text-slate-900 font-medium">{reminder.recurrence}</p>
                                </div>
                            </div>
                        )}

                        {/* Pet Link */}
                        {pet && (
                            <div
                                onClick={handlePetClick}
                                className="flex items-center gap-3 p-3 -mx-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
                            >
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 ring-2 ring-slate-100">
                                    <img
                                        src={pet.imageUrl}
                                        alt={pet.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-slate-400 uppercase font-medium tracking-wider">Pet</p>
                                    <p className="text-slate-900 font-semibold group-hover:text-blue-600 transition-colors flex items-center gap-1">
                                        {pet.name}
                                        <span className="text-slate-400 font-normal flex items-center gap-1">({getPetIcon(pet.type, "w-3.5 h-3.5")} {pet.type})</span>
                                    </p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions Footer */}
                <div className="px-6 pb-6 flex gap-3">
                    <button
                        onClick={handleToggle}
                        className={`flex-1 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 ${reminder.completed
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-200'
                            }`}
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        {reminder.completed ? 'Mark Incomplete' : 'Mark Complete'}
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-3 rounded-xl font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReminderDetailsModal;
