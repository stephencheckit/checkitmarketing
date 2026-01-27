'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Layers, 
  Zap,
  Target,
  Building2,
  FileText,
  ChevronDown,
  ChevronUp,
  User,
  Users,
  MessageSquare,
  RefreshCw,
  Filter
} from 'lucide-react';

interface Contribution {
  id: number;
  user_id: number | null;
  user_name: string | null;
  user_email: string | null;
  target_type: 'positioning' | 'competitors' | 'content';
  target_section: string | null;
  contribution_type: 'intel' | 'suggestion' | 'question' | 'correction';
  content: string;
  is_anonymous: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'clustered' | 'auto_published';
  reviewer_name: string | null;
  review_notes: string | null;
  reviewed_at: string | null;
  created_at: string;
}

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  approved: { label: 'Approved', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  clustered: { label: 'Clustered', icon: Layers, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  auto_published: { label: 'Auto-Published', icon: Zap, color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/30' },
};

const targetConfig = {
  positioning: { label: 'Positioning', icon: Target, color: 'text-blue-400' },
  competitors: { label: 'Competitors', icon: Building2, color: 'text-orange-400' },
  content: { label: 'Content', icon: FileText, color: 'text-purple-400' },
};

const typeConfig = {
  intel: { label: 'Intel', color: 'text-green-400', bg: 'bg-green-500/10' },
  suggestion: { label: 'Suggestion', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  question: { label: 'Question', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  correction: { label: 'Correction', color: 'text-red-400', bg: 'bg-red-500/10' },
};

export default function AdminContributionsPage() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [reviewNotes, setReviewNotes] = useState<Record<number, string>>({});
  const [processing, setProcessing] = useState<number | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const fetchContributions = useCallback(async () => {
    try {
      setLoading(true);
      const view = filter === 'pending' ? 'pending' : 'all';
      const response = await fetch(`/api/contributions?view=${view}`);
      const data = await response.json();
      if (response.ok) {
        setContributions(data.contributions || []);
      }
    } catch (error) {
      console.error('Failed to fetch contributions:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchContributions();
  }, [fetchContributions]);

  const handleReview = async (id: number, status: 'approved' | 'rejected') => {
    setProcessing(id);
    setReviewError(null);
    try {
      const response = await fetch(`/api/contributions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          reviewNotes: reviewNotes[id] || undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${status} contribution`);
      }

      // Remove from list or update status
      if (filter === 'pending') {
        setContributions(prev => prev.filter(c => c.id !== id));
      } else {
        fetchContributions();
      }
      setExpandedId(null);
      setReviewNotes(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (error) {
      console.error('Failed to review contribution:', error);
      setReviewError(error instanceof Error ? error.message : 'Failed to review contribution');
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pendingCount = contributions.filter(c => c.status === 'pending').length;

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <MessageSquare className="w-7 h-7 text-accent" />
              Contribution Review
            </h1>
            <p className="text-sm text-muted mt-1">
              Review and manage team contributions • {pendingCount} pending
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Filter Toggle */}
            <div className="flex items-center bg-surface-elevated rounded-lg p-1">
              <button
                onClick={() => setFilter('pending')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors cursor-pointer ${
                  filter === 'pending' 
                    ? 'bg-accent text-white' 
                    : 'text-muted hover:text-foreground'
                }`}
              >
                <Clock className="w-4 h-4" />
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setFilter('all')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors cursor-pointer ${
                  filter === 'all' 
                    ? 'bg-accent text-white' 
                    : 'text-muted hover:text-foreground'
                }`}
              >
                <Filter className="w-4 h-4" />
                All
              </button>
            </div>
            
            <button
              onClick={fetchContributions}
              className="p-2 text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-accent" />
          </div>
        )}

        {/* Empty State */}
        {!loading && contributions.length === 0 && (
          <div className="text-center py-16 bg-surface border border-border rounded-xl">
            <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {filter === 'pending' ? 'All caught up!' : 'No contributions yet'}
            </h2>
            <p className="text-muted">
              {filter === 'pending' 
                ? 'There are no pending contributions to review.'
                : 'No contributions have been submitted yet.'
              }
            </p>
          </div>
        )}

        {/* Contributions List */}
        {!loading && contributions.length > 0 && (
          <div className="space-y-3">
            {contributions.map((contribution) => {
              const status = statusConfig[contribution.status];
              const target = targetConfig[contribution.target_type];
              const type = typeConfig[contribution.contribution_type];
              const StatusIcon = status.icon;
              const TargetIcon = target.icon;
              const isExpanded = expandedId === contribution.id;
              const isProcessing = processing === contribution.id;

              return (
                <div
                  key={contribution.id}
                  className={`bg-surface border rounded-xl overflow-hidden ${status.border}`}
                >
                  {/* Header */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : contribution.id)}
                    className="w-full p-4 flex items-start justify-between text-left hover:bg-surface-elevated/50 transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className={`p-2 rounded-lg ${status.bg}`}>
                        <StatusIcon className={`w-4 h-4 ${status.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        {/* Meta row */}
                        <div className="flex items-center gap-2 flex-wrap text-xs mb-1">
                          <span className={`flex items-center gap-1 ${target.color}`}>
                            <TargetIcon className="w-3 h-3" />
                            {target.label}
                          </span>
                          {contribution.target_section && (
                            <span className="text-muted">• {contribution.target_section}</span>
                          )}
                          <span className={`px-1.5 py-0.5 rounded ${type.bg} ${type.color}`}>
                            {type.label}
                          </span>
                          <span className="text-muted">{formatDate(contribution.created_at)}</span>
                        </div>
                        
                        {/* Content preview */}
                        <p className="text-foreground text-sm line-clamp-2">
                          {contribution.content}
                        </p>
                        
                        {/* Contributor */}
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted">
                          {contribution.is_anonymous ? (
                            <Users className="w-3 h-3" />
                          ) : (
                            <User className="w-3 h-3" />
                          )}
                          <span>
                            {contribution.is_anonymous 
                              ? 'Anonymous' 
                              : contribution.user_name || contribution.user_email
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <span className={`text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-border">
                      {/* Full Content */}
                      <div className="p-4 bg-surface-elevated/30">
                        <p className="text-sm text-muted uppercase mb-2">Full Content</p>
                        <p className="text-foreground whitespace-pre-wrap">
                          {contribution.content}
                        </p>
                      </div>

                      {/* Actions for pending */}
                      {contribution.status === 'pending' && (
                        <div className="p-4 space-y-4">
                          {/* Review Notes */}
                          <div>
                            <label className="block text-sm font-medium text-muted mb-2">
                              Review Notes (optional)
                            </label>
                            <textarea
                              value={reviewNotes[contribution.id] || ''}
                              onChange={(e) => setReviewNotes(prev => ({
                                ...prev,
                                [contribution.id]: e.target.value
                              }))}
                              placeholder="Add feedback for the contributor..."
                              rows={2}
                              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:border-accent resize-none"
                            />
                          </div>

                          {/* Error Message */}
                          {reviewError && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                              {reviewError}
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleReview(contribution.id, 'rejected')}
                              disabled={isProcessing}
                              className="flex items-center gap-2 px-4 py-2 text-sm bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </button>
                            <button
                              onClick={() => handleReview(contribution.id, 'approved')}
                              disabled={isProcessing}
                              className="flex items-center gap-2 px-4 py-2 text-sm bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Review info for already reviewed */}
                      {contribution.status !== 'pending' && contribution.reviewer_name && (
                        <div className="p-4 bg-surface-elevated/50">
                          <p className="text-xs text-muted">
                            Reviewed by {contribution.reviewer_name}
                            {contribution.reviewed_at && ` on ${formatDate(contribution.reviewed_at)}`}
                          </p>
                          {contribution.review_notes && (
                            <p className="text-sm text-foreground mt-1">
                              {contribution.review_notes}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
