import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PawPrint, Heart, Calendar, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatusBadge, getPetEmoji } from '../components/Shared';
import { useData } from '../context/DataContext';
import Card from '../components/Card';

const MyPets = ({ onAddPetClick }) => {
  const navigate = useNavigate();
  const { pets, reminders } = useData();

  const getPetReminders = (petId) =>
    reminders
      .filter((reminder) => reminder.petId === petId && !reminder.completed)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (!pets?.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 bg-white rounded-3xl border border-dashed border-slate-200 p-12"
      >
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-primary flex items-center justify-center shadow-lg shadow-primary/10">
          <PawPrint className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">No pets yet</h2>
          <p className="text-slate-500 mt-2 max-w-md">
            Add your first companion to start tracking reminders, notes, and health history in one place.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddPetClick}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-primary/30 hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5" />
          Add a Pet
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <motion.div variants={item}>
          <p className="text-sm font-bold text-primary uppercase tracking-widest">My Pets</p>
          <h1 className="text-3xl font-bold text-slate-900 mt-1">Care Overview</h1>
          <p className="text-slate-500 mt-2">Manage profiles, upcoming reminders, and wellness details.</p>
        </motion.div>
        <motion.button
          variants={item}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddPetClick}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-primary/30 hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5" />
          Add New Pet
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pets.map((pet) => {
          const upcoming = getPetReminders(pet.id);
          return (
            <motion.div key={pet.id} variants={item}>
              <Card
                onClick={() => navigate(`/pets/${pet.id}`)}
                className="text-left group cursor-pointer h-full flex flex-col"
              >
                <div className="flex items-start gap-5">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-lg transform group-hover:scale-110 transition-transform" />
                    <img
                      src={pet.imageUrl}
                      alt={pet.name}
                      className="relative w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md z-10"
                    />
                  </motion.div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs uppercase text-slate-400 font-bold tracking-wider">{pet.type}</p>
                        <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2 group-hover:text-primary transition-colors">
                          {getPetEmoji(pet.type)}
                          {pet.name}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium">{pet.breed}</p>
                      </div>
                      <div className="flex items-center gap-2 text-rose-500 font-bold text-sm bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                        <Heart className="w-4 h-4 fill-rose-500" />
                        {pet.age} yrs
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                      <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-100">Weight {pet.weight} kg</span>
                      <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-100">{upcoming.length} upcoming tasks</span>
                    </div>
                  </div>
                </div>

                {upcoming.length > 0 ? (
                  <div className="mt-6 border-t border-slate-50 pt-4 space-y-3 flex-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming reminders</p>
                    {upcoming.slice(0, 2).map((reminder) => (
                      <div
                        key={reminder.id}
                        className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100"
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
                      <p className="text-xs text-primary font-bold pl-1">
                        +{upcoming.length - 2} more scheduled tasks
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mt-6 border-t border-slate-50 pt-4 text-sm text-slate-400 font-medium flex-1 flex items-end">
                    No pending reminders. Great job!
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default MyPets;

