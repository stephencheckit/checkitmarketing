'use client';

import { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  ChevronDown, 
  ChevronUp,
  User,
  Users,
  Check,
  Copy,
  Clock
} from 'lucide-react';

interface Contribution {
  id: number;
  user_name: string | null;
  user_email: string | null;
  target_type: 'positioning' | 'competitors' | 'content';
  target_section: string | null;
  contribution_type: 'intel' | 'suggestion' | 'question' | 'correction';
  content: string;
  is_anonymous: boolean;
  status: 'approved' | 'auto_published';
  created_at: string;
}

interface ApprovedContributionsPanelProps {
  targetType: 'positioning' | 'competitors' | 'content';
  className?: string;
}

const typeColors = {
  intel: 'text-green-400 bg-green-500/10',
  suggestion: 'text-blue-400 bg-blue-500/10',
  question: 'text-yellow-400 bg-yellow-500/10',
  correction: 'text-red-400 bg-red-500/10',
};

export default function ApprovedContributionsPanel({ 
  targetType,
  className = ''
}: ApprovedContributionsPanelProps) {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    fetchContributions();
  }, [targetType]);

  const fetchContributions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/contributions?view=approved-for-target&targetType=${targetType}`
      );
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

  const copyContent = async (contribution: Contribution) => {
    try {
      await navigator.clipboard.writeText(contribution.content);
      setCopiedId(contribution.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      console.error('Failed to copy');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return null; // Don't show anything while loading
  }

  if (contributions.length === 0) {
    return null; // Don't show panel if no contributions
  }

  return (
    <div className={`bg-success/5 border border-success/20 rounded-xl ${className}`}>
      {/* Header - clickable to expand */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-success/10 rounded-lg">
            <Lightbulb className="w-5 h-5 text-success" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">
              Team Contributions
            </h3>
            <p className="text-xs text-muted">
              {contributions.length} approved insight{contributions.length !== 1 ? 's' : ''} to incorporate
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted" />
        )}
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-success/20 p-4 space-y-3 max-h-96 overflow-y-auto">
          {contributions.map((contribution) => (
            <div 
              key={contribution.id}
              className="bg-surface border border-border rounded-lg p-3"
            >
              {/* Meta row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs">
                  {contribution.is_anonymous ? (
                    <Users className="w-3 h-3 text-muted" />
                  ) : (
                    <User className="w-3 h-3 text-muted" />
                  )}
                  <span className="text-muted">
                    {contribution.is_anonymous 
                      ? 'Anonymous' 
                      : contribution.user_name || contribution.user_email
                    }
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-xs ${typeColors[contribution.contribution_type]}`}>
                    {contribution.contribution_type}
                  </span>
                  {contribution.target_section && (
                    <span className="text-muted">• {contribution.target_section}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted">
                  <Clock className="w-3 h-3" />
                  {formatDate(contribution.created_at)}
                </div>
              </div>

              {/* Content */}
              <p className="text-sm text-foreground whitespace-pre-wrap mb-2">
                {contribution.content}
              </p>

              {/* Copy button */}
              <button
                onClick={() => copyContent(contribution)}
                className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
              >
                {copiedId === contribution.id ? (
                  <>
                    <Check className="w-3 h-3 text-success" />
                    <span className="text-success">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy to use</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
