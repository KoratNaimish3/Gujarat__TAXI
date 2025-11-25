"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, FilePlus2, FileText, Settings } from "lucide-react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();


  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Add Blog", href: "/admin/blog/add", icon: FilePlus2 },
    { name: "All Blogs", href: "/admin/blog/manage", icon: FileText },
    { name: "All Bookings", href: "/admin/bookings", icon: FileText },
  ];

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "GET" });
    router.push("/admin-login");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-5 border-b">
          <h1 className="text-2xl font-bold text-orange-600">Admin Panel</h1>
        </div>

        <nav className="flex-1 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-5 py-3 text-sm font-medium 
                transition-all duration-200 
                ${isActive ? "bg-orange-600 text-white" : "text-gray-700 hover:bg-gray-200"}`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-5">
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-red-600 ">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <header className="flex justify-between items-center mb-6 ">
          <h2 className="text-2xl font-bold text-gray-800">
            {pathname === "/admin"
              ? "Dashboard"
              : pathname.split("/").slice(-1)[0].replace("-", " ").toUpperCase()}
          </h2>
        </header>

        <div className="bg-white rounded-xl shadow p-6 min-h-[80vh]">{children}</div>
      </main>
    </div>
  );
}
