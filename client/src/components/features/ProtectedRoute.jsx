import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

/**
 * ProtectedRoute - Prevents unauthorized access to pages
 * 
 * How it works:
 * - If user is not logged in, redirect to login page
 * - If adminOnly is true and user is not admin, redirect to home
 * - Otherwise, show the protected content
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
    const { user } = useAuth();
    
    // Not logged in - go to login page
    if (!user) return <Navigate to="/login" replace />;
    
    // Admin-only page but user is not admin - go to home
    if (adminOnly && !user.isAdmin) return <Navigate to="/" replace />;
    
    // User is authorized - show the page
    return children;
}