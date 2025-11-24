import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { fetchPet, fetchAdoption, fetchSurrender, fetchBooking, updatePet, deletePet, updateAdoptionStatus, updateSurrenderStatus, updateBooking, fetchAdminUsers } from "../../services/api";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { getImageUrlWithFallback } from "../../utils/helpers/imageUrl";
import ImageUrlInput from "../../components/ui/ImageUrlInput";

export default function AdminViewItem() {
    useDocumentTitle("Admin View");
    const { type, id } = useParams(); // /admin/view/:type/:id
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [item, setItem] = useState(null);
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // For pet edit modal
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingPet, setEditingPet] = useState(null);
    const [petForm, setPetForm] = useState({
        _id: "",
        name: "",
        type: "Dog",
        breed: "",
        age: "",
        gender: "Male",
        location: "",
        image: "",
        description: "",
        featured: false,
    });
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const loadItem = async () => {
            try {
                setLoading(true);
                setError("");
                let response;
                if (type === "pet") {
                    response = await fetchPet(id);
                    setItem(response.data.pet);
                    setPet(response.data.pet);
                } else if (type === "request") {
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
                } else if (type === "surrender") {
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
                } else if (type === "user") {
                    // Fetch all users and find the one with matching ID
                    response = await fetchAdminUsers();
                    const users = response.data.users || [];
                    const foundUser = users.find(u => (u._id || u.id) === id);
                    if (foundUser) {
                        setItem(foundUser);
                    } else {
                        setError("User not found");
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
            <div className="max-w-4xl mx-auto py-12 px-4">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow text-center">
                    <p className="text-slate-600 dark:text-slate-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow text-center">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Not found</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        {error || `No ${type} with id ${id} was found.`}
                    </p>
                    <div className="flex justify-center gap-3">
                        <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Go back</button>
                        <Link to="/admin" className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600">Admin dashboard</Link>
                    </div>
                </div>
            </div>
        );
    }

    // --- Pet handlers ---
    const openEditPet = (petItem) => {
        const petId = petItem._id || petItem.id;
        setEditingPet(petId);
        setPetForm({
            _id: petId,
            name: petItem.name || "",
            type: petItem.type || "Dog",
            breed: petItem.breed || "",
            age: petItem.age || "",
            gender: petItem.gender || "Male",
            location: petItem.location || "",
            image: petItem.image || "",
            description: petItem.description || "",
            featured: !!petItem.featured,
        });
        setImageUrl(petItem.image || "");
        setIsEditOpen(true);
    };


    const savePet = async (e) => {
        e?.preventDefault();
        if (!petForm.name.trim()) return alert("Name is required");

        try {
            const petId = petForm._id;
            
            // Prepare pet data with image URL from jsDelivr
            const petData = {
                name: petForm.name.trim(),
                type: petForm.type,
                breed: petForm.breed?.trim() || "",
                age: petForm.age || "",
                gender: petForm.gender,
                location: petForm.location?.trim() || "",
                description: petForm.description?.trim() || "",
                featured: petForm.featured || false,
                image: imageUrl || petForm.image // Use new image URL or keep existing
            };
            
            await updatePet(petId, petData);
            
            alert("Pet saved successfully");
            setIsEditOpen(false);
            setImageUrl("");
            // Reload item
            const response = await fetchPet(petId);
            setItem(response.data.pet);
            setPet(response.data.pet);
        } catch (err) {
            alert(err?.message || "Failed to save pet");
        }
    };

    const toggleFeature = async (petId) => {
        try {
            const currentPet = item;
            const updatedPet = { ...currentPet, featured: !currentPet.featured };
            await updatePet(petId, updatedPet);
            setItem(updatedPet);
            setPet(updatedPet);
            alert(`${currentPet?.name || "Pet"} ${updatedPet.featured ? "marked featured" : "unfeatured"}`);
        } catch (err) {
            alert(err?.message || "Failed to update feature status");
        }
    };

    const handleDeletePet = async (petId) => {
        if (!confirm("Delete this pet? This cannot be undone.")) return;
        try {
            await deletePet(petId);
            alert("Pet deleted successfully");
            navigate("/admin");
        } catch (err) {
            alert(err?.message || "Failed to delete pet");
        }
    };

    // --- Request handlers ---
    const requestAction = async (requestId, action) => {
        try {
            await updateAdoptionStatus(requestId, action);
            setItem((prev) => ({ ...prev, status: action }));
            alert(`Request ${action} successfully`);
        } catch (err) {
            alert(err?.message || `Failed to ${action} request`);
        }
    };

    // --- Surrender handlers ---
    const surrenderAction = async (sId, action) => {
        try {
            await updateSurrenderStatus(sId, action);
            setItem((prev) => ({ ...prev, status: action }));
            alert(`Surrender ${action} successfully`);
        } catch (err) {
            alert(err?.message || `Failed to ${action} surrender`);
        }
    };

    // --- Booking handlers ---
    const bookingAction = async (bId, action) => {
        try {
            await updateBooking(bId, { status: action });
            setItem((prev) => ({ ...prev, status: action }));
            alert(`Booking ${action} successfully`);
        } catch (err) {
            alert(err?.message || `Failed to ${action} booking`);
        }
    };

    // small helper values
    const itemId = item._id || item.id;
    const petImage = (pet && pet.image) || item.image;
    
    // Handle image URL - use utility function for consistent handling
    // Note: imageUrl is already used as state for edit modal, so we use displayImageUrl here
    const displayImageUrl = getImageUrlWithFallback(petImage, 'https://via.placeholder.com/600x400/e2e8f0/64748b?text=Pet+Image');

    // Render admin view
    return (
        <main className="max-w-5xl mx-auto py-8 px-4">
            <header className="flex items-start justify-between mb-4">
                <div>
                    <button onClick={() => navigate(-1)} className="px-3 py-1 rounded-md border mr-2">← Back</button>
                    <h1 className="inline-block text-2xl font-semibold text-slate-900 dark:text-white ml-2">Admin — {type.charAt(0).toUpperCase() + type.slice(1)} Details</h1>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">ID: {id}</div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-sm text-slate-600 dark:text-slate-300">{user?.name} • Admin</div>
                    <button onClick={() => logout()} className="px-3 py-1 border rounded hover:bg-slate-50 dark:hover:bg-slate-800">Logout</button>
                </div>
            </header>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Left column: image & basic */}
                <div className="md:col-span-1">
                    {type !== "user" && (
                        <div className="w-full h-56 rounded overflow-hidden border border-slate-100 dark:border-slate-700">
                            <img 
                                src={displayImageUrl} 
                                alt={item.name || item.petName || "image"} 
                                className="w-full h-full object-cover"
                                crossOrigin="anonymous"
                                onError={(e) => {
                                    console.warn('Image load error for item:', item.name || item.petName, 'URL:', displayImageUrl);
                                    e.target.src = 'https://via.placeholder.com/600x400/e2e8f0/64748b?text=Pet+Image';
                                }}
                            />
                        </div>
                    )}
                    {type === "user" && (
                        <div className="w-full h-56 rounded overflow-hidden border border-slate-100 dark:border-slate-700 bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                            <span className="text-6xl font-bold text-white">{(item.name || "U")[0].toUpperCase()}</span>
                        </div>
                    )}

                    <div className="mt-3 space-y-2">
                        <div>
                            <div className="text-sm text-slate-500 dark:text-slate-300">Type</div>
                            <div className="font-medium text-slate-900 dark:text-white">{item.type || item.service || (pet && pet.type) || "-"}</div>
                        </div>

                        <div>
                            <div className="text-sm text-slate-500 dark:text-slate-300">Status</div>
                            <div className="font-semibold mt-1 text-amber-700">{item.status || "-"}</div>
                        </div>

                        {type === "pet" && (
                            <div className="flex gap-2 mt-2">
                                <button onClick={() => openEditPet(item)} className="px-3 py-1 rounded border">Edit</button>
                                <button onClick={() => toggleFeature(itemId)} className={`px-3 py-1 rounded ${item.featured ? "bg-amber-500 text-white" : "border"}`}>
                                    {item.featured ? "Unfeature" : "Feature"}
                                </button>
                                <button onClick={() => handleDeletePet(itemId)} className="px-3 py-1 rounded bg-red-50 text-red-600 border hover:bg-red-100">Delete</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right column: details */}
                <div className="md:col-span-2 space-y-3">
                    {/* Title / primary */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{item.name || item.petName || item.service}</h2>
                            <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.breed || item.type || item.user || ""}</div>
                        </div>

                        <div className="text-right">
                            <div className="text-sm text-slate-500">Created</div>
                            <div className="font-medium text-slate-900 dark:text-white mt-1">{item.createdAt || item.submittedAt || item.appliedAt || "—"}</div>
                        </div>
                    </div>

                    {/* Meta rows */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {type === "request" && (
                            <>
                                <div>
                                    <div className="text-sm text-slate-500">Applicant</div>
                                    <div className="font-medium text-slate-900 dark:text-white">{item.applicant}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-slate-500">Applied on</div>
                                    <div className="font-medium text-slate-900 dark:text-white">{item.appliedAt ? new Date(item.appliedAt).toLocaleDateString() : item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}</div>
                                </div>
                            </>
                        )}

                        {type === "surrender" && (
                            <>
                                <div>
                                    <div className="text-sm text-slate-500">Owner contact</div>
                                    <div className="font-medium text-slate-900 dark:text-white">{item.contact || "—"}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-slate-500">Submitted</div>
                                    <div className="font-medium text-slate-900 dark:text-white">{item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}</div>
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
                                    <div className="font-medium text-slate-900 dark:text-white">{item.date ? new Date(item.date).toLocaleDateString() : "-"} • {item.time || "-"}</div>
                                </div>
                            </>
                        )}

                        {type === "pet" && (
                            <>
                                <div>
                                    <div className="text-sm text-slate-500">Breed / Age</div>
                                    <div className="font-medium text-slate-900 dark:text-white">{item.breed || "Unknown"} • {item.age || "-"}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-slate-500">Location</div>
                                    <div className="font-medium text-slate-900 dark:text-white">{item.location || "-"}</div>
                                </div>
                            </>
                        )}

                        {type === "user" && (
                            <>
                                <div>
                                    <div className="text-sm text-slate-500">Email</div>
                                    <div className="font-medium text-slate-900 dark:text-white">{item.email || "-"}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-slate-500">Role</div>
                                    <div className="font-medium text-slate-900 dark:text-white">{item.role || "user"}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-slate-500">Phone</div>
                                    <div className="font-medium text-slate-900 dark:text-white">{item.phone || "-"}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-slate-500">City</div>
                                    <div className="font-medium text-slate-900 dark:text-white">{item.city || "-"}</div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Description / notes */}
                    <div>
                        <div className="text-sm text-slate-500">Notes / Description</div>
                        <div className="mt-1 text-sm text-slate-700 dark:text-slate-200">{item.notes || item.description || "No additional notes."}</div>
                    </div>

                    {/* Admin actions */}
                    <div className="flex items-center gap-3 mt-2">
                        {type === "request" && (
                            <>
                                {item.status !== "Approved" && <button onClick={() => requestAction(itemId, "Approved")} className="px-4 py-2 rounded bg-green-50 text-green-600 border hover:bg-green-100 transition">Approve</button>}
                                {item.status !== "Rejected" && <button onClick={() => requestAction(itemId, "Rejected")} className="px-4 py-2 rounded bg-red-50 text-red-600 border hover:bg-red-100 transition">Reject</button>}
                                <button onClick={() => navigate(`/admin/view/request/${itemId}`)} className="px-4 py-2 rounded border">View application</button>
                            </>
                        )}

                        {type === "surrender" && (
                            <>
                                {item.status !== "Processed" && <button onClick={() => surrenderAction(itemId, "Processed")} className="px-4 py-2 rounded bg-green-50 text-green-600 border hover:bg-green-100 transition">Mark Processed</button>}
                                <button onClick={() => navigate(`/admin/view/surrender/${itemId}`)} className="px-4 py-2 rounded border">View details</button>
                            </>
                        )}

                        {type === "booking" && (
                            <>
                                {item.status !== "Confirmed" && <button onClick={() => bookingAction(itemId, "Confirmed")} className="px-4 py-2 rounded bg-green-50 text-green-600 border hover:bg-green-100 transition">Confirm</button>}
                                {item.status !== "Cancelled" && <button onClick={() => bookingAction(itemId, "Cancelled")} className="px-4 py-2 rounded bg-red-50 text-red-600 border hover:bg-red-100 transition">Cancel</button>}
                                <button onClick={() => navigate("/book-service", { state: { booking: item } })} className="px-4 py-2 rounded border">Request change</button>
                            </>
                        )}

                        {type === "pet" && (
                            <>
                                <button onClick={() => openEditPet(item)} className="px-4 py-2 rounded border">Edit</button>
                                <button onClick={() => toggleFeature(itemId)} className={`px-4 py-2 rounded ${item.featured ? "bg-amber-500 text-white" : "border"}`}>{item.featured ? "Unfeature" : "Feature"}</button>
                                <button onClick={() => handleDeletePet(itemId)} className="px-4 py-2 rounded bg-red-50 text-red-600 border hover:bg-red-100 transition">Delete</button>
                            </>
                        )}

                        {type === "user" && (
                            <>
                                <button onClick={() => navigate("/admin")} className="px-4 py-2 rounded border">Back to Users</button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit pet modal */}
            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-2xl p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">{editingPet ? "Edit pet" : "Add pet"}</h3>
                            <button onClick={() => setIsEditOpen(false)} className="text-sm px-2 py-1 border rounded">Close</button>
                        </div>

                        <form onSubmit={savePet} className="mt-4 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm">Name</label>
                                    <input value={petForm.name} onChange={(e) => setPetForm({ ...petForm, name: e.target.value })} className="mt-1 w-full border rounded px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" required />
                                </div>
                                <input type="hidden" value={petForm._id} />
                                <div>
                                    <label className="block text-sm">Type</label>
                                    <select value={petForm.type} onChange={(e) => setPetForm({ ...petForm, type: e.target.value })} className="mt-1 w-full border rounded px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                                        <option>Dog</option><option>Cat</option><option>Bird</option><option>Rabbit</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm">Breed</label>
                                    <input value={petForm.breed} onChange={(e) => setPetForm({ ...petForm, breed: e.target.value })} className="mt-1 w-full border rounded px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm">Age</label>
                                    <input value={petForm.age} onChange={(e) => setPetForm({ ...petForm, age: e.target.value })} className="mt-1 w-full border rounded px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm">Location</label>
                                <input value={petForm.location} onChange={(e) => setPetForm({ ...petForm, location: e.target.value })} className="mt-1 w-full border rounded px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
                            </div>

                            <div>
                                <ImageUrlInput
                                    value={imageUrl || petForm.image || ""}
                                    onChange={(url) => {
                                        setImageUrl(url);
                                        setPetForm({ ...petForm, image: url });
                                    }}
                                    label="Image URL"
                                    placeholder="Enter jsDelivr CDN URL or image URL"
                                    required={false}
                                />
                            </div>

                            <div>
                                <label className="block text-sm">Description</label>
                                <textarea value={petForm.description} onChange={(e) => setPetForm({ ...petForm, description: e.target.value })} rows={3} className="mt-1 w-full border rounded px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"></textarea>
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="inline-flex items-center gap-2">
                                    <input type="checkbox" checked={petForm.featured} onChange={(e) => setPetForm({ ...petForm, featured: e.target.checked })} />
                                    <span className="text-sm">Featured</span>
                                </label>

                                <div className="ml-auto flex gap-2">
                                    <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600">Save</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
