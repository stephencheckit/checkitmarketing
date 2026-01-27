'use client';

import Link from 'next/link';
import { useState } from 'react';
import DemoRequestButton from '@/components/DemoRequestButton';
import { Menu, X } from 'lucide-react';

export default function HomeNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <Link href="/" className="flex items-center shrink-0">
            <img 
              src="/checkit-logo-horizontal-standard-rgb-white.svg" 
              alt="Checkit" 
              className="h-6"
            />
          </Link>

          <nav className="hidden md:flex items-center justify-center gap-6 flex-1">
            <Link href="/platform" className="text-sm text-muted hover:text-foreground transition-colors">
              Platform
            </Link>
            <Link href="/industries" className="text-sm text-muted hover:text-foreground transition-colors">
              Industries
            </Link>
            <Link href="/case-studies" className="text-sm text-muted hover:text-foreground transition-colors">
              Stories
            </Link>
            <Link href="/about" className="text-sm text-muted hover:text-foreground transition-colors">
              About Us
            </Link>
          </nav>

          <div className="hidden md:flex items-center shrink-0">
            <DemoRequestButton label="Request Demo" />
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
              <Link
                href="/platform"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors"
              >
                Platform
              </Link>
              <Link
                href="/industries"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors"
              >
                Industries
              </Link>
              <Link
                href="/case-studies"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors"
              >
                Stories
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors"
              >
                About Us
              </Link>
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
