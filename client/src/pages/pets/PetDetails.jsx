import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchPet } from "../../services/api";
import { SkeletonPetDetails } from "../../components/ui/Skeleton";
import { useFavorites } from "../../contexts/FavoritesContext";
import { useAuth } from "../../contexts/AuthContext";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { siteInfo } from "../../config/siteInfo";
import { shareContent } from "../../utils/helpers/share";
import { getImageUrlWithFallback } from "../../utils/helpers/imageUrl";

export default function PetDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toggleFavorite, isFavorite } = useFavorites();
    const [loading, setLoading] = useState(true);
    const [pet, setPet] = useState(null);
    const [error, setError] = useState("");

    useDocumentTitle(pet ? pet.name : "Pet Details");

    useEffect(() => {
        const loadPet = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await fetchPet(id);
                setPet(response.data.pet);
            } catch (err) {
                setError(err?.message || "Failed to load pet details");
                console.error("Error loading pet:", err);
            } finally {
                setLoading(false);
            }
        };
        loadPet();
    }, [id]);

    if (loading) {
        return <SkeletonPetDetails />;
    }

    if (error || !pet) {
        return (
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 max-w-7xl">
                <Breadcrumbs />
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <div className="text-6xl mb-4">🐾</div>
                    <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white mb-3">Pet not found</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                        {error || "The pet you're looking for doesn't exist or may have been adopted."}
                    </p>
                    <div className="mt-6">
                        <Link
                            to="/adopt"
                            className="inline-block px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition shadow-md hover:shadow-lg"
                        >
                            Back to listings
                        </Link>
                    </div>
                </div>
            </main>
        );
    }
    
    const petId = pet._id || pet.id || id;
    // Handle image URL - use utility function for consistent handling
    const imageUrl = getImageUrlWithFallback(pet.image, 'https://via.placeholder.com/600x400/e2e8f0/64748b?text=Pet+Image');

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 max-w-6xl">
            <Breadcrumbs customItems={{ [`/adopt/${petId}`]: pet?.name }} />
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 p-4 sm:p-6 md:p-8 lg:p-10">

                    {/* LEFT: IMAGE */}
                    <div className="space-y-4 sm:space-y-5">
                        <div className="w-full h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden shadow-md bg-slate-100 dark:bg-slate-800">
                            <img
                                src={imageUrl}
                                alt={pet.name}
                                className="w-full h-full object-cover"
                                crossOrigin="anonymous"
                                onError={(e) => {
                                    console.warn('Image load error for pet:', pet.name, 'URL:', imageUrl);
                                    e.target.src = 'https://via.placeholder.com/600x400/e2e8f0/64748b?text=Pet+Image';
                                }}
                            />
                        </div>
                    </div>

                    {/* RIGHT: DETAILS */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
                                {pet.name}
                            </h1>

                            <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
                                {pet.breed} • {pet.age} yrs • {pet.gender}
                            </p>

                            <div className="mt-4 sm:mt-6">
                                <h3 className="font-semibold text-base sm:text-lg text-slate-800 dark:text-white">About</h3>
                                <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {pet.description}
                                </p>
                            </div>

                            {/* INFO GRID */}
                            <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                                <div className="p-3 sm:p-4 rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                                    <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Location</span>
                                    <p className="font-medium text-sm sm:text-base text-slate-800 dark:text-white mt-1">{pet.location}</p>
                                </div>

                                <div className="p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                                    <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Type</span>
                                    <p className="font-medium text-xs sm:text-sm md:text-base text-slate-800 dark:text-white mt-0.5 sm:mt-1">{pet.type || "N/A"}</p>
                                </div>

                                <div className="p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                                    <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Age</span>
                                    <p className="font-medium text-xs sm:text-sm md:text-base text-slate-800 dark:text-white mt-0.5 sm:mt-1">{pet.age || "N/A"} {pet.age ? "Years" : ""}</p>
                                </div>

                                <div className="p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                                    <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Gender</span>
                                    <p className="font-medium text-xs sm:text-sm md:text-base text-slate-800 dark:text-white mt-0.5 sm:mt-1">{pet.gender || "N/A"}</p>
                                </div>
                            </div>

                            {/* BADGES */}
                            <div className="mt-4 sm:mt-6 flex flex-wrap gap-2">
                                <span className="px-2.5 sm:px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs sm:text-sm font-medium">Vaccinated</span>
                                {pet.neutered && (
                                    <span className="px-2.5 sm:px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 text-xs sm:text-sm font-medium">Neutered</span>
                                )}
                                {pet.microchipped && (
                                    <span className="px-2.5 sm:px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs sm:text-sm font-medium">Microchipped</span>
                                )}
                            </div>

                            {/* Health Records */}
                            <div className="mt-4 sm:mt-6">
                                <h3 className="font-semibold text-base sm:text-lg text-slate-800 dark:text-white mb-2 sm:mb-3">Health Records</h3>
                                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Vaccination Status</span>
                                        <span className="px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs font-medium">Up to Date</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Last Vet Visit</span>
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">2025-10-15</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Health Condition</span>
                                        <span className="px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs font-medium">Healthy</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Special Needs</span>
                                        <span className="text-sm text-slate-900 dark:text-white">{pet.specialNeeds || "None"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <button
                                onClick={() => {
                                    if (!user) {
                                        navigate("/login");
                                        return;
                                    }
                                    navigate(`/adopt/apply/${petId}`);
                                }}
                                className="flex-1 px-4 sm:px-5 py-2.5 sm:py-3 bg-amber-500 hover:bg-amber-600 text-white text-sm sm:text-base font-semibold rounded-xl shadow-sm transition active:scale-95"
                            >
                                Adopt This Rescued Pet
                            </button>

                            <div className="flex gap-2 sm:gap-3">
                                <button
                                    onClick={() => {
                                        if (!user) {
                                            navigate("/login");
                                            return;
                                        }
                                        toggleFavorite(petId);
                                    }}
                                    className={`flex-1 sm:flex-none px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl text-sm sm:text-base transition ${
                                        isFavorite(petId)
                                            ? "bg-red-50 border-red-300 text-red-600 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400"
                                            : "border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    }`}
                                    aria-label={isFavorite(petId) ? "Remove from favorites" : "Add to favorites"}
                                >
                                    <span className="hidden sm:inline">{isFavorite(petId) ? "❤️ Favorited" : "🤍 Favorite"}</span>
                                    <span className="sm:hidden">{isFavorite(petId) ? "❤️" : "🤍"}</span>
                                </button>

                                <button
                                    onClick={() => window.location.href = `tel:${siteInfo.contact.phone.replace(/\s/g, '')}`}
                                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-sm sm:text-base"
                                >
                                    <span className="hidden sm:inline">📞 Call</span>
                                    <span className="sm:hidden">📞</span>
                                </button>
                                
                                <button
                                    onClick={async () => {
                                        const result = await shareContent({
                                            title: `Adopt ${pet.name} - ${pet.breed}`,
                                            text: `Check out ${pet.name}, a ${pet.age}-year-old ${pet.breed} looking for a loving home!`,
                                            url: window.location.href,
                                        });
                                        if (result.success) {
                                            if (result.method === "clipboard") {
                                                // Show a temporary notification
                                                const notification = document.createElement("div");
                                                notification.className = "fixed top-20 right-2 sm:right-4 bg-green-500 text-white px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg shadow-lg z-50";
                                                notification.textContent = "Link copied!";
                                                document.body.appendChild(notification);
                                                setTimeout(() => {
                                                    notification.remove();
                                                }, 3000);
                                            }
                                        }
                                    }}
                                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-sm sm:text-base"
                                    title="Share this pet"
                                >
                                    <span className="hidden sm:inline">📤 Share</span>
                                    <span className="sm:hidden">📤</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}