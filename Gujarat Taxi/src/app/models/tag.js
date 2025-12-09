import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        seoTitle: {
            type: String,
            maxlength: 60,
        },
        seoDescription: {
            type: String,
            maxlength: 160,
        },
    },
    { timestamps: true }
);

// Create unique index on slug
tagSchema.index({ slug: 1 }, { unique: true });

const Tag = mongoose.models.Tag || mongoose.model("Tag", tagSchema);

export default Tag;

