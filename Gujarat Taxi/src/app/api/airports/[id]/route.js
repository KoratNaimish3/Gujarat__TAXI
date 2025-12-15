import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import AIRPORT from "../../../models/airport";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const airport = await AIRPORT.findByIdAndDelete(id);
    if (!airport) {
      return NextResponse.json(
        { success: false, message: "Airport not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Airport deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting airport:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete airport", error: error.message },
      { status: 500 }
    );
  }
}

