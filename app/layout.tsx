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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
