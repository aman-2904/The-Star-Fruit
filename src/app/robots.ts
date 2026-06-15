import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/login',
        '/dashboard',
        '/admin',
        '/blogadmin',
        '/profile',
        '/messages',
        '/api/',
      ],
    },
    sitemap: 'https://www.luxevillaz.com/sitemap.xml',
  };
}
