import React from "react";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { siteInfo } from "../../config/siteInfo";

export default function Privacy() {
    useDocumentTitle("Privacy Policy");

    return (
        <main className="max-w-4xl mx-auto">
            <Breadcrumbs />
            
            <div className="space-y-8">
                <header className="text-center space-y-4 pb-8 border-b-2 border-slate-200 dark:border-slate-700">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                        Privacy Policy
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </header>

                <section className="card p-6 md:p-8 space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Introduction</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            AdoptNest ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. Information We Collect</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                            We collect information that you provide directly to us, including:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
                            <li>Personal information (name, email, phone number, address)</li>
                            <li>Account credentials and profile information</li>
                            <li>Pet adoption applications and related documents</li>
                            <li>Payment information for donations and services</li>
                            <li>Communication preferences and feedback</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. How We Use Your Information</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
                            <li>Process and manage pet adoption applications</li>
                            <li>Facilitate pet surrender requests and care services</li>
                            <li>Process donations and payments</li>
                            <li>Send you updates about your applications and bookings</li>
                            <li>Improve our services and user experience</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">4. Information Sharing</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            We do not sell your personal information. We may share your information with trusted partners, service providers, and when required by law. We may share adoption application details with shelters and rescue organizations to facilitate adoptions.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">5. Data Security</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">6. Your Rights</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                            You have the right to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
                            <li>Access and update your personal information</li>
                            <li>Request deletion of your account and data</li>
                            <li>Opt-out of marketing communications</li>
                            <li>File a complaint with relevant data protection authorities</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">7. Cookies and Tracking</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            We use cookies and similar tracking technologies to enhance your experience, analyze usage, and assist with marketing efforts. You can control cookie preferences through your browser settings.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">8. Children's Privacy</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">9. Changes to This Policy</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">10. Contact Us</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            If you have questions about this Privacy Policy, please contact us at:
                        </p>
                        <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <p className="text-slate-700 dark:text-slate-300">
                                <strong>Email:</strong> <a href={`mailto:${siteInfo.legal.privacyEmail}`} className="text-amber-600 dark:text-amber-400 hover:underline">{siteInfo.legal.privacyEmail}</a><br />
                                <strong>Phone:</strong> <a href={`tel:${siteInfo.legal.phone.replace(/\s/g, '')}`} className="text-amber-600 dark:text-amber-400 hover:underline">{siteInfo.legal.phone}</a><br />
                                <strong>Address:</strong> {siteInfo.contact.fullAddress || siteInfo.contact.address}
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

