import React from "react";
import { Link } from "react-router-dom";
import { useNotifications } from "../../contexts/NotificationContext";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function Notifications() {
    useDocumentTitle("Notifications");
    const { notifications, removeNotification, markAsRead, markAllAsRead, unreadCount } = useNotifications();

    const getNotificationLink = (notification) => {
        if (notification.type === "adoption") return `/dashboard/view/request/${notification.relatedId}`;
        if (notification.type === "booking") return `/dashboard/view/booking/${notification.relatedId}`;
        if (notification.type === "surrender") return `/dashboard/view/given/${notification.relatedId}`;
        return "/dashboard";
    };

    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            markAsRead(notification.id);
        }
    };

    const handleDelete = (e, notificationId) => {
        e.preventDefault();
        e.stopPropagation();
        removeNotification(notificationId);
    };

    // Sort notifications by date (newest first)
    const sortedNotifications = [...notifications].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return (
        <main className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-10 max-w-4xl">
            <Breadcrumbs />
            
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                            Notifications
                        </h1>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                            {notifications.length === 0
                                ? "You have no notifications."
                                : `You have ${notifications.length} notification${notifications.length !== 1 ? "s" : ""}${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}.`}
                        </p>
                    </div>
                    {notifications.length > 0 && unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="px-4 py-2 sm:py-2.5 bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 whitespace-nowrap"
                        >
                            Mark all read
                        </button>
                    )}
                </div>
            </div>

            {/* Notifications List */}
            {notifications.length === 0 ? (
                <div className="text-center py-12 sm:py-16 md:py-20">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-amber-100 dark:bg-amber-900/30 mx-auto mb-4 sm:mb-6 flex items-center justify-center text-4xl sm:text-5xl">
                        🔔
                    </div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2 sm:mb-3">
                        No notifications yet
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 max-w-md mx-auto">
                        When you receive updates about adoptions, bookings, or other activities, they'll appear here.
                    </p>
                    <Link
                        to="/dashboard"
                        className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            ) : (
                <div className="space-y-3 sm:space-y-4">
                    {sortedNotifications.map((notification) => (
                        <Link
                            key={notification.id}
                            to={getNotificationLink(notification)}
                            onClick={() => handleNotificationClick(notification)}
                            className={`block p-4 sm:p-5 rounded-lg sm:rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                                !notification.read
                                    ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 shadow-md"
                                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:border-amber-300 dark:hover:border-amber-700"
                            }`}
                        >
                            <div className="flex items-start gap-3 sm:gap-4">
                                {/* Notification Icon */}
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-lg sm:text-xl flex-shrink-0 ${
                                    !notification.read
                                        ? "bg-amber-500 text-white"
                                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                                }`}>
                                    {notification.type === "adoption" ? "🐾" : 
                                     notification.type === "booking" ? "✂️" : 
                                     notification.type === "surrender" ? "💝" : "🔔"}
                                </div>

                                {/* Notification Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 sm:gap-3 mb-1 sm:mb-2">
                                        <h3 className={`text-sm sm:text-base font-semibold text-slate-900 dark:text-white ${
                                            !notification.read ? "font-bold" : ""
                                        }`}>
                                            {notification.title}
                                        </h3>
                                        {!notification.read && (
                                            <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0 mt-1.5 sm:mt-2"></div>
                                        )}
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-2 sm:mb-3 leading-relaxed">
                                        {notification.message}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-500">
                                            {new Date(notification.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                </div>

                                {/* Delete Button */}
                                <button
                                    onClick={(e) => handleDelete(e, notification.id)}
                                    className="p-1.5 sm:p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 flex-shrink-0 mt-0.5"
                                    aria-label="Delete notification"
                                    title="Delete notification"
                                >
                                    <svg
                                        className="w-4 h-4 sm:w-5 sm:h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}

