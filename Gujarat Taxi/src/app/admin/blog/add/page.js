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

import EditorSidebar from "@/components/editor/EditorSidebar";

export default function AddBlogPage() {
  const [data, setData] = useState({
    title: "",
    slug: "",
    description: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    extra_metatag: "",
    faqs: [],
    categories: [],
    tags: [],
    scheduledAt: "",
    canonicalUrl: "",
    featuredImageAlt: "",
    status: "draft",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setloading] = useState(false);

  const addFAQ = () => {
    setData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }]
    }));
  };

  const removeFAQ = (index) => {
    setData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  const updateFAQ = (index, field, value) => {
    setData(prev => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) => 
        i === index ? { ...faq, [field]: value } : faq
      )
    }));
  };

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
    if (e) e.preventDefault();
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
      formData.append("faqs", JSON.stringify(data.faqs));
      formData.append("categories", JSON.stringify(data.categories));
      formData.append("tags", JSON.stringify(data.tags));
      formData.append("status", data.status);
      if (data.scheduledAt) formData.append("scheduledAt", data.scheduledAt);
      if (data.canonicalUrl) formData.append("canonicalUrl", data.canonicalUrl);
      if (data.featuredImageAlt) formData.append("featuredImageAlt", data.featuredImageAlt);
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
    <div className="w-full">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 dark:text-black">Add New Blog</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Area - 70% */}
        <div className="flex-1 bg-white p-6 rounded-xl shadow-md space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
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


        {/* FAQs Section */}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-700 dark:text-black">FAQs</h2>
            <button
              type="button"
              onClick={addFAQ}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              + Add FAQ
            </button>
          </div>

          {data.faqs.map((faq, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <label className="block font-semibold text-sm dark:text-black">
                  FAQ {index + 1}
                </label>
                <button
                  type="button"
                  onClick={() => removeFAQ(index)}
                  className="text-red-600 hover:text-red-800 text-sm font-semibold"
                >
                  Remove
                </button>
              </div>
              <input
                type="text"
                placeholder="Enter question..."
                value={faq.question}
                onChange={(e) => updateFAQ(index, "question", e.target.value)}
                className="w-full border rounded-md p-2 mb-2 
                         bg-white text-black border-gray-300 
                         dark:bg-gray-800 dark:text-white dark:border-gray-600
                         focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <textarea
                placeholder="Enter answer..."
                value={faq.answer}
                onChange={(e) => updateFAQ(index, "answer", e.target.value)}
                rows="3"
                className="w-full border rounded-md p-2 
                         bg-white text-black border-gray-300 
                         dark:bg-gray-800 dark:text-white dark:border-gray-600
                         focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          ))}

          {data.faqs.length === 0 && (
            <p className="text-gray-500 text-sm italic">No FAQs added yet. Click "Add FAQ" to add one.</p>
          )}
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

          </form>
        </div>

        {/* Sidebar - 30% */}
        <div className="w-full lg:w-80 xl:w-96">
          <EditorSidebar
            data={data}
            setData={setData}
            image={image}
            preview={preview}
            existingImage={null}
            onImageChange={handleImageChange}
            onSubmit={handleSubmit}
            loading={loading}
            isEdit={false}
          />
        </div>
      </div>
    </div>
  );
}
