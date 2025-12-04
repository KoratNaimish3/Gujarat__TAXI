"use client";

import { useState, useEffect, useRef } from "react";
import anime from "animejs";
import {
  MapPin,
  Calendar,
  Users,
  Car,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { assest } from "../assest/assest";
import Image from "next/image";

interface BookingData {
  tripType: "one-way" | "round-trip" | "airport";
  from: string;
  to: string;
  date: string;
  time: string;
  passengers: number;
  carType: "sedan" | "suv" | "hatchback";
  phone: string;
}

interface BookingFormContentProps {
  onSuccess?: () => void;
  showHeader?: boolean;
}

const gujaratCities = [
  "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar",
  "Gandhinagar", "Junagadh", "Anand", "Navsari", "Morbi", "Bharuch",
  "Nadiad", "Vapi", "Gandhidham", "Mehsana", "Porbandar", "Palanpur",
  "Botad", "Amreli", "Dahod", "Surendranagar", "Patan", "Veraval",
  "Godhra", "Valsad", "Kheda", "Somnath", "Dwarka", "Mahesana"
];


interface CityInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function CityInput({ label, value, onChange }: CityInputProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredCities = gujaratCities.filter((city) =>
    city.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-black mb-2">
        {label}
      </label>

      <input
        type="text"
        value={value}
        // onFocus={() => setShowDropdown(true)}
        onChange={(e) => {
          onChange(e.target.value);
          // setShowDropdown(true);
        }}
        // onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        className="border-2 p-2 rounded-md w-full
                   bg-white text-black placeholder-gray-500 border-gray-300
                   dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600
                   focus:outline-none focus:ring-2 focus:ring-orange-400"
        placeholder="Search city…"
      />

      {showDropdown && filteredCities.length > 0 && (
        <ul className="absolute left-0 right-0 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto z-50 mt-1">
          {filteredCities.map((city) => (
            <li
              key={city}
              onClick={() => {
                onChange(city);
                setShowDropdown(false);
              }}
              className="p-2 hover:bg-orange-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-200"
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function BookingFormContent({ onSuccess, showHeader = true }: BookingFormContentProps) {
  const [bookingData, setBookingData] = useState<BookingData>({
    tripType: "one-way",
    from: "",
    to: "",
    date: "",
    time: "",
    passengers: 1,
    carType: "sedan",
    phone: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  const carTypes = [
    {
      id: "hatchback",
      name: "Hatchback",
      description: "Economical 4-seater car",
      image: assest.hatchback,
      price: "₹10/km",
    },
    {
      id: "sedan",
      name: "Sedan",
      description: "Comfortable 4-seater car",
      image: assest.sedan,
      price: "₹12/km",
    },
    {
      id: "suv",
      name: "SUV",
      description: "Spacious 6-7 seater vehicle",
      image: assest.suv,
      price: "₹18/km",
    },

  ];

  const sendBookingEmail = async (data: BookingData) => {
    try {
      const response = await fetch("/api/send-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        return result.bookingId;
      } else {
        throw new Error(result.message || "Failed to send booking email");
      }
    } catch (error) {
      console.error("Error sending booking email:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {

      const saveResponse = await fetch("/api/create-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const saveResult = await saveResponse.json();
      if (!saveResult.success) {
        throw new Error("Failed to save booking in database");
      }

      const newBookingId = await sendBookingEmail(bookingData);
      setBookingId(newBookingId);

      setIsSubmitted(true);

      console.log("Booking submitted successfully:", bookingData);

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 5000);
      }
    } catch (error) {
      console.error("Booking failed:", error);
      alert(
        "Failed to submit booking. Please try again or contact us directly."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof BookingData,
    value: string | number
  ) => {
    setBookingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isSubmitted) {
    return (
      <div className="p-6 md:p-8 text-center">
        <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-green-500 mx-auto mb-6" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Booking Received!
        </h2>
        <p className="text-base md:text-lg text-gray-600 mb-6 flex flex-col gap-2">
          We have received your booking inquiry from {bookingData.from} to {bookingData.to}, our team will give you a call at {bookingData.phone} as soon as possible.
          <span>Thanks for choosing us for your travel! Have a great travel with Gujarat Taxi.</span>
        </p>
        <div className="bg-orange-50 rounded-lg p-4 md:p-6 mb-6">
          <h3 className="text-lg md:text-xl font-semibold text-orange-800 mb-2">
            Booking ID
          </h3>
          <p className="text-xl md:text-2xl font-bold text-orange-600">{bookingId}</p>
        </div>
        <a href="tel:+918799373654" className="btn-primary inline-block">
          +91 8799373654
        </a>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6 lg:p-8 pb-10 bg-gradient-to-br from-orange-50 to-white">

      <form onSubmit={handleSubmit} className=" px-3 py-4 rounded-3xl max-md:bg-gradient-to-br max-md: from-orange-100 max-md: to-orange-50">
        <div className="grid grid-cols-1 gap-6 md:gap-8">
          {/* Left Column */}
          <div className="space-y-4 md:space-y-6">
            {/* Trip Type */}
            <div>

              <div className="flex w-full justify-center items-center  gap-2 md:gap-3">
                {[
                  { id: "one-way", label: "One Way" },
                  { id: "round-trip", label: "Round Trip" },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() =>
                      handleInputChange("tripType", type.id as any)
                    }
                    className={`p-2 md:px-10 rounded-lg border-2 transition-all duration-300 text-sm md:text-base ${bookingData.tripType === type.id
                      ? "border-orange-500 bg-orange-50 text-orange-700 font-semibold"
                      : "border-gray-200 hover:border-orange-300 dark:border-black dark:text-black"
                      }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* From & To */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <CityInput
                  label="From (Pickup Location)"
                  value={bookingData.from}
                  onChange={(val) => handleInputChange("from", val)}
                />

              </div>
              <div>
                <CityInput
                  label="To (Drop Location)"
                  value={bookingData.to}
                  onChange={(val) => handleInputChange("to", val)}
                />
              </div>

              {/* Date & Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-700  mb-2">
                  Date & Time
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={bookingData.date}
                    onChange={(e) =>
                      handleInputChange("date", e.target.value)
                    }
                    className="border-2 p-2 rounded-md w-full
                               bg-white text-black border-gray-300
                               dark:bg-gray-800 dark:text-white dark:border-gray-600
                               focus:outline-none focus:ring-2 focus:ring-orange-400"
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700  mb-2">
                  Enter Mobile Number
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  value={bookingData.phone}
                  onChange={(e) =>
                    handleInputChange("phone", e.target.value)
                  }
                  className="w-full border-2 p-2 rounded-md
                             bg-white text-black placeholder-gray-500 border-gray-300
                             dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600
                             focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Enter your Mobile Number"
                  required
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 md:space-y-6">
            {/* Car Type Selection */}
            <div className="flex flex-col  justify-center items-center">
              <label className=" text-left text-sm font-semibold text-gray-700  mb-3">
                Select Car Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 max-sm:flex gap-3">
                {carTypes.map((car) => (
                  <button
                    key={car.id}
                    type="button"
                    onClick={() =>
                      handleInputChange("carType", car.id as any)
                    }
                    className={`p-3 md:px-10 rounded-lg border-2 transition-all duration-300 ${bookingData.carType === car.id
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300"
                      }`}
                  >
                    <div className="flex flex-col gap-2 items-center justify-center">
                      <Image
                        src={car.image}
                        alt={car.name}
                        className="w-16 h-10 md:w-20 md:h-12 object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                          {car.name}
                        </h3>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 md:mt-8 text-center">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary text-base md:text-lg px-8 md:px-12 py-3 md:py-4 flex items-center space-x-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Confirm Booking</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

