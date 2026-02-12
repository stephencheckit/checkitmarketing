import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function PpcLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: '#ffffff',
        color: '#111827',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Capterra Measurement Pixel */}
      <Script id="capterra-pixel" strategy="afterInteractive">
        {`(function(l,o,w,n,g){
          window._gz=function(e,t){window._ct={vid:e,vkey:t,
          uc:true,hasDoNotTrackIPs:false};window.ct};
          n=l.createElement(o);g=l.getElementsByTagName(o)[0];
          n["async"]=1;
          n.src=w;g.parentNode.insertBefore(n,g)})(
          document,"script",
          "https://tr.capterra.com/static/wp.js");
          window._gz('4c619566-83fe-4ce9-9da2-f8cc08413c4e',
          'bb1c4d9bb1e451e58939cffb444e5759');`}
      </Script>

      {/* Add other pixels (Google Ads, LinkedIn, Meta) here */}

      {children}
    </div>
  );
}
