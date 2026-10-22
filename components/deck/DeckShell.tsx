'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Printer } from 'lucide-react';
import Image from 'next/image';

export type Slide = {
  id: string;
  eyebrow: string;
  title: string;
  body: React.ReactNode;
};

export default function DeckShell({
  slides,
  toc,
  title,
  subtitle,
}: {
  slides: Slide[];
  toc: Record<string, { group: string; label: string }>;
  title: string;
  subtitle: string;
}) {
  const [index, setIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const total = slides.length;

  const next = useCallback(() => setIndex((i) => Math.min(i + 1, total - 1)), [total]);
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prev();
      } else if (e.key === 'Home') {
        setIndex(0);
      } else if (e.key === 'End') {
        setIndex(total - 1);
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, total, toggleFullscreen]);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const slide = slides[index];
  const progress = useMemo(() => ((index + 1) / total) * 100, [index, total]);

  return (
    <>
      <PrintStyles />
      <div className="deck-screen flex gap-6 pb-20">
        <aside className="sticky top-6 hidden max-h-[calc(100vh-7.5rem)] w-48 flex-shrink-0 flex-col self-start overflow-y-auto [scrollbar-width:none] lg:flex [&::-webkit-scrollbar]:hidden">
          <Image
            src="/checkit-logo-horizontal-standard-rgb-white.svg"
            alt="Checkit"
            width={140}
            height={32}
            priority
            className="mb-6 ml-2 h-7 w-auto self-start"
          />
          <nav aria-label="Slides">
            {Array.from(new Set(slides.map((s) => toc[s.id]?.group ?? 'Other'))).map((group) => (
              <div key={group} className="mb-3">
                <div className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">{group}</div>
                <ul className="space-y-0.5">
                  {slides.map((s, i) =>
                    (toc[s.id]?.group ?? 'Other') === group ? (
                      <li key={s.id}>
                        <button
                          onClick={() => setIndex(i)}
                          className={`flex w-full items-center gap-2 rounded-md px-2 py-0.5 text-left text-[13px] transition-colors ${
                            i === index ? 'bg-blue-500/15 text-blue-200' : 'text-foreground/70 hover:bg-surface hover:text-foreground'
                          }`}
                        >
                          <span className="w-5 flex-shrink-0 text-[10px] tabular-nums text-muted">{String(i + 1).padStart(2, '0')}</span>
                          <span className="truncate">{toc[s.id]?.label ?? s.title}</span>
                        </button>
                      </li>
                    ) : null
                  )}
                </ul>
              </div>
            ))}
          </nav>
          <div className="flex items-center gap-4 px-2 pt-1 text-xs text-muted">
            <button onClick={toggleFullscreen} title="Present (F)" className="inline-flex items-center gap-1.5 hover:text-foreground">
              {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              {isFullscreen ? 'Exit' : 'Present'}
            </button>
            <button onClick={() => window.print()} title="Print / Save as PDF (one slide per landscape page)" className="inline-flex items-center gap-1.5 hover:text-foreground">
              <Printer className="h-3.5 w-3.5" />
              PDF
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex items-center justify-between lg:hidden">
            <Image src="/checkit-logo-horizontal-standard-rgb-white.svg" alt="Checkit" width={140} height={32} className="h-7 w-auto" />
            <span className="text-sm font-semibold text-foreground">{title}</span>
          </div>

          <div
            className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface to-background shadow-2xl"
            style={{
              backgroundImage:
                'radial-gradient(circle at 100% 0%, rgba(59,130,246,0.12), transparent 50%), radial-gradient(circle at 0% 100%, rgba(37,99,235,0.08), transparent 50%)',
            }}
          >
            <div className="absolute left-0 top-0 h-1 w-full bg-border/40">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="min-h-[60vh] px-8 py-8 md:px-12 md:py-9">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.2em] text-blue-300">{slide.eyebrow}</span>
                <span className="text-xs uppercase tracking-widest text-muted">
                  {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
              </div>
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
                <span className="text-gradient">{slide.title}</span>
              </h2>
              <div className="mt-6">{slide.body}</div>
            </div>

            <div className="flex items-center justify-between border-t border-border/60 bg-background/40 px-6 py-3 text-xs text-muted">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-400" />
                Checkit · GTM Tracker
              </div>
              <div>Confidential · internal use only</div>
            </div>
          </div>
        </div>
      </div>

      <div className="deck-controls fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1920px] gap-6 px-4 py-3 sm:px-6 lg:px-8">
          <div className="hidden w-48 flex-shrink-0 flex-col justify-center px-2 leading-tight lg:flex">
            <div className="truncate text-xs font-semibold text-foreground">{title}</div>
            <div className="truncate text-[11px] text-muted">{subtitle}</div>
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
            <button
              onClick={prev}
              disabled={index === 0}
              title="Previous (←)"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm text-foreground hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            <div className="hidden flex-wrap items-center justify-center gap-2 sm:flex">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    i === index ? 'w-8 bg-blue-400' : 'w-2.5 bg-border hover:bg-surface-hover'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={toggleFullscreen} title="Present (F)" className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground hover:bg-surface-hover lg:hidden">
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={next}
                disabled={index === total - 1}
                title="Next (→ or space)"
                className="inline-flex items-center gap-2 rounded-lg btn-gradient px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="deck-print" aria-hidden>
        {slides.map((s, i) => (
          <section key={s.id} className="print-slide">
            <div className="print-slide-inner">
              <div className="print-slide-header">
                <span className="print-eyebrow">{s.eyebrow}</span>
                <span className="print-pageno">
                  {String(i + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                </span>
              </div>
              <h2 className="print-title">{s.title}</h2>
              <div className="print-body">{s.body}</div>
              <div className="print-footer">
                <span>Checkit · GTM Tracker</span>
                <span>Confidential · internal use only</span>
              </div>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

const PRINT_CSS = `
      @media print {
        @page {
          size: 13.333in 7.5in;
          margin: 0;
        }
        html,
        body {
          background: #0b1220 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        main {
          padding: 0 !important;
          max-width: none !important;
        }
        nextjs-portal {
          display: none !important;
        }
        .deck-screen,
        .deck-controls {
          display: none !important;
        }
        .deck-print {
          display: block !important;
        }
        .print-slide {
          page-break-after: always;
          break-after: page;
          width: 13.333in;
          height: 7.5in;
          overflow: hidden;
          background:
            radial-gradient(circle at 100% 0%, rgba(59, 130, 246, 0.18), transparent 55%),
            radial-gradient(circle at 0% 100%, rgba(37, 99, 235, 0.12), transparent 55%),
            linear-gradient(135deg, #111827 0%, #0b1220 100%);
          color: #f3f4f6;
          padding: 40px 56px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
        }
        .print-slide:last-child {
          page-break-after: auto;
        }
        .print-slide-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .print-slide-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        .print-eyebrow {
          color: #93c5fd;
        }
        .print-pageno {
          color: #9ca3af;
        }
        .print-title {
          margin-top: 4px;
          font-size: 32px;
          font-weight: 800;
          line-height: 1.1;
          background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .print-body {
          margin-top: 16px;
          flex: 1;
          overflow: hidden;
          zoom: 0.95;
        }
        .print-body .md\\:grid-cols-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .print-body .md\\:grid-cols-3 {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .print-body .md\\:grid-cols-4 {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
        .print-body .md\\:grid-cols-5 {
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }
        .print-body .md\\:grid-cols-9 {
          grid-template-columns: repeat(9, minmax(0, 1fr));
        }
        .print-body .md\\:col-span-2 {
          grid-column: span 2 / span 2;
        }
        .print-body .md\\:col-span-3 {
          grid-column: span 3 / span 3;
        }
        .print-footer {
          margin-top: 12px;
          padding-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #9ca3af;
        }
      }
      @media screen {
        .deck-print {
          display: none;
        }
      }
`;

function PrintStyles() {
  return <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />;
}
