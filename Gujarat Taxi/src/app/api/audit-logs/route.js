import { NextResponse } from "next/server";
import connectDB from "../../lib/db";
import AuditLog from "../../models/auditLog";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/audit-logs - Get audit logs with filters
export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const action = searchParams.get('action');
        const resourceType = searchParams.get('resourceType');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 50;

        const query = {};

        if (userId) {
            query.userId = userId;
        }

        if (action) {
            query.action = action;
        }

        if (resourceType) {
            query.resourceType = resourceType;
        }

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }

        const skip = (page - 1) * limit;

        const logs = await AuditLog.find(query)
            .populate('userId', 'userName email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await AuditLog.countDocuments(query);

        return NextResponse.json(
            {
                success: true,
                logs,
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
        console.error("Error fetching audit logs:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch audit logs",
                error: error.message,
            },
            { status: 500 }
        );
    }
}





