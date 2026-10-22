'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ExternalLink, Maximize2 } from 'lucide-react';

export type LiveTarget = { href: string; title: string };

// Tracker chrome hidden inside the frame so the page reads as a full-screen view.
const EMBED_CSS = 'header{display:none!important}[class*="z-[9998]"],[class*="z-[9997]"]{display:none!important}html{scroll-padding-top:1rem!important}';

/** Open a tracker page full screen over the deck; browser Back, Esc or the button return to the slide. */
export function useLiveView() {
  const [view, setView] = useState<LiveTarget | null>(null);

  useEffect(() => {
    const onPop = () => setView(null);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const open = useCallback((target: LiveTarget) => {
    window.history.pushState({ liveView: target.href }, '');
    setView(target);
  }, []);
  const close = useCallback(() => window.history.back(), []);

  return { view, open, close };
}

export function LiveOverlay({ view, onClose }: { view: LiveTarget | null; onClose: () => void }) {
  useEffect(() => {
    if (!view) return;
    // Captured ahead of the deck's own key handler so arrows don't change slides underneath.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (['ArrowRight', 'ArrowLeft', ' ', 'PageDown', 'PageUp', 'Home', 'End'].includes(e.key)) e.stopImmediatePropagation();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [view, onClose]);

  if (!view) return null;
  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border bg-surface/80 px-4 py-2">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground hover:bg-surface-hover"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to presentation
        </button>
        <span className="text-sm font-medium text-foreground">{view.title}</span>
        <a href={view.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground">
          <ExternalLink className="h-3.5 w-3.5" />
          New tab
        </a>
      </div>
      <iframe
        src={view.href}
        title={view.title}
        className="w-full flex-1 border-0"
        onLoad={(e) => {
          const doc = e.currentTarget.contentDocument;
          if (!doc) return;
          const style = doc.createElement('style');
          style.textContent = EMBED_CSS;
          doc.head.appendChild(style);
        }}
      />
    </div>
  );
}

export function LivePreview({ src, alt, target, onOpen }: { src: string; alt: string; target: LiveTarget; onOpen: (t: LiveTarget) => void }) {
  return (
    <button onClick={() => onOpen(target)} className="group block w-full text-left">
      <div className="relative overflow-hidden rounded-xl border border-border shadow-2xl transition-colors group-hover:border-blue-500/60">
        <Image src={src} alt={alt} width={1600} height={900} className="h-auto w-full" />
        <div className="absolute inset-0 flex items-center justify-center bg-background/0 transition-colors group-hover:bg-background/40">
          <span className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            <Maximize2 className="h-4 w-4" />
            View full screen
          </span>
        </div>
      </div>
      <div className="mt-3 inline-flex items-center gap-2 text-sm text-blue-300 group-hover:text-blue-200">
        <Maximize2 className="h-4 w-4" />
        Open {target.title} full screen
      </div>
    </button>
  );
}
