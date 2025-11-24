import React from "react";
import { Link, useLocation } from "react-router-dom";

const routeLabels = {
    "/": "Home",
    "/adopt": "Adopt",
    "/give": "Surrender a Pet",
    "/blog": "Blog",
    "/about": "About",
    "/contact": "Contact",
    "/faq": "FAQ",
    "/dashboard": "Dashboard",
    "/admin": "Admin",
    "/favorites": "Favorites",
    "/bookings": "Bookings",
    "/success-stories": "Success Stories",
    "/volunteer": "Volunteer",
    "/donate": "Donate",
    "/book-service": "Book Service",
};

export default function Breadcrumbs({ customItems }) {
    const location = useLocation();
    const paths = location.pathname.split("/").filter(Boolean);

    const breadcrumbs = [
        { path: "/", label: "Home" },
    ];

    // Build breadcrumbs from path segments
    let currentPath = "";
    paths.forEach((segment) => {
        currentPath += `/${segment}`;
        
        // Check if there's a custom label for this path
        const label = customItems?.[currentPath] || routeLabels[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
        
        breadcrumbs.push({
            path: currentPath,
            label: label,
        });
    });

    // Remove duplicates (keep last occurrence)
    const uniqueBreadcrumbs = breadcrumbs.filter((item, index, self) => 
        index === self.findIndex((t) => t.path === item.path)
    );

    if (uniqueBreadcrumbs.length <= 1) {
        return null; // Don't show breadcrumbs on home page
    }

    return (
        <nav className="mb-4 sm:mb-5 md:mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 sm:gap-2.5 md:gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {uniqueBreadcrumbs.map((crumb, index) => {
                    const isLast = index === uniqueBreadcrumbs.length - 1;
                    return (
                        <li key={crumb.path} className="flex items-center">
                            {index > 0 && (
                                <span className="mx-2 text-slate-400 dark:text-slate-500">/</span>
                            )}
                            {isLast ? (
                                <span className="font-semibold text-slate-900 dark:text-white" aria-current="page">
                                    {crumb.label}
                                </span>
                            ) : (
                                <Link
                                    to={crumb.path}
                                    className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors duration-200"
                                >
                                    {crumb.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

