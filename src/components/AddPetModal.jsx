import React, { useState } from 'react';
import { X, ChevronRight, PawPrint, Activity, Eye } from 'lucide-react';
import { PetType } from '../constants';
import { useData } from '../context/DataContext';
import Stepper, { Step } from './Stepper';
import { getPetEmoji } from './Shared';

const AddPetModal = ({ onClose }) => {
  const { addPet } = useData();
  const [formData, setFormData] = useState({
    name: '',
    type: PetType.DOG,
    breed: '',
    age: '',
    weight: '',
    color: '',
    gender: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFinalStepCompleted = () => {
    const newPetData = {
      name: formData.name,
      type: formData.type,
      breed: formData.breed,
      age: Number(formData.age),
      weight: Number(formData.weight),
      imageUrl: `https://picsum.photos/seed/${formData.name}/600/400`,
      color: formData.color,
      gender: formData.gender,
    };

    addPet(newPetData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-8 shadow-2xl transform scale-100 transition-all">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Add New Pet</h3>
            <p className="text-slate-500 text-sm mt-1">Follow the steps to create a complete pet profile.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <Stepper
          initialStep={0}
          onStepChange={(step) => {
            console.log('Current step:', step);
          }}
          onFinalStepCompleted={handleFinalStepCompleted}
          backButtonText="Previous"
          nextButtonText="Next"
          finishButtonText="Create Profile"
        >
          {/* Step 1: Basic Information */}
          <Step>
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center">
                  <PawPrint className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Basic Information</h2>
                  <p className="text-sm text-slate-500">Let's start with the basics about your pet!</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Pet Name *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g., Max, Bella, Whiskers"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Type *</label>
                  <div className="relative">
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none appearance-none bg-white"
                    >
                      {Object.values(PetType).map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <ChevronRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Breed *</label>
                  <input
                    name="breed"
                    value={formData.breed}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., Labrador, Persian"
                  />
                </div>
              </div>
            </div>
          </Step>

          {/* Step 2: Physical Details */}
          <Step>
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Physical Details</h2>
                  <p className="text-sm text-slate-500">Tell us about your pet's physical characteristics.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Age (years) *</label>
                  <input
                    name="age"
                    type="number"
                    step="0.1"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., 3.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Weight (kg) *</label>
                  <input
                    name="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., 25.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Color</label>
                  <input
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., Golden Brown"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Gender</label>
                  <div className="relative">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none appearance-none bg-white"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    <ChevronRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </Step>

          {/* Step 3: Review & Confirm */}
          <Step>
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Review & Confirm</h2>
                  <p className="text-sm text-slate-500">Please review your pet's information.</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-brand-50 to-purple-50 rounded-2xl p-4 border border-brand-100">
                <div className="flex items-start gap-3">
                  <div className="text-4xl">{getPetEmoji(formData.type)}</div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{formData.name || 'Pet Name'}</h3>
                      <p className="text-slate-600 text-sm font-medium">{formData.breed || 'Breed'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-white/70 rounded-xl p-2.5">
                        <p className="text-slate-500 text-xs font-semibold">Type</p>
                        <p className="text-slate-900 font-bold">{formData.type}</p>
                      </div>
                      <div className="bg-white/70 rounded-xl p-2.5">
                        <p className="text-slate-500 text-xs font-semibold">Age</p>
                        <p className="text-slate-900 font-bold">{formData.age || '--'} years</p>
                      </div>
                      <div className="bg-white/70 rounded-xl p-2.5">
                        <p className="text-slate-500 text-xs font-semibold">Weight</p>
                        <p className="text-slate-900 font-bold">{formData.weight || '--'} kg</p>
                      </div>
                      <div className="bg-white/70 rounded-xl p-2.5">
                        <p className="text-slate-500 text-xs font-semibold">Gender</p>
                        <p className="text-slate-900 font-bold">{formData.gender || 'Not specified'}</p>
                      </div>
                    </div>

                    {formData.color && (
                      <div className="pt-3 border-t border-brand-200">
                        <p className="text-xs"><span className="font-semibold text-slate-700">Color:</span> {formData.color}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Step>
        </Stepper>
      </div>
    </div>
  );
};

export default AddPetModal;