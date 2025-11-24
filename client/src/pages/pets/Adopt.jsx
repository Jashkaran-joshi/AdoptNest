import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PetCard from "../../components/ui/PetCard";
import FiltersBar from "../../components/ui/FiltersBar";
import { fetchPets } from "../../services/api";
import { SkeletonList } from "../../components/ui/Skeleton";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { scrollToTop } from "../../utils/scrollToTop";

const PAGE_SIZE = 12;

export default function Adopt() {
  useDocumentTitle("Adopt a Rescued Pet");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const pageHeadingRef = useRef(null);
  const startPetId = searchParams.get("start");
  
  const [filters, setFilters] = useState({ type: "All", age: "Any", search: "", location: "" });
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Get initial page from URL or default to 1
  useEffect(() => {
    const pageParam = searchParams.get("page");
    const pageNum = Math.max(1, parseInt(pageParam) || 1);
    setCurrentPage(pageNum);
  }, []);

  // Redirect to adoption form if start parameter exists
  useEffect(() => {
    if (startPetId) {
      navigate(`/adopt/apply/${startPetId}`);
    }
  }, [startPetId, navigate]);

  // Fetch pets from API
  useEffect(() => {
    const loadPets = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.type !== "All") params.append("type", filters.type);
        if (filters.age !== "Any") params.append("age", filters.age);
        if (filters.location) params.append("location", filters.location);
        if (filters.search) params.append("search", filters.search);
        params.append("page", currentPage);
        params.append("limit", PAGE_SIZE);
        
        const response = await fetchPets(params.toString() ? `?${params.toString()}` : "");
        const data = response.data;

        // Handle invalid page numbers - if requested page exceeds available pages
        const apiPages = Math.max(1, data.pages || 1);
        
        // If current page is invalid (greater than total pages), redirect to last valid page
        if (currentPage > apiPages && apiPages > 0) {
          const newParams = new URLSearchParams();
          // Preserve filters in URL
          if (filters.type !== "All") newParams.append("type", filters.type);
          if (filters.age !== "Any") newParams.append("age", filters.age);
          if (filters.location) newParams.append("location", filters.location);
          if (filters.search) newParams.append("search", filters.search);
          if (apiPages > 1) newParams.set("page", apiPages.toString());
          setSearchParams(newParams, { replace: true });
          setCurrentPage(apiPages);
          return; // Will re-fetch with correct page
        }

        setPets(data.pets || []);
        setTotalCount(data.total || 0);
        setTotalPages(apiPages);

        // Update URL with current page (only if not already set correctly)
        const urlPage = parseInt(searchParams.get("page") || "1");
        if (urlPage !== currentPage) {
          const newParams = new URLSearchParams();
          // Preserve filters in URL
          if (filters.type !== "All") newParams.append("type", filters.type);
          if (filters.age !== "Any") newParams.append("age", filters.age);
          if (filters.location) newParams.append("location", filters.location);
          if (filters.search) newParams.append("search", filters.search);
          if (currentPage > 1) newParams.set("page", currentPage.toString());
          setSearchParams(newParams, { replace: true });
        }

        // Scroll to top after data loads
        scrollToTop();
        
      } catch (err) {
        console.error("[Adopt] Error loading pets:", err);
        setPets([]);
        setTotalCount(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    
    if (!startPetId) {
      loadPets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.type, filters.age, filters.location, filters.search, currentPage, startPetId]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
    const newParams = new URLSearchParams();
    // Preserve filters in URL
    if (filters.type !== "All") newParams.append("type", filters.type);
    if (filters.age !== "Any") newParams.append("age", filters.age);
    if (filters.location) newParams.append("location", filters.location);
    if (filters.search) newParams.append("search", filters.search);
    // Don't include page=1 in URL
    setSearchParams(newParams, { replace: true });
  }, [filters.type, filters.age, filters.search, filters.location, setSearchParams]);

  // Focus heading after page navigation (accessibility)
  useEffect(() => {
    if (!loading && pageHeadingRef.current) {
      // Small delay to ensure smooth scroll completes
      const timer = setTimeout(() => {
        pageHeadingRef.current?.focus();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPage, loading]);

  const goTo = (targetPage) => {
    const validPage = Math.min(Math.max(1, targetPage), totalPages);
    
    if (validPage !== currentPage) {
      const newParams = new URLSearchParams(searchParams);
      if (validPage === 1) {
        newParams.delete("page");
      } else {
        newParams.set("page", validPage.toString());
      }
      setSearchParams(newParams, { replace: false }); // Use replace: false to allow browser back/forward
      setCurrentPage(validPage);
      
      // Scroll to top immediately
      scrollToTop();
    }
  };

  // Sync page state with URL when URL changes (browser back/forward)
  useEffect(() => {
    const pageParam = searchParams.get("page");
    const pageNum = Math.max(1, parseInt(pageParam) || 1);
    if (pageNum !== currentPage) {
      setCurrentPage(pageNum);
    }
  }, [searchParams]);

  // Edge case: Hide pagination when no items
  const shouldShowPagination = totalPages > 1 && pets.length > 0;

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 max-w-7xl">
      <Breadcrumbs />
      
      {/* Page Header */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h1 
          ref={pageHeadingRef}
          tabIndex={-1}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 leading-tight outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
        >
          Adopt a Rescued Pet
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
          Browse our rescued pets and give a homeless animal their forever home. Every adoption helps us save another life.
        </p>
      </div>

      {/* Filter Bar Container */}
      <div className="mb-6 md:mb-8">
        <FiltersBar filters={filters} setFilters={setFilters} />
      </div>

      {/* Results Count & Pagination Info */}
      {!loading && totalCount > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-white">{totalCount}</span> pet{totalCount !== 1 ? 's' : ''} available
            {totalPages > 1 && (
              <span className="ml-2">
                (Page <span className="font-bold text-slate-900 dark:text-white">{currentPage}</span> of{" "}
                <span className="font-bold text-slate-900 dark:text-white">{totalPages}</span>)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && <SkeletonList count={12} />}

      {/* No Results */}
      {!loading && pets.length === 0 && (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto mb-4 flex items-center justify-center text-4xl">
            🐾
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No pets found</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {totalCount === 0 
              ? "No pets match your selected filters. Try adjusting your search criteria."
              : `No pets found on page ${currentPage}. Try going back to page 1.`}
          </p>
          <button
            onClick={() => {
              setFilters({ type: "All", age: "Any", search: "", location: "" });
              goTo(1);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-200"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Pet Grid */}
      {!loading && pets.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {pets.map((p) => (
              <div key={p._id || p.id} className="card-hover">
                <PetCard pet={p} />
              </div>
            ))}
          </div>

          {/* Pagination - Only show when there are multiple pages and items */}
          {shouldShowPagination && (
            <div className="mt-8 md:mt-10 lg:mt-12 flex items-center justify-center gap-3 md:gap-4">
              <button
                onClick={() => goTo(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Go to previous page"
                className="px-4 md:px-5 py-2 md:py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-amber-400 dark:hover:border-amber-500 font-semibold text-sm md:text-base transition-all duration-200 shadow-md hover:shadow-lg disabled:hover:shadow-md disabled:hover:border-slate-300 dark:disabled:hover:border-slate-600"
              >
                ← Previous
              </button>

              <div className="flex items-center gap-2" role="navigation" aria-label="Pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => {
                  // Show first page, last page, current page, and pages around current
                  if (num === 1 || num === totalPages || (num >= currentPage - 1 && num <= currentPage + 1)) {
                    return (
                      <button
                        key={num}
                        onClick={() => goTo(num)}
                        aria-label={`Go to page ${num}`}
                        aria-current={currentPage === num ? "page" : undefined}
                        className={`w-9 h-9 md:w-10 md:h-10 rounded-xl font-semibold text-sm md:text-base transition-all duration-200 ${
                          currentPage === num
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg"
                            : "border-2 border-slate-300 dark:border-slate-600 bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:border-amber-400 dark:hover:border-amber-500 shadow-md hover:shadow-lg"
                        }`}
                      >
                        {num}
                      </button>
                    );
                  } else if (num === currentPage - 2 || num === currentPage + 2) {
                    return <span key={num} className="text-slate-400 text-sm md:text-base px-1">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => goTo(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Go to next page"
                className="px-4 md:px-5 py-2 md:py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-700 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-amber-400 dark:hover:border-amber-500 font-semibold text-sm md:text-base transition-all duration-200 shadow-md hover:shadow-lg disabled:hover:shadow-md disabled:hover:border-slate-300 dark:disabled:hover:border-slate-600"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
