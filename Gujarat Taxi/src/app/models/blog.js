import mongoose from "mongoose";
import { type } from "os";
import { types } from "util";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },

    image: {
        type: String,
        require: true
    },

    // used to delete image in cloudinary when delete bolg

    img_publicId: {
        type: String,
    },

    description: {
        type: String,
        require: true
    },

    slug: {
        type: String,
        required: true,
    },

    metaTitle: {
        type: String,
        maxlength: 60,
    },

    metaDescription: {
        type: String,
        maxlength: 160,
    },

    metaKeywords: {
        type: [String],
        default: [],
    },

    extra_metatag: {
        type: String,
    },

    // Publish / Draft
    status: {
        type: String,
        enum: ["draft", "published"],
        default: "draft",
    },
}, { timestamps: true })

// Create unique index on slug (only once)
blogSchema.index({ slug: 1 }, { unique: true });
const BLOG = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default BLOG