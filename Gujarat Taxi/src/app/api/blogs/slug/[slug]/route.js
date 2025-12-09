import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import BLOG from "../../../../models/blog";

// Force dynamic rendering - disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/blogs/slug/[slug] → Get blog by slug
export async function GET(req, { params }) {
    try {
        await connectDB();

        const { slug } = await params;

        if (!slug) {
            return NextResponse.json(
                { message: "Slug is required", success: false },
                { status: 400 }
            );
        }

        const blog = await BLOG.findOne({ slug, status: "published" })
            .populate('categories', 'name slug')
            .populate('tags', 'name slug')
            .populate('authorId', 'userName email');

        if (!blog) {
            return NextResponse.json(
                { message: "Blog not found", success: false },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { blog, success: true }, 
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
        console.error("Error fetching blog by slug:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message, success: false },
            { status: 500 }
        );
    }
}

















