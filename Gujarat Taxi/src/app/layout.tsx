import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { BookingModalProvider } from "@/contexts/BookingModalContext";
import BookingModal from "@/components/BookingModal";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Gujarat Taxi - Khushboo Gujarat Ki | Book Your Ride",
  description:
    "Reliable, affordable & comfortable taxi services across Gujarat. One-way, round trip, and airport rides with experienced drivers.",
  keywords:
    "Gujarat taxi, Ahmedabad taxi, Surat taxi, Vadodara taxi, Rajkot taxi, airport pickup, outstation travel",
  authors: [{ name: "Wolfron Technologies LLP" }],
  robots: "index, follow",
  openGraph: {
    title: "Gujarat Taxi - Khushboo Gujarat Ki",
    description:
      "Book your ride with Gujarat Taxi - Reliable, Affordable & Comfortable",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className={`${poppins.className} antialiased`}>
        <BookingModalProvider>
          <ToastContainer/>
          {children}
          <BookingModal />
        </BookingModalProvider>
      </body>
    </html>
  );
}
