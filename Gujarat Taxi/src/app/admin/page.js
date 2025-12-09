"use client";

import { useEffect, useState } from "react";

export default function BlogList() {
    const [totalBlogs, setTotalBlogs] = useState(0);
    const [totalBookings, setTotalBookings] = useState(0)

    const fetchBlogs = async () => {
        try {
            const res = await fetch("/api/blogs", {
                method: "GET",
                cache: "no-store",
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                }
            });

            const data = await res.json();
            if (data.success !== false) {
                setTotalBlogs(data.totalBlogs || 0);
            }
        } catch (error) {
            console.error("Error fetching blogs:", error);
        }
    };

    const fetchBokkings = async () => {
        try {
            const res = await fetch("/api/Bookings", {
                method: "GET",
                cache: "no-store",
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                }
            });

            const data = await res.json();
            if (data.success) {
                setTotalBookings(data.totalBookings || 0);
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    };

    useEffect(() => {
        fetchBlogs();
        fetchBokkings()
    }, []);

    return (
        <div className="grid grid-cols-3 gap-5">
            <div className="bg-orange-500 p-5 rounded-md text-white  border-2">
                <h2 className="font-bold">Total Blogs:</h2>
                <p>{totalBlogs}</p>
            </div>

            <div className="bg-orange-500 p-5 rounded-md text-white border-2">
                <h2 className="font-bold">Total Bookings:</h2>
                <p>{totalBookings}</p>
            </div>
        </div>
    );
}
