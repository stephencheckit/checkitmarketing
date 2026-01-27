'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  Menu,
  X,
  LogIn,
  ExternalLink,
  ChevronDown,
  Layers,
  Building2,
  FileText,
  Users
} from 'lucide-react';

const navLinks = [
  { href: '/platform', label: 'Platform', icon: Layers },
  { href: '/industries', label: 'Industries', icon: Building2 },
  { href: '/about', label: 'About Us', icon: Users },
];

export default function PublicNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

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
          </nav>

          {/* Desktop CTA - Fixed width on right */}
          <div className="hidden md:flex items-center shrink-0">
            <a
              href="https://www.checkit.net/demo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm btn-gradient text-white rounded-lg"
            >
              Request Demo
            </a>
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
              <div className="border-t border-border my-3" />
              <a
                href="https://www.checkit.net/demo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 mx-3 px-4 py-2.5 btn-gradient text-white rounded-lg"
              >
                Request Demo
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
