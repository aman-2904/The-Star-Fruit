"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";
import { blogService } from "@/services/blogService";
import { Blog } from "@/types/blog";

export default function EditBlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadBlog(id as string);
    }
  }, [id]);

  const loadBlog = async (blogId: string) => {
    try {
      const data = await blogService.getBlogById(blogId);
      if (!data) throw new Error("Blog not found");
      setBlog(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EC5B13]"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Blog</h1>
        <p className="text-red-500">{error || "Blog not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Blog</h1>
          <p className="text-gray-500 mt-1">Update your existing article.</p>
        </div>
        
        <BlogForm initialData={blog} isEdit={true} />
      </div>
    </div>
  );
}
