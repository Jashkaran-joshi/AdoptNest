import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../../contexts/FavoritesContext";
import { fetchPets } from "../../services/api";
import PetCard from "../../components/ui/PetCard";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function Favorites() {
    useDocumentTitle("Favorites");
    const { favorites } = useFavorites();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPets = async () => {
            try {
                setLoading(true);
                const response = await fetchPets();
                setPets(response.data.pets || []);
            } catch (err) {
                console.error("Error loading pets:", err);
            } finally {
                setLoading(false);
            }
        };
        loadPets();
    }, []);

    const favoritePets = pets.filter((p) => favorites.includes(p._id || p.id));

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 max-w-7xl">
            <Breadcrumbs />
            <div className="mb-4 sm:mb-6 md:mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 leading-tight">
                    My Favorites
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400">
                    {favoritePets.length === 0
                        ? "You haven't saved any favorites yet."
                        : `${favoritePets.length} favorite pet${favoritePets.length !== 1 ? "s" : ""}`}
                </p>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <p className="text-slate-600 dark:text-slate-400">Loading favorites...</p>
                </div>
            ) : favoritePets.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-900/30 mx-auto mb-4 flex items-center justify-center text-4xl">
                        🤍
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No favorites yet</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        Start browsing pets and add them to your favorites!
                    </p>
                    <Link
                        to="/adopt"
                        className="inline-block px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition"
                    >
                        Browse Pets
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {favoritePets.map((pet) => {
                        const petId = pet._id || pet.id;
                        return (
                            <div key={petId} className="card-hover">
                                <PetCard pet={pet} />
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}

