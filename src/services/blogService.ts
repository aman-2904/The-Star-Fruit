import { supabase } from '@/lib/supabase';
import { Blog, CreateBlogDTO } from '@/types/blog';

export const blogService = {
  async getPublishedBlogs(): Promise<Blog[]> {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data as Blog[];
  },

  async getAllBlogs(): Promise<Blog[]> {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Blog[];
  },

  async getBlogBySlug(slug: string): Promise<Blog | null> {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as Blog | null;
  },

  async getBlogById(id: string): Promise<Blog | null> {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as Blog | null;
  },

  async createBlog(blog: CreateBlogDTO): Promise<Blog> {
    // Get current user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const author_id = session.user.id;
    const author_name = session.user.user_metadata?.full_name || 'Anonymous';
    
    // Set published_at if status is published
    const published_at = blog.status === 'published' ? new Date().toISOString() : null;

    const { data, error } = await supabase
      .from('blogs')
      .insert({
        ...blog,
        author_id,
        author_name,
        published_at
      })
      .select()
      .single();

    if (error) throw error;
    return data as Blog;
  },

  async updateBlog(id: string, blog: Partial<CreateBlogDTO>): Promise<Blog> {
    const updates: any = { ...blog };
    
    if (blog.status === 'published') {
      // Check if it was already published
      const existing = await this.getBlogById(id);
      if (existing && !existing.published_at) {
        updates.published_at = new Date().toISOString();
      }
    }

    const { data, error } = await supabase
      .from('blogs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Blog;
  },

  async deleteBlog(id: string): Promise<void> {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
};
