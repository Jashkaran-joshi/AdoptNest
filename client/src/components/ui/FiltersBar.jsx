import React from "react";

export default function FiltersBar({ filters, setFilters }) {
    const petTypes = ["All", "Dog", "Cat", "Bird", "Rabbit"];
    const ages = ["Any", "Young", "Adult", "Senior"];

    const handleReset = () => {
        setFilters({ type: "All", age: "Any", search: "", location: "" });
    };

    const hasActiveFilters = filters.type !== "All" || filters.age !== "Any" || filters.search || filters.location;

    return (
        <div className="card p-4 sm:p-5 md:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
                <div>
                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                        <span className="text-lg sm:text-xl md:text-2xl">🔍</span>
                        Filter Pets
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                        Find your perfect companion
                    </p>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={handleReset}
                        className="w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        <span>🔄</span>
                        <span className="hidden sm:inline">Reset All</span>
                        <span className="sm:hidden">Reset</span>
                    </button>
                )}
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {/* Search */}
                <div className="space-y-1.5 sm:space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 sm:gap-2">
                        <span className="text-sm sm:text-base">🔎</span>
                        Search
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={filters.search || ""}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            placeholder="Search by name, breed..."
                            className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 dark:border-slate-700 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:border-amber-500 dark:focus:border-amber-400 transition-all duration-200 shadow-sm"
                        />
                        {filters.search && (
                            <button
                                onClick={() => setFilters({ ...filters, search: "" })}
                                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
                                aria-label="Clear search"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Type */}
                <div className="space-y-1.5 sm:space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 sm:gap-2">
                        <span className="text-sm sm:text-base">🐾</span>
                        Pet Type
                    </label>
                    <select
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                        className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 dark:border-slate-700 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:border-amber-500 dark:focus:border-amber-400 transition-all duration-200 shadow-sm appearance-none cursor-pointer"
                    >
                        {petTypes.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Age */}
                <div className="space-y-1.5 sm:space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 sm:gap-2">
                        <span className="text-sm sm:text-base">📅</span>
                        Age Group
                    </label>
                    <select
                        value={filters.age}
                        onChange={(e) => setFilters({ ...filters, age: e.target.value })}
                        className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 dark:border-slate-700 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:border-amber-500 dark:focus:border-amber-400 transition-all duration-200 shadow-sm appearance-none cursor-pointer"
                    >
                        {ages.map((a) => (
                            <option key={a} value={a}>
                                {a}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Location */}
                <div className="space-y-1.5 sm:space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 sm:gap-2">
                        <span className="text-sm sm:text-base">📍</span>
                        Location
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={filters.location || ""}
                            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                            placeholder="Enter city name"
                            className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 dark:border-slate-700 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:border-amber-500 dark:focus:border-amber-400 transition-all duration-200 shadow-sm"
                        />
                        {filters.location && (
                            <button
                                onClick={() => setFilters({ ...filters, location: "" })}
                                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
                                aria-label="Clear location"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Active Filters Badges */}
            {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-4 sm:pt-6 border-t-2 border-slate-200 dark:border-slate-700 mt-4 sm:mt-6 md:mt-8">
                    <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 w-full sm:w-auto">Active filters:</span>
                    {filters.type !== "All" && (
                        <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-semibold">
                            <span className="hidden sm:inline">Type: </span>{filters.type}
                            <button
                                onClick={() => setFilters({ ...filters, type: "All" })}
                                className="hover:text-amber-900 dark:hover:text-amber-100 transition-colors ml-1 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
                                aria-label="Remove type filter"
                            >
                                ✕
                            </button>
                        </span>
                    )}
                    {filters.age !== "Any" && (
                        <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-semibold">
                            <span className="hidden sm:inline">Age: </span>{filters.age}
                            <button
                                onClick={() => setFilters({ ...filters, age: "Any" })}
                                className="hover:text-amber-900 dark:hover:text-amber-100 transition-colors ml-1 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
                                aria-label="Remove age filter"
                            >
                                ✕
                            </button>
                        </span>
                    )}
                    {filters.search && (
                        <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-semibold">
                            <span className="hidden sm:inline">Search: </span>
                            <span className="max-w-[100px] sm:max-w-none truncate">"{filters.search}"</span>
                            <button
                                onClick={() => setFilters({ ...filters, search: "" })}
                                className="hover:text-amber-900 dark:hover:text-amber-100 transition-colors ml-1 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
                                aria-label="Remove search filter"
                            >
                                ✕
                            </button>
                        </span>
                    )}
                    {filters.location && (
                        <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-semibold">
                            <span className="hidden sm:inline">Location: </span>
                            <span className="max-w-[100px] sm:max-w-none truncate">{filters.location}</span>
                            <button
                                onClick={() => setFilters({ ...filters, location: "" })}
                                className="hover:text-amber-900 dark:hover:text-amber-100 transition-colors ml-1 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
                                aria-label="Remove location filter"
                            >
                                ✕
                            </button>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
