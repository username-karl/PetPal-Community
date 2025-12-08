import React, { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { ReminderType } from '../constants';
import { useData } from '../context/DataContext';

const AddReminderModal = ({ onClose }) => {
    const { pets, addReminder } = useData();
    const [selectedPetId, setSelectedPetId] = useState(pets[0]?.id || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const petId = formData.get('petId');
        const title = formData.get('title');
        const date = formData.get('date');
        const type = formData.get('type');
        const recurrence = formData.get('recurrence');

        addReminder(petId, title, date, type, recurrence);
        onClose();
    };

    if (pets.length === 0) {
        return (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-slate-900">No Pets Found</h3>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <X className="w-6 h-6 text-slate-400" />
                        </button>
                    </div>
                    <p className="text-slate-600">Please add a pet first before creating reminders.</p>
                    <button
                        onClick={onClose}
                        className="w-full mt-6 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl transform scale-100 transition-all">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900">Add New Reminder</h3>
                        <p className="text-slate-500 text-sm mt-1">Schedule a task for your pet.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Select Pet</label>
                        <div className="relative">
                            <select
                                name="petId"
                                value={selectedPetId}
                                onChange={(e) => setSelectedPetId(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none appearance-none bg-white"
                            >
                                {pets.map((pet) => (
                                    <option key={pet.id} value={pet.id}>
                                        {pet.name} ({pet.type})
                                    </option>
                                ))}
                            </select>
                            <ChevronRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Task Title</label>
                        <input
                            name="title"
                            required
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                            placeholder="e.g., Annual Checkup"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Date</label>
                            <input
                                name="date"
                                type="date"
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Type</label>
                            <div className="relative">
                                <select
                                    name="type"
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
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Recurrence</label>
                        <div className="relative">
                            <select
                                name="recurrence"
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none appearance-none bg-white"
                                defaultValue="None"
                            >
                                <option value="None">None</option>
                                <option value="Daily">Daily</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                            </select>
                            <ChevronRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 mt-2"
                    >
                        Create Reminder
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddReminderModal;
