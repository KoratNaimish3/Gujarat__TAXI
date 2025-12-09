"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

export default function AllBlogsPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBlogs = async () => {
        try {
            const res = await fetch("/api/blogs", {
                cache: "no-store",
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                }
            });
            const data = await res.json();

            if (data.success !== false && data.blogs) {
                setBlogs(data.blogs);
            } else {
                setBlogs([]);
            }
        } catch (error) {
            console.error("Error fetching blogs:", error);
            toast.error("Something went wrong");
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this blog?")) return;

        try {
            const res = await fetch(`/api/blogs/${id}`, {
                method: "DELETE",
            });

            const result = await res.json();

            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }

            fetchBlogs()

        } catch (error) {
            console.error("Delete Error:", error);
            toast.error("Something went wrong");
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">All Blogs</h1>
                <Link
                    href="/admin/blog/add"
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold"
                >
                    + Add New Blog
                </Link>
            </div>

            {loading ? (
                <p>Loading blogs...</p>
            ) : blogs.length === 0 ? (
                <p className="text-gray-500">No blogs found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow">
                        <thead className="bg-gray-100">
                            <tr className="text-left text-gray-700 font-semibold">
                                <th className="px-4 py-3 border-b">Image</th>
                                <th className="px-4 py-3 border-b">Title</th>
                                <th className="px-4 py-3 border-b">Description</th>
                                <th className="px-4 py-3 border-b">URI/Slug</th>
                                <th className="px-4 py-3 border-b text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {blogs.map((blog) => (
                                <tr key={blog._id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="w-24 h-20 rounded-md overflow-hidden bg-gray-100">
                                            {blog.image ? (
                                                <img
                                                    src={blog.image}
                                                    alt={blog.title}
                                                    width={64}
                                                    height={64}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-4 py-3 font-medium text-gray-800">
                                        {blog.title}
                                    </td>

                                    <td className="px-4 py-3 text-gray-600 max-w-xs">
                                        <p className="line-clamp-2 text-sm">
                                            {blog.description?.replace(/<[^>]+>/g, "")}
                                        </p>
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700 font-mono">
                                                /blogs/{blog.slug}
                                            </code>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(`${window.location.origin}/blogs/${blog.slug}`);
                                                    toast.success("URI copied to clipboard!");
                                                }}
                                                className="text-blue-600 hover:text-blue-800 text-xs"
                                                title="Copy URI"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <Link
                                                href={`/admin/blog/edit/${blog._id}`}
                                                className="text-blue-600 hover:text-blue-800"
                                                title="Edit"
                                            >
                                                <Pencil size={18} />
                                            </Link>

                                            <button
                                                onClick={() => handleDelete(blog._id)}
                                                className="text-red-600 hover:text-red-800"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
