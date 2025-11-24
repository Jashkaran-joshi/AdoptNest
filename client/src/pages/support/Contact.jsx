import React, { useState } from "react";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import { sanitizeInput, sanitizeEmail } from "../../utils/helpers/sanitize";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { siteInfo } from "../../config/siteInfo";

export default function Contact() {
    useDocumentTitle("Contact Us");
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const validate = () => {
        const sanitizedName = sanitizeInput(form.name);
        const sanitizedEmail = sanitizeEmail(form.email);
        const sanitizedMessage = sanitizeInput(form.message);

        if (!sanitizedName) return "Name is required";
        if (!sanitizedEmail) return "Enter a valid email address";
        if (!sanitizedMessage) return "Message is required";
        if (sanitizedMessage.length < 10) return "Message must be at least 10 characters";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);
            
            // Sanitize form data before sending
            const sanitizedData = {
                name: sanitizeInput(form.name),
                email: sanitizeEmail(form.email),
                message: sanitizeInput(form.message),
            };

            const { submitContact } = await import("../../services/api");
            await submitContact(sanitizedData);
            setSent(true);
            setForm({ name: "", email: "", message: "" });
        } catch (err) {
            setError(err?.message || "Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 max-w-6xl">
            <Breadcrumbs />
            
            {/* Heading */}
            <section className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                    Contact Us
                </h1>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Have questions about our rescue operations, adoption process, surrendering a pet, or how to support our mission? 
                    We're here to help! As a nonprofit organization, we're committed to transparency and animal welfare.
                </p>
            </section>

            {/* Main layout */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Contact Form */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Send us a message</h2>

                    {sent && (
                        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-700">
                            Message sent! We'll get back to you soon.
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                                placeholder="Your name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Message
                            </label>
                            <textarea
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                required
                                rows={5}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition resize-y"
                                placeholder="How can we help?"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full px-5 py-2.5 rounded-lg text-white font-medium shadow-sm transition ${
                                loading
                                    ? "bg-amber-300 cursor-not-allowed"
                                    : "bg-amber-500 hover:bg-amber-600 active:scale-95"
                            }`}
                        >
                            {loading ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                </div>

                {/* Contact Info */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Contact Information</h2>

                        <ul className="space-y-4 text-slate-700 dark:text-slate-300">
                            <li>
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">📞</span>
                                    <div>
                                        <div className="font-semibold text-slate-900 dark:text-white mb-1">Phone</div>
                                        <a 
                                            href={`tel:${siteInfo.contact.phone.replace(/\s/g, '')}`}
                                            className="text-amber-600 dark:text-amber-400 hover:underline"
                                        >
                                            {siteInfo.contact.phone}
                                        </a>
                                    </div>
                                </div>
                            </li>

                            <li>
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">📧</span>
                                    <div>
                                        <div className="font-semibold text-slate-900 dark:text-white mb-1">Email</div>
                                        <a 
                                            href={`mailto:${siteInfo.contact.email}`}
                                            className="text-amber-600 dark:text-amber-400 hover:underline"
                                        >
                                            {siteInfo.contact.email}
                                        </a>
                                    </div>
                                </div>
                            </li>

                            <li>
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">📍</span>
                                    <div>
                                        <div className="font-semibold text-slate-900 dark:text-white mb-1">Address</div>
                                        <div>{siteInfo.contact.fullAddress || siteInfo.contact.address}</div>
                                    </div>
                                </div>
                            </li>
                            
                            <li>
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">🕐</span>
                                    <div>
                                        <div className="font-semibold text-slate-900 dark:text-white mb-1">Business Hours</div>
                                        <div className="text-sm">
                                            <div>Mon-Fri: {siteInfo.contact.businessHours.weekdays}</div>
                                            <div>Sat-Sun: {siteInfo.contact.businessHours.weekends}</div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Map */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm h-64">
                        <iframe
                            title="AdoptNest Location"
                            src="https://www.openstreetmap.org/export/embed.html?bbox=75.77,26.905,75.80,26.92&layer=mapnik&marker=26.9124,75.7873"
                            className="w-full h-full"
                            loading="lazy"
                            allowFullScreen
                        />
                    </div>
                </div>
            </div>

            {/* Bottom CTA */}
            <section className="text-center mt-12">
                <div className="bg-amber-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Prefer talking by phone?</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-3">
                        Call us anytime between <strong className="text-slate-900 dark:text-white">{siteInfo.contact.businessHours.weekdays}</strong> on weekdays.
                    </p>
                    <a
                        href={`tel:${siteInfo.contact.phone.replace(/\s/g, '')}`}
                        className="inline-block px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                        📞 Call Now: {siteInfo.contact.phone}
                    </a>
                </div>
            </section>
        </main>
    );
}
