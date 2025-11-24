import React from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function About() {
    useDocumentTitle("About Us");
    const navigate = useNavigate();

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 max-w-5xl">
            <Breadcrumbs />
            <div className="space-y-12">
            {/* Hero */}
            <section className="text-center mb-6 md:mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 leading-tight">
                    About AdoptNest
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    AdoptNest is a nonprofit animal rescue organization dedicated to saving homeless and neglected pets. 
                    We rescue animals from the streets, provide medical care and rehabilitation, and find them loving forever homes. 
                    Our mission is driven by compassion, and every adoption helps us save another life.
                </p>
            </section>

            {/* Mission */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm transition-colors">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">Our Mission</h2>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mt-2 sm:mt-3 leading-relaxed">
                    As a nonprofit organization, our mission is to{" "}
                    <span className="font-semibold text-amber-500">rescue, rehabilitate, and rehome homeless and neglected pets</span>. 
                    We believe every animal deserves love, care, and a safe home. Through our rescue efforts, medical care, 
                    and adoption programs, we give abandoned and neglected pets a second chance at life. Every donation and 
                    adoption directly supports our mission to save more animals in need.
                </p>
            </section>

            {/* What we do */}
            <section className="space-y-4 sm:space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">What We Do</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                    <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
                        <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🚨</div>
                        <h3 className="font-semibold text-base sm:text-lg text-slate-900 dark:text-white">Rescue Operations</h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                            We actively rescue homeless, abandoned, and neglected pets from the streets, 
                            providing immediate medical care and safe shelter.
                        </p>
                    </div>

                    <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
                        <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🏥</div>
                        <h3 className="font-semibold text-base sm:text-lg text-slate-900 dark:text-white">Rehabilitation</h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                            Every rescued pet receives comprehensive medical care, vaccinations, spay/neuter services, 
                            and behavioral rehabilitation to prepare them for adoption.
                        </p>
                    </div>

                    <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
                        <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">❤️</div>
                        <h3 className="font-semibold text-base sm:text-lg text-slate-900 dark:text-white">Adoption Program</h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                            We carefully match rescued pets with loving families, ensuring each adoption 
                            is a perfect fit. Every adoption fee directly supports our rescue operations.
                        </p>
                    </div>
                </div>
            </section>

            {/* Why choose us */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm transition-colors">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">Why Support AdoptNest?</h2>
                <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2 mt-2 sm:mt-3 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    <li><strong>100% Nonprofit:</strong> Every donation and adoption fee goes directly to rescuing and caring for animals</li>
                    <li><strong>Rescue-First Mission:</strong> We actively rescue homeless and neglected pets from the streets</li>
                    <li><strong>Comprehensive Care:</strong> All rescued pets receive full medical care, vaccinations, and rehabilitation</li>
                    <li><strong>Transparent Process:</strong> We maintain complete transparency about our rescue operations and finances</li>
                    <li><strong>Dedicated Team:</strong> Our volunteers and staff are passionate about animal welfare and rescue</li>
                    <li><strong>Community Impact:</strong> Every adoption saves a life and helps us rescue another pet in need</li>
                </ul>
            </section>

            {/* Team */}
            <section className="space-y-4 sm:space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">Our Team</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                    <div className="text-center bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-amber-100 dark:bg-amber-900/30 mx-auto mb-2 sm:mb-3 flex items-center justify-center text-2xl sm:text-3xl">🚨</div>
                        <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">Rescue Team</h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">Dedicated volunteers who rescue homeless and neglected pets from the streets.</p>
                    </div>

                    <div className="text-center bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-amber-100 dark:bg-amber-900/30 mx-auto mb-2 sm:mb-3 flex items-center justify-center text-2xl sm:text-3xl">👩‍⚕️</div>
                        <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">Veterinary Partners</h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">Compassionate veterinarians providing medical care and rehabilitation for rescued pets.</p>
                    </div>

                    <div className="text-center bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition sm:col-span-2 md:col-span-1">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-amber-100 dark:bg-amber-900/30 mx-auto mb-2 sm:mb-3 flex items-center justify-center text-2xl sm:text-3xl">❤️</div>
                        <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">Foster Network</h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">Loving foster families providing temporary homes while pets await their forever families.</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="text-center mb-6 md:mb-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-900 dark:text-white mb-2 sm:mb-3">Join Our Mission</h2>
                <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-4 sm:mb-6">
                    Help us save more lives! Volunteer with our rescue team, become a foster parent, 
                    make a donation, or spread awareness about animal welfare. Every contribution makes a difference.
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-2 sm:gap-3 mt-3">
                    <button
                        onClick={() => navigate("/volunteer")}
                        className="px-4 sm:px-6 py-2 sm:py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                    >
                        Apply to Volunteer
                    </button>
                    <button
                        onClick={() => navigate("/contact")}
                        className="px-4 sm:px-6 py-2 sm:py-2.5 border-2 border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                    >
                        Contact Us
                    </button>
                </div>
            </section>
            </div>
        </main>
    );
}
