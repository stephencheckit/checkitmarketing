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
  Lightbulb,
  Search,
  Presentation,
  Handshake,
  Calculator,
  LayoutDashboard,
  User
} from 'lucide-react';
import MyContributions from '@/components/MyContributions';

interface MainNavProps {
  userName?: string;
  userRole?: string;
}

export default function MainNav({ userName, userRole }: MainNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [marketingOpen, setMarketingOpen] = useState(false);
  const [salesOpen, setSalesOpen] = useState(false);
  const [trainingOpen, setTrainingOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showMyContributions, setShowMyContributions] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [contributionCount, setContributionCount] = useState(0);
  
  const isAdmin = userRole === 'admin';

  // Fetch contribution count
  useEffect(() => {
    const fetchContributionCount = async () => {
      try {
        const response = await fetch('/api/contributions?view=my');
        const data = await response.json();
        if (response.ok && data.contributions) {
          setContributionCount(data.contributions.length);
        }
      } catch (error) {
        console.error('Failed to fetch contribution count:', error);
      }
    };
    fetchContributionCount();
  }, []);


  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const marketingItems = [
    { href: '/positioning', label: 'Positioning', icon: Target },
    { href: '/competitors', label: 'Competitors', icon: Building2 },
    { href: '/content', label: 'Content', icon: FileText },
  ];

  const salesItems = [
    { href: '/discovery', label: 'Discovery', icon: Search },
    { href: '/solutioning', label: 'Solutioning', icon: Presentation },
    { href: '/closing', label: 'Closing', icon: Handshake },
    { href: '/tools', label: 'Tools', icon: Calculator },
  ];

  const trainingItems = [
    { href: '/learn', label: 'Learn', icon: BookOpen },
    { href: '/quiz', label: 'Quiz', icon: ClipboardCheck },
    { href: '/reference', label: 'Reference', icon: FileQuestion },
  ];

  const isActive = (href: string) => pathname.startsWith(href);
  const isMarketingActive = marketingItems.some(item => pathname.startsWith(item.href));
  const isSalesActive = salesItems.some(item => pathname.startsWith(item.href));
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
              className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                pathname === '/dashboard'
                  ? 'btn-gradient text-white'
                  : 'text-muted hover:text-foreground hover:bg-surface-elevated'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden lg:inline">Dashboard</span>
            </Link>

            {/* Marketing Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setMarketingOpen(true)}
              onMouseLeave={() => setMarketingOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isMarketingActive
                    ? 'btn-gradient text-white'
                    : 'text-muted hover:text-foreground hover:bg-surface-elevated'
                }`}
              >
                <Target className="w-4 h-4" />
                <span className="hidden lg:inline">Marketing</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${marketingOpen ? 'rotate-180' : ''}`} />
              </button>

              {marketingOpen && (
                <div className="absolute top-full left-0 pt-1 z-50">
                  <div className="w-48 bg-surface-elevated border border-border rounded-lg shadow-xl py-1">
                    {marketingItems.map((item) => {
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
                className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isSalesActive
                    ? 'btn-gradient text-white'
                    : 'text-muted hover:text-foreground hover:bg-surface-elevated'
                }`}
              >
                <Handshake className="w-4 h-4" />
                <span className="hidden lg:inline">Sales</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${salesOpen ? 'rotate-180' : ''}`} />
              </button>

              {salesOpen && (
                <div className="absolute top-full left-0 pt-1 z-50">
                  <div className="w-48 bg-surface-elevated border border-border rounded-lg shadow-xl py-1">
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

            {/* Training Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setTrainingOpen(true)}
              onMouseLeave={() => setTrainingOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isTrainingActive
                    ? 'btn-gradient text-white'
                    : 'text-muted hover:text-foreground hover:bg-surface-elevated'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span className="hidden lg:inline">Training</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${trainingOpen ? 'rotate-180' : ''}`} />
              </button>

              {trainingOpen && (
                <div className="absolute top-full left-0 pt-1 z-50">
                  <div className="w-48 bg-surface-elevated border border-border rounded-lg shadow-xl py-1">
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
            {isAdmin && (
              <Link
                href="/admin/contributions"
                className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors cursor-pointer ${
                  pathname.startsWith('/admin/contributions')
                    ? 'bg-accent/20 text-accent'
                    : 'text-muted hover:text-foreground hover:bg-surface-elevated'
                }`}
                title="Review Contributions"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden lg:inline">Review</span>
              </Link>
            )}
            
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
                  {contributionCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                      {contributionCount > 9 ? '9+' : contributionCount}
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
                    
                    <button
                      onClick={() => {
                        setShowMyContributions(true);
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-muted hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        My Contributions
                      </span>
                      {contributionCount > 0 && (
                        <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                          {contributionCount}
                        </span>
                      )}
                    </button>
                    
                    <div className="border-t border-border mt-1 pt-1">
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

              {/* Account Section */}
              <div className="pt-2 mt-2 border-t border-border">
                <button
                  onClick={() => {
                    setShowMyContributions(true);
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-muted hover:text-foreground transition-colors w-full cursor-pointer"
                >
                  <Lightbulb className="w-4 h-4" />
                  My Contributions
                </button>
                
                {isAdmin && (
                  <Link
                    href="/admin/contributions"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-muted hover:text-foreground transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Review Contributions
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
      
      {/* My Contributions Modal */}
      <MyContributions
        isOpen={showMyContributions}
        onClose={() => setShowMyContributions(false)}
      />
    </header>
  );
}
