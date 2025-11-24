import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import { sanitizeInput, sanitizeEmail, sanitizeObject } from "../../utils/helpers/sanitize";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { createVolunteer } from "../../services/api";

export default function Volunteer() {
    useDocumentTitle("Volunteer & Foster");
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        city: "",
        type: "volunteer", // volunteer, foster
        availability: "",
        experience: "",
        why: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const validate = () => {
        const sanitizedName = sanitizeInput(form.name);
        const sanitizedEmail = sanitizeEmail(form.email);
        const sanitizedPhone = sanitizeInput(form.phone);
        const sanitizedCity = sanitizeInput(form.city);
        const sanitizedAvailability = sanitizeInput(form.availability);
        const sanitizedWhy = sanitizeInput(form.why);

        if (!sanitizedName) return "Name is required";
        if (!sanitizedEmail) return "Enter a valid email";
        if (!sanitizedPhone) return "Phone number is required";
        if (!sanitizedCity) return "City is required";
        if (!sanitizedAvailability) return "Please specify your availability";
        if (!sanitizedWhy) return "Please tell us why you want to volunteer/foster";
        if (sanitizedWhy.length < 20) return "Please provide more details (at least 20 characters)";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const v = validate();
        if (v) return setError(v);

        try {
            setLoading(true);
            
            // Sanitize form data before submission
            const volunteerData = sanitizeObject({
                ...form,
                name: sanitizeInput(form.name),
                email: sanitizeEmail(form.email) || form.email,
                phone: sanitizeInput(form.phone),
                city: sanitizeInput(form.city),
                availability: sanitizeInput(form.availability),
                experience: sanitizeInput(form.experience),
                why: sanitizeInput(form.why),
            });

            await createVolunteer(volunteerData);
            setSubmitted(true);
        } catch (err) {
            setError(err?.message || "Failed to submit application. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 max-w-3xl">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center shadow-sm">
                    <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto mb-4 flex items-center justify-center text-4xl">
                        ✓
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                        Application Submitted!
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        Thank you for your interest in {form.type === "volunteer" ? "volunteering" : "fostering"} with AdoptNest! 
                        As a nonprofit organization, volunteers and foster parents are essential to our rescue mission. 
                        We've received your application and will contact you within 2-3 business days to discuss how you can help save lives.
                    </p>
                    <Link
                        to="/"
                        className="inline-block px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition shadow-sm"
                    >
                        Back to Home
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 max-w-4xl">
            <Breadcrumbs />
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                    Volunteer & Foster Application
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Join our nonprofit rescue mission! Help us save homeless and neglected pets by volunteering with our 
                    rescue team or becoming a foster parent. Your time and compassion directly save lives.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 md:p-8 shadow-sm">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                            I want to:
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    value="volunteer"
                                    checked={form.type === "volunteer"}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    className="h-4 w-4 text-amber-500 focus:ring-2 focus:ring-amber-500"
                                />
                                <span className="text-slate-700 dark:text-slate-300">Volunteer</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    value="foster"
                                    checked={form.type === "foster"}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    className="h-4 w-4 text-amber-500 focus:ring-2 focus:ring-amber-500"
                                />
                                <span className="text-slate-700 dark:text-slate-300">Foster Parent</span>
                            </label>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Phone *
                            </label>
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                City *
                            </label>
                            <input
                                type="text"
                                value={form.city}
                                onChange={(e) => setForm({ ...form, city: e.target.value })}
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                            />
                        </div>
                    </div>

                    {/* Availability */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Availability *
                        </label>
                        <textarea
                            value={form.availability}
                            onChange={(e) => setForm({ ...form, availability: e.target.value })}
                            required
                            placeholder="e.g., Weekends, 2-3 hours per week, Flexible schedule..."
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition resize-y"
                        />
                    </div>

                    {/* Experience */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Previous Experience (Optional)
                        </label>
                        <textarea
                            value={form.experience}
                            onChange={(e) => setForm({ ...form, experience: e.target.value })}
                            placeholder="Tell us about your experience with pets, volunteering, or animal care..."
                            rows={4}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition resize-y"
                        />
                    </div>

                    {/* Why */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Why do you want to {form.type === "volunteer" ? "volunteer" : "foster"}? *
                        </label>
                        <textarea
                            value={form.why}
                            onChange={(e) => setForm({ ...form, why: e.target.value })}
                            required
                            placeholder="Tell us what motivates you..."
                            rows={5}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition resize-y"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 px-5 py-2.5 rounded-lg text-white font-medium shadow-sm transition ${
                                loading
                                    ? "bg-amber-300 opacity-70 cursor-not-allowed"
                                    : "bg-amber-500 hover:bg-amber-600 active:scale-95"
                            }`}
                        >
                            {loading ? "Submitting..." : "Submit Application"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
