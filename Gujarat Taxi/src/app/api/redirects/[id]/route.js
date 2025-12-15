import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import Redirect from "../../../models/redirect";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/redirects/[id] - Get redirect by ID
export async function GET(req, { params }) {
    try {
        await connectDB();

        const { id } = await params;
        const redirect = await Redirect.findById(id).populate('createdBy', 'userName email');

        if (!redirect) {
            return NextResponse.json(
                { success: false, message: "Redirect not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, redirect },
            {
                status: 200,
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                }
            }
        );
    } catch (error) {
        console.error("Error fetching redirect:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch redirect", error: error.message },
            { status: 500 }
        );
    }
}

// PUT /api/redirects/[id] - Update redirect
export async function PUT(req, { params }) {
    try {
        await connectDB();

        const { id } = await params;
        const body = await req.json();
        const { fromPath, toPath, type, active, notes } = body;

        const redirect = await Redirect.findById(id);
        if (!redirect) {
            return NextResponse.json(
                { success: false, message: "Redirect not found" },
                { status: 404 }
            );
        }

        // Normalize paths
        const normalizedFrom = fromPath 
            ? (fromPath.startsWith('/') ? fromPath : `/${fromPath}`)
            : redirect.fromPath;
        const normalizedTo = toPath 
            ? (toPath.startsWith('/') || toPath.startsWith('http') ? toPath : `/${toPath}`)
            : redirect.toPath;

        // Check for circular redirects
        if (normalizedFrom === normalizedTo) {
            return NextResponse.json(
                { success: false, message: "Cannot redirect to the same path" },
                { status: 400 }
            );
        }

        // Check if fromPath already exists (excluding current redirect)
        if (fromPath && normalizedFrom !== redirect.fromPath) {
            const existing = await Redirect.findOne({ 
                fromPath: normalizedFrom,
                _id: { $ne: id }
            });
            if (existing) {
                return NextResponse.json(
                    { success: false, message: "A redirect from this path already exists" },
                    { status: 400 }
                );
            }
        }

        const updatedRedirect = await Redirect.findByIdAndUpdate(
            id,
            {
                fromPath: normalizedFrom,
                toPath: normalizedTo,
                type: type !== undefined ? type : redirect.type,
                active: active !== undefined ? active : redirect.active,
                notes: notes !== undefined ? notes : redirect.notes,
            },
            { new: true, runValidators: true }
        ).populate('createdBy', 'userName email');

        return NextResponse.json(
            {
                success: true,
                message: "Redirect updated successfully",
                redirect: updatedRedirect,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating redirect:", error);
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, message: "A redirect from this path already exists" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, message: "Failed to update redirect", error: error.message },
            { status: 500 }
        );
    }
}

// DELETE /api/redirects/[id] - Delete redirect
export async function DELETE(req, { params }) {
    try {
        await connectDB();

        const { id } = await params;

        const redirect = await Redirect.findById(id);
        if (!redirect) {
            return NextResponse.json(
                { success: false, message: "Redirect not found" },
                { status: 404 }
            );
        }

        await Redirect.findByIdAndDelete(id);

        return NextResponse.json(
            { success: true, message: "Redirect deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting redirect:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete redirect", error: error.message },
            { status: 500 }
        );
    }
}






