import { NextResponse } from "next/server";
import connectDB from "../../lib/db";
import CITY from "../../models/city";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req) {
  try {
    await connectDB();
    const payload = await req.json();
    const { name, url, blogId } = payload || {};

    if (!name || !url) {
      return NextResponse.json(
        { success: false, message: "name and url are required" },
        { status: 400 }
      );
    }

    const existing = await CITY.findOne({ url });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "City URL already exists" },
        { status: 409 }
      );
    }

    const city = await CITY.create({
      name,
      url,
      blogId: blogId || null,
    });

    return NextResponse.json(
      { success: true, city: { ...city.toObject(), _id: city._id.toString() } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating city:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create city", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const cities = await CITY.find().sort({ createdAt: -1 }).lean();
    const normalized = cities.map((city) => ({
      ...city,
      _id: city._id.toString(),
      blogId: city.blogId ? city.blogId.toString() : null,
    }));

    return NextResponse.json({ success: true, cities: normalized }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cities:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch cities", error: error.message },
      { status: 500 }
    );
  }
}

