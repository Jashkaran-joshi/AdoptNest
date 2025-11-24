import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { fetchPets, createBooking, updateBooking } from "../../services/api";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import Breadcrumbs from "../../components/layout/Breadcrumbs";

const SERVICE_OPTIONS = [
  { id: "grooming", label: "Grooming", price: 500, desc: "Full grooming: bath, brush, trim nails", icon: "✂️" },
  { id: "vet", label: "Vet / Doctor", price: 800, desc: "Consultation & basic checkup", icon: "🩺" },
  { id: "boarding", label: "Boarding (per night)", price: 1000, desc: "Safe overnight boarding", icon: "🏠" },
  { id: "daycare", label: "Daycare (per day)", price: 400, desc: "Daily play & supervision", icon: "🎾" },
  { id: "training", label: "Training Session", price: 1200, desc: "1-on-1 training session", icon: "🎓" },
];

function formatCurrency(n) {
  return n ? `₹${n.toLocaleString("en-IN")}` : "—";
}

export default function BookService() {
  useDocumentTitle("Book Service");
  const { petId: paramPetId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const incomingBooking = location.state?.booking || null;
  const isEdit = Boolean(incomingBooking && (incomingBooking._id || incomingBooking.id));

  const [petList, setPetList] = useState([]);
  const prePet = paramPetId ? petList.find((p) => (p._id || p.id) === paramPetId) : null;

  // Fetch pets on mount
  useEffect(() => {
    const loadPets = async () => {
      try {
        const response = await fetchPets("?status=Available&limit=100");
        setPetList(response.data.pets || []);
      } catch (err) {
        console.error("Error loading pets:", err);
      }
    };
    loadPets();
  }, []);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    petId: prePet ? (prePet._id || prePet.id) : (petList.length ? (petList[0]._id || petList[0].id) : ""),
    service: SERVICE_OPTIONS[0].id,
    date: "",
    time: "",
    notes: "",
    qty: 1,
  });

  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    if (prePet) setForm((f) => ({ ...f, petId: prePet._id || prePet.id }));
  }, [prePet]);

  useEffect(() => {
    if (incomingBooking) {
      setForm((f) => ({
        ...f,
        name: incomingBooking.name || f.name,
        email: incomingBooking.email || f.email,
        phone: incomingBooking.phone || f.phone,
        petId: incomingBooking.petId?._id || incomingBooking.petId || f.petId,
        service: (() => {
          const s = SERVICE_OPTIONS.find((opt) => opt.label === incomingBooking.service);
          return s ? s.id : f.service;
        })(),
        date: incomingBooking.date ? new Date(incomingBooking.date).toISOString().split('T')[0] : "",
        time: incomingBooking.time || "",
        notes: incomingBooking.notes || "",
        qty: incomingBooking.qty || 1,
      }));
    }
  }, [incomingBooking]);

  const selectedService = SERVICE_OPTIONS.find((s) => s.id === form.service);
  const estimate = (() => {
    if (!selectedService) return 0;
    if (selectedService.id === "boarding" || selectedService.id === "daycare") {
      return selectedService.price * Math.max(1, Number(form.qty || 1));
    }
    return selectedService.price;
  })();

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Your name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.petId) e.petId = "Please select a pet.";
    if (!form.service) e.service = "Select a service.";
    if (!form.date) e.date = "Pick a date.";
    if (!form.time) e.time = "Pick a time.";
    if ((selectedService?.id === "boarding" || selectedService?.id === "daycare") && (!form.qty || Number(form.qty) < 1))
      e.qty = "Enter number of nights/days (min 1).";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setErrors({});
    setConfirmation(null);

    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    try {
      setBusy(true);
      setErrors({});

      if (isEdit) {
        const bookingId = incomingBooking._id || incomingBooking.id;
        const response = await updateBooking(bookingId, {
          date: form.date,
          time: form.time,
          notes: form.notes,
          qty: form.qty,
        });
        setConfirmation(response.data.booking);
      } else {
        const payload = {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          petId: form.petId || undefined,
          service: selectedService.label,
          date: form.date,
          time: form.time,
          qty: form.qty,
          notes: form.notes.trim(),
        };
        const response = await createBooking(payload);
        setConfirmation(response.data.booking);
      }

      setForm((f) => ({ ...f, date: "", time: "", notes: "", qty: 1 }));
    } catch (err) {
      setErrors({ form: err?.message || "Failed to submit — try again." });
    } finally {
      setBusy(false);
    }
  };

  if (confirmation) {
    return (
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 max-w-4xl">
        <Breadcrumbs />
        <div className="card p-4 sm:p-6 md:p-8 text-center space-y-4 sm:space-y-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-3xl sm:text-4xl mx-auto shadow-lg">
            ✓
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {isEdit ? "Change Request Submitted" : "Booking Confirmed!"}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400">
              {isEdit 
                ? "Your change request has been submitted. The shelter will review and contact you." 
                : "Your booking request was submitted successfully. The shelter will contact you soon."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8">
            <div className="card p-4 sm:p-5 text-left">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Booking ID</div>
              <div className="font-bold text-base sm:text-lg text-slate-900 dark:text-white font-mono break-all">{confirmation._id || confirmation.id}</div>
            </div>
            <div className="card p-4 sm:p-5 text-left">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Status</div>
              <div className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-semibold text-xs sm:text-sm">
                {confirmation.status}
              </div>
            </div>
            <div className="card p-4 sm:p-5 text-left">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Service</div>
              <div className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">{confirmation.service}</div>
            </div>
            <div className="card p-4 sm:p-5 text-left">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Total Amount</div>
              <div className="font-bold text-xl sm:text-2xl text-amber-600 dark:text-amber-400">{formatCurrency(confirmation.amount)}</div>
            </div>
          </div>

          <div className="card p-4 sm:p-6 text-left space-y-3 sm:space-y-4">
            <div>
              <div className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Pet</div>
              <div className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">{confirmation.petId?.name || confirmation.petName || "Not specified"}</div>
            </div>
            <div>
              <div className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Date & Time</div>
              <div className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                {new Date(confirmation.date).toLocaleDateString()} at {confirmation.time}
                {confirmation.qty > 1 && <span className="text-sm sm:text-base font-normal text-slate-600 dark:text-slate-400"> • {confirmation.qty} {selectedService?.id === "boarding" ? "nights" : "days"}</span>}
              </div>
            </div>
            {confirmation.notes && (
              <div>
                <div className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Notes</div>
                <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300">{confirmation.notes}</div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center pt-4">
            <button 
              onClick={() => window.print()} 
              className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-sm sm:text-base text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Print
            </button>
            <Link 
              to="/dashboard" 
              className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-200 transform hover:scale-105 active:scale-95 text-center"
            >
              Go to Dashboard
            </Link>
            <button 
              onClick={() => { setConfirmation(null); if (isEdit) navigate("/dashboard"); }} 
              className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-sm sm:text-base text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold transition-all duration-200"
            >
              {isEdit ? "Back to Dashboard" : "Make Another Booking"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 max-w-5xl">
      <Breadcrumbs />
      
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3">
          {isEdit ? "Request Booking Change" : "Book a Service"}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400">
          {isEdit 
            ? "Edit the fields you want to change and submit a change request." 
            : "Schedule grooming, vet visits, boarding, and more for your pet."}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="card p-4 sm:p-6 md:p-8">
            {errors.form && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl border-2 border-red-200 dark:border-red-700">
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Personal Information */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>👤</span>
                  Your Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={`w-full rounded-xl border-2 px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 dark:focus:border-amber-400 transition-all duration-200 shadow-sm ${
                        errors.name ? "border-red-400 dark:border-red-600" : "border-slate-200 dark:border-slate-700"
                      }`}
                      placeholder="Your name"
                    />
                    {errors.name && <div className="text-xs text-red-600 dark:text-red-400 font-medium">{errors.name}</div>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={`w-full rounded-xl border-2 px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 dark:focus:border-amber-400 transition-all duration-200 shadow-sm ${
                        errors.email ? "border-red-400 dark:border-red-600" : "border-slate-200 dark:border-slate-700"
                      }`}
                      placeholder="you@example.com"
                    />
                    {errors.email && <div className="text-xs text-red-600 dark:text-red-400 font-medium">{errors.email}</div>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 dark:focus:border-amber-400 transition-all duration-200 shadow-sm"
                      placeholder="8000260019"
                    />
                  </div>
                </div>
              </div>

              {/* Service Selection */}
              <div className="space-y-4 pt-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>🐾</span>
                  Service Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Select Pet *
                    </label>
                    <select
                      value={form.petId}
                      onChange={(e) => setForm({ ...form, petId: e.target.value })}
                      className={`w-full rounded-xl border-2 px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 dark:focus:border-amber-400 transition-all duration-200 shadow-sm appearance-none cursor-pointer ${
                        errors.petId ? "border-red-400 dark:border-red-600" : "border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {petList.map((p) => {
                        const petId = p._id || p.id;
                        return (
                        <option key={petId} value={petId}>
                          {p.name} — {p.type}
                        </option>
                        );
                      })}
                      <option value="">Other / Add later</option>
                    </select>
                    {errors.petId && <div className="text-xs text-red-600 dark:text-red-400 font-medium">{errors.petId}</div>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Service Type *
                    </label>
                    <select
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className={`w-full rounded-xl border-2 px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 dark:focus:border-amber-400 transition-all duration-200 shadow-sm appearance-none cursor-pointer ${
                        errors.service ? "border-red-400 dark:border-red-600" : "border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {SERVICE_OPTIONS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label} — {formatCurrency(s.price)}
                        </option>
                      ))}
                    </select>
                    {selectedService && (
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1">
                        <span>{selectedService.icon}</span>
                        {selectedService.desc}
                      </div>
                    )}
                    {errors.service && <div className="text-xs text-red-600 dark:text-red-400 font-medium">{errors.service}</div>}
                  </div>

                  {(selectedService?.id === "boarding" || selectedService?.id === "daycare") ? (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {selectedService.id === "boarding" ? "Nights" : "Days"} *
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={form.qty}
                        onChange={(e) => setForm({ ...form, qty: Math.max(1, Number(e.target.value || 1)) })}
                        className={`w-full rounded-xl border-2 px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 dark:focus:border-amber-400 transition-all duration-200 shadow-sm ${
                          errors.qty ? "border-red-400 dark:border-red-600" : "border-slate-200 dark:border-slate-700"
                        }`}
                      />
                      {errors.qty && <div className="text-xs text-red-600 dark:text-red-400 font-medium">{errors.qty}</div>}
                    </div>
                  ) : (
                    <div className="hidden sm:block" />
                  )}
                </div>
              </div>

              {/* Date & Time */}
              <div className="space-y-4 pt-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>📅</span>
                  Schedule
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      min={new Date().toISOString().slice(0, 10)}
                      className={`w-full rounded-xl border-2 px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 dark:focus:border-amber-400 transition-all duration-200 shadow-sm ${
                        errors.date ? "border-red-400 dark:border-red-600" : "border-slate-200 dark:border-slate-700"
                      }`}
                    />
                    {errors.date && <div className="text-xs text-red-600 dark:text-red-400 font-medium">{errors.date}</div>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Time *
                    </label>
                    <input
                      type="time"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      className={`w-full rounded-xl border-2 px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 dark:focus:border-amber-400 transition-all duration-200 shadow-sm ${
                        errors.time ? "border-red-400 dark:border-red-600" : "border-slate-200 dark:border-slate-700"
                      }`}
                    />
                    {errors.time && <div className="text-xs text-red-600 dark:text-red-400 font-medium">{errors.time}</div>}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2 pt-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 px-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 dark:focus:border-amber-400 transition-all duration-200 shadow-sm resize-y"
                  placeholder="Any special instructions, health notes, or requirements..."
                />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-6 border-t-2 border-slate-200 dark:border-slate-700">
                <button
                  type="submit"
                  disabled={busy}
                  className={`px-6 py-3 rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                    busy
                      ? "bg-amber-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                  }`}
                >
                  {busy ? (isEdit ? "Submitting..." : "Booking...") : (isEdit ? "Submit Change Request" : "Request Booking")}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setForm({ ...form, date: "", time: "", notes: "", qty: 1 });
                    setErrors({});
                  }}
                  className="px-5 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold transition-all duration-200"
                >
                  Reset Form
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar - Service Info & Estimate */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-6 space-y-4 sm:space-y-6">
            {/* Service Cards */}
            <div className="card p-4 sm:p-5 md:p-6">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                <span>💼</span>
                Available Services
              </h3>
              <div className="space-y-2 sm:space-y-3">
              {SERVICE_OPTIONS.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setForm({ ...form, service: service.id })}
                  className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    form.service === service.id
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-md"
                      : "border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-600 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg sm:text-xl flex-shrink-0">{service.icon}</span>
                        <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">{service.label}</span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 ml-6 sm:ml-7">{service.desc}</div>
                    </div>
                    <div className="font-bold text-sm sm:text-base text-amber-600 dark:text-amber-400 flex-shrink-0">{formatCurrency(service.price)}</div>
                  </div>
                </button>
              ))}
              </div>
            </div>

            {/* Estimate Card */}
            <div className="card p-4 sm:p-5 md:p-6 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/20 border-2 border-amber-200 dark:border-amber-700/50">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                <span>💰</span>
                Cost Estimate
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Service</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedService?.label}</span>
                </div>
                {selectedService && (selectedService.id === "boarding" || selectedService.id === "daycare") && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                      {selectedService.id === "boarding" ? "Nights" : "Days"}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">{form.qty}</span>
                  </div>
                )}
                <div className="pt-4 mt-4 border-t-2 border-amber-200 dark:border-amber-700/50">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">Total</span>
                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{formatCurrency(estimate)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Card */}
            <div className="card p-6 bg-slate-50 dark:bg-slate-800/50">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <span>ℹ️</span>
                Need Help?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Have questions about our services or booking process?
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
