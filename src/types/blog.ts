export interface FAQ {
  question: string;
  answer: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  seo_title: string | null;
  seo_description: string | null;
  tags: string[];
  category: string | null;
  status: 'draft' | 'published';
  faqs: FAQ[];
  is_indexable: boolean;
  author_id: string;
  author_name: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface CreateBlogDTO {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  seo_title?: string;
  seo_description?: string;
  tags: string[];
  category?: string;
  status: 'draft' | 'published';
  faqs: FAQ[];
  is_indexable: boolean;
}
