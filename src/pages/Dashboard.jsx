import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MoreHorizontal, PawPrint } from 'lucide-react';
import { StatusBadge } from '../components/Shared';
import { useData } from '../context/DataContext';

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const { pets, reminders, toggleReminder } = useData();

  const upcomingReminders = reminders.filter(r => !r.completed);
  const completedRemindersCount = reminders.filter(r => r.completed).length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Welcome Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-8 text-white shadow-xl shadow-brand-900/10 col-span-1 md:col-span-2 flex flex-col justify-between min-h-[200px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-400/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2 tracking-tight">Welcome back, {user.name.split(' ')[0]}! 👋</h2>
            <p className="text-brand-100 text-lg font-medium max-w-md">You have {upcomingReminders.length} upcoming tasks. Let's keep your companions happy and healthy.</p>
          </div>

          <div className="relative z-10 flex gap-3 mt-6">
            <button onClick={() => navigate('/pets')} className="bg-white text-brand-700 hover:bg-brand-50 transition px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm">Manage Pets</button>
            <button onClick={() => navigate('/community')} className="bg-brand-700/50 hover:bg-brand-700/70 text-white backdrop-blur-md transition px-5 py-2.5 rounded-xl text-sm font-bold">Community</button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-slate-500 font-medium text-sm uppercase tracking-wider">Total Pets</p>
              <p className="text-4xl font-bold text-slate-900 mt-1">{pets.length}</p>
            </div>
            <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600">
              <PawPrint className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-slate-50 pt-4">
            <div>
              <p className="text-slate-500 font-medium text-xs uppercase tracking-wider">Tasks Completed</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{completedRemindersCount}</p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Reminders Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-500" />
              Upcoming Schedule
            </h3>
            <span className="text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
              {upcomingReminders.length} Pending
            </span>
          </div>

          {upcomingReminders.length === 0 ? (
            <div className="p-12 bg-white rounded-3xl border border-dashed border-slate-200 text-center text-slate-400">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-emerald-500/20" />
              <p className="font-medium">All caught up! No upcoming tasks.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
              {upcomingReminders.map((reminder) => {
                const pet = pets.find(p => p.id === reminder.petId);
                const isOverdue = new Date(reminder.date).getTime() < Date.now();

                return (
                  <div key={reminder.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition border-b border-slate-50 last:border-0 group">
                    <div className="flex items-center gap-5">
                      <button
                        onClick={() => toggleReminder(reminder.id)}
                        className="w-6 h-6 rounded-full border-2 border-slate-300 hover:border-brand-500 flex items-center justify-center text-white hover:bg-brand-50 transition-all"
                      >
                      </button>
                      <div>
                        <p className={`font-bold text-base ${isOverdue ? 'text-rose-600' : 'text-slate-900'}`}>
                          {reminder.title}
                          {isOverdue && <span className="ml-2 text-[10px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full uppercase tracking-wide">Overdue</span>}
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
                    <button className="text-slate-300 hover:text-brand-600 p-2 rounded-lg hover:bg-brand-50 transition opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;