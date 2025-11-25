import { NextResponse } from "next/server";
import connectDB from "../../../lib/db"
import BLOG from "../../../models/blog"
import cloudinary from "@/app/lib/cloudinary";

// GET /api/blogs/[id] → Get blog by ID
export async function GET(req, { params }) {
    try {
        await connectDB();

        const { id } = await params;

        const blog = await BLOG.findById(id);
        if (!blog) {
            return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
        }

        return NextResponse.json({ blog, success: true }, { status: 200 });
    } catch (error) {
        console.error("Get blog error:", error);
        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
    }
}

// PUT /api/blogs/[id] → Update blog
export async function PUT(req, { params }) {
    try {
        await connectDB();

        const { id } = await params;
        const formData = await req.formData();

        const blog = await BLOG.findById(id);
        if (!blog) {
            return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
        }

        const title = formData.get("title");
        const slug = formData.get("slug");
        const description = formData.get("description");
        const metaTitle = formData.get("metaTitle");
        const metaDescription = formData.get("metaDescription");
        const extra_metatag = formData.get("extra_metatag");
        const metaKeywords = formData.get("metaKeywords")
            ?.split(",")
            .map((k) => k.trim());
        const imageFile = formData.get("image");
        const status = formData.get("status") || blog.status;

        // Check if slug is being changed and if it already exists
        if (slug && slug !== blog.slug) {
            const existing = await BLOG.findOne({ slug, _id: { $ne: id } });
            if (existing) {
                return NextResponse.json(
                    { message: "Slug already exists. Please change the title.", success: false },
                    { status: 400 }
                );
            }
        }

        let imageUrl = blog.image;
        let publicId = blog.img_publicId;

        // If new image is uploaded, delete old one and upload new
        if (imageFile && imageFile.size > 0) {
            // Delete old image from Cloudinary if exists
            if (blog.img_publicId) {
                try {
                    await cloudinary.uploader.destroy(blog.img_publicId);
                    console.log("✅ Old Cloudinary image deleted:", blog.img_publicId);
                } catch (err) {
                    console.error("❌ Error deleting old image from Cloudinary:", err);
                }
            }

            // Upload new image
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadRes = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: "gujrat_taxi/blogs"
                    },
                    (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    }
                ).end(buffer);
            });

            imageUrl = uploadRes.secure_url;
            publicId = uploadRes.public_id;
        }

        // Update blog
        const updatedBlog = await BLOG.findByIdAndUpdate(
            id,
            {
                title: title || blog.title,
                slug: slug || blog.slug,
                description: description || blog.description,
                image: imageUrl,
                img_publicId: publicId,
                metaTitle: metaTitle || blog.metaTitle,
                metaDescription: metaDescription || blog.metaDescription,
                metaKeywords: metaKeywords || blog.metaKeywords,
                extra_metatag: extra_metatag || blog.extra_metatag,
                status: status,
            },
            { new: true, runValidators: true }
        );

        return NextResponse.json(
            { message: "Blog updated successfully!", blog: updatedBlog, success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error("Update blog error:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message, success: false },
            { status: 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectDB();

        const {id}= await params

        const blog = await BLOG.findById(id);
        if (!blog) {
            return Response.json({ success: false, message: "Prompt not found" }, { status: 404 });
        }

        if (blog.img_publicId) {
            try {
                await cloudinary.uploader.destroy(blog.img_publicId);
                console.log("✅ Cloudinary image deleted:", blog.img_publicId);
            } catch (err) {
                console.error("❌ Error deleting image from Cloudinary:", err);
            }
        }

        const res = await BLOG.findByIdAndDelete(id);

        return NextResponse.json({ message: "Blog deleted successfully", success: true }, { status: 200 });
        
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
    }
}
