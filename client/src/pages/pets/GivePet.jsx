import React, { useState } from "react";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import ImageUrlInput from "../../components/ui/ImageUrlInput";

export default function GivePet() {
    useDocumentTitle("Surrender a Pet");
  const [form, setForm] = useState({
    name: "",
    type: "Dog",
    age: "",
    reason: "",
    image: null,
  });
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageUrlChange = (url) => {
    setImageUrl(url);
    setForm((s) => ({ ...s, image: url || null }));
    setError("");
  };

  const validate = () => {
    if (!form.name.trim()) return "Pet name is required";
    if (form.name.trim().length < 2) return "Pet name must be at least 2 characters";
    if (!form.type) return "Pet type is required";
    // age optional but if provided check numeric and reasonable range
    if (form.age) {
      const ageNum = Number(form.age);
      if (isNaN(ageNum)) return "Enter a valid age (years)";
      if (ageNum < 0 || ageNum > 30) return "Age must be between 0 and 30 years";
    }
    if (form.reason && form.reason.trim().length < 10) return "Reason must be at least 10 characters if provided";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) return setError(v);

    try {
      setLoading(true);
      const { submitSurrender } = await import("../../services/api");
      
      const surrenderData = {
        name: form.name,
        type: form.type,
        age: form.age || "",
        reason: form.reason || "",
        image: imageUrl || null
      };

      await submitSurrender(surrenderData);
      alert("Surrender request submitted. We will contact you.");
      setForm({ name: "", type: "Dog", age: "", reason: "", image: null });
      setImageUrl("");
    } catch (err) {
      setError(err?.message || "Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 max-w-5xl">
      <Breadcrumbs />
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Form */}
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                Surrender a Pet to Our Rescue Center
              </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Fill this form to surrender a pet to our rescue center. We provide medical care, rehabilitation, 
                and find them a loving forever home. We'll contact you to arrange a safe transfer.
              </p>

              {error && (
                <div className="mb-3 text-sm text-red-700 bg-red-50 dark:bg-red-900/30 p-2 rounded border border-red-100 dark:border-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* name */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Pet name
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-300 outline-none transition"
                    placeholder="e.g., Mochi"
                  />
                </div>

                {/* type + age in one row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                      Type
                    </label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-800 text-black dark:text-white focus:ring-2 focus:ring-amber-300 outline-none transition"
                    >
                      <option>Dog</option>
                      <option>Cat</option>
                      <option>Bird</option>
                      <option>Rabbit</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                      Age (years)
                    </label>
                    <input
                      value={form.age}
                      onChange={(e) => setForm({ ...form, age: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-300 outline-none transition"
                      placeholder="e.g., 2"
                    />
                  </div>
                </div>

                {/* Image URL input */}
                <div>
                  <ImageUrlInput
                    value={imageUrl}
                    onChange={handleImageUrlChange}
                    label="Pet Image URL (optional)"
                    placeholder="Enter jsDelivr CDN URL or image URL"
                    required={false}
                  />
                </div>

                {/* reason */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Reason for surrender
                  </label>
                  <textarea
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-300 outline-none transition"
                    placeholder="Tell us briefly why you're surrendering the pet (optional)"
                  />
                </div>

                {/* actions */}
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg text-white font-medium shadow-sm flex-1 text-sm
                      ${loading ? "bg-amber-300 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-600 active:scale-95 transition"}`}
                  >
                    {loading ? "Submitting..." : "Submit request"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setForm({ name: "", type: "Dog", age: "", reason: "", image: null });
                      setImageUrl(null);
                      setError("");
                    }}
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>

            {/* Right panel (info) */}
            <div className="hidden lg:flex items-center justify-center bg-amber-50 dark:bg-slate-800/30 p-6">
              <div className="text-center px-2">
                <div className="w-20 h-20 rounded-full bg-amber-200 mx-auto mb-3 flex items-center justify-center text-3xl">
                  🐾
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Safe & compassionate</h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 max-w-[12rem]">
                  As a nonprofit rescue organization, we provide comprehensive medical care, rehabilitation, 
                  and find every surrendered pet a loving forever home.
                </p>
                <a
                  href="/contact"
                  className="inline-block mt-3 text-xs px-3 py-1 rounded-md border border-amber-300 text-amber-700 hover:bg-amber-100 transition"
                >
                  Contact Rescue Center
                </a>
              </div>
            </div>
          </div>
        </div>
    </main>
  );
}
