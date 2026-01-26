'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  MapPin, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Target,
  Eye,
  X,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  FileText,
  ArrowRight,
  Home
} from 'lucide-react';

// Dynamically import map component to avoid SSR issues with Leaflet
const OVGMapComponent = dynamic(() => import('@/components/OVGMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-900 rounded-lg flex items-center justify-center">
      <div className="text-gray-400">Loading map...</div>
    </div>
  ),
});

interface OVGSite {
  id: number;
  name: string;
  venue_type: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  status: 'contracted' | 'engaged' | 'prospect';
  notes: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
}

type SortField = 'status' | 'name' | 'venue_type' | 'location';
type SortDirection = 'asc' | 'desc';

export default function OVGMapPage() {
  const [sites, setSites] = useState<OVGSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSite, setSelectedSite] = useState<OVGSite | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showLegend, setShowLegend] = useState(true);
  const [sortField, setSortField] = useState<SortField>('status');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Generate session ID for tracking
  const getSessionId = useCallback(() => {
    if (typeof window === 'undefined') return '';
    let sessionId = sessionStorage.getItem('ovg-session-id');
    if (!sessionId) {
      sessionId = `ovg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('ovg-session-id', sessionId);
    }
    return sessionId;
  }, []);

  // Record page view on load
  const recordPageView = useCallback(async () => {
    try {
      await fetch('/api/ovg/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: getSessionId(),
          pagePath: '/ovg-map',
        }),
      });
    } catch (error) {
      console.log('Analytics recording failed:', error);
    }
  }, [getSessionId]);

  // Load sites on mount
  const loadSites = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ovg/sites');
      const data = await res.json();
      setSites(data.sites || []);
    } catch (error) {
      console.error('Failed to load sites:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load sites and record analytics on mount
  useEffect(() => {
    loadSites();
    recordPageView();
  }, [loadSites, recordPageView]);

  // Handle column sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon for column header
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 opacity-40" />;
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-4 h-4" /> 
      : <ArrowDown className="w-4 h-4" />;
  };

  // Status priority for sorting (contracted first, then engaged, then prospect)
  const statusPriority = { contracted: 1, engaged: 2, prospect: 3 };

  // Filter and sort sites
  const filteredSites = (filterStatus === 'all' 
    ? sites 
    : sites.filter(s => s.status === filterStatus)
  ).sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'status':
        comparison = statusPriority[a.status] - statusPriority[b.status];
        break;
      case 'name':
        comparison = (a.name || '').localeCompare(b.name || '');
        break;
      case 'venue_type':
        comparison = (a.venue_type || '').localeCompare(b.venue_type || '');
        break;
      case 'location':
        const locA = [a.city, a.state].filter(Boolean).join(', ');
        const locB = [b.city, b.state].filter(Boolean).join(', ');
        comparison = locA.localeCompare(locB);
        break;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Count by status
  const statusCounts = {
    contracted: sites.filter(s => s.status === 'contracted').length,
    engaged: sites.filter(s => s.status === 'engaged').length,
    prospect: sites.filter(s => s.status === 'prospect').length,
    total: sites.length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation Banner */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <Link href="/ovg" className="flex items-center gap-1.5 hover:text-blue-200 transition-colors">
                <Home className="w-4 h-4" />
                OVG Hub
              </Link>
              <span className="text-blue-300">|</span>
              <Link href="/case-studies/texas-tech" className="flex items-center gap-1.5 hover:text-blue-200 transition-colors">
                <FileText className="w-4 h-4" />
                Texas Tech Case Study
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <a href="mailto:sales@checkit.net" className="hidden sm:flex items-center gap-1.5 hover:text-blue-200 transition-colors">
              Contact Sales
            </a>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Oak View Group Territory Map</h1>
                <p className="text-sm text-gray-400">Checkit Engagement Status</p>
              </div>
            </div>
            
            {/* Status Summary */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-300">Contracted</span>
                <span className="font-bold text-white">{statusCounts.contracted}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-gray-300">Engaged</span>
                <span className="font-bold text-white">{statusCounts.engaged}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <span className="text-gray-300">Prospect</span>
                <span className="font-bold text-white">{statusCounts.prospect}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Filter:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Sites ({statusCounts.total})</option>
              <option value="contracted">Contracted ({statusCounts.contracted})</option>
              <option value="engaged">Engaged ({statusCounts.engaged})</option>
              <option value="prospect">Prospect ({statusCounts.prospect})</option>
            </select>
          </div>

          {/* Toggle Legend */}
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 hover:bg-gray-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            {showLegend ? 'Hide' : 'Show'} Legend
            {showLegend ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Legend (collapsible) */}
        {showLegend && (
          <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-400">Contracted</h3>
                  <p className="text-sm text-gray-400">Active Checkit customers with signed agreements</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-400">Engaged</h3>
                  <p className="text-sm text-gray-400">Active conversations, demos, or proposals in progress</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-300">Prospect</h3>
                  <p className="text-sm text-gray-400">Identified OVG venues not yet engaged</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map Container */}
        <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-xl">
          {loading ? (
            <div className="w-full h-[600px] flex items-center justify-center">
              <div className="text-gray-400">Loading venues...</div>
            </div>
          ) : (
            <OVGMapComponent 
              sites={filteredSites} 
              onSiteSelect={setSelectedSite}
            />
          )}
        </div>

        {/* Site List */}
        <div className="mt-6 bg-gray-800/50 rounded-xl border border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              Venue List ({filteredSites.length})
            </h2>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {filteredSites.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                No venues found.
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-900/50 sticky top-0">
                  <tr>
                    <th 
                      className="text-left px-4 py-3 text-sm font-medium text-gray-400 cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleSort('status')}
                    >
                      <span className="flex items-center gap-1">
                        Status {getSortIcon('status')}
                      </span>
                    </th>
                    <th 
                      className="text-left px-4 py-3 text-sm font-medium text-gray-400 cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <span className="flex items-center gap-1">
                        Venue {getSortIcon('name')}
                      </span>
                    </th>
                    <th 
                      className="text-left px-4 py-3 text-sm font-medium text-gray-400 hidden md:table-cell cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleSort('venue_type')}
                    >
                      <span className="flex items-center gap-1">
                        Type {getSortIcon('venue_type')}
                      </span>
                    </th>
                    <th 
                      className="text-left px-4 py-3 text-sm font-medium text-gray-400 hidden sm:table-cell cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleSort('location')}
                    >
                      <span className="flex items-center gap-1">
                        Location {getSortIcon('location')}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {filteredSites.map((site) => (
                    <tr 
                      key={site.id}
                      className="hover:bg-gray-700/30 cursor-pointer transition-colors"
                      onClick={() => setSelectedSite(site)}
                    >
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                          site.status === 'contracted' 
                            ? 'bg-green-500/20 text-green-400'
                            : site.status === 'engaged'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${
                            site.status === 'contracted' 
                              ? 'bg-green-500'
                              : site.status === 'engaged'
                              ? 'bg-yellow-500'
                              : 'bg-gray-500'
                          }`}></span>
                          {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-white font-medium">{site.name}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm hidden md:table-cell">
                        {site.venue_type || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm hidden sm:table-cell">
                        {[site.city, site.state].filter(Boolean).join(', ') || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Site Detail Modal */}
      {selectedSite && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl max-w-lg w-full border border-gray-700 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">{selectedSite.name}</h3>
              <button
                onClick={() => setSelectedSite(null)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                  selectedSite.status === 'contracted' 
                    ? 'bg-green-500/20 text-green-400'
                    : selectedSite.status === 'engaged'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-gray-500/20 text-gray-400'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    selectedSite.status === 'contracted' 
                      ? 'bg-green-500'
                      : selectedSite.status === 'engaged'
                      ? 'bg-yellow-500'
                      : 'bg-gray-500'
                  }`}></span>
                  {selectedSite.status.charAt(0).toUpperCase() + selectedSite.status.slice(1)}
                </span>
                {selectedSite.venue_type && (
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                    {selectedSite.venue_type}
                  </span>
                )}
              </div>

              {(selectedSite.address || selectedSite.city || selectedSite.state) && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Address</h4>
                  <p className="text-white">
                    {selectedSite.address && <span>{selectedSite.address}<br /></span>}
                    {[selectedSite.city, selectedSite.state, selectedSite.zip].filter(Boolean).join(', ')}
                  </p>
                </div>
              )}

              {selectedSite.notes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Notes</h4>
                  <p className="text-white text-sm">{selectedSite.notes}</p>
                </div>
              )}

              {selectedSite.contact_name && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Contact</h4>
                  <p className="text-white">{selectedSite.contact_name}</p>
                  {selectedSite.contact_email && (
                    <p className="text-blue-400 text-sm">{selectedSite.contact_email}</p>
                  )}
                  {selectedSite.contact_phone && (
                    <p className="text-gray-400 text-sm">{selectedSite.contact_phone}</p>
                  )}
                </div>
              )}

              {selectedSite.latitude && selectedSite.longitude && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Coordinates</h4>
                  <p className="text-gray-300 text-sm font-mono">
                    {selectedSite.latitude}, {selectedSite.longitude}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
