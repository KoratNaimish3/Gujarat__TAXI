"use client";

import React, { useState } from "react";
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

export default function AddBlogPage() {
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
  const [loading, setloading] = useState(false);

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
    setloading(true);

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

      const res = await fetch("/api/blogs", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.log("error in Add_blod..", error);
      toast.error("something wrong...");
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 dark:text-black">Add New Blog</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md space-y-4"
      >
        <div>
          <label className="block font-semibold dark:text-black">Title</label>
          <input
            type="text"
            name="title"
            value={data.title}
            onChange={handleChange}
            className="w-full border rounded-md p-2 
                     bg-white text-black border-gray-300 
                     dark:bg-gray-800 dark:text-white dark:border-gray-600
                     focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
        </div>

        <div>
          <label className="block font-semibold dark:text-black">Slug</label>
          <input
            type="text"
            name="slug"
            value={data.slug}
            onChange={handleChange}
            className="w-full border rounded-md p-2 
                     bg-gray-100 text-black border-gray-300 
                     dark:bg-gray-700 dark:text-white dark:border-gray-600"
            readOnly
          />
        </div>

        <div>
          <label className="block font-semibold dark:text-black">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded-md p-2 
                     bg-white text-black border-gray-300 
                     dark:bg-gray-800 dark:text-white dark:border-gray-600
                     focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-40 h-40 mt-2 rounded-lg object-cover"
            />
          )}
        </div>

        <div>
          <label className="block font-semibold mb-2 dark:text-black">Description</label>
          <div className="ckeditor-wrapper dark:bg-gray-800"> 
            <CKEditorWrapper
              data={data.description}
              onChange={(_, editor) => {
                const content = editor.getData();
                setData((prev) => ({ ...prev, description: content }));
              }}
            />
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <h2 className="text-xl font-bold mb-2 text-gray-700 dark:text-black">SEO Metadata</h2>

          <label className="block font-semibold dark:text-black">Meta Title</label>
          <input
            type="text"
            name="metaTitle"
            value={data.metaTitle}
            onChange={handleChange}
            className="w-full border rounded-md p-2 
                     bg-white text-black border-gray-300 
                     dark:bg-gray-800 dark:text-white dark:border-gray-600
                     focus:outline-none focus:ring-2 focus:ring-orange-400"
            maxLength={60}
          />

          <label className="block font-semibold mt-3 dark:text-black">Meta Description</label>
          <textarea
            name="metaDescription"
            value={data.metaDescription}
            onChange={handleChange}
            className="w-full border rounded-md p-2 h-20 
                     bg-white text-black border-gray-300 
                     dark:bg-gray-800 dark:text-white dark:border-gray-600
                     focus:outline-none focus:ring-2 focus:ring-orange-400"
            maxLength={160}
          />

          <label className="block font-semibold mt-3 dark:text-black">Meta Keywords</label>
          <input
            type="text"
            name="metaKeywords"
            value={data.metaKeywords}
            onChange={handleChange}
            placeholder="travel, gujarat, tourism"
            className="w-full border rounded-md p-2 
                     bg-white text-black placeholder-gray-500 border-gray-300 
                     dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600
                     focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <label className="block font-semibold mt-3 dark:text-black">Extra Meta-Tags</label>
          <textarea
            name="extra_metatag"
            value={data.extra_metatag}
            onChange={handleChange}
            className="w-full border rounded-md p-2 h-20 
                     bg-white text-black border-gray-300 
                     dark:bg-gray-800 dark:text-white dark:border-gray-600
                     focus:outline-none focus:ring-2 focus:ring-orange-400"
            maxLength={160}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold"
        >
          {loading ? "Process..." : "Add blog"}
        </button>
      </form>
    </div>
  );
}
