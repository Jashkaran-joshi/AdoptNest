import React from "react";

export default function Loading({ message = "Loading...", size = "md" }) {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
    };

    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className={`inline-block animate-spin rounded-full border-b-2 border-amber-500 ${sizeClasses[size]}`}></div>
            {message && <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{message}</p>}
        </div>
    );
}

