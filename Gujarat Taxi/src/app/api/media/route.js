import { NextResponse } from "next/server";
import connectDB from "../../lib/db";
import Media from "../../models/media";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/media - Get all media
export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 20;

        const query = {};
        if (search) {
            query.$or = [
                { altText: { $regex: search, $options: 'i' } },
                { caption: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (page - 1) * limit;

        const media = await Media.find(query)
            .populate('uploadedBy', 'userName email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Media.countDocuments(query);

        return NextResponse.json(
            {
                success: true,
                media,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
            {
                status: 200,
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                }
            }
        );
    } catch (error) {
        console.error("Error fetching media:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch media",
                error: error.message,
            },
            { status: 500 }
        );
    }
}

// DELETE /api/media - Delete media (bulk)
export async function DELETE(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { ids } = body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json(
                { success: false, message: "Media IDs are required" },
                { status: 400 }
            );
        }

        // Get media to delete (for Cloudinary cleanup)
        const mediaToDelete = await Media.find({ _id: { $in: ids } });

        // Delete from database
        await Media.deleteMany({ _id: { $in: ids } });

        // TODO: Delete from Cloudinary using publicId
        // This would require cloudinary import and delete calls

        return NextResponse.json(
            {
                success: true,
                message: `Deleted ${ids.length} media file(s)`,
                deleted: ids.length,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting media:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete media",
                error: error.message,
            },
            { status: 500 }
        );
    }
}

