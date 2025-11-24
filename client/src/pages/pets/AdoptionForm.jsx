import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { fetchPet, submitAdoption } from "../../services/api";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function AdoptionForm() {
    useDocumentTitle("Adoption Application");
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    // Get petId from URL params or query string
    const petId = id || searchParams.get("petId") || searchParams.get("start");
    const [pet, setPet] = useState(null);
    const [loadingPet, setLoadingPet] = useState(false);

    useEffect(() => {
        const loadPet = async () => {
            if (!petId) return;
            try {
                setLoadingPet(true);
                const response = await fetchPet(petId);
                setPet(response.data.pet);
            } catch (err) {
                console.error("Error loading pet:", err);
            } finally {
                setLoadingPet(false);
            }
        };
        loadPet();
    }, [petId]);

    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: "",
        address: "",
        city: "",
        experience: "",
        reason: "",
        otherPets: false,
        otherPetsDetails: "",
        homeType: "apartment",
        yard: false,
        hoursAlone: "",
        references: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!user) {
            // Redirect to login if not authenticated
            navigate("/login?redirect=/adopt/apply" + (petId ? `/${petId}` : ""));
        }
    }, [user, navigate, petId]);

    const validate = () => {
        if (!form.name.trim()) return "Full name is required";
        if (!form.email.trim()) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(form.email)) return "Enter a valid email";
        if (!form.phone.trim()) return "Phone number is required";
        if (!form.address.trim()) return "Address is required";
        if (!form.city.trim()) return "City is required";
        if (!form.reason.trim()) return "Please tell us why you want to adopt";
        if (!form.hoursAlone.trim()) return "Please specify how many hours the pet will be alone";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const v = validate();
        if (v) return setError(v);

        try {
            setLoading(true);
            
            const applicationData = {
                petId: petId || pet?._id || pet?.id,
                name: form.name,
                email: form.email,
                phone: form.phone,
                address: form.address,
                city: form.city,
                experience: form.experience,
                reason: form.reason,
                otherPets: form.otherPets,
                otherPetsDetails: form.otherPetsDetails,
                homeType: form.homeType,
                yard: form.yard,
                hoursAlone: form.hoursAlone,
                references: form.references,
            };

            await submitAdoption(applicationData);
            setSubmitted(true);
        } catch (err) {
            setError(err?.message || "Failed to submit application. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return null; // Will redirect
    }

    if (submitted) {
        return (
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 max-w-3xl">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto mb-4 flex items-center justify-center text-4xl">
                        ✓
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                        Application Submitted!
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        Thank you for your interest in adopting {pet?.name || "this rescued pet"}! 
                        Your adoption application helps us continue our mission to save homeless and neglected pets. 
                        We've received your application and will review it shortly. 
                        You'll receive an email confirmation and updates on the status.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Link
                            to="/dashboard"
                            className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition"
                        >
                            View in Dashboard
                        </Link>
                        <button
                            onClick={() => navigate("/adopt")}
                            className="px-5 py-2 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                        >
                            Browse More Pets
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 max-w-4xl">
            <div className="mb-6">
                <Link
                    to={petId ? `/adopt/${petId}` : "/adopt"}
                    className="text-amber-500 hover:underline text-sm"
                >
                    ← Back {pet ? `to ${pet.name}` : "to listings"}
                </Link>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                    Adoption Application
                </h1>
                {loadingPet ? (
                    <p className="text-slate-600 dark:text-slate-400 mt-1">Loading pet details...</p>
                ) : pet && (
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Applying to adopt <strong>{pet.name}</strong> • {pet.type} • {pet.breed}
                    </p>
                )}
            </div>

            {error && (
                <div className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 p-3 rounded border border-red-200 dark:border-red-700">
                    {error}
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <section>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                            Personal Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-300 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-300 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-300 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    City *
                                </label>
                                <input
                                    type="text"
                                    value={form.city}
                                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-300 outline-none"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Full Address *
                            </label>
                            <textarea
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                required
                                rows={2}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-300 outline-none"
                            />
                        </div>
                    </section>

                    {/* Experience & Home */}
                    <section>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                            Experience & Living Situation
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Previous Pet Experience
                                </label>
                                <textarea
                                    value={form.experience}
                                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                                    placeholder="Tell us about your experience with pets..."
                                    rows={3}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-300 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Home Type *
                                    </label>
                                    <select
                                        value={form.homeType}
                                        onChange={(e) => setForm({ ...form, homeType: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-300 outline-none"
                                    >
                                        <option value="apartment">Apartment</option>
                                        <option value="house">House</option>
                                        <option value="condo">Condo</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Hours Pet Will Be Alone Daily *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.hoursAlone}
                                        onChange={(e) => setForm({ ...form, hoursAlone: e.target.value })}
                                        placeholder="e.g., 4-6 hours"
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-300 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="yard"
                                    checked={form.yard}
                                    onChange={(e) => setForm({ ...form, yard: e.target.checked })}
                                    className="h-4 w-4 text-amber-500 border-slate-300 dark:border-slate-600 focus:ring-amber-300"
                                />
                                <label htmlFor="yard" className="text-sm text-slate-700 dark:text-slate-300">
                                    I have a fenced yard
                                </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="otherPets"
                                    checked={form.otherPets}
                                    onChange={(e) => setForm({ ...form, otherPets: e.target.checked })}
                                    className="h-4 w-4 text-amber-500 border-slate-300 dark:border-slate-600 focus:ring-amber-300"
                                />
                                <label htmlFor="otherPets" className="text-sm text-slate-700 dark:text-slate-300">
                                    I have other pets
                                </label>
                            </div>
                            {form.otherPets && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Other Pets Details
                                    </label>
                                    <textarea
                                        value={form.otherPetsDetails}
                                        onChange={(e) => setForm({ ...form, otherPetsDetails: e.target.value })}
                                        placeholder="Tell us about your other pets..."
                                        rows={2}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-300 outline-none"
                                    />
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Adoption Reason */}
                    <section>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                            Why Do You Want to Adopt?
                        </h2>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Reason for Adoption *
                            </label>
                            <textarea
                                value={form.reason}
                                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                                required
                                placeholder="Tell us why you want to adopt this pet..."
                                rows={4}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-300 outline-none"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                References (Optional)
                            </label>
                            <textarea
                                value={form.references}
                                onChange={(e) => setForm({ ...form, references: e.target.value })}
                                placeholder="Veterinarian, previous adoption agency, or personal references..."
                                rows={3}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-300 outline-none"
                            />
                        </div>
                    </section>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 px-5 py-3 rounded-lg text-white font-medium shadow-sm ${
                                loading
                                    ? "bg-amber-300 opacity-70 cursor-not-allowed"
                                    : "bg-amber-500 hover:bg-amber-600 active:scale-95 transition"
                            }`}
                        >
                            {loading ? "Submitting..." : "Submit Application"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-5 py-3 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

