import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            default: "",
        },
        permissions: {
            // Blog permissions
            blogCreate: { type: Boolean, default: false },
            blogEdit: { type: Boolean, default: false },
            blogDelete: { type: Boolean, default: false },
            blogPublish: { type: Boolean, default: false },
            blogView: { type: Boolean, default: false },

            // Category & Tag permissions
            categoryManage: { type: Boolean, default: false },
            tagManage: { type: Boolean, default: false },

            // Media permissions
            mediaUpload: { type: Boolean, default: false },
            mediaDelete: { type: Boolean, default: false },
            mediaView: { type: Boolean, default: false },

            // SEO permissions
            seoManage: { type: Boolean, default: false },
            redirectManage: { type: Boolean, default: false },

            // User management permissions
            userManage: { type: Boolean, default: false },
            roleManage: { type: Boolean, default: false },

            // System permissions
            auditView: { type: Boolean, default: false },
            settingsManage: { type: Boolean, default: false },
        },
    },
    { timestamps: true }
);

// Create unique index on slug
roleSchema.index({ slug: 1 }, { unique: true });

const Role = mongoose.models.Role || mongoose.model("Role", roleSchema);

export default Role;






