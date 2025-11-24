import React from "react";
import { Link } from "react-router-dom";

/**
 * ErrorBoundary - Catches JavaScript errors in child components
 * 
 * How it works:
 * - If any component throws an error, this catches it
 * - Shows a friendly error message instead of crashing the whole app
 * - In development mode, shows error details for debugging
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    // React calls this when a child component throws an error
    static getDerivedStateFromError() {
        return { hasError: true };
    }

    // React calls this to log error details
    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
        this.setState({
            error,
            errorInfo,
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-slate-50 dark:bg-slate-900">
                    <div className="max-w-2xl w-full text-center">
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-sm">
                            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-4 flex items-center justify-center text-4xl">
                                ⚠️
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                Something went wrong
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
                            </p>

                            {import.meta.env.DEV && this.state.error && (
                                <details className="mb-6 text-left bg-slate-50 dark:bg-slate-900 p-4 rounded border border-slate-200 dark:border-slate-700">
                                    <summary className="cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Error Details (Development Only)
                                    </summary>
                                    <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto">
                                        {this.state.error.toString()}
                                        {this.state.errorInfo?.componentStack}
                                    </pre>
                                </details>
                            )}

                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition"
                                >
                                    Refresh Page
                                </button>
                                <Link
                                    to="/"
                                    className="px-5 py-2 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                                >
                                    Go Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

