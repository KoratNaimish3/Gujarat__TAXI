"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);

        const res = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        setLoading(false);

        if (data.success) {
            router.push("/admin");
        } else {
            alert("Invalid credentials");
        }
    };


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
            <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-2xl font-semibold text-center mb-5 text-gray-800">
                    Admin Login
                </h2>

                <div className="mb-3">
                    <label className="block text-gray-700 text-sm mb-1">Email</label>
                    <input
                        type="email"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter admin email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm mb-1">Password</label>
                    <input
                        type="password"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter admin password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-lg font-medium"
                >
                    {loading ? "Logging in..." : "Login"}

                </button>
            </div>
        </div>
    );
}
