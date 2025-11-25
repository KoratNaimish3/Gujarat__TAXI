import connectDB from "@/app/lib/db";
import Booking from "@/app/models/bookig";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const bookings = await Booking.find().sort({ createdAt: -1 });
    const totalBookings = await Booking.countDocuments()

    return NextResponse.json(
      { success: true, bookings, totalBookings },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
