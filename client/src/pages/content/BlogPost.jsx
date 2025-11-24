import React, { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchBlogPost, fetchBlogPosts } from "../../services/api";
import BlogCard from "../../components/ui/BlogCard";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { shareContent, shareToPlatform } from "../../utils/helpers/share";
import { getImageUrlWithFallback } from "../../utils/helpers/imageUrl";
import { scrollToTop } from "../../utils/scrollToTop";

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [shareFeedback, setShareFeedback] = useState("");
  const shareMenuRef = useRef(null);
  
  useDocumentTitle(post ? post.title : "Blog Post");

  useEffect(() => {
    const loadPost = async () => {
      // Decode URL-encoded slug (React Router preserves encoding, so we decode here)
      // Try-catch to handle cases where slug is already decoded
      let decodedSlug = slug;
      if (slug) {
        try {
          decodedSlug = decodeURIComponent(slug);
        } catch (e) {
          // If decode fails, slug might already be decoded, use as-is
          decodedSlug = slug;
        }
      } else {
        decodedSlug = null;
      }
      
      if (!decodedSlug || decodedSlug.trim() === '') {
        console.error("BlogPost: Invalid slug parameter:", slug);
        setError("Invalid blog post URL");
        setLoading(false);
        setNotFound(true);
        return;
      }

      try {
        setLoading(true);
        setError("");
        setNotFound(false);
        
        // Log the fetch attempt for debugging
        console.log("BlogPost: Fetching post with slug:", decodedSlug);
        
        const response = await fetchBlogPost(decodedSlug);
        
        // Check response structure
        if (!response || !response.data) {
          console.error("BlogPost: Invalid response structure:", response);
          throw new Error("Invalid response from server");
        }

        // Check for success response
        if (response.data.success && response.data.post) {
          const postData = response.data.post;
          
          // Defensive checks for required fields
          if (!postData.title) {
            console.error("BlogPost: Post missing title:", postData);
            setError("Post data is incomplete: missing title");
            setLoading(false);
            return;
          }
          
          if (!postData.content) {
            console.error("BlogPost: Post missing content:", postData);
            setError("Post data is incomplete: missing content");
            setLoading(false);
            return;
          }

          // Ensure slug exists for navigation
          if (!postData.slug) {
            console.warn("BlogPost: Post missing slug, using _id as fallback:", postData);
            postData.slug = postData._id || postData.id || decodedSlug;
          }

          console.log("BlogPost: Successfully loaded post:", postData.title);
          setPost(postData);
          
          // Fetch related posts only if category exists
          if (postData.category) {
            try {
              const relatedResponse = await fetchBlogPosts(`?published=true&category=${encodeURIComponent(postData.category)}`);
              if (relatedResponse.data && relatedResponse.data.posts) {
                const allPosts = relatedResponse.data.posts || [];
                const related = allPosts
                  .filter((p) => {
                    const postId = postData._id || postData.id;
                    const pId = p._id || p.id;
                    return pId !== postId && p.category === postData.category;
                  })
                  .slice(0, 3);
                setRelatedPosts(related);
              }
            } catch (relatedErr) {
              console.warn("BlogPost: Failed to load related posts:", relatedErr);
              // Don't fail the whole page if related posts fail
              setRelatedPosts([]);
            }
          }
        } else {
          // Response indicates failure
          console.error("BlogPost: Response indicates failure:", response.data);
          setNotFound(true);
          setError(response.data?.message || "Post not found");
        }
      } catch (err) {
        console.error("BlogPost: Error loading blog post:", {
          error: err,
          slug: decodedSlug,
          status: err?.response?.status,
          code: err?.response?.data?.code,
          message: err?.response?.data?.message || err?.message
        });
        
        // Check if it's a 404 error (axios throws errors for 4xx/5xx status codes)
        if (err?.response?.status === 404 || err?.response?.data?.code === 'NOT_FOUND' || err?.code === 'NOT_FOUND') {
          setNotFound(true);
          setError("Post not found");
        } else if (err?.response?.status === 400 || err?.response?.data?.code === 'INVALID_ID' || err?.response?.data?.code === 'INVALID_ID_FORMAT') {
          setNotFound(true);
          setError("Invalid blog post URL");
        } else {
          setError(err?.response?.data?.message || err?.message || "Failed to load post. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadPost();
  }, [slug]);

  // Scroll to top after post loads and component renders
  useEffect(() => {
    if (post && !loading) {
      // Use setTimeout to ensure DOM has updated
      setTimeout(() => {
        scrollToTop();
      }, 100);
    }
  }, [post, loading]);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShareMenuOpen(false);
      }
    };

    if (shareMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [shareMenuOpen]);

  const handleShare = async (platform = null) => {
    if (!post) return;
    
    const shareOptions = {
      title: post.title,
      text: post.excerpt || `Check out this article: ${post.title}`,
      url: window.location.href,
    };

    let result;
    if (platform) {
      result = shareToPlatform(platform, shareOptions);
    } else {
      result = await shareContent(shareOptions);
    }

    if (result.success) {
      if (result.method === "clipboard") {
        setShareFeedback("Link copied to clipboard!");
      } else if (result.platform) {
        setShareFeedback(`Opening ${result.platform}...`);
      } else {
        setShareFeedback("Shared successfully!");
      }
      setTimeout(() => setShareFeedback(""), 3000);
      setShareMenuOpen(false);
    } else {
      setShareFeedback("Failed to share. Please try again.");
      setTimeout(() => setShareFeedback(""), 3000);
    }
  };

  // Helper function to render content safely (handles both plain text and HTML)
  const renderContent = (content) => {
    if (!content || typeof content !== 'string') {
      return <p className="text-slate-500 dark:text-slate-400 italic">No content available.</p>;
    }

    // Check if content contains HTML tags
    const hasHTML = /<[a-z][\s\S]*>/i.test(content);
    
    if (hasHTML) {
      // If HTML detected, render it safely (sanitized by backend)
      // Split by paragraphs but preserve HTML structure
      const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim());
      return (
        <div className="space-y-4">
          {paragraphs.map((para, i) => (
            <div 
              key={i} 
              dangerouslySetInnerHTML={{ __html: para.trim() }}
              className="prose prose-slate dark:prose-invert max-w-none"
            />
          ))}
        </div>
      );
    } else {
      // Plain text: split by double newlines for paragraphs
      const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim());
      return (
        <div className="space-y-4">
          {paragraphs.map((para, i) => (
            <p key={i} className="leading-relaxed">{para.trim()}</p>
          ))}
        </div>
      );
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 max-w-7xl">
        <Breadcrumbs />
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mb-4"></div>
          <div className="text-slate-600 dark:text-slate-400">Loading post...</div>
        </div>
      </main>
    );
  }

  if (notFound || error || !post) {
    return (
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 max-w-7xl">
        <Breadcrumbs />
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white mb-3">
            {notFound ? "Post not found" : "Error loading post"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
            {error || "We couldn't find the article you're looking for. It may have been removed or the URL is incorrect."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              to="/blog" 
              className="inline-block px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition"
            >
              Back to blog
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="inline-block px-5 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Go back
            </button>
          </div>
        </div>
      </main>
    );
  }

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 max-w-7xl">
      <Breadcrumbs />
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main content */}
        <article className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="mb-4 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-3 flex-wrap">
            {post.category && (
              <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-semibold">
                {post.category}
              </span>
            )}
            <span>{formatDate(post.date || post.createdAt)}</span>
            <span>• {post.readTime || "5 min"}</span>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
            {post.title || "Untitled Post"}
          </h1>

          {post.author && (
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-medium text-slate-700 dark:text-slate-300">
                {post.author.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-medium text-slate-800 dark:text-white">{post.author}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Guest writer</div>
              </div>
            </div>
          )}

          {post.image && (
            <div className="w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden mb-6 bg-slate-100 dark:bg-slate-800">
              <img 
                src={getImageUrlWithFallback(post.image, 'https://via.placeholder.com/800x400/e2e8f0/64748b?text=Blog+Image')} 
                alt={post.title || "Blog post image"} 
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  e.target.src = 'https://via.placeholder.com/800x400/e2e8f0/64748b?text=Blog+Image';
                  e.target.onerror = null; // Prevent infinite loop
                }}
              />
            </div>
          )}

          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-200">
            {renderContent(post.content)}
          </div>

          {/* Footer CTA */}
          <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Enjoyed this article?</div>
              <div className="text-sm font-medium text-slate-900 dark:text-white">Share it with friends or check other guides.</div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative" ref={shareMenuRef}>
                <button 
                  onClick={() => setShareMenuOpen(!shareMenuOpen)}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium transition flex items-center gap-2"
                >
                  Share
                  <span className="text-xs">▼</span>
                </button>
                {shareMenuOpen && (
                  <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
                    <button
                      onClick={() => handleShare()}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      📱 Share via...
                    </button>
                    <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                    <button
                      onClick={() => handleShare("whatsapp")}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      💬 WhatsApp
                    </button>
                    <button
                      onClick={() => handleShare("facebook")}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      📘 Facebook
                    </button>
                    <button
                      onClick={() => handleShare("twitter")}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      🐦 Twitter
                    </button>
                    <button
                      onClick={() => handleShare("email")}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      📧 Email
                    </button>
                  </div>
                )}
                {shareFeedback && (
                  <div className="absolute bottom-full left-0 mb-2 px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg whitespace-nowrap z-50">
                    {shareFeedback}
                  </div>
                )}
              </div>
              <Link to="/blog" className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition">Back to Blog</Link>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-4 sm:space-y-6">
          {/* About Author */}
          {post.author && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg font-semibold text-slate-700">
                  {post.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">{post.author}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Contributor</div>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Passionate about pets and animal welfare.</p>
            </div>
          )}

          {/* Related Posts — text-only list (no images) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Related posts</h4>
            <div className="grid grid-cols-1 gap-3">
              {relatedPosts.length > 0 ? (
                relatedPosts.map((r) => {
                  const postSlug = r.slug || r._id || r.id;
                  if (!postSlug) return null;
                  const encodedSlug = encodeURIComponent(postSlug);
                  return (
                    <div key={r._id || r.id} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                      <Link 
                        to={`/blog/${encodedSlug}`} 
                        className="font-medium text-slate-900 dark:text-white hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                      >
                        {r.title || "Untitled"}
                      </Link>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {formatDate(r.date || r.createdAt)} • {r.readTime || "5 min"}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-sm text-slate-500 dark:text-slate-400">No related posts found.</div>
              )}
            </div>
          </div>

          {/* Tags or CTA */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Topics</h4>
            <div className="flex flex-wrap gap-2">
              {post.category && (
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm">{post.category}</span>
              )}
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm">Adoption</span>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm">Care</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Related grid at bottom */}
      {relatedPosts.length > 0 && (
        <section className="mt-10 md:mt-12">
          <h3 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white mb-6">You may also like</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {relatedPosts.map((r) => (
              <BlogCard key={r._id || r.id} post={r} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
