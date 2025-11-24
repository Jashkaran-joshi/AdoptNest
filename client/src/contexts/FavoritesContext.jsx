import React, { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext();
const STORAGE_KEY = "adoptnest_favorites";

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error("Error loading favorites:", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
        } catch (error) {
            console.error("Error saving favorites:", error);
        }
    }, [favorites]);

    // Add a pet to favorites list
    const addFavorite = (petId) => {
        if (!favorites.includes(petId)) {
            setFavorites([...favorites, petId]);
        }
    };

    // Remove a pet from favorites list
    const removeFavorite = (petId) => {
        setFavorites(favorites.filter((id) => id !== petId));
    };

    // Toggle favorite status (add if not favorited, remove if favorited)
    const toggleFavorite = (petId) => {
        if (favorites.includes(petId)) {
            removeFavorite(petId);
        } else {
            addFavorite(petId);
        }
    };

    // Check if a pet is in favorites
    const isFavorite = (petId) => favorites.includes(petId);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext);

