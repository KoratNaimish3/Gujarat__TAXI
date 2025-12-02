"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";

// Dynamically import both CKEditor and ClassicEditor together with SSR disabled
const CKEditorWrapper = dynamic(
  async () => {
    const { CKEditor } = await import("@ckeditor/ckeditor5-react");
    const ClassicEditor = (await import("@ckeditor/ckeditor5-build-classic"))
      .default;

    return function EditorComponent(props) {
      return <CKEditor editor={ClassicEditor} {...props} />;
    };
  },
  {
    ssr: false,
    loading: () => (
      <div className="h-64 border rounded-md p-4 bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading editor...</p>
      </div>
    ),
  }
);

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [data, setData] = useState({
    title: "",
    slug: "",
    description: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    extra_metatag: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch existing blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${id}`);
        const result = await res.json();

        if (result.success && result.blog) {
          const blog = result.blog;
          setData({
            title: blog.title || "",
            slug: blog.slug || "",
            description: blog.description || "",
            metaTitle: blog.metaTitle || "",
            metaDescription: blog.metaDescription || "",
            metaKeywords: Array.isArray(blog.metaKeywords)
              ? blog.metaKeywords.join(", ")
              : blog.metaKeywords || "",
            extra_metatag: blog.extra_metatag || "",
          });
          if (blog.image) {
            setExistingImage(blog.image);
          }
        } else {
          toast.error("Blog not found");
          router.push("/admin/blog/manage");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast.error("Failed to load blog");
        router.push("/admin/blog/manage");
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id, router]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });

    if (name === "title") {
      const slugValue = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setData((prev) => ({ ...prev, slug: slugValue }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("description", data.description);
      formData.append("metaTitle", data.metaTitle);
      formData.append("metaDescription", data.metaDescription);
      formData.append("metaKeywords", data.metaKeywords);
      formData.append("extra_metatag", data.extra_metatag);
      if (image) formData.append("image", image);

      const res = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        toast.success(result.message);
        router.push("/admin/blog/manage");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.log("error in Edit_blog..", error);
      toast.error("Something went wrong...");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading blog data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md space-y-4"
      >
        <div>
          <label className="block font-semibold">Title</label>
          <input
            type="text"
            name="title"
            value={data.title}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Slug</label>
          <input
            type="text"
            name="slug"
            value={data.slug}
            onChange={handleChange}
            className="w-full border rounded-md p-2 bg-gray-100"
            readOnly
          />
        </div>

        <div>
          <label className="block font-semibold">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded-md p-2"
          />
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="w-40 h-40 mt-2 rounded-lg object-cover"
            />
          ) : existingImage ? (
            <img
              src={existingImage}
              alt="current"
              className="w-40 h-40 mt-2 rounded-lg object-cover"
            />
          ) : null}
        </div>

        <div>
          <label className="block font-semibold">Description</label>
          <CKEditorWrapper
            data={data.description}
            onChange={(_, editor) => {
              const content = editor.getData();
              setData((prev) => ({ ...prev, description: content }));
            }}
          />
        </div>

        {/* SEO Fields */}
        <div className="border-t pt-4 mt-4">
          <h2 className="text-xl font-bold mb-2 text-gray-700">SEO Metadata</h2>

          <label className="block font-semibold">Meta Title</label>
          <input
            type="text"
            name="metaTitle"
            value={data.metaTitle}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            maxLength={60}
          />

          <label className="block font-semibold mt-3">Meta Description</label>
          <textarea
            name="metaDescription"
            value={data.metaDescription}
            onChange={handleChange}
            className="w-full border rounded-md p-2 h-20"
            maxLength={160}
          />

          <label className="block font-semibold mt-3">Meta Keywords</label>
          <input
            type="text"
            name="metaKeywords"
            value={data.metaKeywords}
            onChange={handleChange}
            placeholder="travel, gujarat, tourism"
            className="w-full border rounded-md p-2"
          />

          <label className="block font-semibold mt-3">Extra Meta-Tags</label>
          <textarea
            name="extra_metatag"
            value={data.extra_metatag}
            onChange={handleChange}
            className="w-full border rounded-md p-2 h-20"
            maxLength={160}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            {loading ? "Updating..." : "Update Blog"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/blog/manage")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
