import Link from 'next/link';
import { 
  Headphones,
  Facebook,
  Linkedin,
  Youtube,
  Play,
  LogIn,
  ExternalLink,
  Apple,
  LifeBuoy
} from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="border-t border-border py-12 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img 
              src="/checkit-logo-horizontal-standard-rgb-white.svg" 
              alt="Checkit" 
              className="h-6 mb-4"
            />
            <p className="text-sm text-muted mb-6 max-w-sm">
              Purpose-built compliance and monitoring solutions for predictable operational precision.
              Smart sensors, mobile apps, and enterprise-grade platform technology working together.
            </p>
            
            {/* App Downloads */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted uppercase tracking-wider font-medium">Get the Mobile App</span>
              <div className="flex items-center gap-3">
                <a 
                  href="https://apps.apple.com/us/app/checkit-cwm/id6463000375"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-surface-elevated border border-border rounded-lg hover:border-accent/50 transition-colors"
                >
                  <Apple className="w-5 h-5" />
                  <div className="text-left">
                    <div className="text-[10px] text-muted leading-none">Download on the</div>
                    <div className="text-sm font-semibold text-foreground leading-tight">App Store</div>
                  </div>
                </a>
                <a 
                  href="https://play.google.com/store/apps/details?id=net.checkit.checkitandroid&hl=en_GB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-surface-elevated border border-border rounded-lg hover:border-accent/50 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  <div className="text-left">
                    <div className="text-[10px] text-muted leading-none">GET IT ON</div>
                    <div className="text-sm font-semibold text-foreground leading-tight">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
          
          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/platform" className="text-sm text-muted hover:text-foreground transition-colors">Overview</Link></li>
              <li><Link href="/platform#sensors" className="text-sm text-muted hover:text-foreground transition-colors">Sensors</Link></li>
              <li><Link href="/platform#apps" className="text-sm text-muted hover:text-foreground transition-colors">Mobile Apps</Link></li>
              <li><Link href="/platform#platform" className="text-sm text-muted hover:text-foreground transition-colors">Cloud Platform</Link></li>
            </ul>
          </div>
          
          {/* More */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">About</h4>
            <ul className="space-y-2">
              {[
                'About Us',
                'Careers',
                'ESG',
                'Sustainability',
                'Certifications',
                'Contact us',
              ].map((label) => (
                <li key={label}>
                  <span
                    className="inline-flex items-center gap-2 text-sm text-muted/70 cursor-default"
                    aria-disabled="true"
                    title="Coming soon"
                  >
                    {label}
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">Soon</span>
                  </span>
                </li>
              ))}
              <li>
                <Link href="/industries" className="text-sm text-muted hover:text-foreground transition-colors">
                  Industries
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="text-sm text-muted hover:text-foreground transition-colors">
                  Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/digital-haccp-roi"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  Digital HACCP ROI Calculator
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Login & Access */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Access</h4>
            <ul className="space-y-2">
              <li>
                <span
                  className="inline-flex items-center gap-2 text-sm text-muted/70 cursor-default"
                  aria-disabled="true"
                  title="Coming soon"
                >
                  <ExternalLink className="w-3 h-3" />
                  Platform Login
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">Soon</span>
                </span>
              </li>
              <li>
                <span
                  className="inline-flex items-center gap-2 text-sm text-muted/70 cursor-default"
                  aria-disabled="true"
                  title="Coming soon"
                >
                  <Headphones className="w-3 h-3" />
                  Submit Support Ticket
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">Soon</span>
                </span>
              </li>
              <li>
                <span
                  className="inline-flex items-center gap-2 text-sm text-muted/70 cursor-default"
                  aria-disabled="true"
                  title="Coming soon"
                >
                  <LifeBuoy className="w-3 h-3" />
                  Help documentation
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">Soon</span>
                </span>
              </li>
              <li>
                <a 
                  href="https://apps.apple.com/us/app/checkit-cwm/id6463000375" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
                >
                  <Apple className="w-3 h-3" />
                  iOS App
                </a>
              </li>
              <li>
                <a 
                  href="https://play.google.com/store/apps/details?id=net.checkit.checkitandroid&hl=en_GB" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
                >
                  <Play className="w-3 h-3" />
                  Android App
                </a>
              </li>
              <li>
                <a 
                  href="/login" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
                >
                  <LogIn className="w-3 h-3" />
                  GTM Tracker
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Checkit. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a 
              href="https://www.facebook.com/Checkit.net" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted hover:text-foreground transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a 
              href="https://x.com/_checkit" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted hover:text-foreground transition-colors"
              aria-label="X (Twitter)"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a 
              href="https://www.linkedin.com/company/checkit-ltd" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a 
              href="https://www.youtube.com/channel/UC_YtXdvdVvgENqnPndHrAAA" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted hover:text-foreground transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href="https://www.checkit.net/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="https://www.checkit.net/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="https://www.checkit.net/hubfs/Modern_Slavery_Statement_-_June_2023.pdf" target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-foreground transition-colors">
              Anti-Slavery Statement
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
