import React from 'react';
import { X, ChevronRight } from 'lucide-react';
import { PetType } from '../constants';
import { useData } from '../context/DataContext';

const AddPetModal = ({ onClose }) => {
  const { addPet } = useData();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newPetData = {
      name: formData.get('name'),
      type: formData.get('type'),
      breed: formData.get('breed'),
      age: Number(formData.get('age')),
      weight: Number(formData.get('weight')),
      imageUrl: `https://picsum.photos/seed/${formData.get('name')}/600/400`,
    };

    addPet(newPetData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl transform scale-100 transition-all">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Add New Pet</h3>
            <p className="text-slate-500 text-sm mt-1">Enter your pet's details to get started.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Pet Name</label>
            <input name="name" required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all" placeholder="e.g., Max" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Type</label>
              <div className="relative">
                <select name="type" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none appearance-none bg-white">
                  {Object.values(PetType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Breed</label>
              <input name="breed" required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all" placeholder="e.g., Labrador" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Age (years)</label>
              <input name="age" type="number" step="0.1" required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Weight (kg)</label>
              <input name="weight" type="number" step="0.1" required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all" />
            </div>
          </div>
          <button type="submit" className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20 mt-2">
            Create Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPetModal;