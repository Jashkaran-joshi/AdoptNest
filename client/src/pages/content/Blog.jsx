import React, { useMemo, useState, useEffect, useRef } from "react";
import BlogCard from "../../components/ui/BlogCard";
import { fetchBlogPosts } from "../../services/api";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { scrollToTop } from "../../utils/scrollToTop";

const PAGE_SIZE = 9;

export default function Blog() {
    useDocumentTitle("Blog");
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All");
    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                setLoading(true);
                const response = await fetchBlogPosts("?published=true");
                setPosts(response.data.posts || []);
            } catch (err) {
                console.error("Error loading blog posts:", err);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };
        loadPosts();
    }, []);

    const categories = useMemo(() => {
        const setCats = new Set(posts.map((p) => p.category));
        return ["All", ...Array.from(setCats)];
    }, [posts]);

    const filtered = useMemo(() => {
        let arr = posts;
        if (category !== "All") arr = arr.filter((p) => p.category === category);
        if (query.trim()) {
            const q = query.toLowerCase();
            arr = arr.filter(
                (p) =>
                    p.title.toLowerCase().includes(q) ||
                    (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
                    (p.author && p.author.toLowerCase().includes(q))
            );
        }
        return arr.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
    }, [query, category, posts]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const goTo = (n) => {
        const next = Math.min(Math.max(1, n), totalPages);
        setPage(next);
        scrollToTop();
    };

    // Track total count (before filtering)
    const totalPosts = posts.length;
    const hasFilters = category !== "All" || query.trim() !== "";

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 max-w-7xl">
            <Breadcrumbs />
            {/* Header */}
            <header className="mb-6 md:mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 leading-tight">
                        AdoptNest Rescue Blog
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400">
                        Tips, stories and guides for pet owners and adopters.
                    </p>
                </div>

                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none sm:w-64">
                        <input
                            value={query}
                            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                            placeholder="Search posts, authors or keywords"
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 pr-10 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-amber-300 outline-none transition"
                            aria-label="Search posts"
                        />
                        {query && (
                            <button
                                onClick={() => { setQuery(""); setPage(1); }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none"
                                aria-label="Clear search"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    <select
                        value={category}
                        onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-800 text-black dark:text-white focus:ring-2 focus:ring-amber-300 transition"
                        aria-label="Filter by category"
                    >
                        {categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </header>

            {/* Results Count */}
            {!loading && totalPosts > 0 && (
                <div className="mb-4 sm:mb-6 text-sm sm:text-base text-slate-600 dark:text-slate-400">
                    {hasFilters ? (
                        <span>
                            Showing <span className="font-semibold text-slate-900 dark:text-white">{filtered.length}</span> of{" "}
                            <span className="font-semibold text-slate-900 dark:text-white">{totalPosts}</span> post{totalPosts !== 1 ? 's' : ''}
                        </span>
                    ) : (
                        <span>
                            <span className="font-semibold text-slate-900 dark:text-white">{totalPosts}</span> post{totalPosts !== 1 ? 's' : ''} total
                        </span>
                    )}
                </div>
            )}

            {/* Posts grid */}
            <section>
                {loading ? (
                    <div className="col-span-full text-center text-slate-500 dark:text-slate-400 py-12">Loading posts...</div>
                ) : (
                    <>
                        {visible.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
                                {visible.map((post) => (
                                    <article key={post._id || post.id} className="transform hover:-translate-y-1 transition-shadow hover:shadow-lg">
                                        <BlogCard post={post} />
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="card p-12 text-center">
                                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto mb-4 flex items-center justify-center text-4xl">
                                    📝
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No posts found</h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6">
                                    {hasFilters 
                                        ? "No posts match your search or filter criteria. Try adjusting your filters."
                                        : "No blog posts available at this time."}
                                </p>
                                {hasFilters && (
                                    <button
                                        onClick={() => {
                                            setQuery("");
                                            setCategory("All");
                                            setPage(1);
                                        }}
                                        className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-200"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Pagination - Only show when there are multiple pages and items */}
                        {visible.length > 0 && totalPages > 1 && (
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
                )}
            </section>
        </main>
    );
}
