import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNotifications } from "../../contexts/NotificationContext";

export default function NotificationBell() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [open, setOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Detect mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            // Close dropdown if switching to mobile
            if (window.innerWidth < 768) {
                setOpen(false);
            }
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        if (open && !isMobile) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, isMobile]);

    const unreadNotifications = notifications.filter((n) => !n.read).slice(0, 5);

    const getNotificationLink = (notification) => {
        if (notification.type === "adoption") return `/dashboard/view/request/${notification.relatedId}`;
        if (notification.type === "booking") return `/dashboard/view/booking/${notification.relatedId}`;
        if (notification.type === "surrender") return `/dashboard/view/given/${notification.relatedId}`;
        return "/dashboard";
    };

    const handleClick = () => {
        // On mobile, navigate to notifications page instead of showing dropdown
        if (isMobile) {
            navigate("/notifications");
        } else {
            // On desktop, toggle dropdown
            setOpen(!open);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleClick}
                className="relative p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300"
                aria-label="Notifications"
            >
                <span className="text-base md:text-lg">🔔</span>
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Desktop Dropdown - Hidden on mobile */}
            {open && (
                <div className="hidden md:flex absolute right-0 mt-1.5 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50 max-h-80 overflow-hidden flex-col">
                    <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-[10px] md:text-xs text-amber-500 hover:underline"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="overflow-y-auto flex-1">
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                                <div className="text-3xl mb-2">🔔</div>
                                <p className="text-xs md:text-sm">No notifications</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                                {unreadNotifications.map((notification) => (
                                    <Link
                                        key={notification.id}
                                        to={getNotificationLink(notification)}
                                        onClick={() => {
                                            markAsRead(notification.id);
                                            setOpen(false);
                                        }}
                                        className={`block p-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition ${
                                            !notification.read ? "bg-amber-50/50 dark:bg-amber-900/10" : ""
                                        }`}
                                    >
                                        <div className="flex items-start gap-2.5">
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-xs md:text-sm text-slate-900 dark:text-white">
                                                    {notification.title}
                                                </div>
                                                <div className="text-[10px] md:text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">
                                                    {notification.message}
                                                </div>
                                                <div className="text-[10px] text-slate-500 dark:text-slate-500 mt-1">
                                                    {new Date(notification.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            {!notification.read && (
                                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1 flex-shrink-0"></div>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="p-2.5 border-t border-slate-200 dark:border-slate-700 text-center">
                            <Link
                                to="/notifications"
                                onClick={() => setOpen(false)}
                                className="text-xs md:text-sm text-amber-500 hover:underline"
                            >
                                View all notifications
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

