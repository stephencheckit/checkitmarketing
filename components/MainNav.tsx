'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
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
  LayoutDashboard
} from 'lucide-react';
import MyContributions from '@/components/MyContributions';

interface MainNavProps {
  userName?: string;
  userRole?: string;
}

export default function MainNav({ userName, userRole }: MainNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [enablementOpen, setEnablementOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showMyContributions, setShowMyContributions] = useState(false);
  
  const isAdmin = userRole === 'admin';

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const mainNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/positioning', label: 'Positioning', icon: Target },
    { href: '/competitors', label: 'Competitors', icon: Building2 },
    { href: '/content', label: 'Content', icon: FileText },
    { href: '/tools', label: 'Tools', icon: Calculator },
  ];

  const enablementItems = [
    { href: '/learn', label: 'Learn', icon: BookOpen },
    { href: '/quiz', label: 'Quiz', icon: ClipboardCheck },
    { href: '/reference', label: 'Reference', icon: FileQuestion },
    { href: '/discovery', label: 'Discovery', icon: Search },
    { href: '/solutioning', label: 'Solutioning', icon: Presentation },
    { href: '/closing', label: 'Closing', icon: Handshake },
  ];

  const isActive = (href: string) => pathname.startsWith(href);
  const isEnablementActive = enablementItems.some(item => pathname.startsWith(item.href));

  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center">
            <div className="h-10 px-3 py-2 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #6366f1 100%)' }}>
              <img 
                src="/checkit-logo-horizontal-standard-rgb-white.svg" 
                alt="Checkit" 
                className="h-5"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.href)
                      ? 'btn-gradient text-white'
                      : 'text-muted hover:text-foreground hover:bg-surface-elevated'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}

            {/* Enablement Dropdown - hover to expand */}
            <div 
              className="relative"
              onMouseEnter={() => setEnablementOpen(true)}
              onMouseLeave={() => setEnablementOpen(false)}
            >
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isEnablementActive
                    ? 'btn-gradient text-white'
                    : 'text-muted hover:text-foreground hover:bg-surface-elevated'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Enablement
                <ChevronDown className={`w-4 h-4 transition-transform ${enablementOpen ? 'rotate-180' : ''}`} />
              </button>

              {enablementOpen && (
                <div className="absolute top-full left-0 pt-1 z-50">
                  <div className="w-48 bg-surface-elevated border border-border rounded-lg shadow-xl py-1">
                  {enablementItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
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
            <button
              onClick={() => setShowMyContributions(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors"
              title="My Contributions"
            >
              <Lightbulb className="w-4 h-4" />
              <span className="hidden lg:inline">My Contributions</span>
            </button>
            
            {isAdmin && (
              <Link
                href="/admin/contributions"
                className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
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
            
            {userName && (
              <span className="text-sm text-muted">{userName}</span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-muted hover:text-foreground"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
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

              <div className="pt-2 mt-2 border-t border-border">
                <p className="px-4 py-2 text-xs text-muted uppercase tracking-wider">Enablement</p>
                {enablementItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
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

              <div className="pt-2 mt-2 border-t border-border">
                <button
                  onClick={() => {
                    setShowMyContributions(true);
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-muted hover:text-foreground transition-colors w-full"
                >
                  <Lightbulb className="w-4 h-4" />
                  My Contributions
                </button>
                
                {isAdmin && (
                  <Link
                    href="/admin/contributions"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-muted hover:text-foreground transition-colors"
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
                  className="flex items-center gap-2 px-4 py-3 text-sm text-muted hover:text-foreground transition-colors w-full"
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
