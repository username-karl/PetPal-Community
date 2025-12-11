import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dog, Plus, Loader2, Edit2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import EditPetModal from '../components/EditPetModal';
import { getPetIcon } from '../components/Shared';

const MyPets = ({ onAddPetClick }) => {
  const navigate = useNavigate();
  const { pets, loading, error, activePetId, setActivePetId } = useData();
  const [editingPet, setEditingPet] = useState(null);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
        <p className="text-slate-500 mt-4 text-sm font-medium">Loading your pets...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-8 border border-red-100 rounded-xl bg-red-50/50">
        <p className="text-red-600 font-medium">Unable to load pets</p>
        <p className="text-red-400 text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">My Pets</h2>
          <p className="text-sm text-slate-500 mt-1">Manage profiles, medical records, and details.</p>
        </div>
        <button
          onClick={onAddPetClick}
          className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Pet
        </button>
      </div>

      {pets.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-xl">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Dog className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No pets added yet</h3>
          <p className="text-slate-500 text-sm mt-1 mb-6 max-w-sm mx-auto">
            Create a profile for your companion to start tracking their health, reminders, and activity.
          </p>
          <button
            onClick={onAddPetClick}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
          >
            Add your first pet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet, index) => (
            <motion.div
              key={pet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white border rounded-xl overflow-hidden hover:shadow-md transition-all group ${pet.id === activePetId ? 'border-blue-200 ring-1 ring-blue-100' : 'border-slate-200'
                }`}
            >
              <div
                className="h-40 bg-slate-100 relative cursor-pointer"
                onClick={() => setActivePetId(pet.id)}
              >
                <img
                  src={pet.imageUrl}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
                {/* Active Status Badge */}
                {pet.id === activePetId && (
                  <div className="absolute top-3 right-3 bg-blue-600/90 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> ACTIVE
                  </div>
                )}
                {pet.id !== activePetId && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-white/90 text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                      Set as Active
                    </span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-semibold text-slate-900">{pet.name}</h3>
                  {getPetIcon(pet.type)}
                </div>
                <p className="text-sm text-slate-500 mb-4">{pet.breed || pet.type}</p>

                <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-100 mb-4">
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Age</p>
                    <p className="text-sm font-semibold text-slate-900">{pet.age} Yrs</p>
                  </div>
                  <div className="text-center border-l border-slate-100">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Sex</p>
                    <p className="text-sm font-semibold text-slate-900">{pet.gender || '-'}</p>
                  </div>
                  <div className="text-center border-l border-slate-100">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Weight</p>
                    <p className="text-sm font-semibold text-slate-900">{pet.weight} kg</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/pets/${pet.id}`)}
                    className="flex-1 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors flex items-center justify-center gap-2"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => setEditingPet(pet)}
                    className="p-2 bg-white border border-slate-200 text-slate-400 rounded-lg hover:text-slate-900 hover:border-slate-300 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Add New Pet Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: pets.length * 0.1 }}
            className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-100 hover:border-slate-400 transition-all cursor-pointer group h-full min-h-[300px]"
            onClick={onAddPetClick}
          >
            <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 group-hover:text-slate-900 group-hover:border-slate-300 transition-colors mb-3 shadow-sm">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Add Another Pet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-[150px]">Track another furry friend's health and schedule</p>
          </motion.div>
        </div>
      )}

      {/* Edit Pet Modal */}
      {editingPet && (
        <EditPetModal
          pet={editingPet}
          onClose={() => setEditingPet(null)}
        />
      )}
    </div>
  );
};

export default MyPets;
