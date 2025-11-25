"use client";

import { useEffect, useState } from "react";

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    const res = await fetch("/api/Bookings");
    const data = await res.json();
    if (data.success) setBookings(data.bookings);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Bookings</h1>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full border-collapse bg-white text-sm text-left">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Pickup</th>
              <th className="p-3 border">Drop</th>
              <th className="p-3 border">Car Type</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Time</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4">No bookings found</td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50">
                  <td className="p-3 border">{b.tripType}</td>
                  <td className="p-3 border">{b.phone}</td>
                  <td className="p-3 border">{b.from}</td>
                  <td className="p-3 border">{b.to}</td>
                  <td className="p-3 border">{b.carType}</td>
                  <td className="p-3 border">{b.date}</td>
                  <td className="p-3 border">{b.time}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
