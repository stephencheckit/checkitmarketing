import { NextResponse } from 'next/server';
import { getCurrentBattlecardData } from '@/lib/db';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; CheckitBot/1.0)',
  },
});

interface RSSFeedItem {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet?: string;
  content?: string;
  creator?: string;
}

interface CompetitorFeed {
  competitorId: string;
  competitorName: string;
  competitorWebsite: string;
  feedUrl: string | null;
  feedDiscoveryMethod: string | null;
  items: RSSFeedItem[];
  error: string | null;
}

interface Competitor {
  id: string;
  name: string;
  website: string;
}

// Common RSS feed paths to try
const COMMON_FEED_PATHS = [
  '/feed',
  '/feed/',
  '/rss',
  '/rss/',
  '/blog/feed',
  '/blog/rss',
  '/feed.xml',
  '/rss.xml',
  '/blog/feed.xml',
  '/blog/rss.xml',
  '/atom.xml',
  '/index.xml',
  '/news/feed',
  '/insights/feed',
  '/resources/feed',
];

// Common blog/content page paths to try scraping
const COMMON_BLOG_PATHS = [
  '/blog',
  '/blog/',
  '/resources',
  '/resources/',
  '/news',
  '/news/',
  '/insights',
  '/insights/',
  '/articles',
  '/articles/',
  '/learn',
  '/knowledge',
  '/content',
  '/library',
];

// Try to discover RSS feed from HTML
async function discoverFeedFromHtml(baseUrl: string): Promise<string | null> {
  try {
    const response = await fetch(baseUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CheckitBot/1.0)',
      },
      signal: AbortSignal.timeout(10000),
    });
    
    if (!response.ok) return null;
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Look for RSS/Atom link tags
    const feedLink = $('link[type="application/rss+xml"]').attr('href') ||
                     $('link[type="application/atom+xml"]').attr('href') ||
                     $('link[rel="alternate"][type="application/rss+xml"]').attr('href') ||
                     $('link[rel="alternate"][type="application/atom+xml"]').attr('href');
    
    if (feedLink) {
      // Convert relative URL to absolute
      if (feedLink.startsWith('/')) {
        const url = new URL(baseUrl);
        return `${url.protocol}//${url.host}${feedLink}`;
      }
      return feedLink;
    }
    
    return null;
  } catch {
    return null;
  }
}

// Try common feed paths
async function tryCommonPaths(baseUrl: string): Promise<{ url: string; method: string } | null> {
  const url = new URL(baseUrl);
  const base = `${url.protocol}//${url.host}`;
  
  for (const path of COMMON_FEED_PATHS) {
    try {
      const feedUrl = `${base}${path}`;
      const feed = await parser.parseURL(feedUrl);
      if (feed && feed.items && feed.items.length > 0) {
        return { url: feedUrl, method: `common path: ${path}` };
      }
    } catch {
      // Continue to next path
    }
  }
  
  return null;
}

// Scrape blog page for articles when no RSS is available
async function scrapeBlogPage(baseUrl: string): Promise<{ url: string; items: RSSFeedItem[]; method: string } | null> {
  const url = new URL(baseUrl);
  const base = `${url.protocol}//${url.host}`;
  
  for (const path of COMMON_BLOG_PATHS) {
    try {
      const blogUrl = `${base}${path}`;
      const response = await fetch(blogUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: AbortSignal.timeout(15000),
      });
      
      if (!response.ok) continue;
      
      const html = await response.text();
      const $ = cheerio.load(html);
      
      const items: RSSFeedItem[] = [];
      
      // Strategy 1: Look for article/post cards with common patterns
      // Try various common selectors for blog listings
      const selectors = [
        'article',
        '.post',
        '.blog-post',
        '.article',
        '.card',
        '.entry',
        '[class*="post"]',
        '[class*="article"]',
        '[class*="blog"]',
        '.resource-card',
        '.content-card',
        'li[class*="post"]',
        '.news-item',
        '.insight',
      ];
      
      for (const selector of selectors) {
        const elements = $(selector);
        if (elements.length >= 3) {
          // Found likely blog listing
          elements.each((_, el) => {
            const $el = $(el);
            
            // Try to find title - look for headings or links
            let title = '';
            let link = '';
            
            // Title from h2, h3, h4 or prominent link
            const titleEl = $el.find('h1, h2, h3, h4').first();
            if (titleEl.length) {
              title = titleEl.text().trim();
              const titleLink = titleEl.find('a').attr('href') || titleEl.closest('a').attr('href');
              if (titleLink) link = titleLink;
            }
            
            // If no title from heading, try first prominent link
            if (!title) {
              const linkEl = $el.find('a').first();
              title = linkEl.text().trim();
              link = linkEl.attr('href') || '';
            }
            
            // Get link if not found yet
            if (!link) {
              link = $el.find('a').attr('href') || $el.attr('href') || '';
            }
            
            // Make link absolute
            if (link && !link.startsWith('http')) {
              if (link.startsWith('/')) {
                link = `${base}${link}`;
              } else {
                link = `${base}/${link}`;
              }
            }
            
            // Try to find date
            let pubDate = '';
            const dateEl = $el.find('time, [class*="date"], [class*="Date"], .meta, .published').first();
            if (dateEl.length) {
              pubDate = dateEl.attr('datetime') || dateEl.text().trim();
            }
            
            // Try to find snippet/description
            let snippet = '';
            const descEl = $el.find('p, .excerpt, .description, .summary, [class*="excerpt"], [class*="desc"]').first();
            if (descEl.length) {
              snippet = descEl.text().trim().slice(0, 300);
            }
            
            // Only add if we have title and link
            if (title && link && title.length > 10 && title.length < 200) {
              // Avoid duplicates and navigation items
              const isDuplicate = items.some(i => i.title === title || i.link === link);
              const isNav = title.toLowerCase().includes('menu') || 
                           title.toLowerCase().includes('navigation') ||
                           title.toLowerCase() === 'blog' ||
                           title.toLowerCase() === 'home';
              
              if (!isDuplicate && !isNav) {
                items.push({
                  title,
                  link,
                  pubDate,
                  contentSnippet: snippet,
                });
              }
            }
          });
          
          if (items.length >= 3) {
            // Found enough articles, return
            return { 
              url: blogUrl, 
              items: items.slice(0, 10), 
              method: `scraped: ${path}` 
            };
          }
        }
      }
      
      // Strategy 2: Look for any links that look like blog posts
      if (items.length < 3) {
        $('a').each((_, el) => {
          const $a = $(el);
          const href = $a.attr('href') || '';
          const text = $a.text().trim();
          
          // Check if link looks like a blog post URL
          const isBlogPost = href.includes('/blog/') || 
                            href.includes('/post/') || 
                            href.includes('/article/') ||
                            href.includes('/news/') ||
                            href.includes('/insights/') ||
                            href.match(/\/\d{4}\/\d{2}\//); // Date pattern in URL
          
          if (isBlogPost && text.length > 15 && text.length < 150) {
            let fullLink = href;
            if (!fullLink.startsWith('http')) {
              fullLink = fullLink.startsWith('/') ? `${base}${fullLink}` : `${base}/${fullLink}`;
            }
            
            const isDuplicate = items.some(i => i.title === text || i.link === fullLink);
            if (!isDuplicate) {
              items.push({
                title: text,
                link: fullLink,
                pubDate: '',
                contentSnippet: '',
              });
            }
          }
        });
        
        if (items.length >= 3) {
          return { 
            url: blogUrl, 
            items: items.slice(0, 10), 
            method: `scraped links: ${path}` 
          };
        }
      }
      
    } catch {
      // Continue to next path
    }
  }
  
  return null;
}

// Fetch and parse a competitor's RSS feed (with scraping fallback)
async function fetchCompetitorFeed(
  competitorId: string,
  competitorName: string,
  website: string
): Promise<CompetitorFeed> {
  const result: CompetitorFeed = {
    competitorId,
    competitorName,
    competitorWebsite: website,
    feedUrl: null,
    feedDiscoveryMethod: null,
    items: [],
    error: null,
  };
  
  if (!website) {
    result.error = 'No website URL configured';
    return result;
  }
  
  // Normalize website URL
  let baseUrl = website;
  if (!baseUrl.startsWith('http')) {
    baseUrl = `https://${baseUrl}`;
  }
  
  try {
    // Step 1: Try to discover feed from HTML meta tags
    const discoveredFeed = await discoverFeedFromHtml(baseUrl);
    if (discoveredFeed) {
      try {
        const feed = await parser.parseURL(discoveredFeed);
        if (feed && feed.items && feed.items.length > 0) {
          result.feedUrl = discoveredFeed;
          result.feedDiscoveryMethod = 'RSS: HTML meta tag';
          result.items = feed.items.slice(0, 10).map(item => ({
            title: item.title || 'Untitled',
            link: item.link || '',
            pubDate: item.pubDate || item.isoDate || '',
            contentSnippet: item.contentSnippet?.slice(0, 300),
            content: item.content?.slice(0, 500),
            creator: item.creator || item.author,
          }));
          return result;
        }
      } catch {
        // Continue to try common paths
      }
    }
    
    // Step 2: Try common RSS feed paths
    const commonPath = await tryCommonPaths(baseUrl);
    if (commonPath) {
      const feed = await parser.parseURL(commonPath.url);
      result.feedUrl = commonPath.url;
      result.feedDiscoveryMethod = `RSS: ${commonPath.method}`;
      result.items = feed.items.slice(0, 10).map(item => ({
        title: item.title || 'Untitled',
        link: item.link || '',
        pubDate: item.pubDate || item.isoDate || '',
        contentSnippet: item.contentSnippet?.slice(0, 300),
        content: item.content?.slice(0, 500),
        creator: item.creator || item.author,
      }));
      return result;
    }
    
    // Step 3: Fallback - try scraping blog pages directly
    const scrapedContent = await scrapeBlogPage(baseUrl);
    if (scrapedContent && scrapedContent.items.length > 0) {
      result.feedUrl = scrapedContent.url;
      result.feedDiscoveryMethod = scrapedContent.method;
      result.items = scrapedContent.items;
      return result;
    }
    
    result.error = 'No RSS feed or blog found';
  } catch (err) {
    result.error = err instanceof Error ? err.message : 'Failed to fetch feed';
  }
  
  return result;
}

// GET - Fetch RSS feeds for all competitors
export async function GET() {
  try {
    const battlecard = await getCurrentBattlecardData();
    
    if (!battlecard || !battlecard.data || !battlecard.data.competitors) {
      return NextResponse.json({ 
        error: 'No competitors found in battlecard',
        feeds: [] 
      });
    }
    
    const competitors = battlecard.data.competitors as Competitor[];
    
    // Fetch feeds in parallel (with some concurrency limit)
    const feedPromises = competitors.map(comp => 
      fetchCompetitorFeed(comp.id, comp.name, comp.website)
    );
    
    const feeds = await Promise.all(feedPromises);
    
    // Summary stats
    const feedsFound = feeds.filter(f => f.feedUrl !== null).length;
    const totalItems = feeds.reduce((sum, f) => sum + f.items.length, 0);
    
    return NextResponse.json({
      summary: {
        competitorsChecked: competitors.length,
        feedsFound,
        totalItems,
        checkedAt: new Date().toISOString(),
      },
      feeds,
    });
  } catch (error) {
    console.error('Error fetching competitor RSS:', error);
    return NextResponse.json(
      { error: 'Failed to fetch competitor feeds' },
      { status: 500 }
    );
  }
}
