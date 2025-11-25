  import { NextResponse } from "next/server";
  import jwt from "jsonwebtoken";
  import bcrypt from "bcryptjs";
  import Admin from "../../../models/admin.js";
  import connectDB from "../../../lib/db.js";

  export async function POST(req) {
    try {
      await connectDB();
      console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHH')

      const { email, password } = await req.json();

      const admin = await Admin.findOne({ email });

      if (!admin) {
        return NextResponse.json(
          { success: false, message: "Email not found" },
          { status: 401 }
        );
      }

      const isMatch = await bcrypt.compare(password, admin.password);

      if (!isMatch) {
        return NextResponse.json(
          { success: false, message: "Invalid password" },
          { status: 401 }
        );
      }

      const token = jwt.sign(
        { id: admin._id, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      const res = NextResponse.json({
        success: true,
        message: "Login successful",
      });

      res.cookies.set("adminToken", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7 days

      });

      return res;

    } catch (error) {
      console.error("Admin Login Error:", error);
      return NextResponse.json(
        { success: false, message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
