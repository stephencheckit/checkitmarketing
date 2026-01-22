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

// Fetch and parse a competitor's RSS feed
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
          result.feedDiscoveryMethod = 'HTML meta tag';
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
    
    // Step 2: Try common feed paths
    const commonPath = await tryCommonPaths(baseUrl);
    if (commonPath) {
      const feed = await parser.parseURL(commonPath.url);
      result.feedUrl = commonPath.url;
      result.feedDiscoveryMethod = commonPath.method;
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
    
    result.error = 'No RSS feed found';
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
    
    const competitors = battlecard.data.competitors;
    
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
