import { NextResponse } from "next/server";
import { generateSitemap } from "@/lib/sitemap";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/seo/sitemap - Get sitemap preview or regenerate
export async function GET() {
    try {
        const xml = await generateSitemap();

        return NextResponse.json(
            {
                success: true,
                sitemap: xml,
                message: "Sitemap generated successfully",
            },
            {
                status: 200,
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                }
            }
        );
    } catch (error) {
        console.error("Error generating sitemap:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to generate sitemap",
                error: error.message,
            },
            { status: 500 }
        );
    }
}

// POST /api/seo/sitemap - Regenerate sitemap (same as GET, but for manual trigger)
export async function POST() {
    return GET();
}





