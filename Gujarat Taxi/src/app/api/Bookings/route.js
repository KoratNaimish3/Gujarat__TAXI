import connectDB from "@/app/lib/db";
import Booking from "@/app/models/bookig";
import { NextResponse } from "next/server";

// Force dynamic rendering - disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await connectDB();

    const bookings = await Booking.find().sort({ createdAt: -1 });
    const totalBookings = await Booking.countDocuments()

    return NextResponse.json(
      { 
        success: true, 
        bookings, 
        totalBookings 
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      }
    );
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch bookings",
        error: error.message 
      },
      { status: 500 }
    );
  }
}
