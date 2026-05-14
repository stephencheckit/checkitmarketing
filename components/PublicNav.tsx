'use client';

import Link from 'next/link';
import { useState } from 'react';
import DemoRequestButton from '@/components/DemoRequestButton';
import { 
  Menu,
  X,
  ChevronDown,
  Layers,
  Building2,
  Users,
  BookOpen,
  Calculator,
  FolderOpen
} from 'lucide-react';

const navLinks = [
  { href: '/platform', label: 'Platform', icon: Layers },
  { href: '/industries', label: 'Industries', icon: Building2 },
  { href: '/case-studies', label: 'Stories', icon: BookOpen },
  { href: '/about', label: 'About Us', icon: Users },
];

const resourceLinks = [
  {
    href: '/digital-haccp-roi',
    label: 'Digital HACCP ROI Calculator',
    description: 'Translate the platform into pounds and pence',
    icon: Calculator,
  },
];

export default function PublicNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo - Fixed width on left */}
          <Link href="/" className="flex items-center shrink-0">
            <img 
              src="/checkit-logo-horizontal-standard-rgb-white.svg" 
              alt="Checkit" 
              className="h-6"
            />
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center justify-center gap-6 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Resources dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setResourcesOpen(true)}
              onMouseLeave={() => setResourcesOpen(false)}
            >
              <button
                type="button"
                onClick={() => setResourcesOpen((v) => !v)}
                className="flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors cursor-pointer"
                aria-haspopup="menu"
                aria-expanded={resourcesOpen}
              >
                Resources
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {resourcesOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50">
                  <div className="w-80 bg-surface border border-border rounded-xl shadow-xl p-2">
                    {resourceLinks.map((r) => {
                      const Icon = r.icon;
                      return (
                        <Link
                          key={r.href}
                          href={r.href}
                          onClick={() => setResourcesOpen(false)}
                          className="flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-surface-elevated transition-colors group"
                        >
                          <div className="p-2 rounded-md bg-accent/10 text-accent shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                              {r.label}
                            </div>
                            <div className="text-xs text-muted mt-0.5">{r.description}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop CTA - Fixed width on right */}
          <div className="hidden md:flex items-center shrink-0">
            <DemoRequestButton label="Request Demo" className="px-4 py-2 text-sm" />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-muted hover:text-foreground cursor-pointer ml-auto"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}

              {/* Mobile Resources group */}
              <div className="pt-2 mt-2 border-t border-border">
                <div className="flex items-center gap-3 px-3 py-2 text-xs uppercase tracking-wider text-muted font-semibold">
                  <FolderOpen className="w-4 h-4" />
                  Resources
                </div>
                {resourceLinks.map((r) => {
                  const Icon = r.icon;
                  return (
                    <Link
                      key={r.href}
                      href={r.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      {r.label}
                    </Link>
                  );
                })}
              </div>

              <div className="border-t border-border my-3" />
              <div className="mx-3">
                <DemoRequestButton label="Request Demo" className="w-full justify-center" />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
