import React, { createContext, useState, useContext, useEffect } from "react";
import { login as apiLogin, signup as apiSignup, logout as apiLogout } from "../services/api";

const AuthContext = createContext();
const STORAGE_KEY = "adoptnest_user";

export const AuthProvider = ({ children }) => {
    // Load saved user from browser storage when app starts
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error("Error loading user from localStorage:", error);
            return null;
        }
    });

    // Save user to browser storage whenever it changes
    // This keeps the user logged in even after refreshing the page
    useEffect(() => {
        if (user) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            } catch (error) {
                console.error("Error saving user to localStorage:", error);
            }
        } else {
            try {
                localStorage.removeItem(STORAGE_KEY);
            } catch (error) {
                console.error("Error removing user from localStorage:", error);
            }
        }
    }, [user]);

    // Log in a user
    const login = async (email, password) => {
        const response = await apiLogin(email, password);
        const userData = {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            isAdmin: response.data.user.isAdmin || response.data.user.role === 'admin',
            token: response.data.token
        };
        setUser(userData);
        return userData;
    };

    // Create a new user account
    const signup = async (payload) => {
        const response = await apiSignup(payload);
        const userData = {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            isAdmin: response.data.user.isAdmin || response.data.user.role === 'admin',
            token: response.data.token
        };
        setUser(userData);
        return userData;
    };

    // Log out the current user
    const logout = async () => {
        try {
            await apiLogout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);