import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function Signup() {
    useDocumentTitle("Sign Up");
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        city: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validate = () => {
        if (!form.name.trim()) return "Full name is required";
        if (!form.email.trim()) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(form.email)) return "Enter a valid email";
        if (!form.password) return "Password is required";
        if (form.password.length < 6) return "Password must be at least 6 characters";
        if (form.password !== form.confirmPassword) return "Passwords do not match";
        if (form.phone && !/^\+?\d{7,15}$/.test(form.phone)) return "Enter a valid phone number";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const v = validate();
        if (v) return setError(v);

        try {
            setLoading(true);
            const payload = {
                name: form.name.trim(),
                email: form.email.toLowerCase().trim(),
                password: form.password,
                phone: form.phone.trim(),
                city: form.city.trim(),
            };
            await signup(payload);
            navigate("/login");
        } catch (err) {
            setError(err?.message || "Failed to create account. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-[75vh] flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-4xl">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">

                    <div className="grid grid-cols-1 lg:grid-cols-2">

                        {/* LEFT FORM */}
                        <div className="p-6 md:p-7 lg:p-8">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create account</h1>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 mb-4">
                                Sign up to adopt pets and manage your profile.
                            </p>

                            {error && (
                                <div className="mb-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 p-3 rounded border border-red-300 dark:border-red-700">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-3">

                                {/* Name + Email */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="Full name"
                                        className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[15px] text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-300 outline-none"
                                    />

                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        placeholder="Email address"
                                        className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[15px] text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-300 outline-none"
                                    />
                                </div>

                                {/* Password + Confirm */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={form.password}
                                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                                            placeholder="Password"
                                            className="w-full px-4 pr-12 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[15px] text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-300 outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none transition-colors"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={form.confirmPassword}
                                            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                            placeholder="Confirm"
                                            className="w-full px-4 pr-12 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[15px] text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-300 outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none transition-colors"
                                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                        >
                                            {showConfirmPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Phone + City */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        placeholder="Phone (optional)"
                                        className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[15px] text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-300 outline-none"
                                    />

                                    <input
                                        value={form.city}
                                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                                        placeholder="City (optional)"
                                        className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[15px] text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-300 outline-none"
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-2.5 rounded-lg text-white text-[15px] font-medium shadow-sm
                  ${loading ? "bg-amber-300 opacity-70" : "bg-amber-500 hover:bg-amber-600 active:scale-95 transition"}`}
                                >
                                    {loading ? "Creating..." : "Create account"}
                                </button>

                            </form>

                            <p className="text-xs mt-3 text-slate-600 dark:text-slate-400">
                                Already have an account?{" "}
                                <Link to="/login" className="text-amber-500 hover:underline">Sign in</Link>
                            </p>
                        </div>

                        {/* RIGHT PANEL */}
                        <div className="hidden lg:flex items-center justify-center bg-amber-50 dark:bg-slate-800/40 p-6">
                            <div className="text-center">
                                <div className="w-28 h-28 rounded-full bg-amber-300 mx-auto mb-3 flex items-center justify-center text-4xl">🐾</div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Join AdoptNest Community</h3>
                                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2 max-w-xs">
                                    Save favorites, manage adoptions, and get faster approvals.
                                </p>
                                <Link
                                    to="/about"
                                    className="inline-block mt-3 text-sm px-4 py-1.5 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-100 transition"
                                >
                                    Learn more →
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
