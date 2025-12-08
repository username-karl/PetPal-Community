import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isToday, isTomorrow, isPast, differenceInDays, startOfDay, format } from 'date-fns';
import {
  CheckCircle2,
  ListTodo,
  Scale,
  Pill,
  Calendar,
  Edit2,
  PawPrint,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useData } from '../context/DataContext';

// Helper function to get due date info
const getDueDateInfo = (dateStr, completed = false) => {
  const date = startOfDay(new Date(dateStr));
  const today = startOfDay(new Date());
  const daysDiff = differenceInDays(date, today);

  if (completed) {
    return { label: format(date, 'MMM d'), bgColor: 'bg-slate-100', textColor: 'text-slate-400', borderColor: 'border-slate-200', icon: null };
  }
  if (isToday(date)) {
    return { label: 'Today', bgColor: 'bg-amber-50', textColor: 'text-amber-700', borderColor: 'border-amber-200', icon: null };
  }
  if (isTomorrow(date)) {
    return { label: 'Tomorrow', bgColor: 'bg-blue-50', textColor: 'text-blue-600', borderColor: 'border-blue-200', icon: null };
  }
  if (isPast(date)) {
    const daysOverdue = Math.abs(daysDiff);
    return { label: daysOverdue === 1 ? 'Yesterday' : `${daysOverdue}d overdue`, bgColor: 'bg-red-50', textColor: 'text-red-600', borderColor: 'border-red-200', icon: AlertCircle };
  }
  if (daysDiff <= 7) {
    return { label: `In ${daysDiff}d`, bgColor: 'bg-blue-50', textColor: 'text-blue-600', borderColor: 'border-blue-200', icon: null };
  }
  return { label: format(date, 'MMM d'), bgColor: 'bg-slate-50', textColor: 'text-slate-600', borderColor: 'border-slate-200', icon: null };
};

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const { pets, reminders, activePetId } = useData();
  // Get active pet from context, fallback to first pet
  const activePet = pets.find(p => p.id === activePetId) || (pets.length > 0 ? pets[0] : null);

  const priorityReminders = reminders
    .filter(r => !r.completed && r.type === 'Medical')
    .slice(0, 2);

  const upcomingReminders = reminders
    .filter(r => !r.completed)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 2);

  const completedCount = reminders.filter(r => r.completed).length;
  const pendingCount = reminders.filter(r => !r.completed).length;

  return (
    <div className="fade-in space-y-10">
      {/* Dashboard Header */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Today's Overview</h2>
        <p className="text-sm text-slate-500 mt-1">Welcome back, {user?.name.split(' ')[0]}. Here's what's happening with your pets.</p>
      </div>

      {/* Welcome Banner (Replaces Mock Event) */}
      <section>
        <div className="relative bg-slate-900 rounded-xl p-8 overflow-hidden group shadow-lg shadow-slate-200">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-lg">
              <span className="inline-flex items-center rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300 mb-4 border border-slate-700">
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400"></span> Pet Care Dashboard
              </span>
              <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-2">
                Manage Your Pet's Life
              </h3>
              <p className="text-slate-400 text-sm md:text-base mb-6 max-w-sm leading-relaxed">
                Track reminders, health stats, and community tips all in one place.
              </p>
              <button
                onClick={() => navigate('/pets')}
                className="bg-white text-slate-900 text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                View My Pets <PawPrint className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending Tasks</h4>
            <ListTodo className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-semibold text-slate-900 tracking-tight">{pendingCount}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
              {reminders.filter(r => !r.completed && r.type === 'Medical').length} High Priority
            </span>
          </div>
        </div>

        <div className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Completed</h4>
            <CheckCircle2 className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-semibold text-slate-900 tracking-tight">{completedCount}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">Total Tasks</span>
          </div>
        </div>

        <div className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Next Up</h4>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          {(() => {
            const nextReminder = reminders
              .filter(r => !r.completed && new Date(r.date) >= new Date().setHours(0, 0, 0, 0))
              .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

            return nextReminder ? (
              <>
                <p className="text-lg font-semibold text-slate-900 tracking-tight truncate" title={nextReminder.title}>
                  {nextReminder.title}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded truncate max-w-[150px] ${nextReminder.type === 'Medical' ? 'text-red-600 bg-red-50' : 'text-blue-600 bg-blue-50'
                    }`}>
                    {new Date(nextReminder.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {nextReminder.type}
                  </span>
                </div>
              </>
            ) : (
              <>
                <p className="text-xl font-semibold text-slate-400 tracking-tight">No tasks</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                    All caught up!
                  </span>
                </div>
              </>
            );
          })()}
        </div>
      </section>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Reminders List */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900">Priority Reminders</h3>
            <button
              onClick={() => navigate('/reminders')}
              className="text-xs font-medium text-slate-500 hover:text-slate-900"
            >
              View All
            </button>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {priorityReminders.length > 0 ? (
              priorityReminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center gap-4 p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="bg-amber-50 w-10 h-10 rounded-lg flex items-center justify-center text-amber-600 border border-amber-100">
                    <Pill className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-slate-900">{reminder.title}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-500">{reminder.type}</span>
                      {(() => {
                        const dueInfo = getDueDateInfo(reminder.date);
                        const IconComponent = dueInfo.icon;
                        return (
                          <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${dueInfo.bgColor} ${dueInfo.textColor} ${dueInfo.borderColor}`}>
                            {IconComponent && <IconComponent className="w-2.5 h-2.5" />}
                            <Clock className="w-2.5 h-2.5" />
                            {dueInfo.label}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-slate-200 hover:border-slate-900 hover:bg-slate-900 cursor-pointer transition-all"></div>
                </div>
              ))
            ) : upcomingReminders.length > 0 ? (
              upcomingReminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center gap-4 p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center text-blue-600 border border-blue-100">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-slate-900">{reminder.title}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-500">{reminder.type}</span>
                      {(() => {
                        const dueInfo = getDueDateInfo(reminder.date);
                        const IconComponent = dueInfo.icon;
                        return (
                          <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${dueInfo.bgColor} ${dueInfo.textColor} ${dueInfo.borderColor}`}>
                            {IconComponent && <IconComponent className="w-2.5 h-2.5" />}
                            <Clock className="w-2.5 h-2.5" />
                            {dueInfo.label}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 text-sm">
                No upcoming priority reminders.
              </div>
            )}
          </div>
        </div>

        {/* Pet Profile */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900">Active Pet</h3>
          </div>
          {activePet ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex gap-5 items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 ring-2 ring-slate-50">
                  <img src={activePet.imageUrl} alt={activePet.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-slate-900">{activePet.name}</h4>
                  <p className="text-sm text-slate-500">{activePet.breed || activePet.type} • {activePet.age} Yrs</p>
                </div>
                <button
                  onClick={() => navigate(`/pets/${activePet.id}`)}
                  className="p-2 hover:bg-slate-50 rounded-full border border-slate-200 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-6 space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-500 mb-1.5">
                    <span>Task Completion (Today)</span>
                    <span className="text-slate-900">
                      {(() => {
                        const petReminders = reminders.filter(r => r.petId === activePet.id && isToday(new Date(r.date)));
                        const completed = petReminders.filter(r => r.completed).length;
                        const total = petReminders.length;
                        return total > 0 ? Math.round((completed / total) * 100) : 0;
                      })()}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-slate-900 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(() => {
                          const petReminders = reminders.filter(r => r.petId === activePet.id && isToday(new Date(r.date)));
                          const completed = petReminders.filter(r => r.completed).length;
                          const total = petReminders.length;
                          return total > 0 ? (completed / total) * 100 : 0;
                        })()}%`
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 text-center">
                    {(() => {
                      const petReminders = reminders.filter(r => r.petId === activePet.id && isToday(new Date(r.date)));
                      const completed = petReminders.filter(r => r.completed).length;
                      return `${completed}/${petReminders.length} tasks done today`;
                    })()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
              <p className="text-slate-500 mb-4">No pets added yet.</p>
              <button
                onClick={() => navigate('/pets')}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Add your first pet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;