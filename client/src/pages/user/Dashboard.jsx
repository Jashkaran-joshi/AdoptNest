import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNotifications } from "../../contexts/NotificationContext";
import { fetchAdoptions, fetchSurrenders, fetchBookings, fetchUserProfile, updateUserProfile, updateAdoptionStatus, cancelBooking } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { getImageUrlWithFallback } from "../../utils/helpers/imageUrl";

export default function Dashboard() {
    useDocumentTitle("Dashboard");
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const navigate = useNavigate();
    const [tab, setTab] = useState("requests");
    const [loading, setLoading] = useState(true);

    const [requests, setRequests] = useState([]);
    const [given, setGiven] = useState([]);
    const [bookings, setBookings] = useState([]);

    const [profile, setProfile] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: "",
        city: "",
    });
    const [savingProfile, setSavingProfile] = useState(false);

    // Fetch data on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [adoptionsRes, surrendersRes, bookingsRes, profileRes] = await Promise.all([
                    fetchAdoptions(),
                    fetchSurrenders(),
                    fetchBookings(),
                    fetchUserProfile()
                ]);

                setRequests(adoptionsRes.data.adoptions || []);
                setGiven(surrendersRes.data.surrenders || []);
                setBookings(bookingsRes.data.bookings || []);
                
                if (profileRes.data.user) {
                    setProfile({
                        name: profileRes.data.user.name || "",
                        email: profileRes.data.user.email || "",
                        phone: profileRes.data.user.phone || "",
                        city: profileRes.data.user.city || "",
                    });
                }
            } catch (err) {
                console.error("Error loading dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };
        if (user) {
            loadData();
        }
    }, [user]);

    const handleCancelRequest = async (id) => {
        if (!confirm("Cancel this adoption request?")) return;
        try {
            await updateAdoptionStatus(id, "Cancelled");
            setRequests((prev) => prev.map((r) => ((r._id || r.id) === id ? { ...r, status: "Cancelled" } : r)));
            addNotification({
                type: "adoption",
                title: "Adoption Request Cancelled",
                message: `Your adoption request has been cancelled.`,
                relatedId: id,
            });
        } catch (err) {
            console.error("Error cancelling request:", err);
            alert(err?.message || "Failed to cancel request");
        }
    };

    const handleRemoveGiven = async (id) => {
        if (!confirm("Remove this pet from your given list?")) return;
        // Note: Surrenders can't be deleted, only status updated
        try {
            // You might want to add a delete endpoint or just hide it
            setGiven((prev) => prev.filter((g) => (g._id || g.id) !== id));
        } catch (err) {
            console.error("Error removing surrender:", err);
        }
    };

    const handleCancelBooking = async (id) => {
        if (!confirm("Cancel this booking?")) return;
        try {
            await cancelBooking(id);
            setBookings((prev) => prev.map((b) => ((b._id || b.id) === id ? { ...b, status: "Cancelled" } : b)));
            addNotification({
                type: "booking",
                title: "Booking Cancelled",
                message: `Your booking has been cancelled.`,
                relatedId: id,
            });
        } catch (err) {
            console.error("Error cancelling booking:", err);
            alert(err?.message || "Failed to cancel booking");
        }
    };

    const handleProfileSave = async (e) => {
        e?.preventDefault();
        try {
            setSavingProfile(true);
            await updateUserProfile(profile);
            addNotification({
                type: "success",
                title: "Profile Updated",
                message: "Your profile has been updated successfully.",
            });
        } catch (err) {
            console.error("Error updating profile:", err);
            alert(err?.message || "Failed to update profile");
        } finally {
            setSavingProfile(false);
        }
    };

    const getStatusBadge = (status) => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold";
        if (status === "Approved" || status === "Confirmed") {
            return `${baseClasses} bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300`;
        } else if (status === "Pending") {
            return `${baseClasses} bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300`;
        } else {
            return `${baseClasses} bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300`;
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 max-w-7xl">
            {/* Header Section */}
            <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3">My Dashboard</h1>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
                    Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}! Manage your adoptions, bookings, and profile.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="card p-5 md:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Adoption Requests</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{requests.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">🐾</span>
                        </div>
                    </div>
                </div>
                <div className="card p-5 md:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-1 md:mb-2">Given Pets</p>
                            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">{given.length}</p>
                        </div>
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-xl md:text-2xl">💝</span>
                        </div>
                    </div>
                </div>
                <div className="card p-5 md:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-1 md:mb-2">Bookings</p>
                            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">{bookings.length}</p>
                        </div>
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-xl md:text-2xl">📅</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile: Horizontal Tab Navigation */}
            <div className="lg:hidden mb-4 sm:mb-6">
                <div className="card p-4">
                    {/* Compact User Profile - Mobile Only */}
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-base sm:text-lg font-bold text-white shadow-md flex-shrink-0">
                            {user?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm text-slate-900 dark:text-white truncate">{user?.name || "User"}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || "—"}</div>
                        </div>
                        {/* Quick Links - Mobile */}
                        <div className="flex items-center gap-2">
                            <Link
                                to="/favorites"
                                className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                                title="Favorites"
                            >
                                ❤️
                            </Link>
                            <Link
                                to="/bookings"
                                className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                                title="All Bookings"
                            >
                                📋
                            </Link>
                        </div>
                    </div>

                    {/* Responsive Grid Tabs - No Horizontal Scroll */}
                    <div className="grid grid-cols-4 gap-2 sm:gap-3">
                        {[
                            { id: "requests", label: "📋 Requests", icon: "📋" },
                            { id: "given", label: "💝 Given", icon: "💝" },
                            { id: "bookings", label: "📅 Bookings", icon: "📅" },
                            { id: "profile", label: "⚙️ Profile", icon: "⚙️" },
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id)}
                                className={`px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex flex-col items-center justify-center gap-1 ${
                                    tab === t.id
                                        ? "bg-amber-500 text-white shadow-md"
                                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                }`}
                            >
                                <span className="text-base sm:text-lg">{t.icon}</span>
                                <span className="truncate w-full text-center">{t.label.replace(t.icon + " ", "")}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {/* Desktop: Sidebar Navigation */}
                <aside className="hidden lg:block lg:col-span-1">
                    <div className="card p-5 md:p-6 sticky top-4">
                        {/* User Profile Card */}
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xl font-bold text-white shadow-md flex-shrink-0">
                                {user?.name?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-base text-slate-900 dark:text-white truncate">{user?.name || "User"}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || "—"}</div>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <nav className="space-y-1" aria-label="Dashboard navigation">
                            <button
                                onClick={() => setTab("requests")}
                                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                    tab === "requests"
                                        ? "bg-amber-500 text-white shadow-md"
                                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                }`}
                            >
                                📋 Adoption Requests
                            </button>
                            <button
                                onClick={() => setTab("given")}
                                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                    tab === "given"
                                        ? "bg-amber-500 text-white shadow-md"
                                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                }`}
                            >
                                💝 Given Pets
                            </button>
                            <button
                                onClick={() => setTab("bookings")}
                                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                    tab === "bookings"
                                        ? "bg-amber-500 text-white shadow-md"
                                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                }`}
                            >
                                📅 My Bookings
                            </button>
                            <button
                                onClick={() => setTab("profile")}
                                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                    tab === "profile"
                                        ? "bg-amber-500 text-white shadow-md"
                                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                }`}
                            >
                                ⚙️ Edit Profile
                            </button>
                        </nav>

                        {/* Quick Links */}
                        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-2">
                            <Link
                                to="/favorites"
                                className="block w-full text-left px-4 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                            >
                                ❤️ My Favorites
                            </Link>
                            <Link
                                to="/bookings"
                                className="block w-full text-left px-4 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                            >
                                📋 All Bookings
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <section className="lg:col-span-3">
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                        {/* Adoption Requests Tab */}
                        {tab === "requests" && (
                            <div className="p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">My Adoption Requests</h2>
                                    <Link
                                        to="/adopt"
                                        className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition shadow-sm text-center"
                                    >
                                        + New Request
                                    </Link>
                                </div>
                                {requests.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-4xl">🐾</span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 mb-4">No adoption requests yet.</p>
                                        <Link
                                            to="/adopt"
                                            className="inline-block px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition"
                                        >
                                            Browse Pets
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3 sm:space-y-4">
                                        {requests.map((r) => {
                                            const requestId = r._id || r.id;
                                            const petName = r.petId?.name || r.petName || "Unknown Pet";
                                            return (
                                            <div
                                                key={requestId}
                                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:shadow-md transition"
                                            >
                                                <div className="flex-1 mb-3 sm:mb-0 w-full sm:w-auto">
                                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                                                        <h3 className="font-semibold text-base sm:text-lg text-slate-900 dark:text-white">{petName}</h3>
                                                        <span className={getStatusBadge(r.status)}>{r.status}</span>
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Applied on {new Date(r.createdAt || r.appliedAt).toLocaleDateString()}</p>
                                                </div>
                                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                                    <button
                                                        onClick={() => navigate(`/dashboard/view/request/${requestId}`)}
                                                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                                                    >
                                                        View
                                                    </button>
                                                    {r.status === "Pending" && (
                                                        <button
                                                            onClick={() => handleCancelRequest(requestId)}
                                                            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800 text-xs sm:text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Given Pets Tab */}
                        {tab === "given" && (
                            <div className="p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">My Given Pets</h2>
                                {given.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-4xl">💝</span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 mb-4">You have not given any pets yet.</p>
                                        <Link
                                            to="/give"
                                            className="inline-block px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition"
                                        >
                                            Surrender a Pet
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3 sm:space-y-4">
                                        {given.map((g) => {
                                            const surrenderId = g._id || g.id;
                                            const imageUrl = getImageUrlWithFallback(g.image, 'https://via.placeholder.com/100x100/e2e8f0/64748b?text=User');
                                            return (
                                                <div
                                                    key={surrenderId}
                                                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:shadow-md transition"
                                                >
                                                    <img
                                                        src={imageUrl}
                                                        alt={g.name}
                                                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-sm flex-shrink-0"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/100x100/e2e8f0/64748b?text=User';
                                                        }}
                                                    />
                                                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                                            <h3 className="font-semibold text-base sm:text-lg text-slate-900 dark:text-white">{g.name}</h3>
                                                            <span className={getStatusBadge(g.status)}>{g.status}</span>
                                                        </div>
                                                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Given on {new Date(g.createdAt || g.givenAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="flex gap-2 w-full sm:w-auto">
                                                        <button
                                                            onClick={() => navigate(`/dashboard/view/given/${surrenderId}`)}
                                                            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={() => handleRemoveGiven(surrenderId)}
                                                            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800 text-xs sm:text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Bookings Tab */}
                        {tab === "bookings" && (
                            <div className="p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">My Bookings</h2>
                                    <Link
                                        to="/book-service"
                                        className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition shadow-sm text-center"
                                    >
                                        + New Booking
                                    </Link>
                                </div>
                                {bookings.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-4xl">📅</span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 mb-4">No bookings yet.</p>
                                        <Link
                                            to="/book-service"
                                            className="inline-block px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition"
                                        >
                                            Book a Service
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3 sm:space-y-4">
                                        {bookings.map((b) => {
                                            const bookingId = b._id || b.id;
                                            const petName = b.petId?.name || b.petName || "Unknown Pet";
                                            return (
                                            <div
                                                key={bookingId}
                                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:shadow-md transition"
                                            >
                                                <div className="flex-1 mb-3 sm:mb-0 w-full sm:w-auto">
                                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                                                        <h3 className="font-semibold text-base sm:text-lg text-slate-900 dark:text-white">
                                                            {b.service} — {petName}
                                                        </h3>
                                                        <span className={getStatusBadge(b.status)}>{b.status}</span>
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                                                        Date: {new Date(b.date).toLocaleDateString()} • Time: {b.time}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                                    <button
                                                        onClick={() => navigate(`/dashboard/view/booking/${bookingId}`)}
                                                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                                                    >
                                                        View
                                                    </button>
                                                    {b.status !== "Cancelled" && (
                                                        <button
                                                            onClick={() => handleCancelBooking(bookingId)}
                                                            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800 text-xs sm:text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Profile Tab */}
                        {tab === "profile" && (
                            <div className="p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">Edit Profile</h2>
                                <form onSubmit={handleProfileSave} className="space-y-4 sm:space-y-5 max-w-2xl">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={profile.name}
                                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            disabled
                                            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-not-allowed"
                                        />
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Email cannot be changed</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone</label>
                                            <input
                                                type="tel"
                                                value={profile.phone}
                                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                                                placeholder="8000260019"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">City</label>
                                            <input
                                                type="text"
                                                value={profile.city}
                                                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                                                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                                                placeholder="Enter your city"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                        <button
                                            type="submit"
                                            disabled={savingProfile}
                                            className={`w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base text-white font-medium transition shadow-sm ${
                                                savingProfile
                                                    ? "bg-amber-300 cursor-not-allowed"
                                                    : "bg-amber-500 hover:bg-amber-600 active:scale-95"
                                            }`}
                                        >
                                            {savingProfile ? "Saving..." : "Save Changes"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setProfile({ name: user?.name || "", email: user?.email || "", phone: "", city: "" })}
                                            className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm sm:text-base font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
