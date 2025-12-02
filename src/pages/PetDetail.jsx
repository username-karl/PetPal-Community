
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Edit3, Activity, Weight, Plus, ChevronRight, CheckCircle, Trash2, History, RotateCcw } from 'lucide-react';
import { StatusBadge, getPetEmoji } from '../components/Shared';
import { useData } from '../context/DataContext';

const PetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pets, reminders, updatePet, deletePet, addReminder, toggleReminder, deleteReminder } = useData();

  const pet = pets.find(p => p.id === id);

  // Define all hooks at the top level
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [isEditingPet, setIsEditingPet] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Initialize form state safely
  const [editForm, setEditForm] = useState({
    name: pet?.name || '',
    breed: pet?.breed || '',
    age: pet?.age || 0,
    weight: pet?.weight || 0
  });

  // Update local form state if the pet prop changes
  useEffect(() => {
    if (pet) {
      setEditForm({
        name: pet.name,
        breed: pet.breed,
        age: pet.age,
        weight: pet.weight
      });
    }
  }, [pet]);

  // Conditional rendering check happens AFTER hooks
  if (!pet) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500 mb-4">Pet details not found.</p>
        <button onClick={() => navigate('/pets')} className="text-primary font-bold hover:underline">
          Go back to My Pets
        </button>
      </div>
    );
  }

  const petReminders = reminders.filter(r => r.petId === pet.id);
  const activeReminders = petReminders.filter(r => !r.completed).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const completedReminders = petReminders.filter(r => r.completed).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSavePet = () => {
    updatePet(pet.id, editForm);
    setIsEditingPet(false);
  };

  const handleReminderSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addReminder(
      pet.id,
      fd.get('title'),
      fd.get('date'),
      fd.get('type')
    );
    setIsAddingReminder(false);
  };

  const handleDeletePet = () => {
    deletePet(pet.id);
    navigate('/pets');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button onClick={() => navigate('/pets')} className="flex items-center gap-2 text-slate-500 hover:text-primary transition font-medium">
        <ArrowLeft className="w-5 h-5" /> Back to Pets
      </button>

      {/* Hero Section */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-soft">
        <div className="relative h-72">
          <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />

          <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="w-full md:w-auto">
              {isEditingPet ? (
                <div className="space-y-4 max-w-md bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase mb-1 block">Name</label>
                    <input
                      value={editForm.name}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      className="text-3xl font-bold bg-transparent border-b border-white/30 text-white w-full focus:outline-none focus:border-white pb-1 placeholder-white/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase mb-1 block">Breed</label>
                    <input
                      value={editForm.breed}
                      onChange={e => setEditForm({ ...editForm, breed: e.target.value })}
                      className="text-lg bg-transparent border-b border-white/30 text-white w-full focus:outline-none focus:border-white pb-1 placeholder-white/30"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/20 flex items-center gap-1">
                      {getPetEmoji(pet.type)} {pet.type}
                    </span>
                  </div>
                  <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">{pet.name}</h1>
                  <p className="text-xl text-slate-200 font-medium">{pet.breed}</p>
                </>
              )}
            </div>

            <div className="flex gap-3">
              {isEditingPet ? (
                <>
                  <button
                    onClick={() => {
                      setIsEditingPet(false);
                      setEditForm({ name: pet.name, breed: pet.breed, age: pet.age, weight: pet.weight });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 backdrop-blur-md font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePet}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-400 font-bold transition shadow-lg shadow-primary/20 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setEditForm({ name: pet.name, breed: pet.breed, age: pet.age, weight: pet.weight });
                    setIsEditingPet(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/20 font-bold transition flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 bg-white border-t border-slate-100">
          <div className="flex flex-wrap gap-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shrink-0 border border-rose-100">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Age</p>
                {isEditingPet ? (
                  <div className="flex items-center gap-1 mt-1">
                    <input
                      type="number"
                      step="0.1"
                      value={editForm.age}
                      onChange={e => setEditForm({ ...editForm, age: parseFloat(e.target.value) })}
                      className="font-bold text-slate-900 text-xl w-20 border-b border-slate-300 focus:border-primary outline-none bg-transparent p-0"
                    />
                    <span className="text-slate-500 font-medium">Years</span>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-slate-900">{pet.age} <span className="text-sm font-medium text-slate-500">Years</span></p>
                )}
              </div>
            </div>
            <div className="w-px bg-slate-100 h-12 self-center hidden md:block"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0 border border-blue-100">
                <Weight className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weight</p>
                {isEditingPet ? (
                  <div className="flex items-center gap-1 mt-1">
                    <input
                      type="number"
                      step="0.1"
                      value={editForm.weight}
                      onChange={e => setEditForm({ ...editForm, weight: parseFloat(e.target.value) })}
                      className="font-bold text-slate-900 text-xl w-20 border-b border-slate-300 focus:border-primary outline-none bg-transparent p-0"
                    />
                    <span className="text-slate-500 font-medium">kg</span>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-slate-900">{pet.weight} <span className="text-sm font-medium text-slate-500">kg</span></p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Reminders Section */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Health & Care Reminders</h3>
            <p className="text-slate-500 text-sm">Stay on top of vaccinations and appointments.</p>
          </div>
          <button onClick={() => setIsAddingReminder(true)} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition flex items-center gap-2 font-bold shadow-lg shadow-slate-500/20">
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>

        {isAddingReminder && (
          <div className="mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100 animate-in fade-in">
            <form onSubmit={handleReminderSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Reminder Title</label>
                <input name="title" required placeholder="e.g., Heartworm Medication" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Due Date</label>
                  <input name="date" type="date" required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Type</label>
                  <div className="relative">
                    <select name="type" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none appearance-none bg-white">
                      <option value="Vaccination">Vaccination</option>
                      <option value="Medication">Medication</option>
                      <option value="Grooming">Grooming</option>
                      <option value="Vet">Vet Visit</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setIsAddingReminder(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-200 rounded-xl font-medium transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold transition">Save Reminder</button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-3">
          {activeReminders.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <CheckCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">No active tasks. You're all set!</p>
            </div>
          ) : (
            activeReminders.map(r => (
              <div key={r.id} className="flex items-center justify-between p-5 hover:bg-slate-50 rounded-2xl border border-slate-100 transition group bg-white">
                <div className="flex items-center gap-4">
                  <button onClick={() => toggleReminder(r.id)} className="w-6 h-6 rounded-full border-2 border-slate-300 hover:border-primary flex items-center justify-center transition-all" title="Mark as completed">
                  </button>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-base text-slate-900">{r.title}</span>
                      <StatusBadge type={r.type} />
                    </div>
                    <span className="text-sm text-slate-500 font-medium mt-1 block">{new Date(r.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <button onClick={() => deleteReminder(r.id)} className="text-slate-300 hover:text-rose-500 p-2 opacity-0 group-hover:opacity-100 transition" title="Delete">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Archive / History Section */}
        <div className="mt-10">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-sm uppercase tracking-wider mb-4 transition"
          >
            <History className="w-4 h-4" />
            History & Archive ({completedReminders.length})
            <ChevronRight className={`w-4 h-4 transition-transform ${showHistory ? 'rotate-90' : ''}`} />
          </button>

          {showHistory && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
              {completedReminders.length === 0 ? (
                <div className="text-sm text-slate-400 italic pl-6">No completed tasks in history.</div>
              ) : (
                completedReminders.map(r => (
                  <div key={r.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 opacity-75 hover:opacity-100 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-emerald-500 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-500 line-through block">{r.title}</span>
                        <span className="text-xs text-slate-400 font-medium">{new Date(r.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => toggleReminder(r.id)} className="text-slate-400 hover:text-primary p-1.5 hover:bg-white rounded-lg transition" title="Undo Completion">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteReminder(r.id)} className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-white rounded-lg transition" title="Delete Permanently">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Delete Zone */}
        <div className="mt-12 pt-8 border-t border-slate-100">
          <button
            onClick={handleDeletePet}
            className="text-rose-600 hover:bg-rose-50 px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition w-full md:w-auto justify-center"
          >
            <Trash2 className="w-4 h-4" /> Delete Pet Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetDetail;
