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
    >
      <div className="pb-10">
        <BookingFormContent showHeader={true} />
      </div>
    </section>
  );
}
