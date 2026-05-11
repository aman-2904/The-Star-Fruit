-- Complete Blog Management System Schema
-- Run this in your Supabase SQL Editor

-- 1. Create the blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    seo_title TEXT,
    seo_description TEXT,
    tags TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    faqs JSONB DEFAULT '[]'::jsonb,
    is_indexable BOOLEAN DEFAULT true,
    author_id UUID REFERENCES auth.users(id),
    author_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE
);

-- Note: If you already ran the previous script, you MUST run this line to add the new columns:
-- ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb;
-- ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS is_indexable BOOLEAN DEFAULT true;

-- 2. Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blogs_updated_at
    BEFORE UPDATE ON public.blogs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies
-- Public can only view published blogs
CREATE POLICY "Public can view published blogs" 
ON public.blogs FOR SELECT 
USING (status = 'published');

-- Allow all operations for users with role 'admin' or 'blog'
CREATE POLICY "Blog Execs and Admins can do everything" 
ON public.blogs FOR ALL 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'blog')
)
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'blog')
);

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON public.blogs TO anon, authenticated;


-- 5. Create Storage Bucket for blog images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage Policies
-- Public can read images
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'blog-images');

-- Blog Execs and Admins can upload/update/delete images
CREATE POLICY "Blog Execs and Admins can manage images" 
ON storage.objects FOR ALL 
USING (
  bucket_id = 'blog-images' AND 
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'blog')
)
WITH CHECK (
  bucket_id = 'blog-images' AND 
  (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'blog')
);
