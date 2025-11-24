import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { fetchAdminUsers, updateAdminUser } from "../../services/api";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function AdminUsers() {
    useDocumentTitle("User Management");
    const { user } = useAuth();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All"); // All, active, suspended, admin
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUsers = async () => {
            if (!user?.isAdmin) return;
            try {
                setLoading(true);
                const response = await fetchAdminUsers();
                setUsers(response.data.users || []);
            } catch (err) {
                console.error("Error loading users:", err);
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, [user]);

    const filteredUsers = users.filter((u) => {
        if (filter !== "All" && u.status !== filter && u.role !== filter && u.isAdmin !== (filter === "admin")) return false;
        if (search) {
            const searchLower = search.toLowerCase();
            return (
                u.name?.toLowerCase().includes(searchLower) ||
                u.email?.toLowerCase().includes(searchLower)
            );
        }
        return true;
    });

    const handleStatusChange = async (userId, newStatus) => {
        try {
            await updateAdminUser(userId, { status: newStatus });
            setUsers((prev) => prev.map((u) => ((u._id || u.id) === userId ? { ...u, status: newStatus } : u)));
            alert(`User status changed to ${newStatus}`);
        } catch (err) {
            alert(err?.message || "Failed to update user status");
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateAdminUser(userId, { role: newRole, isAdmin: newRole === "admin" });
            setUsers((prev) => prev.map((u) => ((u._id || u.id) === userId ? { ...u, role: newRole, isAdmin: newRole === "admin" } : u)));
            alert(`User role changed to ${newRole}`);
        } catch (err) {
            alert(err?.message || "Failed to update user role");
        }
    };

    return (
        <main className="container mx-auto px-4 py-10">
            <Breadcrumbs customItems={{ "/admin/users": "User Management" }} />
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <Link to="/admin" className="text-amber-500 hover:underline text-sm mb-2 block">← Back to Admin</Link>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">User Management</h1>
                    <p className="text-slate-600 dark:text-slate-400">Manage users, roles, and account status</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="mb-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-300 outline-none"
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-300 outline-none"
                    >
                        <option value="All">All Users</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="admin">Admins</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Adoptions</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        Loading users...
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((u) => {
                                    const userId = u._id || u.id;
                                    const userRole = u.role || (u.isAdmin ? "admin" : "user");
                                    return (
                                        <tr key={userId} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="font-medium text-slate-900 dark:text-white">{u.name}</div>
                                                    <div className="text-sm text-slate-500 dark:text-slate-400">{u.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={userRole}
                                                    onChange={(e) => handleRoleChange(userId, e.target.value)}
                                                    className="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                                                    disabled={userId === (user?._id || user?.id)}
                                                >
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={u.status || "active"}
                                                    onChange={(e) => handleStatusChange(userId, e.target.value)}
                                                    className={`px-2 py-1 rounded border text-sm ${
                                                        (u.status || "active") === "active"
                                                            ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300"
                                                            : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300"
                                                    }`}
                                                    disabled={userId === (user?._id || user?.id)}
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="suspended">Suspended</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-white">{u.adoptions || 0}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : u.joinedAt || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() => navigate(`/admin/view/user/${userId}`)}
                                                    className="text-amber-500 hover:text-amber-600 dark:hover:text-amber-400"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}

