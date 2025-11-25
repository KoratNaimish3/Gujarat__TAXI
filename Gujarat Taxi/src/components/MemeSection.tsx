"use client";

import { useEffect, useRef, useState } from "react";
import anime from "animejs";
import { Car, Fuel, Smile, TrendingUp } from "lucide-react";
import { useBookingModal } from "@/contexts/BookingModalContext";

export default function MemeSection() {
  const { openModal } = useBookingModal();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentMeme, setCurrentMeme] = useState(0);

  const memes = [
    {
      text: "Why argue over fuel price? Just book Gujarat Taxi 🚖",
      emoji: "⛽",
      icon: Fuel,
      color: "from-red-500 to-orange-500",
    },
    {
      text: "When you realize Gujarat Taxi is cheaper than your car maintenance 💸",
      emoji: "😱",
      icon: Car,
      color: "from-green-500 to-blue-500",
    },
    {
      text: "Gujarat Taxi drivers knowing every shortcut in Gujarat like: 🧠",
      emoji: "🗺️",
      icon: TrendingUp,
      color: "from-purple-500 to-pink-500",
    },
    {
      text: "Your face when Gujarat Taxi arrives on time, every time 😎",
      emoji: "⏰",
      icon: Smile,
      color: "from-yellow-500 to-orange-500",
    },
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

    // Auto-rotate memes every 4 seconds
    const interval = setInterval(() => {
      setCurrentMeme((prev) => (prev + 1) % memes.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [memes.length]);

  useEffect(() => {
    // Animate meme content change
    const memeContent = document.querySelector(".meme-content");
    if (memeContent) {
      anime({
        targets: memeContent,
        opacity: [1, 0],
        duration: 300,
        complete: () => {
          anime({
            targets: memeContent,
            opacity: [0, 1],
            duration: 300,
          });
        },
      });
    }
  }, [currentMeme]);

  const currentMemeData = memes[currentMeme];
  const IconComponent = currentMemeData.icon;

  return (
    <section className="py-16 bg-gradient-to-br from-orange-100 via-white to-orange-50">
      <div
        ref={containerRef}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Travel Vibes 🚗✨
          </h2>
          <p className="text-lg text-gray-600">
            Because traveling should be fun, not stressful!
          </p>
        </div>

        {/* Meme Banner */}
        <div className="relative">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 right-4 text-6xl">🚗</div>
              <div className="absolute bottom-4 left-4 text-4xl">🏔️</div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl">
                🛣️
              </div>
            </div>

            {/* Meme Content */}
            <div className="relative z-10">
              <div className="meme-content text-center">
                {/* Meme Icon */}
                <div
                  className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${currentMemeData.color} flex items-center justify-center shadow-lg`}
                >
                  <IconComponent className="w-10 h-10 text-white" />
                </div>

                {/* Meme Text */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 md:p-8 mb-6">
                  <p className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed">
                    {currentMemeData.text}
                  </p>
                  <div className="text-4xl mt-4">{currentMemeData.emoji}</div>
                </div>

                {/* Meme Navigation Dots */}
                <div className="flex justify-center space-x-2">
                  {memes.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentMeme(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentMeme
                          ? "bg-orange-500 scale-125"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-orange-500 rounded-full animate-bounce-slow opacity-20"></div>
          <div
            className="absolute -bottom-4 -right-4 w-6 h-6 bg-orange-400 rounded-full animate-bounce-slow opacity-20"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        {/* Fun Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2">😊</div>
            <div className="text-sm font-medium text-gray-600">
              Happy Customers
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🚗</div>
            <div className="text-sm font-medium text-gray-600">Clean Cars</div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-sm font-medium text-gray-600">
              5 Star Service
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-sm font-medium text-gray-600">On Time</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <button
            onClick={openModal}
            className="btn-primary text-lg px-8 py-4"
          >
            Join the Fun - Book Now! 🚖
          </button>
        </div>
      </div>
    </section>
  );
}
