import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Checkit V6 | Compliance, Safety, and Visibility for Operational Leaders",
    template: "%s | Checkit",
  },
  description: "Transform operations with intelligent compliance. Checkit V6 combines IoT sensors, mobile apps, and cloud analytics.",
  icons: {
    icon: "/checkit-favicon.webp",
    shortcut: "/checkit-favicon.webp",
    apple: "/checkit-favicon.webp",
  },
  metadataBase: new URL('https://checkit-marketing.vercel.app'),
};

// Organization and WebSite structured data for AI search engines
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Checkit',
  url: 'https://checkit-marketing.vercel.app',
  logo: 'https://checkit-marketing.vercel.app/checkit-logo-horizontal-standard-rgb-white.svg',
  description: 'Checkit delivers intelligent compliance and monitoring solutions combining IoT sensors, mobile apps, and cloud analytics for operational excellence.',
  sameAs: [
    'https://www.linkedin.com/company/checkit-ltd',
    'https://www.facebook.com/Checkit.net',
    'https://x.com/_checkit',
    'https://www.youtube.com/channel/UC_YtXdvdVvgENqnPndHrAAA'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    url: 'https://www.checkit.net/support/raise-a-ticket'
  },
  foundingDate: '2005',
  numberOfEmployees: {
    '@type': 'QuantitativeValue',
    minValue: 50,
    maxValue: 200
  },
  areaServed: ['US', 'GB', 'EU'],
  knowsAbout: [
    'Food Safety Compliance',
    'Temperature Monitoring',
    'HACCP Compliance',
    'Operational Compliance',
    'IoT Sensors',
    'Senior Living Operations',
    'Food Retail Operations',
    'Facilities Food Service'
  ]
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Checkit',
  url: 'https://checkit-marketing.vercel.app',
  description: 'Intelligent compliance and monitoring platform for multi-site operations.',
  publisher: {
    '@type': 'Organization',
    name: 'Checkit'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Organization Schema for AI Search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {/* WebSite Schema for AI Search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className={`${leagueSpartan.variable} font-sans antialiased min-h-screen w-full`}
      >
        <ToastProvider>
          {/* SVG Gradient Definitions for icons */}
          <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
            <defs>
              <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="icon-gradient-hover" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
            </defs>
          </svg>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
