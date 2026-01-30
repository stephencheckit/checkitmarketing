'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Plus,
  Trash2,
  RefreshCw,
  ExternalLink,
  Star,
  Clock,
  AlertCircle,
  Loader2,
  TrendingUp,
  Users,
  Hash,
  X,
  MessageSquare,
} from 'lucide-react';

// Reddit icon component
const RedditIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
  </svg>
);

// Types
interface RedditKeyword {
  id: number;
  keyword: string;
  subreddits: string[];
  is_active: boolean;
  created_at: string;
}

interface RedditPost {
  id: number;
  post_id: string;
  keyword_id: number;
  keyword: string;
  title: string;
  selftext: string;
  author: string;
  subreddit: string;
  score: number;
  num_comments: number;
  permalink: string;
  created_utc: number;
  is_lead: boolean;
  notes: string | null;
  fetched_at: string;
}

interface RedditSummary {
  totalKeywords: number;
  activeKeywords: number;
  totalPosts: number;
  totalLeads: number;
  subredditsMonitored: number;
  lastSyncedAt: string | null;
  lastSyncStatus: string | null;
}

// Temporary flag - set to true once Reddit API is approved
const redditApiApproved = false;

// Default keywords for Checkit's industry
const defaultKeywords = [
  { keyword: 'food safety software', subreddits: ['foodservice', 'restaurants', 'KitchenConfidential'] },
  { keyword: 'inspection app', subreddits: ['foodservice', 'smallbusiness'] },
  { keyword: 'compliance tracking', subreddits: ['compliance', 'smallbusiness'] },
  { keyword: 'senior living technology', subreddits: ['seniorliving', 'nursing'] },
  { keyword: 'HACCP software', subreddits: ['foodservice', 'foodsafety'] },
];

export default function RedditMonitorPage() {
  // State
  const [keywords, setKeywords] = useState<RedditKeyword[]>([]);
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [summary, setSummary] = useState<RedditSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // UI state
  const [viewMode, setViewMode] = useState<'all' | 'leads' | 'keywords'>('all');
  const [showAddKeyword, setShowAddKeyword] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [newSubreddits, setNewSubreddits] = useState('');
  const [filterKeyword, setFilterKeyword] = useState<number | null>(null);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/reddit/monitor?type=all');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch data');
      }
      const data = await response.json();
      setKeywords(data.keywords || []);
      setPosts(data.posts || []);
      setSummary(data.summary || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync Reddit data
  const syncReddit = useCallback(async () => {
    setSyncing(true);
    setError(null);
    try {
      const response = await fetch('/api/reddit/monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync' }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to sync');
      }
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync');
    } finally {
      setSyncing(false);
    }
  }, [fetchData]);

  // Add keyword
  const addKeyword = async () => {
    if (!newKeyword.trim()) return;
    
    try {
      const subreddits = newSubreddits.split(',').map(s => s.trim()).filter(Boolean);
      const response = await fetch('/api/reddit/monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add_keyword', keyword: newKeyword.trim(), subreddits }),
      });
      if (!response.ok) throw new Error('Failed to add keyword');
      setNewKeyword('');
      setNewSubreddits('');
      setShowAddKeyword(false);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add keyword');
    }
  };

  // Delete keyword
  const deleteKeyword = async (keywordId: number) => {
    try {
      const response = await fetch('/api/reddit/monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_keyword', keywordId }),
      });
      if (!response.ok) throw new Error('Failed to delete keyword');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete keyword');
    }
  };

  // Mark post as lead
  const toggleLead = async (postId: number, currentIsLead: boolean) => {
    try {
      const response = await fetch('/api/reddit/monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_lead', postId, isLead: !currentIsLead }),
      });
      if (!response.ok) throw new Error('Failed to update');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    }
  };

  // Seed default keywords
  const seedDefaultKeywords = async () => {
    for (const kw of defaultKeywords) {
      await fetch('/api/reddit/monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add_keyword', keyword: kw.keyword, subreddits: kw.subreddits }),
      });
    }
    await fetchData();
  };

  // Load data on mount (only if approved)
  useEffect(() => {
    if (redditApiApproved) {
      fetchData();
    }
  }, [fetchData]);

  // Format relative time
  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    if (viewMode === 'leads' && !post.is_lead) return false;
    if (filterKeyword && post.keyword_id !== filterKeyword) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <RedditIcon className="w-7 h-7 text-orange-500" />
              Reddit Monitor
            </h1>
            <p className="text-muted mt-1">
              Track mentions, find leads, and monitor conversations
            </p>
          </div>
          {redditApiApproved && (
            <button
              onClick={syncReddit}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {syncing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {syncing ? 'Syncing...' : 'Sync Now'}
            </button>
          )}
        </div>

        {/* Pending Approval Message */}
        {!redditApiApproved && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-8 text-center mb-8">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">Pending API Approval</h3>
            <p className="text-sm text-muted max-w-md mx-auto mb-4">
              Your Reddit API access request has been submitted and is awaiting approval. 
              This typically takes 1-2 business days.
            </p>
            <p className="text-xs text-muted">
              Once approved, this dashboard will monitor Reddit for brand mentions, competitor discussions, and potential leads.
            </p>
          </div>
        )}

        {/* Preview of what will be available */}
        {!redditApiApproved && (
          <div className="space-y-6">
            {/* Preview Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-surface border border-border rounded-xl p-4 opacity-60">
                <div className="text-2xl font-bold text-foreground">-</div>
                <div className="text-sm text-muted">Keywords</div>
              </div>
              <div className="bg-surface border border-border rounded-xl p-4 opacity-60">
                <div className="text-2xl font-bold text-foreground">-</div>
                <div className="text-sm text-muted">Posts Found</div>
              </div>
              <div className="bg-surface border border-border rounded-xl p-4 opacity-60">
                <div className="text-2xl font-bold text-foreground">-</div>
                <div className="text-sm text-muted">Leads</div>
              </div>
              <div className="bg-surface border border-border rounded-xl p-4 opacity-60">
                <div className="text-2xl font-bold text-foreground">-</div>
                <div className="text-sm text-muted">Subreddits</div>
              </div>
              <div className="bg-surface border border-border rounded-xl p-4 opacity-60">
                <div className="text-sm text-muted">Last Synced</div>
                <div className="text-sm text-foreground">Never</div>
              </div>
            </div>

            {/* Preview Keywords */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Hash className="w-4 h-4 text-orange-500" />
                Default Keywords (will be added on approval)
              </h3>
              <div className="flex flex-wrap gap-2">
                {defaultKeywords.map((kw, i) => (
                  <div
                    key={i}
                    className="px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-sm text-orange-400"
                  >
                    {kw.keyword}
                    <span className="text-orange-400/60 ml-2">
                      ({kw.subreddits.length} subreddits)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview Features */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4">Features Coming</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3 p-4 bg-surface-elevated rounded-lg">
                  <Search className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Keyword Monitoring</h4>
                    <p className="text-sm text-muted">Track industry keywords across target subreddits</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-surface-elevated rounded-lg">
                  <Star className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Lead Identification</h4>
                    <p className="text-sm text-muted">Mark high-value posts as leads for follow-up</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-surface-elevated rounded-lg">
                  <TrendingUp className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Trend Detection</h4>
                    <p className="text-sm text-muted">See what topics are gaining traction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Content (shown when API is approved) */}
        {redditApiApproved && (
          <>
            {/* Error Alert */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                <h3 className="font-medium text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Error
                </h3>
                <p className="text-sm text-red-400/80 mt-1">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="bg-surface border border-border rounded-xl p-12 text-center mb-6">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500 mb-4" />
                <p className="text-muted">Loading Reddit data...</p>
              </div>
            )}

            {/* Summary Cards */}
            {!loading && summary && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-surface border border-border rounded-xl p-4">
                  <div className="text-2xl font-bold text-foreground">{summary.activeKeywords}</div>
                  <div className="text-sm text-muted">Keywords</div>
                </div>
                <div className="bg-surface border border-border rounded-xl p-4">
                  <div className="text-2xl font-bold text-foreground">{summary.totalPosts}</div>
                  <div className="text-sm text-muted">Posts Found</div>
                </div>
                <div className="bg-surface border border-border rounded-xl p-4">
                  <div className="text-2xl font-bold text-orange-500">{summary.totalLeads}</div>
                  <div className="text-sm text-muted">Leads</div>
                </div>
                <div className="bg-surface border border-border rounded-xl p-4">
                  <div className="text-2xl font-bold text-foreground">{summary.subredditsMonitored}</div>
                  <div className="text-sm text-muted">Subreddits</div>
                </div>
                <div className="bg-surface border border-border rounded-xl p-4">
                  <div className="text-sm text-muted">Last Synced</div>
                  <div className="text-sm text-foreground">
                    {summary.lastSyncedAt
                      ? new Date(summary.lastSyncedAt).toLocaleString()
                      : 'Never'}
                  </div>
                </div>
              </div>
            )}

            {/* View Toggle & Actions */}
            {!loading && (
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('all')}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      viewMode === 'all'
                        ? 'bg-orange-500 text-white'
                        : 'bg-surface-elevated text-muted hover:text-foreground'
                    }`}
                  >
                    All Posts
                  </button>
                  <button
                    onClick={() => setViewMode('leads')}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      viewMode === 'leads'
                        ? 'bg-orange-500 text-white'
                        : 'bg-surface-elevated text-muted hover:text-foreground'
                    }`}
                  >
                    <Star className="w-4 h-4 inline mr-1" />
                    Leads
                  </button>
                  <button
                    onClick={() => setViewMode('keywords')}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      viewMode === 'keywords'
                        ? 'bg-orange-500 text-white'
                        : 'bg-surface-elevated text-muted hover:text-foreground'
                    }`}
                  >
                    <Hash className="w-4 h-4 inline mr-1" />
                    Keywords
                  </button>
                </div>

                {/* Filter by keyword */}
                {viewMode !== 'keywords' && keywords.length > 0 && (
                  <select
                    value={filterKeyword || ''}
                    onChange={(e) => setFilterKeyword(e.target.value ? parseInt(e.target.value) : null)}
                    className="px-3 py-2 bg-surface-elevated border border-border rounded-lg text-sm text-foreground"
                  >
                    <option value="">All Keywords</option>
                    {keywords.map((kw) => (
                      <option key={kw.id} value={kw.id}>{kw.keyword}</option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Keywords View */}
            {!loading && viewMode === 'keywords' && (
              <div className="bg-surface border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Monitored Keywords</h3>
                  <button
                    onClick={() => setShowAddKeyword(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600"
                  >
                    <Plus className="w-4 h-4" />
                    Add Keyword
                  </button>
                </div>

                {keywords.length === 0 ? (
                  <div className="text-center py-8">
                    <Hash className="w-12 h-12 text-muted mx-auto mb-4" />
                    <p className="text-muted mb-4">No keywords configured yet</p>
                    <button
                      onClick={seedDefaultKeywords}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                    >
                      Add Default Keywords
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {keywords.map((kw) => (
                      <div
                        key={kw.id}
                        className="flex items-center justify-between p-3 bg-surface-elevated rounded-lg"
                      >
                        <div>
                          <span className="font-medium text-foreground">{kw.keyword}</span>
                          {(kw.subreddits as string[])?.length > 0 && (
                            <span className="text-sm text-muted ml-2">
                              in r/{(kw.subreddits as string[]).join(', r/')}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => deleteKeyword(kw.id)}
                          className="p-2 text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Keyword Modal */}
                {showAddKeyword && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-md">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-foreground">Add Keyword</h3>
                        <button
                          onClick={() => setShowAddKeyword(false)}
                          className="p-2 text-muted hover:text-foreground"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-muted mb-1">Keyword</label>
                          <input
                            type="text"
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            placeholder="e.g., food safety software"
                            className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-foreground"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-muted mb-1">
                            Subreddits (comma-separated, optional)
                          </label>
                          <input
                            type="text"
                            value={newSubreddits}
                            onChange={(e) => setNewSubreddits(e.target.value)}
                            placeholder="e.g., foodservice, restaurants"
                            className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-foreground"
                          />
                          <p className="text-xs text-muted mt-1">
                            Leave empty to search all of Reddit
                          </p>
                        </div>
                        <button
                          onClick={addKeyword}
                          disabled={!newKeyword.trim()}
                          className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                        >
                          Add Keyword
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Posts List */}
            {!loading && viewMode !== 'keywords' && (
              <div className="space-y-4">
                {filteredPosts.length === 0 ? (
                  <div className="bg-surface border border-border rounded-xl p-12 text-center">
                    <RedditIcon className="w-12 h-12 text-muted mx-auto mb-4" />
                    <p className="text-muted">
                      {viewMode === 'leads'
                        ? 'No leads marked yet. Star posts to add them here.'
                        : 'No posts found. Add keywords and sync to find posts.'}
                    </p>
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      className={`bg-surface border rounded-xl p-4 ${
                        post.is_lead ? 'border-orange-500/50' : 'border-border'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-orange-500/10 text-orange-400 text-xs rounded">
                              r/{post.subreddit}
                            </span>
                            <span className="text-xs text-muted">
                              {formatRelativeTime(post.created_utc)}
                            </span>
                            <span className="text-xs text-muted">
                              by u/{post.author}
                            </span>
                          </div>
                          <h3 className="font-medium text-foreground mb-1">
                            {post.title}
                          </h3>
                          {post.selftext && (
                            <p className="text-sm text-muted line-clamp-2">
                              {post.selftext}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted">
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {post.score}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              {post.num_comments}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-surface-elevated rounded">
                              {post.keyword}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => toggleLead(post.id, post.is_lead)}
                            className={`p-2 rounded-lg transition-colors ${
                              post.is_lead
                                ? 'text-orange-500 bg-orange-500/10'
                                : 'text-muted hover:text-orange-500 hover:bg-orange-500/10'
                            }`}
                            title={post.is_lead ? 'Remove from leads' : 'Mark as lead'}
                          >
                            <Star className={`w-4 h-4 ${post.is_lead ? 'fill-current' : ''}`} />
                          </button>
                          <a
                            href={post.permalink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-muted hover:text-foreground hover:bg-surface-elevated rounded-lg"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
