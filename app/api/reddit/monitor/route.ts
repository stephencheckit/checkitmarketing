import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import {
  initializeRedditTables,
  createRedditKeyword,
  getRedditKeywords,
  deleteRedditKeyword,
  toggleRedditKeyword,
  upsertRedditPost,
  getRedditPosts,
  markPostAsLead,
  createRedditSyncLog,
  updateRedditSyncLog,
  getRedditSummary,
} from '@/lib/db';
import { searchReddit, testConnection } from '@/lib/reddit';

// GET - Return cached Reddit data
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize tables if needed
    await initializeRedditTables();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';

    // Test connection
    if (type === 'test') {
      const result = await testConnection();
      return NextResponse.json(result);
    }

    // Get keywords
    if (type === 'keywords') {
      const keywords = await getRedditKeywords();
      return NextResponse.json({ keywords });
    }

    // Get posts
    if (type === 'posts') {
      const keywordId = searchParams.get('keywordId');
      const subreddit = searchParams.get('subreddit');
      const leadsOnly = searchParams.get('leadsOnly') === 'true';
      
      const posts = await getRedditPosts({
        keywordId: keywordId ? parseInt(keywordId) : undefined,
        subreddit: subreddit || undefined,
        leadsOnly,
      });
      return NextResponse.json({ posts });
    }

    // Get leads only
    if (type === 'leads') {
      const posts = await getRedditPosts({ leadsOnly: true });
      return NextResponse.json({ posts });
    }

    // Get summary
    if (type === 'summary') {
      const summary = await getRedditSummary();
      return NextResponse.json({ summary });
    }

    // Get all data
    const keywords = await getRedditKeywords();
    const posts = await getRedditPosts({ limit: 50 });
    const summary = await getRedditSummary();

    return NextResponse.json({
      keywords,
      posts,
      summary,
    });
  } catch (error) {
    console.error('Reddit monitor GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Reddit data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST - Manage keywords and trigger sync
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize tables if needed
    await initializeRedditTables();

    const body = await request.json();
    const { action } = body;

    // Add a new keyword to monitor
    if (action === 'add_keyword') {
      const { keyword, subreddits } = body;
      if (!keyword) {
        return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
      }
      const result = await createRedditKeyword(keyword, subreddits || []);
      return NextResponse.json({ success: true, keyword: result });
    }

    // Delete a keyword
    if (action === 'delete_keyword') {
      const { keywordId } = body;
      if (!keywordId) {
        return NextResponse.json({ error: 'Keyword ID is required' }, { status: 400 });
      }
      await deleteRedditKeyword(keywordId);
      return NextResponse.json({ success: true });
    }

    // Toggle keyword active status
    if (action === 'toggle_keyword') {
      const { keywordId, isActive } = body;
      if (!keywordId) {
        return NextResponse.json({ error: 'Keyword ID is required' }, { status: 400 });
      }
      await toggleRedditKeyword(keywordId, isActive);
      return NextResponse.json({ success: true });
    }

    // Mark a post as a lead
    if (action === 'mark_lead') {
      const { postId, isLead, notes } = body;
      if (!postId) {
        return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
      }
      await markPostAsLead(postId, isLead, notes);
      return NextResponse.json({ success: true });
    }

    // Trigger a sync for all keywords
    if (action === 'sync') {
      // Check for API credentials
      const connectionTest = await testConnection();
      if (!connectionTest.success) {
        return NextResponse.json(
          { 
            error: 'Reddit API not configured', 
            details: connectionTest.error,
            hint: 'Add your Reddit API credentials to .env.local once approved'
          },
          { status: 500 }
        );
      }

      // Create sync log
      const syncLog = await createRedditSyncLog('full');

      try {
        // Get all active keywords
        const keywords = await getRedditKeywords(true);
        
        if (keywords.length === 0) {
          await updateRedditSyncLog(syncLog.id, {
            status: 'completed',
            postsFetched: 0,
          });
          return NextResponse.json({ 
            success: true, 
            message: 'No keywords to monitor. Add some keywords first.',
            postsFetched: 0 
          });
        }

        let totalPostsFetched = 0;

        // Search for each keyword
        for (const kw of keywords) {
          try {
            const subreddits = (kw.subreddits as string[]) || [];
            
            if (subreddits.length > 0) {
              // Search in specific subreddits
              for (const subreddit of subreddits) {
                const { posts } = await searchReddit(kw.keyword, { 
                  subreddit, 
                  limit: 25,
                  time: 'week',
                  sort: 'new'
                });
                
                for (const post of posts) {
                  await upsertRedditPost({
                    post_id: post.id,
                    keyword_id: kw.id,
                    title: post.title,
                    selftext: post.selftext || '',
                    author: post.author,
                    subreddit: post.subreddit,
                    score: post.score,
                    num_comments: post.num_comments,
                    permalink: post.permalink,
                    created_utc: post.created_utc,
                  });
                  totalPostsFetched++;
                }
              }
            } else {
              // Search all of Reddit
              const { posts } = await searchReddit(kw.keyword, { 
                limit: 25,
                time: 'week',
                sort: 'relevance'
              });
              
              for (const post of posts) {
                await upsertRedditPost({
                  post_id: post.id,
                  keyword_id: kw.id,
                  title: post.title,
                  selftext: post.selftext || '',
                  author: post.author,
                  subreddit: post.subreddit,
                  score: post.score,
                  num_comments: post.num_comments,
                  permalink: post.permalink,
                  created_utc: post.created_utc,
                });
                totalPostsFetched++;
              }
            }
          } catch (error) {
            console.error(`Error fetching posts for keyword "${kw.keyword}":`, error);
          }
        }

        await updateRedditSyncLog(syncLog.id, {
          status: 'completed',
          postsFetched: totalPostsFetched,
        });

        return NextResponse.json({ 
          success: true, 
          postsFetched: totalPostsFetched,
          keywordsProcessed: keywords.length
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        await updateRedditSyncLog(syncLog.id, {
          status: 'failed',
          errorMessage,
        });
        throw error;
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Reddit monitor POST error:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
