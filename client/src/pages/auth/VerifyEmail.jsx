import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import api from "../../services/api";

export default function VerifyEmail() {
    useDocumentTitle("Verify Email");
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("verifying"); // verifying, success, error
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid verification link.");
            return;
        }

        const verifyEmail = async () => {
            try {
                await api.get(`/auth/verify-email/${token}`);
                setStatus("success");
                setMessage("Your email has been verified successfully!");
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            } catch (err) {
                setStatus("error");
                setMessage(err?.message || "Verification failed. The link may have expired or is invalid.");
            }
        };

        verifyEmail();
    }, [token, navigate]);

    return (
        <main className="min-h-[75vh] flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-8 text-center">
                    {status === "verifying" && (
                        <>
                            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 mx-auto mb-4 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verifying Email...</h2>
                            <p className="text-slate-600 dark:text-slate-400">Please wait while we verify your email address.</p>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto mb-4 flex items-center justify-center text-4xl">
                                ✓
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Email Verified!</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">{message}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Redirecting to login...</p>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-4 flex items-center justify-center text-4xl">
                                ✕
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verification Failed</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">{message}</p>
                            <div className="flex gap-3 justify-center">
                                <Link
                                    to="/login"
                                    className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition"
                                >
                                    Go to Login
                                </Link>
                                <Link
                                    to="/contact"
                                    className="px-5 py-2 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                                >
                                    Contact Support
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}

