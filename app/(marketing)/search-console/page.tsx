'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Globe,
  TrendingUp,
  FileText,
  RefreshCw,
  ExternalLink,
  Clock,
  AlertCircle,
  Loader2,
  MousePointerClick,
  Eye,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

// Types
interface SearchQuery {
  id: number;
  site_url: string;
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface SearchPage {
  id: number;
  site_url: string;
  page_url: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface SearchSummary {
  totalClicks: number;
  totalImpressions: number;
  avgCtr: number;
  avgPosition: number;
  queriesTracked: number;
  pagesTracked: number;
  lastSyncedAt: string | null;
  lastSyncStatus: string | null;
}

// Temporary flag - set to true once Search Console is configured
const searchConsoleConfigured = true;

// Default site URL (change to your verified site)
const defaultSiteUrl = 'sc-domain:checkit.net';

export default function SearchConsolePage() {
  // State
  const [queries, setQueries] = useState<SearchQuery[]>([]);
  const [pages, setPages] = useState<SearchPage[]>([]);
  const [summary, setSummary] = useState<SearchSummary | null>(null);
  const [sites, setSites] = useState<string[]>([]);
  const [selectedSite, setSelectedSite] = useState(defaultSiteUrl);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [viewMode, setViewMode] = useState<'queries' | 'pages'>('queries');
  const [dateRange, setDateRange] = useState(28); // days
  const [sortField, setSortField] = useState<'clicks' | 'impressions' | 'ctr' | 'position'>('clicks');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Handle column sort
  const handleSort = (field: 'clicks' | 'impressions' | 'ctr' | 'position') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection(field === 'position' ? 'asc' : 'desc'); // Position: lower is better
    }
  };

  // Sort data
  const sortedQueries = [...queries].sort((a, b) => {
    const aVal = Number(a[sortField]) || 0;
    const bVal = Number(b[sortField]) || 0;
    return sortDirection === 'desc' ? bVal - aVal : aVal - bVal;
  });

  const sortedPages = [...pages].sort((a, b) => {
    const aVal = Number(a[sortField]) || 0;
    const bVal = Number(b[sortField]) || 0;
    return sortDirection === 'desc' ? bVal - aVal : aVal - bVal;
  });

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/search-console/sync?type=all&siteUrl=${encodeURIComponent(selectedSite)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch data');
      }
      const data = await response.json();
      setQueries(data.queries || []);
      setPages(data.pages || []);
      setSummary(data.summary || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [selectedSite]);

  // Fetch sites
  const fetchSites = useCallback(async () => {
    try {
      const response = await fetch('/api/search-console/sync?type=sites');
      const data = await response.json();
      if (data.sites && data.sites.length > 0) {
        setSites(data.sites);
        if (!data.sites.includes(selectedSite)) {
          setSelectedSite(data.sites[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch sites:', err);
    }
  }, [selectedSite]);

  // Sync data
  const syncData = useCallback(async () => {
    setSyncing(true);
    setError(null);
    try {
      const response = await fetch('/api/search-console/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteUrl: selectedSite, days: dateRange }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to sync');
      }
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync');
    } finally {
      setSyncing(false);
    }
  }, [selectedSite, dateRange, fetchData]);

  // Load data on mount (only if configured)
  useEffect(() => {
    if (searchConsoleConfigured) {
      fetchSites();
      fetchData();
    }
  }, [fetchSites, fetchData]);

  // Format CTR as percentage
  const formatCtr = (ctr: number | string | null) => {
    const num = Number(ctr) || 0;
    return `${(num * 100).toFixed(2)}%`;
  };

  // Format position
  const formatPosition = (pos: number | string | null) => {
    const num = Number(pos) || 0;
    return num.toFixed(1);
  };

  // Get position color
  const getPositionColor = (pos: number | string | null) => {
    const num = Number(pos) || 0;
    if (num <= 3) return 'text-green-400';
    if (num <= 10) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Search className="w-7 h-7 text-blue-500" />
              Search Console
            </h1>
            <p className="text-muted mt-1">
              Organic search performance and keywords
            </p>
          </div>
          {searchConsoleConfigured && (
            <div className="flex items-center gap-3">
              {sites.length > 1 && (
                <select
                  value={selectedSite}
                  onChange={(e) => setSelectedSite(e.target.value)}
                  className="px-3 py-2 bg-surface-elevated border border-border rounded-lg text-sm text-foreground"
                >
                  {sites.map((site) => (
                    <option key={site} value={site}>{site}</option>
                  ))}
                </select>
              )}
              <select
                value={dateRange}
                onChange={(e) => setDateRange(parseInt(e.target.value))}
                className="px-3 py-2 bg-surface-elevated border border-border rounded-lg text-sm text-foreground"
              >
                <option value={7}>Last 7 days</option>
                <option value={28}>Last 28 days</option>
                <option value={90}>Last 90 days</option>
              </select>
              <button
                onClick={syncData}
                disabled={syncing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {syncing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                {syncing ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>
          )}
        </div>

        {/* Not Configured Message */}
        {!searchConsoleConfigured && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-8 text-center mb-8">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">Configuration Required</h3>
            <p className="text-sm text-muted max-w-md mx-auto mb-4">
              To use Search Console, you need to get a refresh token with the webmasters.readonly scope.
              Use the same OAuth client as Google Ads.
            </p>
            <div className="text-left max-w-lg mx-auto bg-surface border border-border rounded-lg p-4 text-sm">
              <p className="font-medium text-foreground mb-2">Setup Steps:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted">
                <li>Enable Search Console API in Google Cloud Console</li>
                <li>Go to OAuth Playground with your OAuth credentials</li>
                <li>Authorize scope: <code className="text-accent">https://www.googleapis.com/auth/webmasters.readonly</code></li>
                <li>Get refresh token and add to <code className="text-accent">.env.local</code></li>
                <li>Set <code className="text-accent">searchConsoleConfigured = true</code> in this file</li>
              </ol>
            </div>
          </div>
        )}

        {/* Preview of what will be available */}
        {!searchConsoleConfigured && (
          <div className="space-y-6">
            {/* Preview Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface border border-border rounded-xl p-4 opacity-60">
                <div className="flex items-center gap-2 mb-2">
                  <MousePointerClick className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-muted">Total Clicks</span>
                </div>
                <div className="text-2xl font-bold text-foreground">-</div>
              </div>
              <div className="bg-surface border border-border rounded-xl p-4 opacity-60">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-muted">Impressions</span>
                </div>
                <div className="text-2xl font-bold text-foreground">-</div>
              </div>
              <div className="bg-surface border border-border rounded-xl p-4 opacity-60">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-muted">Avg CTR</span>
                </div>
                <div className="text-2xl font-bold text-foreground">-</div>
              </div>
              <div className="bg-surface border border-border rounded-xl p-4 opacity-60">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowUp className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-muted">Avg Position</span>
                </div>
                <div className="text-2xl font-bold text-foreground">-</div>
              </div>
            </div>

            {/* Preview Features */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4">Features Available</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3 p-4 bg-surface-elevated rounded-lg">
                  <Search className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Top Queries</h4>
                    <p className="text-sm text-muted">See what keywords bring organic traffic</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-surface-elevated rounded-lg">
                  <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Top Pages</h4>
                    <p className="text-sm text-muted">Which pages perform best in search</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-surface-elevated rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground">Position Tracking</h4>
                    <p className="text-sm text-muted">Monitor your ranking positions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Content (shown when configured) */}
        {searchConsoleConfigured && (
          <>
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
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-4" />
                <p className="text-muted">Loading Search Console data...</p>
              </div>
            )}

            {/* Summary Cards */}
            {!loading && summary && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-surface border border-border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MousePointerClick className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-muted">Total Clicks</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {summary.totalClicks.toLocaleString()}
                  </div>
                </div>
                <div className="bg-surface border border-border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-muted">Impressions</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {summary.totalImpressions.toLocaleString()}
                  </div>
                </div>
                <div className="bg-surface border border-border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-muted">Avg CTR</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {formatCtr(summary.avgCtr)}
                  </div>
                </div>
                <div className="bg-surface border border-border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUp className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-muted">Avg Position</span>
                  </div>
                  <div className={`text-2xl font-bold ${getPositionColor(summary.avgPosition)}`}>
                    {formatPosition(summary.avgPosition)}
                  </div>
                </div>
              </div>
            )}

            {/* View Toggle */}
            {!loading && (
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setViewMode('queries')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                    viewMode === 'queries'
                      ? 'bg-blue-500 text-white'
                      : 'bg-surface-elevated text-muted hover:text-foreground'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  Top Queries ({queries.length})
                </button>
                <button
                  onClick={() => setViewMode('pages')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                    viewMode === 'pages'
                      ? 'bg-blue-500 text-white'
                      : 'bg-surface-elevated text-muted hover:text-foreground'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Top Pages ({pages.length})
                </button>
              </div>
            )}

            {/* Queries Table */}
            {!loading && viewMode === 'queries' && (
              <div className="bg-surface border border-border rounded-xl overflow-hidden">
                {queries.length === 0 ? (
                  <div className="p-12 text-center">
                    <Search className="w-12 h-12 text-muted mx-auto mb-4" />
                    <p className="text-muted">No queries found. Sync data to see your top search queries.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left px-4 py-3 text-sm font-medium text-muted">Query</th>
                          <th className="text-right px-4 py-3 text-sm font-medium text-muted">
                            <button onClick={() => handleSort('clicks')} className="flex items-center gap-1 ml-auto hover:text-foreground">
                              Clicks {sortField === 'clicks' && (sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />)}
                            </button>
                          </th>
                          <th className="text-right px-4 py-3 text-sm font-medium text-muted">
                            <button onClick={() => handleSort('impressions')} className="flex items-center gap-1 ml-auto hover:text-foreground">
                              Impressions {sortField === 'impressions' && (sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />)}
                            </button>
                          </th>
                          <th className="text-right px-4 py-3 text-sm font-medium text-muted">
                            <button onClick={() => handleSort('ctr')} className="flex items-center gap-1 ml-auto hover:text-foreground">
                              CTR {sortField === 'ctr' && (sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />)}
                            </button>
                          </th>
                          <th className="text-right px-4 py-3 text-sm font-medium text-muted">
                            <button onClick={() => handleSort('position')} className="flex items-center gap-1 ml-auto hover:text-foreground">
                              Position {sortField === 'position' && (sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />)}
                            </button>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedQueries.map((query, index) => (
                          <tr key={query.id || index} className="border-b border-border/50 hover:bg-surface-elevated">
                            <td className="px-4 py-3">
                              <span className="text-foreground">{query.query}</span>
                            </td>
                            <td className="text-right px-4 py-3">
                              <span className="text-foreground font-medium">{query.clicks.toLocaleString()}</span>
                            </td>
                            <td className="text-right px-4 py-3">
                              <span className="text-muted">{query.impressions.toLocaleString()}</span>
                            </td>
                            <td className="text-right px-4 py-3">
                              <span className="text-muted">{formatCtr(query.ctr)}</span>
                            </td>
                            <td className="text-right px-4 py-3">
                              <span className={`font-medium ${getPositionColor(query.position)}`}>
                                {formatPosition(query.position)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Pages Table */}
            {!loading && viewMode === 'pages' && (
              <div className="bg-surface border border-border rounded-xl overflow-hidden">
                {pages.length === 0 ? (
                  <div className="p-12 text-center">
                    <FileText className="w-12 h-12 text-muted mx-auto mb-4" />
                    <p className="text-muted">No pages found. Sync data to see your top performing pages.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left px-4 py-3 text-sm font-medium text-muted">Page</th>
                          <th className="text-right px-4 py-3 text-sm font-medium text-muted">
                            <button onClick={() => handleSort('clicks')} className="flex items-center gap-1 ml-auto hover:text-foreground">
                              Clicks {sortField === 'clicks' && (sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />)}
                            </button>
                          </th>
                          <th className="text-right px-4 py-3 text-sm font-medium text-muted">
                            <button onClick={() => handleSort('impressions')} className="flex items-center gap-1 ml-auto hover:text-foreground">
                              Impressions {sortField === 'impressions' && (sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />)}
                            </button>
                          </th>
                          <th className="text-right px-4 py-3 text-sm font-medium text-muted">
                            <button onClick={() => handleSort('ctr')} className="flex items-center gap-1 ml-auto hover:text-foreground">
                              CTR {sortField === 'ctr' && (sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />)}
                            </button>
                          </th>
                          <th className="text-right px-4 py-3 text-sm font-medium text-muted">
                            <button onClick={() => handleSort('position')} className="flex items-center gap-1 ml-auto hover:text-foreground">
                              Position {sortField === 'position' && (sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />)}
                            </button>
                          </th>
                          <th className="px-4 py-3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedPages.map((page, index) => {
                          // Extract path from full URL
                          const path = page.page_url.replace(/^https?:\/\/[^\/]+/, '') || '/';
                          return (
                            <tr key={page.id || index} className="border-b border-border/50 hover:bg-surface-elevated">
                              <td className="px-4 py-3 max-w-md">
                                <span className="text-foreground truncate block" title={page.page_url}>
                                  {path}
                                </span>
                              </td>
                              <td className="text-right px-4 py-3">
                                <span className="text-foreground font-medium">{page.clicks.toLocaleString()}</span>
                              </td>
                              <td className="text-right px-4 py-3">
                                <span className="text-muted">{page.impressions.toLocaleString()}</span>
                              </td>
                              <td className="text-right px-4 py-3">
                                <span className="text-muted">{formatCtr(page.ctr)}</span>
                              </td>
                              <td className="text-right px-4 py-3">
                                <span className={`font-medium ${getPositionColor(page.position)}`}>
                                  {formatPosition(page.position)}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <a
                                  href={page.page_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted hover:text-foreground"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Last Synced */}
            {!loading && summary?.lastSyncedAt && (
              <p className="text-sm text-muted mt-4 text-center">
                Last synced: {new Date(summary.lastSyncedAt).toLocaleString()}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
