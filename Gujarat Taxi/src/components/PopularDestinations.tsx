"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";
import { MapPin } from "lucide-react";
import { assest } from "../assest/assest";
import Image from "next/image";

export default function PopularDestinations() {
  const containerRef = useRef<HTMLDivElement>(null);

  const destinations = [
    { name: "Vadodara", image: assest.vadodara },
    { name: "Surat", image: assest.surat },
    { name: "Rajkot", image: assest.rajkot },
    { name: "Dwarka", image: assest.dwarka },
    { name: "Somnath", image: assest.somnath },
    { name: "Unity", image: assest.unity },
    { name: "Gir", image: assest.gir },
    { name: "Kutch", image: assest.kuch },
    { name: "Bhavnagar", image: assest.bhavnagar },
    { name: "Gandhinagar", image: assest.gandhinagr },
  ];

  useEffect(() => {
    if (containerRef.current) {
      anime({
        targets: containerRef.current,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        easing: "easeOutExpo",
      });
    }
  }, []);

  // Duplicate destinations for seamless looping
  const marqueeItems = [...destinations, ...destinations];

  return (
    <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 overflow-hidden">
      <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Popular Destinations
          </h2>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto">
            Explore the beautiful cities and tourist destinations across Gujarat
          </p>
        </div>

        {/* ✅ Marquee Section */}
        <div className="relative overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee">
            {marqueeItems.map((destination, index) => (
              <div
                key={index}
                className="flex flex-col justify-center items-center gap-2 text-white mx-6"
              >
                <Image
                  src={destination.image || ""}
                  alt={destination.name}
                  className="max-w-24 h-24 rounded-full object-cover"

                />
                <p className="text-center">{destination.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Info Text */}
        <div className="text-center mt-12">
          <p className="text-orange-100 text-lg">
            ✨ Book your ride to any destination across Gujarat
          </p>
        </div>
      </div>
    </section>
  );
}

