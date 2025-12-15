"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, FilePlus2, FileText, Settings, Tag, FolderTree, Map, FileCode, Repeat, Link2, Activity, Shield, Building2, Plane } from "lucide-react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Add Blog", href: "/admin/blog/add", icon: FilePlus2 },
    { name: "All Blogs", href: "/admin/blog/manage", icon: FileText },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Tags", href: "/admin/tags", icon: Tag },
    { name: "Routes", href: "/admin/routes", icon: Map },
    { name: "Cities", href: "/admin/cities", icon: Building2 },
    { name: "Airports", href: "/admin/airports", icon: Plane },
    { name: "Media Library", href: "/admin/media", icon: FileText },
    { name: "All Bookings", href: "/admin/bookings", icon: FileText },
    { name: "SEO Tools", href: "#", icon: Settings, divider: true },
    { name: "Audit Logs", href: "/admin/audit-logs", icon: Activity },
    { name: "Roles", href: "/admin/roles", icon: Shield },
    { name: "Sitemap", href: "/admin/seo/sitemap", icon: Map },
    { name: "Robots.txt", href: "/admin/seo/robots", icon: FileCode },
    { name: "Redirects", href: "/admin/seo/redirects", icon: Repeat },
    { name: "Canonical URLs", href: "/admin/seo/canonical", icon: Link2 },
  ];

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "GET" });
    router.push("/admin-login");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isSidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-64 bg-white shadow-lg flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4 md:p-5 border-b">
          <h1 className="text-xl md:text-2xl font-bold text-orange-600">Admin Panel</h1>
        </div>

        <nav className="flex-1 mt-4 overflow-y-auto">
          {navItems.map((item, index) => {
            if (item.href === "#") {
              return (
                <div key={item.name} className="px-4 md:px-5 py-2 mt-4 first:mt-0">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {item.name}
                  </div>
                </div>
              );
            }
            const isActive = pathname === item.href;
            const Icon = item.icon;
            if (!Icon) {
              return null; // Skip items without icons
            }
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 md:px-5 py-3 text-sm font-medium 
                transition-all duration-200 
                ${isActive ? "bg-orange-600 text-white" : "text-gray-700 hover:bg-gray-200"}`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-4 md:p-5">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-red-600 w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto w-full md:w-auto">
        <header className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            {pathname === "/admin"
              ? "Dashboard"
              : pathname.split("/").slice(-1)[0].replace("-", " ").toUpperCase()}
          </h2>
        </header>

        <div className="bg-white rounded-xl shadow p-4 md:p-6 min-h-[80vh]">{children}</div>
      </main>
    </div>
  );
}
