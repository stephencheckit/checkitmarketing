'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  FileText,
  Sparkles,
  Trash2,
  Edit3,
  Eye,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  RefreshCw,
  ExternalLink,
  X,
  Bot,
  Target,
} from 'lucide-react';

// Types
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

interface DraftSummary {
  total: number;
  ideas: number;
  briefs: number;
  drafts: number;
  inReview: number;
  approved: number;
  published: number;
}

const statusConfig: Record<ContentDraft['status'], { label: string; color: string; icon: typeof Clock }> = {
  idea: { label: 'Idea', color: 'bg-gray-500/20 text-gray-400', icon: Target },
  brief: { label: 'Brief', color: 'bg-blue-500/20 text-blue-400', icon: FileText },
  draft: { label: 'Draft', color: 'bg-yellow-500/20 text-yellow-400', icon: Edit3 },
  review: { label: 'In Review', color: 'bg-purple-500/20 text-purple-400', icon: Eye },
  approved: { label: 'Approved', color: 'bg-green-500/20 text-green-400', icon: CheckCircle2 },
  published: { label: 'Published', color: 'bg-accent/20 text-accent', icon: Send },
};

export default function AIContentDraftsPage() {
  // State
  const [drafts, setDrafts] = useState<ContentDraft[]>([]);
  const [summary, setSummary] = useState<DraftSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [filterStatus, setFilterStatus] = useState<ContentDraft['status'] | 'all'>('all');
  const [expandedDraft, setExpandedDraft] = useState<number | null>(null);
  const [selectedDraft, setSelectedDraft] = useState<ContentDraft | null>(null);
  const [generating, setGenerating] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = filterStatus === 'all' 
        ? '/api/content/generate' 
        : `/api/content/generate?status=${filterStatus}`;
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch drafts');
      }
      const data = await response.json();
      setDrafts(data.drafts || []);
      setSummary(data.summary || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch drafts');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  // Generate full article
  const generateArticle = async (draftId: number) => {
    setGenerating(draftId);
    setError(null);
    try {
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_article', draftId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate article');
      }
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate article');
    } finally {
      setGenerating(null);
    }
  };

  // Update status
  const updateStatus = async (draftId: number, newStatus: ContentDraft['status']) => {
    try {
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', draftId, status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  // Delete draft
  const deleteDraft = async (draftId: number) => {
    if (!confirm('Are you sure you want to delete this draft?')) return;
    try {
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_draft', draftId }),
      });
      if (!response.ok) throw new Error('Failed to delete draft');
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete draft');
    }
  };

  // Load data on mount and when filter changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter drafts
  const filteredDrafts = filterStatus === 'all' 
    ? drafts 
    : drafts.filter(d => d.status === filterStatus);

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/content" className="text-muted hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <Bot className="w-7 h-7 text-purple-500" />
                AI Content Drafts
              </h1>
            </div>
            <p className="text-muted">
              Content generated from AI search gaps
            </p>
          </div>
          <Link
            href="/ai-search"
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Find More Gaps
          </Link>
        </div>

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

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-3 md:grid-cols-7 gap-3 mb-6">
            {Object.entries(statusConfig).map(([status, config]) => {
              const count = summary[status === 'inReview' ? 'inReview' : status as keyof DraftSummary] as number || 0;
              const Icon = config.icon;
              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status as ContentDraft['status'])}
                  className={`p-3 rounded-xl border transition-all ${
                    filterStatus === status
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-border bg-surface hover:border-purple-500/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-1 ${filterStatus === status ? 'text-purple-400' : 'text-muted'}`} />
                  <div className="text-lg font-bold text-foreground">{count}</div>
                  <div className="text-xs text-muted">{config.label}</div>
                </button>
              );
            })}
            <button
              onClick={() => setFilterStatus('all')}
              className={`p-3 rounded-xl border transition-all ${
                filterStatus === 'all'
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-border bg-surface hover:border-purple-500/50'
              }`}
            >
              <FileText className={`w-4 h-4 mb-1 ${filterStatus === 'all' ? 'text-purple-400' : 'text-muted'}`} />
              <div className="text-lg font-bold text-foreground">{summary.total}</div>
              <div className="text-xs text-muted">All</div>
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-surface border border-border rounded-xl p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-500 mb-4" />
            <p className="text-muted">Loading content drafts...</p>
          </div>
        )}

        {/* Drafts List */}
        {!loading && (
          <div className="space-y-4">
            {filteredDrafts.length === 0 ? (
              <div className="bg-surface border border-border rounded-xl p-12 text-center">
                <FileText className="w-12 h-12 text-muted mx-auto mb-4" />
                <p className="text-muted mb-4">
                  {filterStatus === 'all'
                    ? 'No content drafts yet. Generate content from AI Search gaps.'
                    : `No drafts with status "${statusConfig[filterStatus as ContentDraft['status']]?.label}"`}
                </p>
                <Link
                  href="/ai-search"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  <Sparkles className="w-4 h-4" />
                  Go to AI Search Monitor
                </Link>
              </div>
            ) : (
              filteredDrafts.map((draft) => {
                const statusInfo = statusConfig[draft.status];
                const StatusIcon = statusInfo.icon;
                const isExpanded = expandedDraft === draft.id;

                return (
                  <div
                    key={draft.id}
                    className="bg-surface border border-border rounded-xl overflow-hidden"
                  >
                    {/* Draft Header */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${statusInfo.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusInfo.label}
                            </span>
                            <span className="text-xs text-muted">
                              {new Date(draft.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="font-medium text-foreground mb-1">{draft.title}</h3>
                          <p className="text-sm text-muted">
                            Source: &quot;{draft.source_query}&quot;
                          </p>
                          {draft.target_keywords && (draft.target_keywords as string[]).length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {(draft.target_keywords as string[]).slice(0, 4).map((kw, i) => (
                                <span key={i} className="px-2 py-0.5 bg-surface-elevated text-muted text-xs rounded">
                                  {kw}
                                </span>
                              ))}
                              {(draft.target_keywords as string[]).length > 4 && (
                                <span className="text-xs text-muted">+{(draft.target_keywords as string[]).length - 4} more</span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          {draft.status === 'brief' && (
                            <button
                              onClick={() => generateArticle(draft.id)}
                              disabled={generating === draft.id}
                              className="flex items-center gap-2 px-3 py-1.5 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 disabled:opacity-50"
                            >
                              {generating === draft.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-4 h-4" />
                                  Generate Article
                                </>
                              )}
                            </button>
                          )}
                          {draft.status === 'draft' && (
                            <>
                              <button
                                onClick={() => { setSelectedDraft(draft); setShowPreview(true); }}
                                className="flex items-center gap-1 px-3 py-1.5 bg-surface-elevated text-foreground rounded-lg text-sm hover:bg-surface"
                              >
                                <Eye className="w-4 h-4" />
                                Preview
                              </button>
                              <button
                                onClick={() => updateStatus(draft.id, 'review')}
                                className="flex items-center gap-1 px-3 py-1.5 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600"
                              >
                                <Send className="w-4 h-4" />
                                Submit for Review
                              </button>
                            </>
                          )}
                          {draft.status === 'review' && (
                            <button
                              onClick={() => updateStatus(draft.id, 'approved')}
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Approve
                            </button>
                          )}
                          {draft.status === 'approved' && (
                            <button
                              onClick={async () => {
                                const publishedUrl = `/resources/${draft.slug}`;
                                await updateStatus(draft.id, 'published');
                                // Update with the published URL
                                await fetch('/api/content/generate', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ 
                                    action: 'update_status', 
                                    draftId: draft.id, 
                                    status: 'published',
                                    publishedUrl 
                                  }),
                                });
                                await fetchData();
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 bg-accent text-white rounded-lg text-sm hover:bg-accent-hover"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Publish
                            </button>
                          )}
                          {draft.status === 'published' && draft.published_url && (
                            <a
                              href={draft.published_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-3 py-1.5 bg-surface-elevated text-foreground rounded-lg text-sm hover:bg-surface"
                            >
                              <ExternalLink className="w-4 h-4" />
                              View Live
                            </a>
                          )}
                          <button
                            onClick={() => deleteDraft(draft.id)}
                            className="p-2 text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setExpandedDraft(isExpanded ? null : draft.id)}
                            className="p-2 text-muted hover:text-foreground"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t border-border p-4 bg-surface-elevated space-y-4">
                        {/* Outline */}
                        {draft.outline && (draft.outline as string[]).length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-muted mb-2">Article Outline:</h4>
                            <ol className="list-decimal list-inside space-y-1 text-sm text-foreground">
                              {(draft.outline as string[]).map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {/* Key Points */}
                        {draft.key_points && (draft.key_points as string[]).length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-muted mb-2">Key Points:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
                              {(draft.key_points as string[]).map((point, i) => (
                                <li key={i}>{point}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* FAQ Questions */}
                        {draft.faq_questions && (draft.faq_questions as string[]).length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-muted mb-2">FAQ Questions:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
                              {(draft.faq_questions as string[]).map((q, i) => (
                                <li key={i}>{q}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Content Preview */}
                        {draft.content && (
                          <div>
                            <h4 className="text-sm font-medium text-muted mb-2">Content Preview:</h4>
                            <div className="p-4 bg-surface rounded-lg max-h-60 overflow-y-auto">
                              <p className="text-sm text-foreground whitespace-pre-wrap">
                                {draft.content.substring(0, 1000)}
                                {draft.content.length > 1000 && '...'}
                              </p>
                            </div>
                            <button
                              onClick={() => { setSelectedDraft(draft); setShowPreview(true); }}
                              className="mt-2 text-sm text-purple-400 hover:text-purple-300"
                            >
                              View Full Content →
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Full Preview Modal */}
        {showPreview && selectedDraft && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-surface border border-border rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">{selectedDraft.title}</h3>
                <button
                  onClick={() => { setShowPreview(false); setSelectedDraft(null); }}
                  className="p-2 text-muted hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {selectedDraft.meta_description && (
                  <div className="mb-4 p-3 bg-surface-elevated rounded-lg">
                    <p className="text-xs text-muted mb-1">Meta Description:</p>
                    <p className="text-sm text-foreground">{selectedDraft.meta_description}</p>
                  </div>
                )}
                <div className="prose prose-invert max-w-none">
                  <div 
                    className="text-foreground whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ 
                      __html: selectedDraft.content?.replace(/^## /gm, '<h2 class="text-xl font-bold mt-6 mb-3">').replace(/^### /gm, '<h3 class="text-lg font-semibold mt-4 mb-2">').replace(/\n/g, '<br/>') || 'No content generated yet.' 
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 p-4 border-t border-border">
                {selectedDraft.status === 'draft' && (
                  <button
                    onClick={() => {
                      updateStatus(selectedDraft.id, 'review');
                      setShowPreview(false);
                      setSelectedDraft(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                  >
                    <Send className="w-4 h-4" />
                    Submit for Review
                  </button>
                )}
                <button
                  onClick={() => { setShowPreview(false); setSelectedDraft(null); }}
                  className="px-4 py-2 bg-surface-elevated text-foreground rounded-lg hover:bg-surface"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
