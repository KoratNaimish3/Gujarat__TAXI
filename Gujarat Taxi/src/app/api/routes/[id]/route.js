import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import ROUTE from "../../../models/routeModel";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function DELETE(_req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    await ROUTE.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Route deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting route:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete route", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const payload = await req.json();
    const { name, from, to, url } = payload || {};

    if (!name || !from || !to || !url) {
      return NextResponse.json(
        { success: false, message: "name, from, to and url are required" },
        { status: 400 }
      );
    }

    const existingWithUrl = await ROUTE.findOne({ url, _id: { $ne: id } });
    if (existingWithUrl) {
      return NextResponse.json(
        { success: false, message: "Route URL already exists" },
        { status: 409 }
      );
    }

    const updated = await ROUTE.findByIdAndUpdate(
      id,
      { name, from, to, url },
      { new: true }
    );

    return NextResponse.json(
      { success: true, route: updated ? { ...updated.toObject(), _id: updated._id.toString() } : null },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating route:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update route", error: error.message },
      { status: 500 }
    );
  }
}

