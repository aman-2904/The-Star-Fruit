"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { blogService } from "@/services/blogService";
import { Blog } from "@/types/blog";
import { Search, ShieldCheck, Star } from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { calculateReadingTime } from "@/utils/seo";

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
      result = result.filter(b => 
        b.title.toLowerCase().includes(search.toLowerCase()) || 
        b.excerpt.toLowerCase().includes(search.toLowerCase())
      );
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
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      {/* Main Content Wrapper */}
      <main className="flex-grow max-w-[1600px] w-full mx-auto px-2 md:px-6 pt-16 pb-16">
        
        {/* Premium Hero Section Container */}
        <div className="relative rounded-3xl overflow-hidden h-[400px] md:h-[460px] w-full shadow-xl border border-gray-100 flex flex-col items-center justify-center text-white px-4">
          {/* Background Image */}
          <Image 
            src="/images/stay_villa.png" 
            alt="Luxevillaz Blogs Background" 
            fill 
            className="object-cover object-center z-0" 
            priority 
          />
          
          {/* Subtle Dynamic Gradients for absolute text readability */}
          <div className="absolute inset-0 bg-black/30 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40 z-10" />

          {/* Hero Foreground Content */}
          <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-3xl text-center">
            
            {/* Top Verified Stats Banner */}
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium tracking-wide mb-6 text-white/95 shadow-inner">
              <span className="flex items-center gap-1.5 font-semibold">
                <ShieldCheck size={14} className="text-white" /> 10,000+ verified stays
              </span>
              <span className="text-white/40">•</span>
              <span className="flex items-center gap-1.5 font-semibold">
                <Star size={14} className="text-yellow-400 fill-yellow-400" /> 4.8 Average guest rating
              </span>
            </div>

            {/* Bold Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-extrabold tracking-tight mb-8 text-white drop-shadow-sm">
              Luxevillaz Blogs
            </h1>

            {/* Embedded Rounded Glass Search Bar */}
            <div className="w-full max-w-lg relative mt-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 z-10" size={18} />
              <input 
                type="text" 
                placeholder="Search" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-3.5 bg-[#F3F3F3] text-gray-900 placeholder-gray-500 rounded-full focus:outline-none focus:ring-4 focus:ring-[#EC5B13]/30 transition-all font-medium text-sm shadow-lg border border-transparent"
              />
            </div>

          </div>
        </div>

        {/* Custom Category Filter Tabs */}
        <div className="flex flex-wrap justify-center items-center gap-3.5 my-10">
          <button 
            onClick={() => setSelectedCategory("")}
            className={`px-8 py-2.5 rounded-xl text-xs uppercase font-extrabold tracking-wider transition-all border ${
              !selectedCategory 
                ? 'border-[#EC5B13] bg-[#EC5B13]/10 text-[#EC5B13]' 
                : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-900'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat!)}
              className={`px-8 py-2.5 rounded-xl text-xs uppercase font-extrabold tracking-wider transition-all border ${
                selectedCategory === cat 
                  ? 'border-[#EC5B13] bg-[#EC5B13]/10 text-[#EC5B13]' 
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Latest Stories Area */}
        <div className="mt-4">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 px-1">
            Latest Stories
          </h2>

          {filteredBlogs.length === 0 ? (
            <div className="text-center py-16 border border-gray-100 rounded-3xl bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900 mb-1">No articles found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your search query or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {filteredBlogs.map((blog) => (
                <Link 
                  href={`/blogs/${blog.slug}`} 
                  key={blog.id} 
                  className="group flex flex-col focus:outline-none"
                >
                  {/* Fully Rounded Image Container */}
                  <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden mb-4 bg-gray-100 border border-gray-100/50 shadow-sm">
                    {blog.featured_image ? (
                      <Image 
                        src={blog.featured_image} 
                        alt={blog.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <Image src="/images/black.png" alt="Logo placeholder" width={100} height={25} className="opacity-15" />
                      </div>
                    )}

                    {/* Overlaid Absolute Category Badge */}
                    {blog.category && (
                      <span className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-md text-[9px] font-black text-[#EC5B13] tracking-widest uppercase shadow-sm z-10">
                        {blog.category}
                      </span>
                    )}
                  </div>

                  {/* Clean Text Meta Row */}
                  <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">
                    <span>{format(new Date(blog.published_at || blog.created_at), 'MMMM dd, yyyy')}</span>
                    <span>•</span>
                    <span>{calculateReadingTime(blog.content)} min read</span>
                  </div>

                  {/* Clean Bold Title */}
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#EC5B13] transition-colors duration-200 leading-snug mb-2 line-clamp-2 font-sans">
                    {blog.title}
                  </h3>
                  
                  {/* Subtle Excerpt */}
                  <p className="text-sm text-gray-500 line-clamp-2 font-normal leading-relaxed">
                    {blog.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

      </main>
      
      <Footer />
    </div>
  );
}
