'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  Menu,
  X,
  ArrowRight
} from 'lucide-react';

export default function PublicNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/industries" className="flex items-center shrink-0">
            <img 
              src="/checkit-logo-horizontal-standard-rgb-white.svg" 
              alt="Checkit" 
              className="h-6"
            />
          </Link>

          {/* Desktop Navigation - intentionally minimal */}
          <nav className="hidden md:flex items-center gap-1">
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="mailto:sales@checkit.net?subject=Demo Request"
              className="flex items-center gap-2 px-4 py-2 btn-gradient text-white text-sm font-medium rounded-lg transition-all cursor-pointer"
            >
              Request Demo
              <ArrowRight className="w-4 h-4" />
            </a>
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
              {/* CTA */}
              <a
                href="mailto:sales@checkit.net?subject=Demo Request"
                className="flex items-center justify-center gap-2 mx-4 px-4 py-3 btn-gradient text-white text-sm font-medium rounded-lg"
              >
                Request Demo
                <ArrowRight className="w-4 h-4" />
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
