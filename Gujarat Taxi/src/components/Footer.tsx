"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import { assest } from "@/assest/assest";

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);

  const footerLinks = {
    quickLinks: [
      { name: "Home", href: "#home" },
      { name: "Services", href: "#services" },
      { name: "Book a Ride", href: "#booking" },
      { name: "Contact", href: "#contact" },
    ],
    services: [
      { name: "One Way Taxi", href: "#" },
      { name: "Round Trip Taxi", href: "#" },
      { name: "Airport Transfer", href: "#" },
      { name: "Outstation Travel", href: "#" },
    ],
    popularRoutes: [
      { name: "Ahmedabad to Surat", href: "#" },
      { name: "Vadodara to Rajkot", href: "#" },
      { name: "Ahmedabad to Dwarka", href: "#" },
      { name: "Surat to Somnath", href: "#" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cancellation Policy", href: "#" },
      { name: "Refund Policy", href: "#" },
    ],
  };

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "#",
      color: "hover:text-blue-600",
    },
    { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-blue-400" },
    {
      name: "Instagram",
      icon: Instagram,
      href: "#",
      color: "hover:text-pink-600",
    },
    { name: "YouTube", icon: Youtube, href: "#", color: "hover:text-red-600" },
  ];

  useEffect(() => {
    if (footerRef.current) {
      anime({
        targets: footerRef.current.children,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        delay: anime.stagger(100),
        easing: "easeOutExpo",
      });
    }
  }, []);

  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div ref={footerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 py-3 ">
                <div>
                  <Image src={assest.logo} alt="" className="w-12 h-10 object-cover" />
                </div>
                <div className="">
                  <h1 className="leading-7 text-xl font-semibold text-[#98561f]" style={{ fontFamily: "serif" }}>Gujarat Taxi</h1>
                  <p className="text-md text-[#98561f] font-semibold " style={{ fontFamily: "serif" }}>
                    Khushboo Gujarat Ki
                  </p>
                </div>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Your trusted partner for reliable, affordable, and comfortable
                taxi services across Gujarat. Experience the best of Gujarat
                with our professional drivers and modern fleet.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-300">+91 95128 70958</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-300">info@gujarattaxi.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-300">Gujarat, India</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4 mt-6">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-orange-500 ${social.color}`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-orange-400">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {footerLinks.quickLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-orange-400 transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-orange-400">
                Our Services
              </h4>
              <ul className="space-y-3">
                {footerLinks.services.map((service) => (
                  <li key={service.name}>
                    <a
                      href={service.href}
                      className="text-gray-300 hover:text-orange-400 transition-colors duration-300"
                    >
                      {service.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Routes */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-orange-400">
                Popular Routes
              </h4>
              <ul className="space-y-3">
                {footerLinks.popularRoutes.map((route) => (
                  <li key={route.name}>
                    <a
                      href={route.href}
                      className="text-gray-300 hover:text-orange-400 transition-colors duration-300 text-sm"
                    >
                      {route.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        {/* <div className="border-t border-gray-800 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h4 className="text-xl font-semibold mb-4">
              Stay Updated with Gujarat Taxi
            </h4>
            <p className="text-gray-400 mb-6">
              Get the latest offers, travel tips, and route updates delivered to
              your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div> */}

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400">
                © 2025 Gujarat Taxi – Khushboo Gujarat Ki
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Website is owned & managed by{" "}
                <span className="text-orange-400 font-medium">
                  Wolfron Technologies LLP
                </span>
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center md:justify-end space-x-6">
              {footerLinks.legal.map((legal) => (
                <a
                  key={legal.name}
                  href={legal.href}
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm"
                >
                  {legal.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 py-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-4">We Accept</p>
            <div className="flex justify-center items-center space-x-4">
              <div className="bg-white rounded-lg p-2">
                <span className="text-xs font-bold text-blue-600">UPI</span>
              </div>
              <div className="bg-white rounded-lg p-2">
                <span className="text-xs font-bold text-green-600">GPay</span>
              </div>
              <div className="bg-white rounded-lg p-2">
                <span className="text-xs font-bold text-purple-600">Paytm</span>
              </div>
              <div className="bg-white rounded-lg p-2">
                <span className="text-xs font-bold text-blue-800">Cards</span>
              </div>
              <div className="bg-white rounded-lg p-2">
                <span className="text-xs font-bold text-gray-800">Cash</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
