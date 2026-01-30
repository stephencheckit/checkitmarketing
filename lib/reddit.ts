// Reddit API client for monitoring posts

interface RedditAccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

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

// Cache for access token
let cachedToken: { token: string; expiresAt: number } | null = null;

// Get OAuth access token using client credentials
async function getAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  const username = process.env.REDDIT_USERNAME;

  if (!clientId || !clientSecret) {
    throw new Error('Reddit API credentials not configured');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  const response = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': `web:gtmtracker:1.0.0 (by /u/${username || 'gtmtracker'})`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get Reddit access token: ${error}`);
  }

  const data: RedditAccessToken = await response.json();
  
  // Cache the token (expire 5 minutes early to be safe)
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 300) * 1000,
  };

  return data.access_token;
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
  const token = await getAccessToken();
  const username = process.env.REDDIT_USERNAME;
  
  const { subreddit, sort = 'relevance', time = 'week', limit = 25 } = options;
  
  // Build URL
  const baseUrl = subreddit 
    ? `https://oauth.reddit.com/r/${subreddit}/search`
    : 'https://oauth.reddit.com/search';
  
  const params = new URLSearchParams({
    q: query,
    sort,
    t: time,
    limit: limit.toString(),
    restrict_sr: subreddit ? 'true' : 'false',
  });

  const response = await fetch(`${baseUrl}?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'User-Agent': `web:gtmtracker:1.0.0 (by /u/${username || 'gtmtracker'})`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Reddit search failed: ${error}`);
  }

  const data = await response.json();
  
  const posts: RedditPost[] = data.data.children.map((child: { data: RedditPost }) => ({
    id: child.data.id,
    title: child.data.title,
    selftext: child.data.selftext,
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

  return {
    posts,
    after: data.data.after,
  };
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
  const token = await getAccessToken();
  const username = process.env.REDDIT_USERNAME;
  
  const { sort = 'new', time = 'week', limit = 25 } = options;
  
  const params = new URLSearchParams({
    t: time,
    limit: limit.toString(),
  });

  const response = await fetch(
    `https://oauth.reddit.com/r/${subreddit}/${sort}?${params}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': `web:gtmtracker:1.0.0 (by /u/${username || 'gtmtracker'})`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get subreddit posts: ${error}`);
  }

  const data = await response.json();
  
  const posts: RedditPost[] = data.data.children.map((child: { data: RedditPost }) => ({
    id: child.data.id,
    title: child.data.title,
    selftext: child.data.selftext,
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

  return {
    posts,
    after: data.data.after,
  };
}

// Test Reddit API connection
export async function testConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    // Check for required environment variables
    const clientId = process.env.REDDIT_CLIENT_ID;
    const clientSecret = process.env.REDDIT_CLIENT_SECRET;

    console.log('Reddit credentials check:', {
      hasClientId: !!clientId && clientId !== 'your_client_id_here',
      hasClientSecret: !!clientSecret && clientSecret !== 'your_client_secret_here',
    });

    if (!clientId || clientId === 'your_client_id_here') {
      return { success: false, error: 'Reddit Client ID not configured' };
    }
    if (!clientSecret || clientSecret === 'your_client_secret_here') {
      return { success: false, error: 'Reddit Client Secret not configured' };
    }

    // Try to get an access token
    await getAccessToken();
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
        // Search in specific subreddits
        const allPosts: RedditPost[] = [];
        for (const subreddit of subreddits) {
          const { posts } = await searchReddit(keyword, { subreddit, limit: 10 });
          allPosts.push(...posts);
        }
        results.push({ keyword, posts: allPosts });
      } else {
        // Search all of Reddit
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
