import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MoreHorizontal, PawPrint, TrendingUp, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatusBadge } from '../components/Shared';
import { useData } from '../context/DataContext';
import { PET_CARE_TIPS } from '../constants';
import Card from '../components/Card';
import AddReminderModal from '../components/AddReminderModal';
import SkeletonLoader from '../components/SkeletonLoader';

// Utility Confetti functions
const random = (min, max) => Math.random() * (max - min) + min;

const Confetti = () => {
  const confettiColors = ['#818cf8', '#c084fc', '#fb7185', '#fdba74', '#67e8f9'];
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: random(-10, 110),
    rotation: random(0, 360),
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)]
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ y: -20, x: `${particle.x}%`, opacity: 1, rotate: 0 }}
          animate={{
            y: window.innerHeight + 20,
            rotate: particle.rotation,
            opacity: 0
          }}
          transition={{ duration: random(2, 3), ease: 'easeIn' }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ backgroundColor: particle.color }}
        />
      ))}
    </div>
  );
};

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const { pets, reminders, toggleReminder } = useData();
  const [showAddReminderModal, setShowAddReminderModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [randomTip, setRandomTip] = useState('');

  const upcomingReminders = reminders.filter(r => !r.completed);
  const completedRemindersCount = reminders.filter(r => r.completed).length;

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Set random tip on mount
  useEffect(() => {
    const tip = PET_CARE_TIPS[Math.floor(Math.random() * PET_CARE_TIPS.length)];
    setRandomTip(tip);
  }, []);

  // Check if all tasks completed for celebration
  useEffect(() => {
    if (reminders.length > 0 && upcomingReminders.length === 0 && completedRemindersCount > 0) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [upcomingReminders.length, completedRemindersCount, reminders.length]);

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Safe user name extraction
  const firstName = user?.name?.split(' ')[0] || 'Friend';

  // Check if date is overdue (strictly before today)
  const isOverdue = (dateString) => {
    const reminderDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    reminderDate.setHours(0, 0, 0, 0);
    return reminderDate.getTime() < today.getTime();
  };

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

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <>
      {showCelebration && <Confetti />}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <motion.div
            variants={item}
            className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 text-white shadow-soft-lg col-span-1 md:col-span-2 flex flex-col justify-between min-h-[220px]"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
              transition={{ duration: 20, repeat: Infinity }}
              className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"
            />
            <motion.div
              animate={{ scale: [1, 1.5, 1], rotate: [0, -10, 0] }}
              transition={{ duration: 25, repeat: Infinity }}
              className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full -ml-10 -mb-10 blur-2xl"
            />

            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2 tracking-tight drop-shadow-md">
                {getGreeting()}, {firstName}! 👋
              </h2>
              <p className="text-white text-lg font-medium max-w-md drop-shadow-sm">
                You have {upcomingReminders.length} upcoming tasks. Let's keep your companions happy and healthy.
              </p>
            </div>

            <div className="relative z-10 flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/pets')}
                className="bg-white text-indigo-600 hover:bg-indigo-50 transition px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm"
              >
                Manage Pets
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/community')}
                className="bg-white/30 hover:bg-white/40 backdrop-blur-sm text-white transition px-5 py-2.5 rounded-xl text-sm font-bold border border-white/40"
              >
                Community
              </motion.button>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={item} className="h-full">
            <Card className="h-full flex flex-col justify-between border-0 shadow-soft-lg bg-gradient-to-br from-white to-primary-50/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">Total Pets</p>
                  <p className="text-4xl font-bold text-slate-900 mt-1">{pets.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center text-primary-600">
                  <PawPrint className="w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div>
                  <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">Tasks Done</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">{completedRemindersCount}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center text-emerald-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Reminders Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">
            <motion.div variants={item} className="flex items-center gap-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-600" />
                Upcoming Schedule
              </h3>
              <span className="text-xs font-bold text-primary-600 bg-primary-100 px-3 py-1.5 rounded-full">
                {upcomingReminders.length} Pending
              </span>
              <button
                onClick={() => setShowAddReminderModal(true)}
                className="ml-auto p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors shadow-sm"
                title="Add new reminder"
              >
                <Plus className="w-5 h-5" />
              </button>
            </motion.div>

            {upcomingReminders.length === 0 ? (
              <motion.div variants={item} className="p-12 bg-white rounded-3xl border border-dashed border-slate-200 text-center text-slate-400 shadow-soft">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-emerald-500/20" />
                <p className="font-medium mb-4">All caught up! No upcoming tasks.</p>
                <button
                  onClick={() => setShowAddReminderModal(true)}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                >
                  Schedule New Task
                </button>
              </motion.div>
            ) : (
              <motion.div variants={item} className="bg-white rounded-3xl border border-slate-100 shadow-soft-lg overflow-hidden">
                {upcomingReminders.map((reminder) => {
                  const pet = pets.find(p => p.id === reminder.petId);
                  const overdueStatus = isOverdue(reminder.date);

                  return (
                    <motion.div
                      key={reminder.id}
                      whileHover={{ backgroundColor: "rgba(255, 251, 245, 1)" }}
                      className="p-5 flex items-center justify-between border-b border-slate-50 last:border-0 group transition-colors"
                    >
                      <div className="flex items-center gap-5">
                        <button
                          onClick={() => toggleReminder(reminder.id)}
                          className="w-6 h-6 rounded-full border-2 border-slate-300 hover:border-primary-600 flex items-center justify-center text-white hover:bg-primary-600 transition-all"
                        >
                        </button>
                        <div>
                          <p className={`font-bold text-base ${overdueStatus ? 'text-rose-600' : 'text-slate-900'}`}>
                            {reminder.title}
                            {overdueStatus && <span className="ml-2 text-[10px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full uppercase tracking-wide">Overdue</span>}
                          </p>
                          <div className="flex items-center gap-3 text-xs font-medium text-slate-500 mt-1.5">
                            <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded-md">
                              <img src={pet?.imageUrl} alt="" className="w-4 h-4 rounded-full object-cover" />
                              <span>{pet?.name}</span>
                            </div>
                            <span className="text-slate-300">•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(reminder.date).toLocaleDateString()}
                            </span>
                            <span className="text-slate-300">•</span>
                            <StatusBadge type={reminder.type} />
                          </div>
                        </div>
                      </div>
                      <button className="text-slate-300 hover:text-primary-600 p-2 rounded-lg hover:bg-primary-50 transition opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* Activity Sidebar */}
          <div className="space-y-6">
            <motion.div variants={item} className="bg-white rounded-3xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Great Progress!</h3>
                  <p className="text-slate-500 text-sm">Keep it up!</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm font-medium">This Week</span>
                  <span className="font-bold text-xl text-slate-900">{completedRemindersCount}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((completedRemindersCount / (reminders.length || 1)) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-indigo-600 h-full rounded-full"
                  />
                </div>
              </div>
            </motion.div>

            {/* Quick Tips */}
            <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft">
              <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide text-primary-600">💡 Pet Care Tip</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {randomTip}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {showAddReminderModal && (
        <AddReminderModal onClose={() => setShowAddReminderModal(false)} />
      )}
    </>
  );
};

export default Dashboard;