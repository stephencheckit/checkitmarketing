'use client';

import { useState, useEffect, useCallback } from 'react';
import { Copy, Check, Sparkles, Linkedin, Facebook, Twitter, ChevronDown, ChevronUp, Target, ListChecks, FileText, X, Loader2, Trash2, Archive, RefreshCw, Lightbulb, Rss, ExternalLink, Building2, AlertCircle, Wand2 } from 'lucide-react';
import ContributionModal from '@/components/ContributionModal';

type TabType = 'ideas' | 'competitor-watch';

interface ContentIdea {
  id?: number;
  title: string;
  description: string;
  targetAudience: string;
  keyPoints: string[];
  linkedinPost: string;
  facebookPost: string;
  twitterPost: string;
  article?: string;
  articleWordCount?: number;
  status?: string;
  created_at?: string;
}

// Competitor RSS Types
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

interface CompetitorRSSResponse {
  summary: {
    competitorsChecked: number;
    feedsFound: number;
    totalItems: number;
    checkedAt: string;
  };
  feeds: CompetitorFeed[];
}

interface GeneratedResponse {
  title: string;
  description: string;
  keyPoints: string[];
  linkedinPost: string;
  article: string;
  wordCount: number;
}

interface GeneratedArticle {
  title: string;
  article: string;
  wordCount: number;
}

interface IdeationResponse {
  ideas: ContentIdea[];
  basedOn: number;
  generatedAt: string;
}

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState<TabType>('ideas');
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [basedOn, setBasedOn] = useState<number>(0);
  const [expandedIdeas, setExpandedIdeas] = useState<Set<number>>(new Set([0]));
  
  // Article generation state
  const [generatingArticle, setGeneratingArticle] = useState<number | null>(null);
  const [articleModal, setArticleModal] = useState<number | null>(null);
  
  // Delete state
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  // Contribution modal
  const [showContribution, setShowContribution] = useState(false);
  
  // Competitor Watch state
  const [competitorFeeds, setCompetitorFeeds] = useState<CompetitorRSSResponse | null>(null);
  const [loadingFeeds, setLoadingFeeds] = useState(false);
  const [feedsError, setFeedsError] = useState<string | null>(null);
  const [generatingResponse, setGeneratingResponse] = useState<string | null>(null); // itemId being generated
  const [generatedResponses, setGeneratedResponses] = useState<Map<string, GeneratedResponse>>(new Map());
  const [responseModal, setResponseModal] = useState<{ itemId: string; response: GeneratedResponse } | null>(null);

  // Load saved ideas on mount
  const loadSavedIdeas = useCallback(async () => {
    try {
      setLoadingSaved(true);
      const res = await fetch('/api/content');
      if (!res.ok) throw new Error('Failed to load saved ideas');
      const data = await res.json();
      
      // Transform database format to frontend format
      const transformed = data.ideas.map((idea: {
        id: number;
        title: string;
        description: string;
        target_audience: string;
        key_points: string[];
        linkedin_post: string;
        facebook_post: string;
        twitter_post: string;
        article: string | null;
        article_word_count: number | null;
        status: string;
        created_at: string;
      }) => ({
        id: idea.id,
        title: idea.title,
        description: idea.description,
        targetAudience: idea.target_audience,
        keyPoints: idea.key_points || [],
        linkedinPost: idea.linkedin_post,
        facebookPost: idea.facebook_post,
        twitterPost: idea.twitter_post,
        article: idea.article,
        articleWordCount: idea.article_word_count,
        status: idea.status,
        created_at: idea.created_at,
      }));
      
      setIdeas(transformed);
      if (transformed.length > 0) {
        setExpandedIdeas(new Set([0]));
      }
    } catch (err) {
      console.error('Error loading saved ideas:', err);
    } finally {
      setLoadingSaved(false);
    }
  }, []);

  useEffect(() => {
    loadSavedIdeas();
  }, [loadSavedIdeas]);

  const generateIdeas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ideate');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate ideas');
      }
      const data: IdeationResponse = await res.json();
      setGeneratedAt(data.generatedAt);
      setBasedOn(data.basedOn);
      
      // Save the new ideas to database
      const saveRes = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideas: data.ideas }),
      });
      
      if (saveRes.ok) {
        // Reload to get the saved ideas with IDs
        await loadSavedIdeas();
      } else {
        // If save fails, still show the ideas but warn
        setIdeas(data.ideas);
        setExpandedIdeas(new Set([0]));
        console.error('Failed to save ideas to database');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const generateArticle = async (index: number, idea: ContentIdea) => {
    setGeneratingArticle(index);
    try {
      const res = await fetch('/api/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: idea.title,
          description: idea.description,
          targetAudience: idea.targetAudience,
          keyPoints: idea.keyPoints,
        }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate article');
      }
      
      const data: GeneratedArticle = await res.json();
      
      // Save the article to the idea in database
      if (idea.id) {
        await fetch('/api/content', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: idea.id,
            article: data.article,
            articleWordCount: data.wordCount,
          }),
        });
        
        // Update local state
        setIdeas(prev => prev.map((i, idx) => 
          idx === index 
            ? { ...i, article: data.article, articleWordCount: data.wordCount }
            : i
        ));
      }
      
      setArticleModal(index);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate article');
    } finally {
      setGeneratingArticle(null);
    }
  };

  const deleteIdea = async (id: number, index: number) => {
    if (!confirm('Delete this content idea? This cannot be undone.')) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/content?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      
      setIdeas(prev => prev.filter((_, idx) => idx !== index));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete idea');
    } finally {
      setDeletingId(null);
    }
  };

  const archiveIdea = async (id: number, index: number) => {
    try {
      const res = await fetch('/api/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'archived' }),
      });
      if (!res.ok) throw new Error('Failed to archive');
      
      setIdeas(prev => prev.map((idea, idx) => 
        idx === index ? { ...idea, status: 'archived' } : idea
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive idea');
    }
  };

  // Fetch competitor RSS feeds
  const fetchCompetitorFeeds = async () => {
    setLoadingFeeds(true);
    setFeedsError(null);
    try {
      const res = await fetch('/api/competitor-rss');
      if (!res.ok) throw new Error('Failed to fetch competitor feeds');
      const data: CompetitorRSSResponse = await res.json();
      setCompetitorFeeds(data);
    } catch (err) {
      setFeedsError(err instanceof Error ? err.message : 'Failed to fetch feeds');
    } finally {
      setLoadingFeeds(false);
    }
  };

  // Generate Checkit response to competitor content
  const generateResponse = async (competitorName: string, item: RSSFeedItem) => {
    const itemId = `${competitorName}-${item.title}`;
    setGeneratingResponse(itemId);
    try {
      const res = await fetch('/api/generate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitorName,
          competitorArticleTitle: item.title,
          competitorArticleSnippet: item.contentSnippet || item.content,
          competitorArticleUrl: item.link,
        }),
      });
      
      if (!res.ok) throw new Error('Failed to generate response');
      
      const data = await res.json();
      const response: GeneratedResponse = data.generated;
      
      setGeneratedResponses(prev => new Map(prev).set(itemId, response));
      setResponseModal({ itemId, response });
    } catch (err) {
      setFeedsError(err instanceof Error ? err.message : 'Failed to generate response');
    } finally {
      setGeneratingResponse(null);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      console.error('Failed to copy');
    }
  };

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedIdeas);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedIdeas(newExpanded);
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'linkedin': return 'bg-[#0A66C2] hover:bg-[#004182]';
      case 'facebook': return 'bg-[#1877F2] hover:bg-[#0d5fc7]';
      case 'twitter': return 'bg-black hover:bg-zinc-800';
      default: return 'bg-zinc-600';
    }
  };

  const activeIdeas = ideas.filter(i => i.status !== 'archived');
  const archivedCount = ideas.filter(i => i.status === 'archived').length;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <FileText className="w-7 h-7" style={{ stroke: 'url(#icon-gradient)' }} />
              Content Hub
            </h1>
            <p className="text-sm text-muted mt-1">
              {activeTab === 'ideas' 
                ? `AI-powered content ideas • ${activeIdeas.length} ideas ${archivedCount > 0 ? `• ${archivedCount} archived` : ''}`
                : `Monitor competitor content & generate Checkit responses`
              }
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {activeTab === 'ideas' ? (
              <>
                <button
                  onClick={() => setShowContribution(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-success/20 text-success rounded-lg hover:bg-success/30 transition-colors"
                >
                  <Lightbulb className="w-4 h-4" />
                  Suggest Idea
                </button>
                
                <button
                  onClick={generateIdeas}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  <Sparkles className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
                  {loading ? 'Generating...' : 'Generate Ideas'}
                </button>
              </>
            ) : (
              <button
                onClick={fetchCompetitorFeeds}
                disabled={loadingFeeds}
                className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                <Rss className={`w-4 h-4 ${loadingFeeds ? 'animate-pulse' : ''}`} />
                {loadingFeeds ? 'Scanning...' : 'Scan Competitor Feeds'}
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 bg-surface-elevated rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab('ideas')}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
              activeTab === 'ideas'
                ? 'bg-accent text-white'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Content Ideas
          </button>
          <button
            onClick={() => setActiveTab('competitor-watch')}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${
              activeTab === 'competitor-watch'
                ? 'bg-accent text-white'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <Rss className="w-4 h-4" />
            Competitor Watch
          </button>
        </div>

        {/* IDEAS TAB */}
        {activeTab === 'ideas' && (
          <>
            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-surface border border-border rounded-lg shadow">
                  <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  <span className="text-muted">
                    Analyzing {basedOn || '...'} existing articles and generating fresh ideas...
                  </span>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-8">
                <div className="inline-block px-6 py-4 bg-error/10 border border-error/30 rounded-lg">
                  <p className="text-error">{error}</p>
                  <button onClick={() => setError(null)} className="mt-2 text-sm text-error hover:underline">
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Loading saved ideas */}
            {loadingSaved && (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-accent mx-auto mb-4" />
            <p className="text-muted">Loading saved ideas...</p>
          </div>
        )}

        {/* Results */}
        {activeIdeas.length > 0 && !loading && !loadingSaved && (
          <>
            <div className="text-center mb-6 text-sm text-muted">
              {activeIdeas.length} saved idea{activeIdeas.length !== 1 ? 's' : ''}
              {archivedCount > 0 && ` • ${archivedCount} archived`}
              {generatedAt && ` • Last generated ${new Date(generatedAt).toLocaleString()}`}
            </div>

            <div className="space-y-4">
              {activeIdeas.map((idea, index) => {
                const isExpanded = expandedIdeas.has(index);
                const hasArticle = idea.article;
                const isGenerating = generatingArticle === index;
                const isDeleting = deletingId === idea.id;
                
                return (
                  <div
                    key={idea.id || index}
                    className="bg-surface border border-border rounded-xl overflow-hidden"
                  >
                    {/* Idea Header - Always Visible */}
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <button
                          onClick={() => toggleExpanded(index)}
                          className="flex-1 text-left hover:opacity-80 transition-opacity"
                        >
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-accent/20 text-accent text-sm font-semibold">
                              {index + 1}
                            </span>
                            <span className="text-xs px-2 py-1 bg-surface-elevated text-muted rounded-full">
                              {idea.targetAudience}
                            </span>
                            {hasArticle && (
                              <span className="text-xs px-2 py-1 bg-success/20 text-success rounded-full flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                Article Ready
                              </span>
                            )}
                            {idea.created_at && (
                              <span className="text-xs text-muted">
                                {new Date(idea.created_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <h2 className="text-xl font-semibold text-foreground mb-2">
                            {idea.title}
                          </h2>
                          <p className="text-muted text-sm">
                            {idea.description}
                          </p>
                        </button>
                        <div className="flex items-center gap-2">
                          {idea.id && (
                            <>
                              <button
                                onClick={() => archiveIdea(idea.id!, index)}
                                className="p-2 text-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors"
                                title="Archive"
                              >
                                <Archive className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteIdea(idea.id!, index)}
                                disabled={isDeleting}
                                className="p-2 text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors disabled:opacity-50"
                                title="Delete"
                              >
                                {isDeleting ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => toggleExpanded(index)}
                            className="p-2 text-muted hover:text-foreground"
                          >
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t border-border">
                        {/* Key Points */}
                        <div className="p-6 border-b border-border bg-surface-elevated/50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <ListChecks className="w-4 h-4 text-accent" />
                              <h3 className="text-sm font-medium text-foreground">Key Points to Cover</h3>
                            </div>
                            
                            {/* Generate Article Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (hasArticle) {
                                  setArticleModal(index);
                                } else {
                                  generateArticle(index, idea);
                                }
                              }}
                              disabled={isGenerating}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                hasArticle
                                  ? 'bg-success hover:bg-success/80 text-white'
                                  : 'bg-accent hover:bg-accent-hover text-white'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {isGenerating ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Generating...
                                </>
                              ) : hasArticle ? (
                                <>
                                  <FileText className="w-4 h-4" />
                                  View Article
                                </>
                              ) : (
                                <>
                                  <FileText className="w-4 h-4" />
                                  Generate Article
                                </>
                              )}
                            </button>
                          </div>
                          <ul className="space-y-2">
                            {idea.keyPoints.map((point, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted">
                                <span className="text-accent mt-0.5">•</span>
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Social Posts */}
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <Target className="w-4 h-4 text-accent" />
                            <h3 className="text-sm font-medium text-foreground">Ready-to-Post Social Content</h3>
                          </div>
                          
                          <div className="grid gap-4 md:grid-cols-3">
                            {/* LinkedIn */}
                            <div className="bg-surface-elevated rounded-lg p-4 border border-border">
                              <div className="flex items-center justify-between mb-3">
                                <div className={`flex items-center gap-2 px-2 py-1 rounded text-white text-xs ${getPlatformColor('linkedin')}`}>
                                  <Linkedin className="w-3 h-3" />
                                  <span>LinkedIn</span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(idea.linkedinPost, `${index}-linkedin`);
                                  }}
                                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                                    copiedId === `${index}-linkedin`
                                      ? 'bg-success/20 text-success'
                                      : 'bg-surface text-muted hover:bg-surface-elevated'
                                  }`}
                                >
                                  {copiedId === `${index}-linkedin` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                  {copiedId === `${index}-linkedin` ? 'Copied' : 'Copy'}
                                </button>
                              </div>
                              <pre className="text-xs text-muted whitespace-pre-wrap font-sans leading-relaxed max-h-48 overflow-y-auto">
                                {idea.linkedinPost}
                              </pre>
                              <div className="mt-2 text-xs text-muted/60">{idea.linkedinPost.length} chars</div>
                            </div>

                            {/* Facebook */}
                            <div className="bg-surface-elevated rounded-lg p-4 border border-border">
                              <div className="flex items-center justify-between mb-3">
                                <div className={`flex items-center gap-2 px-2 py-1 rounded text-white text-xs ${getPlatformColor('facebook')}`}>
                                  <Facebook className="w-3 h-3" />
                                  <span>Facebook</span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(idea.facebookPost, `${index}-facebook`);
                                  }}
                                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                                    copiedId === `${index}-facebook`
                                      ? 'bg-success/20 text-success'
                                      : 'bg-surface text-muted hover:bg-surface-elevated'
                                  }`}
                                >
                                  {copiedId === `${index}-facebook` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                  {copiedId === `${index}-facebook` ? 'Copied' : 'Copy'}
                                </button>
                              </div>
                              <pre className="text-xs text-muted whitespace-pre-wrap font-sans leading-relaxed max-h-48 overflow-y-auto">
                                {idea.facebookPost}
                              </pre>
                              <div className="mt-2 text-xs text-muted/60">{idea.facebookPost.length} chars</div>
                            </div>

                            {/* Twitter/X */}
                            <div className="bg-surface-elevated rounded-lg p-4 border border-border">
                              <div className="flex items-center justify-between mb-3">
                                <div className={`flex items-center gap-2 px-2 py-1 rounded text-white text-xs ${getPlatformColor('twitter')}`}>
                                  <Twitter className="w-3 h-3" />
                                  <span>X</span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(idea.twitterPost, `${index}-twitter`);
                                  }}
                                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                                    copiedId === `${index}-twitter`
                                      ? 'bg-success/20 text-success'
                                      : 'bg-surface text-muted hover:bg-surface-elevated'
                                  }`}
                                >
                                  {copiedId === `${index}-twitter` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                  {copiedId === `${index}-twitter` ? 'Copied' : 'Copy'}
                                </button>
                              </div>
                              <pre className="text-xs text-muted whitespace-pre-wrap font-sans leading-relaxed">
                                {idea.twitterPost}
                              </pre>
                              <div className="mt-2 text-xs text-muted/60">
                                {idea.twitterPost.length} chars
                                {idea.twitterPost.length > 280 && <span className="text-error ml-1">(over limit!)</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

            {/* Empty State */}
            {!loading && !loadingSaved && activeIdeas.length === 0 && !error && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
                  <Sparkles className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Ready to Generate Ideas
                </h2>
                <p className="text-muted max-w-md mx-auto">
                  Click the button above to analyze Checkit&apos;s existing content and generate fresh article ideas with social media posts.
                </p>
              </div>
            )}
          </>
        )}

        {/* COMPETITOR WATCH TAB */}
        {activeTab === 'competitor-watch' && (
          <>
            {/* Feeds Error */}
            {feedsError && (
              <div className="text-center py-8">
                <div className="inline-block px-6 py-4 bg-error/10 border border-error/30 rounded-lg">
                  <p className="text-error">{feedsError}</p>
                  <button onClick={() => setFeedsError(null)} className="mt-2 text-sm text-error hover:underline">
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Loading Feeds */}
            {loadingFeeds && (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-surface border border-border rounded-lg shadow">
                  <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  <span className="text-muted">
                    Scanning competitor websites for RSS feeds...
                  </span>
                </div>
              </div>
            )}

            {/* Feed Results */}
            {competitorFeeds && !loadingFeeds && (
              <>
                {/* Summary */}
                <div className="bg-surface border border-border rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm">
                      <span className="text-muted">
                        <span className="font-semibold text-foreground">{competitorFeeds.summary.competitorsChecked}</span> competitors checked
                      </span>
                      <span className="text-muted">
                        <span className="font-semibold text-success">{competitorFeeds.summary.feedsFound}</span> RSS feeds found
                      </span>
                      <span className="text-muted">
                        <span className="font-semibold text-accent">{competitorFeeds.summary.totalItems}</span> recent articles
                      </span>
                    </div>
                    <span className="text-xs text-muted">
                      Scanned {new Date(competitorFeeds.summary.checkedAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Competitor Feeds */}
                <div className="space-y-6">
                  {competitorFeeds.feeds.map(feed => (
                    <div key={feed.competitorId} className="bg-surface border border-border rounded-xl overflow-hidden">
                      {/* Competitor Header */}
                      <div className="px-4 py-3 bg-surface-elevated border-b border-border flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Building2 className="w-5 h-5 text-muted" />
                          <div>
                            <h3 className="font-semibold text-foreground">{feed.competitorName}</h3>
                            {feed.competitorWebsite && (
                              <a 
                                href={feed.competitorWebsite.startsWith('http') ? feed.competitorWebsite : `https://${feed.competitorWebsite}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-accent hover:underline flex items-center gap-1"
                              >
                                {feed.competitorWebsite.replace(/^https?:\/\//, '')}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                        
                        {feed.feedUrl ? (
                          <span className="flex items-center gap-1.5 text-xs text-success bg-success/10 px-2 py-1 rounded">
                            <Rss className="w-3 h-3" />
                            {feed.items.length} articles
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs text-warning bg-warning/10 px-2 py-1 rounded">
                            <AlertCircle className="w-3 h-3" />
                            {feed.error || 'No RSS feed'}
                          </span>
                        )}
                      </div>
                      
                      {/* Feed Items */}
                      {feed.items.length > 0 ? (
                        <div className="divide-y divide-border">
                          {feed.items.map((item, idx) => {
                            const itemId = `${feed.competitorName}-${item.title}`;
                            const hasResponse = generatedResponses.has(itemId);
                            const isGenerating = generatingResponse === itemId;
                            
                            return (
                              <div key={idx} className="p-4 hover:bg-surface-elevated/50 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1 min-w-0">
                                    <a 
                                      href={item.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-medium text-foreground hover:text-accent transition-colors line-clamp-2"
                                    >
                                      {item.title}
                                    </a>
                                    {item.contentSnippet && (
                                      <p className="text-sm text-muted mt-1 line-clamp-2">
                                        {item.contentSnippet}
                                      </p>
                                    )}
                                    <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                                      {item.pubDate && (
                                        <span>{new Date(item.pubDate).toLocaleDateString()}</span>
                                      )}
                                      {item.creator && (
                                        <span>by {item.creator}</span>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <button
                                    onClick={() => {
                                      if (hasResponse) {
                                        setResponseModal({ itemId, response: generatedResponses.get(itemId)! });
                                      } else {
                                        generateResponse(feed.competitorName, item);
                                      }
                                    }}
                                    disabled={isGenerating}
                                    className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors whitespace-nowrap ${
                                      hasResponse
                                        ? 'bg-success text-white hover:bg-success/80'
                                        : 'bg-accent text-white hover:bg-accent-hover'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                  >
                                    {isGenerating ? (
                                      <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Generating...
                                      </>
                                    ) : hasResponse ? (
                                      <>
                                        <Check className="w-4 h-4" />
                                        View Response
                                      </>
                                    ) : (
                                      <>
                                        <Wand2 className="w-4 h-4" />
                                        Generate Our Take
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : feed.feedUrl ? (
                        <div className="p-4 text-center text-sm text-muted">
                          No recent articles found in feed
                        </div>
                      ) : (
                        <div className="p-4 text-center text-sm text-muted">
                          Add a website URL in the Competitors page to scan for RSS
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Empty State */}
            {!loadingFeeds && !competitorFeeds && !feedsError && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
                  <Rss className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Monitor Competitor Content
                </h2>
                <p className="text-muted max-w-md mx-auto mb-4">
                  Scan your competitors&apos; websites for RSS feeds and generate Checkit&apos;s unique perspective on their topics.
                </p>
                <button
                  onClick={fetchCompetitorFeeds}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
                >
                  <Rss className="w-4 h-4" />
                  Scan Competitor Feeds
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Article Modal */}
      {articleModal !== null && ideas[articleModal]?.article && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-border">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {ideas[articleModal].title}
                </h2>
                <p className="text-sm text-muted mt-1">
                  {ideas[articleModal].articleWordCount} words
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(ideas[articleModal].article!, 'article')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    copiedId === 'article'
                      ? 'bg-success/20 text-success'
                      : 'bg-surface-elevated text-muted hover:text-foreground'
                  }`}
                >
                  {copiedId === 'article' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedId === 'article' ? 'Copied!' : 'Copy Article'}
                </button>
                <button
                  onClick={() => setArticleModal(null)}
                  className="p-2 text-muted hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <article className="prose prose-zinc dark:prose-invert max-w-none">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: ideas[articleModal].article!
                      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-8 mb-4">$1</h2>')
                      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mt-6 mb-3">$1</h3>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
                      .replace(/(<li.*<\/li>\n?)+/g, '<ul class="list-disc my-4">$&</ul>')
                      .replace(/\n\n/g, '</p><p class="mb-4">')
                      .replace(/^(?!<)(.+)$/gm, '<p class="mb-4">$1</p>')
                  }} 
                />
              </article>
            </div>
          </div>
        </div>
      )}

      {/* Generated Response Modal */}
      {responseModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-border">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <div className="flex items-center gap-2 text-xs text-muted mb-1">
                  <Wand2 className="w-3 h-3" />
                  Checkit&apos;s Response
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  {responseModal.response.title}
                </h2>
                <p className="text-sm text-muted mt-1">
                  {responseModal.response.wordCount} words
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(responseModal.response.article, 'response-article')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    copiedId === 'response-article'
                      ? 'bg-success/20 text-success'
                      : 'bg-surface-elevated text-muted hover:text-foreground'
                  }`}
                >
                  {copiedId === 'response-article' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedId === 'response-article' ? 'Copied!' : 'Copy Article'}
                </button>
                <button
                  onClick={() => setResponseModal(null)}
                  className="p-2 text-muted hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Description */}
              <div className="mb-6 p-4 bg-accent/5 border border-accent/20 rounded-lg">
                <p className="text-sm text-foreground">{responseModal.response.description}</p>
              </div>
              
              {/* Key Points */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted mb-3 flex items-center gap-2">
                  <ListChecks className="w-4 h-4" />
                  Key Points
                </h3>
                <ul className="space-y-2">
                  {responseModal.response.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="text-accent mt-0.5">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* LinkedIn Post */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-muted flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                    LinkedIn Post
                  </h3>
                  <button
                    onClick={() => copyToClipboard(responseModal.response.linkedinPost, 'response-linkedin')}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                      copiedId === 'response-linkedin'
                        ? 'bg-success/20 text-success'
                        : 'bg-surface-elevated text-muted hover:text-foreground'
                    }`}
                  >
                    {copiedId === 'response-linkedin' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    Copy
                  </button>
                </div>
                <div className="p-3 bg-surface-elevated rounded-lg text-sm text-foreground whitespace-pre-wrap">
                  {responseModal.response.linkedinPost}
                </div>
              </div>
              
              {/* Article */}
              <div>
                <h3 className="text-sm font-medium text-muted mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Full Article
                </h3>
                <article className="prose prose-zinc dark:prose-invert max-w-none">
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: responseModal.response.article
                        .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-8 mb-4">$1</h2>')
                        .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mt-6 mb-3">$1</h3>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
                        .replace(/(<li.*<\/li>\n?)+/g, '<ul class="list-disc my-4">$&</ul>')
                        .replace(/\n\n/g, '</p><p class="mb-4">')
                        .replace(/^(?!<)(.+)$/gm, '<p class="mb-4">$1</p>')
                    }} 
                  />
                </article>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contribution Modal */}
      <ContributionModal
        isOpen={showContribution}
        onClose={() => setShowContribution(false)}
        targetType="content"
        sectionLabel="Content Ideas"
      />
    </div>
  );
}
