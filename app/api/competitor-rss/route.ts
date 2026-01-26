import { NextRequest, NextResponse } from 'next/server';
import { 
  getCurrentBattlecardData, 
  upsertCompetitorFeed, 
  saveFeedItems,
  getFeedItems,
  getCompetitorFeeds,
  getFeedFilterOptions,
  getUserFeedPreferences,
  saveUserFeedPreferences,
  initializeCompetitorFeedsTables
} from '@/lib/db';
import { getSession } from '@/lib/session';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; CheckitBot/1.0)',
  },
});

interface Competitor {
  id: string;
  name: string;
  website: string;
}

interface RSSFeedItem {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet?: string;
  content?: string;
  creator?: string;
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
        return { url: feedUrl, method: `RSS: common path: ${path}` };
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
          elements.each((_, el) => {
            const $el = $(el);
            
            let title = '';
            let link = '';
            
            const titleEl = $el.find('h1, h2, h3, h4').first();
            if (titleEl.length) {
              title = titleEl.text().trim();
              const titleLink = titleEl.find('a').attr('href') || titleEl.closest('a').attr('href');
              if (titleLink) link = titleLink;
            }
            
            if (!title) {
              const linkEl = $el.find('a').first();
              title = linkEl.text().trim();
              link = linkEl.attr('href') || '';
            }
            
            if (!link) {
              link = $el.find('a').attr('href') || $el.attr('href') || '';
            }
            
            if (link && !link.startsWith('http')) {
              if (link.startsWith('/')) {
                link = `${base}${link}`;
              } else {
                link = `${base}/${link}`;
              }
            }
            
            let pubDate = '';
            const dateEl = $el.find('time, [class*="date"], [class*="Date"], .meta, .published').first();
            if (dateEl.length) {
              pubDate = dateEl.attr('datetime') || dateEl.text().trim();
            }
            
            let snippet = '';
            const descEl = $el.find('p, .excerpt, .description, .summary, [class*="excerpt"], [class*="desc"]').first();
            if (descEl.length) {
              snippet = descEl.text().trim().slice(0, 300);
            }
            
            if (title && link && title.length > 10 && title.length < 200) {
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
          
          const isBlogPost = href.includes('/blog/') || 
                            href.includes('/post/') || 
                            href.includes('/article/') ||
                            href.includes('/news/') ||
                            href.includes('/insights/') ||
                            href.match(/\/\d{4}\/\d{2}\//);
          
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
): Promise<{ feedUrl: string | null; method: string | null; items: RSSFeedItem[]; error: string | null }> {
  const result = {
    feedUrl: null as string | null,
    method: null as string | null,
    items: [] as RSSFeedItem[],
    error: null as string | null,
  };
  
  if (!website) {
    result.error = 'No website URL configured';
    return result;
  }
  
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
          result.method = 'RSS: HTML meta tag';
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
      result.method = commonPath.method;
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
      result.method = scrapedContent.method;
      result.items = scrapedContent.items;
      return result;
    }
    
    result.error = 'No RSS feed or blog found';
  } catch (err) {
    result.error = err instanceof Error ? err.message : 'Failed to fetch feed';
  }
  
  return result;
}

// GET - Return cached feed items with filtering
export async function GET(request: NextRequest) {
  try {
    // Initialize tables if needed
    await initializeCompetitorFeedsTables();
    
    const { searchParams } = new URL(request.url);
    
    // Industry news RSS feeds to monitor alongside competitors
    const INDUSTRY_FEEDS = [
      { id: 'food-safety-news', name: 'Food Safety News', website: 'https://www.foodsafetynews.com', feedUrl: 'https://www.foodsafetynews.com/feed/' },
      { id: 'food-safety-mag', name: 'Food Safety Magazine', website: 'https://www.food-safety.com', feedUrl: 'https://www.food-safety.com/rss/topic/272-food-safety' },
      { id: 'haccp-intl', name: 'HACCP International', website: 'https://www.haccp-international.com', feedUrl: 'https://www.haccp-international.com/feed/' },
      { id: 'iot-world-today', name: 'IoT World Today', website: 'https://www.iotworldtoday.com', feedUrl: 'https://www.iotworldtoday.com/rss.xml' },
      { id: 'fda-recalls', name: 'FDA Recalls', website: 'https://www.fda.gov', feedUrl: 'https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/recalls/rss.xml' },
    ];

    // Legacy format for content page's Competitor Watch feature
    // cached=true returns DB data without fresh fetching
    // refresh=true forces fresh fetch even with cached data
    if (searchParams.get('legacy') === 'true') {
      const useCached = searchParams.get('cached') === 'true';
      const forceRefresh = searchParams.get('refresh') === 'true';
      
      const battlecard = await getCurrentBattlecardData();
      const competitors = (battlecard?.data?.competitors || []) as Competitor[];
      
      // Combine competitors with industry feeds
      const allSources = [
        ...competitors.map(c => ({ ...c, isIndustryNews: false })),
        ...INDUSTRY_FEEDS.map(f => ({ 
          id: f.id, 
          name: f.name, 
          website: f.website, 
          knownFeedUrl: f.feedUrl,
          isIndustryNews: true 
        })),
      ];
      
      let feeds: Array<{
        competitorId: string;
        competitorName: string;
        competitorWebsite: string;
        feedUrl: string | null;
        feedDiscoveryMethod: string | null;
        items: RSSFeedItem[];
        error: string | null;
        isIndustryNews: boolean;
      }> = [];
      
      // Try to use cached data first
      if (useCached && !forceRefresh) {
        const cachedFeeds = await getCompetitorFeeds();
        const cachedItems = await getFeedItems({ limit: 500 });
        
        if (cachedFeeds.length > 0) {
          // Group items by competitor
          const itemsByCompetitor = new Map<string, RSSFeedItem[]>();
          for (const item of cachedItems) {
            const existing = itemsByCompetitor.get(item.competitor_id) || [];
            existing.push({
              title: item.title,
              link: item.link,
              pubDate: item.pub_date || '',
              contentSnippet: item.content_snippet || undefined,
            });
            itemsByCompetitor.set(item.competitor_id, existing);
          }
          
          feeds = cachedFeeds.map(cf => ({
            competitorId: cf.competitor_id as string,
            competitorName: cf.competitor_name as string,
            competitorWebsite: cf.competitor_website as string || '',
            feedUrl: cf.feed_url as string | null,
            feedDiscoveryMethod: cf.discovery_method as string | null,
            items: itemsByCompetitor.get(cf.competitor_id as string) || [],
            error: cf.fetch_error as string | null,
            isIndustryNews: (cf.competitor_id as string).startsWith('food-') || 
                           (cf.competitor_id as string).startsWith('iot-') || 
                           (cf.competitor_id as string).startsWith('fda-') ||
                           (cf.competitor_id as string).startsWith('haccp-'),
          }));
          
          // Filter out feeds with no items (no RSS found)
          feeds = feeds.filter(f => f.items.length > 0);
          
          if (feeds.length > 0) {
            const feedsFound = feeds.length;
            const totalItems = feeds.reduce((sum, f) => sum + f.items.length, 0);
            const lastFetched = cachedFeeds[0]?.last_fetched_at;
            
            return NextResponse.json({
              summary: {
                competitorsChecked: allSources.length,
                feedsFound,
                totalItems,
                checkedAt: lastFetched || new Date().toISOString(),
                cached: true,
              },
              feeds,
            });
          }
        }
      }
      
      // Fresh fetch
      const feedPromises = allSources.map(async (source) => {
        const knownFeedUrl = 'knownFeedUrl' in source ? (source.knownFeedUrl as string) : null;
        const isIndustry = !!knownFeedUrl;
        let feedResult;
        
        if (isIndustry && knownFeedUrl) {
          // For industry feeds, try the known URL directly
          try {
            const feed = await parser.parseURL(knownFeedUrl);
            feedResult = {
              feedUrl: knownFeedUrl,
              method: 'known RSS feed',
              items: feed.items.slice(0, 10).map(item => ({
                title: item.title || 'Untitled',
                link: item.link || '',
                pubDate: item.pubDate || item.isoDate || '',
                contentSnippet: item.contentSnippet?.slice(0, 300),
                creator: item.creator || item.author,
              })),
              error: null,
            };
          } catch {
            feedResult = { feedUrl: null, method: null, items: [], error: 'Failed to fetch feed' };
          }
        } else {
          feedResult = await fetchCompetitorFeed(source.id, source.name, source.website);
        }
        
        // Save to DB for caching
        await upsertCompetitorFeed({
          competitorId: source.id,
          competitorName: source.name,
          competitorWebsite: source.website,
          feedUrl: feedResult.feedUrl || undefined,
          discoveryMethod: feedResult.method || undefined,
          fetchError: feedResult.error || undefined,
        });
        
        if (feedResult.items.length > 0) {
          await saveFeedItems(source.id, feedResult.items.map(item => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            contentSnippet: item.contentSnippet,
            author: item.creator,
          })));
        }
        
        return {
          competitorId: source.id,
          competitorName: source.name,
          competitorWebsite: source.website,
          feedUrl: feedResult.feedUrl,
          feedDiscoveryMethod: feedResult.method,
          items: feedResult.items,
          error: feedResult.error,
          isIndustryNews: isIndustry,
        };
      });
      
      const allFeeds = await Promise.all(feedPromises);
      
      // Filter out feeds with no items (hide "no RSS found" competitors)
      feeds = allFeeds.filter(f => f.items.length > 0);
      
      const feedsFound = feeds.length;
      const totalItems = feeds.reduce((sum, f) => sum + f.items.length, 0);
      
      return NextResponse.json({
        summary: {
          competitorsChecked: allSources.length,
          feedsFound,
          totalItems,
          checkedAt: new Date().toISOString(),
          cached: false,
        },
        feeds,
      });
    }
    
    // Check if requesting filter options
    if (searchParams.get('options') === 'true') {
      const options = await getFeedFilterOptions();
      return NextResponse.json(options);
    }
    
    // Check if requesting competitor feed metadata
    if (searchParams.get('feeds') === 'true') {
      const feeds = await getCompetitorFeeds();
      return NextResponse.json({ feeds });
    }
    
    // Parse filter parameters
    const competitorIds = searchParams.get('competitors')?.split(',').filter(Boolean);
    const topics = searchParams.get('topics')?.split(',').filter(Boolean);
    const industries = searchParams.get('industries')?.split(',').filter(Boolean);
    const daysBack = searchParams.get('days') ? parseInt(searchParams.get('days')!) : undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;
    
    // Get filtered items
    const items = await getFeedItems({
      competitorIds,
      topics,
      industries,
      daysBack,
      limit,
      offset,
    });
    
    // Get filter options for UI
    const filterOptions = await getFeedFilterOptions();
    
    return NextResponse.json({
      items,
      count: items.length,
      filters: {
        competitors: competitorIds || [],
        topics: topics || [],
        industries: industries || [],
        daysBack,
      },
      filterOptions,
    });
  } catch (error) {
    console.error('Error fetching competitor feeds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch competitor feeds' },
      { status: 500 }
    );
  }
}

// POST - Refresh feeds from sources (fetch + save to DB)
export async function POST(request: NextRequest) {
  try {
    // Initialize tables if needed
    await initializeCompetitorFeedsTables();
    
    const body = await request.json().catch(() => ({}));
    const competitorId = body.competitorId; // Optional: refresh single competitor
    
    const battlecard = await getCurrentBattlecardData();
    
    if (!battlecard || !battlecard.data || !battlecard.data.competitors) {
      return NextResponse.json({ 
        error: 'No competitors found in battlecard',
        refreshed: 0 
      });
    }
    
    let competitors = battlecard.data.competitors as Competitor[];
    
    // If specific competitor requested, filter to just that one
    if (competitorId) {
      competitors = competitors.filter(c => c.id === competitorId);
    }
    
    const results = {
      refreshed: 0,
      failed: 0,
      totalItems: 0,
      details: [] as Array<{ competitor: string; status: string; itemCount: number }>,
    };
    
    // Fetch feeds in parallel
    const feedPromises = competitors.map(async (comp) => {
      const feedResult = await fetchCompetitorFeed(comp.id, comp.name, comp.website);
      
      // Save feed metadata
      await upsertCompetitorFeed({
        competitorId: comp.id,
        competitorName: comp.name,
        competitorWebsite: comp.website,
        feedUrl: feedResult.feedUrl || undefined,
        discoveryMethod: feedResult.method || undefined,
        fetchError: feedResult.error || undefined,
      });
      
      // Save feed items
      if (feedResult.items.length > 0) {
        await saveFeedItems(comp.id, feedResult.items.map(item => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          contentSnippet: item.contentSnippet,
          author: item.creator,
        })));
      }
      
      return {
        competitor: comp.name,
        status: feedResult.error ? `error: ${feedResult.error}` : `success: ${feedResult.method}`,
        itemCount: feedResult.items.length,
        hasError: !!feedResult.error,
      };
    });
    
    const feedResults = await Promise.all(feedPromises);
    
    for (const result of feedResults) {
      if (result.hasError) {
        results.failed++;
      } else {
        results.refreshed++;
      }
      results.totalItems += result.itemCount;
      results.details.push({
        competitor: result.competitor,
        status: result.status,
        itemCount: result.itemCount,
      });
    }
    
    return NextResponse.json({
      success: true,
      refreshedAt: new Date().toISOString(),
      ...results,
    });
  } catch (error) {
    console.error('Error refreshing competitor feeds:', error);
    return NextResponse.json(
      { error: 'Failed to refresh competitor feeds' },
      { status: 500 }
    );
  }
}

// PUT - Save user filter preferences
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { filters } = body;
    
    await saveUserFeedPreferences(session.userId, filters);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving feed preferences:', error);
    return NextResponse.json(
      { error: 'Failed to save preferences' },
      { status: 500 }
    );
  }
}
