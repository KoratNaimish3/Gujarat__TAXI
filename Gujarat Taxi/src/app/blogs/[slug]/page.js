"use client"

import Header_Components from "@/components/common_components/Header_components"
import Footer_Components from "@/components/common_components/Footer_components"
import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function BlogPostPage() {
    const params = useParams()
    const slug = params?.slug
    const [blog, setBlog] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const contentRef = useRef(null)

    useEffect(() => {
        const fetchBlog = async () => {
            if (!slug) return

            try {
                setLoading(true)
                const res = await fetch(`/api/blogs/slug/${slug}`)
                const data = await res.json()

                if (data.success && data.blog) {
                    setBlog(data.blog)
                } else {
                    setError("Blog not found")
                }
            } catch (err) {
                console.error("Error fetching blog:", err)
                setError("Failed to load blog")
            } finally {
                setLoading(false)
            }
        }

        fetchBlog()
    }, [slug])

    // Wrap tables in scrollable containers for mobile
    useEffect(() => {
        if (!contentRef.current || !blog) return

        const wrapTables = () => {
            const contentDiv = contentRef.current
            if (!contentDiv) return

            const tables = contentDiv.querySelectorAll('table')

            tables.forEach((table) => {
                // Check if table is already wrapped
                if (table.parentElement?.classList.contains('table-scroll-wrapper')) {
                    return
                }

                // Create wrapper div with inline styles to ensure it works
                const wrapper = document.createElement('div')
                wrapper.className = 'table-scroll-wrapper'
                
                // Add inline styles as fallback - ensure scrolling works
                wrapper.style.cssText = `
                    width: 100% !important;
                    max-width: 100% !important;
                    overflow-x: auto !important;
                    overflow-y: hidden !important;
                    -webkit-overflow-scrolling: touch !important;
                    margin: 1.5rem 0 !important;
                    position: relative !important;
                    display: block !important;
                    scrollbar-width: auto !important;
                    scrollbar-color: #f97316 #e5e7eb !important;
                    -ms-overflow-style: scrollbar !important;
                    border: 1px solid #e5e7eb !important;
                    border-radius: 8px !important;
                    padding: 12px 0 !important;
                    background: #fafafa !important;
                `
                
                // Ensure table has min-width that's larger than container to force scrolling
                const containerWidth = contentDiv.offsetWidth || window.innerWidth
                const minTableWidth = Math.max(600, containerWidth + 100) // At least 100px wider than container
                
                table.style.minWidth = `${minTableWidth}px`
                table.style.margin = '0'
                table.style.width = 'auto'
                table.style.maxWidth = 'none'
                table.style.display = 'table'
                
                // Wrap the table
                const parent = table.parentNode
                if (parent) {
                    parent.insertBefore(wrapper, table)
                    wrapper.appendChild(table)
                }
            })
        }

        // Try immediately
        wrapTables()

        // Also try after delays to catch dynamically loaded content
        const timeoutId1 = setTimeout(wrapTables, 100)
        const timeoutId2 = setTimeout(wrapTables, 500)
        
        // Use MutationObserver to catch any tables added later
        const observer = new MutationObserver(() => {
            setTimeout(wrapTables, 50)
        })
        if (contentRef.current) {
            observer.observe(contentRef.current, {
                childList: true,
                subtree: true
            })
        }

        return () => {
            clearTimeout(timeoutId1)
            clearTimeout(timeoutId2)
            observer.disconnect()
        }
    }, [blog])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header_Components />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <p className="text-gray-600">Loading blog post...</p>
                    </div>
                </div>
                <Footer_Components />
            </div>
        )
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header_Components />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
                        <p className="text-gray-600 mb-6">{error || "The blog post you're looking for doesn't exist."}</p>
                        <Link
                            href="/blogs"
                            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
                        >
                            <ArrowLeft size={18} />
                            Back to Blogs
                        </Link>
                    </div>
                </div>
                <Footer_Components />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden">
            <Header_Components />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-x-hidden">
                {/* Back Button */}
                <Link
                    href="/blogs"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-8 transition-colors"
                >
                    <ArrowLeft size={18} />
                    Back to Blogs
                </Link>

                {/* Blog Content */}
                <article className="bg-white rounded-lg shadow-lg overflow-visible md:overflow-hidden">
                    <div className="pl-8 w-full border-2 flex justify-center items-center bg-blue-200">
                     {blog.image ? (
                        <img
                            src={blog.image}
                            alt={blog.title}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full  "
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                            No Image
                        </div>
                    )}
                    </div>
                   

                    <div className="p-4 md:p-8 pt-4 overflow-visible md:overflow-hidden">
                        {/* Title */}
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            {blog.title}
                        </h1>

                        {/* Meta Information */}
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                            {blog.createdAt && (
                                <span>
                                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    })}
                                </span>
                            )}
                        </div>

                        {/* Description/Content */}
                        <div
                            ref={contentRef}
                            className="prose prose-lg max-w-none text-gray-700 blog-content"
                            dangerouslySetInnerHTML={{ __html: blog.description }}
                            style={{ overflowX: 'visible' }}
                        />

                        {/* Keywords */}
                        {blog.metaKeywords && blog.metaKeywords.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {blog.metaKeywords.map((keyword, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                        >
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </article>
            </div>

            <Footer_Components />
        </div>
    )
}





