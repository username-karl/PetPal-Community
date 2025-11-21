import React from 'react';
import { PawPrint, Heart, Calendar, Plus } from 'lucide-react';
import { StatusBadge, getPetEmoji } from '../components/Shared';

const MyPets = ({ pets, reminders, onSelectPet, onAddPetClick }) => {
  const getPetReminders = (petId) =>
    reminders
      .filter((reminder) => reminder.petId === petId && !reminder.completed)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (!pets?.length) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 bg-white rounded-3xl border border-dashed border-slate-200 p-12">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
          <PawPrint className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">No pets yet</h2>
          <p className="text-slate-500 mt-2 max-w-md">
            Add your first companion to start tracking reminders, notes, and health history in one place.
          </p>
        </div>
        <button
          onClick={onAddPetClick}
          className="inline-flex items-center gap-2 bg-brand-600 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition"
        >
          <Plus className="w-5 h-5" />
          Add a Pet
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-600 uppercase tracking-widest">My Pets</p>
          <h1 className="text-3xl font-bold text-slate-900 mt-1">Care Overview</h1>
          <p className="text-slate-500 mt-2">Manage profiles, upcoming reminders, and wellness details.</p>
        </div>
        <button
          onClick={onAddPetClick}
          className="inline-flex items-center gap-2 bg-brand-600 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition"
        >
          <Plus className="w-5 h-5" />
          Add New Pet
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pets.map((pet) => {
          const upcoming = getPetReminders(pet.id);
          return (
            <button
              key={pet.id}
              onClick={() => onSelectPet(pet.id)}
              className="text-left group bg-white border border-slate-100 rounded-3xl p-6 shadow-soft hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <img
                  src={pet.imageUrl}
                  alt={pet.name}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md"
                />
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase text-slate-400 font-semibold tracking-wider">{pet.type}</p>
                      <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        {getPetEmoji(pet.type)}
                        {pet.name}
                      </h3>
                      <p className="text-sm text-slate-500 font-medium">{pet.breed}</p>
                    </div>
                    <div className="flex items-center gap-2 text-rose-500 font-semibold text-sm bg-rose-50 px-3 py-1 rounded-full">
                      <Heart className="w-4 h-4" />
                      {pet.age} yrs
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                    <span className="px-3 py-1 rounded-full bg-slate-50">Weight {pet.weight} kg</span>
                    <span className="px-3 py-1 rounded-full bg-slate-50">{upcoming.length} upcoming tasks</span>
                  </div>
                </div>
              </div>

              {upcoming.length > 0 ? (
                <div className="mt-6 border-t border-slate-100 pt-4 space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming reminders</p>
                  {upcoming.slice(0, 2).map((reminder) => (
                    <div
                      key={reminder.id}
                      className="flex items-center justify-between bg-slate-50 rounded-2xl px-4 py-3"
                    >
                      <div>
                        <p className="font-bold text-slate-900">{reminder.title}</p>
                        <div className="flex items-center gap-3 text-xs font-medium text-slate-500 mt-1">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(reminder.date).toLocaleDateString()}
                          </span>
                          <StatusBadge type={reminder.type} />
                        </div>
                      </div>
                    </div>
                  ))}
                  {upcoming.length > 2 && (
                    <p className="text-xs text-brand-600 font-semibold">
                      +{upcoming.length - 2} more scheduled tasks
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-6 border-t border-slate-100 pt-4 text-sm text-slate-500">
                  No pending reminders. Great job!
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MyPets;

