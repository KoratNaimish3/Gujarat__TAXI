"use client";

import { useEffect, useMemo, useState } from "react";
import Header_Components from "@/components/common_components/Header_components"
import Footer_Components from "@/components/common_components/Footer_components"
import Link from "next/link";

function buildHref(url = "") {
  if (!url) return "#";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return url;
  return `/blogs/${url}`;
}

export default function RoutesDirectoryPage() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await fetch("/api/routes", { cache: "no-store" });
        const data = await res.json();
        if (data?.success && Array.isArray(data.routes)) {
          setRoutes(data.routes);
        } else {
          setRoutes([]);
        }
      } catch (error) {
        console.error("Error loading routes:", error);
        setRoutes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  const grouped = useMemo(() => {
    const map = {};
    routes.forEach((route) => {
      const key = route.from || "Other";
      if (!map[key]) map[key] = [];
      map[key].push(route);
    });
    return map;
  }, [routes]);

  const sortedFromKeys = useMemo(
    () => Object.keys(grouped).sort((a, b) => a.localeCompare(b)),
    [grouped]
  );

  return (
    <div>
      <Header_Components />
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <div className="text-center space-y-2">
          <p className="text-sm uppercase tracking-wide text-orange-600 font-semibold">
            Routes
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Browse Routes by Origin
          </h1>
      
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading routes...</p>
        ) : routes.length === 0 ? (
          <p className="text-center text-gray-500">No routes available yet.</p>
        ) : (
          <div className="space-y-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {sortedFromKeys.map((fromKey) => (
              <div key={fromKey} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold text-orange-900">
                    {fromKey}
                  </h2>
                  <span className="text-xs text-gray-500">
                    {grouped[fromKey].length} route
                    {grouped[fromKey].length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {grouped[fromKey].map((route) => (
                    <Link
                      key={route._id}
                      href={buildHref(route.url)}
                      className="border border-gray-200 hover:border-orange-400 rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:text-orange-600 transition-colors"
                    >
                      {route.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer_Components />
    </div>
  );
}

