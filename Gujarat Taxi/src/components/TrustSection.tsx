"use client";

import { useEffect, useRef, useState } from "react";

import { Shield, DollarSign, Car, MapPin, Clock, Phone } from "lucide-react";

import { useBookingModal } from "@/contexts/BookingModalContext";

export default function TrustSection() {

    const containerRef = useRef<HTMLDivElement>(null);

    const desktopScrollRef = useRef<HTMLDivElement>(null);

    const { openModal } = useBookingModal();

    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    const [currentBenefit, setCurrentBenefit] = useState(0);

    const [desktopScrollIndex, setDesktopScrollIndex] = useState(0);

    const testimonials = [

        {

            stars: "⭐⭐⭐⭐⭐",

            text: "Perfect journey to Vadodara! The AC was working great and driver arrived 10 minutes early. Made our family trip memorable.",

            author: "Ketan Patel",

            city: "Vadodara",

        },

        {

            stars: "⭐⭐⭐⭐⭐",

            text: "Traveled from Surat to Ahmedabad for business. Very professional service, driver was well-dressed and car smelled fresh. Worth every rupee!",

            author: "Shruti Mehta",

            city: "Surat",

        },

        {

            stars: "⭐⭐⭐⭐⭐",

            text: "Emergency trip to Rajkot at 2 AM. Got instant booking and driver reached within 15 minutes. Life saver service!",

            author: "Dhruv Shah",

            city: "Rajkot",

        },

        {

            stars: "⭐⭐⭐⭐⭐",

            text: "Pilgrimage trip to Dwarka temple. Driver was very respectful, helped with luggage and knew all the best routes. Blessed experience!",

            author: "Lakshmi Desai",

            city: "Dwarka",

        },

        {

            stars: "⭐⭐⭐⭐⭐",

            text: "Visited Somnath temple with elderly parents. Driver was patient, drove smoothly and made frequent stops. Highly appreciated!",

            author: "Naresh Joshi",

            city: "Somnath",

        },

        {

            stars: "⭐⭐⭐⭐⭐",

            text: "Safari trip to Gir National Park. Spacious SUV, comfortable seats and driver knew all the wildlife spots. Amazing adventure!",

            author: "Riya Trivedi",

            city: "Gir",

        },

        {

            stars: "⭐⭐⭐⭐⭐",

            text: "Rann of Kutch festival visit. Long journey but very comfortable. Driver played good music and shared interesting local stories.",

            author: "Jayesh Bhatt",

            city: "Kutch",

        },

        {

            stars: "⭐⭐⭐⭐⭐",

            text: "Business conference in Bhavnagar. Professional service, driver was on phone call with office and handled everything smoothly.",

            author: "Pooja Agarwal",

            city: "Bhavnagar",

        },

        {

            stars: "⭐⭐⭐⭐⭐",

            text: "Government office visit in Gandhinagar. Driver knew all the shortcuts, saved 30 minutes. Very efficient and punctual service!",

            author: "Mukesh Kumar",

            city: "Gandhinagar",

        },

        {

            stars: "⭐⭐⭐⭐⭐",

            text: "College reunion in Vadodara. Booked for 5 friends, car was spacious enough. Driver was friendly and made our journey fun!",

            author: "Ananya Reddy",

            city: "Vadodara",

        },

        {

            stars: "⭐⭐⭐⭐⭐",

            text: "Wedding function in Surat. Needed multiple trips, service was flexible and pricing was transparent. No last minute surprises!",

            author: "Rohan Kapoor",

            city: "Surat",

        },

        {

            stars: "⭐⭐⭐⭐⭐",

            text: "Medical emergency in Rajkot. Driver was compassionate, drove fast but safely. Reached hospital on time. Thankful for the service!",

            author: "Sunita Vyas",

            city: "Rajkot",

        },

        {

            stars: "⭐⭐⭐⭐⭐",

            text: "Photography trip to Dwarka beach. Driver waited patiently while we clicked photos. Very accommodating and understanding!",

            author: "Aryan Malhotra",

            city: "Dwarka",

        },

        {

            stars: "⭐⭐⭐⭐⭐",

            text: "Family vacation to Somnath. Booked round trip, both journeys were perfect. Kids loved the comfortable ride and driver's stories.",

            author: "Deepika Iyer",

            city: "Somnath",

        },

        {

            stars: "⭐⭐⭐⭐⭐",

            text: "Wildlife photography in Gir. Early morning pickup at 5 AM, driver was punctual. Car was clean and ready. Excellent dedication!",

            author: "Vikram Singh",

            city: "Gir",

        },

        {

            stars: "⭐⭐⭐⭐⭐",

            text: "Cultural tour of Kutch. Driver spoke good English, explained local culture and suggested best places to visit. Like a personal guide!",

            author: "Isha Patel",

            city: "Kutch",

        },

        {

            stars: "⭐⭐⭐⭐⭐",

            text: "Factory visit in Bhavnagar. Driver was knowledgeable about industrial areas, helped with directions. Very helpful and resourceful!",

            author: "Rajesh Gupta",

            city: "Bhavnagar",

        },

    ];

    const benefits = [

        {

            icon: Phone,

            iconBg: "bg-orange-500",

            title: "Instant Booking",

            description: "Get instant confirmation for your booking with real-time driver assignment and tracking.",

            gradient: "from-orange-50 to-orange-100",

        },

        {

            icon: Shield,

            iconBg: "bg-green-500",

            title: "Safety First",

            description: "All vehicles are insured, drivers are verified, and we provide 24/7 emergency support.",

            gradient: "from-green-50 to-green-100",

        },

    ];

    useEffect(() => {

        // Auto-rotate testimonials on mobile every 4 seconds

        const testimonialInterval = setInterval(() => {

            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);

        }, 4000);

        // Auto-rotate benefits on mobile every 5 seconds

        const benefitInterval = setInterval(() => {

            setCurrentBenefit((prev) => (prev + 1) % benefits.length);

        }, 5000);

        return () => {

            clearInterval(testimonialInterval);

            clearInterval(benefitInterval);

        };

    }, [testimonials.length, benefits.length]);

    // Auto-scroll desktop testimonials

    useEffect(() => {

        const desktopScrollInterval = setInterval(() => {

            if (desktopScrollRef.current) {

                const container = desktopScrollRef.current;

                const containerWidth = container.clientWidth;

                const gap = 24; // gap-6 = 24px

                // Calculate card width: (container width - 2 gaps) / 3

                const cardWidth = (containerWidth - (2 * gap)) / 3;

                const scrollAmount = cardWidth + gap;

                const maxScroll = container.scrollWidth - container.clientWidth;

                const currentScroll = container.scrollLeft;

                

                // Calculate next scroll position - scroll by exactly one card

                let nextScroll = currentScroll + scrollAmount;

                

                // If we've reached or passed the end, loop back to start

                if (nextScroll >= maxScroll - 5) {

                    // Smooth scroll back to start

                    setTimeout(() => {

                        container.scrollTo({

                            left: 0,

                            behavior: 'auto'

                        });

                    }, 500);

                    setDesktopScrollIndex(0);

                } else {

                    // Scroll to next position

                    container.scrollTo({

                        left: nextScroll,

                        behavior: 'smooth'

                    });

                    setDesktopScrollIndex((prev) => (prev + 1) % testimonials.length);

                }

            }

        }, 4000);

        return () => {

            clearInterval(desktopScrollInterval);

        };

    }, [testimonials.length]);

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

                    {/* Mobile Slider */}

                    <div className="md:hidden mb-8">

                        <div className="relative overflow-hidden rounded-xl">

                            <div

                                className="flex transition-transform duration-500 ease-in-out"

                                style={{

                                    transform: `translateX(-${currentTestimonial * 100}%)`,

                                }}

                            >

                                {testimonials.map((testimonial, index) => (

                                    <div

                                        key={index}

                                        className="min-w-full w-full flex-shrink-0 px-2"

                                    >

                                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">

                                            <div className="text-2xl mb-2">{testimonial.stars}</div>

                                            <p className="text-orange-100 text-sm mb-3">

                                                "{testimonial.text}"

                                            </p>

                                            <div className="text-orange-200 text-sm font-medium">

                                                - {testimonial.author} - {testimonial.city}

                                            </div>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </div>

                        

                        {/* Navigation Dots for Mobile */}

                        <div className="flex justify-center gap-2 mt-4">

                            {testimonials.map((_, index) => (

                                <button

                                    key={index}

                                    onClick={() => setCurrentTestimonial(index)}

                                    className={`h-2 rounded-full transition-all duration-300 ${

                                        index === currentTestimonial

                                            ? "w-8 bg-white"

                                            : "w-2 bg-white/50 hover:bg-white/75"

                                    }`}

                                    aria-label={`Go to testimonial ${index + 1}`}

                                />

                            ))}

                        </div>

                    </div>

                    {/* Desktop Scrollable */}

                    <div className="hidden md:block mb-8">

                        <div className="relative overflow-hidden rounded-xl">

                            <div 

                                ref={desktopScrollRef}

                                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-2"

                            >

                                {testimonials.map((testimonial, index) => (

                                    <div

                                        key={index}

                                        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 flex-shrink-0"

                                        style={{ 

                                            width: 'calc((100% - 48px) / 3)',

                                            minWidth: 'calc((100% - 48px) / 3)',

                                            maxWidth: 'calc((100% - 48px) / 3)'

                                        }}

                                    >

                                        <div className="text-2xl mb-2">{testimonial.stars}</div>

                                        <p className="text-orange-100 text-sm mb-3">

                                            "{testimonial.text}"

                                        </p>

                                        <div className="text-orange-200 text-sm font-medium">

                                            - {testimonial.author} - {testimonial.city}

                                        </div>

                                    </div>

                                ))}

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

                            Call Us: +91 9512870958 

                        </button>

                    </div>

                </div>

            </div>

            {/* Additional Benefits */}

            {/* Mobile Slider */}

            <div className="mt-16 md:hidden">

                <div className="relative overflow-hidden rounded-2xl">

                    <div

                        className="flex transition-transform duration-500 ease-in-out"

                        style={{

                            transform: `translateX(-${currentBenefit * 100}%)`,

                        }}

                    >

                        {benefits.map((benefit, index) => {

                            const IconComponent = benefit.icon;

                            return (

                                <div

                                    key={index}

                                    className="min-w-full w-full flex-shrink-0 px-2"

                                >

                                    <div className={`bg-gradient-to-br ${benefit.gradient} rounded-2xl p-8`}>

                                        <div className="flex items-center space-x-4 mb-6">

                                            <div className={`w-12 h-12 ${benefit.iconBg} rounded-xl flex items-center justify-center`}>

                                                <IconComponent className="w-6 h-6 text-white" />

                                            </div>

                                            <h3 className="text-xl font-bold text-gray-900">

                                                {benefit.title}

                                            </h3>

                                        </div>

                                        <p className="text-gray-600">

                                            {benefit.description}

                                        </p>

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                </div>

                

                {/* Navigation Dots for Mobile */}

                <div className="flex justify-center gap-2 mt-4">

                    {benefits.map((_, index) => (

                        <button

                            key={index}

                            onClick={() => setCurrentBenefit(index)}

                            className={`h-2 rounded-full transition-all duration-300 ${

                                index === currentBenefit

                                    ? "w-8 bg-orange-500"

                                    : "w-2 bg-gray-300 hover:bg-gray-400"

                            }`}

                            aria-label={`Go to benefit ${index + 1}`}

                        />

                    ))}

                </div>

            </div>

            {/* Desktop Grid */}

            <div className="mt-16 hidden md:grid md:grid-cols-2 gap-8">

                {benefits.map((benefit, index) => {

                    const IconComponent = benefit.icon;

                    return (

                        <div

                            key={index}

                            className={`bg-gradient-to-br ${benefit.gradient} rounded-2xl p-8`}

                        >

                            <div className="flex items-center space-x-4 mb-6">

                                <div className={`w-12 h-12 ${benefit.iconBg} rounded-xl flex items-center justify-center`}>

                                    <IconComponent className="w-6 h-6 text-white" />

                                </div>

                                <h3 className="text-xl font-bold text-gray-900">

                                    {benefit.title}

                                </h3>

                            </div>

                            <p className="text-gray-600">

                                {benefit.description}

                            </p>

                        </div>

                    );

                })}

            </div>

        </div>    

        </section>

    );

}
