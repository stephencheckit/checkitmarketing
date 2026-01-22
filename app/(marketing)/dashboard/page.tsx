'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Target, 
  Building2, 
  FileText, 
  GraduationCap,
  Calculator,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Users,
  Award,
  BookOpen,
  BarChart3,
  Zap
} from 'lucide-react';

interface UserData {
  name: string;
  role: string;
}

interface ContributionStats {
  total: number;
  pending: number;
  approved: number;
}

interface ProgressData {
  completed: number;
  total: number;
  certified: boolean;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [contributions, setContributions] = useState<ContributionStats>({ total: 0, pending: 0, approved: 0 });
  const [progress, setProgress] = useState<ProgressData>({ completed: 0, total: 5, certified: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user info
      const userRes = await fetch('/api/auth/me');
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
      }

      // Fetch contributions
      const contribRes = await fetch('/api/contributions?view=my');
      if (contribRes.ok) {
        const contribData = await contribRes.json();
        const contribs = contribData.contributions || [];
        setContributions({
          total: contribs.length,
          pending: contribs.filter((c: { status: string }) => c.status === 'pending').length,
          approved: contribs.filter((c: { status: string }) => c.status === 'approved' || c.status === 'auto_published').length,
        });
      }

      // Fetch progress
      const progressRes = await fetch('/api/progress');
      if (progressRes.ok) {
        const progressData = await progressRes.json();
        setProgress({
          completed: progressData.completedCount || 0,
          total: progressData.totalModules || 5,
          certified: progressData.certified || false,
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const quickLinks = [
    { 
      href: '/positioning', 
      label: 'Positioning', 
      description: 'Corporate messaging framework',
      icon: Target,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      href: '/competitors', 
      label: 'Competitors', 
      description: 'Battlecards & intel',
      icon: Building2,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      href: '/content', 
      label: 'Content', 
      description: 'Ideas & campaigns',
      icon: FileText,
      color: 'from-orange-500 to-red-500'
    },
    { 
      href: '/tools', 
      label: 'Tools', 
      description: 'ROI calculators & more',
      icon: Calculator,
      color: 'from-green-500 to-emerald-500'
    },
  ];

  const enablementLinks = [
    { href: '/learn', label: 'Learning Modules', icon: BookOpen },
    { href: '/quiz', label: 'Certification Quiz', icon: Award },
    { href: '/reference', label: 'Quick Reference', icon: BarChart3 },
    { href: '/discovery', label: 'Discovery Guide', icon: Users },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl p-8" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2d1b4e 100%)' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
        <div className="relative">
          <h1 className="text-3xl font-bold text-white mb-2">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}
          </h1>
          <p className="text-blue-200/80 text-lg">
            Welcome to the Checkit Marketing Hub
          </p>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10">
          <Zap className="w-32 h-32 text-white" />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-muted text-sm">Your Contributions</span>
          </div>
          <p className="text-2xl font-bold">{contributions.total}</p>
          <p className="text-xs text-muted mt-1">
            {contributions.pending} pending · {contributions.approved} approved
          </p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-muted text-sm">Learning Progress</span>
          </div>
          <p className="text-2xl font-bold">{Math.round((progress.completed / progress.total) * 100)}%</p>
          <p className="text-xs text-muted mt-1">
            {progress.completed} of {progress.total} modules complete
          </p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${progress.certified ? 'bg-success/20' : 'bg-yellow-500/20'}`}>
              {progress.certified ? (
                <CheckCircle className="w-5 h-5 text-success" />
              ) : (
                <Clock className="w-5 h-5 text-yellow-400" />
              )}
            </div>
            <span className="text-muted text-sm">Certification</span>
          </div>
          <p className={`text-2xl font-bold ${progress.certified ? 'text-success' : ''}`}>
            {progress.certified ? 'Certified' : 'In Progress'}
          </p>
          <p className="text-xs text-muted mt-1">
            {progress.certified ? 'V6 Ready badge earned' : 'Complete quiz to certify'}
          </p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-muted text-sm">Role</span>
          </div>
          <p className="text-2xl font-bold capitalize">{user?.role || 'User'}</p>
          <p className="text-xs text-muted mt-1">
            {user?.role === 'admin' ? 'Full access enabled' : 'Standard access'}
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-muted" />
          Marketing Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group bg-surface border border-border rounded-xl p-5 hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/5"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-1 group-hover:text-accent transition-colors">
                  {link.label}
                </h3>
                <p className="text-sm text-muted">{link.description}</p>
                <div className="mt-3 flex items-center text-accent text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Open <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enablement Section */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-muted" />
              Enablement
            </h2>
            <Link href="/learn" className="text-sm text-accent hover:text-accent-hover transition-colors">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {enablementLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-elevated transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-accent" />
                  </div>
                  <span className="font-medium group-hover:text-accent transition-colors">{link.label}</span>
                  <ArrowRight className="w-4 h-4 text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })}
          </div>
          
          {/* Progress Bar */}
          <div className="mt-5 pt-5 border-t border-border">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted">Your progress</span>
              <span className="font-medium">{progress.completed}/{progress.total} modules</span>
            </div>
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                style={{ width: `${(progress.completed / progress.total) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Critical Reminders */}
        <div className="space-y-4">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold text-yellow-400 mb-1">Critical: &quot;Nova UI&quot; is internal only</h3>
                <p className="text-sm text-foreground/80">
                  Customers should only hear <strong>&quot;Checkit Platform&quot;</strong>. Never use Nova, Control Center, or CAM/CWM externally.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
                <Lightbulb className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-400 mb-1">Share Your Insights</h3>
                <p className="text-sm text-foreground/80">
                  Have field intel or feedback? Use the <strong>Add Insight</strong> button on any page to contribute to our collective knowledge.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center shrink-0">
                <Target className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Key Message</h3>
                <p className="text-sm text-muted">
                  <em>&quot;One platform, total operational foresight&quot;</em> — Our core value promise to customers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Gradient Definition */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
