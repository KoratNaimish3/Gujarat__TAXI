import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  // Remove admin cookie
  res.cookies.set("adminToken", "", {
    httpOnly: true,
    expires: new Date(0), // instantly expire
  });

  return res;
}
