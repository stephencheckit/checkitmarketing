'use client';

import { useState, useEffect } from 'react';
import { Link2, User, Users } from 'lucide-react';

interface Citation {
  id: number;
  contributionId: number | null;
  clusterId: number | null;
  contributorName: string | null;
  isAnonymous: boolean;
  content: string | null;
  clusterName: string | null;
  createdAt: string;
}

interface CitationBadgeProps {
  versionType: 'positioning' | 'competitors' | 'content';
  versionId: number;
  sectionId?: string;
  className?: string;
}

export default function CitationBadge({ 
  versionType, 
  versionId, 
  sectionId,
  className = ''
}: CitationBadgeProps) {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCitations();
  }, [versionType, versionId, sectionId]);

  const fetchCitations = async () => {
    try {
      const params = new URLSearchParams({
        versionType,
        versionId: versionId.toString()
      });
      if (sectionId) {
        params.append('sectionId', sectionId);
      }

      const response = await fetch(`/api/citations?${params}`);
      const data = await response.json();
      if (response.ok) {
        setCitations(data.citations || []);
      }
    } catch (error) {
      console.error('Failed to fetch citations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || citations.length === 0) return null;

  // Format citation display
  const namedContributors = citations.filter(c => !c.isAnonymous && c.contributorName);
  const anonymousCount = citations.filter(c => c.isAnonymous).length;

  const formatContributors = () => {
    const names = namedContributors.map(c => c.contributorName).slice(0, 3);
    const remaining = namedContributors.length - 3;
    
    let text = names.join(', ');
    if (remaining > 0) {
      text += ` +${remaining}`;
    }
    if (anonymousCount > 0) {
      if (names.length > 0) text += ', ';
      text += `Anonymous (${anonymousCount})`;
    }
    return text;
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
      >
        <Link2 className="w-3 h-3" />
        <span>Cited: {formatContributors()}</span>
      </button>

      {isExpanded && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-surface-elevated border border-border rounded-lg shadow-xl z-40 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-foreground">Contributors</span>
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-xs text-muted hover:text-foreground"
            >
              Close
            </button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {citations.map((citation) => (
              <div 
                key={citation.id}
                className="flex items-start gap-2 p-2 rounded bg-surface"
              >
                {citation.isAnonymous ? (
                  <Users className="w-4 h-4 text-muted mt-0.5" />
                ) : (
                  <User className="w-4 h-4 text-accent mt-0.5" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground font-medium">
                    {citation.isAnonymous ? 'Anonymous' : citation.contributorName}
                    {citation.clusterName && (
                      <span className="text-muted font-normal"> (part of: {citation.clusterName})</span>
                    )}
                  </p>
                  {citation.content && (
                    <p className="text-xs text-muted mt-0.5 line-clamp-2">
                      {citation.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
