"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";
import HeroSection from "@/components/HeroSection";
import BookingForm from "@/components/BookingForm";
import PopularDestinations from "@/components/PopularDestinations";
import OurServices from "@/components/OurServices";
import MemeSection from "@/components/MemeSection";
import HowItWorks from "@/components/HowItWorks";
import WhyTravelWithUs from "@/components/WhyTravelWithUs";
import CommunitySection from "@/components/CommunitySection";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import TrustSection from "@/components/TrustSection";

export default function Home() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize animations when page loads
    if (pageRef.current) {
      anime({
        targets: pageRef.current.children,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        delay: anime.stagger(200),
        easing: "easeOutExpo",
      });
    }
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-white">
      <Navigation />
      <BookingForm />
      <HeroSection />
      <PopularDestinations />
      <OurServices />
      <MemeSection />
      <HowItWorks />
      <WhyTravelWithUs />
      <TrustSection/>
      <CommunitySection />
      <Footer />
    </div>
  );
}
