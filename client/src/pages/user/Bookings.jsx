import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { fetchBookings } from "../../services/api";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function Bookings() {
    useDocumentTitle("My Bookings");
    const navigate = useNavigate();
    const { user } = useAuth();
    const [filter, setFilter] = useState("All"); // All, Pending, Confirmed, Cancelled
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBookings = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const response = await fetchBookings();
                setBookings(response.data.bookings || []);
            } catch (err) {
                console.error("Error loading bookings:", err);
            } finally {
                setLoading(false);
            }
        };
        loadBookings();
    }, [user]);

    const filteredBookings = bookings.filter((b) => {
        if (filter === "All") return true;
        return b.status === filter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "Confirmed":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
            case "Pending":
                return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
            case "Cancelled":
                return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
            default:
                return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
        }
    };

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 max-w-7xl">
            <Breadcrumbs />
            <div className="mb-4 sm:mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 leading-tight">
                        My Bookings
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400">
                        Manage your service bookings and appointments
                    </p>
                </div>
                <Link
                    to="/book-service"
                    className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap"
                >
                    + New Booking
                </Link>
            </div>

            {/* Filter Tabs */}
            {bookings.length > 0 && (
                <div className="mb-6 flex gap-2 border-b border-slate-200 dark:border-slate-700">
                {["All", "Pending", "Confirmed", "Cancelled"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 font-medium text-sm transition ${
                            filter === f
                                ? "border-b-2 border-amber-500 text-amber-600 dark:text-amber-400"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                    >
                        {f} ({bookings.filter((b) => f === "All" || b.status === f).length})
                    </button>
                ))}
                </div>
            )}

            {/* Bookings List */}
            {loading ? (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="text-slate-600 dark:text-slate-400">Loading bookings...</p>
                </div>
            ) : filteredBookings.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mx-auto mb-4 flex items-center justify-center text-2xl">
                        📅
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No bookings found</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        {filter === "All" ? "You haven't made any bookings yet." : `No ${filter.toLowerCase()} bookings.`}
                    </p>
                    <Link
                        to="/book-service"
                        className="inline-block px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition"
                    >
                        Book a Service
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredBookings.map((booking) => {
                        const bookingId = booking._id || booking.id;
                        return (
                            <div
                                key={bookingId}
                                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                                {booking.service}
                                            </h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <div className="text-slate-500 dark:text-slate-400">Pet</div>
                                                <div className="font-medium text-slate-900 dark:text-white">{booking.petId?.name || booking.petName || "Unknown Pet"}</div>
                                            </div>
                                            <div>
                                                <div className="text-slate-500 dark:text-slate-400">Date</div>
                                                <div className="font-medium text-slate-900 dark:text-white">{booking.date ? new Date(booking.date).toLocaleDateString() : "-"}</div>
                                            </div>
                                            <div>
                                                <div className="text-slate-500 dark:text-slate-400">Time</div>
                                                <div className="font-medium text-slate-900 dark:text-white">{booking.time || "-"}</div>
                                            </div>
                                            {(booking.service === "Boarding" || booking.service === "Daycare") && (
                                                <div>
                                                    <div className="text-slate-500 dark:text-slate-400">Duration</div>
                                                    <div className="font-medium text-slate-900 dark:text-white">
                                                        {booking.qty} {booking.qty === 1 ? "night" : "nights"}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {booking.notes && (
                                            <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                                                <strong>Notes:</strong> {booking.notes}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/dashboard/view/booking/${bookingId}`)}
                                            className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                                        >
                                            View
                                        </button>
                                        {booking.status !== "Cancelled" && (
                                            <button
                                                onClick={() => navigate("/book-service", { state: { booking } })}
                                                className="px-4 py-2 border border-amber-300 text-amber-600 dark:text-amber-400 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/30 transition"
                                            >
                                                Edit
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}

