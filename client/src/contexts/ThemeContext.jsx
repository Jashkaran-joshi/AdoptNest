import React, { createContext, useState, useEffect } from "react";

const ThemeContext = createContext();

// Get the user's system theme preference (dark or light mode)
const getSystemTheme = () => {
    if (typeof window !== "undefined" && window.matchMedia) {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
};

// Apply the theme class to the HTML document
// This tells Tailwind CSS which color scheme to use
const applyTheme = (theme) => {
    if (typeof document !== "undefined") {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }
};

// Set initial theme before React renders to prevent flash of wrong theme
const initialTheme = getSystemTheme();
applyTheme(initialTheme);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(initialTheme);

    // Listen for system theme changes (when user changes OS theme)
    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        
        // Update theme when system preference changes
        const handleThemeChange = (e) => {
            const newTheme = e.matches ? "dark" : "light";
            setTheme(newTheme);
            applyTheme(newTheme);
        };

        // Set initial theme
        handleThemeChange(mediaQuery);

        // Listen for system theme changes
        mediaQuery.addEventListener("change", handleThemeChange);

        // Cleanup: remove listener when component unmounts
        return () => {
            mediaQuery.removeEventListener("change", handleThemeChange);
        };
    }, []);

    // Apply theme whenever state changes
    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme }}>
            {children}
        </ThemeContext.Provider>
    );
};
