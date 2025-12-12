"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Plus, Edit2, Trash2, X, Save, Shield } from "lucide-react";

export default function RolesPage() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        permissions: {
            blogCreate: false,
            blogEdit: false,
            blogDelete: false,
            blogPublish: false,
            blogView: false,
            categoryManage: false,
            tagManage: false,
            mediaUpload: false,
            mediaDelete: false,
            mediaView: false,
            seoManage: false,
            redirectManage: false,
            userManage: false,
            roleManage: false,
            auditView: false,
            settingsManage: false,
        },
    });

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const res = await fetch("/api/roles", {
                cache: "no-store",
            });
            const data = await res.json();

            if (data.success) {
                setRoles(data.roles || []);
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            toast.error("Failed to load roles");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Role name is required");
            return;
        }

        try {
            const url = editingId ? `/api/roles/${editingId}` : "/api/roles";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await res.json();

            if (result.success) {
                toast.success(result.message);
                setShowAddForm(false);
                setEditingId(null);
                setFormData({
                    name: "",
                    description: "",
                    permissions: {
                        blogCreate: false,
                        blogEdit: false,
                        blogDelete: false,
                        blogPublish: false,
                        blogView: false,
                        categoryManage: false,
                        tagManage: false,
                        mediaUpload: false,
                        mediaDelete: false,
                        mediaView: false,
                        seoManage: false,
                        redirectManage: false,
                        userManage: false,
                        roleManage: false,
                        auditView: false,
                        settingsManage: false,
                    },
                });
                fetchRoles();
            } else {
                toast.error(result.message || "Failed to save role");
            }
        } catch (error) {
            console.error("Error saving role:", error);
            toast.error("Something went wrong");
        }
    };

    const handleEdit = (role) => {
        setEditingId(role._id);
        setFormData({
            name: role.name,
            description: role.description || "",
            permissions: role.permissions || {},
        });
        setShowAddForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this role?")) return;

        try {
            const res = await fetch(`/api/roles/${id}`, {
                method: "DELETE",
            });

            const result = await res.json();

            if (result.success) {
                toast.success(result.message);
                fetchRoles();
            } else {
                toast.error(result.message || "Failed to delete role");
            }
        } catch (error) {
            console.error("Error deleting role:", error);
            toast.error("Something went wrong");
        }
    };

    const togglePermission = (permission) => {
        setFormData({
            ...formData,
            permissions: {
                ...formData.permissions,
                [permission]: !formData.permissions[permission],
            },
        });
    };

    const permissionGroups = [
        {
            name: "Blog Permissions",
            permissions: [
                { key: "blogView", label: "View Blogs" },
                { key: "blogCreate", label: "Create Blogs" },
                { key: "blogEdit", label: "Edit Blogs" },
                { key: "blogDelete", label: "Delete Blogs" },
                { key: "blogPublish", label: "Publish Blogs" },
            ],
        },
        {
            name: "Content Management",
            permissions: [
                { key: "categoryManage", label: "Manage Categories" },
                { key: "tagManage", label: "Manage Tags" },
            ],
        },
        {
            name: "Media",
            permissions: [
                { key: "mediaView", label: "View Media" },
                { key: "mediaUpload", label: "Upload Media" },
                { key: "mediaDelete", label: "Delete Media" },
            ],
        },
        {
            name: "SEO",
            permissions: [
                { key: "seoManage", label: "Manage SEO" },
                { key: "redirectManage", label: "Manage Redirects" },
            ],
        },
        {
            name: "System",
            permissions: [
                { key: "userManage", label: "Manage Users" },
                { key: "roleManage", label: "Manage Roles" },
                { key: "auditView", label: "View Audit Logs" },
                { key: "settingsManage", label: "Manage Settings" },
            ],
        },
    ];

    if (loading) {
        return (
            <div className="p-4 md:p-6">
                <p className="text-gray-600">Loading roles...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Shield size={24} />
                    Roles & Permissions
                </h1>
                <button
                    onClick={() => {
                        setShowAddForm(true);
                        setEditingId(null);
                        setFormData({
                            name: "",
                            description: "",
                            permissions: {
                                blogCreate: false,
                                blogEdit: false,
                                blogDelete: false,
                                blogPublish: false,
                                blogView: false,
                                categoryManage: false,
                                tagManage: false,
                                mediaUpload: false,
                                mediaDelete: false,
                                mediaView: false,
                                seoManage: false,
                                redirectManage: false,
                                userManage: false,
                                roleManage: false,
                                auditView: false,
                                settingsManage: false,
                            },
                        });
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Role
                </button>
            </div>

            {showAddForm && (
                <div className="bg-white border rounded-lg p-6 shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">
                            {editingId ? "Edit Role" : "Add New Role"}
                        </h2>
                        <button
                            onClick={() => {
                                setShowAddForm(false);
                                setEditingId(null);
                            }}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block font-semibold mb-2">Role Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full border rounded-md p-2 bg-white text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block font-semibold mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows="2"
                                className="w-full border rounded-md p-2 bg-white text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold mb-3">Permissions</label>
                            <div className="space-y-4 max-h-96 overflow-y-auto border rounded-lg p-4">
                                {permissionGroups.map((group) => (
                                    <div key={group.name} className="border-b pb-4 last:border-b-0 last:pb-0">
                                        <h3 className="font-semibold text-gray-700 mb-2">{group.name}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {group.permissions.map((perm) => (
                                                <label
                                                    key={perm.key}
                                                    className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.permissions[perm.key] || false}
                                                        onChange={() => togglePermission(perm.key)}
                                                        className="rounded"
                                                    />
                                                    <span className="text-sm text-gray-700">{perm.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
                            >
                                <Save size={18} />
                                {editingId ? "Update Role" : "Create Role"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddForm(false);
                                    setEditingId(null);
                                }}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {roles.length === 0 ? (
                <p className="text-gray-500">No roles found. Create your first role!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {roles.map((role) => (
                        <div key={role._id} className="bg-white border rounded-lg p-4 shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{role.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1">/{role.slug}</p>
                                </div>
                                {role.slug !== "super-admin" && role.slug !== "admin" && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(role)}
                                            className="text-blue-600 hover:text-blue-800"
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(role._id)}
                                            className="text-red-600 hover:text-red-800"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {role.description && (
                                <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                            )}

                            <div className="text-xs text-gray-500">
                                <strong>Permissions:</strong>{" "}
                                {Object.values(role.permissions || {}).filter(Boolean).length} enabled
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}





