'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  BarChart3, 
  Users, 
  Eye, 
  MapPin, 
  Calendar,
  RefreshCw,
  Download,
  Globe,
  Clock,
  TrendingUp,
  FileText,
  Layers,
  Building2,
  CheckCircle2,
  Target,
  Maximize2
} from 'lucide-react';

// Dynamically import map component to avoid SSR issues with Leaflet
const OVGMapComponent = dynamic(() => import('@/components/OVGMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-900 rounded-lg flex items-center justify-center">
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

interface AnalyticsSummary {
  totalViews: number;
  uniqueVisitors: number;
  byLocation: Array<{
    visitor_city: string;
    visitor_region: string;
    visitor_country: string;
    views: number;
  }>;
  byDay: Array<{
    date: string;
    views: number;
  }>;
  byPage: Array<{
    page_path: string;
    views: number;
  }>;
  recentVisitors: Array<{
    visitor_ip: string;
    visitor_city: string;
    visitor_region: string;
    visitor_country: string;
    user_agent: string;
    first_visit: string;
    last_visit: string;
    page_count: number;
    pages_visited: string[];
  }>;
  sessionsByPageCount: Array<{
    page_count: number;
    session_count: number;
  }>;
}

interface SiteStats {
  byStatus: Array<{ status: string; count: number }>;
  byState: Array<{ state: string; count: number }>;
  byType: Array<{ venue_type: string; count: number }>;
}

export default function OVGAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [siteStats, setSiteStats] = useState<SiteStats | null>(null);
  const [sites, setSites] = useState<OVGSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [daysBack, setDaysBack] = useState(30);
  const [selectedSite, setSelectedSite] = useState<OVGSite | null>(null);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const [analyticsRes, sitesRes] = await Promise.all([
        fetch(`/api/ovg/analytics?view=summary&days=${daysBack}`),
        fetch('/api/ovg/sites'),
      ]);
      
      const analyticsData = await analyticsRes.json();
      const sitesData = await sitesRes.json();
      
      setAnalytics(analyticsData);
      
      // Store sites for the map
      const allSites = sitesData.sites || [];
      setSites(allSites);
      
      // Calculate site stats
      const sites = allSites;
      const byStatus: Record<string, number> = {};
      const byState: Record<string, number> = {};
      const byType: Record<string, number> = {};
      
      sites.forEach((site: { status: string; state: string; venue_type: string }) => {
        byStatus[site.status] = (byStatus[site.status] || 0) + 1;
        if (site.state) byState[site.state] = (byState[site.state] || 0) + 1;
        if (site.venue_type) byType[site.venue_type] = (byType[site.venue_type] || 0) + 1;
      });
      
      setSiteStats({
        byStatus: Object.entries(byStatus).map(([status, count]) => ({ status, count })),
        byState: Object.entries(byState)
          .map(([state, count]) => ({ state, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10),
        byType: Object.entries(byType)
          .map(([venue_type, count]) => ({ venue_type, count }))
          .sort((a, b) => b.count - a.count),
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [daysBack]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatUserAgent = (ua: string) => {
    if (!ua) return 'Unknown';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Other';
  };

  const formatPagePath = (path: string) => {
    const pageNames: Record<string, string> = {
      '/ovg': 'OVG Hub',
      '/case-studies/texas-tech': 'Texas Tech Case Study',
    };
    return pageNames[path] || path;
  };

  const getPageColor = (path: string) => {
    const colors: Record<string, string> = {
      '/ovg': 'bg-purple-500/20 text-purple-400',
      '/case-studies/texas-tech': 'bg-green-500/20 text-green-400',
    };
    return colors[path] || 'bg-gray-500/20 text-gray-400';
  };
  
  // Filter out map page from analytics display (only track hub and case study)
  const filteredByPage = analytics?.byPage?.filter(p => p.page_path !== '/ovg-map') || [];

  const exportCSV = () => {
    if (!analytics?.recentVisitors) return;
    
    const headers = ['First Visit', 'Last Visit', 'City', 'Region', 'Country', 'Browser', 'Pages Viewed', 'Pages'];
    const rows = analytics.recentVisitors.map(v => [
      new Date(v.first_visit).toISOString(),
      new Date(v.last_visit).toISOString(),
      v.visitor_city || 'Unknown',
      v.visitor_region || 'Unknown',
      v.visitor_country || 'Unknown',
      formatUserAgent(v.user_agent),
      v.page_count || 1,
      (v.pages_visited || []).map(p => formatPagePath(p)).join('; '),
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ovg-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">OBG Accounts</h1>
              <p className="text-gray-400">Account management and visitor tracking</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={daysBack}
              onChange={(e) => setDaysBack(parseInt(e.target.value))}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            
            <button
              onClick={() => loadAnalytics()}
              className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400 text-sm">Total Page Views</span>
            </div>
            <div className="text-3xl font-bold text-white">{analytics?.totalViews || 0}</div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-green-400" />
              <span className="text-gray-400 text-sm">Unique Visitors</span>
            </div>
            <div className="text-3xl font-bold text-white">{analytics?.uniqueVisitors || 0}</div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-400 text-sm">OVG Sites Tracked</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {siteStats?.byStatus?.reduce((sum, s) => sum + s.count, 0) || 0}
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <span className="text-gray-400 text-sm">Engagement Rate</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {siteStats?.byStatus?.find(s => s.status === 'engaged')?.count || 0}
              <span className="text-lg text-gray-400"> engaged</span>
            </div>
          </div>
        </div>

        {/* Site Status Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* By Status */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Sites by Status
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {siteStats?.byStatus?.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${
                      item.status === 'contracted' ? 'bg-green-500' :
                      item.status === 'engaged' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}></span>
                    <span className="text-gray-300 capitalize">{item.status}</span>
                  </div>
                  <span className="font-bold text-white">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* By Type */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-400" />
                Sites by Type
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {siteStats?.byType?.slice(0, 6).map((item) => (
                <div key={item.venue_type} className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">{item.venue_type}</span>
                  <span className="font-bold text-white">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* By State */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-400" />
                Top States
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {siteStats?.byState?.slice(0, 6).map((item) => (
                <div key={item.state} className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">{item.state}</span>
                  <span className="font-bold text-white">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Views by Page */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Views by Page
              </h2>
            </div>
            <div className="p-4">
              {filteredByPage.length > 0 ? (
                <div className="space-y-3">
                  {filteredByPage.map((page, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPageColor(page.page_path)}`}>
                        {formatPagePath(page.page_path)}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 rounded-full h-2"
                            style={{ width: `${Math.min(100, (Number(page.views) / Math.max(...filteredByPage.map(p => Number(p.views)))) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-white w-8 text-right">{page.views}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No page data yet</p>
              )}
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                Session Depth
              </h2>
            </div>
            <div className="p-4">
              {analytics?.sessionsByPageCount && analytics.sessionsByPageCount.length > 0 ? (
                <div className="space-y-3">
                  {analytics.sessionsByPageCount.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">
                        {Number(item.page_count) === 1 ? '1 page' : `${item.page_count} pages`}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-purple-500 rounded-full h-2"
                            style={{ width: `${Math.min(100, (Number(item.session_count) / Math.max(...analytics.sessionsByPageCount.map(s => Number(s.session_count)))) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-white w-8 text-right">{item.session_count} <span className="text-gray-500 font-normal text-xs">visitors</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No session data yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Visitor Location Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                Visitors by Location
              </h2>
            </div>
            <div className="p-4">
              {analytics?.byLocation && analytics.byLocation.length > 0 ? (
                <div className="space-y-3">
                  {analytics.byLocation.map((loc, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">
                        {[loc.visitor_city, loc.visitor_region, loc.visitor_country].filter(Boolean).join(', ')}
                      </span>
                      <span className="font-bold text-white">{loc.views}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No visitor data yet</p>
              )}
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-400" />
                Views by Day
              </h2>
            </div>
            <div className="p-4">
              {analytics?.byDay && analytics.byDay.length > 0 ? (
                <div className="space-y-3">
                  {analytics.byDay.slice(0, 10).map((day, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 rounded-full h-2"
                            style={{ width: `${Math.min(100, (Number(day.views) / Math.max(...analytics.byDay.map(d => Number(d.views)))) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-white w-8 text-right">{day.views}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No view data yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Visitors Table */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Recent Visitors
            </h2>
          </div>
          <div className="overflow-x-auto">
            {analytics?.recentVisitors && analytics.recentVisitors.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Last Visit</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Location</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400 hidden md:table-cell">Browser</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Pages Viewed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {analytics.recentVisitors.map((visitor, idx) => (
                    <tr key={idx} className="hover:bg-gray-700/30">
                      <td className="px-4 py-3 text-gray-300 text-sm">
                        {formatDate(visitor.last_visit)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-white">
                          {[visitor.visitor_city, visitor.visitor_region].filter(Boolean).join(', ') || 'Unknown'}
                        </span>
                        {visitor.visitor_country && (
                          <span className="text-gray-500 text-sm ml-2">({visitor.visitor_country})</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm hidden md:table-cell">
                        {formatUserAgent(visitor.user_agent)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(visitor.pages_visited || []).map((page, pidx) => (
                            <span 
                              key={pidx}
                              className={`px-2 py-0.5 rounded text-xs font-medium ${getPageColor(page)}`}
                            >
                              {formatPagePath(page)}
                            </span>
                          ))}
                          {visitor.page_count > 1 && (
                            <span className="text-gray-500 text-xs ml-1">
                              ({visitor.page_count} views)
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">
                No visitors yet. Share the OVG pages to start tracking.
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/case-studies/texas-tech"
            target="_blank"
            className="flex items-center gap-3 p-4 bg-green-900/30 rounded-xl border border-green-700/50 hover:bg-green-900/50 transition-colors group"
          >
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center group-hover:bg-green-500 transition-colors">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Texas Tech Case Study</h3>
              <p className="text-sm text-green-400/80">View success story</p>
            </div>
          </a>
          <a
            href="/ovg"
            target="_blank"
            className="flex items-center gap-3 p-4 bg-purple-900/30 rounded-xl border border-purple-700/50 hover:bg-purple-900/50 transition-colors group"
          >
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center group-hover:bg-purple-500 transition-colors">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">OVG Hub</h3>
              <p className="text-sm text-purple-400/80">View landing page</p>
            </div>
          </a>
        </div>

        {/* OVG Territory Map - Internal Only */}
        <div className="mt-8 bg-gray-800/50 rounded-xl border border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                OVG Territory Map
              </h2>
              <Link
                href="/ovg-map"
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm text-white transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
                Full Screen
              </Link>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-300">Contracted</span>
                  <span className="font-bold text-white">{siteStats?.byStatus?.find(s => s.status === 'contracted')?.count || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-gray-300">Engaged</span>
                  <span className="font-bold text-white">{siteStats?.byStatus?.find(s => s.status === 'engaged')?.count || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span className="text-gray-300">Prospect</span>
                  <span className="font-bold text-white">{siteStats?.byStatus?.find(s => s.status === 'prospect')?.count || 0}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Map */}
          <div className="p-4">
            <div className="rounded-lg overflow-hidden border border-gray-700">
              <OVGMapComponent 
                sites={sites} 
                onSiteSelect={setSelectedSite}
              />
            </div>
          </div>

          {/* Legend */}
          <div className="p-4 pt-0">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-3 bg-gray-900/50 rounded-lg p-3">
                <div className="w-6 h-6 bg-green-500/20 rounded flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <h4 className="font-medium text-green-400">Contracted</h4>
                  <p className="text-xs text-gray-500">Active customers with signed agreements</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-900/50 rounded-lg p-3">
                <div className="w-6 h-6 bg-yellow-500/20 rounded flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-yellow-500" />
                </div>
                <div>
                  <h4 className="font-medium text-yellow-400">Engaged</h4>
                  <p className="text-xs text-gray-500">Active conversations or proposals</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-900/50 rounded-lg p-3">
                <div className="w-6 h-6 bg-gray-500/20 rounded flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-300">Prospect</h4>
                  <p className="text-xs text-gray-500">Identified venues not yet engaged</p>
                </div>
              </div>
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
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                  ✕
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
