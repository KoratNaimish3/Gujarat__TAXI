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

  // Helper function to format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Return original if invalid date
      
      const formattedDate = date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      
      const formattedTime = date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      
      return (
        <div className="flex flex-col">
          <span className="font-medium">{formattedDate}</span>
          <span className="text-xs text-gray-500">{formattedTime}</span>
        </div>
      );
    } catch (error) {
      return dateString;
    }
  };

  // Helper function to format trip type
  const formatTripType = (tripType) => {
    if (!tripType) return "N/A";
    return tripType
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 dark:text-black">All Bookings</h1>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full border-collapse bg-white dark:bg-gray-800 text-sm text-left">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <th className="p-3 border dark:border-gray-600">Trip Type</th>
              <th className="p-3 border dark:border-gray-600">Phone</th>
              <th className="p-3 border dark:border-gray-600">Pickup</th>
              <th className="p-3 border dark:border-gray-600">Drop</th>
              <th className="p-3 border dark:border-gray-600">Car Type</th>
              <th className="p-3 border dark:border-gray-600">Passengers</th>
              <th className="p-3 border dark:border-gray-600">Trip Start</th>
              <th className="p-3 border dark:border-gray-600">Trip End</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-4 text-gray-600 dark:text-gray-300">No bookings found</td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-3 border dark:border-gray-600 text-gray-900 dark:text-gray-200">
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-orange-100 text-orange-700">
                      {formatTripType(b.tripType)}
                    </span>
                  </td>
                  <td className="p-3 border dark:border-gray-600 text-gray-900 dark:text-gray-200">{b.phone || "N/A"}</td>
                  <td className="p-3 border dark:border-gray-600 text-gray-900 dark:text-gray-200">{b.from || "N/A"}</td>
                  <td className="p-3 border dark:border-gray-600 text-gray-900 dark:text-gray-200">{b.to || "N/A"}</td>
                  <td className="p-3 border dark:border-gray-600 text-gray-900 dark:text-gray-200">
                    <span className="capitalize">{b.carType || "N/A"}</span>
                  </td>
                  <td className="p-3 border dark:border-gray-600 text-gray-900 dark:text-gray-200">{b.passengers || "N/A"}</td>
                  <td className="p-3 border dark:border-gray-600 text-gray-900 dark:text-gray-200">
                    {formatDateTime(b.date)}
                  </td>
                  <td className="p-3 border dark:border-gray-600 text-gray-900 dark:text-gray-200">
                    {b.tripType === "round-trip" ? formatDateTime(b.tripEndDate) : <span className="text-gray-400">N/A</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
