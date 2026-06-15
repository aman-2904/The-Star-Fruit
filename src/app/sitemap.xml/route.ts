import { NextResponse } from 'next/server';

export const revalidate = 86400; // Cache for 24 hours (ISR)

export async function GET() {
  const lastmod = new Date().toISOString().split('T')[0];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.luxevillaz.com/sitemap-pages.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.luxevillaz.com/sitemap-properties.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.luxevillaz.com/sitemap-blogs.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600'
    }
  });
}
