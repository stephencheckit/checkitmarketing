'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { 
  Megaphone,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Target,
  Users,
  Zap,
  Globe,
  Calendar,
  Handshake,
  Bot,
  Search,
  Linkedin,
  Mail,
  Video,
  Mic,
  MessageSquare,
  Building2,
  Star,
  AlertCircle,
  CheckCircle2,
  Clock,
  BarChart3,
  FileText,
  Plus,
  Minus,
  Sliders,
  PieChart,
  Sparkles,
  GripVertical,
  Eye,
  EyeOff,
  Calculator,
  Facebook,
  Twitter,
  Youtube,
  Upload,
  FileSpreadsheet,
  X,
  ArrowRight,
  Lightbulb,
  RefreshCw,
  MousePointerClick,
  Link2,
  Hash,
  Loader2
} from 'lucide-react';

// Google Ads types
interface GoogleAdsCampaign {
  id: number;
  campaign_id: string;
  name: string;
  status: string | null;
  budget_amount: number | null;
  spend_mtd: number | null;
  impressions: number;
  clicks: number;
  conversions: number;
  cost_per_conversion: number | null;
  ctr: number | null;
  synced_at: string;
}

interface GoogleAdsAd {
  id: number;
  ad_id: string;
  campaign_id: string;
  campaign_name: string | null;
  ad_group_name: string | null;
  headlines: string[];
  descriptions: string[];
  final_urls: string[];
  ad_strength: string | null;
  status: string | null;
  impressions: number;
  clicks: number;
  cost: number;
}

interface GoogleAdsKeyword {
  id: number;
  keyword_id: string;
  campaign_id: string;
  campaign_name: string | null;
  ad_group_name: string | null;
  keyword_text: string;
  match_type: string | null;
  quality_score: number | null;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  ctr: number | null;
  status: string | null;
}

interface GoogleAdsSummary {
  totalCampaigns: number;
  activeCampaigns: number;
  totalSpendMtd: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  lastSyncedAt: string | null;
  lastSyncStatus: string | null;
}

interface Channel {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  minBudget: number; // Minimum viable budget
  recommendedBudget: number; // Sweet spot
  effort: 'low' | 'medium' | 'high'; // Internal effort required
  timeToResults: 'fast' | 'medium' | 'slow'; // How long to see results
  checkitFit: 'high' | 'medium' | 'low';
  checkitNotes: string;
  pros: string[];
  cons: string[];
  tools: { name: string; url?: string }[];
}

const channels: Channel[] = [
  // Paid Digital
  {
    id: 'google-ads',
    name: 'Google Ads (Search)',
    category: 'Paid Digital',
    icon: Search,
    description: 'Capture high-intent buyers searching for solutions',
    minBudget: 1000,
    recommendedBudget: 3000,
    effort: 'medium',
    timeToResults: 'fast',
    checkitFit: 'high',
    checkitNotes: 'Start small with exact match on high-intent terms: "temperature monitoring software", "food safety compliance software". Even $1K/mo can generate quality leads if keywords are tight.',
    pros: ['High intent traffic', 'Immediate results', 'Precise targeting'],
    cons: ['Expensive CPCs ($15-50+)', 'Requires ongoing optimization'],
    tools: [{ name: 'Google Ads', url: 'https://ads.google.com' }]
  },
  {
    id: 'linkedin-ads',
    name: 'LinkedIn Ads',
    category: 'Paid Digital',
    icon: Linkedin,
    description: 'Target by job title, company, industry',
    minBudget: 500,
    recommendedBudget: 1500,
    effort: 'medium',
    timeToResults: 'medium',
    checkitFit: 'high',
    checkitNotes: 'You\'re running this now. Focus on: (1) Retargeting website visitors, (2) Sponsored content to Operations Directors. Test InMail sparingly. Watch CPL closely.',
    pros: ['Best B2B targeting', 'Retargeting is efficient', 'Supports BDR outreach'],
    cons: ['Very expensive CPMs ($30-80+)', 'Need tight audience to control spend'],
    tools: [{ name: 'LinkedIn Campaign Manager', url: 'https://business.linkedin.com' }]
  },
  {
    id: 'capterra-g2',
    name: 'Capterra / G2',
    category: 'Paid Digital',
    icon: Star,
    description: 'Software review sites where buyers compare',
    minBudget: 300,
    recommendedBudget: 800,
    effort: 'low',
    timeToResults: 'medium',
    checkitFit: 'high',
    checkitNotes: 'You\'re on Capterra now. Track CPL closely - can be expensive. Keep pushing for customer reviews (aim for 15+). Consider pausing PPC if CPL exceeds $150.',
    pros: ['Buyers actively comparing', 'Reviews build trust', 'Bottom-funnel intent'],
    cons: ['Expensive per lead ($50-150+)', 'Need consistent reviews to rank well'],
    tools: [{ name: 'Capterra', url: 'https://capterra.com' }, { name: 'G2', url: 'https://g2.com' }]
  },
  // Outbound
  {
    id: 'outbound-data',
    name: 'Sales Tools (Apollo + Phantom Buster)',
    category: 'Outbound',
    icon: Users,
    description: 'Contact data + LinkedIn automation for BDRs',
    minBudget: 200,
    recommendedBudget: 500,
    effort: 'low',
    timeToResults: 'fast',
    checkitFit: 'high',
    checkitNotes: 'Your current stack: Apollo ($99/user/mo) for data + sequences, Phantom Buster ($59-139/mo) for LinkedIn scraping/automation. Good combo for lean team.',
    pros: ['Contact data + sequences in Apollo', 'LinkedIn automation with Phantom Buster', 'Scales BDR productivity'],
    cons: ['LinkedIn automation has risk if overused', 'Requires BDR discipline'],
    tools: [{ name: 'Apollo.io', url: 'https://apollo.io' }, { name: 'Phantom Buster', url: 'https://phantombuster.com' }]
  },
  {
    id: 'outbound-engagement',
    name: 'Sales Engagement (Salesloft/Outreach)',
    category: 'Outbound',
    icon: Mail,
    description: 'Enterprise sequence tools',
    minBudget: 300,
    recommendedBudget: 1000,
    effort: 'low',
    timeToResults: 'fast',
    checkitFit: 'low',
    checkitNotes: 'Skip this - Apollo includes sequences. Only need Salesloft/Outreach when you have 5+ BDRs and need enterprise features.',
    pros: ['Advanced analytics', 'Dialer integration'],
    cons: ['Expensive ($125+/user/mo)', 'Overkill for small teams'],
    tools: [{ name: 'Salesloft', url: 'https://salesloft.com' }]
  },
  // Content & Organic
  {
    id: 'seo',
    name: 'SEO / Organic Content',
    category: 'Content & Organic',
    icon: Globe,
    description: 'Rank for relevant search terms organically',
    minBudget: 200,
    recommendedBudget: 800,
    effort: 'high',
    timeToResults: 'slow',
    checkitFit: 'high',
    checkitNotes: 'Your marketing person should own this. Budget is just for tools (Ahrefs lite $99/mo, Clearscope $170/mo). Write 2-4 pillar pages per vertical. Compounds over time.',
    pros: ['Compounds over time', 'Lower CAC long-term', 'Your person does the work'],
    cons: ['Takes 6-12+ months', 'Requires consistent publishing'],
    tools: [{ name: 'Ahrefs', url: 'https://ahrefs.com' }, { name: 'Clearscope', url: 'https://clearscope.io' }]
  },
  {
    id: 'linkedin-organic',
    name: 'LinkedIn Organic',
    category: 'Content & Organic',
    icon: Linkedin,
    description: 'Thought leadership and company presence',
    minBudget: 0,
    recommendedBudget: 0,
    effort: 'medium',
    timeToResults: 'medium',
    checkitFit: 'high',
    checkitNotes: 'FREE. Your marketing person + execs should post 2-3x/week. BDRs engage with prospects. No budget needed - just time.',
    pros: ['Free distribution', 'Builds brand', 'BDRs can engage prospects'],
    cons: ['Time-intensive', 'Hard to attribute revenue'],
    tools: [{ name: 'Shield Analytics', url: 'https://shieldapp.ai' }]
  },
  {
    id: 'facebook',
    name: 'Facebook / Meta',
    category: 'Content & Organic',
    icon: Facebook,
    description: 'Organic posts and paid ads on Facebook/Instagram',
    minBudget: 0,
    recommendedBudget: 500,
    effort: 'medium',
    timeToResults: 'medium',
    checkitFit: 'low',
    checkitNotes: 'Low priority for B2B. Your buyers aren\'t browsing Facebook for compliance software. Maybe useful for recruiting or very broad brand awareness. Skip paid unless testing.',
    pros: ['Large audience reach', 'Good retargeting', 'Cheaper CPMs than LinkedIn'],
    cons: ['B2B targeting is weak', 'Low intent audience', 'Better for B2C'],
    tools: [{ name: 'Meta Business Suite', url: 'https://business.facebook.com' }]
  },
  {
    id: 'twitter-x',
    name: 'Twitter / X',
    category: 'Content & Organic',
    icon: Twitter,
    description: 'Real-time updates and industry conversations',
    minBudget: 0,
    recommendedBudget: 0,
    effort: 'medium',
    timeToResults: 'slow',
    checkitFit: 'low',
    checkitNotes: 'Low priority. Food safety / compliance folks aren\'t active on X. Maybe useful for regulatory news amplification or exec thought leadership. Don\'t invest heavily.',
    pros: ['Free distribution', 'Real-time news sharing', 'Industry hashtags'],
    cons: ['Low B2B engagement', 'Platform in flux', 'Time sink for little return'],
    tools: [{ name: 'Twitter/X', url: 'https://twitter.com' }]
  },
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'Content & Organic',
    icon: Youtube,
    description: 'Video content - demos, tutorials, thought leadership',
    minBudget: 0,
    recommendedBudget: 500,
    effort: 'high',
    timeToResults: 'slow',
    checkitFit: 'medium',
    checkitNotes: 'Useful for product demos and customer testimonials. High effort to produce quality video. Start with simple screen recordings for demos. Don\'t overinvest until you have a library of content.',
    pros: ['Second largest search engine', 'Evergreen content', 'Repurpose for other channels', 'Good for product demos'],
    cons: ['High production effort', 'Slow to build audience', 'Requires consistent publishing'],
    tools: [{ name: 'YouTube Studio', url: 'https://studio.youtube.com' }, { name: 'Loom', url: 'https://loom.com' }]
  },
  // Events
  {
    id: 'webinars',
    name: 'Webinars',
    category: 'Events',
    icon: Video,
    description: 'Educational virtual events',
    minBudget: 0,
    recommendedBudget: 500,
    effort: 'medium',
    timeToResults: 'medium',
    checkitFit: 'medium',
    checkitNotes: 'Use Zoom (you probably have it). Co-host with a customer for credibility. Promotion cost is the main expense. Do 1 per quarter max.',
    pros: ['Scalable reach', 'Content repurposing', 'Lead capture'],
    cons: ['Webinar fatigue', 'Time to organize'],
    tools: [{ name: 'Zoom', url: 'https://zoom.us' }]
  },
  {
    id: 'trade-shows',
    name: 'Trade Shows',
    category: 'Events',
    icon: Calendar,
    description: 'Industry conferences and exhibitions',
    minBudget: 1000,
    recommendedBudget: 5000,
    effort: 'high',
    timeToResults: 'medium',
    checkitFit: 'high',
    checkitNotes: 'ATTEND first (badge + travel = ~$1-2K), don\'t exhibit ($10K+). NRA Show, LeadingAge are worth it. Book meetings in advance. Your BDRs can work the floor.',
    pros: ['Face-to-face relationships', 'Industry networking'],
    cons: ['Expensive to exhibit', 'Travel costs add up'],
    tools: []
  },
  // Partnerships
  {
    id: 'referral',
    name: 'Customer Referral Program',
    category: 'Partnerships',
    icon: Users,
    description: 'Incentivize customers to refer others',
    minBudget: 0,
    recommendedBudget: 0,
    effort: 'low',
    timeToResults: 'medium',
    checkitFit: 'high',
    checkitNotes: 'FREE to set up. Offer $500 credit or Amazon gift card for qualified referrals. Just needs a process - marketing person can run this.',
    pros: ['Highest trust leads', 'Zero CAC', 'Easy to start'],
    cons: ['Depends on happy customers', 'Unpredictable volume'],
    tools: []
  },
  {
    id: 'tech-partners',
    name: 'Technology Integrations',
    category: 'Partnerships',
    icon: Zap,
    description: 'Co-market with complementary products',
    minBudget: 0,
    recommendedBudget: 0,
    effort: 'medium',
    timeToResults: 'slow',
    checkitFit: 'medium',
    checkitNotes: 'Free but requires BD effort. Get listed in partner marketplaces (Toast, etc). Co-webinars cost nothing. Lower priority than direct channels.',
    pros: ['Access partner customers', 'Free co-marketing'],
    cons: ['Long relationship building', 'Dependent on partner priorities'],
    tools: []
  },
  // Industry Specific
  {
    id: 'trade-publications',
    name: 'Trade Publications',
    category: 'Industry',
    icon: FileText,
    description: 'Industry magazines and news sites',
    minBudget: 0,
    recommendedBudget: 500,
    effort: 'low',
    timeToResults: 'medium',
    checkitFit: 'medium',
    checkitNotes: 'Guest articles are FREE - pitch Food Safety Magazine, QSR Magazine, McKnights. Only pay for sponsored content when you have case studies to promote.',
    pros: ['Targeted industry audience', 'Editorial credibility'],
    cons: ['Hard to measure ROI', 'Long lead times for articles'],
    tools: [{ name: 'Food Safety Magazine', url: 'https://food-safety.com' }]
  },
  // Emerging
  {
    id: 'ai-seo',
    name: 'AI Discovery (ChatGPT/Perplexity)',
    category: 'Emerging',
    icon: Bot,
    description: 'Get mentioned in AI search responses',
    minBudget: 0,
    recommendedBudget: 0,
    effort: 'low',
    timeToResults: 'slow',
    checkitFit: 'low',
    checkitNotes: 'Don\'t spend money here yet. Your SEO content will naturally feed AI. Monitor for free by searching your category in ChatGPT/Perplexity periodically.',
    pros: ['Growing channel', 'Free to monitor'],
    cons: ['No direct way to influence', 'Hard to measure'],
    tools: []
  },
];

const categories = [
  { id: 'Paid Digital', color: 'bg-blue-500', textColor: 'text-blue-400' },
  { id: 'Outbound', color: 'bg-purple-500', textColor: 'text-purple-400' },
  { id: 'Content & Organic', color: 'bg-green-500', textColor: 'text-green-400' },
  { id: 'Events', color: 'bg-orange-500', textColor: 'text-orange-400' },
  { id: 'Partnerships', color: 'bg-pink-500', textColor: 'text-pink-400' },
  { id: 'Industry', color: 'bg-amber-500', textColor: 'text-amber-400' },
  { id: 'Emerging', color: 'bg-cyan-500', textColor: 'text-cyan-400' },
];

function formatCurrency(amount: number): string {
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}K`;
  }
  return `$${amount}`;
}

function EffortBadge({ effort }: { effort: Channel['effort'] }) {
  const styles = {
    low: 'bg-green-500/20 text-green-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    high: 'bg-red-500/20 text-red-400'
  };
  return (
    <span className={`px-2 py-0.5 text-xs rounded-full ${styles[effort]}`}>
      {effort} effort
    </span>
  );
}

function TimeBadge({ time }: { time: Channel['timeToResults'] }) {
  const styles = {
    fast: 'bg-green-500/20 text-green-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    slow: 'bg-orange-500/20 text-orange-400'
  };
  const labels = { fast: '< 1 month', medium: '1-3 months', slow: '3-6+ months' };
  return (
    <span className={`px-2 py-0.5 text-xs rounded-full ${styles[time]}`}>
      {labels[time]}
    </span>
  );
}

function FitIndicator({ fit }: { fit: Channel['checkitFit'] }) {
  const count = fit === 'high' ? 3 : fit === 'medium' ? 2 : 1;
  return (
    <div className="flex items-center gap-0.5" title={`${fit} fit for Checkit`}>
      {[1, 2, 3].map(i => (
        <div 
          key={i} 
          className={`w-2 h-2 rounded-full ${i <= count ? 'bg-accent' : 'bg-surface-elevated'}`} 
        />
      ))}
    </div>
  );
}

export default function ChannelsPage() {
  // Budget state - program spend only, not headcount
  const [totalBudget, setTotalBudget] = useState(3500); // Monthly program spend
  const [selectedChannels, setSelectedChannels] = useState<Record<string, number>>(() => {
    // Default selections matching actual Checkit spend
    return {
      'google-ads': 1500,
      'linkedin-ads': 800,
      'capterra-g2': 500,
      'outbound-data': 400, // Apollo + Phantom Buster
    };
  });
  
  // View state
  const [viewMode, setViewMode] = useState<'planner' | 'all' | 'analyze' | 'google-ads'>('planner');
  const [expandedChannel, setExpandedChannel] = useState<string | null>(null);
  
  // Google Ads state
  const [googleAdsData, setGoogleAdsData] = useState<{
    campaigns: GoogleAdsCampaign[];
    ads: GoogleAdsAd[];
    keywords: GoogleAdsKeyword[];
    summary: GoogleAdsSummary | null;
  }>({ campaigns: [], ads: [], keywords: [], summary: null });
  const [googleAdsLoading, setGoogleAdsLoading] = useState(false);
  const [googleAdsSyncing, setGoogleAdsSyncing] = useState(false);
  const [googleAdsError, setGoogleAdsError] = useState<string | null>(null);
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null);
  const [googleAdsSubView, setGoogleAdsSubView] = useState<'campaigns' | 'ads' | 'keywords'>('campaigns');
  
  // Fetch Google Ads data
  const fetchGoogleAdsData = useCallback(async () => {
    setGoogleAdsLoading(true);
    setGoogleAdsError(null);
    try {
      const response = await fetch('/api/google-ads/sync?type=all');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch Google Ads data');
      }
      const data = await response.json();
      setGoogleAdsData({
        campaigns: data.campaigns || [],
        ads: data.ads || [],
        keywords: data.keywords || [],
        summary: data.summary || null,
      });
    } catch (error) {
      setGoogleAdsError(error instanceof Error ? error.message : 'Failed to fetch data');
    } finally {
      setGoogleAdsLoading(false);
    }
  }, []);
  
  // Sync Google Ads data from API
  const syncGoogleAds = useCallback(async () => {
    setGoogleAdsSyncing(true);
    setGoogleAdsError(null);
    try {
      const response = await fetch('/api/google-ads/sync', { method: 'POST' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || 'Failed to sync Google Ads data');
      }
      // Refresh data after sync
      await fetchGoogleAdsData();
    } catch (error) {
      setGoogleAdsError(error instanceof Error ? error.message : 'Failed to sync data');
    } finally {
      setGoogleAdsSyncing(false);
    }
  }, [fetchGoogleAdsData]);
  
  // Load Google Ads data when switching to that tab
  // TEMPORARILY DISABLED - waiting for Google Ads API approval
  // useEffect(() => {
  //   if (viewMode === 'google-ads' && googleAdsData.campaigns.length === 0 && !googleAdsLoading) {
  //     fetchGoogleAdsData();
  //   }
  // }, [viewMode, googleAdsData.campaigns.length, googleAdsLoading, fetchGoogleAdsData]);
  
  // Temporary flag - set to true once Google Ads API is approved
  const googleAdsApiApproved = false;
  
  // File upload state
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedData, setUploadedData] = useState<Array<Record<string, string | number>> | null>(null);
  const [analysisResults, setAnalysisResults] = useState<{
    totalSpend: number;
    byChannel: Record<string, number>;
    byMonth?: Record<string, number>;
    insights: string[];
    unmappedRows: string[];
  } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Calculate totals
  const allocatedBudget = useMemo(() => {
    return Object.values(selectedChannels).reduce((sum, val) => sum + val, 0);
  }, [selectedChannels]);
  
  const remainingBudget = totalBudget - allocatedBudget;
  
  const selectedChannelsList = useMemo(() => {
    return channels.filter(c => selectedChannels[c.id] !== undefined);
  }, [selectedChannels]);
  
  const unselectedChannels = useMemo(() => {
    return channels.filter(c => selectedChannels[c.id] === undefined);
  }, [selectedChannels]);
  
  // Actions
  const toggleChannel = (channelId: string) => {
    if (selectedChannels[channelId] !== undefined) {
      const newSelected = { ...selectedChannels };
      delete newSelected[channelId];
      setSelectedChannels(newSelected);
    } else {
      const channel = channels.find(c => c.id === channelId);
      if (channel) {
        setSelectedChannels({
          ...selectedChannels,
          [channelId]: channel.minBudget
        });
      }
    }
  };
  
  const updateChannelBudget = (channelId: string, budget: number) => {
    setSelectedChannels({
      ...selectedChannels,
      [channelId]: Math.max(0, budget)
    });
  };
  
  const applyRecommendedMix = () => {
    // Suggest a mix based on budget - mirrors Checkit's actual approach
    const mix: Record<string, number> = {};
    
    if (totalBudget >= 8000) {
      // Growth budget - expand what's working
      mix['google-ads'] = Math.round(totalBudget * 0.35);
      mix['linkedin-ads'] = Math.round(totalBudget * 0.20);
      mix['capterra-g2'] = Math.round(totalBudget * 0.12);
      mix['outbound-data'] = 500; // Apollo + Phantom Buster
      mix['seo'] = Math.round(totalBudget * 0.10);
      mix['trade-shows'] = Math.round(totalBudget * 0.10); // Attend 1-2 events
      mix['linkedin-organic'] = 0;
      mix['referral'] = 0;
    } else if (totalBudget >= 4000) {
      // Your current range - optimize the core
      mix['google-ads'] = Math.round(totalBudget * 0.40);
      mix['linkedin-ads'] = Math.round(totalBudget * 0.20);
      mix['capterra-g2'] = Math.round(totalBudget * 0.15);
      mix['outbound-data'] = 400; // Apollo + Phantom Buster
      mix['seo'] = Math.round(totalBudget * 0.08);
      mix['linkedin-organic'] = 0;
      mix['referral'] = 0;
    } else if (totalBudget >= 2500) {
      // Lean - focus on highest ROI
      mix['google-ads'] = Math.round(totalBudget * 0.45);
      mix['linkedin-ads'] = Math.round(totalBudget * 0.18);
      mix['capterra-g2'] = Math.round(totalBudget * 0.12);
      mix['outbound-data'] = 300;
      mix['linkedin-organic'] = 0;
      mix['referral'] = 0;
    } else {
      // Very lean - cut to essentials
      mix['google-ads'] = Math.round(totalBudget * 0.55);
      mix['outbound-data'] = 250;
      mix['linkedin-organic'] = 0;
      mix['referral'] = 0;
    }
    
    setSelectedChannels(mix);
  };
  
  // Scale current mix proportionally to fit the budget
  const scaleToFitBudget = () => {
    if (allocatedBudget === 0) return;
    
    const scaleFactor = totalBudget / allocatedBudget;
    const newMix: Record<string, number> = {};
    
    Object.entries(selectedChannels).forEach(([id, amount]) => {
      // Round to nearest 50 for cleaner numbers
      newMix[id] = Math.round((amount * scaleFactor) / 50) * 50;
    });
    
    setSelectedChannels(newMix);
  };
  
  // Set budget to match current mix allocation
  const setBudgetFromMix = () => {
    // Round to nearest 100 for cleaner budget number
    setTotalBudget(Math.round(allocatedBudget / 100) * 100);
  };
  
  const clearAll = () => {
    setSelectedChannels({});
  };

  // Channel name mapping for analysis
  const channelNameMap: Record<string, string> = {
    'google': 'google-ads',
    'google ads': 'google-ads',
    'adwords': 'google-ads',
    'linkedin': 'linkedin-ads',
    'linkedin ads': 'linkedin-ads',
    'capterra': 'capterra-g2',
    'g2': 'capterra-g2',
    'g2 crowd': 'capterra-g2',
    'apollo': 'outbound-data',
    'phantom buster': 'outbound-data',
    'phantombuster': 'outbound-data',
    'zoominfo': 'outbound-data',
    'salesloft': 'outbound-engagement',
    'outreach': 'outbound-engagement',
    'seo': 'seo',
    'content': 'seo',
    'ahrefs': 'seo',
    'semrush': 'seo',
    'facebook': 'facebook',
    'meta': 'facebook',
    'instagram': 'facebook',
    'twitter': 'twitter-x',
    'x': 'twitter-x',
    'youtube': 'youtube',
    'webinar': 'webinars',
    'event': 'trade-shows',
    'trade show': 'trade-shows',
    'conference': 'trade-shows',
  };

  const mapChannelName = (name: string): string | null => {
    const normalized = name.toLowerCase().trim();
    
    // Direct match
    if (channelNameMap[normalized]) return channelNameMap[normalized];
    
    // Partial match
    for (const [key, value] of Object.entries(channelNameMap)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        return value;
      }
    }
    
    // Check against actual channel names
    const channel = channels.find(c => 
      c.name.toLowerCase().includes(normalized) || 
      normalized.includes(c.name.toLowerCase())
    );
    if (channel) return channel.id;
    
    return null;
  };

  const parseNumber = (value: string | number | undefined): number => {
    if (typeof value === 'number') return value;
    if (!value) return 0;
    // Remove currency symbols, commas, etc.
    const cleaned = String(value).replace(/[$£€,\s]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const analyzeData = useCallback((data: Array<Record<string, string | number>>) => {
    const byChannel: Record<string, number> = {};
    const byMonth: Record<string, number> = {};
    const unmappedRows: string[] = [];
    let totalSpend = 0;

    // Try to identify columns
    const firstRow = data[0] || {};
    const columns = Object.keys(firstRow);
    
    // Find channel/source column
    const channelCol = columns.find(col => 
      /channel|source|platform|campaign|medium/i.test(col)
    ) || columns[0];
    
    // Find spend/cost/amount column
    const spendCol = columns.find(col => 
      /spend|cost|amount|budget|total|value|£|\$/i.test(col)
    ) || columns[1];
    
    // Find date column (optional)
    const dateCol = columns.find(col => 
      /date|month|period|time/i.test(col)
    );

    data.forEach((row, idx) => {
      const channelName = String(row[channelCol] || '');
      const spend = parseNumber(row[spendCol]);
      const mappedChannel = mapChannelName(channelName);
      
      if (mappedChannel && spend > 0) {
        byChannel[mappedChannel] = (byChannel[mappedChannel] || 0) + spend;
        totalSpend += spend;
      } else if (spend > 0) {
        unmappedRows.push(`Row ${idx + 2}: "${channelName}" ($${spend})`);
      }
      
      // Track by month if date column exists
      if (dateCol && row[dateCol]) {
        const dateStr = String(row[dateCol]);
        const monthKey = dateStr.substring(0, 7); // YYYY-MM
        if (monthKey.match(/^\d{4}-\d{2}/)) {
          byMonth[monthKey] = (byMonth[monthKey] || 0) + spend;
        }
      }
    });

    // Generate insights
    const insights: string[] = [];
    
    // Total spend insight
    const monthlyAvg = Object.keys(byMonth).length > 0 
      ? totalSpend / Object.keys(byMonth).length 
      : totalSpend;
    insights.push(`Total spend: $${totalSpend.toLocaleString()}${Object.keys(byMonth).length > 1 ? ` across ${Object.keys(byMonth).length} months (avg $${Math.round(monthlyAvg).toLocaleString()}/mo)` : ''}`);
    
    // Top channel
    const sortedChannels = Object.entries(byChannel).sort((a, b) => b[1] - a[1]);
    if (sortedChannels.length > 0) {
      const [topChannelId, topSpend] = sortedChannels[0];
      const topChannel = channels.find(c => c.id === topChannelId);
      const pct = Math.round((topSpend / totalSpend) * 100);
      insights.push(`Top channel: ${topChannel?.name || topChannelId} at ${pct}% of spend ($${topSpend.toLocaleString()})`);
    }
    
    // Channel mix analysis
    const paidDigital = (byChannel['google-ads'] || 0) + (byChannel['linkedin-ads'] || 0) + (byChannel['capterra-g2'] || 0) + (byChannel['facebook'] || 0);
    const paidPct = totalSpend > 0 ? Math.round((paidDigital / totalSpend) * 100) : 0;
    if (paidPct > 80) {
      insights.push(`⚠️ ${paidPct}% on paid digital - consider diversifying into organic/content`);
    } else if (paidPct > 60) {
      insights.push(`Paid digital is ${paidPct}% of spend - healthy mix for demand capture`);
    }
    
    // Check for missing high-value channels
    if (!byChannel['google-ads'] || byChannel['google-ads'] < 500) {
      insights.push(`💡 Consider Google Ads for high-intent search traffic`);
    }
    if (!byChannel['outbound-data'] && !byChannel['outbound-engagement']) {
      insights.push(`💡 No outbound tools detected - Apollo/Phantom Buster can scale your BDRs`);
    }
    if (!byChannel['seo'] && !byChannel['linkedin-organic']) {
      insights.push(`💡 No organic/content spend - these compound over time`);
    }

    setAnalysisResults({
      totalSpend,
      byChannel,
      byMonth: Object.keys(byMonth).length > 0 ? byMonth : undefined,
      insights,
      unmappedRows: unmappedRows.slice(0, 10), // Limit to 10
    });
  }, []);

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setUploadError(null);
    
    const file = e.dataTransfer.files[0];
    if (!file) return;
    
    processFile(file);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    
    processFile(file);
  }, []);

  const processFile = useCallback((file: File) => {
    const isCSV = file.name.endsWith('.csv');
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    
    if (!isCSV && !isExcel) {
      setUploadError('Please upload a CSV or Excel file (.csv, .xlsx, .xls)');
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        let data: Array<Record<string, string | number>> = [];
        
        if (isCSV) {
          const text = event.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim());
          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          
          data = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
            const row: Record<string, string | number> = {};
            headers.forEach((header, idx) => {
              row[header] = values[idx] || '';
            });
            return row;
          });
        } else {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          data = XLSX.utils.sheet_to_json(sheet);
        }
        
        if (data.length === 0) {
          setUploadError('No data found in file');
          return;
        }
        
        setUploadedData(data);
        analyzeData(data);
        setViewMode('analyze');
      } catch (err) {
        setUploadError(`Error parsing file: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };
    
    reader.onerror = () => {
      setUploadError('Error reading file');
    };
    
    if (isCSV) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  }, [analyzeData]);

  const importAnalysisToPlanner = useCallback(() => {
    if (!analysisResults) return;
    
    // Calculate monthly average if we have multiple months
    const monthCount = analysisResults.byMonth ? Object.keys(analysisResults.byMonth).length : 1;
    const newChannels: Record<string, number> = {};
    
    Object.entries(analysisResults.byChannel).forEach(([channelId, total]) => {
      const monthly = Math.round(total / monthCount);
      if (monthly > 0) {
        newChannels[channelId] = monthly;
      }
    });
    
    setSelectedChannels(newChannels);
    const monthlyTotal = Math.round(analysisResults.totalSpend / monthCount);
    setTotalBudget(Math.round(monthlyTotal / 100) * 100); // Round to nearest 100
    setViewMode('planner');
  }, [analysisResults]);

  const clearAnalysis = () => {
    setUploadedData(null);
    setAnalysisResults(null);
    setUploadError(null);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Megaphone className="w-7 h-7" style={{ stroke: 'url(#icon-gradient)' }} />
            Budget Planner
          </h1>
          <p className="text-sm text-muted mt-1">
            Plan your program spend (tools, ads, events) • Headcount is separate
          </p>
        </div>
        
        {/* Team Context */}
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <h3 className="font-medium text-foreground">Your Setup</h3>
              <p className="text-sm text-muted mt-1">
                <strong>Headcount:</strong> 2 BDRs + 1 Marketing — separate from this budget<br/>
                <strong>Current channels:</strong> Google Ads, LinkedIn Ads, Capterra, Apollo, Phantom Buster<br/>
                <strong>Program spend:</strong> ~$30-50K/year (~$2.5-4K/month)
              </p>
            </div>
          </div>
        </div>

        {/* Budget Input */}
        <div className="bg-surface border border-border rounded-xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-end gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-muted mb-2">
                Monthly Marketing Budget
              </label>
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-xs">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                  <input
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full pl-10 pr-4 py-3 text-lg font-semibold bg-surface-elevated border border-border rounded-lg focus:outline-none focus:border-accent"
                    step={1000}
                  />
                </div>
                <span className="text-muted">/month</span>
              </div>
              
              {/* Quick budget presets */}
              <div className="flex flex-wrap gap-2 mt-3">
                {[2000, 3500, 5000, 8000, 15000].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setTotalBudget(amount)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      totalBudget === amount 
                        ? 'bg-accent text-white' 
                        : 'bg-surface-elevated text-muted hover:text-foreground'
                    }`}
                  >
                    {formatCurrency(amount)}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted mt-2">
                💡 This is program spend only (tools, ads, events) — not headcount
              </p>
            </div>
            
            {/* Budget Summary */}
            <div className="grid grid-cols-3 gap-4 lg:gap-6">
              <div className="text-center p-3 bg-surface-elevated rounded-lg">
                <div className="text-2xl font-bold text-foreground">{formatCurrency(totalBudget)}</div>
                <div className="text-xs text-muted">Total Budget</div>
              </div>
              <div className="text-center p-3 bg-surface-elevated rounded-lg">
                <div className={`text-2xl font-bold ${allocatedBudget > totalBudget ? 'text-red-400' : 'text-accent'}`}>
                  {formatCurrency(allocatedBudget)}
                </div>
                <div className="text-xs text-muted">Allocated</div>
              </div>
              <div className="text-center p-3 bg-surface-elevated rounded-lg">
                <div className={`text-2xl font-bold ${remainingBudget < 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {formatCurrency(Math.abs(remainingBudget))}
                </div>
                <div className="text-xs text-muted">{remainingBudget >= 0 ? 'Remaining' : 'Over Budget'}</div>
              </div>
            </div>
          </div>
          
          {/* Budget bar */}
          <div className="mt-4">
            <div className="h-3 bg-surface-elevated rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${allocatedBudget > totalBudget ? 'bg-red-500' : allocatedBudget === totalBudget ? 'bg-green-500' : 'bg-accent'}`}
                style={{ width: `${Math.min(100, (allocatedBudget / totalBudget) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs mt-2">
              <span className={allocatedBudget === totalBudget ? 'text-green-400' : 'text-muted'}>
                {allocatedBudget === totalBudget ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Budget matched
                  </span>
                ) : allocatedBudget > totalBudget ? (
                  <span className="text-red-400">{formatCurrency(allocatedBudget - totalBudget)} over budget</span>
                ) : (
                  <span>{formatCurrency(totalBudget - allocatedBudget)} unallocated</span>
                )}
              </span>
              <span className="text-muted">{formatCurrency(allocatedBudget * 12)}/year allocated</span>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={applyRecommendedMix}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Suggest Mix
          </button>
          
          {allocatedBudget !== totalBudget && allocatedBudget > 0 && (
            <>
              <button
                onClick={scaleToFitBudget}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-surface-elevated text-foreground rounded-lg hover:bg-surface border border-border transition-colors"
                title="Proportionally scale your mix to fit your budget"
              >
                <Sliders className="w-4 h-4" />
                Scale Mix to {formatCurrency(totalBudget)}
              </button>
              <button
                onClick={setBudgetFromMix}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-surface-elevated text-foreground rounded-lg hover:bg-surface border border-border transition-colors"
                title="Set your budget to match your current mix"
              >
                <Calculator className="w-4 h-4" />
                Set Budget to {formatCurrency(allocatedBudget)}
              </button>
            </>
          )}
          
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-foreground transition-colors"
          >
            Clear All
          </button>
          
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setViewMode('planner')}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                viewMode === 'planner' ? 'bg-accent text-white' : 'bg-surface-elevated text-muted hover:text-foreground'
              }`}
            >
              <Sliders className="w-4 h-4" />
              Planner
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                viewMode === 'all' ? 'bg-accent text-white' : 'bg-surface-elevated text-muted hover:text-foreground'
              }`}
            >
              <Eye className="w-4 h-4" />
              All Channels
            </button>
            <button
              onClick={() => setViewMode('analyze')}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                viewMode === 'analyze' ? 'bg-accent text-white' : 'bg-surface-elevated text-muted hover:text-foreground'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Analyze
            </button>
            <button
              onClick={() => setViewMode('google-ads')}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                viewMode === 'google-ads' ? 'bg-accent text-white' : 'bg-surface-elevated text-muted hover:text-foreground'
              }`}
            >
              <Search className="w-4 h-4" />
              Google Ads
            </button>
          </div>
        </div>
        
        {viewMode === 'planner' ? (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Selected Channels */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                Your Channel Mix
                <span className="text-sm font-normal text-muted">({selectedChannelsList.length} channels)</span>
              </h2>
              
              {selectedChannelsList.length === 0 ? (
                <div className="bg-surface border border-border rounded-xl p-8 text-center">
                  <PieChart className="w-12 h-12 mx-auto text-muted/30 mb-4" />
                  <p className="text-muted mb-2">No channels selected yet</p>
                  <p className="text-sm text-muted/70">Click "Suggest Mix" or add channels from the list</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedChannelsList.map(channel => {
                    const Icon = channel.icon;
                    const budget = selectedChannels[channel.id] || 0;
                    const isExpanded = expandedChannel === channel.id;
                    const categoryColor = categories.find(c => c.id === channel.category);
                    const percentOfBudget = totalBudget > 0 ? Math.round((budget / totalBudget) * 100) : 0;
                    
                    return (
                      <div 
                        key={channel.id}
                        className="bg-surface border border-border rounded-xl overflow-hidden"
                      >
                        <div className="p-4">
                          <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-lg ${categoryColor?.color}/20 flex items-center justify-center shrink-0`}>
                              <Icon className={`w-5 h-5 ${categoryColor?.textColor}`} />
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-foreground">{channel.name}</h3>
                                <FitIndicator fit={channel.checkitFit} />
                              </div>
                              <p className="text-sm text-muted">{channel.description}</p>
                              
                              {/* Budget Slider */}
                              <div className="mt-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-muted">Budget: {formatCurrency(budget)}/mo ({percentOfBudget}%)</span>
                                  <span className="text-xs text-muted">
                                    Min: {formatCurrency(channel.minBudget)} • Rec: {formatCurrency(channel.recommendedBudget)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <input
                                    type="range"
                                    min={0}
                                    max={Math.max(channel.recommendedBudget * 2, totalBudget * 0.5)}
                                    step={100}
                                    value={budget}
                                    onChange={(e) => updateChannelBudget(channel.id, parseInt(e.target.value))}
                                    className="flex-1 h-2 bg-surface-elevated rounded-lg appearance-none cursor-pointer accent-accent"
                                  />
                                  <input
                                    type="number"
                                    value={budget}
                                    onChange={(e) => updateChannelBudget(channel.id, parseInt(e.target.value) || 0)}
                                    className="w-20 px-2 py-1 text-sm text-right bg-surface-elevated border border-border rounded focus:outline-none focus:border-accent"
                                    step={100}
                                  />
                                </div>
                                {budget < channel.minBudget && budget > 0 && (
                                  <p className="text-xs text-yellow-400 mt-1">
                                    ⚠️ Below minimum viable budget ({formatCurrency(channel.minBudget)})
                                  </p>
                                )}
                              </div>
                              
                              {/* Tags */}
                              <div className="flex items-center gap-2 mt-3">
                                <EffortBadge effort={channel.effort} />
                                <TimeBadge time={channel.timeToResults} />
                                <button
                                  onClick={() => setExpandedChannel(isExpanded ? null : channel.id)}
                                  className="text-xs text-accent hover:underline ml-auto"
                                >
                                  {isExpanded ? 'Less' : 'More'}
                                </button>
                              </div>
                            </div>
                            
                            {/* Remove */}
                            <button
                              onClick={() => toggleChannel(channel.id)}
                              className="p-2 text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors shrink-0"
                              title="Remove from mix"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {/* Expanded Details */}
                          {isExpanded && (
                            <div className="mt-4 pt-4 border-t border-border space-y-3">
                              <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                                <p className="text-sm text-accent">
                                  <strong>Checkit Strategy:</strong> {channel.checkitNotes}
                                </p>
                              </div>
                              
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-xs font-medium text-muted mb-2 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3 text-green-400" /> Pros
                                  </h4>
                                  <ul className="space-y-1">
                                    {channel.pros.map((pro, i) => (
                                      <li key={i} className="text-xs text-foreground/80 flex items-start gap-1">
                                        <CheckCircle2 className="w-3 h-3 mt-0.5 text-green-400 shrink-0" />
                                        {pro}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="text-xs font-medium text-muted mb-2 flex items-center gap-1">
                                    <TrendingDown className="w-3 h-3 text-red-400" /> Cons
                                  </h4>
                                  <ul className="space-y-1">
                                    {channel.cons.map((con, i) => (
                                      <li key={i} className="text-xs text-foreground/80 flex items-start gap-1">
                                        <AlertCircle className="w-3 h-3 mt-0.5 text-red-400 shrink-0" />
                                        {con}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-xs font-medium text-muted mb-2">Tools</h4>
                                <div className="flex flex-wrap gap-2">
                                  {channel.tools.map((tool, i) => (
                                    tool.url ? (
                                      <a
                                        key={i}
                                        href={tool.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 px-2 py-1 text-xs bg-surface-elevated text-accent hover:bg-accent/20 rounded transition-colors"
                                      >
                                        {tool.name}
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    ) : (
                                      <span key={i} className="px-2 py-1 text-xs bg-surface-elevated text-muted rounded">
                                        {tool.name}
                                      </span>
                                    )
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Available Channels */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Plus className="w-5 h-5 text-muted" />
                Add Channels
              </h2>
              
              <div className="space-y-2">
                {categories.map(category => {
                  const categoryChannels = unselectedChannels.filter(c => c.category === category.id);
                  if (categoryChannels.length === 0) return null;
                  
                  return (
                    <div key={category.id}>
                      <h3 className={`text-xs font-medium ${category.textColor} mb-2`}>{category.id}</h3>
                      {categoryChannels.map(channel => {
                        const Icon = channel.icon;
                        return (
                          <button
                            key={channel.id}
                            onClick={() => toggleChannel(channel.id)}
                            className="w-full flex items-center gap-3 p-3 bg-surface border border-border rounded-lg hover:border-accent/30 transition-colors text-left mb-2"
                          >
                            <Icon className={`w-4 h-4 ${category.textColor}`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-foreground">{channel.name}</span>
                                <FitIndicator fit={channel.checkitFit} />
                              </div>
                              <span className="text-xs text-muted">
                                Min: {formatCurrency(channel.minBudget)}/mo
                              </span>
                            </div>
                            <Plus className="w-4 h-4 text-accent" />
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
                
                {unselectedChannels.length === 0 && (
                  <div className="p-4 bg-surface-elevated rounded-lg text-center">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-green-400 mb-2" />
                    <p className="text-sm text-muted">All channels added!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* All Channels View */
          <div className="space-y-6">
            {categories.map(category => {
              const categoryChannels = channels.filter(c => c.category === category.id);
              if (categoryChannels.length === 0) return null;
              
              return (
                <div key={category.id}>
                  <h2 className={`text-lg font-semibold ${category.textColor} mb-3 flex items-center gap-2`}>
                    <span className={`w-3 h-3 rounded-full ${category.color}`} />
                    {category.id}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {categoryChannels.map(channel => {
                      const Icon = channel.icon;
                      const isSelected = selectedChannels[channel.id] !== undefined;
                      
                      return (
                        <div
                          key={channel.id}
                          className={`bg-surface border rounded-xl p-4 transition-colors ${
                            isSelected ? 'border-accent/50' : 'border-border'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg ${category.color}/20 flex items-center justify-center shrink-0`}>
                              <Icon className={`w-5 h-5 ${category.textColor}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-foreground">{channel.name}</h3>
                                <FitIndicator fit={channel.checkitFit} />
                                {isSelected && (
                                  <span className="px-2 py-0.5 text-xs bg-accent/20 text-accent rounded-full">
                                    In Mix
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted mb-2">{channel.description}</p>
                              <div className="flex items-center gap-2 text-xs text-muted mb-2">
                                <span>Min: {formatCurrency(channel.minBudget)}</span>
                                <span>•</span>
                                <span>Recommended: {formatCurrency(channel.recommendedBudget)}</span>
                              </div>
                              <div className="flex items-center gap-2 mb-3">
                                <EffortBadge effort={channel.effort} />
                                <TimeBadge time={channel.timeToResults} />
                              </div>
                              <p className="text-xs text-accent bg-accent/10 p-2 rounded">
                                {channel.checkitNotes}
                              </p>
                            </div>
                            <button
                              onClick={() => toggleChannel(channel.id)}
                              className={`p-2 rounded-lg transition-colors shrink-0 ${
                                isSelected 
                                  ? 'text-red-400 hover:bg-red-400/10' 
                                  : 'text-accent hover:bg-accent/10'
                              }`}
                            >
                              {isSelected ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Analyze View */}
        {viewMode === 'analyze' && (
          <div className="space-y-6">
            {/* Drop Zone */}
            {!analysisResults && (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                  isDragging 
                    ? 'border-accent bg-accent/10' 
                    : 'border-border hover:border-accent/50 hover:bg-surface-elevated/50'
                }`}
              >
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-accent' : 'text-muted/50'}`} />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Drop your spend data here
                </h3>
                <p className="text-sm text-muted mb-4">
                  or click to browse • CSV or Excel (.xlsx, .xls)
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <FileSpreadsheet className="w-4 h-4" />
                    Export from Google Ads, LinkedIn, etc.
                  </span>
                </div>
                
                {uploadError && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
                    {uploadError}
                  </div>
                )}
              </div>
            )}

            {/* Analysis Results */}
            {analysisResults && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-accent" />
                      Spend Analysis
                    </h2>
                    <p className="text-sm text-muted">
                      {uploadedData?.length || 0} rows analyzed
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={importAnalysisToPlanner}
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                      Import to Planner
                    </button>
                    <button
                      onClick={clearAnalysis}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Clear
                    </button>
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-surface border border-border rounded-xl p-4">
                    <div className="text-2xl font-bold text-foreground">
                      ${analysisResults.totalSpend.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted">Total Spend</div>
                  </div>
                  <div className="bg-surface border border-border rounded-xl p-4">
                    <div className="text-2xl font-bold text-foreground">
                      {Object.keys(analysisResults.byChannel).length}
                    </div>
                    <div className="text-sm text-muted">Channels Detected</div>
                  </div>
                  <div className="bg-surface border border-border rounded-xl p-4">
                    <div className="text-2xl font-bold text-foreground">
                      {analysisResults.byMonth ? Object.keys(analysisResults.byMonth).length : 1}
                    </div>
                    <div className="text-sm text-muted">
                      {analysisResults.byMonth ? 'Months of Data' : 'Data Period'}
                    </div>
                  </div>
                </div>

                {/* Insights */}
                <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
                  <h3 className="font-medium text-foreground flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-accent" />
                    Insights
                  </h3>
                  <ul className="space-y-2">
                    {analysisResults.insights.map((insight, idx) => (
                      <li key={idx} className="text-sm text-foreground/80">
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Channel Breakdown */}
                <div className="bg-surface border border-border rounded-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-border bg-surface-elevated">
                    <h3 className="font-medium text-foreground">Spend by Channel</h3>
                  </div>
                  <div className="divide-y divide-border">
                    {Object.entries(analysisResults.byChannel)
                      .sort((a, b) => b[1] - a[1])
                      .map(([channelId, spend]) => {
                        const channel = channels.find(c => c.id === channelId);
                        const pct = Math.round((spend / analysisResults.totalSpend) * 100);
                        const Icon = channel?.icon || DollarSign;
                        
                        return (
                          <div key={channelId} className="px-4 py-3 flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-surface-elevated flex items-center justify-center">
                              <Icon className="w-4 h-4 text-accent" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-foreground">
                                  {channel?.name || channelId}
                                </span>
                                <span className="text-sm text-muted">
                                  ${spend.toLocaleString()} ({pct}%)
                                </span>
                              </div>
                              <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-accent transition-all"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Monthly Breakdown (if available) */}
                {analysisResults.byMonth && Object.keys(analysisResults.byMonth).length > 1 && (
                  <div className="bg-surface border border-border rounded-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-border bg-surface-elevated">
                      <h3 className="font-medium text-foreground">Spend by Month</h3>
                    </div>
                    <div className="p-4">
                      <div className="flex items-end gap-2 h-32">
                        {Object.entries(analysisResults.byMonth)
                          .sort((a, b) => a[0].localeCompare(b[0]))
                          .map(([month, spend]) => {
                            const maxSpend = Math.max(...Object.values(analysisResults.byMonth!));
                            const height = (spend / maxSpend) * 100;
                            return (
                              <div key={month} className="flex-1 flex flex-col items-center gap-1">
                                <div 
                                  className="w-full bg-accent rounded-t transition-all"
                                  style={{ height: `${height}%` }}
                                  title={`$${spend.toLocaleString()}`}
                                />
                                <span className="text-xs text-muted">
                                  {month.substring(5)}
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Unmapped Rows Warning */}
                {analysisResults.unmappedRows.length > 0 && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <h3 className="font-medium text-yellow-400 flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4" />
                      Couldn&apos;t map {analysisResults.unmappedRows.length} rows
                    </h3>
                    <ul className="text-sm text-yellow-400/80 space-y-1">
                      {analysisResults.unmappedRows.map((row, idx) => (
                        <li key={idx}>{row}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Data Preview */}
                {uploadedData && uploadedData.length > 0 && (
                  <details className="bg-surface border border-border rounded-xl overflow-hidden">
                    <summary className="px-4 py-3 cursor-pointer text-sm text-muted hover:text-foreground">
                      View raw data ({uploadedData.length} rows)
                    </summary>
                    <div className="p-4 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            {Object.keys(uploadedData[0]).map(col => (
                              <th key={col} className="px-2 py-1 text-left text-muted font-medium">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {uploadedData.slice(0, 20).map((row, idx) => (
                            <tr key={idx} className="border-b border-border/50">
                              {Object.values(row).map((val, i) => (
                                <td key={i} className="px-2 py-1 text-foreground/80">
                                  {String(val)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {uploadedData.length > 20 && (
                        <p className="text-xs text-muted mt-2">
                          Showing first 20 of {uploadedData.length} rows
                        </p>
                      )}
                    </div>
                  </details>
                )}
              </div>
            )}

            {/* Example Format */}
            {!analysisResults && (
              <div className="bg-surface border border-border rounded-xl p-4">
                <h3 className="font-medium text-foreground mb-3">Expected Format</h3>
                <p className="text-sm text-muted mb-3">
                  Your file should have columns for channel/source and spend/cost. Date column is optional.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-3 py-2 text-left text-muted">Channel</th>
                        <th className="px-3 py-2 text-left text-muted">Spend</th>
                        <th className="px-3 py-2 text-left text-muted">Date (optional)</th>
                      </tr>
                    </thead>
                    <tbody className="text-foreground/80">
                      <tr className="border-b border-border/50">
                        <td className="px-3 py-2">Google Ads</td>
                        <td className="px-3 py-2">$1,500</td>
                        <td className="px-3 py-2">2024-01</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="px-3 py-2">LinkedIn</td>
                        <td className="px-3 py-2">$800</td>
                        <td className="px-3 py-2">2024-01</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2">Capterra</td>
                        <td className="px-3 py-2">$500</td>
                        <td className="px-3 py-2">2024-01</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Google Ads View */}
        {viewMode === 'google-ads' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Search className="w-5 h-5 text-accent" />
                  Google Ads Dashboard
                </h2>
                <p className="text-sm text-muted">
                  {googleAdsData.summary?.lastSyncedAt 
                    ? `Last synced: ${new Date(googleAdsData.summary.lastSyncedAt).toLocaleString()}`
                    : 'Not synced yet'
                  }
                </p>
              </div>
              {googleAdsApiApproved && (
                <button
                  onClick={syncGoogleAds}
                  disabled={googleAdsSyncing}
                  className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50"
                >
                  {googleAdsSyncing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  {googleAdsSyncing ? 'Syncing...' : 'Sync Now'}
                </button>
              )}
            </div>

            {/* Pending Approval Message */}
            {!googleAdsApiApproved && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">Pending API Approval</h3>
                <p className="text-sm text-muted max-w-md mx-auto mb-4">
                  Your Google Ads API access request has been submitted and is awaiting approval from Google. 
                  This typically takes 1-3 business days.
                </p>
                <p className="text-xs text-muted">
                  Once approved, this dashboard will display your campaigns, ads, keywords, and performance metrics.
                </p>
              </div>
            )}

            {/* Error Alert */}
            {googleAdsApiApproved && googleAdsError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <h3 className="font-medium text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Error
                </h3>
                <p className="text-sm text-red-400/80 mt-1">{googleAdsError}</p>
              </div>
            )}

            {/* Loading State */}
            {googleAdsApiApproved && googleAdsLoading && (
              <div className="bg-surface border border-border rounded-xl p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-accent mb-4" />
                <p className="text-muted">Loading Google Ads data...</p>
              </div>
            )}

            {/* Summary Cards */}
            {googleAdsApiApproved && !googleAdsLoading && googleAdsData.summary && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-surface border border-border rounded-xl p-4">
                  <div className="text-2xl font-bold text-foreground">
                    ${(googleAdsData.summary.totalSpendMtd || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-sm text-muted">Spend (MTD)</div>
                </div>
                <div className="bg-surface border border-border rounded-xl p-4">
                  <div className="text-2xl font-bold text-foreground">
                    {googleAdsData.summary.activeCampaigns}
                  </div>
                  <div className="text-sm text-muted">Active Campaigns</div>
                </div>
                <div className="bg-surface border border-border rounded-xl p-4">
                  <div className="text-2xl font-bold text-foreground">
                    {(googleAdsData.summary.totalClicks || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted">Clicks</div>
                </div>
                <div className="bg-surface border border-border rounded-xl p-4">
                  <div className="text-2xl font-bold text-foreground">
                    {(googleAdsData.summary.totalConversions || 0).toLocaleString(undefined, { maximumFractionDigits: 1 })}
                  </div>
                  <div className="text-sm text-muted">Conversions</div>
                </div>
              </div>
            )}

            {/* Sub-navigation */}
            {googleAdsApiApproved && !googleAdsLoading && (
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <button
                  onClick={() => setGoogleAdsSubView('campaigns')}
                  className={`px-4 py-2 text-sm rounded-t-lg transition-colors ${
                    googleAdsSubView === 'campaigns' 
                      ? 'bg-surface border border-b-0 border-border text-foreground' 
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Campaigns ({googleAdsData.campaigns.length})
                  </span>
                </button>
                <button
                  onClick={() => setGoogleAdsSubView('ads')}
                  className={`px-4 py-2 text-sm rounded-t-lg transition-colors ${
                    googleAdsSubView === 'ads' 
                      ? 'bg-surface border border-b-0 border-border text-foreground' 
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Ads ({googleAdsData.ads.length})
                  </span>
                </button>
                <button
                  onClick={() => setGoogleAdsSubView('keywords')}
                  className={`px-4 py-2 text-sm rounded-t-lg transition-colors ${
                    googleAdsSubView === 'keywords' 
                      ? 'bg-surface border border-b-0 border-border text-foreground' 
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Keywords ({googleAdsData.keywords.length})
                  </span>
                </button>
              </div>
            )}

            {/* Campaigns Table */}
            {googleAdsApiApproved && !googleAdsLoading && googleAdsSubView === 'campaigns' && (
              <div className="bg-surface border border-border rounded-xl overflow-hidden">
                {googleAdsData.campaigns.length === 0 ? (
                  <div className="p-8 text-center">
                    <Search className="w-12 h-12 mx-auto text-muted/30 mb-4" />
                    <p className="text-muted">No campaigns found</p>
                    <p className="text-sm text-muted/70 mt-1">Click &quot;Sync Now&quot; to fetch data from Google Ads</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-surface-elevated">
                          <th className="px-4 py-3 text-left text-muted font-medium">Campaign</th>
                          <th className="px-4 py-3 text-left text-muted font-medium">Status</th>
                          <th className="px-4 py-3 text-right text-muted font-medium">Budget</th>
                          <th className="px-4 py-3 text-right text-muted font-medium">Spend (MTD)</th>
                          <th className="px-4 py-3 text-right text-muted font-medium">Impr.</th>
                          <th className="px-4 py-3 text-right text-muted font-medium">Clicks</th>
                          <th className="px-4 py-3 text-right text-muted font-medium">CTR</th>
                          <th className="px-4 py-3 text-right text-muted font-medium">Conv.</th>
                          <th className="px-4 py-3 text-right text-muted font-medium">CPA</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {googleAdsData.campaigns.map(campaign => (
                          <tr 
                            key={campaign.campaign_id}
                            className="hover:bg-surface-elevated/50 cursor-pointer"
                            onClick={() => setExpandedCampaign(expandedCampaign === campaign.campaign_id ? null : campaign.campaign_id)}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <ChevronDown className={`w-4 h-4 text-muted transition-transform ${expandedCampaign === campaign.campaign_id ? 'rotate-180' : ''}`} />
                                <span className="font-medium text-foreground">{campaign.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                campaign.status === 'ENABLED' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-gray-500/20 text-gray-400'
                              }`}>
                                {campaign.status || 'Unknown'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right text-foreground">
                              ${(campaign.budget_amount || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </td>
                            <td className="px-4 py-3 text-right text-foreground font-medium">
                              ${(campaign.spend_mtd || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </td>
                            <td className="px-4 py-3 text-right text-muted">
                              {campaign.impressions.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-right text-foreground">
                              {campaign.clicks.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-right text-muted">
                              {((campaign.ctr || 0) * 100).toFixed(2)}%
                            </td>
                            <td className="px-4 py-3 text-right text-foreground">
                              {campaign.conversions.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                            </td>
                            <td className="px-4 py-3 text-right text-muted">
                              {campaign.conversions > 0 
                                ? `$${((campaign.spend_mtd || 0) / campaign.conversions).toFixed(2)}`
                                : '-'
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Ads View */}
            {googleAdsApiApproved && !googleAdsLoading && googleAdsSubView === 'ads' && (
              <div className="space-y-4">
                {googleAdsData.ads.length === 0 ? (
                  <div className="bg-surface border border-border rounded-xl p-8 text-center">
                    <FileText className="w-12 h-12 mx-auto text-muted/30 mb-4" />
                    <p className="text-muted">No ads found</p>
                    <p className="text-sm text-muted/70 mt-1">Click &quot;Sync Now&quot; to fetch data from Google Ads</p>
                  </div>
                ) : (
                  googleAdsData.ads.map(ad => (
                    <div key={ad.ad_id} className="bg-surface border border-border rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-foreground">{ad.campaign_name || 'Unknown Campaign'}</h4>
                          <p className="text-sm text-muted">{ad.ad_group_name || 'Unknown Ad Group'}</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-right">
                            <div className="text-foreground font-medium">{ad.clicks.toLocaleString()} clicks</div>
                            <div className="text-muted">{ad.impressions.toLocaleString()} impr.</div>
                          </div>
                          {ad.ad_strength && (
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              ad.ad_strength === 'EXCELLENT' ? 'bg-green-500/20 text-green-400' :
                              ad.ad_strength === 'GOOD' ? 'bg-blue-500/20 text-blue-400' :
                              ad.ad_strength === 'AVERAGE' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {ad.ad_strength}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Headlines */}
                      {ad.headlines && ad.headlines.length > 0 && (
                        <div className="mb-3">
                          <div className="text-xs text-muted mb-1 flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            Headlines
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {ad.headlines.map((headline, idx) => (
                              <span key={idx} className="px-2 py-1 bg-surface-elevated text-sm text-foreground rounded">
                                {headline}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Descriptions */}
                      {ad.descriptions && ad.descriptions.length > 0 && (
                        <div className="mb-3">
                          <div className="text-xs text-muted mb-1 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            Descriptions
                          </div>
                          <div className="space-y-1">
                            {ad.descriptions.map((desc, idx) => (
                              <p key={idx} className="text-sm text-foreground/80">{desc}</p>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Landing Pages */}
                      {ad.final_urls && ad.final_urls.length > 0 && (
                        <div>
                          <div className="text-xs text-muted mb-1 flex items-center gap-1">
                            <Link2 className="w-3 h-3" />
                            Landing Pages
                          </div>
                          <div className="space-y-1">
                            {ad.final_urls.map((url, idx) => (
                              <a 
                                key={idx} 
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-sm text-accent hover:underline"
                              >
                                {url}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Keywords View */}
            {googleAdsApiApproved && !googleAdsLoading && googleAdsSubView === 'keywords' && (
              <div className="bg-surface border border-border rounded-xl overflow-hidden">
                {googleAdsData.keywords.length === 0 ? (
                  <div className="p-8 text-center">
                    <Hash className="w-12 h-12 mx-auto text-muted/30 mb-4" />
                    <p className="text-muted">No keywords found</p>
                    <p className="text-sm text-muted/70 mt-1">Click &quot;Sync Now&quot; to fetch data from Google Ads</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-surface-elevated">
                          <th className="px-4 py-3 text-left text-muted font-medium">Keyword</th>
                          <th className="px-4 py-3 text-left text-muted font-medium">Match</th>
                          <th className="px-4 py-3 text-left text-muted font-medium">Campaign</th>
                          <th className="px-4 py-3 text-center text-muted font-medium">QS</th>
                          <th className="px-4 py-3 text-right text-muted font-medium">Impr.</th>
                          <th className="px-4 py-3 text-right text-muted font-medium">Clicks</th>
                          <th className="px-4 py-3 text-right text-muted font-medium">CTR</th>
                          <th className="px-4 py-3 text-right text-muted font-medium">Cost</th>
                          <th className="px-4 py-3 text-right text-muted font-medium">Conv.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {googleAdsData.keywords.map(keyword => (
                          <tr key={keyword.keyword_id} className="hover:bg-surface-elevated/50">
                            <td className="px-4 py-3">
                              <span className="font-medium text-foreground">{keyword.keyword_text}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                keyword.match_type === 'EXACT' ? 'bg-purple-500/20 text-purple-400' :
                                keyword.match_type === 'PHRASE' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-gray-500/20 text-gray-400'
                              }`}>
                                {keyword.match_type || 'Unknown'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-muted truncate max-w-[200px]">
                              {keyword.campaign_name || '-'}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {keyword.quality_score !== null ? (
                                <span className={`font-medium ${
                                  keyword.quality_score >= 7 ? 'text-green-400' :
                                  keyword.quality_score >= 5 ? 'text-yellow-400' :
                                  'text-red-400'
                                }`}>
                                  {keyword.quality_score}/10
                                </span>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right text-muted">
                              {keyword.impressions.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-right text-foreground">
                              {keyword.clicks.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-right text-muted">
                              {((keyword.ctr || 0) * 100).toFixed(2)}%
                            </td>
                            <td className="px-4 py-3 text-right text-foreground">
                              ${keyword.cost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </td>
                            <td className="px-4 py-3 text-right text-foreground">
                              {keyword.conversions.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Summary Footer */}
        {selectedChannelsList.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4 z-40">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-sm text-muted">Monthly:</span>
                  <span className={`ml-2 font-semibold ${allocatedBudget > totalBudget ? 'text-red-400' : 'text-foreground'}`}>
                    {formatCurrency(allocatedBudget)}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-muted">Annual:</span>
                  <span className="ml-2 font-semibold text-foreground">{formatCurrency(allocatedBudget * 12)}</span>
                </div>
                <div>
                  <span className="text-sm text-muted">Channels:</span>
                  <span className="ml-2 font-semibold text-foreground">{selectedChannelsList.length}</span>
                </div>
              </div>
              {remainingBudget < 0 && (
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">{formatCurrency(Math.abs(remainingBudget))} over budget</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Spacer for fixed footer */}
        {selectedChannelsList.length > 0 && <div className="h-20" />}
      </div>
    </div>
  );
}
