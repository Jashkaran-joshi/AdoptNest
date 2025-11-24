import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFavorites } from "../../contexts/FavoritesContext";
import { useAuth } from "../../contexts/AuthContext";
import { getImageUrlWithFallback } from "../../utils/helpers/imageUrl";

export default function PetCard({ pet }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toggleFavorite, isFavorite } = useFavorites();
    const petId = pet._id || pet.id;
    const favorited = isFavorite(petId);
    const [imageLoaded, setImageLoaded] = useState(false);
    
    // Handle image URL - use utility function for consistent handling
    const imageUrl = getImageUrlWithFallback(pet.image, 'https://via.placeholder.com/400x300/e2e8f0/64748b?text=Pet+Image');

    return (
        <div className="card overflow-hidden relative group transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/20 dark:hover:shadow-amber-500/10 hover:-translate-y-1">
            <button
                onClick={() => {
                    if (!user) {
                        navigate("/login");
                        return;
                    }
                    toggleFavorite(petId);
                }}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 z-10 p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
            >
                {favorited ? (
                    <span className="text-xl sm:text-2xl">❤️</span>
                ) : (
                    <span className="text-xl sm:text-2xl opacity-60 group-hover:opacity-100 transition-opacity">🤍</span>
                )}
            </button>
            
            <div className="relative w-full h-48 sm:h-56 md:h-64 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-t-lg sm:rounded-t-xl md:rounded-t-2xl overflow-hidden">
                {!imageLoaded && (
                    <div className="absolute inset-0 animate-pulse bg-slate-300 dark:bg-slate-600"></div>
                )}
                <img
                    src={imageUrl}
                    alt={pet.name}
                    loading="lazy"
                    crossOrigin="anonymous"
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                        console.warn('Image load error for pet:', pet.name, 'URL:', imageUrl);
                        // Use CORS-friendly placeholder
                        e.target.src = 'https://via.placeholder.com/400x300/e2e8f0/64748b?text=Pet+Image';
                        setImageLoaded(true);
                    }}
                    className={`w-full h-48 sm:h-56 md:h-64 object-cover transition-opacity duration-300 ${
                        imageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <div className="p-4 sm:p-5 md:p-6 space-y-2 sm:space-y-3 md:space-y-4">
                <div>
                    <h3 className="font-bold text-base sm:text-lg md:text-xl text-slate-900 dark:text-white mb-1 sm:mb-2 line-clamp-1">{pet.name}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium line-clamp-1">{pet.breed || "Mixed"} • {pet.age || "N/A"} {pet.age ? "yrs" : ""}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 pt-3 sm:pt-4 border-t-2 border-slate-200 dark:border-slate-700">
                    <Link 
                        to={`/adopt/${petId}`} 
                        className="px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border-2 border-amber-400 dark:border-amber-500 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 font-semibold text-xs sm:text-sm text-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                    >
                        View Details
                    </Link>
                    <span className="text-amber-600 dark:text-amber-400 font-bold text-xs sm:text-sm flex items-center justify-center sm:justify-start gap-1 truncate">
                        <span className="flex-shrink-0">📍</span>
                        <span className="truncate">{pet.location || "N/A"}</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
