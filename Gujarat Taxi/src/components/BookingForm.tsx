"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";
import BookingFormContent from "./BookingFormContent";

export default function BookingForm() {
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formRef.current) {
      anime({
        targets: formRef.current.children,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        delay: anime.stagger(100),
        easing: "easeOutExpo",
      });
    }
  }, []);

  return (
    <section
      id="booking"
      className="py-20 bg-gradient-to-br from-orange-50 to-white mt-20"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={formRef} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Book Your Ride
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <BookingFormContent showHeader={true} />
        </div>
      </div>
    </section>
  );
}
