import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { createPet } from "../../services/api";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import ImageUrlInput from "../../components/ui/ImageUrlInput";

export default function AdminAddPet() {
    useDocumentTitle("Add Pet");
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        type: "Dog",
        breed: "",
        age: "",
        gender: "Male",
        location: "",
        description: "",
        featured: false,
    });

    const [imageUrl, setImageUrl] = useState(""); // jsDelivr image URL
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const validate = () => {
        if (!form.name.trim()) return "Pet name is required";
        if (!form.type) return "Pet type is required";
        if (form.age && isNaN(Number(form.age))) return "Age must be a number";
        if (!imageUrl || !imageUrl.trim()) return "Please provide an image URL";
        return null;
    };

    const handleImageUrlChange = (url) => {
        setImageUrl(url);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const v = validate();
        if (v) return setError(v);

        try {
            setSubmitting(true);
            setError("");

            // Send JSON with image URL from jsDelivr CDN
            const petData = {
                name: form.name.trim(),
                type: form.type,
                breed: form.breed?.trim() || "",
                age: form.age || "",
                gender: form.gender,
                location: form.location?.trim() || "",
                description: form.description?.trim() || "",
                featured: form.featured,
                image: imageUrl // jsDelivr CDN URL
            };

            await createPet(petData);
            navigate("/admin"); // go back to admin list
        } catch (err) {
            console.error(err);
            setError(err?.message || "Failed to add pet. Try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="max-w-4xl mx-auto px-4 py-8">
            <header className="flex items-center justify-between mb-6">
                <div>
                    <Link to="/admin" className="text-amber-500 hover:underline">← Back to Admin</Link>
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mt-2">Add Pet</h1>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Create a new pet listing for adoption</div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-sm text-slate-600 dark:text-slate-300">{user?.name || "Admin"}</div>
                    <button onClick={() => logout()} className="px-3 py-1 border rounded hover:bg-slate-50 dark:hover:bg-slate-800">Logout</button>
                </div>
            </header>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                {error && (
                    <div className="mb-4 text-red-600 bg-red-50 dark:bg-red-900/30 p-3 rounded text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left: preview */}
                    <div className="md:col-span-1 space-y-3">
                        <ImageUrlInput
                            value={imageUrl}
                            onChange={handleImageUrlChange}
                            label="Image URL"
                            placeholder="Enter jsDelivr CDN URL or image URL"
                            required={true}
                            className="w-full"
                        />
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            Tip: Use a jsDelivr CDN URL or direct image URL. Image URL is required.
                        </div>
                    </div>

                    {/* Right: main form */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Name</label>
                                <input
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="mt-2 w-full rounded-md border border-slate-200 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-300 transition"
                                    placeholder="e.g., Mochi"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Type</label>
                                <select
                                    value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    className="mt-2 w-full rounded-md border border-slate-200 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                                >
                                    <option>Dog</option>
                                    <option>Cat</option>
                                    <option>Bird</option>
                                    <option>Rabbit</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Breed</label>
                                <input
                                    value={form.breed}
                                    onChange={(e) => setForm({ ...form, breed: e.target.value })}
                                    className="mt-2 w-full rounded-md border border-slate-200 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                    placeholder="e.g., Labrador"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Age (yrs)</label>
                                <input
                                    value={form.age}
                                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                                    className="mt-2 w-full rounded-md border border-slate-200 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                    placeholder="e.g., 2"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Gender</label>
                                <select
                                    value={form.gender}
                                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                                    className="mt-2 w-full rounded-md border border-slate-200 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                >
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Location</label>
                                <input
                                    value={form.location}
                                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                                    className="mt-2 w-full rounded-md border border-slate-200 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                    placeholder="City or shelter"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Short description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={3}
                                className="mt-2 w-full rounded-md border border-slate-200 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                placeholder="Health, temperament, special notes..."
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="inline-flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={form.featured}
                                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                                    className="h-4 w-4"
                                />
                                <span className="text-sm text-slate-700 dark:text-slate-200">Mark as featured</span>
                            </label>

                            <div className="ml-auto flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setForm({
                                            name: "",
                                            type: "Dog",
                                            breed: "",
                                            age: "",
                                            gender: "Male",
                                            location: "",
                                            description: "",
                                            featured: false,
                                        });
                                        setImageUrl(null);
                                        setError("");
                                    }}
                                    className="px-4 py-2 rounded-md border"
                                >
                                    Reset
                                </button>

                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className={`px-4 py-2 rounded-md text-white ${submitting ? "bg-amber-300 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-600"}`}
                                >
                                    {submitting ? "Adding..." : "Add Pet"}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}
