'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Bot,
  Search,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  Trophy,
  Target,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Sparkles,
  X,
  Lightbulb,
  Calendar,
  ArrowRight,
  Clock,
  FileText,
  Eye,
  Send,
  ExternalLink,
  Edit3,
} from 'lucide-react';

// Types
interface AIQuery {
  id: number;
  query: string;
  is_active: boolean;
  created_at: string;
}

interface AIResult {
  id: number;
  query_id: number;
  query_text: string;
  original_query?: string;
  response: string;
  checkit_mentioned: boolean;
  checkit_position: number | null;
  competitors_mentioned: string[];
  brands_data: Record<string, { mentioned: boolean; context: string | null }>;
  source: string;
  scanned_at: string;
}

interface AISummary {
  totalQueries: number;
  totalScans: number;
  checkitMentions: number;
  checkitMentionRate: number;
  avgPosition: number | null;
  topCompetitors: { name: string; mentions: number }[];
  lastScanAt: string | null;
  lastScanStatus: string | null;
}

interface TrendDataPoint {
  date: string;
  checkitMentioned: boolean;
  checkitPosition: number | null;
  competitorsMentioned: string[];
}

interface QueryTrend {
  queryId: number;
  queryText: string;
  dataPoints: TrendDataPoint[];
  mentionRate: number;
  avgPosition: number | null;
  positionTrend: 'improving' | 'declining' | 'stable' | 'new';
  competitorFrequency: Record<string, number>;
}

interface BrandTrendPoint {
  date: string;
  totalQueries: number;
  checkitMentions: number;
  mentionRate: number;
  avgPosition: number | null;
}

interface QueryRecommendation {
  query: string;
  rationale: string;
  category: 'expansion' | 'competitor' | 'feature' | 'use-case' | 'comparison';
  priority: 'high' | 'medium' | 'low';
}

interface AISearchProfileScore {
  brand: string;
  totalScore: number;
  components: {
    mentionRate: { score: number; maxScore: number; value: number; label: string };
    positionQuality: { score: number; maxScore: number; value: number | null; label: string };
    queryCoverage: { score: number; maxScore: number; value: number; label: string };
    consistency: { score: number; maxScore: number; value: number; label: string };
    winRate: { score: number; maxScore: number; value: number; label: string };
  };
  rank: number;
  totalBrands: number;
  tier: 'elite' | 'strong' | 'moderate' | 'emerging' | 'minimal';
}

export default function AISearchPage() {
  // State
  const [queries, setQueries] = useState<AIQuery[]>([]);
  const [results, setResults] = useState<AIResult[]>([]);
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [brands, setBrands] = useState<string[]>([]);
  const [defaultQueries, setDefaultQueries] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannedToday, setScannedToday] = useState(false);

  // Trends state
  const [queryTrends, setQueryTrends] = useState<QueryTrend[]>([]);
  const [brandTrends, setBrandTrends] = useState<BrandTrendPoint[]>([]);
  const [trendsLoading, setTrendsLoading] = useState(false);

  // Recommendations state
  const [recommendations, setRecommendations] = useState<QueryRecommendation[]>([]);
  const [recsLoading, setRecsLoading] = useState(false);

  // Scores/Leaderboard state
  const [scores, setScores] = useState<AISearchProfileScore[]>([]);
  const [scoresLoading, setScoresLoading] = useState(false);
  const [expandedScore, setExpandedScore] = useState<string | null>(null);

  // Content drafts state
  interface ContentDraft {
    id: number;
    source_query: string;
    source_query_id: number | null;
    title: string;
    slug: string;
    target_keywords: string[];
    outline: string[];
    key_points: string[];
    faq_questions: string[];
    content: string | null;
    meta_description: string | null;
    excerpt: string | null;
    status: 'idea' | 'brief' | 'draft' | 'review' | 'approved' | 'published';
    published_url: string | null;
    created_at: string;
    updated_at: string;
    published_at: string | null;
  }
  const [drafts, setDrafts] = useState<ContentDraft[]>([]);
  const [draftsLoading, setDraftsLoading] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<ContentDraft | null>(null);
  const [generatingArticle, setGeneratingArticle] = useState<number | null>(null);

  // UI state
  const [viewMode, setViewMode] = useState<'dashboard' | 'results' | 'trends' | 'gaps' | 'drafts' | 'queries' | 'recommendations' | 'leaderboard'>('dashboard');
  const [expandedResult, setExpandedResult] = useState<number | null>(null);
  const [showAddQuery, setShowAddQuery] = useState(false);
  const [newQuery, setNewQuery] = useState('');
  const [generatingContent, setGeneratingContent] = useState<number | null>(null);
  const [expandedTrend, setExpandedTrend] = useState<number | null>(null);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ai-search/monitor?type=all');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch data');
      }
      const data = await response.json();
      setQueries(data.queries || []);
      setResults(data.results || []);
      setSummary(data.summary || null);
      setBrands(data.brands || []);
      setDefaultQueries(data.defaultQueries || []);
      setScannedToday(data.scannedToday || false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch trends data
  const fetchTrends = useCallback(async () => {
    setTrendsLoading(true);
    try {
      const response = await fetch('/api/ai-search/monitor?type=trends&days=30');
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Trends API error:', response.status, errorText);
        throw new Error('Failed to fetch trends');
      }
      const data = await response.json();
      console.log('Trends data received:', { 
        queryTrendsCount: data.queryTrends?.length, 
        brandTrendsCount: data.brandTrends?.length,
        brandTrends: data.brandTrends 
      });
      setQueryTrends(data.queryTrends || []);
      setBrandTrends(data.brandTrends || []);
    } catch (err) {
      console.error('Failed to fetch trends:', err);
    } finally {
      setTrendsLoading(false);
    }
  }, []);

  // Fetch recommendations
  const fetchRecommendations = useCallback(async () => {
    setRecsLoading(true);
    try {
      const response = await fetch('/api/ai-search/monitor?type=recommendations');
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    } finally {
      setRecsLoading(false);
    }
  }, []);

  // Fetch AI Search Profile Scores
  const fetchScores = useCallback(async () => {
    setScoresLoading(true);
    try {
      const response = await fetch('/api/ai-search/monitor?type=scores');
      if (!response.ok) throw new Error('Failed to fetch scores');
      const data = await response.json();
      setScores(data.scores || []);
    } catch (err) {
      console.error('Failed to fetch scores:', err);
    } finally {
      setScoresLoading(false);
    }
  }, []);

  // Run full scan
  const runFullScan = useCallback(async () => {
    setScanning(true);
    setError(null);
    try {
      const response = await fetch('/api/ai-search/monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'scan_all' }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to scan');
      }
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scan');
    } finally {
      setScanning(false);
    }
  }, [fetchData]);

  // Add query
  const addQuery = async () => {
    if (!newQuery.trim()) return;
    try {
      const response = await fetch('/api/ai-search/monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add_query', query: newQuery.trim() }),
      });
      if (!response.ok) throw new Error('Failed to add query');
      setNewQuery('');
      setShowAddQuery(false);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add query');
    }
  };

  // Delete query
  const deleteQuery = async (queryId: number) => {
    try {
      const response = await fetch('/api/ai-search/monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_query', queryId }),
      });
      if (!response.ok) throw new Error('Failed to delete query');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete query');
    }
  };

  // Seed default queries
  const seedDefaults = async () => {
    try {
      const response = await fetch('/api/ai-search/monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'seed_defaults' }),
      });
      if (!response.ok) throw new Error('Failed to seed defaults');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to seed defaults');
    }
  };

  // Generate content for a gap
  // Fetch content drafts
  const fetchDrafts = useCallback(async () => {
    setDraftsLoading(true);
    try {
      const response = await fetch('/api/content/generate');
      if (!response.ok) throw new Error('Failed to fetch drafts');
      const data = await response.json();
      setDrafts(data.drafts || []);
    } catch (err) {
      console.error('Failed to fetch drafts:', err);
    } finally {
      setDraftsLoading(false);
    }
  }, []);

  const generateContent = async (result: AIResult) => {
    setGeneratingContent(result.id);
    try {
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_brief',
          query: result.query_text,
          queryId: result.query_id,
          competitorsMentioned: result.competitors_mentioned,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate content');
      }
      const data = await response.json();
      // Refresh drafts and switch to drafts view
      await fetchDrafts();
      setSelectedDraft(data.draft);
      setViewMode('drafts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content');
    } finally {
      setGeneratingContent(null);
    }
  };

  // Generate full article from brief
  const generateArticle = async (draftId: number) => {
    setGeneratingArticle(draftId);
    try {
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_article', draftId }),
      });
      if (!response.ok) throw new Error('Failed to generate article');
      const data = await response.json();
      // Refresh drafts
      await fetchDrafts();
      setSelectedDraft(data.draft);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate article');
    } finally {
      setGeneratingArticle(null);
    }
  };

  // Update draft status
  const updateDraftStatus = async (draftId: number, status: string, publishedUrl?: string) => {
    try {
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', draftId, status, publishedUrl }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      await fetchDrafts();
      if (selectedDraft?.id === draftId) {
        const data = await response.json();
        setSelectedDraft(data.draft);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  // Delete content
  const deleteDraft = async (draftId: number) => {
    if (!confirm('Delete this content?')) return;
    try {
      await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_draft', draftId }),
      });
      await fetchDrafts();
      if (selectedDraft?.id === draftId) {
        setSelectedDraft(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  // Auto-generate state
  const [autoGenerating, setAutoGenerating] = useState(false);
  const [autoProgress, setAutoProgress] = useState<{ current: number; total: number; status: string } | null>(null);
  const [editingDraft, setEditingDraft] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  // Auto-generate & publish content for gaps (full workflow)
  const autoGenerateAll = async (maxCount = 10) => {
    // Filter gaps that don't have drafts yet
    const gapsWithoutDrafts = contentGaps.filter(g => !getExistingDraft(g.query_text));
    const toProcess = gapsWithoutDrafts.slice(0, maxCount);
    
    if (toProcess.length === 0) {
      setError('No new gaps to generate content for');
      return;
    }

    setAutoGenerating(true);
    setAutoProgress({ current: 0, total: toProcess.length, status: 'Starting...' });

    for (let i = 0; i < toProcess.length; i++) {
      const gap = toProcess[i];
      try {
        setAutoProgress({ current: i + 1, total: toProcess.length, status: `Brief: "${gap.query_text.substring(0, 30)}..."` });
        
        const briefRes = await fetch('/api/content/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'generate_brief', query: gap.query_text, queryId: gap.query_id, competitorsMentioned: gap.competitors_mentioned }),
        });
        if (!briefRes.ok) continue;
        const brief = await briefRes.json();

        setAutoProgress({ current: i + 1, total: toProcess.length, status: `Writing article ${i + 1}/${toProcess.length}...` });
        
        const artRes = await fetch('/api/content/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'generate_article', draftId: brief.draft.id }),
        });
        if (!artRes.ok) continue;
        const art = await artRes.json();

        setAutoProgress({ current: i + 1, total: toProcess.length, status: `Publishing ${i + 1}/${toProcess.length}...` });
        
        await fetch('/api/content/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'update_status', draftId: art.draft.id, status: 'published', publishedUrl: `/resources/${art.draft.slug}` }),
        });
      } catch (err) {
        console.error(`Failed: ${gap.query_text}`, err);
      }
    }

    setAutoProgress({ current: toProcess.length, total: toProcess.length, status: `Done! ${toProcess.length} articles published.` });
    await fetchDrafts();
    setTimeout(() => { setAutoGenerating(false); setAutoProgress(null); }, 3000);
  };

  // Run full daily pipeline
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [pipelineLog, setPipelineLog] = useState<string[]>([]);
  
  const runDailyPipeline = async () => {
    setPipelineRunning(true);
    setPipelineLog(['Starting daily content pipeline...']);
    try {
      const response = await fetch('/api/cron/daily-content', { method: 'POST' });
      const data = await response.json();
      setPipelineLog(data.log || ['Pipeline completed']);
      if (data.success) {
        await fetchData();
        await fetchDrafts();
      }
    } catch (err) {
      setPipelineLog(prev => [...prev, `Error: ${err}`]);
    } finally {
      setPipelineRunning(false);
    }
  };

  // Edit content
  const startEditing = (draft: ContentDraft) => { setEditingDraft(draft.id); setEditContent(draft.content || ''); };
  const cancelEditing = () => { setEditingDraft(null); setEditContent(''); };
  const saveEdit = async () => {
    if (!editingDraft) return;
    try {
      await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_draft', draftId: editingDraft, content: editContent }),
      });
      await fetchDrafts();
      if (selectedDraft?.id === editingDraft) setSelectedDraft({ ...selectedDraft, content: editContent });
      setEditingDraft(null); setEditContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    }
  };

  // Get content gaps (results where Checkit wasn't mentioned)
  const contentGaps = results.filter(r => !r.checkit_mentioned);

  // Load data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Load trends when switching to trends view
  useEffect(() => {
    if (viewMode === 'trends' && queryTrends.length === 0 && !trendsLoading) {
      fetchTrends();
    }
  }, [viewMode, queryTrends.length, trendsLoading, fetchTrends]);

  // Load recommendations when switching to recommendations view
  useEffect(() => {
    if (viewMode === 'recommendations' && recommendations.length === 0 && !recsLoading) {
      fetchRecommendations();
    }
  }, [viewMode, recommendations.length, recsLoading, fetchRecommendations]);

  // Load drafts when switching to drafts view
  useEffect(() => {
    if (viewMode === 'drafts' && drafts.length === 0 && !draftsLoading) {
      fetchDrafts();
    }
  }, [viewMode, drafts.length, draftsLoading, fetchDrafts]);

  // Also load drafts on initial load to mark gaps that have drafts
  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  // Load scores when switching to leaderboard view
  useEffect(() => {
    if ((viewMode === 'leaderboard' || viewMode === 'dashboard') && scores.length === 0 && !scoresLoading) {
      fetchScores();
    }
  }, [viewMode, scores.length, scoresLoading, fetchScores]);

  // Check if a gap already has a draft
  const getExistingDraft = (queryText: string) => {
    return drafts.find(d => d.source_query === queryText);
  };

  // Format mention rate as percentage
  const formatRate = (rate: number) => `${(rate * 100).toFixed(0)}%`;

  // Get trend icon
  const getTrendIcon = (trend: QueryTrend['positionTrend']) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'stable': return <Minus className="w-4 h-4 text-yellow-400" />;
      case 'new': return <Sparkles className="w-4 h-4 text-blue-400" />;
    }
  };

  // Priority color
  const getPriorityColor = (priority: QueryRecommendation['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-gray-500/20 text-gray-400';
    }
  };

  // Category color
  const getCategoryColor = (category: QueryRecommendation['category']) => {
    switch (category) {
      case 'expansion': return 'bg-purple-500/20 text-purple-400';
      case 'competitor': return 'bg-orange-500/20 text-orange-400';
      case 'feature': return 'bg-blue-500/20 text-blue-400';
      case 'use-case': return 'bg-green-500/20 text-green-400';
      case 'comparison': return 'bg-pink-500/20 text-pink-400';
    }
  };

  // Tier styling
  const getTierStyle = (tier: AISearchProfileScore['tier']) => {
    switch (tier) {
      case 'elite': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Elite' };
      case 'strong': return { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Strong' };
      case 'moderate': return { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Moderate' };
      case 'emerging': return { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'Emerging' };
      case 'minimal': return { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Minimal' };
    }
  };

  // Score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-yellow-400';
    if (score >= 50) return 'text-green-400';
    if (score >= 30) return 'text-blue-400';
    if (score >= 15) return 'text-purple-400';
    return 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Bot className="w-7 h-7 text-purple-500" />
              AI Search Monitor
            </h1>
            <p className="text-muted mt-1">
              Track how Checkit appears in AI search results
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={runFullScan}
              disabled={scanning || pipelineRunning || queries.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-surface-elevated text-foreground rounded-lg hover:bg-surface border border-border disabled:opacity-50"
            >
              {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {scanning ? 'Scanning...' : 'Scan Only'}
            </button>
            <button
              onClick={runDailyPipeline}
              disabled={pipelineRunning || scanning}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {pipelineRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {pipelineRunning ? 'Running...' : 'Run Full Pipeline'}
            </button>
          </div>
        </div>

        {/* Pipeline Log */}
        {pipelineLog.length > 0 && (
          <div className="bg-surface border border-border rounded-xl p-4 mb-6 max-h-60 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-foreground">Pipeline Log</h3>
              <button onClick={() => setPipelineLog([])} className="text-xs text-muted hover:text-foreground">Clear</button>
            </div>
            <div className="font-mono text-xs space-y-1">
              {pipelineLog.map((line, i) => (
                <div key={i} className={`${line.startsWith('✓') ? 'text-green-400' : line.startsWith('✗') ? 'text-red-400' : 'text-muted'}`}>
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}

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
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-500 mb-4" />
            <p className="text-muted">Loading AI search data...</p>
          </div>
        )}

        {/* Summary Cards */}
        {!loading && summary && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-muted">Queries Tracked</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{queries.length}</div>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-muted">Total Scans</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{summary.totalScans}</div>
            </div>
            <div className={`bg-surface border rounded-xl p-4 ${summary.checkitMentionRate > 0.5 ? 'border-green-500/50' : summary.checkitMentionRate > 0.2 ? 'border-yellow-500/50' : 'border-red-500/50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className={`w-4 h-4 ${summary.checkitMentionRate > 0.5 ? 'text-green-500' : summary.checkitMentionRate > 0.2 ? 'text-yellow-500' : 'text-red-500'}`} />
                <span className="text-sm text-muted">Checkit Mentions</span>
              </div>
              <div className={`text-2xl font-bold ${summary.checkitMentionRate > 0.5 ? 'text-green-400' : summary.checkitMentionRate > 0.2 ? 'text-yellow-400' : 'text-red-400'}`}>
                {formatRate(summary.checkitMentionRate)}
              </div>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-muted">Avg Position</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {summary.avgPosition ? `#${summary.avgPosition.toFixed(1)}` : '-'}
              </div>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4">
              <div className="text-sm text-muted mb-1">Last Scan</div>
              <div className="text-sm text-foreground">
                {summary.lastScanAt
                  ? new Date(summary.lastScanAt).toLocaleDateString()
                  : 'Never'}
              </div>
            </div>
          </div>
        )}

        {/* View Toggle - Logical progression: Overview → Analysis → Action → Config */}
        {!loading && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {/* Overview */}
            <button
              onClick={() => setViewMode('dashboard')}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                viewMode === 'dashboard'
                  ? 'bg-purple-500 text-white'
                  : 'bg-surface-elevated text-muted hover:text-foreground'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Overview
            </button>
            {/* Queries - what we're monitoring */}
            <button
              onClick={() => setViewMode('queries')}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                viewMode === 'queries'
                  ? 'bg-purple-500 text-white'
                  : 'bg-surface-elevated text-muted hover:text-foreground'
              }`}
            >
              <Target className="w-4 h-4 inline mr-2" />
              Queries ({queries.length})
            </button>
            {/* Results - what we found */}
            <button
              onClick={() => setViewMode('results')}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                viewMode === 'results'
                  ? 'bg-purple-500 text-white'
                  : 'bg-surface-elevated text-muted hover:text-foreground'
              }`}
            >
              <Search className="w-4 h-4 inline mr-2" />
              Results ({results.length})
            </button>
            {/* Trends - analysis over time */}
            <button
              onClick={() => setViewMode('trends')}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                viewMode === 'trends'
                  ? 'bg-purple-500 text-white'
                  : 'bg-surface-elevated text-muted hover:text-foreground'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Trends
            </button>
            {/* Gaps - opportunities */}
            <button
              onClick={() => setViewMode('gaps')}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                viewMode === 'gaps'
                  ? 'bg-red-500 text-white'
                  : 'bg-surface-elevated text-muted hover:text-foreground'
              }`}
            >
              <XCircle className="w-4 h-4 inline mr-2" />
              Gaps ({contentGaps.filter(g => !getExistingDraft(g.query_text)).length})
            </button>
            {/* Content - generated articles */}
            <button
              onClick={() => setViewMode('drafts')}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                viewMode === 'drafts'
                  ? 'bg-blue-500 text-white'
                  : 'bg-surface-elevated text-muted hover:text-foreground'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Content ({drafts.length})
            </button>
            {/* Ideas - suggestions */}
            <button
              onClick={() => setViewMode('recommendations')}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                viewMode === 'recommendations'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-surface-elevated text-muted hover:text-foreground'
              }`}
            >
              <Lightbulb className="w-4 h-4 inline mr-2" />
              Ideas
            </button>
            {/* Scores - leaderboard */}
            <button
              onClick={() => setViewMode('leaderboard')}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                viewMode === 'leaderboard'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-surface-elevated text-muted hover:text-foreground'
              }`}
            >
              <Trophy className="w-4 h-4 inline mr-2" />
              Scores
            </button>
          </div>
        )}

        {/* Dashboard View */}
        {!loading && viewMode === 'dashboard' && (
          <div className="space-y-6">
            {/* Checkit Status Card - Hero */}
            <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-500" />
                  Checkit AI Visibility
                </h3>
                {scores.find(s => s.brand === 'Checkit') && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-purple-400">
                      {scores.find(s => s.brand === 'Checkit')?.totalScore || 0}
                    </span>
                    <span className="text-sm text-muted">/100</span>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Queries - clickable */}
                <button
                  onClick={() => setViewMode('queries')}
                  className="bg-surface/50 rounded-lg p-3 text-center hover:bg-surface/80 transition-colors cursor-pointer"
                >
                  <div className="text-2xl font-bold text-purple-400">
                    {queries.length}
                  </div>
                  <div className="text-xs text-muted">Queries Tracked →</div>
                </button>
                {/* Total Scans - clickable */}
                <button
                  onClick={() => setViewMode('results')}
                  className="bg-surface/50 rounded-lg p-3 text-center hover:bg-surface/80 transition-colors cursor-pointer"
                >
                  <div className="text-2xl font-bold text-blue-400">
                    {summary?.totalScans || 0}
                  </div>
                  <div className="text-xs text-muted">Total Scans →</div>
                </button>
                {/* Checkit Mentions - clickable */}
                <button
                  onClick={() => setViewMode('results')}
                  className="bg-surface/50 rounded-lg p-3 text-center hover:bg-surface/80 transition-colors cursor-pointer"
                >
                  <div className="text-2xl font-bold text-green-400">
                    {summary?.checkitMentions || 0}
                    <span className="text-sm text-muted ml-1">
                      ({summary?.checkitMentionRate ? `${Math.round(summary.checkitMentionRate * 100)}%` : '0%'})
                    </span>
                  </div>
                  <div className="text-xs text-muted">Checkit Mentions →</div>
                </button>
                {/* Content Gaps - clickable */}
                <button
                  onClick={() => setViewMode('gaps')}
                  className="bg-surface/50 rounded-lg p-3 text-center hover:bg-surface/80 transition-colors cursor-pointer"
                >
                  <div className="text-2xl font-bold text-red-400">
                    {contentGaps.filter(g => !getExistingDraft(g.query_text)).length}
                  </div>
                  <div className="text-xs text-muted">Content Gaps →</div>
                </button>
              </div>

              {/* Progress bar */}
              {scores.find(s => s.brand === 'Checkit') && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted mb-1">
                    <span>AI Search Profile Score</span>
                    <span>{scores.find(s => s.brand === 'Checkit')?.tier}</span>
                  </div>
                  <div className="h-2 bg-surface rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
                      style={{ width: `${scores.find(s => s.brand === 'Checkit')?.totalScore || 0}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Brand Rankings in AI Results */}
              <div className="bg-surface border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  Brand Rankings in AI Results
                </h3>
                {summary?.topCompetitors && summary.topCompetitors.length > 0 ? (
                  <div className="space-y-3">
                    {/* Combine Checkit with competitors and sort by mentions */}
                    {[
                      { name: 'Checkit', mentions: summary?.checkitMentions || 0, isOurs: true },
                      ...summary.topCompetitors.map(c => ({ ...c, isOurs: false }))
                    ]
                      .sort((a, b) => b.mentions - a.mentions)
                      .map((comp, i) => (
                        <div key={comp.name} className={`flex items-center justify-between ${comp.isOurs ? 'bg-purple-500/10 -mx-2 px-2 py-1 rounded-lg border border-purple-500/30' : ''}`}>
                          <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              comp.isOurs ? 'bg-purple-500/30 text-purple-400' :
                              i === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                              i === 1 ? 'bg-gray-400/20 text-gray-400' :
                              i === 2 ? 'bg-orange-500/20 text-orange-400' :
                              'bg-surface-elevated text-muted'
                            }`}>
                              {i + 1}
                            </span>
                            <span className={comp.isOurs ? 'text-purple-400 font-semibold' : 'text-foreground'}>
                              {comp.name}
                              {comp.isOurs && <span className="ml-2 text-xs">(You)</span>}
                            </span>
                          </div>
                          <span className={comp.isOurs ? 'text-purple-400 font-semibold' : 'text-muted'}>{comp.mentions} mentions</span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-muted text-center py-8">Run a scan to see competitor data</p>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-surface border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  {queries.length === 0 && (
                    <button
                      onClick={seedDefaults}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Default Queries ({defaultQueries.length})
                    </button>
                  )}
                  <div>
                    <button
                      onClick={runFullScan}
                      disabled={scanning || queries.length === 0}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-surface-elevated border border-border rounded-lg hover:bg-surface text-foreground transition-colors disabled:opacity-50"
                    >
                      {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                      {scanning ? 'Scanning...' : 'Run Full Scan'}
                    </button>
                    {summary?.lastScanAt && (
                      <p className="text-xs text-muted text-center mt-1">
                        Last scan: {new Date(summary.lastScanAt).toLocaleDateString()} at {new Date(summary.lastScanAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => { setViewMode('queries'); setShowAddQuery(true); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-surface-elevated border border-border rounded-lg hover:bg-surface text-foreground transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Custom Query
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results View */}
        {!loading && viewMode === 'results' && (
          <div className="space-y-4">
            {results.length === 0 ? (
              <div className="bg-surface border border-border rounded-xl p-12 text-center">
                <Bot className="w-12 h-12 text-muted mx-auto mb-4" />
                <p className="text-muted mb-4">No scan results yet. Run a scan to see how Checkit appears in AI responses.</p>
                <button
                  onClick={runFullScan}
                  disabled={scanning || queries.length === 0}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
                >
                  Run AI Scan
                </button>
              </div>
            ) : (
              results.map((result) => (
                <div
                  key={result.id}
                  className={`bg-surface border rounded-xl overflow-hidden ${
                    result.checkit_mentioned ? 'border-green-500/50' : 'border-border'
                  }`}
                >
                  <div
                    className="p-4 cursor-pointer hover:bg-surface-elevated transition-colors"
                    onClick={() => setExpandedResult(expandedResult === result.id ? null : result.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {result.checkit_mentioned ? (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                              Checkit mentioned {result.checkit_position && `(#${result.checkit_position})`}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                              <XCircle className="w-3 h-3" />
                              Not mentioned
                            </span>
                          )}
                          <span className="text-xs text-muted">
                            {new Date(result.scanned_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-foreground font-medium">{result.query_text}</p>
                        {result.competitors_mentioned.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {result.competitors_mentioned.slice(0, 5).map((comp) => (
                              <span key={comp} className="px-2 py-0.5 bg-surface-elevated text-muted text-xs rounded">
                                {comp}
                              </span>
                            ))}
                            {result.competitors_mentioned.length > 5 && (
                              <span className="text-xs text-muted">+{result.competitors_mentioned.length - 5} more</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="shrink-0">
                        {expandedResult === result.id ? (
                          <ChevronUp className="w-5 h-5 text-muted" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {expandedResult === result.id && (
                    <div className="border-t border-border p-4 bg-surface-elevated">
                      <h4 className="text-sm font-medium text-muted mb-2">AI Response:</h4>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{result.response}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Content Gaps View */}
        {!loading && viewMode === 'gaps' && (
          <div className="space-y-4">
            {/* Auto-Generate Progress */}
            {autoGenerating && autoProgress && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-purple-400">{autoProgress.status}</span>
                      <span className="text-xs text-purple-400">{autoProgress.current}/{autoProgress.total}</span>
                    </div>
                    <div className="h-2 bg-purple-500/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 transition-all duration-500"
                        style={{ width: `${(autoProgress.current / autoProgress.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Content Opportunities ({contentGaps.filter(g => !getExistingDraft(g.query_text)).length} new)
                  </h3>
                  <p className="text-sm text-red-400/80 mt-1">
                    Auto-generate articles for gaps where Checkit isn&apos;t mentioned.
                  </p>
                </div>
                {contentGaps.filter(g => !getExistingDraft(g.query_text)).length > 0 && (
                  <button
                    onClick={() => autoGenerateAll(10)}
                    disabled={autoGenerating}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 shrink-0"
                  >
                    {autoGenerating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    Auto-Generate All (max 10)
                  </button>
                )}
              </div>
            </div>

            {contentGaps.length === 0 ? (
              <div className="bg-surface border border-border rounded-xl p-12 text-center">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-foreground font-medium mb-2">No content gaps found!</p>
                <p className="text-muted">Checkit is being mentioned in all scanned queries. Great job!</p>
              </div>
            ) : (
              contentGaps.map((result) => {
                const existingDraft = getExistingDraft(result.query_text);
                return (
                <div
                  key={result.id}
                  className={`bg-surface border rounded-xl overflow-hidden ${existingDraft ? 'border-blue-500/30' : 'border-red-500/30'}`}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {existingDraft ? (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                              <FileText className="w-3 h-3" />
                              Draft: {existingDraft.status}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                              <XCircle className="w-3 h-3" />
                              Not mentioned
                            </span>
                          )}
                          <span className="text-xs text-muted">
                            {new Date(result.scanned_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-foreground font-medium mb-2">{result.query_text}</p>
                        {existingDraft && (
                          <p className="text-sm text-blue-400 mb-2">
                            → {existingDraft.title}
                          </p>
                        )}
                        {result.competitors_mentioned.length > 0 && (
                          <div className="mb-3">
                            <span className="text-xs text-muted">Competitors mentioned instead: </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {result.competitors_mentioned.map((comp) => (
                                <span key={comp} className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                                  {comp}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      {existingDraft ? (
                        <button
                          onClick={() => { setSelectedDraft(existingDraft); setViewMode('drafts'); }}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shrink-0"
                        >
                          <Eye className="w-4 h-4" />
                          View Draft
                        </button>
                      ) : (
                        <button
                          onClick={() => generateContent(result)}
                          disabled={generatingContent === result.id}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 shrink-0"
                        >
                          {generatingContent === result.id ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              Generate Content
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    
                    {/* Expandable AI Response */}
                    <button
                      onClick={() => setExpandedResult(expandedResult === result.id ? null : result.id)}
                      className="text-xs text-muted hover:text-foreground mt-2 flex items-center gap-1"
                    >
                      {expandedResult === result.id ? (
                        <>
                          <ChevronUp className="w-3 h-3" />
                          Hide AI response
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3 h-3" />
                          View AI response
                        </>
                      )}
                    </button>
                  </div>
                  
                  {expandedResult === result.id && (
                    <div className="border-t border-border p-4 bg-surface-elevated">
                      <h4 className="text-sm font-medium text-muted mb-2">AI Response (why Checkit wasn&apos;t mentioned):</h4>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{result.response}</p>
                    </div>
                  )}
                </div>
                );
              })
            )}
          </div>
        )}

        {/* Drafts View */}
        {!loading && viewMode === 'drafts' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Drafts List */}
            <div className="lg:col-span-1 space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Content Drafts</h3>
                <button
                  onClick={fetchDrafts}
                  disabled={draftsLoading}
                  className="text-sm text-muted hover:text-foreground"
                >
                  <RefreshCw className={`w-4 h-4 ${draftsLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
              
              {draftsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                </div>
              ) : drafts.length === 0 ? (
                <div className="text-center py-8 text-muted">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No drafts yet.</p>
                  <p className="text-xs mt-1">Generate content from Gaps tab.</p>
                </div>
              ) : (
                drafts.map((draft) => (
                  <button
                    key={draft.id}
                    onClick={() => setSelectedDraft(draft)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedDraft?.id === draft.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-border bg-surface hover:bg-surface-elevated'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs rounded ${
                        draft.status === 'published' ? 'bg-green-500/20 text-green-400' :
                        draft.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        draft.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {draft.status}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground line-clamp-2">{draft.title}</p>
                    <p className="text-xs text-muted mt-1 line-clamp-1">{draft.source_query}</p>
                  </button>
                ))
              )}
            </div>

            {/* Draft Detail */}
            <div className="lg:col-span-2">
              {selectedDraft ? (
                <div className="bg-surface border border-border rounded-xl overflow-hidden">
                  {/* Header */}
                  <div className="p-4 border-b border-border">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 text-xs rounded ${
                            selectedDraft.status === 'published' ? 'bg-green-500/20 text-green-400' :
                            selectedDraft.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                            selectedDraft.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {selectedDraft.status}
                          </span>
                          <span className="text-xs text-muted">
                            {new Date(selectedDraft.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h2 className="text-lg font-semibold text-foreground">{selectedDraft.title}</h2>
                        <p className="text-sm text-muted mt-1">From: &quot;{selectedDraft.source_query}&quot;</p>
                      </div>
                      <button
                        onClick={() => deleteDraft(selectedDraft.id)}
                        className="p-2 text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      {selectedDraft.status === 'brief' && (
                        <button
                          onClick={() => generateArticle(selectedDraft.id)}
                          disabled={generatingArticle === selectedDraft.id}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
                        >
                          {generatingArticle === selectedDraft.id ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Writing...</>
                          ) : (
                            <><Sparkles className="w-4 h-4" /> Generate Article</>
                          )}
                        </button>
                      )}
                      {selectedDraft.content && editingDraft !== selectedDraft.id && (
                        <button
                          onClick={() => startEditing(selectedDraft)}
                          className="flex items-center gap-2 px-4 py-2 bg-surface-elevated text-foreground rounded-lg hover:bg-surface border border-border"
                        >
                          <Edit3 className="w-4 h-4" /> Edit
                        </button>
                      )}
                      {selectedDraft.published_url && (
                        <a
                          href={selectedDraft.published_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover"
                        >
                          <ExternalLink className="w-4 h-4" /> View Live
                        </a>
                      )}
                      {selectedDraft.status !== 'published' && selectedDraft.content && (
                        <button
                          onClick={() => updateDraftStatus(selectedDraft.id, 'published', `/resources/${selectedDraft.slug}`)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          <Send className="w-4 h-4" /> Publish
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 max-h-[60vh] overflow-y-auto">
                    {editingDraft === selectedDraft.id ? (
                      <div className="space-y-4">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full h-96 p-4 bg-surface-elevated border border-border rounded-lg text-foreground text-sm font-mono resize-y"
                          placeholder="Edit content (markdown supported)..."
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={saveEdit}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Save Changes
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="flex items-center gap-2 px-4 py-2 bg-surface-elevated text-foreground rounded-lg hover:bg-surface border border-border"
                          >
                            <X className="w-4 h-4" /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : selectedDraft.content ? (
                      <div className="prose prose-invert max-w-none">
                        <div 
                          className="text-foreground whitespace-pre-wrap text-sm"
                          dangerouslySetInnerHTML={{ 
                            __html: selectedDraft.content
                              .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold mt-6 mb-3 text-foreground">$1</h2>')
                              .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold mt-4 mb-2 text-foreground">$1</h3>')
                              .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\n\n/g, '</p><p class="mb-3">')
                          }}
                        />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted mb-2">Outline:</h4>
                          <ol className="list-decimal list-inside space-y-1 text-sm text-foreground">
                            {(selectedDraft.outline as string[])?.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ol>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted mb-2">Key Points:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
                            {(selectedDraft.key_points as string[])?.map((point, i) => (
                              <li key={i}>{point}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted mb-2">FAQ Questions:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
                            {(selectedDraft.faq_questions as string[])?.map((q, i) => (
                              <li key={i}>{q}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="pt-4 border-t border-border">
                          <p className="text-sm text-muted italic">
                            Click &quot;Generate Full Article&quot; to create the complete content.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-surface border border-border rounded-xl p-12 text-center">
                  <FileText className="w-12 h-12 text-muted mx-auto mb-4" />
                  <p className="text-muted">Select a draft to view details</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Trends View */}
        {!loading && viewMode === 'trends' && (
          <div className="space-y-6">
            {/* Summary Stats - Clickable */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => setViewMode('queries')}
                className="bg-surface border border-border rounded-xl p-4 text-center hover:bg-surface-elevated transition-colors cursor-pointer"
              >
                <div className="text-2xl font-bold text-purple-400">{queries.length}</div>
                <div className="text-xs text-muted">Queries Tracked →</div>
              </button>
              <button
                onClick={() => setViewMode('results')}
                className="bg-surface border border-border rounded-xl p-4 text-center hover:bg-surface-elevated transition-colors cursor-pointer"
              >
                <div className="text-2xl font-bold text-blue-400">{summary?.totalScans || 0}</div>
                <div className="text-xs text-muted">Total Scans →</div>
              </button>
              <button
                onClick={() => setViewMode('results')}
                className="bg-surface border border-border rounded-xl p-4 text-center hover:bg-surface-elevated transition-colors cursor-pointer"
              >
                <div className="text-2xl font-bold text-green-400">
                  {summary?.checkitMentions || 0}
                  <span className="text-sm text-muted ml-1">
                    ({summary?.checkitMentionRate ? `${Math.round(summary.checkitMentionRate * 100)}%` : '0%'})
                  </span>
                </div>
                <div className="text-xs text-muted">Checkit Mentions →</div>
              </button>
              <button
                onClick={() => setViewMode('gaps')}
                className="bg-surface border border-border rounded-xl p-4 text-center hover:bg-surface-elevated transition-colors cursor-pointer"
              >
                <div className="text-2xl font-bold text-red-400">
                  {contentGaps.filter(g => !getExistingDraft(g.query_text)).length}
                </div>
                <div className="text-xs text-muted">Content Gaps →</div>
              </button>
            </div>

            {/* Overall Brand Trend Chart */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-500" />
                  Checkit Mention Rate Over Time
                </h3>
                <button
                  onClick={fetchTrends}
                  disabled={trendsLoading}
                  className="text-sm text-muted hover:text-foreground flex items-center gap-1"
                >
                  <RefreshCw className={`w-4 h-4 ${trendsLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
              
              {trendsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-green-500" />
                </div>
              ) : brandTrends.length === 0 ? (
                <div className="text-center py-12 text-muted">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No trend data yet. Run daily scans to build history.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Debug info */}
                  <div className="text-xs text-muted mb-2">
                    {brandTrends.length} data points | 
                    Sample: {brandTrends[0]?.date} = {formatRate(brandTrends[0]?.mentionRate || 0)} ({brandTrends[0]?.checkitMentions}/{brandTrends[0]?.totalQueries})
                  </div>
                  {/* Simple bar chart */}
                  <div className="flex items-end gap-1 h-40 border-b border-border">
                    {brandTrends.map((point, i) => {
                      // Calculate height - ensure minimum visibility
                      const rate = point.mentionRate || 0;
                      const heightPercent = Math.max(rate * 100, 5); // minimum 5% height for visibility
                      return (
                        <div 
                          key={i} 
                          className="flex-1 min-w-[8px] flex flex-col justify-end h-full"
                        >
                          <div 
                            className="w-full bg-green-500 hover:bg-green-400 transition-colors rounded-t relative group cursor-pointer"
                            style={{ height: `${heightPercent}%`, minHeight: '8px' }}
                          >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-elevated border border-border px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              {formatRate(rate)} ({point.checkitMentions}/{point.totalQueries})
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-muted">
                    <span>{brandTrends[0]?.date}</span>
                    <span>{brandTrends[brandTrends.length - 1]?.date}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Per-Query Trends */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-500" />
                Query Performance Trends
              </h3>
              
              {queryTrends.length === 0 ? (
                <div className="text-center py-8 text-muted">
                  Run scans over multiple days to see query-level trends.
                </div>
              ) : (
                <div className="space-y-3">
                  {queryTrends.map((trend) => (
                    <div key={trend.queryId} className="border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedTrend(expandedTrend === trend.queryId ? null : trend.queryId)}
                        className="w-full p-4 flex items-center justify-between hover:bg-surface-elevated transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {getTrendIcon(trend.positionTrend)}
                          <span className="text-foreground truncate">{trend.queryText}</span>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right">
                            <div className={`text-sm font-medium ${trend.mentionRate > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {formatRate(trend.mentionRate)}
                            </div>
                            <div className="text-xs text-muted">{trend.dataPoints.length} scans</div>
                          </div>
                          {expandedTrend === trend.queryId ? (
                            <ChevronUp className="w-4 h-4 text-muted" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted" />
                          )}
                        </div>
                      </button>
                      
                      {expandedTrend === trend.queryId && (
                        <div className="border-t border-border p-4 bg-surface-elevated">
                          {/* Mini sparkline */}
                          <div className="mb-4">
                            <div className="text-xs text-muted mb-2">Mention history (last {trend.dataPoints.length} scans):</div>
                            <div className="flex gap-1">
                              {trend.dataPoints.map((dp, i) => (
                                <div
                                  key={i}
                                  className={`w-4 h-4 rounded-sm ${dp.checkitMentioned ? 'bg-green-500' : 'bg-red-500/30'}`}
                                  title={`${dp.date}: ${dp.checkitMentioned ? 'Mentioned' : 'Not mentioned'}`}
                                />
                              ))}
                            </div>
                          </div>
                          
                          {/* Competitors on this query */}
                          {Object.keys(trend.competitorFrequency).length > 0 && (
                            <div>
                              <div className="text-xs text-muted mb-2">Competitors mentioned:</div>
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(trend.competitorFrequency)
                                  .sort((a, b) => b[1] - a[1])
                                  .slice(0, 5)
                                  .map(([comp, count]) => (
                                    <span key={comp} className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded">
                                      {comp} ({count}x)
                                    </span>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Daily Scan Reminder */}
            <div className={`rounded-xl p-4 ${scannedToday ? 'bg-green-500/10 border border-green-500/30' : 'bg-yellow-500/10 border border-yellow-500/30'}`}>
              <div className="flex items-center gap-3">
                <Clock className={`w-5 h-5 ${scannedToday ? 'text-green-400' : 'text-yellow-400'}`} />
                <div>
                  <p className={`font-medium ${scannedToday ? 'text-green-400' : 'text-yellow-400'}`}>
                    {scannedToday ? 'Daily scan completed' : 'No scan today'}
                  </p>
                  <p className="text-sm text-muted">
                    {scannedToday 
                      ? 'Check back tomorrow for updated trend data.' 
                      : 'Run a scan to track today\'s AI search results.'}
                  </p>
                </div>
                {!scannedToday && (
                  <button
                    onClick={runFullScan}
                    disabled={scanning}
                    className="ml-auto px-4 py-2 bg-yellow-500 text-black rounded-lg text-sm font-medium hover:bg-yellow-400"
                  >
                    {scanning ? 'Scanning...' : 'Run Scan'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recommendations View */}
        {!loading && viewMode === 'recommendations' && (
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Recommended Queries to Track
                </h3>
                <button
                  onClick={fetchRecommendations}
                  disabled={recsLoading}
                  className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500 text-black rounded-lg text-sm font-medium hover:bg-yellow-400 disabled:opacity-50"
                >
                  {recsLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  Generate Ideas
                </button>
              </div>
              
              <p className="text-sm text-muted mb-6">
                AI-generated suggestions for new queries to expand your AI search coverage.
              </p>

              {recsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-yellow-500" />
                  <span className="ml-3 text-muted">Analyzing your queries...</span>
                </div>
              ) : recommendations.length === 0 ? (
                <div className="text-center py-12 text-muted">
                  <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Click &quot;Generate Ideas&quot; to get AI-powered query recommendations.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recommendations.map((rec, i) => (
                    <div key={i} className="border border-border rounded-lg p-4 hover:bg-surface-elevated transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 text-xs rounded ${getPriorityColor(rec.priority)}`}>
                              {rec.priority}
                            </span>
                            <span className={`px-2 py-0.5 text-xs rounded ${getCategoryColor(rec.category)}`}>
                              {rec.category}
                            </span>
                          </div>
                          <p className="font-medium text-foreground mb-1">&quot;{rec.query}&quot;</p>
                          <p className="text-sm text-muted">{rec.rationale}</p>
                        </div>
                        <button
                          onClick={async () => {
                            try {
                              await fetch('/api/ai-search/monitor', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ action: 'add_query', query: rec.query }),
                              });
                              // Remove from recommendations
                              setRecommendations(prev => prev.filter((_, idx) => idx !== i));
                              // Refresh data
                              await fetchData();
                            } catch (err) {
                              console.error('Failed to add query:', err);
                            }
                          }}
                          className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Leaderboard/Scores View */}
        {!loading && viewMode === 'leaderboard' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    AI Search Profile Scores
                  </h3>
                  <p className="text-sm text-muted mt-1">
                    How brands rank in AI search visibility (0-100 scale, benchmarked against industry leaders)
                  </p>
                </div>
                <button
                  onClick={fetchScores}
                  disabled={scoresLoading}
                  className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500 text-black rounded-lg text-sm font-medium hover:bg-yellow-400 disabled:opacity-50"
                >
                  {scoresLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  Refresh
                </button>
              </div>

              {/* Scoring Legend */}
              <div className="flex flex-wrap gap-4 text-xs text-muted mb-4 p-3 bg-surface-elevated rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span>Elite (80+)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Strong (60-79)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span>Moderate (40-59)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span>Emerging (20-39)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500" />
                  <span>Minimal (0-19)</span>
                </div>
              </div>

              {scoresLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-yellow-500" />
                  <span className="ml-3 text-muted">Calculating scores...</span>
                </div>
              ) : scores.length === 0 ? (
                <div className="text-center py-12 text-muted">
                  <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Run AI scans to generate profile scores.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scores.map((score) => {
                    const tierStyle = getTierStyle(score.tier);
                    const isCheckit = score.brand === 'Checkit';
                    const isExpanded = expandedScore === score.brand;
                    
                    return (
                      <div
                        key={score.brand}
                        className={`border rounded-xl overflow-hidden transition-all ${
                          isCheckit ? 'border-accent bg-accent/5' : 'border-border bg-surface'
                        }`}
                      >
                        <button
                          onClick={() => setExpandedScore(isExpanded ? null : score.brand)}
                          className="w-full p-4 flex items-center gap-4 hover:bg-surface-elevated transition-colors"
                        >
                          {/* Rank */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                            score.rank === 1 ? 'bg-yellow-500 text-black' :
                            score.rank === 2 ? 'bg-gray-300 text-black' :
                            score.rank === 3 ? 'bg-orange-400 text-black' :
                            'bg-surface-elevated text-muted'
                          }`}>
                            {score.rank}
                          </div>

                          {/* Brand & Tier */}
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2">
                              <span className={`font-semibold ${isCheckit ? 'text-accent' : 'text-foreground'}`}>
                                {score.brand}
                              </span>
                              {isCheckit && <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded">You</span>}
                              <span className={`text-xs px-2 py-0.5 rounded ${tierStyle.bg} ${tierStyle.text}`}>
                                {tierStyle.label}
                              </span>
                            </div>
                          </div>

                          {/* Score */}
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getScoreColor(score.totalScore)}`}>
                              {score.totalScore}
                            </div>
                            <div className="text-xs text-muted">/ 100</div>
                          </div>

                          {/* Expand icon */}
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-muted" /> : <ChevronDown className="w-5 h-5 text-muted" />}
                        </button>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="border-t border-border p-4 bg-surface-elevated">
                            <div className="grid grid-cols-5 gap-4">
                              {Object.entries(score.components).map(([key, comp]) => (
                                <div key={key} className="text-center">
                                  <div className="text-xs text-muted mb-1">{comp.label}</div>
                                  <div className="text-lg font-semibold text-foreground">
                                    {comp.score}<span className="text-xs text-muted">/{comp.maxScore}</span>
                                  </div>
                                  <div className="text-xs text-muted">
                                    {comp.value !== null ? `${comp.value}%` : 'N/A'}
                                  </div>
                                  {/* Progress bar */}
                                  <div className="h-1 bg-surface rounded-full mt-2 overflow-hidden">
                                    <div 
                                      className="h-full bg-accent transition-all"
                                      style={{ width: `${(comp.score / comp.maxScore) * 100}%` }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Benchmark Reference */}
            <div className="bg-surface border border-border rounded-xl p-4">
              <h4 className="text-sm font-medium text-muted mb-3">Score Benchmarks (for reference)</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="p-3 bg-surface-elevated rounded-lg">
                  <div className="text-yellow-400 font-bold">95-100</div>
                  <div className="text-muted">Google, Microsoft (universal recognition)</div>
                </div>
                <div className="p-3 bg-surface-elevated rounded-lg">
                  <div className="text-green-400 font-bold">70-85</div>
                  <div className="text-muted">Salesforce, HubSpot (category leaders)</div>
                </div>
                <div className="p-3 bg-surface-elevated rounded-lg">
                  <div className="text-blue-400 font-bold">40-60</div>
                  <div className="text-muted">Established B2B tools</div>
                </div>
                <div className="p-3 bg-surface-elevated rounded-lg">
                  <div className="text-purple-400 font-bold">15-35</div>
                  <div className="text-muted">Niche/emerging players</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Queries View */}
        {!loading && viewMode === 'queries' && (
          <div className="space-y-6">
            {/* Query Discovery */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
              <h3 className="font-medium text-purple-400 mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                How to Find Relevant Queries
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-surface rounded-lg">
                  <div className="font-medium text-foreground mb-1">1. Default Templates</div>
                  <p className="text-muted text-xs mb-2">Industry-standard questions buyers ask AI assistants</p>
                  <button
                    onClick={seedDefaults}
                    disabled={queries.length > 0}
                    className="text-xs text-purple-400 hover:text-purple-300 disabled:opacity-50"
                  >
                    {queries.length > 0 ? '✓ Already added' : '→ Add defaults'}
                  </button>
                </div>
                <div className="p-3 bg-surface rounded-lg">
                  <div className="font-medium text-foreground mb-1">2. AI Recommendations</div>
                  <p className="text-muted text-xs mb-2">AI suggests queries based on gaps and competitors</p>
                  <button
                    onClick={() => setViewMode('recommendations')}
                    className="text-xs text-purple-400 hover:text-purple-300"
                  >
                    → Go to Ideas tab
                  </button>
                </div>
                <div className="p-3 bg-surface rounded-lg">
                  <div className="font-medium text-foreground mb-1">3. Search Console</div>
                  <p className="text-muted text-xs mb-2">Convert real search traffic into AI monitoring queries</p>
                  <button
                    onClick={() => window.open('/search-console', '_blank')}
                    className="text-xs text-purple-400 hover:text-purple-300"
                  >
                    → View Search Console
                  </button>
                </div>
              </div>
            </div>

            {/* Current Queries */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Monitored Queries ({queries.length})</h3>
                <button
                  onClick={() => setShowAddQuery(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600"
                >
                  <Plus className="w-4 h-4" />
                  Add Custom Query
                </button>
              </div>

              {queries.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-muted mx-auto mb-4" />
                  <p className="text-muted mb-4">No queries configured yet</p>
                  <button
                    onClick={seedDefaults}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                  >
                    Add Default Queries (18)
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {queries.map((q) => (
                    <div
                      key={q.id}
                      className="flex items-center justify-between p-3 bg-surface-elevated rounded-lg"
                    >
                      <span className="text-foreground">{q.query}</span>
                      <button
                        onClick={() => deleteQuery(q.id)}
                        className="p-2 text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Query Modal */}
            {showAddQuery && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Add Query to Monitor</h3>
                    <button
                      onClick={() => setShowAddQuery(false)}
                      className="p-2 text-muted hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-muted mb-1">Query</label>
                      <input
                        type="text"
                        value={newQuery}
                        onChange={(e) => setNewQuery(e.target.value)}
                        placeholder="e.g., What is the best temperature monitoring software?"
                        className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-foreground"
                      />
                      <p className="text-xs text-muted mt-1">
                        Enter a question someone might ask an AI assistant
                      </p>
                    </div>
                    <button
                      onClick={addQuery}
                      disabled={!newQuery.trim()}
                      className="w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
                    >
                      Add Query
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
