"use client";

import BlogForm from "@/components/admin/BlogForm";

export default function CreateBlogPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Blog</h1>
          <p className="text-gray-500 mt-1">Write and publish a new article.</p>
        </div>
        
        <BlogForm />
      </div>
    </div>
  );
}
