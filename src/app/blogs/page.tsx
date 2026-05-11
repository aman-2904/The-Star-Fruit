"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { blogService } from "@/services/blogService";
import { Blog } from "@/types/blog";
import { Search, Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";

export default function PublicBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    loadBlogs();
  }, []);

  useEffect(() => {
    let result = blogs;
    if (search) {
      result = result.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.excerpt.toLowerCase().includes(search.toLowerCase()));
    }
    if (selectedCategory) {
      result = result.filter(b => b.category === selectedCategory);
    }
    setFilteredBlogs(result);
  }, [search, selectedCategory, blogs]);

  const loadBlogs = async () => {
    try {
      const data = await blogService.getPublishedBlogs();
      setBlogs(data);
      setFilteredBlogs(data);
    } catch (error) {
      console.error("Failed to load blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = Array.from(new Set(blogs.map(b => b.category).filter(Boolean)));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EC5B13]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-24 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">LuxeVillaz Journal</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Discover insights on luxury living, travel destinations, and real estate investment.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/20 focus:border-[#EC5B13] transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <button 
              onClick={() => setSelectedCategory("")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!selectedCategory ? 'bg-[#EC5B13] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              All
            </button>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat!)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat ? 'bg-[#EC5B13] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-500">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <article key={blog.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group">
                <Link href={`/blogs/${blog.slug}`} className="relative h-64 overflow-hidden block">
                  {blog.featured_image ? (
                    <Image 
                      src={blog.featured_image} 
                      alt={blog.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Image src="/images/black.png" alt="Logo" width={120} height={30} className="opacity-20" />
                    </div>
                  )}
                  {blog.category && (
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#EC5B13]">
                      {blog.category}
                    </span>
                  )}
                </Link>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center"><Calendar size={14} className="mr-1" /> {format(new Date(blog.published_at || blog.created_at), 'MMM dd, yyyy')}</span>
                  </div>

                  <Link href={`/blogs/${blog.slug}`}>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#EC5B13] transition-colors">{blog.title}</h2>
                  </Link>
                  
                  <p className="text-gray-600 line-clamp-3 mb-6 text-sm">{blog.excerpt}</p>

                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <Link href={`/blogs/${blog.slug}`} className="inline-flex items-center text-[#EC5B13] font-bold hover:gap-2 transition-all">
                      Read Article <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
