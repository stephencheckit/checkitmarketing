'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  ChevronDown,
  Target, 
  Building2, 
  FileText, 
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  FileQuestion,
  LogOut,
  Menu,
  X,
  MessageSquare,
  Search,
  Presentation,
  Handshake,
  Calculator,
  LayoutDashboard,
  User,
  DollarSign,
  Crown,
  Globe,
  ExternalLink,
  Send,
  Settings,
  Bot,
  Briefcase,
  Radio,
  Swords,
  MousePointerClick,
} from 'lucide-react';

// Reddit icon component
const RedditIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
  </svg>
);

interface MainNavProps {
  userName?: string;
  userRole?: string;
}

export default function MainNav({ userName, userRole }: MainNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [marketingOpen, setMarketingOpen] = useState(false);
  const [channelsOpen, setChannelsOpen] = useState(false);
  const [bizDevOpen, setBizDevOpen] = useState(false);
  const [salesOpen, setSalesOpen] = useState(false);
  const [accountsOpen, setAccountsOpen] = useState(false);
  const [trainingOpen, setTrainingOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  const isAdmin = userRole === 'admin';
  const [pendingReviewCount, setPendingReviewCount] = useState(0);

  // Fetch pending review count for admins
  const fetchPendingReviewCount = async () => {
    if (!isAdmin) return;
    try {
      const response = await fetch('/api/contributions/pending-count');
      const data = await response.json();
      if (response.ok) {
        setPendingReviewCount(data.count || 0);
      }
    } catch (error) {
      console.error('Failed to fetch pending review count:', error);
    }
  };

  useEffect(() => {
    fetchPendingReviewCount();
    
    // Listen for contribution updates (for pending count)
    const handleContributionUpdate = () => {
      fetchPendingReviewCount();
    };
    
    window.addEventListener('contribution-updated', handleContributionUpdate);
    return () => {
      window.removeEventListener('contribution-updated', handleContributionUpdate);
    };
  }, [isAdmin]);


  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  // Marketing: Strategy, content, budget
  const marketingItems = [
    { href: '/positioning', label: 'Positioning', icon: Target },
    { href: '/content', label: 'Content Lab', icon: FileText },
    { href: '/channels', label: 'Budget', icon: DollarSign },
    { href: '/ppc-performance', label: 'PPC Leads', icon: MousePointerClick },
    { href: '/industries', label: 'Microsite', icon: Globe, external: true },
  ];

  // Channels: Search/visibility platforms
  const channelsItems = [
    { href: '/search-console', label: 'Search Console', icon: Search },
    { href: '/ai-search', label: 'AI Search', icon: Bot },
    // Google Ads coming soon
  ];

  // Biz Dev: Outbound prospecting
  const bizDevItems = [
    { href: '/outbound', label: 'Outbound', icon: Send },
    { href: '/reddit-monitor', label: 'Reddit', icon: RedditIcon },
    { href: '/social-toolkit', label: 'Social Toolkit', icon: Crown },
  ];

  // Sales: Deal execution
  const salesItems = [
    { href: '/discovery', label: 'Discovery', icon: Search },
    { href: '/solutioning', label: 'Demo Prep', icon: Presentation },
    { href: '/closing', label: 'Closing', icon: Handshake },
    { href: '/tools', label: 'ROI Tools', icon: Calculator },
    { href: '/competitors', label: 'Battlecards', icon: Swords },
  ];

  // Accounts: Customer-specific dashboards
  const accountItems = [
    { href: '/ovg-analytics', label: 'OVG', icon: Building2 },
  ];

  // Training: Enablement
  const trainingItems = [
    { href: '/learn', label: 'Learn', icon: BookOpen },
    { href: '/quiz', label: 'Quiz', icon: ClipboardCheck },
    { href: '/reference', label: 'Reference', icon: FileQuestion },
  ];

  const isActive = (href: string) => pathname.startsWith(href);
  const isMarketingActive = marketingItems.some(item => pathname.startsWith(item.href));
  const isChannelsActive = channelsItems.some(item => pathname.startsWith(item.href));
  const isBizDevActive = bizDevItems.some(item => pathname.startsWith(item.href));
  const isSalesActive = salesItems.some(item => pathname.startsWith(item.href));
  const isAccountsActive = accountItems.some(item => pathname.startsWith(item.href));
  const isTrainingActive = trainingItems.some(item => pathname.startsWith(item.href));

  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center shrink-0">
            <img 
              src="/checkit-logo-horizontal-standard-rgb-white.svg" 
              alt="Checkit" 
              className="h-6"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-0.5">
            {/* Dashboard - standalone */}
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                pathname === '/dashboard'
                  ? 'btn-gradient text-white'
                  : 'text-muted hover:text-foreground hover:bg-surface-elevated'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden xl:inline">Dashboard</span>
            </Link>

            {/* Marketing Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setMarketingOpen(true)}
              onMouseLeave={() => setMarketingOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isMarketingActive
                    ? 'btn-gradient text-white'
                    : 'text-muted hover:text-foreground hover:bg-surface-elevated'
                }`}
              >
                <Target className="w-4 h-4" />
                <span className="hidden lg:inline">Marketing</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${marketingOpen ? 'rotate-180' : ''}`} />
              </button>

              {marketingOpen && (
                <div className="absolute top-full left-0 pt-1 z-50">
                  <div className="w-44 bg-surface-elevated border border-border rounded-lg shadow-xl py-1">
                    {marketingItems.map((item) => {
                      const Icon = item.icon;
                      if (item.external) {
                        return (
                          <a
                            key={item.href}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors cursor-pointer text-muted hover:text-foreground hover:bg-surface"
                          >
                            <Icon className="w-4 h-4" />
                            {item.label}
                            <ExternalLink className="w-3 h-3 opacity-50 ml-auto" />
                          </a>
                        );
                      }
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors cursor-pointer ${
                            isActive(item.href)
                              ? 'bg-accent/20 text-accent'
                              : 'text-muted hover:text-foreground hover:bg-surface'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Channels Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setChannelsOpen(true)}
              onMouseLeave={() => setChannelsOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isChannelsActive
                    ? 'btn-gradient text-white'
                    : 'text-muted hover:text-foreground hover:bg-surface-elevated'
                }`}
              >
                <Radio className="w-4 h-4" />
                <span className="hidden lg:inline">Channels</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${channelsOpen ? 'rotate-180' : ''}`} />
              </button>

              {channelsOpen && (
                <div className="absolute top-full left-0 pt-1 z-50">
                  <div className="w-44 bg-surface-elevated border border-border rounded-lg shadow-xl py-1">
                    {channelsItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors cursor-pointer ${
                            isActive(item.href)
                              ? 'bg-accent/20 text-accent'
                              : 'text-muted hover:text-foreground hover:bg-surface'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Biz Dev Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setBizDevOpen(true)}
              onMouseLeave={() => setBizDevOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isBizDevActive
                    ? 'btn-gradient text-white'
                    : 'text-muted hover:text-foreground hover:bg-surface-elevated'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span className="hidden lg:inline">Biz Dev</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${bizDevOpen ? 'rotate-180' : ''}`} />
              </button>

              {bizDevOpen && (
                <div className="absolute top-full left-0 pt-1 z-50">
                  <div className="w-44 bg-surface-elevated border border-border rounded-lg shadow-xl py-1">
                    {bizDevItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors cursor-pointer ${
                            isActive(item.href)
                              ? 'bg-accent/20 text-accent'
                              : 'text-muted hover:text-foreground hover:bg-surface'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sales Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setSalesOpen(true)}
              onMouseLeave={() => setSalesOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isSalesActive
                    ? 'btn-gradient text-white'
                    : 'text-muted hover:text-foreground hover:bg-surface-elevated'
                }`}
              >
                <Handshake className="w-4 h-4" />
                <span className="hidden lg:inline">Sales</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${salesOpen ? 'rotate-180' : ''}`} />
              </button>

              {salesOpen && (
                <div className="absolute top-full left-0 pt-1 z-50">
                  <div className="w-44 bg-surface-elevated border border-border rounded-lg shadow-xl py-1">
                    {salesItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors cursor-pointer ${
                            isActive(item.href)
                              ? 'bg-accent/20 text-accent'
                              : 'text-muted hover:text-foreground hover:bg-surface'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Accounts Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setAccountsOpen(true)}
              onMouseLeave={() => setAccountsOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isAccountsActive
                    ? 'btn-gradient text-white'
                    : 'text-muted hover:text-foreground hover:bg-surface-elevated'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span className="hidden lg:inline">Accounts</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${accountsOpen ? 'rotate-180' : ''}`} />
              </button>

              {accountsOpen && (
                <div className="absolute top-full left-0 pt-1 z-50">
                  <div className="w-44 bg-surface-elevated border border-border rounded-lg shadow-xl py-1">
                    {accountItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors cursor-pointer ${
                            isActive(item.href)
                              ? 'bg-accent/20 text-accent'
                              : 'text-muted hover:text-foreground hover:bg-surface'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Training Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setTrainingOpen(true)}
              onMouseLeave={() => setTrainingOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isTrainingActive
                    ? 'btn-gradient text-white'
                    : 'text-muted hover:text-foreground hover:bg-surface-elevated'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span className="hidden lg:inline">Training</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${trainingOpen ? 'rotate-180' : ''}`} />
              </button>

              {trainingOpen && (
                <div className="absolute top-full left-0 pt-1 z-50">
                  <div className="w-44 bg-surface-elevated border border-border rounded-lg shadow-xl py-1">
                    {trainingItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors cursor-pointer ${
                            isActive(item.href)
                              ? 'bg-accent/20 text-accent'
                              : 'text-muted hover:text-foreground hover:bg-surface'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {/* Profile Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
            >
              <button
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-surface-elevated border border-border flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  {isAdmin && pendingReviewCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                      {pendingReviewCount > 9 ? '9+' : pendingReviewCount}
                    </span>
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full pt-1 w-56 z-50">
                  <div className="bg-surface-elevated border border-border rounded-lg shadow-xl py-1">
                    {userName && (
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-medium text-foreground">{userName}</p>
                        <p className="text-xs text-muted mt-0.5">{userRole === 'admin' ? 'Administrator' : 'Team Member'}</p>
                      </div>
                    )}
                    
                    {isAdmin && (
                      <>
                        <Link
                          href="/admin/contributions"
                          className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                            pathname.startsWith('/admin/contributions')
                              ? 'bg-accent/20 text-accent'
                              : 'text-muted hover:text-foreground hover:bg-surface'
                          }`}
                        >
                          <div className="relative">
                            <MessageSquare className="w-4 h-4" />
                            {pendingReviewCount > 0 && (
                              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[9px] font-medium rounded-full flex items-center justify-center">
                                {pendingReviewCount > 9 ? '9+' : pendingReviewCount}
                              </span>
                            )}
                          </div>
                          Inbox
                        </Link>
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted hover:text-foreground hover:bg-surface transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Admin Settings
                        </Link>
                      </>
                    )}
                    
                    <div className="border-t border-border">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-muted hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-muted hover:text-foreground cursor-pointer"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="space-y-1">
              {/* Dashboard */}
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  pathname === '/dashboard'
                    ? 'bg-accent text-white'
                    : 'text-muted hover:text-foreground hover:bg-surface-elevated'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>

              {/* Marketing Section */}
              <div className="pt-2 mt-2 border-t border-border">
                <p className="px-4 py-2 text-xs text-muted uppercase tracking-wider">Marketing</p>
                {marketingItems.map((item) => {
                  const Icon = item.icon;
                  if (item.external) {
                    return (
                      <a
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer text-muted hover:text-foreground hover:bg-surface-elevated"
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                        <ExternalLink className="w-3 h-3 opacity-50 ml-auto" />
                      </a>
                    );
                  }
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        isActive(item.href)
                          ? 'bg-accent text-white'
                          : 'text-muted hover:text-foreground hover:bg-surface-elevated'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Channels Section */}
              <div className="pt-2 mt-2 border-t border-border">
                <p className="px-4 py-2 text-xs text-muted uppercase tracking-wider">Channels</p>
                {channelsItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        isActive(item.href)
                          ? 'bg-accent text-white'
                          : 'text-muted hover:text-foreground hover:bg-surface-elevated'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Biz Dev Section */}
              <div className="pt-2 mt-2 border-t border-border">
                <p className="px-4 py-2 text-xs text-muted uppercase tracking-wider">Biz Dev</p>
                {bizDevItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        isActive(item.href)
                          ? 'bg-accent text-white'
                          : 'text-muted hover:text-foreground hover:bg-surface-elevated'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Sales Section */}
              <div className="pt-2 mt-2 border-t border-border">
                <p className="px-4 py-2 text-xs text-muted uppercase tracking-wider">Sales</p>
                {salesItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        isActive(item.href)
                          ? 'bg-accent text-white'
                          : 'text-muted hover:text-foreground hover:bg-surface-elevated'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Accounts Section */}
              <div className="pt-2 mt-2 border-t border-border">
                <p className="px-4 py-2 text-xs text-muted uppercase tracking-wider">Accounts</p>
                {accountItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        isActive(item.href)
                          ? 'bg-accent text-white'
                          : 'text-muted hover:text-foreground hover:bg-surface-elevated'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Training Section */}
              <div className="pt-2 mt-2 border-t border-border">
                <p className="px-4 py-2 text-xs text-muted uppercase tracking-wider">Training</p>
                {trainingItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        isActive(item.href)
                          ? 'bg-accent text-white'
                          : 'text-muted hover:text-foreground hover:bg-surface-elevated'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Admin Section */}
              <div className="pt-2 mt-2 border-t border-border">
                {isAdmin && (
                  <Link
                    href="/admin/contributions"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-4 py-3 text-sm text-muted hover:text-foreground transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Review Inbox
                    </span>
                    {pendingReviewCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {pendingReviewCount}
                      </span>
                    )}
                  </Link>
                )}
              </div>

              <div className="pt-2 mt-2 border-t border-border">
                {userName && (
                  <p className="px-4 py-2 text-sm text-muted">{userName}</p>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-muted hover:text-foreground transition-colors w-full cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
      
    </header>
  );
}
