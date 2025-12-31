"use client";

import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";
import Header_Components from "@/components/common_components/Header_components";
import Footer_Components from "@/components/common_components/Footer_components";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              404
            </h1>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Illustration/Icon */}
          <div className="mb-12 flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                <Search className="w-16 h-16 md:w-20 md:h-20 text-orange-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-400 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: "0.5s" }}></div>
            </div>
          </div>

          
        </div>
      </div>

    </div>
  );
}

