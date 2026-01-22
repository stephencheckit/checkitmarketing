'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  History, 
  RotateCcw, 
  X,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  Building2,
  GripVertical
} from 'lucide-react';
import { BattlecardData, Competitor, BattlecardCategory, BattlecardVersion } from '@/lib/types';

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
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

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
      
      // Expand all categories by default
      if (result.data?.categories) {
        setExpandedCategories(new Set(result.data.categories.map((c: BattlecardCategory) => c.id)));
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

  useEffect(() => {
    fetchBattlecard();
  }, [fetchBattlecard]);

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
    if (!data) return;
    
    const newCompetitor: Competitor = {
      id: `comp-${Date.now()}`,
      name: 'New Competitor',
      website: '',
      tagline: '',
      entries: {},
    };
    
    updateData({
      ...data,
      competitors: [...data.competitors, newCompetitor],
    });
  };

  const removeCompetitor = (id: string) => {
    if (!data) return;
    if (!confirm('Remove this competitor?')) return;
    
    updateData({
      ...data,
      competitors: data.competitors.filter(c => c.id !== id),
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

  const updateOurCompany = (field: keyof typeof data.ourCompany, value: string) => {
    if (!data) return;
    
    updateData({
      ...data,
      ourCompany: { ...data.ourCompany, [field]: value },
    });
  };

  const addCategory = () => {
    if (!data) return;
    
    const newCategory: BattlecardCategory = {
      id: `cat-${Date.now()}`,
      name: 'New Category',
      order: data.categories.length + 1,
    };
    
    updateData({
      ...data,
      categories: [...data.categories, newCategory],
    });
    
    setExpandedCategories(new Set([...expandedCategories, newCategory.id]));
  };

  const removeCategory = (id: string) => {
    if (!data) return;
    if (!confirm('Remove this category?')) return;
    
    updateData({
      ...data,
      categories: data.categories.filter(c => c.id !== id),
    });
  };

  const updateCategory = (id: string, name: string) => {
    if (!data) return;
    
    updateData({
      ...data,
      categories: data.categories.map(c => 
        c.id === id ? { ...c, name } : c
      ),
    });
  };

  const toggleCategory = (id: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCategories(newExpanded);
  };

  const copyToClipboard = async () => {
    if (!data) return;
    
    // Format as markdown table
    let markdown = `# Competitive Battlecard\n\n`;
    markdown += `**Last Updated:** ${lastSaved ? new Date(lastSaved).toLocaleString() : 'Never'}\n\n`;
    
    // Build header
    markdown += `| Category | ${data.ourCompany.name} |`;
    data.competitors.forEach(c => {
      markdown += ` ${c.name} |`;
    });
    markdown += '\n';
    
    // Separator
    markdown += `|----------|----------|`;
    data.competitors.forEach(() => {
      markdown += `----------|`;
    });
    markdown += '\n';
    
    // Rows
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
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-zinc-600 dark:text-zinc-400">Loading battlecard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchBattlecard}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              Competitor Hub
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              Battlecard matrix • {data.competitors.length} competitor{data.competitors.length !== 1 ? 's' : ''} • {data.categories.length} categories
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Version {currentVersion} • {lastSaved ? `Saved ${new Date(lastSaved).toLocaleString()}` : 'Not saved'}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            
            <button
              onClick={() => {
                setShowHistory(true);
                fetchVersions();
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600"
            >
              <History className="w-4 h-4" />
              History
            </button>
            
            <button
              onClick={saveChanges}
              disabled={!hasChanges || saving}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg ${
                hasChanges 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-zinc-300 dark:bg-zinc-600 text-zinc-500 dark:text-zinc-400 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : hasChanges ? 'Save Changes' : 'Saved'}
            </button>
          </div>
        </div>

        {/* Change notes input (when there are changes) */}
        {hasChanges && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <label className="block text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
              Change notes (optional)
            </label>
            <input
              type="text"
              value={changeNotes}
              onChange={(e) => setChangeNotes(e.target.value)}
              placeholder="What did you change?"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-amber-300 dark:border-amber-700 rounded-lg"
            />
          </div>
        )}

        {/* Our Company Header */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3">Your Company</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-blue-600 dark:text-blue-400 mb-1">Name</label>
              <input
                type="text"
                value={data.ourCompany.name}
                onChange={(e) => updateOurCompany('name', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-blue-200 dark:border-blue-700 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs text-blue-600 dark:text-blue-400 mb-1">Website</label>
              <input
                type="text"
                value={data.ourCompany.website}
                onChange={(e) => updateOurCompany('website', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-blue-200 dark:border-blue-700 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs text-blue-600 dark:text-blue-400 mb-1">Tagline</label>
              <input
                type="text"
                value={data.ourCompany.tagline}
                onChange={(e) => updateOurCompany('tagline', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-blue-200 dark:border-blue-700 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Competitors Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Competitors</h3>
            <button
              onClick={addCompetitor}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
              Add Competitor
            </button>
          </div>
          
          {data.competitors.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              No competitors added yet. Click "Add Competitor" to start.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {data.competitors.map((comp) => (
                <div 
                  key={comp.id} 
                  className="p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <input
                      type="text"
                      value={comp.name}
                      onChange={(e) => updateCompetitor(comp.id, 'name', e.target.value)}
                      className="flex-1 px-2 py-1 text-sm font-medium bg-transparent border-b border-zinc-200 dark:border-zinc-600 focus:border-blue-500 outline-none"
                      placeholder="Competitor name"
                    />
                    <button
                      onClick={() => removeCompetitor(comp.id)}
                      className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={comp.website}
                      onChange={(e) => updateCompetitor(comp.id, 'website', e.target.value)}
                      className="flex-1 px-2 py-1 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-600 rounded"
                      placeholder="Website URL"
                    />
                    {comp.website && (
                      <a 
                        href={comp.website.startsWith('http') ? comp.website : `https://${comp.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-zinc-400 hover:text-blue-500"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Management */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Comparison Categories</h3>
          <button
            onClick={addCategory}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>

        {/* Battlecard Matrix */}
        <div className="space-y-3">
          {data.categories.map((category) => (
            <div 
              key={category.id}
              className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden"
            >
              {/* Category Header */}
              <div 
                className="flex items-center gap-2 px-4 py-3 bg-zinc-50 dark:bg-zinc-900 cursor-pointer"
                onClick={() => toggleCategory(category.id)}
              >
                <GripVertical className="w-4 h-4 text-zinc-400" />
                {expandedCategories.has(category.id) ? (
                  <ChevronUp className="w-4 h-4 text-zinc-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-500" />
                )}
                <input
                  type="text"
                  value={category.name}
                  onChange={(e) => {
                    e.stopPropagation();
                    updateCategory(category.id, e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 bg-transparent font-medium text-zinc-900 dark:text-white outline-none"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCategory(category.id);
                  }}
                  className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded opacity-50 hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              {/* Category Content */}
              {expandedCategories.has(category.id) && (
                <div className="p-4 grid gap-4" style={{ 
                  gridTemplateColumns: `repeat(${1 + data.competitors.length}, minmax(200px, 1fr))` 
                }}>
                  {/* Our company column */}
                  <div>
                    <label className="block text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
                      {data.ourCompany.name}
                    </label>
                    <textarea
                      value={data.ourCompany.entries[category.id] || ''}
                      onChange={(e) => updateOurEntry(category.id, e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 text-sm bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg resize-none"
                      placeholder="Enter details..."
                    />
                  </div>
                  
                  {/* Competitor columns */}
                  {data.competitors.map((comp) => (
                    <div key={comp.id}>
                      <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                        {comp.name}
                      </label>
                      <textarea
                        value={comp.entries[category.id] || ''}
                        onChange={(e) => updateCompetitorEntry(comp.id, category.id, e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg resize-none"
                        placeholder="Enter details..."
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty state for categories */}
        {data.categories.length === 0 && (
          <div className="text-center py-12 text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
            No comparison categories. Click "Add Category" to start building your battlecard.
          </div>
        )}
      </div>

      {/* Version History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Version History</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="p-1 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {loadingVersions ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              ) : versions.length === 0 ? (
                <p className="text-center text-zinc-500 py-8">No version history available</p>
              ) : (
                <div className="space-y-2">
                  {versions.map((version) => (
                    <div 
                      key={version.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        version.version_number === currentVersion
                          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
                          : 'bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-zinc-900 dark:text-white">
                            Version {version.version_number}
                          </span>
                          {version.version_number === currentVersion && (
                            <span className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {new Date(version.created_at).toLocaleString()}
                        </p>
                        {version.change_notes && (
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                            {version.change_notes}
                          </p>
                        )}
                      </div>
                      
                      {version.version_number !== currentVersion && (
                        <button
                          onClick={() => restoreVersion(version.version_number)}
                          disabled={saving}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600"
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
    </div>
  );
}
