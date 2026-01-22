import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { BlogArticle } from '@/lib/types';

export async function GET() {
  try {
    const response = await fetch('https://www.checkit.net/blog', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch blog: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const articles: BlogArticle[] = [];

    // Find all blog post links in the main content area
    $('a[href*="/blog/"]').each((_, element) => {
      const $el = $(element);
      const href = $el.attr('href');
      
      // Skip navigation links, tags, and pagination
      if (!href || 
          href === 'https://www.checkit.net/blog' ||
          href.includes('/tag/') || 
          href.includes('/page/') ||
          href === '#') {
        return;
      }

      // Look for article structure with title and metadata
      const $title = $el.find('h2');
      if ($title.length === 0) return;

      const title = $title.text().trim();
      if (!title) return;

      // Get full link text for parsing - preserve pipe characters
      const fullText = $el.text().trim();
      
      // Parse author - look for name pattern before pipe
      // Format: "Author Name |Date |Time"
      const authorMatch = fullText.match(/^([A-Za-z'\s]+?)[\s]*[|]/);
      const author = authorMatch ? authorMatch[1].trim() : 'Checkit';
      
      // Parse date - formats like "Dec 16, 2025" 
      const dateMatch = fullText.match(/([A-Z][a-z]{2}\s+\d{1,2},\s+\d{4})/);
      const date = dateMatch ? dateMatch[1].trim() : '';
      
      // Parse read time - "X min read"
      const readTimeMatch = fullText.match(/(\d+)\s*min\s*read/i);
      const readTime = readTimeMatch ? `${readTimeMatch[1]} min read` : '';

      // Get description - text after metadata, before "Start Reading"
      const startReadingIndex = fullText.indexOf('Start Reading');
      let description = '';
      
      if (startReadingIndex !== -1) {
        // Find where the title ends
        const titleIndex = fullText.indexOf(title);
        if (titleIndex !== -1) {
          description = fullText
            .substring(titleIndex + title.length, startReadingIndex)
            .replace(/\s+/g, ' ')
            .trim();
        }
      }

      // Avoid duplicates
      const exists = articles.some(a => a.url === href);
      if (!exists && title) {
        articles.push({
          title,
          url: href,
          author,
          date,
          readTime,
          description,
        });
      }
    });

    return NextResponse.json({ 
      articles,
      scrapedAt: new Date().toISOString(),
      count: articles.length 
    });
  } catch (error) {
    console.error('Scrape error:', error);
    return NextResponse.json(
      { error: 'Failed to scrape blog content' },
      { status: 500 }
    );
  }
}
