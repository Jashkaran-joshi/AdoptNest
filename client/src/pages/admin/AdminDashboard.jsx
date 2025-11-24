import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
    fetchPets, fetchAdoptions, fetchSurrenders, fetchBookings, fetchAdminStats, fetchAdminUsers, createPet, updatePet, deletePet,
    fetchStories, createStory, updateStory, deleteStory,
    fetchVolunteers, createVolunteer, updateVolunteer, deleteVolunteer,
    fetchDonationContacts, createDonationContact, updateDonationContact, deleteDonationContact,
    fetchBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost,
    fetchContactMessages, markMessageRead
} from "../../services/api";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { getImageUrlWithFallback } from "../../utils/helpers/imageUrl";
import ImageUrlInput from "../../components/ui/ImageUrlInput";
import { scrollToTop } from "../../utils/scrollToTop";

export default function AdminDashboard() {
    useDocumentTitle("Admin Dashboard");
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState("pets");

    // Data state
    const [pets, setPets] = useState([]);
    const [requests, setRequests] = useState([]);
    const [surrenders, setSurrenders] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({
        totalPets: 0,
        availablePets: 0,
        adoptionRequests: 0,
        pendingRequests: 0,
        surrenders: 0,
        bookings: 0,
        totalUsers: 0,
        activeUsers: 0,
        unreadMessages: 0,
    });
    const [successStories, setSuccessStories] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [donationContacts, setDonationContacts] = useState([]);
    const [blogPosts, setBlogPosts] = useState([]);
    const [contactMessages, setContactMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch data on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [
                    petsRes, adoptionsRes, surrendersRes, bookingsRes, usersRes, statsRes,
                    storiesRes, volunteersRes, donationContactsRes, blogRes, contactRes
                ] = await Promise.all([
                    fetchPets("?limit=100"),
                    fetchAdoptions(),
                    fetchSurrenders(),
                    fetchBookings(),
                    fetchAdminUsers(),
                    fetchAdminStats(),
                    fetchStories(),
                    fetchVolunteers(),
                    fetchDonationContacts(),
                    fetchBlogPosts(),
                    fetchContactMessages()
                ]);

                setPets(petsRes.data.pets || []);
                setRequests(adoptionsRes.data.adoptions || []);
                setSurrenders(surrendersRes.data.surrenders || []);
                setBookings(bookingsRes.data.bookings || []);
                setUsers(usersRes.data.users || []);
                setSuccessStories(storiesRes.data.stories || []);
                setVolunteers(volunteersRes.data.volunteers || []);
                setDonationContacts(donationContactsRes.data.contacts || []);
                setBlogPosts(blogRes.data.posts || []);
                setContactMessages(contactRes.data.messages || []);
                if (statsRes.data.stats) {
                    setStats(statsRes.data.stats);
                }
            } catch (err) {
                console.error("Error loading admin data:", err);
            } finally {
                setLoading(false);
            }
        };
        if (user?.isAdmin) {
            loadData();
        }
    }, [user]);

    // Modal / form state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null); // 'pet', 'story', 'blog', etc.
    const [editingItem, setEditingItem] = useState(null);
    const [form, setForm] = useState({});
    const [imageUrl, setImageUrl] = useState(""); // jsDelivr CDN image URL for all forms

    // Search and filters
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    
    // Pagination for pets grid
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9; // Show 9 images per page (3x3 grid)

    // Helper function to get ID from item (handles both _id and id)
    const getItemId = (item) => item._id || item.id;

    // Stats are now fetched from API, but we can add computed ones
    const computedStats = useMemo(() => ({
        ...stats,
        successStories: successStories.length,
        volunteers: volunteers.length,
        donationContacts: donationContacts.length,
        blogPosts: blogPosts.length,
    }), [stats, successStories, volunteers, donationContacts, blogPosts]);

    // Actions
    const openAdd = (type) => {
        setModalType(type);
        setEditingItem(null);
        setForm(getDefaultForm(type));
        setImageUrl(null);
        setIsModalOpen(true);
    };

    const openEdit = (type, item) => {
        setModalType(type);
        setEditingItem(getItemId(item));
        setForm({ ...item });
        setImageUrl(item.image || null); // Set existing image URL if available
        setIsModalOpen(true);
    };

    const getDefaultForm = (type) => {
        const defaults = {
            pet: { name: "", type: "Dog", breed: "", age: "", gender: "Male", location: "", description: "", status: "Available", ageGroup: "Young", featured: false },
            story: { petName: "", petType: "Dog", adopterName: "", location: "", story: "", image: "", adoptedDate: "", rating: 5, published: true },
            blog: { title: "", slug: "", category: "Care", author: "", date: new Date().toISOString().split('T')[0], readTime: "5 min", image: "", excerpt: "", content: "" },
            "donation-contact": { name: "", email: "", phone: "", purpose: "general", message: "", status: "new" },
        };
        return defaults[type] || {};
    };

    const handleImageUrlChange = (url) => {
        setImageUrl(url);
        setForm({ ...form, image: url });
    };

    const handleSave = async (e) => {
        e?.preventDefault();
        if (!form.name && !form.petName && !form.title) {
            alert("Required fields missing");
            return;
        }

        if (modalType === "pet") {
            // For new pets, require image upload
            if (!editingItem) {
                if (!imageUrl) {
                    alert("Please upload an image");
                    return;
                }
                try {
                    const petData = {
                        name: form.name.trim(),
                        type: form.type,
                        breed: form.breed?.trim() || "",
                        age: form.age || "",
                        gender: form.gender,
                        location: form.location?.trim() || "",
                        description: form.description?.trim() || "",
                        status: form.status || "Available",
                        ageGroup: form.ageGroup || "",
                        featured: form.featured || false,
                        image: imageUrl // jsDelivr CDN URL
                    };

                    await createPet(petData);
                    // Refresh pets list
                    const petsRes = await fetchPets("?limit=100");
                    setPets(petsRes.data.pets || []);
                } catch (err) {
                    console.error("Error creating pet:", err);
                    alert(err?.message || "Failed to create pet. Try again.");
                    return;
                }
            } else {
                // For editing, send update with image URL if changed
                try {
                    const petData = {
                        ...form,
                        image: imageUrl || form.image
                    };
                    await updatePet(editingItem, petData);
                    // Refresh pets list
                    const petsRes = await fetchPets("?limit=100");
                    setPets(petsRes.data.pets || []);
                } catch (err) {
                    console.error("Error updating pet:", err);
                    alert(err?.message || "Failed to update pet. Try again.");
                    return;
                }
            }
        } else if (modalType === "story") {
            try {
                const storyData = {
                    ...form,
                    image: imageUrl || form.image
                };

                if (editingItem) {
                    await updateStory(editingItem, storyData);
                    } else {
                    if (!imageUrl && !form.image) {
                        alert("Please upload an image");
                        return;
                    }
                    await createStory(storyData);
                    }
                    const storiesRes = await fetchStories();
                    setSuccessStories(storiesRes.data.stories || []);
            } catch (err) {
                console.error("Error saving story:", err);
                alert(err?.message || "Failed to save story. Try again.");
                return;
            }
        } else if (modalType === "blog") {
            try {
                const blogData = {
                    ...form,
                    image: imageUrl || form.image
                };

                if (editingItem) {
                    await updateBlogPost(editingItem, blogData);
                    } else {
                    await createBlogPost(blogData);
                    }
                    const blogRes = await fetchBlogPosts();
                    setBlogPosts(blogRes.data.posts || []);
            } catch (err) {
                console.error("Error saving blog post:", err);
                alert(err?.message || "Failed to save blog post. Try again.");
                return;
            }
        } else if (modalType === "volunteer") {
            try {
                if (editingItem) {
                    await updateVolunteer(editingItem, form);
                    const volunteersRes = await fetchVolunteers();
                    setVolunteers(volunteersRes.data.volunteers || []);
                } else {
                    await createVolunteer(form);
                    const volunteersRes = await fetchVolunteers();
                    setVolunteers(volunteersRes.data.volunteers || []);
                }
            } catch (err) {
                console.error("Error saving volunteer:", err);
                alert(err?.message || "Failed to save volunteer. Try again.");
                return;
            }
        } else if (modalType === "donation-contact") {
            try {
                if (editingItem) {
                    await updateDonationContact(editingItem, form);
                    const donationContactsRes = await fetchDonationContacts();
                    setDonationContacts(donationContactsRes.data.contacts || []);
                } else {
                    await createDonationContact(form);
                    const donationContactsRes = await fetchDonationContacts();
                    setDonationContacts(donationContactsRes.data.contacts || []);
                }
            } catch (err) {
                console.error("Error saving donation contact:", err);
                alert(err?.message || "Failed to save donation contact. Try again.");
                return;
            }
        }

        setIsModalOpen(false);
        setForm({});
        setEditingItem(null);
        setImageUrl(null);
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm("Delete this item? This action cannot be undone.")) return;
        
        try {
            if (type === "pet") {
                await deletePet(id);
                const petsRes = await fetchPets("?limit=100");
                setPets(petsRes.data.pets || []);
            } else if (type === "story") {
                await deleteStory(id);
                const storiesRes = await fetchStories();
                setSuccessStories(storiesRes.data.stories || []);
            } else if (type === "volunteer") {
                await deleteVolunteer(id);
                const volunteersRes = await fetchVolunteers();
                setVolunteers(volunteersRes.data.volunteers || []);
            } else if (type === "donation-contact") {
                await deleteDonationContact(id);
                const donationContactsRes = await fetchDonationContacts();
                setDonationContacts(donationContactsRes.data.contacts || []);
            } else if (type === "blog") {
                await deleteBlogPost(id);
                const blogRes = await fetchBlogPosts();
                setBlogPosts(blogRes.data.posts || []);
            } else {
                // For other types, just update local state (they may not have delete endpoints)
                if (type === "request") setRequests((prev) => prev.filter((r) => getItemId(r) !== id));
                else if (type === "surrender") setSurrenders((prev) => prev.filter((s) => getItemId(s) !== id));
                else if (type === "booking") setBookings((prev) => prev.filter((b) => getItemId(b) !== id));
                else if (type === "user") setUsers((prev) => prev.filter((u) => getItemId(u) !== id));
                else if (type === "contact") setContactMessages((prev) => prev.filter((m) => getItemId(m) !== id));
            }
        } catch (err) {
            console.error("Error deleting item:", err);
            alert(err?.message || "Failed to delete item. Try again.");
        }
    };

    const handleStatusChange = async (type, id, newStatus) => {
        try {
            if (type === "volunteer") {
                await updateVolunteer(id, { status: newStatus });
                const volunteersRes = await fetchVolunteers();
                setVolunteers(volunteersRes.data.volunteers || []);
            } else if (type === "story") {
                await updateStory(id, { published: newStatus === "Published" });
                const storiesRes = await fetchStories();
                setSuccessStories(storiesRes.data.stories || []);
            } else {
                // For other types, update local state (they may use different API endpoints)
                if (type === "request") setRequests((prev) => prev.map((r) => (getItemId(r) === id ? { ...r, status: newStatus } : r)));
                else if (type === "surrender") setSurrenders((prev) => prev.map((s) => (getItemId(s) === id ? { ...s, status: newStatus } : s)));
                else if (type === "booking") setBookings((prev) => prev.map((b) => (getItemId(b) === id ? { ...b, status: newStatus } : b)));
                else if (type === "user") setUsers((prev) => prev.map((u) => (getItemId(u) === id ? { ...u, status: newStatus } : u)));
                else if (type === "pet") setPets((prev) => prev.map((p) => (getItemId(p) === id ? { ...p, status: newStatus } : p)));
            }
        } catch (err) {
            console.error("Error updating status:", err);
            alert(err?.message || "Failed to update status. Try again.");
        }
    };

    const handleRoleChange = (userId, newRole) => {
        setUsers((prev) => prev.map((u) => (getItemId(u) === userId ? { ...u, role: newRole } : u)));
    };

    const handleMarkMessageRead = async (id) => {
        try {
            await markMessageRead(id);
            const contactRes = await fetchContactMessages();
            setContactMessages(contactRes.data.messages || []);
        } catch (err) {
            console.error("Error marking message as read:", err);
            alert(err?.message || "Failed to mark message as read. Try again.");
        }
    };

    const getStatusBadge = (status, type = "default") => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold";
        if (type === "pet") {
            if (status === "Adopted") return `${baseClasses} bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300`;
            if (status === "Pending") return `${baseClasses} bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300`;
            return `${baseClasses} bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300`;
        }
        if (status === "Approved" || status === "Confirmed" || status === "Processed" || status === "Published") {
            return `${baseClasses} bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300`;
        }
        if (status === "Pending" || status === "Received" || status === "unread") {
            return `${baseClasses} bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300`;
        }
        return `${baseClasses} bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300`;
    };

    const formatCurrency = (n) => n ? `₹${n.toLocaleString("en-IN")}` : "₹0";

    // Filter data based on search and status
    const filteredData = useMemo(() => {
        let data = [];
        if (tab === "pets") data = pets;
        else if (tab === "requests") data = requests;
        else if (tab === "surrenders") data = surrenders;
        else if (tab === "bookings") data = bookings;
        else if (tab === "users") data = users;
        else if (tab === "stories") data = successStories;
        else if (tab === "volunteers") data = volunteers;
        else if (tab === "donation-contacts") data = donationContacts;
        else if (tab === "blog") data = blogPosts;
        else if (tab === "contact") data = contactMessages;

        if (statusFilter !== "All") {
            data = data.filter(item => item.status === statusFilter);
        }
        if (search) {
            const searchLower = search.toLowerCase();
            data = data.filter(item => {
                const searchable = Object.values(item).join(" ").toLowerCase();
                return searchable.includes(searchLower);
            });
        }
        return data;
    }, [tab, statusFilter, search, pets, requests, surrenders, bookings, users, successStories, volunteers, donationContacts, blogPosts, contactMessages]);

    // Pagination for pets
    const paginatedPets = useMemo(() => {
        if (tab !== "pets") return filteredData;
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage, tab, itemsPerPage]);

    const totalPages = useMemo(() => {
        if (tab !== "pets") return 1;
        return Math.ceil(filteredData.length / itemsPerPage);
    }, [filteredData.length, tab, itemsPerPage]);

    // Reset to page 1 when tab or filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [tab, statusFilter, search]);

    const imgFallback = "https://via.placeholder.com/400x300/e2e8f0/64748b?text=Image";

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 max-w-7xl">
            {/* Header Section */}
            <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Admin Dashboard</h1>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Manage all aspects of AdoptNest rescue operations</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name || "Admin"}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Administrator</div>
                        </div>
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-base sm:text-lg font-bold shadow-lg ring-2 ring-amber-200 dark:ring-amber-800">
                            {user?.name?.[0]?.toUpperCase() || "A"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
                <div className="card p-3 sm:p-4 md:p-5 hover:shadow-lg transition-shadow">
                    <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1 sm:mb-2 font-medium truncate">Total Pets</div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">{computedStats.totalPets}</div>
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium truncate">{computedStats.availablePets} available</div>
                </div>
                <div className="card p-3 sm:p-4 md:p-5 hover:shadow-lg transition-shadow">
                    <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-2 font-medium">Adoption Requests</div>
                    <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">{computedStats.adoptionRequests}</div>
                    <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">{computedStats.pendingRequests} pending</div>
                </div>
                <div className="card p-3 sm:p-4 md:p-5 hover:shadow-lg transition-shadow">
                    <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-2 font-medium">Total Users</div>
                    <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">{computedStats.totalUsers}</div>
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium">{computedStats.activeUsers} active</div>
                </div>
                <div className="card p-3 sm:p-4 md:p-5 hover:shadow-lg transition-shadow">
                    <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-2 font-medium">Donation Inquiries</div>
                    <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1 truncate">{donationContacts.length}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{donationContacts.filter(d => d.status === "new").length} new</div>
                </div>
                <div className="card p-3 sm:p-4 md:p-5 hover:shadow-lg transition-shadow">
                    <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-2 font-medium">Blog Posts</div>
                    <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{computedStats.blogPosts}</div>
                </div>
                <div className="card p-3 sm:p-4 md:p-5 hover:shadow-lg transition-shadow">
                    <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-2 font-medium">Messages</div>
                    <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">{contactMessages.length}</div>
                    <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">{computedStats.unreadMessages} unread</div>
                </div>
            </div>

            {/* Tabs Navigation - Responsive Grid Layout */}
            <div className="card p-4 sm:p-5 mb-6">
                <div className="flex flex-col gap-4">
                    {/* Responsive Grid Tabs - No Horizontal Scroll */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-11 gap-2 sm:gap-3">
                        {[
                            { id: "pets", label: "🐾 Pets", shortLabel: "🐾", count: pets.length },
                            { id: "requests", label: "📋 Requests", shortLabel: "📋", count: requests.length },
                            { id: "surrenders", label: "💝 Surrenders", shortLabel: "💝", count: surrenders.length },
                            { id: "bookings", label: "📅 Bookings", shortLabel: "📅", count: bookings.length },
                            { id: "users", label: "👥 Users", shortLabel: "👥", count: users.length },
                            { id: "stories", label: "⭐ Stories", shortLabel: "⭐", count: successStories.length },
                            { id: "volunteers", label: "🤝 Volunteers", shortLabel: "🤝", count: volunteers.length },
                            { id: "donation-contacts", label: "💰 Donations", shortLabel: "💰", count: donationContacts.length },
                            { id: "blog", label: "📝 Blog", shortLabel: "📝", count: blogPosts.length },
                            { id: "contact", label: "📧 Messages", shortLabel: "📧", count: contactMessages.length, badge: computedStats.unreadMessages },
                            { id: "analytics", label: "📊 Analytics", shortLabel: "📊", count: null },
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id)}
                                className={`relative px-3 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all flex flex-col items-center justify-center gap-1.5 ${
                                    tab === t.id
                                        ? "bg-amber-500 text-white shadow-lg ring-2 ring-amber-200 dark:ring-amber-800"
                                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                                }`}
                            >
                                <span className="text-lg sm:text-xl">{t.shortLabel}</span>
                                <span className="hidden md:inline truncate w-full text-center text-[10px] sm:text-xs">{t.label.replace(t.shortLabel + " ", "")}</span>
                                {t.badge > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full font-bold shadow-md">
                                        {t.badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                    {/* Add Button */}
                    <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-700">
                        {(tab === "pets" || tab === "stories" || tab === "blog") && (
                            <button
                                onClick={() => openAdd(tab === "pets" ? "pet" : tab === "stories" ? "story" : "blog")}
                                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold transition shadow-md hover:shadow-lg"
                            >
                                + Add {tab === "pets" ? "Pet" : tab === "stories" ? "Story" : "Post"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="card p-4 sm:p-5 mb-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                        className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all min-w-[140px]"
                    >
                        <option value="All">All Status</option>
                        {tab === "requests" && <>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </>}
                        {tab === "bookings" && <>
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Cancelled">Cancelled</option>
                        </>}
                        {tab === "users" && <>
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                        </>}
                        {tab === "volunteers" && <>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </>}
                    </select>
                </div>
            </div>

            {/* Content Card */}
            <div className="card overflow-hidden">
                {/* Render content based on active tab */}
                {tab === "pets" && (
                    <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                All Pets ({filteredData.length})
                            </h2>
                            {filteredData.length > 0 && (
                                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                    Page {currentPage} of {totalPages}
                                </div>
                            )}
                        </div>
                        {filteredData.length === 0 ? (
                            <div className="text-center py-8 sm:py-12">
                                <p className="text-slate-600 dark:text-slate-400 mb-4">No pets found.</p>
                                <button onClick={() => openAdd("pet")} className="px-4 sm:px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm sm:text-base font-medium transition">
                                    Add First Pet
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Responsive Grid - Single column on mobile, 2 on tablet, 3 on desktop */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6">
                                    {paginatedPets.map((p) => (
                                        <div 
                                            key={getItemId(p)} 
                                            className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-300 flex flex-col"
                                        >
                                            {/* Image Section with Status Badge */}
                                            <div className="relative w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                                                {/* Mobile: Horizontal image, Desktop: Square */}
                                                <div className="aspect-[4/3] sm:aspect-square">
                                                    <img 
                                                        src={getImageUrlWithFallback(p.image, imgFallback)} 
                                                        alt={p.name} 
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                        onError={(e) => {
                                                            e.target.src = imgFallback;
                                                        }}
                                                    />
                                                </div>
                                                {/* Status Badge Overlay */}
                                                <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                                                    <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-lg ${
                                                        (p.status || "Available") === "Available" 
                                                            ? "bg-green-500 text-white" 
                                                            : (p.status || "Available") === "Pending"
                                                            ? "bg-amber-500 text-white"
                                                            : "bg-slate-600 text-white"
                                                    }`}>
                                                        {p.status || "Available"}
                                                    </span>
                                                </div>
                                                {/* Gradient Overlay on Hover */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>
                                            
                                            {/* Content Section - Compact on Mobile */}
                                            <div className="p-3 sm:p-4 lg:p-5 flex-1 flex flex-col">
                                                {/* Pet Info - Compact Header */}
                                                <div className="mb-2 sm:mb-3 lg:mb-4">
                                                    <div className="flex items-start justify-between gap-2 mb-1.5 sm:mb-2">
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-bold text-base sm:text-lg lg:text-xl text-slate-900 dark:text-white mb-0.5 sm:mb-1 line-clamp-1">
                                                                {p.name}
                                                            </h3>
                                                            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 line-clamp-1">
                                                                {p.breed || "Unknown Breed"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Additional Info Tags - Compact */}
                                                    {(p.type || p.age || p.gender) && (
                                                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                                            {p.type && (
                                                                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                                                                    {p.type}
                                                                </span>
                                                            )}
                                                            {p.age && (
                                                                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                                                                    {p.age}
                                                                </span>
                                                            )}
                                                            {p.gender && (
                                                                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                                                                    {p.gender}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Status Select Dropdown - Compact */}
                                                <div className="mb-2 sm:mb-3 lg:mb-4">
                                                    <select
                                                        value={p.status || "Available"}
                                                        onChange={(e) => handleStatusChange("pet", getItemId(p), e.target.value)}
                                                        className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 font-medium bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition shadow-sm"
                                                    >
                                                        <option value="Available">Available</option>
                                                        <option value="Pending">Pending</option>
                                                        <option value="Adopted">Adopted</option>
                                                    </select>
                                                </div>
                                                
                                                {/* Action Buttons - Compact and Responsive */}
                                                <div className="grid grid-cols-3 gap-2 pt-2 sm:pt-3 border-t border-slate-200 dark:border-slate-700">
                                                    <button 
                                                        onClick={() => openEdit("pet", p)} 
                                                        className="flex flex-col items-center justify-center px-2 py-2 sm:py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-400 dark:hover:border-amber-600 hover:text-amber-600 dark:hover:text-amber-400 transition active:scale-95"
                                                        title="Edit Pet"
                                                    >
                                                        <span className="text-base sm:text-lg mb-0.5">✏️</span>
                                                        <span className="text-[10px] sm:text-xs font-medium">Edit</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => navigate(`/admin/view/pet/${getItemId(p)}`)} 
                                                        className="flex flex-col items-center justify-center px-2 py-2 sm:py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 transition active:scale-95"
                                                        title="View Details"
                                                    >
                                                        <span className="text-base sm:text-lg mb-0.5">👁️</span>
                                                        <span className="text-[10px] sm:text-xs font-medium">View</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete("pet", getItemId(p))} 
                                                        className="flex flex-col items-center justify-center px-2 py-2 sm:py-2.5 rounded-lg bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50 transition active:scale-95"
                                                        title="Delete Pet"
                                                    >
                                                        <span className="text-base sm:text-lg mb-0.5">🗑️</span>
                                                        <span className="text-[10px] sm:text-xs font-medium">Delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 sm:gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                                        <button
                                            onClick={() => {
                                                setCurrentPage(prev => Math.max(1, prev - 1));
                                                scrollToTop();
                                            }}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                        >
                                            Previous
                                        </button>
                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                let pageNum;
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (currentPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (currentPage >= totalPages - 2) {
                                                    pageNum = totalPages - 4 + i;
                                                } else {
                                                    pageNum = currentPage - 2 + i;
                                                }
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => {
                                                            setCurrentPage(pageNum);
                                                            scrollToTop();
                                                        }}
                                                        className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition ${
                                                            currentPage === pageNum
                                                                ? "bg-amber-500 text-white shadow-md ring-2 ring-amber-200 dark:ring-amber-800"
                                                                : "border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <button
                                            onClick={() => {
                                                setCurrentPage(prev => Math.min(totalPages, prev + 1));
                                                scrollToTop();
                                            }}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* Other tabs - similar structure but condensed for space */}
                {tab === "requests" && (
                    <div className="p-4 sm:p-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">Adoption Requests ({filteredData.length})</h2>
                        <div className="space-y-4">
                            {filteredData.map((r) => (
                                <div key={getItemId(r)} className="card p-4 sm:p-5 hover:shadow-lg transition-shadow">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                                                <h3 className="font-semibold text-sm sm:text-base md:text-lg text-slate-900 dark:text-white">{r.petName}</h3>
                                                <span className={getStatusBadge(r.status)}>{r.status}</span>
                                            </div>
                                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 break-words">Applicant: {r.applicant} • {r.email}</p>
                                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Applied: {r.appliedAt}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                                            {r.status !== "Approved" && (
                                                <button onClick={() => handleStatusChange("request", getItemId(r), "Approved")} className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-green-50 text-green-600 border border-green-200 dark:bg-green-900/30 dark:text-green-300 text-xs sm:text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/50 transition">
                                                    Approve
                                                </button>
                                            )}
                                            {r.status !== "Rejected" && (
                                                <button onClick={() => handleStatusChange("request", getItemId(r), "Rejected")} className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/30 dark:text-red-300 text-xs sm:text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition">
                                                    Reject
                                                </button>
                                            )}
                                            <button onClick={() => navigate(`/admin/view/request/${getItemId(r)}`)} className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                                                View
                                            </button>
                                            <button onClick={() => handleDelete("request", getItemId(r))} className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/30 dark:text-red-300 text-xs sm:text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Surrenders */}
                {tab === "surrenders" && (
                    <div className="p-4 sm:p-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">Surrender Requests ({filteredData.length})</h2>
                        <div className="space-y-4">
                            {filteredData.map((s) => (
                                <div key={getItemId(s)} className="card p-4 sm:p-5 hover:shadow-lg transition-shadow">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                                                <h3 className="font-semibold text-sm sm:text-base md:text-lg text-slate-900 dark:text-white">{s.name}</h3>
                                                <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">({s.type})</span>
                                                <span className={getStatusBadge(s.status)}>{s.status}</span>
                                            </div>
                                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 break-words">Reason: {s.reason}</p>
                                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 break-words">Contact: {s.contact} • {s.phone}</p>
                                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Submitted: {s.submittedAt}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                                            {s.status !== "Processed" && (
                                                <button onClick={() => handleStatusChange("surrender", getItemId(s), "Processed")} className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-green-50 text-green-600 border border-green-200 dark:bg-green-900/30 dark:text-green-300 text-xs sm:text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/50 transition">
                                                    Mark Processed
                                                </button>
                                            )}
                                            <button onClick={() => navigate(`/admin/view/surrender/${getItemId(s)}`)} className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                                                View
                                            </button>
                                            <button onClick={() => handleDelete("surrender", getItemId(s))} className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/30 dark:text-red-300 text-xs sm:text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Bookings */}
                {tab === "bookings" && (
                    <div className="p-4 sm:p-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">Care Bookings ({filteredData.length})</h2>
                        <div className="space-y-4">
                            {filteredData.map((b) => (
                                <div key={getItemId(b)} className="card p-4 sm:p-5 hover:shadow-lg transition-shadow">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                                                <h3 className="font-semibold text-sm sm:text-base md:text-lg text-slate-900 dark:text-white">{b.service}</h3>
                                                <span className={getStatusBadge(b.status)}>{b.status}</span>
                                            </div>
                                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 break-words">{b.petName} • {b.user} • {b.email}</p>
                                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{b.date} at {b.time} • {formatCurrency(b.amount)}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                                            {b.status !== "Confirmed" && (
                                                <button onClick={() => handleStatusChange("booking", getItemId(b), "Confirmed")} className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-green-50 text-green-600 border border-green-200 dark:bg-green-900/30 dark:text-green-300 text-xs sm:text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/50 transition">
                                                    Confirm
                                                </button>
                                            )}
                                            {b.status !== "Cancelled" && (
                                                <button onClick={() => handleStatusChange("booking", getItemId(b), "Cancelled")} className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/30 dark:text-red-300 text-xs sm:text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition">
                                                    Cancel
                                                </button>
                                            )}
                                            <button onClick={() => navigate(`/admin/view/booking/${getItemId(b)}`)} className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                                                View
                                            </button>
                                            <button onClick={() => handleDelete("booking", getItemId(b))} className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/30 dark:text-red-300 text-xs sm:text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Users - Mobile Responsive */}
                {tab === "users" && (
                    <div className="p-4 sm:p-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">User Management ({filteredData.length})</h2>
                        {/* Mobile: Card Layout */}
                        <div className="block md:hidden space-y-3">
                            {filteredData.map((u) => (
                                <div key={getItemId(u)} className="card p-4 space-y-3">
                                    <div>
                                        <div className="font-medium text-sm text-slate-900 dark:text-white">{u.name}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">{u.email}</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Role</label>
                                            <select value={u.role} onChange={(e) => handleRoleChange(getItemId(u), e.target.value)} className="w-full px-2 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs" disabled={getItemId(u) === getItemId(user)}>
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Status</label>
                                            <select value={u.status} onChange={(e) => handleStatusChange("user", getItemId(u), e.target.value)} className={`w-full px-2 py-1.5 rounded border text-xs ${u.status === "active" ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300" : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300"}`} disabled={getItemId(u) === getItemId(user)}>
                                                <option value="active">Active</option>
                                                <option value="suspended">Suspended</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-600 dark:text-slate-400">Adoptions: <strong className="text-slate-900 dark:text-white">{u.adoptions}</strong></span>
                                        <span className="text-slate-600 dark:text-slate-400">Joined: {u.joinedAt}</span>
                                    </div>
                                    <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                                        <button onClick={() => navigate(`/admin/view/user/${getItemId(u)}`)} className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition">View</button>
                                        {getItemId(u) !== getItemId(user) && (
                                            <button onClick={() => handleDelete("user", getItemId(u))} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/30 dark:text-red-300 text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition">Delete</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Desktop: Table Layout - Responsive */}
                        <div className="hidden md:block w-full overflow-hidden">
                            <div className="w-full overflow-x-hidden">
                                <table className="w-full table-auto">
                                <thead className="bg-slate-50 dark:bg-slate-900">
                                    <tr>
                                        <th className="px-3 lg:px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">User</th>
                                        <th className="px-3 lg:px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Role</th>
                                        <th className="px-3 lg:px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Status</th>
                                        <th className="px-3 lg:px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Adoptions</th>
                                        <th className="px-3 lg:px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Joined</th>
                                        <th className="px-3 lg:px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {filteredData.map((u) => (
                                        <tr key={getItemId(u)} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                                            <td className="px-3 lg:px-4 py-3">
                                                <div className="font-medium text-sm text-slate-900 dark:text-white truncate">{u.name}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{u.email}</div>
                                            </td>
                                            <td className="px-3 lg:px-4 py-3">
                                                <select value={u.role} onChange={(e) => handleRoleChange(getItemId(u), e.target.value)} className="w-full max-w-[100px] px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs" disabled={getItemId(u) === getItemId(user)}>
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                            <td className="px-3 lg:px-4 py-3">
                                                <select value={u.status} onChange={(e) => handleStatusChange("user", getItemId(u), e.target.value)} className={`w-full max-w-[120px] px-2 py-1 rounded border text-xs ${u.status === "active" ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300" : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300"}`} disabled={getItemId(u) === getItemId(user)}>
                                                    <option value="active">Active</option>
                                                    <option value="suspended">Suspended</option>
                                                </select>
                                            </td>
                                            <td className="px-3 lg:px-4 py-3 text-sm text-slate-900 dark:text-white">{u.adoptions}</td>
                                            <td className="px-3 lg:px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{u.joinedAt}</td>
                                            <td className="px-3 lg:px-4 py-3 text-xs">
                                                <div className="flex flex-col sm:flex-row gap-1">
                                                    <button onClick={() => navigate(`/admin/view/user/${getItemId(u)}`)} className="text-amber-500 hover:text-amber-600 dark:hover:text-amber-400">View</button>
                                                    {getItemId(u) !== getItemId(user) && (
                                                        <button onClick={() => handleDelete("user", getItemId(u))} className="text-red-500 hover:text-red-600 dark:hover:text-red-400">Delete</button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Stories */}
                {tab === "stories" && (
                    <div className="p-4 sm:p-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">Success Stories ({filteredData.length})</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredData.map((s) => {
                                const storyImageUrl = getImageUrlWithFallback(s.image, imgFallback);
                                return (
                                <div key={getItemId(s)} className="card p-5">
                                    <div className="flex gap-4 mb-3">
                                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                                            <img 
                                                src={storyImageUrl} 
                                                alt={s.petName || "Success story"} 
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.src = imgFallback; }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-1">{s.petName}</h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{s.petType} • Adopted by {s.adopterName}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{s.adoptedDate ? new Date(s.adoptedDate).toLocaleDateString() : "N/A"}</p>
                                            <span className={getStatusBadge(s.published ? "Published" : "Draft")}>{s.published ? "Published" : "Draft"}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 line-clamp-2">{s.story}</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit("story", s)} className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                                            Edit
                                        </button>
                                        <button onClick={() => handleStatusChange("story", getItemId(s), s.published ? "Draft" : "Published")} className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                                            {s.published ? "Unpublish" : "Publish"}
                                        </button>
                                        <button onClick={() => handleDelete("story", getItemId(s))} className="px-3 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/30 dark:text-red-300 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Volunteers */}
                {tab === "volunteers" && (
                    <div className="p-4 sm:p-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">Volunteer Applications ({filteredData.length})</h2>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Volunteer Applications ({filteredData.length})</h2>
                        <div className="space-y-4">
                            {filteredData.map((v) => (
                                <div key={getItemId(v)} className="card p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{v.name}</h3>
                                                <span className="text-sm px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">{v.type === "volunteer" ? "Volunteer" : "Foster"}</span>
                                                <span className={getStatusBadge(v.status)}>{v.status}</span>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{v.email} • {v.phone}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">City: {v.city} • Submitted: {v.submittedAt}</p>
                                        </div>
                                    </div>
                                    <div className="mb-3 space-y-2">
                                        <p className="text-sm"><strong>Availability:</strong> {v.availability}</p>
                                        {v.experience && <p className="text-sm"><strong>Experience:</strong> {v.experience}</p>}
                                        <p className="text-sm"><strong>Why:</strong> {v.why}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {v.status !== "Approved" && (
                                            <button onClick={() => handleStatusChange("volunteer", v.id, "Approved")} className="px-4 py-2 rounded-lg bg-green-50 text-green-600 border border-green-200 dark:bg-green-900/30 dark:text-green-300 text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/50 transition">
                                                Approve
                                            </button>
                                        )}
                                        {v.status !== "Rejected" && (
                                            <button onClick={() => handleStatusChange("volunteer", v.id, "Rejected")} className="px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/30 dark:text-red-300 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition">
                                                Reject
                                            </button>
                                        )}
                                        <button onClick={() => handleDelete("volunteer", v.id)} className="px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/30 dark:text-red-300 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Donation Contacts */}
                {tab === "donation-contacts" && (
                    <div className="p-4 sm:p-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">Donation Inquiries ({filteredData.length})</h2>
                        <div className="space-y-4">
                            {filteredData.map((d) => {
                                const itemId = getItemId(d);
                                return (
                                    <div key={itemId} className="card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{d.name}</h3>
                                                <span className={`text-xs px-2 py-1 rounded ${
                                                    d.status === "new" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" :
                                                    d.status === "contacted" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" :
                                                    d.status === "completed" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" :
                                                    "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                                                }`}>{d.status}</span>
                                                <span className="text-sm px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">{d.purpose}</span>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{d.email}</p>
                                            {d.phone && <p className="text-sm text-slate-600 dark:text-slate-400">Phone: {d.phone}</p>}
                                            <p className="text-sm text-slate-600 dark:text-slate-400">Date: {new Date(d.createdAt).toLocaleDateString()}</p>
                                            {d.message && <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Message: {d.message}</p>}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => openEdit("donation-contact", d)} className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete("donation-contact", itemId)} className="px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/30 dark:text-red-300 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Blog Posts */}
                {tab === "blog" && (
                    <div className="p-4 sm:p-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">Blog Posts ({filteredData.length})</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredData.map((p) => {
                                const blogImageUrl = getImageUrlWithFallback(p.image, imgFallback);
                                return (
                                <div key={getItemId(p)} className="card p-5">
                                    {p.image && (
                                        <div className="w-full h-40 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 mb-3">
                                            <img src={blogImageUrl} alt={p.title} className="w-full h-full object-cover" onError={(e) => { e.target.src = imgFallback; }} />
                                        </div>
                                    )}
                                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">{p.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{p.category} • {p.author} • {p.date}</p>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 line-clamp-2">{p.excerpt}</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit("blog", p)} className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                                            Edit
                                        </button>
                                        <button onClick={() => {
                                          const postSlug = p.slug || p._id || p.id;
                                          if (postSlug) {
                                            navigate(`/blog/${encodeURIComponent(postSlug)}`);
                                          }
                                        }} className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                                            View
                                        </button>
                                        <button onClick={() => handleDelete("blog", getItemId(p))} className="px-3 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/30 dark:text-red-300 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Contact Messages */}
                {tab === "contact" && (
                    <div className="p-4 sm:p-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">Contact Messages ({filteredData.length})</h2>
                        <div className="space-y-4">
                            {filteredData.map((m) => (
                                <div key={getItemId(m)} className={`card p-5 ${m.status === "unread" ? "border-2 border-amber-500" : ""}`}>
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{m.name}</h3>
                                                <span className={getStatusBadge(m.status)}>{m.status}</span>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{m.email}</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">Date: {m.date}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">{m.message}</p>
                                    <div className="flex gap-2">
                                        {m.status === "unread" && (
                                            <button onClick={() => handleMarkMessageRead(getItemId(m))} className="px-4 py-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 text-sm font-medium hover:bg-amber-100 dark:hover:bg-amber-900/50 transition">
                                                Mark Read
                                            </button>
                                        )}
                                        <a href={`mailto:${m.email}`} className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition">
                                            Reply
                                        </a>
                                        <button onClick={() => handleDelete("contact", getItemId(m))} className="px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/30 dark:text-red-300 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Analytics */}
                {tab === "analytics" && (
                    <div className="p-4 sm:p-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">Analytics Dashboard</h2>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Analytics & Reports</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="card p-6">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Adoption Statistics</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Total Adoptions</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{pets.filter(p => p.status === "Adopted").length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Pending Requests</span>
                                        <span className="font-bold text-amber-600 dark:text-amber-400">{computedStats.pendingRequests}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Approved Requests</span>
                                        <span className="font-bold text-green-600 dark:text-green-400">{requests.filter(r => r.status === "Approved").length}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="card p-6">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">User Statistics</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Total Users</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{computedStats.totalUsers}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Active Users</span>
                                        <span className="font-bold text-green-600 dark:text-green-400">{computedStats.activeUsers}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Suspended Users</span>
                                        <span className="font-bold text-red-600 dark:text-red-400">{users.filter(u => u.status === "suspended").length}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="card p-6">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Financial Overview</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Total Inquiries</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{donationContacts.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">New Inquiries</span>
                                        <span className="font-bold text-amber-600 dark:text-amber-400">{donationContacts.filter(d => d.status === "new").length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Contacted</span>
                                        <span className="font-bold text-blue-600 dark:text-blue-400">{donationContacts.filter(d => d.status === "contacted").length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Completed</span>
                                        <span className="font-bold text-green-600 dark:text-green-400">{donationContacts.filter(d => d.status === "completed").length}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="card p-6">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Content Statistics</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Blog Posts</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{computedStats.blogPosts}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Success Stories</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{computedStats.successStories}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Published Stories</span>
                                        <span className="font-bold text-green-600 dark:text-green-400">{successStories.filter(s => s.published).length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card p-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                                    <span className="text-slate-600 dark:text-slate-400">New adoption requests this month</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">{requests.length}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                                    <span className="text-slate-600 dark:text-slate-400">New bookings this month</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">{bookings.length}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                                    <span className="text-slate-600 dark:text-slate-400">Volunteer applications</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">{volunteers.length}</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-slate-600 dark:text-slate-400">Unread messages</span>
                                    <span className="font-semibold text-amber-600 dark:text-amber-400">{computedStats.unreadMessages}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="card w-full max-w-2xl p-6 max-h-[90vh] overflow-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                {editingItem ? `Edit ${modalType}` : `Add ${modalType}`}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            {modalType === "pet" && (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name *</label>
                                            <input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Type</label>
                                            <select value={form.type || "Dog"} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition">
                                                <option>Dog</option>
                                                <option>Cat</option>
                                                <option>Bird</option>
                                                <option>Rabbit</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Breed</label>
                                            <input value={form.breed || ""} onChange={(e) => setForm({ ...form, breed: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Age</label>
                                            <input value={form.age || ""} onChange={(e) => setForm({ ...form, age: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gender</label>
                                            <select value={form.gender || "Male"} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition">
                                                <option>Male</option>
                                                <option>Female</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Location</label>
                                            <input value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Age Group</label>
                                            <select value={form.ageGroup || "Young"} onChange={(e) => setForm({ ...form, ageGroup: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition">
                                                <option>Young</option>
                                                <option>Adult</option>
                                                <option>Senior</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
                                            <select value={form.status || "Available"} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition">
                                                <option>Available</option>
                                                <option>Pending</option>
                                                <option>Adopted</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <ImageUrlInput
                                            value={imageUrl || form.image || ""}
                                            onChange={handleImageUrlChange}
                                            label="Image URL"
                                            placeholder="Enter jsDelivr CDN URL or image URL"
                                            required={!editingItem}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
                                        <textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="4" className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition" />
                                    </div>
                                </>
                            )}

                            {modalType === "story" && (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Pet Name *</label>
                                            <input value={form.petName || ""} onChange={(e) => setForm({ ...form, petName: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Pet Type</label>
                                            <select value={form.petType || "Dog"} onChange={(e) => setForm({ ...form, petType: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition">
                                                <option>Dog</option>
                                                <option>Cat</option>
                                                <option>Bird</option>
                                                <option>Rabbit</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Adopter Name *</label>
                                            <input value={form.adopterName || ""} onChange={(e) => setForm({ ...form, adopterName: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Location</label>
                                            <input value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Adopted Date</label>
                                            <input type="date" value={form.adoptedDate || ""} onChange={(e) => setForm({ ...form, adoptedDate: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Rating</label>
                                            <select value={form.rating || 5} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition">
                                                {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <ImageUrlInput
                                            value={imageUrl || form.image || ""}
                                            onChange={handleImageUrlChange}
                                            label="Image URL"
                                            placeholder="Enter jsDelivr CDN URL or image URL"
                                            required={false}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Story *</label>
                                        <textarea value={form.story || ""} onChange={(e) => setForm({ ...form, story: e.target.value })} rows="6" className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition" required />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={form.published !== false} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="h-4 w-4 text-amber-500" />
                                            <span className="text-sm text-slate-700 dark:text-slate-300">Published</span>
                                        </label>
                                    </div>
                                </>
                            )}

                            {modalType === "donation-contact" && (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Name *</label>
                                            <input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email *</label>
                                            <input type="email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone</label>
                                            <input type="tel" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Purpose *</label>
                                            <select value={form.purpose || "general"} onChange={(e) => setForm({ ...form, purpose: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition" required>
                                                <option value="general">General Donation</option>
                                                <option value="sponsor-pet">Sponsor a Pet</option>
                                                <option value="monthly-support">Monthly Support</option>
                                                <option value="one-time">One-time Donation</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
                                            <select value={form.status || "new"} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition">
                                                <option value="new">New</option>
                                                <option value="contacted">Contacted</option>
                                                <option value="completed">Completed</option>
                                                <option value="archived">Archived</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                                        <textarea value={form.message || ""} onChange={(e) => setForm({ ...form, message: e.target.value })} rows="4" className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition" />
                                    </div>
                                </>
                            )}

                            {modalType === "blog" && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title *</label>
                                        <input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition" required />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
                                            <select value={form.category || "Care"} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition">
                                                <option>Care</option>
                                                <option>Health</option>
                                                <option>Adoption</option>
                                                <option>Behavior</option>
                                                <option>Nutrition</option>
                                                <option>Training</option>
                                                <option>Community</option>
                                                <option>Success</option>
                                                <option>Policy</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Author</label>
                                            <input value={form.author || ""} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date</label>
                                            <input type="date" value={form.date || ""} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Read Time</label>
                                            <input value={form.readTime || "5 min"} onChange={(e) => setForm({ ...form, readTime: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition" />
                                        </div>
                                    </div>
                                    <div>
                                        <ImageUrlInput
                                            value={imageUrl || form.image || ""}
                                            onChange={handleImageUrlChange}
                                            label="Image URL"
                                            placeholder="Enter jsDelivr CDN URL or image URL"
                                            required={false}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Excerpt</label>
                                        <textarea value={form.excerpt || ""} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows="3" className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Content</label>
                                        <textarea value={form.content || ""} onChange={(e) => setForm({ ...form, content: e.target.value })} rows="8" className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none transition" />
                                    </div>
                                </>
                            )}

                            <div className="flex items-center justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                                    Cancel
                                </button>
                                <button type="submit" className="px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium transition shadow-sm">
                                    {editingItem ? "Save Changes" : "Add"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
