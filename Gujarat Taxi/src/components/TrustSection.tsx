"use client";

import { useEffect, useRef } from "react";
import { Shield, DollarSign, Car, MapPin, Clock, Phone } from "lucide-react";
import { useBookingModal } from "@/contexts/BookingModalContext";

export default function TrustSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { openModal } = useBookingModal();


    return (
        <section className="pb-20 bg-gradient-to-br from-gray-50 to-white">
            <div
                ref={containerRef}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            >
            <div className="mt-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 md:p-12 text-white">
                <div className="text-center">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">
                        Trusted by Thousands of Travelers
                    </h3>
                    <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
                        Join the community of satisfied customers who choose Gujarat Taxi
                        for their travel needs
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold mb-2">10K+</div>
                            <div className="text-orange-100">Happy Customers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
                            <div className="text-orange-100">Verified Drivers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
                            <div className="text-orange-100">Cities Covered</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold mb-2">4.9★</div>
                            <div className="text-orange-100">Customer Rating</div>
                        </div>
                    </div>

                    {/* Customer Testimonials */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                            <div className="text-2xl mb-2">⭐⭐⭐⭐⭐</div>
                            <p className="text-orange-100 text-sm mb-3">
                                "Excellent service! The driver was punctual and the car was
                                very clean. Highly recommended!"
                            </p>
                            <div className="text-orange-200 text-sm font-medium">
                                - Rajesh P.
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                            <div className="text-2xl mb-2">⭐⭐⭐⭐⭐</div>
                            <p className="text-orange-100 text-sm mb-3">
                                "Great experience from Ahmedabad to Surat. Professional driver
                                and reasonable pricing."
                            </p>
                            <div className="text-orange-200 text-sm font-medium">
                                - Priya M.
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                            <div className="text-2xl mb-2">⭐⭐⭐⭐⭐</div>
                            <p className="text-orange-100 text-sm mb-3">
                                "24/7 availability is a game changer. Booked late night and
                                got instant confirmation."
                            </p>
                            <div className="text-orange-200 text-sm font-medium">
                                - Amit S.
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={openModal}
                            className="bg-white text-orange-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            Book Your Ride Now
                        </button>
                        <button className="border-2 border-white text-white hover:bg-white hover:text-orange-600 font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105">
                            Call Us: +91 95128 70958
                        </button>
                    </div>
                </div>
            </div>

            {/* Additional Benefits */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                            <Phone className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                            Instant Booking
                        </h3>
                    </div>
                    <p className="text-gray-600">
                        Get instant confirmation for your booking with real-time driver
                        assignment and tracking.
                    </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Safety First</h3>
                    </div>
                    <p className="text-gray-600">
                        All vehicles are insured, drivers are verified, and we provide
                        24/7 emergency support.
                    </p>
                </div>
            </div>
        </div>    
        </section>
    );
}
