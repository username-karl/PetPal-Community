import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isToday, isTomorrow, isPast, differenceInDays, startOfDay, format, addDays } from 'date-fns';
import {
    CheckCircle2,
    ListTodo,
    Pill,
    Calendar,
    PawPrint,
    AlertCircle,
    Clock,
    Plus,
    Bell,
    Users,
    Lightbulb,
    Heart,
    Droplets,
    Sun,
    RefreshCw,
    Syringe,
    Scissors,
    Stethoscope
} from 'lucide-react';
import { useData } from '../context/DataContext';
import ReminderDetailsModal from '../components/ReminderDetailsModal';
import AddReminderModal from '../components/AddReminderModal';

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
    const [selectedReminder, setSelectedReminder] = useState(null);
    const [showAddReminder, setShowAddReminder] = useState(false);
    const [tipIndex, setTipIndex] = useState(0);
    const [tipProgress, setTipProgress] = useState(0);

    // Generate context-aware tips based on pet data and reminders
    const smartTips = useMemo(() => {
        const tips = [];
        const now = new Date();
        const upcomingReminders = reminders.filter(r => !r.completed && new Date(r.date) >= now);
        const overdueReminders = reminders.filter(r => !r.completed && isPast(new Date(r.date)) && !isToday(new Date(r.date)));

        // Add overdue warning if any
        if (overdueReminders.length > 0) {
            const firstOverdue = overdueReminders[0];
            const pet = pets.find(p => p.id === firstOverdue.petId);
            tips.push({
                icon: AlertCircle,
                tip: `You have ${overdueReminders.length} overdue task${overdueReminders.length > 1 ? 's' : ''}! ${pet ? `Check ${pet.name}'s ${firstOverdue.type.toLowerCase()} reminder.` : ''}`,
                color: "text-red-400",
                priority: true
            });
        }

        // Check for today's reminders
        const todayReminders = upcomingReminders.filter(r => isToday(new Date(r.date)));
        if (todayReminders.length > 0) {
            tips.push({
                icon: Clock,
                tip: `You have ${todayReminders.length} task${todayReminders.length > 1 ? 's' : ''} scheduled for today. Stay on top of your pet care!`,
                color: "text-amber-400"
            });
        }

        // Check for tomorrow's reminders
        const tomorrowReminders = upcomingReminders.filter(r => isTomorrow(new Date(r.date)));
        if (tomorrowReminders.length > 0) {
            const types = [...new Set(tomorrowReminders.map(r => r.type))];
            tips.push({
                icon: Calendar,
                tip: `Tomorrow: ${types.join(', ')} coming up. Get prepared!`,
                color: "text-blue-400"
            });
        }

        // Check for upcoming vaccinations
        const vaccinations = upcomingReminders.filter(r => r.type === 'Vaccination');
        if (vaccinations.length > 0) {
            const nextVax = vaccinations[0];
            const pet = pets.find(p => p.id === nextVax.petId);
            const daysUntil = differenceInDays(new Date(nextVax.date), now);
            tips.push({
                icon: Syringe,
                tip: pet ? `${pet.name}'s vaccination is ${daysUntil <= 1 ? 'tomorrow' : `in ${daysUntil} days`}. Vaccines are crucial for pet health!` : `Vaccination coming up in ${daysUntil} days.`,
                color: "text-green-400"
            });
        }

        // Check for upcoming vet visits
        const vetVisits = upcomingReminders.filter(r => r.type === 'Vet Visit' || r.type === 'Medical');
        if (vetVisits.length > 0) {
            tips.push({
                icon: Stethoscope,
                tip: "Vet visit coming up! Write down any concerns or questions you want to discuss.",
                color: "text-red-400"
            });
        }

        // Check for grooming
        const grooming = upcomingReminders.filter(r => r.type === 'Grooming');
        if (grooming.length > 0) {
            tips.push({
                icon: Scissors,
                tip: "Grooming session scheduled! Regular grooming keeps your pet comfortable and healthy.",
                color: "text-purple-400"
            });
        }

        // Add general tips if no context-specific ones or to fill the array
        const generalTips = [
            { icon: Droplets, tip: "Keep fresh water available at all times for your pet.", color: "text-blue-400" },
            { icon: Heart, tip: "Regular vet checkups help catch health issues early.", color: "text-red-400" },
            { icon: Sun, tip: "Daily exercise keeps your pet healthy and happy.", color: "text-amber-400" },
            { icon: PawPrint, tip: "Maintain a consistent feeding schedule for better digestion.", color: "text-emerald-400" },
            { icon: Bell, tip: "Set reminders for vaccinations and medications.", color: "text-purple-400" },
            { icon: Heart, tip: "Regular grooming prevents skin issues and matting.", color: "text-pink-400" },
            { icon: Droplets, tip: "Clean your pet's food and water bowls daily to prevent bacteria.", color: "text-cyan-400" },
            { icon: Sun, tip: "Mental stimulation is just as important as physical exercise!", color: "text-yellow-400" },
        ];

        // Add general tips to ensure we always have content
        tips.push(...generalTips);

        return tips;
    }, [reminders, pets]);

    // Current tip to display
    const currentTip = smartTips[tipIndex % smartTips.length] || smartTips[0];
    const TipIcon = currentTip?.icon || Lightbulb;

    // Auto-rotate tips every 10 seconds with progress animation
    useEffect(() => {
        if (smartTips.length <= 1) return;

        // Progress animation - updates every 100ms for smooth animation
        const progressInterval = setInterval(() => {
            setTipProgress((prev) => {
                if (prev >= 100) {
                    setTipIndex((prevIndex) => (prevIndex + 1) % smartTips.length);
                    return 0;
                }
                return prev + 1; // 1% every 100ms = 10 seconds total
            });
        }, 100);

        return () => clearInterval(progressInterval);
    }, [smartTips.length]);

    // Manual refresh to next tip
    const refreshTip = () => {
        setTipIndex((prev) => (prev + 1) % smartTips.length);
        setTipProgress(0); // Reset progress on manual refresh
    };

    // High priority types
    const highPriorityTypes = ['Medical', 'Vaccination', 'Vet Visit', 'Medication'];

    // Helper to check if a reminder is overdue
    const isOverdue = (dateStr) => {
        const date = startOfDay(new Date(dateStr));
        return isPast(date) && !isToday(date);
    };

    // Priority reminders: high priority types OR overdue
    const priorityReminders = reminders
        .filter(r => !r.completed && (highPriorityTypes.includes(r.type) || isOverdue(r.date)))
        .sort((a, b) => {
            // Sort overdue first, then by date
            const aOverdue = isOverdue(a.date);
            const bOverdue = isOverdue(b.date);
            if (aOverdue && !bOverdue) return -1;
            if (!aOverdue && bOverdue) return 1;
            return new Date(a.date) - new Date(b.date);
        })
        .slice(0, 3);

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

            {/* Welcome Banner with Quick Actions */}
            <section>
                <div className="relative bg-slate-900 rounded-xl p-6 md:p-8 overflow-hidden shadow-lg shadow-slate-200">
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left: Welcome Text */}
                        <div className="lg:col-span-1">
                            <span className="inline-flex items-center rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300 mb-4 border border-slate-700">
                                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400"></span> Pet Care Dashboard
                            </span>
                            <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight mb-2">
                                Manage Your Pet's Life
                            </h3>
                            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                                Track reminders, health stats, and community tips.
                            </p>
                            <button
                                onClick={() => navigate('/pets')}
                                className="bg-white text-slate-900 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                            >
                                View My Pets <PawPrint className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Middle: Quick Actions - 2x2 Grid */}
                        <div className="lg:col-span-1">
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setShowAddReminder(true)}
                                    className="flex flex-col items-center gap-2 p-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded-xl transition-all group"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-amber-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Bell className="w-4 h-4 text-amber-400" />
                                    </div>
                                    <span className="text-[11px] font-medium text-amber-200">Add Reminder</span>
                                </button>
                                <button
                                    onClick={() => navigate('/pets')}
                                    className="flex flex-col items-center gap-2 p-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-xl transition-all group"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <PawPrint className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <span className="text-[11px] font-medium text-emerald-200">My Pets</span>
                                </button>
                                <button
                                    onClick={() => navigate('/reminders', { state: { viewMode: 'calendar' } })}
                                    className="flex flex-col items-center gap-2 p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl transition-all group"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Calendar className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <span className="text-[11px] font-medium text-blue-200">Calendar</span>
                                </button>
                                <button
                                    onClick={() => navigate('/reminders')}
                                    className="flex flex-col items-center gap-2 p-3 bg-slate-500/20 hover:bg-slate-500/30 border border-slate-500/30 rounded-xl transition-all group"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-slate-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <ListTodo className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <span className="text-[11px] font-medium text-slate-300">All Tasks</span>
                                </button>
                            </div>
                        </div>

                        {/* Right: Pet Care Tip */}
                        <div className="lg:col-span-1 flex flex-col">
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                <Lightbulb className="w-3.5 h-3.5" />
                                {currentTip?.priority ? 'Alert' : 'Smart Tip'}
                            </h4>
                            <div className={`border rounded-xl p-4 flex-1 flex flex-col justify-center transition-colors ${currentTip?.priority
                                ? 'bg-gradient-to-br from-red-500/15 to-orange-500/10 border-red-500/30'
                                : 'bg-gradient-to-br from-cyan-500/15 to-blue-500/10 border-cyan-500/20'
                                }`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${currentTip?.priority ? 'bg-red-500/20' : 'bg-cyan-500/20'
                                        }`}>
                                        <TipIcon className={`w-5 h-5 ${currentTip?.color || 'text-cyan-400'}`} />
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm leading-relaxed font-medium ${currentTip?.priority ? 'text-red-100' : 'text-cyan-100'
                                            }`}>
                                            {currentTip?.tip || 'Loading tips...'}
                                        </p>
                                    </div>
                                </div>
                                {/* Progress bar */}
                                <div className="mt-3 w-full bg-white/10 h-1 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-100 ease-linear ${currentTip?.priority ? 'bg-red-400' : 'bg-cyan-400'}`}
                                        style={{ width: `${tipProgress}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    {/* Dot indicators */}
                                    <div className="flex items-center gap-1.5">
                                        {smartTips.slice(0, Math.min(smartTips.length, 8)).map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setTipIndex(index);
                                                    setTipProgress(0);
                                                }}
                                                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === (tipIndex % smartTips.length)
                                                    ? (currentTip?.priority ? 'bg-red-400 scale-125' : 'bg-cyan-400 scale-125')
                                                    : 'bg-white/30 hover:bg-white/50'
                                                    }`}
                                                title={`Tip ${index + 1}`}
                                            />
                                        ))}
                                        {smartTips.length > 8 && (
                                            <span className="text-[10px] text-slate-400 ml-1">+{smartTips.length - 8}</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={refreshTip}
                                        className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
                                    >
                                        <RefreshCw className="w-3 h-3" /> Next
                                    </button>
                                </div>
                            </div>
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
                            {reminders.filter(r => !r.completed && (highPriorityTypes.includes(r.type) || isOverdue(r.date))).length} High Priority
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
                                <div key={reminder.id} onClick={() => setSelectedReminder(reminder)} className="flex items-center gap-4 p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer">
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
                                <div key={reminder.id} onClick={() => setSelectedReminder(reminder)} className="flex items-center gap-4 p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer">
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
                                    className="text-xs font-medium text-slate-500 hover:text-slate-900 px-3 py-1.5 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                                >
                                    View Details
                                </button>
                            </div>
                            <div className="mt-6 space-y-3">
                                {(() => {
                                    const petReminders = reminders.filter(r => r.petId === activePet.id && isToday(new Date(r.date)));
                                    const completed = petReminders.filter(r => r.completed).length;
                                    const total = petReminders.length;

                                    if (total === 0) {
                                        return (
                                            <div className="text-center py-4">
                                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                    <CheckCircle2 className="w-5 h-5 text-slate-400" />
                                                </div>
                                                <p className="text-sm text-slate-500">No tasks for today</p>
                                                <p className="text-xs text-slate-400 mt-1">Enjoy your day with {activePet.name}!</p>
                                            </div>
                                        );
                                    }

                                    const percentage = Math.round((completed / total) * 100);

                                    return (
                                        <div>
                                            <div className="flex justify-between text-xs font-medium text-slate-500 mb-1.5">
                                                <span>Task Completion (Today)</span>
                                                <span className="text-slate-900">{percentage}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-slate-900 h-full rounded-full transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-2 text-center">
                                                {completed}/{total} tasks done today
                                            </p>
                                        </div>
                                    );
                                })()}
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

            {/* Reminder Details Modal */}
            {selectedReminder && (
                <ReminderDetailsModal
                    reminder={selectedReminder}
                    onClose={() => setSelectedReminder(null)}
                />
            )}

            {/* Add Reminder Modal */}
            {showAddReminder && (
                <AddReminderModal onClose={() => setShowAddReminder(false)} />
            )}
        </div>
    );
};

export default Dashboard;
