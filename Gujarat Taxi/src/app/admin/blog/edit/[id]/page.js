"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import EditorSidebar from "@/components/editor/EditorSidebar";
import RevisionViewer from "@/components/editor/RevisionViewer";

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
        <p className="text-gray-500 dark:text-black">Loading editor...</p>
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
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showRevisions, setShowRevisions] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

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
            faqs: Array.isArray(blog.faqs) ? blog.faqs : [],
            categories: Array.isArray(blog.categories)
              ? blog.categories.map(cat => typeof cat === 'object' ? cat._id : cat)
              : [],
            tags: Array.isArray(blog.tags)
              ? blog.tags.map(tag => typeof tag === 'object' ? tag._id : tag)
              : [],
            scheduledAt: blog.scheduledAt
              ? new Date(blog.scheduledAt).toISOString().slice(0, 16)
              : "",
            canonicalUrl: blog.canonicalUrl || "",
            featuredImageAlt: blog.featuredImageAlt || "",
            status: blog.status || "draft",
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

  // Auto-save revisions every 30 seconds
  useEffect(() => {
    if (!id || !data.title || !data.description) return;

    const autoSaveInterval = setInterval(async () => {
      try {
        await fetch(`/api/blogs/${id}/revisions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contentHtml: data.description,
            title: data.title,
            description: data.description,
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription,
            excerpt: data.description?.replace(/<[^>]+>/g, "").substring(0, 200) || "",
          }),
        });
        setLastSaved(new Date());
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [id, data]);

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
      formData.append("faqs", JSON.stringify(data.faqs));
      formData.append("categories", JSON.stringify(data.categories));
      formData.append("tags", JSON.stringify(data.tags));
      formData.append("status", data.status);
      if (data.scheduledAt) formData.append("scheduledAt", data.scheduledAt);
      if (data.canonicalUrl) formData.append("canonicalUrl", data.canonicalUrl);
      if (data.featuredImageAlt) formData.append("featuredImageAlt", data.featuredImageAlt);
      if (image) formData.append("image", image);

      const res = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        // Save revision on manual save
        try {
          await fetch(`/api/blogs/${id}/revisions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contentHtml: data.description,
              title: data.title,
              description: data.description,
              metaTitle: data.metaTitle,
              metaDescription: data.metaDescription,
              excerpt: data.description?.replace(/<[^>]+>/g, "").substring(0, 200) || "",
            }),
          });
        } catch (error) {
          console.error("Failed to save revision:", error);
        }

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
          <p className="text-gray-600 dark:text-gray-300 ">Loading blog data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 dark:text-black">Edit Blog</h1>

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
          <label className="block font-semibold dark:text-black">Description</label>
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
                value={faq.question || ""}
                onChange={(e) => updateFAQ(index, "question", e.target.value)}
                className="w-full border rounded-md p-2 mb-2 
                         bg-white text-black border-gray-300 
                         dark:bg-gray-800 dark:text-white dark:border-gray-600
                         focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <textarea
                placeholder="Enter answer..."
                value={faq.answer || ""}
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

        {/* SEO Fields */}
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
            existingImage={existingImage}
            onImageChange={handleImageChange}
            onSubmit={handleSubmit}
            loading={loading}
            isEdit={true}
          />
        </div>
      </div>

      {/* Revisions Section */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Revision History</h2>
          <button
            onClick={() => setShowRevisions(!showRevisions)}
            className="text-orange-600 hover:text-orange-700 text-sm font-medium"
          >
            {showRevisions ? "Hide" : "Show"} Revisions
          </button>
        </div>
        {showRevisions && (
          <RevisionViewer
            blogId={id}
            currentContent={data.description}
            onRestore={(restoredBlog) => {
              setData({
                ...data,
                title: restoredBlog.title,
                description: restoredBlog.description,
                metaTitle: restoredBlog.metaTitle,
                metaDescription: restoredBlog.metaDescription,
              });
              toast.success("Content restored from revision");
            }}
          />
        )}
        {lastSaved && (
          <p className="text-xs text-gray-500 mt-2">
            Last auto-saved: {lastSaved.toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  );
}
