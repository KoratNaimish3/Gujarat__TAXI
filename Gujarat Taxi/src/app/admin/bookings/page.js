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
      <h1 className="text-2xl font-bold mb-4 dark:text-black">All Bookings</h1>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full border-collapse bg-white dark:bg-gray-800 text-sm text-left">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <th className="p-3 border dark:border-gray-600">Name</th>
              <th className="p-3 border dark:border-gray-600">Phone</th>
              <th className="p-3 border dark:border-gray-600">Pickup</th>
              <th className="p-3 border dark:border-gray-600">Drop</th>
              <th className="p-3 border dark:border-gray-600">Car Type</th>
              <th className="p-3 border dark:border-gray-600">Date</th>
              <th className="p-3 border dark:border-gray-600">Time</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-600 dark:text-gray-300">No bookings found</td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-3 border dark:border-gray-600 text-gray-900 dark:text-gray-200">{b.tripType}</td>
                  <td className="p-3 border dark:border-gray-600 text-gray-900 dark:text-gray-200">{b.phone}</td>
                  <td className="p-3 border dark:border-gray-600 text-gray-900 dark:text-gray-200">{b.from}</td>
                  <td className="p-3 border dark:border-gray-600 text-gray-900 dark:text-gray-200">{b.to}</td>
                  <td className="p-3 border dark:border-gray-600 text-gray-900 dark:text-gray-200">{b.carType}</td>
                  <td className="p-3 border dark:border-gray-600 text-gray-900 dark:text-gray-200">{b.date}</td>
                  <td className="p-3 border dark:border-gray-600 text-gray-900 dark:text-gray-200">{b.time}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
