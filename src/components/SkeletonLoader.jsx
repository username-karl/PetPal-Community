import React from 'react';

const SkeletonLoader = () => {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Header Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Welcome Card Skeleton */}
                <div className="col-span-1 md:col-span-2 bg-slate-200 rounded-3xl h-[220px]" />
                {/* Stats Card Skeleton */}
                <div className="bg-slate-200 rounded-3xl h-[220px]" />
            </div>

            {/* Reminders Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-5">
                    {/* Section Title */}
                    <div className="flex items-center gap-4">
                        <div className="h-6 bg-slate-200 rounded w-48" />
                        <div className="h-6 bg-slate-200 rounded-full w-24" />
                    </div>
                    {/* Reminders List */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-soft-lg p-5 space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-5">
                                <div className="w-6 h-6 bg-slate-200 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Progress Card */}
                    <div className="bg-white rounded-3xl p-6 shadow-md">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-slate-200 rounded w-32" />
                                <div className="h-3 bg-slate-200 rounded w-20" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="h-3 bg-slate-200 rounded w-full" />
                            <div className="h-2 bg-slate-200 rounded-full w-full" />
                        </div>
                    </div>
                    {/* Tips Card */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-100">
                        <div className="h-4 bg-slate-200 rounded w-24 mb-4" />
                        <div className="space-y-2">
                            <div className="h-3 bg-slate-200 rounded w-full" />
                            <div className="h-3 bg-slate-200 rounded w-full" />
                            <div className="h-3 bg-slate-200 rounded w-3/4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonLoader;
