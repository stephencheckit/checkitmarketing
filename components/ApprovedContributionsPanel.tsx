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

// Contributed insight stored in document versions
interface ContributedInsight {
  contributionId: number;
  contributorName: string | null;
  isAnonymous: boolean;
  content: string;
  contributionType: 'intel' | 'suggestion' | 'question' | 'correction';
  targetSection: string | null;
  addedAt: string;
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
  const [insights, setInsights] = useState<ContributedInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    fetchInsights();
    
    // Listen for contribution updates to refresh
    const handleContributionUpdate = () => {
      fetchInsights();
    };
    window.addEventListener('contribution-updated', handleContributionUpdate);
    return () => {
      window.removeEventListener('contribution-updated', handleContributionUpdate);
    };
  }, [targetType]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      
      // Fetch from the appropriate document API to get contributedInsights
      const endpoint = targetType === 'positioning' 
        ? '/api/positioning' 
        : targetType === 'competitors' 
        ? '/api/battlecard' 
        : null;
      
      if (!endpoint) {
        setInsights([]);
        return;
      }
      
      const response = await fetch(endpoint);
      const result = await response.json();
      
      if (response.ok && result.data?.contributedInsights) {
        // Sort by addedAt descending (newest first)
        const sortedInsights = [...result.data.contributedInsights].sort(
          (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
        );
        setInsights(sortedInsights);
      } else {
        setInsights([]);
      }
    } catch (error) {
      console.error('Failed to fetch insights:', error);
      setInsights([]);
    } finally {
      setLoading(false);
    }
  };

  const copyContent = async (insight: ContributedInsight) => {
    try {
      await navigator.clipboard.writeText(insight.content);
      setCopiedId(insight.contributionId);
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

  if (insights.length === 0) {
    return null; // Don't show panel if no insights
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
              {insights.length} insight{insights.length !== 1 ? 's' : ''} incorporated into this version
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
          {insights.map((insight) => (
            <div 
              key={insight.contributionId}
              className="bg-surface border border-border rounded-lg p-3"
            >
              {/* Meta row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs">
                  {insight.isAnonymous ? (
                    <Users className="w-3 h-3 text-muted" />
                  ) : (
                    <User className="w-3 h-3 text-muted" />
                  )}
                  <span className="text-muted">
                    {insight.isAnonymous 
                      ? 'Anonymous' 
                      : insight.contributorName || 'Team member'
                    }
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-xs ${typeColors[insight.contributionType]}`}>
                    {insight.contributionType}
                  </span>
                  {insight.targetSection && (
                    <span className="text-muted">• {insight.targetSection}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted">
                  <Clock className="w-3 h-3" />
                  {formatDate(insight.addedAt)}
                </div>
              </div>

              {/* Content */}
              <p className="text-sm text-foreground whitespace-pre-wrap mb-2">
                {insight.content}
              </p>

              {/* Copy button */}
              <button
                onClick={() => copyContent(insight)}
                className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
              >
                {copiedId === insight.contributionId ? (
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
