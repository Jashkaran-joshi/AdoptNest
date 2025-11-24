import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchAdoption, fetchSurrender, fetchBooking, fetchPet, updateAdoptionStatus, cancelBooking } from "../../services/api";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { siteInfo } from "../../config/siteInfo";
import { getImageUrlWithFallback } from "../../utils/helpers/imageUrl";

export default function ViewItem() {
  useDocumentTitle("View Details");
  const { type, id } = useParams(); // e.g. type="booking", id="b1"
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [pet, setPet] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadItem = async () => {
      try {
        setLoading(true);
        setError("");
        let response;
        if (type === "request") {
          response = await fetchAdoption(id);
          setItem(response.data.adoption);
          if (response.data.adoption.petId) {
            try {
              const petRes = await fetchPet(response.data.adoption.petId);
              setPet(petRes.data.pet);
            } catch (err) {
              console.error("Error loading pet:", err);
            }
          }
        } else if (type === "given") {
          response = await fetchSurrender(id);
          setItem(response.data.surrender);
        } else if (type === "booking") {
          response = await fetchBooking(id);
          setItem(response.data.booking);
          if (response.data.booking.petId) {
            try {
              const petRes = await fetchPet(response.data.booking.petId);
              setPet(petRes.data.pet);
            } catch (err) {
              console.error("Error loading pet:", err);
            }
          }
        }
      } catch (err) {
        setError(err?.message || "Failed to load item");
        console.error("Error loading item:", err);
      } finally {
        setLoading(false);
      }
    };
    loadItem();
  }, [type, id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow text-center">
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow text-center">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Not found</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            {error || `No ${type} with id ${id} was found.`}
          </p>
          <div className="flex justify-center gap-3">
            <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Go back</button>
            <Link to="/dashboard" className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600">Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  const petId = item.petId || item.pet?._id || item.pet?.id;
  const petName = pet?.name || item.petName || item.name || "Unknown Pet";
  const petImg = pet?.image || item.image;
  
  // Handle image URL - use utility function for consistent handling
  const imageUrl = getImageUrlWithFallback(petImg, 'https://via.placeholder.com/600x400/e2e8f0/64748b?text=Pet+Image');

  const cancelRequest = async () => {
    if (!window.confirm("Cancel this adoption request?")) return;
    setBusy(true);
    try {
      await updateAdoptionStatus(id, "Cancelled");
      setItem((prev) => ({ ...prev, status: "Cancelled" }));
      alert("Request cancelled successfully");
    } catch (err) {
      alert(err?.message || "Failed to cancel request");
    } finally {
      setBusy(false);
    }
  };

  const removeGiven = async () => {
    if (!window.confirm("Remove this given pet from your list?")) return;
    setBusy(true);
    try {
      // Surrenders can't be deleted, just navigate away
      navigate("/dashboard");
    } catch (err) {
      alert(err?.message || "Failed to remove");
    } finally {
      setBusy(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!window.confirm("Cancel this booking?")) return;
    setBusy(true);
    try {
      await cancelBooking(id);
      setItem((prev) => ({ ...prev, status: "Cancelled" }));
      alert("Booking cancelled successfully");
    } catch (err) {
      alert(err?.message || "Failed to cancel booking");
    } finally {
      setBusy(false);
    }
  };

  const contactShelter = () => {
    const subject = encodeURIComponent(`Inquiry about ${petName} - ${type === "request" ? "Adoption Request" : type === "given" ? "Given Pet" : "Booking"}`);
    const body = encodeURIComponent(`Hello,\n\nI would like to get in touch regarding ${petName} (${type}: ${id}).\n\nPlease contact me at your earliest convenience.\n\nThank you!`);
    window.location.href = `mailto:${siteInfo.contact.email}?subject=${subject}&body=${body}`;
  };

  const requestChange = () => {
    // navigate to BookService with the entire booking item to pre-fill the form
    navigate("/book-service", { state: { booking: item } });
  };

  const headerTitle =
    type === "request" ? "Adoption Request" :
    type === "given" ? "Given Pet" :
    type === "booking" ? "Booking Details" : "Details";

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="inline-block text-2xl font-semibold text-slate-900 dark:text-white ">{headerTitle}</h1>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{type} • ID: {id}</div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => window.print()} className="px-3 py-1 rounded-md border text-sm">Print</button>
          <button onClick={() => contactShelter()} className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-md">Contact Shelter</button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left: image + location */}
        <div className="md:col-span-1">
          <div className="w-full h-56 rounded overflow-hidden border border-slate-100 dark:border-slate-700">
            <img 
              src={imageUrl} 
              alt={petName} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x400/e2e8f0/64748b?text=Pet+Image';
              }}
            />
          </div>

          <div className="mt-3">
            <div className="text-sm text-slate-600 dark:text-slate-300">Location</div>
            <div className="font-medium text-slate-900 dark:text-white">{pet?.location || item.location || "Not specified"}</div>
          </div>
        </div>

        {/* Right: details */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{petName}</h2>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{pet?.breed || item.breed || "Unknown breed"} • {pet?.age || item.age || "-"} yrs • {pet?.gender || item.gender || "-"}</div>
            </div>

            <div className="text-right">
              <div className="text-sm text-slate-500 dark:text-slate-400">Status</div>
              <div className={`mt-1 font-semibold ${item.status === "Approved" ? "text-green-600" : item.status === "Pending" ? "text-amber-500" : "text-red-600"}`}>{item.status}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {type === "request" && (
              <>
                <div>
                  <div className="text-sm text-slate-500">Applicant</div>
                  <div className="font-medium text-slate-900 dark:text-white">{item.applicant}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Applied</div>
                  <div className="font-medium text-slate-900 dark:text-white">{item.appliedAt ? new Date(item.appliedAt).toLocaleDateString() : item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}</div>
                </div>
              </>
            )}

            {type === "booking" && (
              <>
                <div>
                  <div className="text-sm text-slate-500">Service</div>
                  <div className="font-medium text-slate-900 dark:text-white">{item.service}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">When</div>
                  <div className="font-medium text-slate-900 dark:text-white">{item.date} • {item.time}</div>
                </div>
              </>
            )}

            {type === "given" && (
              <>
                <div>
                  <div className="text-sm text-slate-500">Given on</div>
                  <div className="font-medium text-slate-900 dark:text-white">{item.givenAt ? new Date(item.givenAt).toLocaleDateString() : item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Contact</div>
                  <div className="font-medium text-slate-900 dark:text-white">{item.contact || "jashkaranjoshi@gmail.com"}</div>
                </div>
              </>
            )}
          </div>

          <div>
            <div className="text-sm text-slate-500">Notes</div>
            <div className="mt-1 text-sm text-slate-700 dark:text-slate-200">{item.notes || item.reason || pet?.description || item.description || "No additional notes available."}</div>
          </div>

          <div className="flex items-center gap-3 mt-3">
            {type === "request" && (
              <>
                {item.status === "Pending" ? (
                  <button onClick={cancelRequest} disabled={busy} className="px-4 py-2 rounded bg-red-50 text-red-600 border hover:bg-red-100 transition">{busy ? "Cancelling..." : "Cancel Request"}</button>
                ) : (
                  <button onClick={() => navigate(`/dashboard/view/request/${id}`)} className="px-4 py-2 rounded border">View details</button>
                )}
                <button onClick={contactShelter} className="px-4 py-2 rounded bg-amber-500 text-white hover:bg-amber-600 transition">Contact Shelter</button>
              </>
            )}

            {type === "booking" && (
              <>
                {item.status !== "Cancelled" && <button onClick={handleCancelBooking} disabled={busy} className="px-4 py-2 rounded bg-red-50 text-red-600 border hover:bg-red-100 transition">{busy ? "Cancelling..." : "Cancel Booking"}</button>}
                <button onClick={requestChange} className="px-4 py-2 rounded border">Request change</button>
              </>
            )}

            {type === "given" && (
              <>
                <button onClick={removeGiven} disabled={busy} className="px-4 py-2 rounded bg-red-50 text-red-600 border hover:bg-red-100 transition">{busy ? "Removing..." : "Remove from my given list"}</button>
                <button onClick={contactShelter} className="px-4 py-2 rounded bg-amber-500 text-white hover:bg-amber-600 transition">Contact Shelter</button>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
