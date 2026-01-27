import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://checkit-marketing.vercel.app'; // Update this to your actual domain

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/login/',
          '/register/',
          '/discovery/',
          '/solutioning/',
          '/closing/',
          '/quiz/',
          '/reference/',
          '/learn/',
          '/channels/',
          '/competitors/',
          '/content/',
          '/kits-toolkit/',
          '/outbound/',
          '/ovg-analytics/',
          '/ovg-map/',
          '/positioning/',
          '/tools/',
        ],
      },
      // Explicitly allow AI search crawlers
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/', '/login/', '/register/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/', '/login/', '/register/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/', '/login/', '/register/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/', '/login/', '/register/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/', '/login/', '/register/'],
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/', '/login/', '/register/'],
      },
      {
        userAgent: 'Amazonbot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/', '/login/', '/register/'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/', '/login/', '/register/'],
      },
      {
        userAgent: 'cohere-ai',
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/', '/login/', '/register/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
