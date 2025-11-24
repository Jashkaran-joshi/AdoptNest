import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function NotFound() {
    useDocumentTitle("Page Not Found");
    const navigate = useNavigate();

    return (
        <main className="container mx-auto min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 max-w-4xl">
            <div className="text-center max-w-2xl">
                <div className="mb-6">
                    <div className="text-8xl font-bold text-amber-500/20 dark:text-amber-400/10 mb-4">404</div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                        Page Not Found
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-5 py-2 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    >
                        Go Back
                    </button>
                    <Link
                        to="/"
                        className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition"
                    >
                        Go Home
                    </Link>
                </div>

                <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Browse</h3>
                        <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                            <li><Link to="/adopt" className="hover:text-amber-500">Adopt a Rescued Pet</Link></li>
                            <li><Link to="/blog" className="hover:text-amber-500">Blog</Link></li>
                            <li><Link to="/about" className="hover:text-amber-500">About Us</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Help</h3>
                        <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                            <li><Link to="/faq" className="hover:text-amber-500">FAQs</Link></li>
                            <li><Link to="/contact" className="hover:text-amber-500">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Account</h3>
                        <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                            <li><Link to="/login" className="hover:text-amber-500">Login</Link></li>
                            <li><Link to="/signup" className="hover:text-amber-500">Sign Up</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
}

