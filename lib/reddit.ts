// Reddit client using public JSON endpoints (no API credentials required)

interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  author: string;
  subreddit: string;
  score: number;
  num_comments: number;
  created_utc: number;
  url: string;
  permalink: string;
  is_self: boolean;
  link_flair_text: string | null;
}

interface RedditSearchResult {
  posts: RedditPost[];
  after: string | null;
}

const USER_AGENT = 'web:checkit-gtm-hub:1.0.0 (keyword monitor)';

// Simple rate limiter: track last request time, enforce minimum gap
let lastRequestTime = 0;
const MIN_REQUEST_GAP_MS = 2000; // 2 seconds between requests (conservative for ~10 req/min limit)

async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_GAP_MS) {
    await new Promise((resolve) => setTimeout(resolve, MIN_REQUEST_GAP_MS - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();

  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
  });

  if (response.status === 429) {
    // Rate limited - wait and retry once
    const retryAfter = parseInt(response.headers.get('retry-after') || '10', 10);
    await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
    lastRequestTime = Date.now();
    return fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  }

  return response;
}

function parsePostsFromListing(data: { data: { children: { data: RedditPost }[]; after: string | null } }): RedditSearchResult {
  const posts: RedditPost[] = data.data.children
    .filter((child: { data: RedditPost } & { kind?: string }) => (child as { kind?: string }).kind === 't3')
    .map((child: { data: RedditPost }) => ({
      id: child.data.id,
      title: child.data.title,
      selftext: child.data.selftext || '',
      author: child.data.author,
      subreddit: child.data.subreddit,
      score: child.data.score,
      num_comments: child.data.num_comments,
      created_utc: child.data.created_utc,
      url: child.data.url,
      permalink: `https://reddit.com${child.data.permalink}`,
      is_self: child.data.is_self,
      link_flair_text: child.data.link_flair_text,
    }));

  return { posts, after: data.data.after };
}

// Search Reddit for posts matching a query
export async function searchReddit(
  query: string,
  options: {
    subreddit?: string;
    sort?: 'relevance' | 'hot' | 'top' | 'new' | 'comments';
    time?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
    limit?: number;
  } = {}
): Promise<RedditSearchResult> {
  const { subreddit, sort = 'relevance', time = 'week', limit = 25 } = options;

  const baseUrl = subreddit
    ? `https://www.reddit.com/r/${encodeURIComponent(subreddit)}/search.json`
    : 'https://www.reddit.com/search.json';

  const params = new URLSearchParams({
    q: query,
    sort,
    t: time,
    limit: limit.toString(),
    restrict_sr: subreddit ? 'on' : 'off',
    type: 'link',
    raw_json: '1',
  });

  const response = await rateLimitedFetch(`${baseUrl}?${params}`);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Reddit search failed (${response.status}): ${error}`);
  }

  const data = await response.json();
  return parsePostsFromListing(data);
}

// Get new posts from a subreddit
export async function getSubredditPosts(
  subreddit: string,
  options: {
    sort?: 'hot' | 'new' | 'top' | 'rising';
    time?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
    limit?: number;
  } = {}
): Promise<RedditSearchResult> {
  const { sort = 'new', time = 'week', limit = 25 } = options;

  const params = new URLSearchParams({
    t: time,
    limit: limit.toString(),
    raw_json: '1',
  });

  const response = await rateLimitedFetch(
    `https://www.reddit.com/r/${encodeURIComponent(subreddit)}/${sort}.json?${params}`
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get subreddit posts (${response.status}): ${error}`);
  }

  const data = await response.json();
  return parsePostsFromListing(data);
}

// Test that public JSON endpoints are reachable
export async function testConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await rateLimitedFetch(
      'https://www.reddit.com/r/test/new.json?limit=1&raw_json=1'
    );
    if (!response.ok) {
      return { success: false, error: `Reddit returned ${response.status}` };
    }
    const data = await response.json();
    if (!data?.data?.children) {
      return { success: false, error: 'Unexpected response format from Reddit' };
    }
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}

// Monitor multiple keywords across subreddits
export async function monitorKeywords(
  keywords: string[],
  subreddits: string[] = []
): Promise<{ keyword: string; posts: RedditPost[] }[]> {
  const results: { keyword: string; posts: RedditPost[] }[] = [];

  for (const keyword of keywords) {
    try {
      if (subreddits.length > 0) {
        const allPosts: RedditPost[] = [];
        for (const subreddit of subreddits) {
          const { posts } = await searchReddit(keyword, { subreddit, limit: 10 });
          allPosts.push(...posts);
        }
        results.push({ keyword, posts: allPosts });
      } else {
        const { posts } = await searchReddit(keyword, { limit: 25 });
        results.push({ keyword, posts });
      }
    } catch (error) {
      console.error(`Error searching for keyword "${keyword}":`, error);
      results.push({ keyword, posts: [] });
    }
  }

  return results;
}

export type { RedditPost, RedditSearchResult };
