'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  History, 
  RotateCcw, 
  X,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  Building2,
  Edit3,
  Table,
  ChevronDown,
  ArrowLeftRight,
  CheckCircle2,
  XCircle,
  Minus,
  Mic,
  MicOff,
  Lightbulb,
  Square,
  MessageSquarePlus,
  Newspaper,
  Filter,
  Calendar,
  Tag,
  Briefcase
} from 'lucide-react';
import ContributionModal from '@/components/ContributionModal';
import { BattlecardData, Competitor, BattlecardCategory, BattlecardVersion, CompanyData } from '@/lib/types';

// Declare SpeechRecognition types for TypeScript
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

type ViewMode = 'table' | 'edit' | 'news';

interface FeedItem {
  id: number;
  competitor_id: string;
  competitor_name: string;
  title: string;
  link: string;
  pub_date: string | null;
  content_snippet: string | null;
  topics: string[];
  industries: string[];
}

interface FilterOptions {
  competitors: { id: string; name: string }[];
  topics: string[];
  industries: string[];
}

interface ComparisonView {
  competitor: Competitor;
  categoryId?: string; // If set, show just this category. If not, show all.
}

export default function CompetitorHub() {
  const [data, setData] = useState<BattlecardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [changeNotes, setChangeNotes] = useState('');
  
  // Version history
  const [showHistory, setShowHistory] = useState(false);
  const [versions, setVersions] = useState<BattlecardVersion[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [currentVersion, setCurrentVersion] = useState<number>(0);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  
  // UI state
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [copied, setCopied] = useState(false);
  const [showAddCompetitor, setShowAddCompetitor] = useState(false);
  const [newCompetitorName, setNewCompetitorName] = useState('');
  const [newCompetitorWebsite, setNewCompetitorWebsite] = useState('');
  
  // Comparison modal
  const [comparison, setComparison] = useState<ComparisonView | null>(null);
  
  // Add Insights modal
  const [showInsights, setShowInsights] = useState(false);
  const [insightText, setInsightText] = useState('');
  const [insightCompetitor, setInsightCompetitor] = useState<string>(''); // competitor id or 'new'
  const [insightCategory, setInsightCategory] = useState<string>(''); // category id
  const [insightNewCompetitorName, setInsightNewCompetitorName] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  
  // Contribution modal (for team contributions that go through review)
  const [showContribution, setShowContribution] = useState(false);
  
  // News/Feeds state
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [feedsLoading, setFeedsLoading] = useState(false);
  const [feedsRefreshing, setFeedsRefreshing] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({ competitors: [], topics: [], industries: [] });
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [daysFilter, setDaysFilter] = useState<number | undefined>(undefined);

  const fetchBattlecard = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/battlecard');
      if (!res.ok) throw new Error('Failed to fetch battlecard');
      const result = await res.json();
      setData(result.data);
      setCurrentVersion(result.current_version);
      setLastSaved(result.versionCreatedAt);
      setHasChanges(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVersions = async () => {
    try {
      setLoadingVersions(true);
      const res = await fetch('/api/battlecard/versions');
      if (!res.ok) throw new Error('Failed to fetch versions');
      const result = await res.json();
      setVersions(result);
    } catch (err) {
      console.error('Error fetching versions:', err);
    } finally {
      setLoadingVersions(false);
    }
  };

  const fetchFeedItems = useCallback(async () => {
    try {
      setFeedsLoading(true);
      const params = new URLSearchParams();
      if (selectedCompetitors.length > 0) params.set('competitors', selectedCompetitors.join(','));
      if (selectedTopics.length > 0) params.set('topics', selectedTopics.join(','));
      if (selectedIndustries.length > 0) params.set('industries', selectedIndustries.join(','));
      if (daysFilter) params.set('days', daysFilter.toString());
      
      const res = await fetch(`/api/competitor-rss?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch feeds');
      const result = await res.json();
      setFeedItems(result.items || []);
      setFilterOptions(result.filterOptions || { competitors: [], topics: [], industries: [] });
    } catch (err) {
      console.error('Error fetching feeds:', err);
    } finally {
      setFeedsLoading(false);
    }
  }, [selectedCompetitors, selectedTopics, selectedIndustries, daysFilter]);

  const refreshFeeds = async () => {
    try {
      setFeedsRefreshing(true);
      const res = await fetch('/api/competitor-rss', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
      if (!res.ok) throw new Error('Failed to refresh feeds');
      await fetchFeedItems();
    } catch (err) {
      console.error('Error refreshing feeds:', err);
    } finally {
      setFeedsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBattlecard();
  }, [fetchBattlecard]);

  // Fetch feeds when switching to news view or filters change
  useEffect(() => {
    if (viewMode === 'news') {
      fetchFeedItems();
    }
  }, [viewMode, fetchFeedItems]);

  // Check for speech recognition support
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognitionAPI);
  }, []);

  // Initialize speech recognition
  const startRecording = () => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript + ' ';
        } else {
          interim += transcript;
        }
      }
      
      if (final) {
        setInsightText(prev => prev + final);
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
    setInterimTranscript('');
  };

  const saveChanges = async () => {
    if (!data) return;
    
    try {
      setSaving(true);
      const res = await fetch('/api/battlecard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, changeNotes: changeNotes || 'Updated battlecard' }),
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
      const res = await fetch('/api/battlecard/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ versionNumber }),
      });
      
      if (!res.ok) throw new Error('Failed to restore');
      
      setShowHistory(false);
      await fetchBattlecard();
      await fetchVersions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore');
    } finally {
      setSaving(false);
    }
  };

  const updateData = (newData: BattlecardData) => {
    setData(newData);
    setHasChanges(true);
  };

  const addCompetitor = () => {
    if (!data || !newCompetitorName.trim()) return;
    
    const newCompetitor: Competitor = {
      id: `comp-${Date.now()}`,
      name: newCompetitorName.trim(),
      website: newCompetitorWebsite.trim(),
      tagline: '',
      entries: {},
    };
    
    updateData({
      ...data,
      competitors: [...data.competitors, newCompetitor],
    });
    
    setNewCompetitorName('');
    setNewCompetitorWebsite('');
    setShowAddCompetitor(false);
  };

  const removeCompetitor = (id: string) => {
    if (!data) return;
    if (!confirm('Remove this competitor?')) return;
    
    updateData({
      ...data,
      competitors: data.competitors.filter(c => c.id !== id),
    });
  };

  const updateCompetitorEntry = (competitorId: string, categoryId: string, value: string) => {
    if (!data) return;
    
    updateData({
      ...data,
      competitors: data.competitors.map(c => 
        c.id === competitorId 
          ? { ...c, entries: { ...c.entries, [categoryId]: value } }
          : c
      ),
    });
  };

  const updateOurEntry = (categoryId: string, value: string) => {
    if (!data) return;
    
    updateData({
      ...data,
      ourCompany: {
        ...data.ourCompany,
        entries: { ...data.ourCompany.entries, [categoryId]: value },
      },
    });
  };

  const updateOurCompany = (field: keyof CompanyData, value: string) => {
    if (!data) return;
    
    updateData({
      ...data,
      ourCompany: { ...data.ourCompany, [field]: value },
    });
  };

  const updateCompetitor = (id: string, field: keyof Competitor, value: string) => {
    if (!data) return;
    
    updateData({
      ...data,
      competitors: data.competitors.map(c => 
        c.id === id ? { ...c, [field]: value } : c
      ),
    });
  };

  const saveInsight = async () => {
    if (!data || !insightText.trim()) return;
    
    let updatedData = { ...data };
    let competitorId = insightCompetitor;
    
    // If creating new competitor
    if (insightCompetitor === 'new' && insightNewCompetitorName.trim()) {
      const newComp: Competitor = {
        id: `comp-${Date.now()}`,
        name: insightNewCompetitorName.trim(),
        website: '',
        tagline: '',
        entries: {},
      };
      updatedData.competitors = [...updatedData.competitors, newComp];
      competitorId = newComp.id;
    }
    
    // Add insight to the appropriate place
    if (competitorId && competitorId !== 'new' && insightCategory) {
      // Update specific category for competitor
      updatedData.competitors = updatedData.competitors.map(c => {
        if (c.id === competitorId) {
          const existingValue = c.entries[insightCategory] || '';
          const newValue = existingValue 
            ? `${existingValue}\n\n[Insight ${new Date().toLocaleDateString()}]\n${insightText.trim()}`
            : insightText.trim();
          return { ...c, entries: { ...c.entries, [insightCategory]: newValue } };
        }
        return c;
      });
    } else if (competitorId && competitorId !== 'new' && !insightCategory) {
      // Add to "overview" category if no specific category selected
      updatedData.competitors = updatedData.competitors.map(c => {
        if (c.id === competitorId) {
          const existingValue = c.entries['overview'] || '';
          const newValue = existingValue 
            ? `${existingValue}\n\n[Insight ${new Date().toLocaleDateString()}]\n${insightText.trim()}`
            : insightText.trim();
          return { ...c, entries: { ...c.entries, 'overview': newValue } };
        }
        return c;
      });
    }
    
    setData(updatedData);
    
    // Auto-save with version
    try {
      setSaving(true);
      const changeNote = insightCompetitor === 'new' 
        ? `Added new competitor: ${insightNewCompetitorName} with insight`
        : `Added insight for ${updatedData.competitors.find(c => c.id === competitorId)?.name || 'competitor'}`;
      
      const res = await fetch('/api/battlecard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: updatedData, changeNotes: changeNote }),
      });
      
      if (!res.ok) throw new Error('Failed to save');
      const result = await res.json();
      setCurrentVersion(result.version);
      setLastSaved(new Date().toISOString());
      setHasChanges(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
    
    // Reset and close modal
    setShowInsights(false);
    setInsightText('');
    setInsightCompetitor('');
    setInsightCategory('');
    setInsightNewCompetitorName('');
    setInterimTranscript('');
  };

  const copyToClipboard = async () => {
    if (!data) return;
    
    let markdown = `# Competitive Battlecard\n\n`;
    markdown += `**Last Updated:** ${lastSaved ? new Date(lastSaved).toLocaleString() : 'Never'}\n\n`;
    
    markdown += `| Category | ${data.ourCompany.name} |`;
    data.competitors.forEach(c => {
      markdown += ` ${c.name} |`;
    });
    markdown += '\n';
    
    markdown += `|----------|----------|`;
    data.competitors.forEach(() => {
      markdown += `----------|`;
    });
    markdown += '\n';
    
    data.categories.forEach(cat => {
      const ourValue = data.ourCompany.entries[cat.id] || '-';
      markdown += `| **${cat.name}** | ${ourValue.replace(/\n/g, ' ')} |`;
      data.competitors.forEach(comp => {
        const value = comp.entries[cat.id] || '-';
        markdown += ` ${value.replace(/\n/g, ' ')} |`;
      });
      markdown += '\n';
    });
    
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Failed to copy');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 animate-spin text-accent" />
          <p className="text-muted">Loading battlecard...</p>
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
            onClick={fetchBattlecard}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Building2 className="w-7 h-7" style={{ stroke: 'url(#icon-gradient)' }} />
              Competitor Battlecards
            </h1>
            <p className="text-sm text-muted mt-1">
              Compare and track competitive positioning • {data.competitors.length} competitors • Version {currentVersion} • {lastSaved ? new Date(lastSaved).toLocaleDateString() : 'Not saved'}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-surface-elevated rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-accent text-white' 
                    : 'text-muted hover:text-foreground'
                }`}
              >
                <Table className="w-4 h-4" />
                View
              </button>
              <button
                onClick={() => setViewMode('edit')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'edit' 
                    ? 'bg-accent text-white' 
                    : 'text-muted hover:text-foreground'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => setViewMode('news')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'news' 
                    ? 'bg-accent text-white' 
                    : 'text-muted hover:text-foreground'
                }`}
              >
                <Newspaper className="w-4 h-4" />
                News
              </button>
            </div>

            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-surface-elevated text-muted rounded-lg hover:text-foreground transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            
            <button
              onClick={() => {
                setShowHistory(true);
                fetchVersions();
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-surface-elevated text-muted rounded-lg hover:text-foreground transition-colors cursor-pointer"
            >
              <History className="w-4 h-4" />
              History
            </button>
            
            <button
              onClick={saveChanges}
              disabled={!hasChanges || saving}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors cursor-pointer ${
                hasChanges 
                  ? 'bg-accent text-white hover:bg-accent-hover' 
                  : 'bg-surface-elevated text-muted cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : hasChanges ? 'Save' : 'Saved'}
            </button>
            
            <button
              onClick={() => setShowContribution(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-colors cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              Contribute
            </button>
            
            <button
              onClick={() => setShowInsights(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-success/20 text-success rounded-lg hover:bg-success/30 transition-colors cursor-pointer"
            >
              <Lightbulb className="w-4 h-4" />
              Quick Insight
            </button>
          </div>
        </div>

        {/* Change notes */}
        {hasChanges && (
          <div className="mb-4 p-3 bg-warning/10 border border-warning/30 rounded-lg flex items-center gap-3">
            <input
              type="text"
              value={changeNotes}
              onChange={(e) => setChangeNotes(e.target.value)}
              placeholder="Change notes (optional)"
              className="flex-1 px-3 py-1.5 text-sm bg-transparent border-none focus:outline-none"
            />
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="sticky left-0 z-10 bg-surface-elevated px-4 py-3 text-left text-sm font-semibold text-muted w-40">
                      Category
                    </th>
                    <th className="bg-accent/10 px-4 py-3 text-left min-w-[200px]">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-accent">{data.ourCompany.name}</span>
                        {data.ourCompany.website && (
                          <a href={data.ourCompany.website} target="_blank" rel="noopener noreferrer" className="text-accent/60 hover:text-accent">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </th>
                    {data.competitors.map(comp => (
                      <th key={comp.id} className="bg-surface-elevated px-4 py-3 text-left min-w-[180px]">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setComparison({ competitor: comp })}
                            className="font-semibold text-foreground text-sm hover:text-accent transition-colors cursor-pointer text-left"
                            title={`Compare ${data.ourCompany.name} vs ${comp.name}`}
                          >
                            {comp.name}
                          </button>
                          {comp.website && (
                            <a href={comp.website.startsWith('http') ? comp.website : `https://${comp.website}`} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent" onClick={(e) => e.stopPropagation()}>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.categories.map((category, idx) => (
                    <tr key={category.id} className={idx % 2 === 0 ? 'bg-surface' : 'bg-surface-elevated/30'}>
                      <td className="sticky left-0 z-10 bg-inherit px-4 py-3 text-sm font-medium text-muted border-r border-border">
                        {category.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground bg-accent/5 border-r border-accent/20">
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {data.ourCompany.entries[category.id] || <span className="text-muted/50 italic">Not set</span>}
                        </div>
                      </td>
                      {data.competitors.map(comp => (
                        <td 
                          key={comp.id} 
                          className="px-4 py-3 text-sm text-foreground/80 border-r border-border last:border-r-0 cursor-pointer hover:bg-surface-elevated/50 transition-colors"
                          onClick={() => setComparison({ competitor: comp, categoryId: category.id })}
                          title={`Compare: ${category.name}`}
                        >
                          <div className="whitespace-pre-wrap leading-relaxed">
                            {comp.entries[category.id] || <span className="text-muted/50 italic">-</span>}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Edit View */}
        {viewMode === 'edit' && (
          <div className="space-y-6">
            {/* Your Company */}
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-accent/10">
                <h2 className="font-semibold text-accent">Your Company</h2>
              </div>
              <div className="p-4 grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Name</label>
                  <input
                    type="text"
                    value={data.ourCompany.name}
                    onChange={(e) => updateOurCompany('name', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Website</label>
                  <input
                    type="text"
                    value={data.ourCompany.website}
                    onChange={(e) => updateOurCompany('website', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">Tagline</label>
                  <input
                    type="text"
                    value={data.ourCompany.tagline}
                    onChange={(e) => updateOurCompany('tagline', e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
              
              {/* Category entries for our company */}
              <div className="border-t border-border">
                {data.categories.map(category => (
                  <div key={category.id} className="border-b border-border last:border-b-0">
                    <div className="px-4 py-2 bg-surface-elevated/50">
                      <span className="text-sm font-medium text-muted">{category.name}</span>
                    </div>
                    <div className="p-4">
                      <textarea
                        value={data.ourCompany.entries[category.id] || ''}
                        onChange={(e) => updateOurEntry(category.id, e.target.value)}
                        rows={2}
                        placeholder={`Enter ${category.name.toLowerCase()}...`}
                        className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg focus:outline-none focus:border-accent resize-none placeholder:text-muted/50"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitors */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Competitors ({data.competitors.length})</h2>
              <button
                onClick={() => setShowAddCompetitor(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Competitor
              </button>
            </div>

            {/* Add Competitor Form */}
            {showAddCompetitor && (
              <div className="bg-surface border border-accent/30 rounded-xl p-4">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-muted mb-1.5">Name</label>
                    <input
                      type="text"
                      value={newCompetitorName}
                      onChange={(e) => setNewCompetitorName(e.target.value)}
                      placeholder="Competitor name"
                      className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg focus:outline-none focus:border-accent"
                      autoFocus
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-muted mb-1.5">Website</label>
                    <input
                      type="text"
                      value={newCompetitorWebsite}
                      onChange={(e) => setNewCompetitorWebsite(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg focus:outline-none focus:border-accent"
                    />
                  </div>
                  <button
                    onClick={addCompetitor}
                    disabled={!newCompetitorName.trim()}
                    className="px-4 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowAddCompetitor(false);
                      setNewCompetitorName('');
                      setNewCompetitorWebsite('');
                    }}
                    className="px-4 py-2 text-sm bg-surface-elevated text-muted rounded-lg hover:text-foreground"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Competitor Cards */}
            <div className="grid gap-4 lg:grid-cols-2">
              {data.competitors.map(comp => (
                <div key={comp.id} className="bg-surface border border-border rounded-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-border bg-surface-elevated flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={comp.name}
                        onChange={(e) => updateCompetitor(comp.id, 'name', e.target.value)}
                        className="font-semibold text-foreground bg-transparent border-none focus:outline-none focus:border-b focus:border-accent"
                      />
                      {comp.website && (
                        <a href={comp.website.startsWith('http') ? comp.website : `https://${comp.website}`} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => removeCompetitor(comp.id)}
                      className="p-1.5 text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-muted mb-1">Website</label>
                      <input
                        type="text"
                        value={comp.website}
                        onChange={(e) => updateCompetitor(comp.id, 'website', e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg focus:outline-none focus:border-accent"
                      />
                    </div>
                    
                    {/* Collapsible categories */}
                    <details className="group">
                      <summary className="flex items-center gap-2 cursor-pointer text-sm text-muted hover:text-foreground py-2">
                        <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                        Edit category entries ({Object.keys(comp.entries).filter(k => comp.entries[k]).length}/{data.categories.length} filled)
                      </summary>
                      <div className="mt-2 space-y-3">
                        {data.categories.map(category => (
                          <div key={category.id}>
                            <label className="block text-xs font-medium text-muted mb-1">{category.name}</label>
                            <textarea
                              value={comp.entries[category.id] || ''}
                              onChange={(e) => updateCompetitorEntry(comp.id, category.id, e.target.value)}
                              rows={2}
                              placeholder={`Enter ${category.name.toLowerCase()}...`}
                              className="w-full px-3 py-2 text-sm bg-surface-elevated border border-border rounded-lg focus:outline-none focus:border-accent resize-none placeholder:text-muted/50"
                            />
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                </div>
              ))}
            </div>

            {data.competitors.length === 0 && (
              <div className="text-center py-12 text-muted bg-surface border border-border rounded-xl">
                No competitors added yet. Click &quot;Add Competitor&quot; to start building your battlecard.
              </div>
            )}
          </div>
        )}
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

      {/* Comparison Modal */}
      {comparison && data && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-border">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-surface-elevated">
              <div className="flex items-center gap-3">
                <ArrowLeftRight className="w-5 h-5 text-accent" />
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {data.ourCompany.name} vs {comparison.competitor.name}
                  </h2>
                  {comparison.categoryId && (
                    <p className="text-sm text-muted">
                      Comparing: {data.categories.find(c => c.id === comparison.categoryId)?.name}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {comparison.categoryId && (
                  <button
                    onClick={() => setComparison({ competitor: comparison.competitor })}
                    className="px-3 py-1.5 text-sm text-muted hover:text-foreground bg-surface rounded-lg transition-colors"
                  >
                    View All Categories
                  </button>
                )}
                <button
                  onClick={() => setComparison(null)}
                  className="p-1.5 text-muted hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Company Info */}
            <div className="grid grid-cols-2 border-b border-border">
              <div className="p-4 bg-accent/10 border-r border-border">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="font-semibold text-accent">{data.ourCompany.name}</span>
                </div>
                {data.ourCompany.tagline && (
                  <p className="text-sm text-muted">{data.ourCompany.tagline}</p>
                )}
                {data.ourCompany.website && (
                  <a href={data.ourCompany.website} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">
                    {data.ourCompany.website.replace('https://', '')}
                  </a>
                )}
              </div>
              <div className="p-4 bg-surface-elevated">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-4 h-4 text-muted" />
                  <span className="font-semibold text-foreground">{comparison.competitor.name}</span>
                </div>
                {comparison.competitor.tagline && (
                  <p className="text-sm text-muted">{comparison.competitor.tagline}</p>
                )}
                {comparison.competitor.website && (
                  <a href={comparison.competitor.website.startsWith('http') ? comparison.competitor.website : `https://${comparison.competitor.website}`} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">
                    {comparison.competitor.website.replace('https://', '')}
                  </a>
                )}
              </div>
            </div>
            
            {/* Comparison Content */}
            <div className="overflow-y-auto max-h-[60vh]">
              {(comparison.categoryId 
                ? data.categories.filter(c => c.id === comparison.categoryId)
                : data.categories
              ).map(category => {
                const ourValue = data.ourCompany.entries[category.id] || '';
                const theirValue = comparison.competitor.entries[category.id] || '';
                const hasOurs = ourValue.trim().length > 0;
                const hasTheirs = theirValue.trim().length > 0;
                
                return (
                  <div key={category.id} className="border-b border-border last:border-b-0">
                    {/* Category Header */}
                    <div className="px-4 py-2 bg-surface-elevated/50 flex items-center justify-between">
                      <span className="text-sm font-medium text-muted">{category.name}</span>
                      <div className="flex items-center gap-2">
                        {hasOurs && !hasTheirs && (
                          <span className="flex items-center gap-1 text-xs text-success">
                            <CheckCircle2 className="w-3 h-3" />
                            {data.ourCompany.name} advantage
                          </span>
                        )}
                        {!hasOurs && hasTheirs && (
                          <span className="flex items-center gap-1 text-xs text-warning">
                            <XCircle className="w-3 h-3" />
                            Gap to address
                          </span>
                        )}
                        {hasOurs && hasTheirs && (
                          <span className="flex items-center gap-1 text-xs text-muted">
                            <Minus className="w-3 h-3" />
                            Both compete
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Side by side content */}
                    <div className="grid grid-cols-2">
                      <div className={`p-4 border-r border-border ${hasOurs ? 'bg-accent/5' : 'bg-surface'}`}>
                        {hasOurs ? (
                          <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{ourValue}</p>
                        ) : (
                          <p className="text-sm text-muted/50 italic">Not documented</p>
                        )}
                      </div>
                      <div className={`p-4 ${hasTheirs ? 'bg-surface' : 'bg-surface-elevated/30'}`}>
                        {hasTheirs ? (
                          <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">{theirValue}</p>
                        ) : (
                          <p className="text-sm text-muted/50 italic">Not documented</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Footer with quick insights */}
            <div className="p-4 border-t border-border bg-surface-elevated">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="text-muted">Quick Summary:</span>
                  <span className="flex items-center gap-1 text-success">
                    <CheckCircle2 className="w-4 h-4" />
                    {data.categories.filter(c => {
                      const ours = data.ourCompany.entries[c.id]?.trim();
                      const theirs = comparison.competitor.entries[c.id]?.trim();
                      return ours && !theirs;
                    }).length} advantages
                  </span>
                  <span className="flex items-center gap-1 text-warning">
                    <XCircle className="w-4 h-4" />
                    {data.categories.filter(c => {
                      const ours = data.ourCompany.entries[c.id]?.trim();
                      const theirs = comparison.competitor.entries[c.id]?.trim();
                      return !ours && theirs;
                    }).length} gaps
                  </span>
                  <span className="flex items-center gap-1 text-muted">
                    <Minus className="w-4 h-4" />
                    {data.categories.filter(c => {
                      const ours = data.ourCompany.entries[c.id]?.trim();
                      const theirs = comparison.competitor.entries[c.id]?.trim();
                      return ours && theirs;
                    }).length} competitive
                  </span>
                </div>
                <button
                  onClick={() => {
                    // Navigate to next competitor
                    const currentIdx = data.competitors.findIndex(c => c.id === comparison.competitor.id);
                    const nextIdx = (currentIdx + 1) % data.competitors.length;
                    setComparison({ competitor: data.competitors[nextIdx] });
                  }}
                  className="text-accent hover:underline"
                >
                  Next competitor →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Insights Modal */}
      {showInsights && data && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-border">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-surface-elevated">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-success" />
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Add Competitive Insight</h2>
                  <p className="text-sm text-muted">Type or speak your insight about a competitor</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowInsights(false);
                  setInsightText('');
                  setInsightCompetitor('');
                  setInsightCategory('');
                  setInsightNewCompetitorName('');
                  stopRecording();
                }}
                className="p-1.5 text-muted hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Competitor Selection */}
              <div>
                <label className="block text-sm font-medium text-muted mb-2">
                  Which competitor is this about?
                </label>
                <select
                  value={insightCompetitor}
                  onChange={(e) => {
                    setInsightCompetitor(e.target.value);
                    if (e.target.value !== 'new') {
                      setInsightNewCompetitorName('');
                    }
                  }}
                  className="w-full px-4 py-3 text-sm bg-surface-elevated border border-border rounded-lg focus:outline-none focus:border-accent"
                >
                  <option value="">Select a competitor...</option>
                  {data.competitors.map(comp => (
                    <option key={comp.id} value={comp.id}>{comp.name}</option>
                  ))}
                  <option value="new">+ Add new competitor</option>
                </select>
                
                {insightCompetitor === 'new' && (
                  <input
                    type="text"
                    value={insightNewCompetitorName}
                    onChange={(e) => setInsightNewCompetitorName(e.target.value)}
                    placeholder="Enter new competitor name..."
                    className="mt-2 w-full px-4 py-3 text-sm bg-surface-elevated border border-border rounded-lg focus:outline-none focus:border-accent"
                    autoFocus
                  />
                )}
              </div>
              
              {/* Category Selection (optional) */}
              <div>
                <label className="block text-sm font-medium text-muted mb-2">
                  Category (optional)
                </label>
                <select
                  value={insightCategory}
                  onChange={(e) => setInsightCategory(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-surface-elevated border border-border rounded-lg focus:outline-none focus:border-accent"
                >
                  <option value="">General / Overview</option>
                  {data.categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Voice Recording Toggle */}
              {speechSupported && (
                <div className="flex items-center justify-between p-4 bg-surface-elevated rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    {isRecording ? (
                      <div className="w-10 h-10 rounded-full bg-error/20 flex items-center justify-center animate-pulse">
                        <Mic className="w-5 h-5 text-error" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center">
                        <MicOff className="w-5 h-5 text-muted" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {isRecording ? 'Recording...' : 'Voice Recording'}
                      </p>
                      <p className="text-xs text-muted">
                        {isRecording ? 'Click Stop to finish' : 'Click to start speaking'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                      isRecording 
                        ? 'bg-error text-white hover:bg-error/80' 
                        : 'bg-accent text-white hover:bg-accent-hover'
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <Square className="w-4 h-4" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4" />
                        Start
                      </>
                    )}
                  </button>
                </div>
              )}
              
              {/* Insight Text Area */}
              <div>
                <label className="block text-sm font-medium text-muted mb-2">
                  Your Insight
                </label>
                <textarea
                  value={insightText + (interimTranscript ? ` ${interimTranscript}` : '')}
                  onChange={(e) => setInsightText(e.target.value)}
                  rows={6}
                  placeholder="Type your insight here, or use voice recording above...

Example: &quot;Jolt is heavily focused on QSR and has strong labeling features, but lacks automated temperature monitoring. Their pricing is around $150/location/month.&quot;"
                  className="w-full px-4 py-3 text-sm bg-surface-elevated border border-border rounded-lg focus:outline-none focus:border-accent resize-none placeholder:text-muted/50"
                />
                {interimTranscript && (
                  <p className="mt-1 text-xs text-accent italic">Listening: {interimTranscript}</p>
                )}
                <p className="mt-1 text-xs text-muted text-right">
                  {insightText.length} characters
                </p>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-border bg-surface-elevated flex items-center justify-between">
              <p className="text-xs text-muted">
                Insight will be added and auto-saved as a new version
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowInsights(false);
                    setInsightText('');
                    setInsightCompetitor('');
                    setInsightCategory('');
                    setInsightNewCompetitorName('');
                    stopRecording();
                  }}
                  className="px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveInsight}
                  disabled={!insightText.trim() || !insightCompetitor || (insightCompetitor === 'new' && !insightNewCompetitorName.trim()) || saving}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-success text-white rounded-lg hover:bg-success/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Insight'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contribution Modal - for team contributions that go through review */}
      <ContributionModal
        isOpen={showContribution}
        onClose={() => setShowContribution(false)}
        targetType="competitors"
        sectionLabel="Competitor Intelligence"
      />
    </div>
  );
}
