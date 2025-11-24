import React from "react";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { siteInfo } from "../../config/siteInfo";

export default function Terms() {
    useDocumentTitle("Terms of Service");

    return (
        <main className="max-w-4xl mx-auto">
            <Breadcrumbs />
            
            <div className="space-y-8">
                <header className="text-center space-y-4 pb-8 border-b-2 border-slate-200 dark:border-slate-700">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                        Terms of Service
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </header>

                <section className="card p-6 md:p-8 space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            By accessing and using AdoptNest, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. Use of Service</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                            You agree to use AdoptNest only for lawful purposes and in a way that does not infringe the rights of others. You agree not to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
                            <li>Use the service for any illegal or unauthorized purpose</li>
                            <li>Violate any laws in your jurisdiction</li>
                            <li>Transmit any viruses or malicious code</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                            <li>Interfere with or disrupt the service</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Pet Adoption Process</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            AdoptNest facilitates connections between potential adopters and pets. We are not responsible for the final adoption decision, which is made by the shelter or rescue organization. All adoption applications are subject to approval by the respective organization.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">4. Pet Surrender</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            When surrendering a pet through our platform, you must provide accurate information about the pet's health, behavior, and history. Surrendered pets will be transferred to our care or partner organizations for rehoming.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">5. Donations and Payments</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            All donations and payments are processed securely. Donations are non-refundable unless otherwise stated. Service fees for bookings are subject to our cancellation and refund policy.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">6. User Accounts</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                            You are responsible for:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
                            <li>Maintaining the confidentiality of your account credentials</li>
                            <li>All activities that occur under your account</li>
                            <li>Providing accurate and current information</li>
                            <li>Notifying us immediately of any unauthorized use</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">7. Intellectual Property</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            All content on AdoptNest, including text, graphics, logos, and software, is the property of AdoptNest or its content suppliers and is protected by copyright and other intellectual property laws.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">8. Limitation of Liability</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            AdoptNest shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of the service. We provide the service "as is" without warranties of any kind.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">9. Indemnification</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            You agree to indemnify and hold harmless AdoptNest, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the service or violation of these terms.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">10. Termination</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            We reserve the right to terminate or suspend your account and access to the service at our sole discretion, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">11. Changes to Terms</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            We reserve the right to modify these terms at any time. Your continued use of the service after changes constitutes acceptance of the new terms.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">12. Contact Information</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            For questions about these Terms of Service, please contact us:
                        </p>
                        <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                            <p className="text-slate-700 dark:text-slate-300">
                                <strong>Email:</strong> <a href={`mailto:${siteInfo.legal.legalEmail}`} className="text-amber-600 dark:text-amber-400 hover:underline">{siteInfo.legal.legalEmail}</a><br />
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

