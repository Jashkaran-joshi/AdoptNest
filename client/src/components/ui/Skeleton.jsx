import React from "react";

export function SkeletonCard() {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow animate-pulse">
            <div className="w-full h-44 bg-slate-200 dark:bg-slate-700 rounded-t-lg"></div>
            <div className="p-4 space-y-3">
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
            </div>
        </div>
    );
}

export function SkeletonText({ lines = 3, className = "" }) {
    return (
        <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className={`h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse ${
                        i === lines - 1 ? "w-3/4" : "w-full"
                    }`}
                ></div>
            ))}
        </div>
    );
}

export function SkeletonPetDetails() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-6 md:p-10">
                    {/* Image Skeleton */}
                    <div className="space-y-5">
                        <div className="w-full h-96 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
                    </div>

                    {/* Details Skeleton */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2 animate-pulse"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 animate-pulse"></div>
                        </div>

                        <div className="space-y-2">
                            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4 animate-pulse"></div>
                            <SkeletonText lines={4} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="p-4 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2 animate-pulse"></div>
                                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 animate-pulse"></div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-20 animate-pulse"></div>
                            ))}
                        </div>

                        <div className="flex gap-4 mt-8">
                            <div className="flex-1 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
                            <div className="w-32 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function SkeletonList({ count = 6 }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}

export default SkeletonCard;

