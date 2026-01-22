'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Layers, 
  Zap,
  ChevronDown,
  ChevronUp,
  Target,
  Building2,
  FileText
} from 'lucide-react';

interface Contribution {
  id: number;
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

interface MyContributionsProps {
  isOpen: boolean;
  onClose: () => void;
}

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  approved: { label: 'Approved', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
  clustered: { label: 'Clustered', icon: Layers, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  auto_published: { label: 'Published', icon: Zap, color: 'text-accent', bg: 'bg-accent/10' },
};

const targetConfig = {
  positioning: { label: 'Positioning', icon: Target },
  competitors: { label: 'Competitors', icon: Building2 },
  content: { label: 'Content', icon: FileText },
};

export default function MyContributions({ isOpen, onClose }: MyContributionsProps) {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchContributions();
    }
  }, [isOpen]);

  const fetchContributions = async () => {
    try {
      const response = await fetch('/api/contributions?view=my');
      const data = await response.json();
      if (response.ok) {
        setContributions(data.contributions || []);
      }
    } catch (error) {
      console.error('Failed to fetch contributions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal container - centers the modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative bg-surface-elevated border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">My Contributions</h2>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm text-muted hover:text-foreground transition-colors"
          >
            Close
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
          ) : contributions.length === 0 ? (
            <div className="text-center py-12 text-muted">
              <p>You haven&apos;t submitted any contributions yet.</p>
              <p className="text-sm mt-2">Use the &quot;Add Insight&quot; button on any page to contribute.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {contributions.map((contribution) => {
                const status = statusConfig[contribution.status];
                const target = targetConfig[contribution.target_type];
                const StatusIcon = status.icon;
                const TargetIcon = target.icon;
                const isExpanded = expandedId === contribution.id;

                return (
                  <div
                    key={contribution.id}
                    className={`border border-border rounded-lg overflow-hidden ${status.bg}`}
                  >
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : contribution.id)}
                      className="w-full p-4 flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-lg ${status.bg}`}>
                          <StatusIcon className={`w-4 h-4 ${status.color}`} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-sm">
                            <TargetIcon className="w-4 h-4 text-muted" />
                            <span className="text-muted">{target.label}</span>
                            {contribution.target_section && (
                              <>
                                <span className="text-muted/50">&gt;</span>
                                <span className="text-foreground">{contribution.target_section}</span>
                              </>
                            )}
                          </div>
                          <p className="text-foreground truncate mt-1">
                            {contribution.content.substring(0, 60)}
                            {contribution.content.length > 60 ? '...' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
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

                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-border/50 pt-3 space-y-3">
                        <div>
                          <p className="text-xs text-muted uppercase mb-1">Full Content</p>
                          <p className="text-sm text-foreground whitespace-pre-wrap">
                            {contribution.content}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-4 text-xs text-muted">
                          <span>Type: {contribution.contribution_type}</span>
                          <span>Submitted: {formatDate(contribution.created_at)}</span>
                          {contribution.is_anonymous && <span>Anonymous</span>}
                        </div>

                        {contribution.review_notes && (
                          <div className="p-3 bg-surface rounded-lg">
                            <p className="text-xs text-muted uppercase mb-1">
                              Review Notes {contribution.reviewer_name && `(${contribution.reviewer_name})`}
                            </p>
                            <p className="text-sm text-foreground">{contribution.review_notes}</p>
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

        {/* Footer Stats */}
        {!loading && contributions.length > 0 && (
          <div className="border-t border-border p-4 flex gap-4 text-sm text-muted">
            <span>
              {contributions.filter(c => c.status === 'pending').length} pending
            </span>
            <span>
              {contributions.filter(c => c.status === 'approved' || c.status === 'auto_published').length} accepted
            </span>
            <span>
              {contributions.filter(c => c.status === 'rejected').length} rejected
            </span>
          </div>
        )}
        </div>
      </div>
    </div>
  );

  // Use portal to render outside of any stacking context
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  
  return modalContent;
}
