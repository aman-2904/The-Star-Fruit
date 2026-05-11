"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Plus, Search, Edit, Trash2, Eye, FileText, CheckCircle, Clock } from "lucide-react";
import { blogService } from "@/services/blogService";
import { Blog } from "@/types/blog";
import { format } from "date-fns";

export default function BlogAdminDashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUserAndLoadData();
  }, []);

  useEffect(() => {
    if (search) {
      setFilteredBlogs(blogs.filter(b => b.title.toLowerCase().includes(search.toLowerCase())));
    } else {
      setFilteredBlogs(blogs);
    }
  }, [search, blogs]);

  const checkUserAndLoadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push("/blogadmin/login");
      return;
    }

    const role = session.user.user_metadata?.role;
    if (role !== 'blog' && role !== 'admin') {
      await supabase.auth.signOut();
      router.push("/blogadmin/login");
      return;
    }

    await loadBlogs();
  };

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const data = await blogService.getAllBlogs();
      setBlogs(data);
      setFilteredBlogs(data);
    } catch (error) {
      console.error("Failed to load blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/blogadmin/login");
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await blogService.deleteBlog(id);
        setBlogs(blogs.filter(b => b.id !== id));
      } catch (error) {
        console.error("Failed to delete blog:", error);
        alert("Failed to delete blog");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EC5B13]"></div>
      </div>
    );
  }

  const publishedCount = blogs.filter(b => b.status === 'published').length;
  const draftCount = blogs.filter(b => b.status === 'draft').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="font-bold text-xl text-gray-900">BlogAdmin</div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-[#EC5B13] transition-colors"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your blog content and SEO</p>
          </div>
          <Link 
            href="/blogadmin/dashboard/create-blog"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#EC5B13] text-white rounded-xl font-bold hover:bg-[#d44f0f] transition-all shadow-lg shadow-[#EC5B13]/20"
          >
            <Plus size={20} className="mr-2" />
            Create New Blog
          </Link>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Blogs</p>
              <p className="text-2xl font-bold text-gray-900">{blogs.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-green-50 text-green-600 rounded-xl">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Published</p>
              <p className="text-2xl font-bold text-gray-900">{publishedCount}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-orange-50 text-orange-600 rounded-xl">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Drafts</p>
              <p className="text-2xl font-bold text-gray-900">{draftCount}</p>
            </div>
          </div>
        </div>

        {/* Blogs List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">All Blogs</h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search blogs..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/20 focus:border-[#EC5B13] transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No blogs found.
                    </td>
                  </tr>
                ) : (
                  filteredBlogs.map((blog) => (
                    <tr key={blog.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 line-clamp-1">{blog.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">/{blog.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          blog.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {blog.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {blog.category || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {format(new Date(blog.created_at), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Link 
                            href={`/blogadmin/dashboard/preview/${blog.id}`}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Preview"
                          >
                            <Eye size={18} />
                          </Link>
                          <Link 
                            href={`/blogadmin/dashboard/edit/${blog.id}`}
                            className="p-2 text-gray-400 hover:text-[#EC5B13] hover:bg-orange-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(blog.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
