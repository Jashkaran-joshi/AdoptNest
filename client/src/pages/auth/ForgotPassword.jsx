import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { forgotPassword } from "../../services/api";

export default function ForgotPassword() {
    useDocumentTitle("Forgot Password");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const validate = () => {
        if (!email.trim()) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(email)) return "Enter a valid email";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        const v = validate();
        if (v) return setError(v);

        try {
            setLoading(true);
            await forgotPassword(email);
            setSuccess(true);
            setEmail("");
        } catch (err) {
            setError(err?.message || "Failed to send reset email. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-[75vh] flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 md:p-8">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 mx-auto mb-4 flex items-center justify-center text-2xl">
                                🔑
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Forgot Password?
                            </h1>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 p-3 rounded border border-red-200 dark:border-red-700">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-4 text-sm text-green-600 bg-green-50 dark:bg-green-900/30 p-3 rounded border border-green-200 dark:border-green-700">
                                Password reset link has been sent to your email. Please check your inbox.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[15px] text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-300 outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || success}
                                className={`w-full py-2.5 rounded-lg text-white text-[15px] font-medium shadow-sm ${
                                    loading || success
                                        ? "bg-amber-300 opacity-70 cursor-not-allowed"
                                        : "bg-amber-500 hover:bg-amber-600 active:scale-95 transition"
                                }`}
                            >
                                {loading ? "Sending..." : success ? "Email Sent" : "Send Reset Link"}
                            </button>
                        </form>

                        <div className="mt-6 text-center space-y-2">
                            <Link
                                to="/login"
                                className="text-sm text-amber-500 hover:underline block"
                            >
                                ← Back to Login
                            </Link>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                Remember your password?{" "}
                                <Link to="/login" className="text-amber-500 hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

