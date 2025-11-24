import React from "react";
import { Link } from "react-router-dom";
import { getImageUrlWithFallback } from "../../utils/helpers/imageUrl";

export default function BlogCard({ post }) {
    // Defensive check: ensure slug exists, fallback to _id or id
    const postSlug = post?.slug || post?._id || post?.id;
    if (!postSlug) {
        console.error("BlogCard: Post missing slug and id:", post);
        return null; // Don't render if no valid identifier
    }
    
    // URL encode the slug to handle special characters
    const encodedSlug = encodeURIComponent(postSlug);
    const imageUrl = getImageUrlWithFallback(post.image, 'https://via.placeholder.com/400x300/e2e8f0/64748b?text=Blog+Image');
    
    return (
        <article className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden border border-slate-200 dark:border-slate-700 hover:-translate-y-1">
            <Link to={`/blog/${encodedSlug}`} className="block relative overflow-hidden">
                <img
                    src={imageUrl}
                    alt={post.title}
                    className="w-full h-40 sm:h-48 md:h-56 object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                    crossOrigin="anonymous"
                    onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        console.warn('Image load error for blog post:', post.title, 'URL:', imageUrl);
                        e.target.src = 'https://via.placeholder.com/400x300/e2e8f0/64748b?text=Blog+Image';
                    }}
                />
            </Link>

            <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-1">
                {/* Category + Meta */}
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-2 sm:mb-3 flex-wrap">
                    <span className="px-2 sm:px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full font-semibold text-xs">
                        {post.category || "Care"}
                    </span>
                    <span>{post.date ? new Date(post.date).toLocaleDateString() : post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "N/A"}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{post.readTime || "5 min"}</span>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-slate-900 dark:text-white flex-grow mb-2 sm:mb-3">
                    <Link
                        to={`/blog/${encodedSlug}`}
                        className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors line-clamp-2"
                    >
                        {post.title}
                    </Link>
                </h3>

                {/* Excerpt */}
                {post.excerpt && (
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 flex-grow">
                        {post.excerpt}
                    </p>
                )}

                {/* Footer */}
                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pt-3 sm:pt-4 border-t border-slate-100 dark:border-slate-700">
                    <Link
                        to={`/blog/${encodedSlug}`}
                        className="text-amber-500 dark:text-amber-400 text-xs sm:text-sm font-medium hover:underline transition-colors"
                    >
                        Read more →
                    </Link>
                    {post.author && (
                        <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{post.author}</span>
                    )}
                </div>
            </div>
        </article>
    );
}