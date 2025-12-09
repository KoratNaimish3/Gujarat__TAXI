import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import Media from "../../../models/media";
import cloudinary from "../../../lib/cloudinary";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/media/[id] - Get media by ID
export async function GET(req, { params }) {
    try {
        await connectDB();

        const { id } = await params;
        const media = await Media.findById(id).populate('uploadedBy', 'userName email');

        if (!media) {
            return NextResponse.json(
                { success: false, message: "Media not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, media },
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
            { success: false, message: "Failed to fetch media", error: error.message },
            { status: 500 }
        );
    }
}

// PUT /api/media/[id] - Update media
export async function PUT(req, { params }) {
    try {
        await connectDB();

        const { id } = await params;
        const body = await req.json();
        const { altText, caption } = body;

        const media = await Media.findById(id);
        if (!media) {
            return NextResponse.json(
                { success: false, message: "Media not found" },
                { status: 404 }
            );
        }

        const updatedMedia = await Media.findByIdAndUpdate(
            id,
            {
                altText: altText !== undefined ? altText : media.altText,
                caption: caption !== undefined ? caption : media.caption,
            },
            { new: true, runValidators: true }
        ).populate('uploadedBy', 'userName email');

        return NextResponse.json(
            {
                success: true,
                message: "Media updated successfully",
                media: updatedMedia,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating media:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update media", error: error.message },
            { status: 500 }
        );
    }
}

// DELETE /api/media/[id] - Delete media
export async function DELETE(req, { params }) {
    try {
        await connectDB();

        const { id } = await params;

        const media = await Media.findById(id);
        if (!media) {
            return NextResponse.json(
                { success: false, message: "Media not found" },
                { status: 404 }
            );
        }

        // Delete from Cloudinary
        try {
            await cloudinary.uploader.destroy(media.publicId);
        } catch (cloudinaryError) {
            console.error("Error deleting from Cloudinary:", cloudinaryError);
            // Continue with database deletion even if Cloudinary deletion fails
        }

        // Delete from database
        await Media.findByIdAndDelete(id);

        return NextResponse.json(
            { success: true, message: "Media deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting media:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete media", error: error.message },
            { status: 500 }
        );
    }
}

