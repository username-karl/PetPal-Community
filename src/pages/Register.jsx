import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

const Register = ({ onRegister }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        setIsLoading(true);
        // Simulate network delay for UX
        await new Promise(resolve => setTimeout(resolve, 800));
        await onRegister({
            name: formData.name,
            email: formData.email,
            password: formData.password
        });
        setIsLoading(false);
    };

    return (
        <div className="h-screen overflow-hidden flex bg-white text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
            {/* Left Panel - Brand & Visuals */}
            <div className="hidden lg:flex lg:w-5/12 bg-zinc-900 relative overflow-hidden flex-col justify-between p-12 text-white">
                {/* Brand */}
                <div className="flex items-center gap-3 z-10">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-zinc-900 shadow-lg shadow-white/10">
                        <PawPrint className="w-5 h-5" />
                    </div>
                    <span className="font-semibold tracking-tight text-xl">PetPal</span>
                </div>

                {/* Content */}
                <div className="z-10 relative">
                    <h1 className="text-4xl font-bold tracking-tight mb-6 leading-tight">
                        Join the community <br />
                        <span className="text-zinc-400">of pet lovers.</span>
                    </h1>
                    <p className="text-zinc-400 text-lg leading-relaxed max-w-sm">
                        Create an account to start tracking your pet's journey and connecting with others.
                    </p>

                    <div className="mt-12 space-y-4">
                        <div className="flex items-center gap-4 text-sm text-zinc-300">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            </div>
                            <span>Free health & activity tracking</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-zinc-300">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            </div>
                            <span>Access to expert advice</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-zinc-300">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            </div>
                            <span>Sync across all your devices</span>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="z-10 text-xs text-zinc-500">
                    © 2024 PetPal Inc. All rights reserved.
                </div>

                {/* Decorative Gradients */}
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-zinc-800/20 to-zinc-900/50 pointer-events-none"></div>
                <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -left-24 -top-24 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Right Panel - Register Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 bg-white relative">
                {/* Mobile Brand */}
                <div className="lg:hidden absolute top-8 left-8 flex items-center gap-2">
                    <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white">
                        <PawPrint className="w-4 h-4" />
                    </div>
                    <span className="font-semibold tracking-tight">PetPal</span>
                </div>

                <div className="w-full max-w-sm space-y-8">
                    <div className="space-y-2 text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Create account</h2>
                        <p className="text-zinc-500">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-zinc-900 hover:text-zinc-700 hover:underline transition-all">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500" htmlFor="name">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all placeholder:text-zinc-400 font-medium text-zinc-900"
                                    placeholder="e.g. Alex Smith"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500" htmlFor="email">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all placeholder:text-zinc-400 font-medium text-zinc-900"
                                    placeholder="name@example.com"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500" htmlFor="password">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all placeholder:text-zinc-400 font-medium text-zinc-900"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500" htmlFor="confirmPassword">
                                        Confirm
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all placeholder:text-zinc-400 font-medium text-zinc-900"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-zinc-900 text-white rounded-xl px-4 py-3.5 text-sm font-bold hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-zinc-900/10 flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-zinc-100" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-zinc-400 font-medium tracking-wider">Or register with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-zinc-200 rounded-xl hover:bg-zinc-50 hover:border-zinc-300 transition-all">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span className="text-sm font-semibold text-zinc-700">Google</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-zinc-200 rounded-xl hover:bg-zinc-50 hover:border-zinc-300 transition-all">
                            <svg className="w-5 h-5 text-zinc-900" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                            </svg>
                            <span className="text-sm font-semibold text-zinc-700">Facebook</span>
                        </button>
                    </div>
                </div>

                {/* Footer Links (Mobile only usually, or consistent bottom) */}
                <div className="absolute bottom-6 left-0 w-full text-center">
                    <p className="text-xs text-zinc-400">
                        By joining, you agree to our <a href="#" className="underline hover:text-zinc-600">Terms of Service</a> and <a href="#" className="underline hover:text-zinc-600">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
