"use client";

import { useEffect, useState } from "react";
import Header_Components from "@/components/common_components/Header_components";
import Footer_Components from "@/components/common_components/Footer_components";
import Link from "next/link";

function buildHref(url = "") {
  if (!url) return "#";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return url;
  return `/blogs/${url}`;
}

export default function CitiesPage() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch("/api/cities", { cache: "no-store" });
        const data = await res.json();
        if (data?.success && Array.isArray(data.cities)) {
          setCities(data.cities);
        } else {
          setCities([]);
        }
      } catch (error) {
        console.error("Error loading cities:", error);
        setCities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

  return (
    <div>
      <Header_Components />
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <div className="text-center space-y-2">
          <p className="text-sm uppercase tracking-wide text-orange-600 font-semibold">
            Cities
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Browse Cities
          </h1>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading cities...</p>
        ) : cities.length === 0 ? (
          <p className="text-center text-gray-500">No cities available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {cities.map((city) => (
              <Link
                key={city._id}
                href={buildHref(city.url)}
                className="border border-gray-200 hover:border-orange-400 rounded-lg px-4 py-3 text-center font-medium text-gray-800 hover:text-orange-600 transition-colors"
              >
                {city.name}
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer_Components />
    </div>
  );
}

