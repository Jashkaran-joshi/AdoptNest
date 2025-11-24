import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import NotificationBell from "../features/NotificationBell";
import { scrollToTop } from "../../utils/scrollToTop";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [moreMenuOpen, setMoreMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const moreMenuRef = useRef(null);
    const userMenuRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
                setMoreMenuOpen(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close drawer when clicking outside on mobile
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (open && !event.target.closest('.mobile-drawer') && !event.target.closest('.mobile-menu-button')) {
                setOpen(false);
            }
        };
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden'; // Prevent body scroll when drawer is open
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = '';
        };
    }, [open]);

    return (
        <>
            {/* Mobile: Backdrop Overlay */}
            {open && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
                    onClick={() => setOpen(false)}
                />
            )}

            <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-3.5 md:py-3 flex items-center justify-between max-w-7xl">
                    {/* Logo - Compact */}
                    <Link 
                        to="/" 
                        className="flex items-center gap-2 sm:gap-2.5 group" 
                        onClick={() => {
                            setOpen(false);
                            scrollToTop();
                        }}
                    >
                        <div className="w-10 h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-lg font-extrabold shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105 flex-shrink-0">
                            🐾
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="font-bold text-base md:text-lg text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                AdoptNest
                            </span>
                            <span className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 -mt-0.5 font-medium">
                                Rescuing hope, one pet at a time
                            </span>
                        </div>
                    </Link>

                {/* Desktop Nav - Primary Links */}
                <nav className="hidden md:flex items-center gap-0.5 ml-4 lg:ml-6">
                    {[
                        { path: "/", label: "Home" },
                        { path: "/adopt", label: "Adopt" },
                        { path: "/give", label: "Surrender" },
                        { path: "/blog", label: "Blog" },
                        { path: "/about", label: "About" },
                    ].map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => scrollToTop()}
                            className={({ isActive }) =>
                                `px-2.5 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20"
                                        : "text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                }`}
                        >
                            {item.label}
                        </NavLink>
                    ))}

                    {/* More Menu Dropdown */}
                    <div className="relative" ref={moreMenuRef}>
                        <button
                            onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                            className={`px-2.5 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all duration-200 ${
                                moreMenuOpen
                                    ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20"
                                    : "text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                        >
                            More
                            <span className="ml-0.5 inline-block text-[10px]">▼</span>
                        </button>
                        {moreMenuOpen && (
                            <div className="absolute top-full left-0 mt-1 w-44 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1.5 z-50">
                                <Link
                                    to="/book-service"
                                    onClick={() => {
                                        setMoreMenuOpen(false);
                                        scrollToTop();
                                    }}
                                    className="block px-3 py-1.5 text-xs md:text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                                >
                                    Book Service
                                </Link>
                                <Link
                                    to="/success-stories"
                                    onClick={() => {
                                        setMoreMenuOpen(false);
                                        scrollToTop();
                                    }}
                                    className="block px-3 py-1.5 text-xs md:text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                                >
                                    Success Stories
                                </Link>
                                <Link
                                    to="/donate"
                                    onClick={() => {
                                        setMoreMenuOpen(false);
                                        scrollToTop();
                                    }}
                                    className="block px-3 py-1.5 text-xs md:text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                                >
                                    Donate
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-1.5">
                    {user && <NotificationBell />}
                    {!user ? (
                        <>
                            <Link
                                to="/login"
                                onClick={() => scrollToTop()}
                                className="px-3 py-1.5 rounded-md text-xs md:text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                onClick={() => scrollToTop()}
                                className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md text-xs md:text-sm font-semibold shadow-md hover:shadow-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200"
                            >
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs md:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                            >
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-[10px] font-bold">
                                    {user?.name?.[0]?.toUpperCase() || "U"}
                                </div>
                                <span className="hidden lg:inline text-xs">{user?.name?.split(" ")[0] || "User"}</span>
                                <span className="text-[10px]">▼</span>
                            </button>
                            {userMenuOpen && (
                                <div className="absolute top-full right-0 mt-1 w-52 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1.5 z-50">
                                    <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700">
                                        <div className="text-xs md:text-sm font-semibold text-slate-900 dark:text-white">{user?.name || "User"}</div>
                                        <div className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || ""}</div>
                                    </div>
                                    <Link
                                        to="/favorites"
                                        onClick={() => {
                                            setUserMenuOpen(false);
                                            scrollToTop();
                                        }}
                                        className="flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                                    >
                                        <span className="text-sm">❤️</span>
                                        Favorites
                                    </Link>
                                    {!user.isAdmin ? (
                                        <Link
                                            to="/dashboard"
                                            onClick={() => {
                                                setUserMenuOpen(false);
                                                scrollToTop();
                                            }}
                                            className="flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                                        >
                                            <span className="text-sm">📊</span>
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <Link
                                            to="/admin"
                                            onClick={() => {
                                                setUserMenuOpen(false);
                                                scrollToTop();
                                            }}
                                            className="flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                                        >
                                            <span className="text-sm">⚙️</span>
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                                    <button
                                        onClick={() => {
                                            setUserMenuOpen(false);
                                            logout();
                                            navigate("/");
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                                    >
                                        <span className="text-sm">🚪</span>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                    {/* Mobile: Only Menu Button - Clean & Minimal */}
                    <button
                        className="mobile-menu-button md:hidden inline-flex items-center justify-center p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        onClick={() => setOpen(!open)}
                        aria-label="Toggle menu"
                    >
                        {open ? (
                            <svg className="w-5 h-5 text-slate-700 dark:text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-slate-700 dark:text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </header>

            {/* Mobile: Side Drawer Navigation */}
            <div
                className={`mobile-drawer fixed top-0 right-0 h-full w-72 max-w-[80vw] bg-white dark:bg-slate-900 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
                    open ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full overflow-y-auto">
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">Menu</h2>
                        <button
                            onClick={() => setOpen(false)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            aria-label="Close menu"
                        >
                            <svg className="w-4 h-4 text-slate-700 dark:text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* User Profile Section */}
                    {user && (
                        <div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-900/10">
                            <div className="flex items-center gap-2.5 mb-3">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-sm font-bold shadow-md flex-shrink-0">
                                    {user?.name?.[0]?.toUpperCase() || "U"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm text-slate-900 dark:text-white truncate">{user?.name || "User"}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || ""}</div>
                                </div>
                            </div>

                            {/* Notifications Section */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300">Notifications</h3>
                                    <NotificationBell />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Navigation */}
                    <nav className="flex-1 p-3 space-y-0.5">
                        <div className="mb-3">
                            <h3 className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 px-2">Main</h3>
                            {[
                                { path: "/", label: "Home", icon: "🏠" },
                                { path: "/adopt", label: "Adopt", icon: "🐾" },
                                { path: "/give", label: "Give Pet", icon: "💝" },
                                { path: "/blog", label: "Blog", icon: "📝" },
                                { path: "/about", label: "About", icon: "ℹ️" },
                            ].map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => {
                                        setOpen(false);
                                        scrollToTop();
                                    }}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 px-2.5 py-2 rounded-md text-xs md:text-sm font-medium transition-all duration-200 mb-0.5 ${
                                            isActive
                                                ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20"
                                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-600 dark:hover:text-amber-400"
                                        }`}
                                >
                                    <span className="text-base">{item.icon}</span>
                                    <span>{item.label}</span>
                                </NavLink>
                            ))}
                        </div>

                        <div className="mb-3">
                            <h3 className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 px-2">More</h3>
                            {[
                                { path: "/book-service", label: "Book Service", icon: "✂️" },
                                { path: "/success-stories", label: "Success Stories", icon: "⭐" },
                                { path: "/donate", label: "Donate", icon: "💰" },
                            ].map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => {
                                        setOpen(false);
                                        scrollToTop();
                                    }}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 px-2.5 py-2 rounded-md text-xs md:text-sm font-medium transition-all duration-200 mb-0.5 ${
                                            isActive
                                                ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20"
                                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-600 dark:hover:text-amber-400"
                                        }`}
                                >
                                    <span className="text-base">{item.icon}</span>
                                    <span>{item.label}</span>
                                </NavLink>
                            ))}
                        </div>

                        {/* User Actions */}
                        {user ? (
                            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                                <h3 className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 px-2">Account</h3>
                                <Link
                                    to="/favorites"
                                    onClick={() => {
                                        setOpen(false);
                                        scrollToTop();
                                    }}
                                    className="flex items-center gap-2 px-2.5 py-2 rounded-md text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all mb-0.5"
                                >
                                    <span className="text-base">❤️</span>
                                    <span>Favorites</span>
                                </Link>
                                {!user.isAdmin ? (
                                    <Link
                                        to="/dashboard"
                                        onClick={() => {
                                            setOpen(false);
                                            scrollToTop();
                                        }}
                                        className="flex items-center gap-2 px-2.5 py-2 rounded-md text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all mb-0.5"
                                    >
                                        <span className="text-base">📊</span>
                                        <span>Dashboard</span>
                                    </Link>
                                ) : (
                                    <Link
                                        to="/admin"
                                        onClick={() => {
                                            setOpen(false);
                                            scrollToTop();
                                        }}
                                        className="flex items-center gap-2 px-2.5 py-2 rounded-md text-xs md:text-sm font-medium text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all mb-0.5"
                                    >
                                        <span className="text-base">⚙️</span>
                                        <span>Admin Dashboard</span>
                                    </Link>
                                )}
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        logout();
                                        navigate("/");
                                    }}
                                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-xs md:text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all mt-1.5"
                                >
                                    <span className="text-base">🚪</span>
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
                                <Link
                                    to="/login"
                                    onClick={() => {
                                        setOpen(false);
                                        scrollToTop();
                                    }}
                                    className="block w-full px-3 py-2 rounded-md text-center text-xs md:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={() => {
                                        setOpen(false);
                                        scrollToTop();
                                    }}
                                    className="block w-full px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md text-center text-xs md:text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </>
    );
}
