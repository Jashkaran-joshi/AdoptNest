import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import { fetchStories } from "../../services/api";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { getImageUrlWithFallback } from "../../utils/helpers/imageUrl";
import { scrollToTop } from "../../utils/scrollToTop";
import { SkeletonList } from "../../components/ui/Skeleton";

const PAGE_SIZE = 12;

export default function SuccessStories() {
    useDocumentTitle("Success Stories");
    const [filter, setFilter] = useState("All");
    const [page, setPage] = useState(1);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const pageHeadingRef = useRef(null);

    useEffect(() => {
        const loadStories = async () => {
            try {
                setLoading(true);
                const response = await fetchStories("?published=true");
                setStories(response.data.stories || []);
            } catch (err) {
                console.error("Error loading success stories:", err);
                setStories([]);
            } finally {
                setLoading(false);
            }
        };
        loadStories();
    }, []);

    const filtered = filter === "All" 
        ? stories 
        : stories.filter((s) => s.petType === filter);

    const totalStories = stories.length;
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const goTo = (n) => {
        const next = Math.min(Math.max(1, n), totalPages);
        setPage(next);
        scrollToTop();
        // Focus heading after scroll for accessibility
        setTimeout(() => {
            pageHeadingRef.current?.focus();
        }, 500);
    };

    // Reset page when filter changes
    useEffect(() => {
        setPage(1);
    }, [filter]);

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 max-w-7xl">
            <Breadcrumbs />
            <div className="mb-6 md:mb-8 text-center">
                <h1 
                    ref={pageHeadingRef}
                    tabIndex={-1}
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 leading-tight outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
                >
                    Our Happy Endings
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-4">
                    Discover heartwarming tales of rescued pets finding their forever homes and the joy they bring.
                </p>
            </div>

            {/* Filter */}
            <div className="mb-6 md:mb-8 flex justify-center gap-2 sm:gap-3 flex-wrap px-4">
                {["All", "Dog", "Cat", "Rabbit", "Bird"].map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilter(type)}
                        aria-label={`Filter by ${type}`}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border text-sm sm:text-base transition ${
                            filter === type
                                ? "bg-amber-500 text-white border-amber-500 shadow-md"
                                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-slate-700"
                        }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Results Count */}
            {!loading && totalStories > 0 && (
                <div className="mb-4 sm:mb-6 text-sm sm:text-base text-slate-600 dark:text-slate-400 text-center">
                    {filter !== "All" ? (
                        <span>
                            Showing <span className="font-semibold text-slate-900 dark:text-white">{filtered.length}</span> of{" "}
                            <span className="font-semibold text-slate-900 dark:text-white">{totalStories}</span> stor{totalStories !== 1 ? 'ies' : 'y'}
                        </span>
                    ) : (
                        <span>
                            <span className="font-semibold text-slate-900 dark:text-white">{totalStories}</span> stor{totalStories !== 1 ? 'ies' : 'y'} total
                        </span>
                    )}
                </div>
            )}

            {/* Stories Grid */}
            {loading ? (
                <SkeletonList count={12} />
            ) : (
                <>
                    {visible.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
                                {visible.map((story) => {
                            const storyImageUrl = getImageUrlWithFallback(story.image, 'https://via.placeholder.com/400x300/e2e8f0/64748b?text=Story+Image');
                            return (
                            <div
                                key={story._id || story.id}
                                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                                    <div className="md:col-span-1 relative bg-slate-200 dark:bg-slate-700 min-h-[200px] md:min-h-0">
                                        <img
                                            src={storyImageUrl}
                                            alt={story.petName || "Success story"}
                                            className="w-full h-full object-cover min-h-[200px] md:h-full"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/400x300/e2e8f0/64748b?text=Story+Image';
                                            }}
                                        />
                                    </div>
                                    <div className="md:col-span-2 p-4 sm:p-5 md:p-6">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">{story.petName}</h3>
                                            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">({story.petType})</span>
                                        </div>
                                        <div className="flex items-center gap-2 sm:gap-4 mb-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 flex-wrap">
                                            <span>Adopted by {story.adopterName}</span>
                                            <span className="hidden sm:inline">•</span>
                                            <span>{story.adoptedDate ? new Date(story.adoptedDate).toLocaleDateString() : "N/A"}</span>
                                        </div>
                                        <div className="mb-3 text-sm sm:text-base">
                                            {"⭐".repeat(story.rating || 5)}
                                        </div>
                                        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-4">{story.story}</p>
                                    </div>
                                </div>
                            </div>
                            );
                        })}
                            </div>

                            {/* Pagination - Only show when there are multiple pages */}
                            {totalPages > 1 && (
                                <div className="mt-8 md:mt-10 flex items-center justify-center gap-3 md:gap-4">
                                    <button
                                        onClick={() => goTo(page - 1)}
                                        disabled={page === 1}
                                        aria-label="Go to previous page"
                                        className="px-4 md:px-5 py-2 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-amber-400 dark:hover:border-amber-500 font-semibold text-sm md:text-base transition-all duration-200 shadow-md hover:shadow-lg disabled:hover:shadow-md"
                                    >
                                        ← Prev
                                    </button>

                                    <div className="text-sm md:text-base text-slate-600 dark:text-slate-400">
                                        Page <span className="font-bold text-slate-900 dark:text-white">{page}</span> of{" "}
                                        <span className="font-bold text-slate-900 dark:text-white">{totalPages}</span>
                                    </div>

                                    <button
                                        onClick={() => goTo(page + 1)}
                                        disabled={page === totalPages}
                                        aria-label="Go to next page"
                                        className="px-4 md:px-5 py-2 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-amber-400 dark:hover:border-amber-500 font-semibold text-sm md:text-base transition-all duration-200 shadow-md hover:shadow-lg disabled:hover:shadow-md"
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="card p-12 text-center">
                            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto mb-4 flex items-center justify-center text-4xl">
                                🐾
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No success stories found</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                {filter !== "All" 
                                    ? `No success stories found for ${filter}s. Try selecting a different filter.`
                                    : "No success stories available at this time."}
                            </p>
                            {filter !== "All" && (
                                <button
                                    onClick={() => {
                                        setFilter("All");
                                        setPage(1);
                                    }}
                                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-200"
                                >
                                    Show All Stories
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* CTA */}
            <div className="mt-8 md:mt-12 text-center bg-amber-50 dark:bg-slate-800 rounded-xl p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2 sm:mb-3">Ready to Write Your Own Success Story?</h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 max-w-2xl mx-auto">
                    Browse our available rescued pets and find your perfect companion today.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/adopt"
                        className="px-5 sm:px-6 py-2.5 sm:py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition text-sm sm:text-base"
                    >
                        Browse Rescued Pets
                    </Link>
                    <Link
                        to="/about"
                        className="px-5 sm:px-6 py-2.5 sm:py-3 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition text-sm sm:text-base"
                    >
                        Learn More
                    </Link>
                </div>
            </div>
        </main>
    );
}

