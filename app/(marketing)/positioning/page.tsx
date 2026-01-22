'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Save, 
  History, 
  RotateCcw, 
  X,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Copy,
  Check,
  Target,
  FileText,
  Lightbulb
} from 'lucide-react';
import ContributionModal from '@/components/ContributionModal';

interface PositioningField {
  id: string;
  label: string;
  type: 'text' | 'textarea';
  value: string;
  placeholder?: string;
}

interface PositioningSection {
  id: string;
  name: string;
  order: number;
  fields: PositioningField[];
}

interface PositioningData {
  companyName: string;
  sections: PositioningSection[];
}

interface PositioningVersion {
  id: number;
  version_number: number;
  change_notes: string | null;
  created_at: string;
}

// Auto-expanding textarea component
function AutoExpandTextarea({ 
  value, 
  onChange, 
  placeholder 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  placeholder?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(80, textarea.scrollHeight)}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 text-sm bg-surface-elevated border border-border rounded-lg focus:outline-none focus:border-accent resize-none placeholder:text-muted/50 overflow-hidden"
      style={{ minHeight: '80px' }}
    />
  );
}

export default function PositioningPage() {
  const [data, setData] = useState<PositioningData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [changeNotes, setChangeNotes] = useState('');
  
  // Version history
  const [showHistory, setShowHistory] = useState(false);
  const [versions, setVersions] = useState<PositioningVersion[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [currentVersion, setCurrentVersion] = useState<number>(0);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  
  // UI state
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  
  // Contribution modal
  const [showContribution, setShowContribution] = useState(false);
  const [contributionSection, setContributionSection] = useState<{ id: string; label: string } | null>(null);

  const fetchPositioning = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/positioning');
      if (!res.ok) throw new Error('Failed to fetch positioning document');
      const result = await res.json();
      setData(result.data);
      setCurrentVersion(result.current_version);
      setLastSaved(result.versionCreatedAt);
      setHasChanges(false);
      
      // Expand all sections by default
      if (result.data?.sections) {
        setExpandedSections(new Set(result.data.sections.map((s: PositioningSection) => s.id)));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVersions = async () => {
    try {
      setLoadingVersions(true);
      const res = await fetch('/api/positioning/versions');
      if (!res.ok) throw new Error('Failed to fetch versions');
      const result = await res.json();
      setVersions(result);
    } catch (err) {
      console.error('Error fetching versions:', err);
    } finally {
      setLoadingVersions(false);
    }
  };

  useEffect(() => {
    fetchPositioning();
  }, [fetchPositioning]);

  const saveChanges = async () => {
    if (!data) return;
    
    try {
      setSaving(true);
      const res = await fetch('/api/positioning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, changeNotes: changeNotes || 'Updated positioning document' }),
      });
      
      if (!res.ok) throw new Error('Failed to save');
      const result = await res.json();
      setCurrentVersion(result.version);
      setLastSaved(new Date().toISOString());
      setHasChanges(false);
      setChangeNotes('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const restoreVersion = async (versionNumber: number) => {
    if (!confirm(`Restore to version ${versionNumber}? This will create a new version.`)) return;
    
    try {
      setSaving(true);
      const res = await fetch('/api/positioning/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ versionNumber }),
      });
      
      if (!res.ok) throw new Error('Failed to restore');
      
      setShowHistory(false);
      await fetchPositioning();
      await fetchVersions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore');
    } finally {
      setSaving(false);
    }
  };

  const updateData = (newData: PositioningData) => {
    setData(newData);
    setHasChanges(true);
  };

  const updateField = (sectionId: string, fieldId: string, value: string) => {
    if (!data) return;
    
    updateData({
      ...data,
      sections: data.sections.map(section => 
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.map(field =>
                field.id === fieldId ? { ...field, value } : field
              )
            }
          : section
      )
    });
  };

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  const copyToClipboard = async () => {
    if (!data) return;
    
    let markdown = `# ${data.companyName} - Corporate Positioning\n\n`;
    markdown += `**Last Updated:** ${lastSaved ? new Date(lastSaved).toLocaleString() : 'Never'}\n`;
    markdown += `**Version:** ${currentVersion}\n\n---\n\n`;
    
    data.sections.forEach(section => {
      markdown += `## ${section.name}\n\n`;
      section.fields.forEach(field => {
        if (field.value) {
          markdown += `### ${field.label}\n${field.value}\n\n`;
        }
      });
    });
    
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Failed to copy');
    }
  };

  const getCompletionStats = () => {
    if (!data) return { filled: 0, total: 0 };
    let filled = 0;
    let total = 0;
    data.sections.forEach(section => {
      section.fields.forEach(field => {
        total++;
        if (field.value && field.value.trim()) filled++;
      });
    });
    return { filled, total };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 animate-spin text-accent" />
          <p className="text-muted">Loading positioning document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-error mb-4">{error}</p>
          <button
            onClick={fetchPositioning}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const stats = getCompletionStats();
  const completionPercent = stats.total > 0 ? Math.round((stats.filled / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Target className="w-7 h-7" style={{ stroke: 'url(#icon-gradient)' }} />
              Corporate Positioning
            </h1>
            <p className="text-sm text-muted mt-1">
              Strategic messaging framework • {stats.filled}/{stats.total} fields • Version {currentVersion} • {lastSaved ? new Date(lastSaved).toLocaleDateString() : 'Not saved'}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setContributionSection(null);
                setShowContribution(true);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-success/20 text-success rounded-lg hover:bg-success/30 transition-colors"
            >
              <Lightbulb className="w-4 h-4" />
              Add Insight
            </button>
            
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-surface-elevated text-muted rounded-lg hover:text-foreground hover:bg-surface transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Export'}
            </button>
            
            <button
              onClick={() => {
                setShowHistory(true);
                fetchVersions();
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-surface-elevated text-muted rounded-lg hover:text-foreground hover:bg-surface transition-colors"
            >
              <History className="w-4 h-4" />
              History
            </button>
            
            <button
              onClick={saveChanges}
              disabled={!hasChanges || saving}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                hasChanges 
                  ? 'bg-accent text-white hover:bg-accent-hover' 
                  : 'bg-surface-elevated text-muted cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : hasChanges ? 'Save Changes' : 'Saved'}
            </button>
          </div>
        </div>

        {/* Change notes input */}
        {hasChanges && (
          <div className="mb-6 p-4 bg-warning/10 border border-warning/30 rounded-lg">
            <label className="block text-sm font-medium text-warning mb-2">
              Change notes (optional)
            </label>
            <input
              type="text"
              value={changeNotes}
              onChange={(e) => setChangeNotes(e.target.value)}
              placeholder="What did you change?"
              className="w-full px-3 py-2 text-sm bg-surface border border-warning/30 rounded-lg focus:outline-none focus:border-warning"
            />
          </div>
        )}

        {/* Sections */}
        <div className="space-y-4">
          {data.sections.map((section) => (
            <div 
              key={section.id}
              className="bg-surface border border-border rounded-xl overflow-hidden"
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-surface-elevated transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5" style={{ stroke: 'url(#icon-gradient)' }} />
                  <h2 className="text-lg font-semibold text-foreground">{section.name}</h2>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-surface-elevated text-muted">
                    {section.fields.filter(f => f.value?.trim()).length}/{section.fields.length}
                  </span>
                </div>
                {expandedSections.has(section.id) ? (
                  <ChevronUp className="w-5 h-5 text-muted" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted" />
                )}
              </button>
              
              {/* Section Content */}
              {expandedSections.has(section.id) && (
                <div className="px-6 pb-6 space-y-5">
                  {section.fields.map((field) => (
                    <div key={field.id}>
                      <label className="block text-sm font-medium text-muted mb-2">
                        {field.label}
                      </label>
                      {field.type === 'textarea' ? (
                        <AutoExpandTextarea
                          value={field.value || ''}
                          onChange={(value) => updateField(section.id, field.id, value)}
                          placeholder={field.placeholder}
                        />
                      ) : (
                        <input
                          type="text"
                          value={field.value || ''}
                          onChange={(e) => updateField(section.id, field.id, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full px-4 py-3 text-sm bg-surface-elevated border border-border rounded-lg focus:outline-none focus:border-accent placeholder:text-muted/50"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Version History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden border border-border">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Version History</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="p-1 text-muted hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {loadingVersions ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-accent" />
                </div>
              ) : versions.length === 0 ? (
                <p className="text-center text-muted py-8">No version history available</p>
              ) : (
                <div className="space-y-2">
                  {versions.map((version) => (
                    <div 
                      key={version.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        version.version_number === currentVersion
                          ? 'bg-accent/10 border border-accent/30'
                          : 'bg-surface-elevated border border-border'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            Version {version.version_number}
                          </span>
                          {version.version_number === currentVersion && (
                            <span className="px-2 py-0.5 text-xs bg-accent text-white rounded">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted mt-0.5">
                          {new Date(version.created_at).toLocaleString()}
                        </p>
                        {version.change_notes && (
                          <p className="text-sm text-muted mt-1">
                            {version.change_notes}
                          </p>
                        )}
                      </div>
                      
                      {version.version_number !== currentVersion && (
                        <button
                          onClick={() => restoreVersion(version.version_number)}
                          disabled={saving}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-surface text-muted rounded-lg hover:text-foreground hover:bg-surface-elevated transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Restore
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contribution Modal */}
      <ContributionModal
        isOpen={showContribution}
        onClose={() => {
          setShowContribution(false);
          setContributionSection(null);
        }}
        targetType="positioning"
        targetSection={contributionSection?.id}
        sectionLabel={contributionSection?.label}
      />
    </div>
  );
}
