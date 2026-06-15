import { NextResponse } from 'next/server';

export const revalidate = 86400; // Cache for 24 hours (ISR)

export async function GET() {
  const pages = [
    { loc: 'https://www.luxevillaz.com/', priority: '1.0', changefreq: 'daily' },
    { loc: 'https://www.luxevillaz.com/stays', priority: '0.9', changefreq: 'daily' },
    { loc: 'https://www.luxevillaz.com/stays?type=Villa', priority: '0.8', changefreq: 'daily' },
    { loc: 'https://www.luxevillaz.com/stays?type=Hotel,Apartment', priority: '0.8', changefreq: 'daily' },
    { loc: 'https://www.luxevillaz.com/blogs', priority: '0.8', changefreq: 'weekly' }
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
  <url>
    <loc>${page.loc}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('').trim()}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600'
    }
  });
}
