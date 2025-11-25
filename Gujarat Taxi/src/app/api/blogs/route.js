import { NextResponse } from "next/server";
import connectDB from "../../lib/db";
import BLOG from "../../models/blog";
import cloudinary from "../../lib/cloudinary";

// POST /api/blogs → Create new blog
export async function POST(req) {
    try {
        await connectDB()

        const formData = await req.formData();

        const title = formData.get("title")
        const slug = formData.get("slug")
        const description = formData.get("description")
        const metaTitle = formData.get("metaTitle")
        const metaDescription = formData.get("metaDescription")
        const extra_metatag = formData.get("extra_metatag")
        const metaKeywords = (formData.get("metaKeywords"))
            ?.split(",")
            .map((k) => k.trim());
        const imageFile = formData.get("image")


        if (!title || !slug || !description || !imageFile) {
            return NextResponse.json(
                { message: "Title, slug, and description are required.", success: false },
                { status: 400 }
            );
        }

        const existing = await BLOG.findOne({ slug });
        if (existing) {
            return NextResponse.json(
                { message: "Slug already exists. Please change the title.", success: false },
                { status: 400 }
            );
        }

        if (imageFile) {
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

            const imageUrl = uploadRes.secure_url;
            const publicId = uploadRes.public_id;

            console.log(publicId)


            const newBlog = await BLOG.create({
                title,
                slug,
                image: imageUrl,
                img_publicId: publicId,
                description,
                metaTitle,
                metaDescription,
                metaKeywords,
                extra_metatag,
                status: "published",
            });

            console.log(publicId)

            return NextResponse.json(
                { message: "Blog created successfully!", blog: newBlog, success: true },
                { status: 201 }
            );
        }
    } catch (error) {
        console.error("Error creating blog:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message, success: false },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectDB();

        const blogs = await BLOG.find().sort({ createdAt: -1 });
        const totalBlogs = await BLOG.countDocuments(); 

        return NextResponse.json({ blogs , totalBlogs }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch blogs", error: error.message, success: false },
            { status: 500 }
        );
    }
}
