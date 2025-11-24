import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PetCard from "../../components/ui/PetCard";
import { fetchPets } from "../../services/api";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function Home() {
    useDocumentTitle("Home");
    const [query, setQuery] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [pets, setPets] = useState([]);

    // Fetch featured pets on mount
    useEffect(() => {
        const loadPets = async () => {
            try {
                const response = await fetchPets("?status=Available&limit=50");
                setPets(response.data.pets || []);
            } catch (err) {
                console.error("Error loading pets:", err);
            }
        };
        loadPets();
    }, []);

    const petTypes = useMemo(() => {
        const types = new Set(pets.map((p) => p.type));
        return ["All", ...Array.from(types)];
    }, [pets]);

    const filteredPets = useMemo(() => {
        return pets.filter((p) => {
            if (filterType !== "All" && p.type !== filterType) return false;
            if (!query) return true;
            const q = query.toLowerCase();
            return (
                p.name.toLowerCase().includes(q) ||
                (p.breed && p.breed.toLowerCase().includes(q)) ||
                (p.location && p.location.toLowerCase().includes(q))
            );
        });
    }, [query, filterType, pets]);

    const latest = filteredPets.slice(0, 6);

    const howItWorks = [
        { title: "Rescue & Rehabilitate", desc: "We rescue homeless and neglected pets, provide medical care, and prepare them for adoption." },
        { title: "Find Your Match", desc: "Browse our rescued pets and find the perfect companion for your family." },
        { title: "Adopt & Save Lives", desc: "Complete the adoption process and give a rescued pet their forever home. Your adoption helps us save another pet in need." },
    ];

    const testimonials = [
        {
            id: 1,
            name: "Anaya",
            text: "Adopting Mochi from AdoptNest was the best decision. Knowing we saved a rescued pet makes it even more special!",
        },
        {
            id: 2,
            name: "Rohit",
            text: "The team at AdoptNest truly cares about animal welfare. They rescued Luna from the streets and helped us give her a loving home.",
        },
    ];

    return (
        <main className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-10 space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-20 page-transition max-w-7xl w-full overflow-x-hidden">
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-amber-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col-reverse md:flex-row items-start md:items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 shadow-xl border border-slate-200/50 dark:border-slate-700/50 w-full">
                <div className="flex-1 min-w-0 space-y-4 sm:space-y-6 md:space-y-8">
                    <div className="space-y-3 md:space-y-4">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight">
                            Find your perfect{" "}
                            <span className="gradient-text">companion</span>
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                            AdoptNest is a nonprofit animal rescue organization dedicated to saving homeless and neglected pets. 
                            We provide shelter, medical care, and rehabilitation to animals in need, then connect them with loving forever homes. 
                            Every adoption helps us rescue another pet in need.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                        <Link
                            to="/adopt"
                            className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg sm:rounded-xl font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-center"
                        >
                            Adopt a Pet
                        </Link>

                        <Link
                            to="/give"
                            className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 border-2 border-slate-300 dark:border-slate-600 rounded-lg sm:rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-amber-400 dark:hover:border-amber-500 transition-all duration-200 font-semibold text-sm sm:text-base shadow-md hover:shadow-lg text-center"
                        >
                            Surrender a Pet
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 max-w-xl pt-2">
                        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-md hover:shadow-lg border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 card-hover">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-lg sm:text-xl md:text-2xl shadow-lg flex-shrink-0">
                                🐶
                            </div>
                            <div className="min-w-0">
                                <div className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white">300+ Rescued Pets</div>
                                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Awaiting their forever homes</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-md hover:shadow-lg border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 card-hover">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-lg sm:text-xl md:text-2xl shadow-lg flex-shrink-0">
                                ❤️
                            </div>
                            <div className="min-w-0">
                                <div className="text-sm sm:text-base md:text-lg font-bold text-slate-900 dark:text-white">Nonprofit Mission</div>
                                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">100% dedicated to animal welfare</div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Search and Filter Section - Appears below Nonprofit Mission card on mobile only */}
                    <div className="w-full md:hidden mt-4 sm:mt-5">
                        <div className="card p-4 sm:p-5 shadow-lg transition-all duration-300">
                            <div className="space-y-3 sm:space-y-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Search</label>
                                    <input
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Search by name, breed or city"
                                        className="w-full border-2 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:border-amber-500 dark:focus:border-amber-400 transition-all duration-200 shadow-sm"
                                        aria-label="Search pets"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Filter by type</label>
                                    <select
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                        className="w-full border-2 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-sm sm:text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:border-amber-500 dark:focus:border-amber-400 transition-all duration-200 shadow-sm appearance-none cursor-pointer"
                                        aria-label="Filter pets by type"
                                    >
                                        {petTypes.map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="pt-2 sm:pt-3 border-t border-slate-200 dark:border-slate-700">
                                    <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                                        <span className="font-bold text-slate-900 dark:text-white">{filteredPets.length}</span> pets found
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Search and Filter Section - Hidden on mobile, shown on md and above */}
                <aside className="hidden md:block w-full md:w-80 lg:w-96 flex-shrink-0">
                    <div className="card p-4 sm:p-5 md:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="space-y-3 sm:space-y-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Search</label>
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search by name, breed or city"
                                    className="w-full border-2 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:border-amber-500 dark:focus:border-amber-400 transition-all duration-200 shadow-sm"
                                    aria-label="Search pets"
                                />
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-2">Filter by type</label>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="w-full border-2 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-sm sm:text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:border-amber-500 dark:focus:border-amber-400 transition-all duration-200 shadow-sm appearance-none cursor-pointer"
                                    aria-label="Filter pets by type"
                                >
                                    {petTypes.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="pt-2 sm:pt-3 border-t border-slate-200 dark:border-slate-700">
                                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                                    <span className="font-bold text-slate-900 dark:text-white">{filteredPets.length}</span> pets found
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </section>

            {/* Categories */}
            <section>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6 md:mb-8">Browse by Category</h2>
                <div className="flex gap-3 md:gap-4 flex-wrap">
                    {petTypes.slice(0, 6).map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-5 py-2.5 rounded-xl font-semibold text-sm md:text-base transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg ${
                                filterType === type
                                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg"
                                    : "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500"
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </section>

            {/* Latest Pets */}
            <section>
                <div className="flex items-center justify-between mb-6 md:mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Latest Pets</h2>
                    <Link 
                        to="/adopt" 
                        className="text-amber-600 dark:text-amber-400 font-semibold text-sm md:text-base hover:text-amber-700 dark:hover:text-amber-300 transition-colors flex items-center gap-2 group"
                    >
                        See all
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {latest.length ? (
                        latest.map((p) => (
                            <div key={p._id || p.id} className="card-hover">
                                <PetCard pet={p} />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-slate-500 dark:text-slate-400 py-16 text-lg">
                            No pets match your search.
                        </div>
                    )}
                </div>
            </section>

            {/* How it works */}
            <section className="card p-6 md:p-8 lg:p-10 xl:p-12">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-6 md:mb-8 lg:mb-10">Our Rescue & Adoption Process</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {howItWorks.map((step, i) => (
                        <div key={i} className="p-6 md:p-8 rounded-2xl border-2 border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 card-hover">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-lg md:text-xl font-bold text-white shadow-lg mb-4 md:mb-6">
                                {i + 1}
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3">{step.title}</h3>
                            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section>
                <div className="flex items-center justify-between mb-6 md:mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Success stories</h2>
                    <Link 
                        to="/success-stories" 
                        className="text-amber-600 dark:text-amber-400 font-semibold text-sm md:text-base hover:text-amber-700 dark:hover:text-amber-300 transition-colors flex items-center gap-2 group"
                    >
                        View all stories
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {testimonials.map((t) => (
                        <div key={t.id} className="card p-6 md:p-8 hover:shadow-xl transition-all duration-300">
                            <p className="text-slate-700 dark:text-slate-200 text-base md:text-lg leading-relaxed mb-4 md:mb-6">"{t.text}"</p>
                            <div className="text-sm md:text-base font-bold text-slate-900 dark:text-white">— {t.name}</div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
