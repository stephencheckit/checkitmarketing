'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  ChevronDown, 
  Menu,
  X,
  Building2,
  Pill,
  ShoppingCart,
  UtensilsCrossed,
  Droplets,
  ArrowRight
} from 'lucide-react';

const industries = [
  { 
    href: '/industries/senior-living', 
    label: 'Senior Living', 
    icon: Building2,
    description: 'Compliance & resident safety'
  },
  { 
    href: '/industries/nhs-pharmacies', 
    label: 'NHS Pharmacies', 
    icon: Pill,
    description: 'CAM+ monitoring solutions'
  },
  { 
    href: '/industries/food-retail', 
    label: 'Food Retail', 
    icon: ShoppingCart,
    description: 'Food-to-go & convenience'
  },
  { 
    href: '/industries/food-facilities', 
    label: 'Food Facilities', 
    icon: UtensilsCrossed,
    description: 'Venues & food service'
  },
  { 
    href: '/industries/medical', 
    label: 'Medical', 
    icon: Droplets,
    description: 'Plasma, pharma & universities'
  },
  { 
    href: '/industries/operations', 
    label: 'Operations', 
    icon: Building2,
    description: 'Restaurants, hospitality & more'
  },
];

export default function PublicNav() {
  const pathname = usePathname();
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname === href;
  const isIndustriesActive = industries.some(item => pathname.startsWith(item.href));

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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Industries Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIndustriesOpen(true)}
              onMouseLeave={() => setIndustriesOpen(false)}
            >
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isIndustriesActive
                    ? 'btn-gradient text-white'
                    : 'text-muted hover:text-foreground hover:bg-surface-elevated'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Industries
                <ChevronDown className={`w-4 h-4 transition-transform ${industriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {industriesOpen && (
                <div className="absolute top-full left-0 pt-1 z-50">
                  <div className="w-64 bg-surface-elevated border border-border rounded-lg shadow-xl py-2">
                    {industries.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer ${
                            isActive(item.href)
                              ? 'bg-accent/20 text-accent'
                              : 'text-foreground hover:bg-surface'
                          }`}
                        >
                          <Icon className="w-5 h-5 mt-0.5 text-accent" />
                          <div>
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs text-muted">{item.description}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Overview Link */}
            <Link
              href="/industries"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                pathname === '/industries'
                  ? 'btn-gradient text-white'
                  : 'text-muted hover:text-foreground hover:bg-surface-elevated'
              }`}
            >
              Overview
            </Link>
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
              {/* Overview */}
              <Link
                href="/industries"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  pathname === '/industries'
                    ? 'bg-accent text-white'
                    : 'text-muted hover:text-foreground hover:bg-surface-elevated'
                }`}
              >
                Overview
              </Link>

              {/* Industries Section */}
              <div className="pt-2 mt-2 border-t border-border">
                <p className="px-4 py-2 text-xs text-muted uppercase tracking-wider">Industries</p>
                {industries.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
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

              {/* CTA */}
              <div className="pt-4 mt-4 border-t border-border">
                <a
                  href="mailto:sales@checkit.net?subject=Demo Request"
                  className="flex items-center justify-center gap-2 mx-4 px-4 py-3 btn-gradient text-white text-sm font-medium rounded-lg"
                >
                  Request Demo
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
