import connectDB from "@/app/lib/db";
import Booking from "@/app/models/bookig";
import { NextResponse } from "next/server";

// Force dynamic rendering - disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// PUT /api/Bookings/[id] → Update booking
export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json(
        { success: false, message: "Booking not found" },
        { status: 404 }
      );
    }

    // Update booking fields
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Booking updated successfully",
        booking: updatedBooking,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        }
      }
    );
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update booking",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

