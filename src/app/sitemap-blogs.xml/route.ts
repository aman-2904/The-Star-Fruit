import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const revalidate = 86400; // Cache for 24 hours (ISR)

export async function GET() {
  try {
    if (!supabase) {
      throw new Error("Supabase is not configured.");
    }

    const { data: blogs, error } = await supabase
      .from('blogs')
      .select('slug, updated_at, status, is_indexable')
      .eq('status', 'published')
      .eq('is_indexable', true)
      .order('published_at', { ascending: false });

    if (error) throw error;

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${(blogs || []).map(blog => {
    const lastmod = blog.updated_at 
      ? new Date(blog.updated_at).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0];
    return `
  <url>
    <loc>https://www.luxevillaz.com/blogs/${blog.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
  }).join('').trim()}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600'
      }
    });
  } catch (error) {
    console.error('Error generating blogs sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
