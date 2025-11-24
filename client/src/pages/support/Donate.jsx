import React, { useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import { sanitizeInput, sanitizeEmail } from "../../utils/helpers/sanitize";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { createDonationContact } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { useNotifications } from "../../contexts/NotificationContext";

const donationPurposes = [
    { value: "general", label: "General Donation" },
    { value: "sponsor-pet", label: "Sponsor a Pet" },
    { value: "monthly-support", label: "Monthly Support" },
    { value: "one-time", label: "One-time Donation" },
    { value: "other", label: "Other" },
];

export default function Donate() {
    useDocumentTitle("Donate");
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        purpose: "general",
        message: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const validate = () => {
        const sanitizedName = sanitizeInput(form.name);
        const sanitizedEmail = sanitizeEmail(form.email);
        const sanitizedPhone = form.phone ? sanitizeInput(form.phone) : "";
        const sanitizedMessage = form.message ? sanitizeInput(form.message) : "";

        if (!sanitizedName || sanitizedName.length < 2) {
            setError("Please enter a valid name (at least 2 characters)");
            return false;
        }

        if (!sanitizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
            setError("Please enter a valid email address");
            return false;
        }

        if (sanitizedPhone && sanitizedPhone.length < 10) {
            setError("Please enter a valid phone number (at least 10 digits)");
            return false;
        }

        if (!form.purpose) {
            setError("Please select a donation purpose");
            return false;
        }

        setError("");
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validate()) {
            return;
        }

        setLoading(true);
        try {
            const sanitizedForm = {
                name: sanitizeInput(form.name),
                email: sanitizeEmail(form.email),
                phone: form.phone ? sanitizeInput(form.phone) : undefined,
                purpose: form.purpose,
                message: form.message ? sanitizeInput(form.message) : undefined,
            };

            await createDonationContact(sanitizedForm);
            setSubmitted(true);
            addNotification({
                type: "success",
                title: "Thank You!",
                message: "Your donation inquiry has been submitted. We will contact you soon.",
            });

            // Reset form
            setForm({
                name: user?.name || "",
                email: user?.email || "",
                phone: user?.phone || "",
                purpose: "general",
                message: "",
            });
        } catch (err) {
            console.error("Donation contact error:", err);
            setError(err?.response?.data?.message || err?.message || "Failed to submit donation inquiry. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 max-w-7xl">
                <Breadcrumbs />
                <div className="max-w-2xl mx-auto text-center py-12">
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8">
                        <div className="text-6xl mb-4">🙏</div>
                        <h2 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">Thank You for Your Support!</h2>
                        <p className="text-green-700 dark:text-green-400 mb-6">
                            Your donation inquiry has been submitted successfully. Your generosity will help us rescue more 
                            homeless and neglected pets, provide medical care, and find them loving homes. Our team will 
                            contact you soon to discuss how your contribution can make a difference.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                to="/"
                                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition"
                            >
                                Back to Home
                            </Link>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                            >
                                Submit Another
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 max-w-7xl">
            <Breadcrumbs />
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        Support Our Rescue Mission
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        As a nonprofit organization, every donation directly supports our rescue operations, medical care, 
                        and rehabilitation programs for homeless and neglected pets. Your generosity saves lives and gives 
                        abandoned animals a second chance. Fill out the form below and we'll contact you to discuss how you can help.
                    </p>
                </div>

                <div className="card p-6 md:p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                                placeholder="your.email@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>

                        <div>
                            <label htmlFor="purpose" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Donation Purpose <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="purpose"
                                value={form.purpose}
                                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                                required
                            >
                                {donationPurposes.map((purpose) => (
                                    <option key={purpose.value} value={purpose.value}>
                                        {purpose.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Message (Optional)
                            </label>
                            <textarea
                                id="message"
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                rows={5}
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition resize-none"
                                placeholder="Tell us about your donation or any specific requests..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full px-6 py-3 rounded-lg text-white font-medium transition shadow-sm ${
                                loading
                                    ? "bg-amber-300 cursor-not-allowed"
                                    : "bg-amber-500 hover:bg-amber-600 active:scale-95"
                            }`}
                        >
                            {loading ? "Submitting..." : "Submit Donation Inquiry"}
                        </button>
                    </form>

                        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                            <strong className="text-slate-900 dark:text-white">100% Nonprofit:</strong> All donations go directly to rescuing and caring for animals. 
                            We maintain complete transparency about how your contributions are used to save lives.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
