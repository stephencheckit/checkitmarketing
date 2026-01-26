'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { 
  Lock, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Target,
  Eye,
  X,
  ChevronDown,
  ChevronUp
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

// Password for access - in production this could be in env vars
const VALID_PASSWORDS = ['CHECKIT-OVG-2026', 'OVG2026'];

export default function OVGMapPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [sites, setSites] = useState<OVGSite[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSite, setSelectedSite] = useState<OVGSite | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showLegend, setShowLegend] = useState(true);
  const [pageViewId, setPageViewId] = useState<number | null>(null);

  // Generate session ID for tracking
  const getSessionId = useCallback(() => {
    let sessionId = sessionStorage.getItem('ovg-session-id');
    if (!sessionId) {
      sessionId = `ovg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('ovg-session-id', sessionId);
    }
    return sessionId;
  }, []);

  // Record page view when authenticated
  const recordPageView = useCallback(async (passwordUsed: string) => {
    try {
      const res = await fetch('/api/ovg/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passwordUsed,
          sessionId: getSessionId(),
          pagePath: '/ovg-map',
        }),
      });
      const data = await res.json();
      if (data.pageView?.id) {
        setPageViewId(data.pageView.id);
      }
    } catch (error) {
      console.log('Analytics recording failed:', error);
    }
  }, [getSessionId]);

  // Load sites after authentication
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

  // Check for saved auth in session storage
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('ovg-map-auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load sites when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadSites();
    }
  }, [isAuthenticated, loadSites]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (VALID_PASSWORDS.includes(password.toUpperCase())) {
      setIsAuthenticated(true);
      setPasswordError('');
      sessionStorage.setItem('ovg-map-auth', 'true');
      await recordPageView(password.toUpperCase());
    } else {
      setPasswordError('Invalid password. Please try again.');
    }
  };

  // Filter sites by status
  const filteredSites = filterStatus === 'all' 
    ? sites 
    : sites.filter(s => s.status === filterStatus);

  // Count by status
  const statusCounts = {
    contracted: sites.filter(s => s.status === 'contracted').length,
    engaged: sites.filter(s => s.status === 'engaged').length,
    prospect: sites.filter(s => s.status === 'prospect').length,
    total: sites.length,
  };

  // Password gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-gray-700">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">OVG Territory Map</h1>
              <p className="text-gray-400">
                This page is password protected. Please enter the access code to view the OVG engagement map.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Access Code
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter access code"
                  autoFocus
                />
                {passwordError && (
                  <p className="mt-2 text-sm text-red-400">{passwordError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Access Map
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-xs text-gray-500 text-center">
                Checkit Sales Enablement • Confidential
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
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
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-400">Contracted</h3>
                  <p className="text-sm text-gray-400">Active Checkit customers with signed agreements</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-400">Engaged</h3>
                  <p className="text-sm text-gray-400">Active conversations, demos, or proposals in progress</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
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
                No venues found. Use the API to add OVG venues.
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-900/50 sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Status</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Venue</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400 hidden md:table-cell">Type</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400 hidden sm:table-cell">Location</th>
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
