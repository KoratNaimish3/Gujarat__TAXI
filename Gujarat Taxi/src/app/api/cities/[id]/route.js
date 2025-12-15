import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import CITY from "../../../models/city";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const city = await CITY.findByIdAndDelete(id);
    if (!city) {
      return NextResponse.json(
        { success: false, message: "City not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "City deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting city:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete city", error: error.message },
      { status: 500 }
    );
  }
}

