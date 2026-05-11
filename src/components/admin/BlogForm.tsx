"use client";

import { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Blog, CreateBlogDTO } from "@/types/blog";
import { blogService } from "@/services/blogService";
import { slugify } from "@/utils/seo";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/editor/RichTextEditor";
import { ArrowLeft, Save, Send, Image as ImageIcon, X, Trash2, Plus } from "lucide-react";
import Image from "next/image";

interface BlogFormProps {
  initialData?: Blog;
  isEdit?: boolean;
}

export default function BlogForm({ initialData, isEdit = false }: BlogFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<CreateBlogDTO>({
    defaultValues: initialData ? {
      title: initialData.title,
      slug: initialData.slug,
      excerpt: initialData.excerpt,
      content: initialData.content,
      featured_image: initialData.featured_image || '',
      seo_title: initialData.seo_title || '',
      seo_description: initialData.seo_description || '',
      tags: initialData.tags || [],
      category: initialData.category || '',
      status: initialData.status,
      faqs: initialData.faqs || [],
      is_indexable: initialData.is_indexable ?? true
    } : {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featured_image: "",
      seo_title: "",
      seo_description: "",
      tags: [],
      category: "",
      status: "draft",
      faqs: [],
      is_indexable: true
    }
  });

  const titleValue = watch("title");
  const tagsValue = watch("tags");
  const featuredImageValue = watch("featured_image");

  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
    control,
    name: "faqs"
  });

  // Auto-generate slug from title if not edit mode
  useEffect(() => {
    if (!isEdit && titleValue) {
      setValue("slug", slugify(titleValue), { shouldValidate: true });
    }
  }, [titleValue, isEdit, setValue]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const url = await blogService.uploadImage(file);
      setValue("featured_image", url, { shouldValidate: true });
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !tagsValue.includes(newTag)) {
        setValue("tags", [...tagsValue, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue("tags", tagsValue.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = async (data: CreateBlogDTO, status: 'draft' | 'published') => {
    setIsSubmitting(true);
    try {
      const submitData = { ...data, status };
      
      if (isEdit && initialData) {
        await blogService.updateBlog(initialData.id, submitData);
        alert("Blog updated successfully!");
      } else {
        await blogService.createBlog(submitData);
        alert("Blog created successfully!");
      }
      
      router.push("/blogadmin/dashboard");
      router.refresh();
    } catch (error: any) {
      console.error("Failed to save blog:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-[#EC5B13] transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleSubmit((data) => onSubmit(data, 'draft'))()}
            disabled={isSubmitting}
            className="flex items-center px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all disabled:opacity-50 shadow-sm"
          >
            <Save size={18} className="mr-2" />
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit((data) => onSubmit(data, 'published'))()}
            disabled={isSubmitting}
            className="flex items-center px-6 py-2.5 bg-[#EC5B13] text-white rounded-xl font-bold hover:bg-[#d44f0f] transition-all shadow-lg shadow-[#EC5B13]/20 disabled:opacity-50"
          >
            <Send size={18} className="mr-2" />
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Blog Title</label>
              <input
                {...register("title", { required: "Title is required" })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/20 focus:border-[#EC5B13] transition-all text-lg font-medium"
                placeholder="Enter blog title"
              />
              {errors.title && <span className="text-red-500 text-sm mt-1">{errors.title.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Short Excerpt</label>
              <textarea
                {...register("excerpt", { required: "Excerpt is required" })}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/20 focus:border-[#EC5B13] transition-all resize-none"
                placeholder="A brief summary of the blog post..."
              />
              {errors.excerpt && <span className="text-red-500 text-sm mt-1">{errors.excerpt.message}</span>}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-sm font-bold text-gray-700 mb-4">Blog Content</label>
            <Controller
              name="content"
              control={control}
              rules={{ required: "Content is required" }}
              render={({ field }) => (
                <RichTextEditor 
                  value={field.value} 
                  onChange={field.onChange} 
                />
              )}
            />
            {errors.content && <span className="text-red-500 text-sm mt-2 block">{errors.content.message}</span>}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="font-bold text-gray-900">FAQ Section</h3>
              <button
                type="button"
                onClick={() => appendFaq({ question: "", answer: "" })}
                className="flex items-center text-sm px-3 py-1.5 bg-gray-50 text-[#EC5B13] rounded-lg font-bold hover:bg-orange-50 transition-colors"
              >
                <Plus size={16} className="mr-1" /> Add Question
              </button>
            </div>
            
            {faqFields.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No FAQs added yet.</p>
            ) : (
              <div className="space-y-4">
                {faqFields.map((field, index) => (
                  <div key={field.id} className="relative bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <button
                      type="button"
                      onClick={() => removeFaq(index)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove FAQ"
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    <div className="space-y-3 pr-8">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Question</label>
                        <input
                          {...register(`faqs.${index}.question` as const, { required: true })}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/20 focus:border-[#EC5B13] transition-all text-sm font-medium"
                          placeholder="E.g., What is the best time to visit?"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Answer</label>
                        <textarea
                          {...register(`faqs.${index}.answer` as const, { required: true })}
                          rows={2}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/20 focus:border-[#EC5B13] transition-all resize-none text-sm"
                          placeholder="Provide a clear, concise answer..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Settings Area */}
        <div className="space-y-6">
          {/* Publishing Info */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3">Publishing Details</h3>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">URL Slug</label>
              <input
                {...register("slug", { required: "Slug is required" })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/20 focus:border-[#EC5B13] transition-all text-sm"
                placeholder="my-blog-post"
              />
              {errors.slug && <span className="text-red-500 text-sm mt-1">{errors.slug.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <input
                {...register("category")}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/20 focus:border-[#EC5B13] transition-all text-sm"
                placeholder="e.g. Luxury Living"
              />
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3">Featured Image</h3>
            
            {featuredImageValue ? (
              <div className="relative aspect-video rounded-xl overflow-hidden group">
                <Image src={featuredImageValue} alt="Featured" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setValue("featured_image", "")}
                    className="p-2 bg-white text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <div className="flex flex-col items-center text-gray-500">
                  <ImageIcon size={32} className="mb-2 text-gray-400" />
                  <span className="text-sm font-medium">
                    {isUploadingImage ? "Uploading..." : "Click to upload image"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3">Tags</h3>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {tagsValue.map((tag) => (
                <span key={tag} className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="ml-2 text-gray-400 hover:text-red-500">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>

            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tags (press Enter)"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/20 focus:border-[#EC5B13] transition-all text-sm"
            />
          </div>

          {/* SEO Details */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3">SEO Optimization</h3>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Meta Title</label>
              <input
                {...register("seo_title")}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/20 focus:border-[#EC5B13] transition-all text-sm"
                placeholder="SEO optimized title..."
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank to use blog title</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Meta Description</label>
              <textarea
                {...register("seo_description")}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/20 focus:border-[#EC5B13] transition-all resize-none text-sm"
                placeholder="SEO optimized description..."
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank to use excerpt</p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <label className="block text-sm font-bold text-gray-700">Search Engine Visibility</label>
                <p className="text-xs text-gray-500 mt-1">Allow search engines to index this page.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" {...register("is_indexable")} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EC5B13]"></div>
              </label>
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}
