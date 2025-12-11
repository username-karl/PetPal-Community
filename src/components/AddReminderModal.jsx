import React, { useState } from 'react';
import { X, ChevronRight, Calendar, Clock, RefreshCw, Bell, PawPrint } from 'lucide-react';
import { ReminderType } from '../constants';
import { useData } from '../context/DataContext';
import { getPetIcon } from './Shared';

const AddReminderModal = ({ onClose }) => {
    const { pets, addReminder } = useData();
    const [selectedPetId, setSelectedPetId] = useState(pets[0]?.id || '');
    const [selectedType, setSelectedType] = useState(ReminderType.GENERAL);
    const [selectedRecurrence, setSelectedRecurrence] = useState('None');
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');

    const selectedPet = pets.find(p => p.id === selectedPetId || p.id === Number(selectedPetId));

    const handleSubmit = (e) => {
        e.preventDefault();
        addReminder(selectedPetId, title, date, selectedType, selectedRecurrence);
        onClose();
    };

    // Type badge color config (matches existing app aesthetic)
    const getTypeBadgeStyle = (type) => {
        switch (type) {
            case ReminderType.VACCINATION:
                return 'bg-green-50 text-green-600 border-green-100';
            case ReminderType.MEDICATION:
                return 'bg-blue-50 text-blue-600 border-blue-100';
            case ReminderType.GROOMING:
                return 'bg-purple-50 text-purple-600 border-purple-100';
            case ReminderType.VET_VISIT:
                return 'bg-red-50 text-red-600 border-red-100';
            case ReminderType.SHOPPING:
                return 'bg-cyan-50 text-cyan-600 border-cyan-100';
            case ReminderType.ROUTINE:
                return 'bg-orange-50 text-orange-600 border-orange-100';
            default:
                return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    if (pets.length === 0) {
        return (
            <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
                onClick={onClose}
            >
                <div
                    className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-slate-900">No Pets Found</h3>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <X className="w-6 h-6 text-slate-400" />
                        </button>
                    </div>
                    <div className="text-center py-6">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                            <PawPrint className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-600">Please add a pet first before creating reminders.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-lg shadow-2xl transform scale-100 transition-all overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900">Add New Reminder</h3>
                            <p className="text-slate-500 text-sm mt-1">Schedule a task for your pet.</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <X className="w-6 h-6 text-slate-400" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Pet Selection */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Select Pet
                        </label>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {pets.map((pet) => (
                                <button
                                    key={pet.id}
                                    type="button"
                                    onClick={() => setSelectedPetId(pet.id)}
                                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${(selectedPetId === pet.id || selectedPetId === String(pet.id))
                                        ? 'border-slate-900 bg-slate-900 text-white'
                                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                                        }`}
                                >
                                    {getPetIcon(pet.type, "w-4 h-4")}
                                    <span className="font-medium text-sm">{pet.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Task Title */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Task Title
                        </label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                            placeholder="e.g., Annual Checkup"
                        />
                    </div>

                    {/* Date & Type Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                Date
                            </label>
                            <input
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                type="date"
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Bell className="w-3.5 h-3.5" />
                                Type
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none appearance-none bg-white"
                                >
                                    {Object.values(ReminderType).map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                <ChevronRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Recurrence */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <RefreshCw className="w-3.5 h-3.5" />
                            Recurrence
                        </label>
                        <div className="flex gap-2">
                            {['None', 'Daily', 'Weekly', 'Monthly'].map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => setSelectedRecurrence(opt)}
                                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedRecurrence === opt
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Preview Card (only shown when title and date filled) */}
                    {title && date && (
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Preview</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-900 truncate">{title}</p>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded border font-medium ${getTypeBadgeStyle(selectedType)}`}>
                                            {selectedType}
                                        </span>
                                        {selectedRecurrence !== 'None' && (
                                            <span className="text-xs px-2 py-0.5 rounded border bg-orange-50 text-orange-600 border-orange-100 font-medium">
                                                {selectedRecurrence}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {selectedPet && (
                                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200 text-xs text-slate-500">
                                    {getPetIcon(selectedPet.type, "w-3.5 h-3.5")}
                                    <span>{selectedPet.name}</span>
                                </div>
                            )}
                        </div>
                    )}
                </form>

                {/* Footer Actions */}
                <div className="px-6 pb-6 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="flex-1 py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                    >
                        Create Reminder
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddReminderModal;
