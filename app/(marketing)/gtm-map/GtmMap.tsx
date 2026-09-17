'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Maximize2, Minimize2 } from 'lucide-react';
import {
  edges as initialEdges,
  nodes as initialNodes,
  USD_PER_GBP,
  USD_RATE_AS_OF,
} from './gtm-data';
import { nodeTypes } from './nodes';
import { CurrencyProvider, type Currency } from './currency';
import { ApolloProvider, useApolloSnapshot } from './apollo-context';
import { useApolloLists } from '@/lib/apollo-lists';

const LEGEND: { label: string; className: string }[] = [
  { label: 'CAM+ · Medical', className: 'bg-violet-400' },
  { label: 'CAM · Commercial', className: 'bg-orange-400' },
  { label: 'CWM · Operational', className: 'bg-[#00cccc]' },
];

/**
 * `offsetNav` leaves room for the portal nav bar; standalone views want the
 * full viewport. `liveApollo` pulls target-list counts and stage mix from
 * Apollo — it must stay off wherever the map is served unauthenticated, since
 * target account names and counts are internal.
 */
export default function GtmMap({
  offsetNav = false,
  liveApollo = false,
}: {
  offsetNav?: boolean;
  liveApollo?: boolean;
}) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const shellRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currency, setCurrency] = useState<Currency>('GBP');
  const apollo = useApolloLists(liveApollo);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void shellRef.current?.requestFullscreen();
    }
  }, []);

  const height = isFullscreen || !offsetNav ? 'h-screen' : 'h-[calc(100vh-4rem)]';

  return (
    <div ref={shellRef} className={`w-full bg-background ${height}`}>
      <CurrencyProvider value={currency}>
        <ApolloProvider value={apollo}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.12 }}
            minZoom={0.15}
            maxZoom={1.6}
            proOptions={{ hideAttribution: true }}
            nodesConnectable={false}
            edgesFocusable={false}
          >
            <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="#374151" />
            <Controls showInteractive={false} className="bg-surface! border-border!" />
            <MiniMap
              pannable
              zoomable
              className="bg-surface! border! border-border!"
              maskColor="rgba(17,24,39,0.7)"
              nodeColor="#4b5563"
            />

            <Panel position="top-left" className="m-3!">
              <div className="rounded-xl border border-border bg-surface/95 px-4 py-3 backdrop-blur">
                <h1 className="text-base font-bold text-foreground">GTM map</h1>
                <p className="mt-0.5 max-w-xs text-[11px] leading-snug text-muted">
                  Revenue, products, coverage and demand channels on one page. Corporate figures
                  are FY26 published actuals; coverage and segments are internal.
                </p>
                <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 border-t border-border pt-2">
                  {LEGEND.map((l) => (
                    <span
                      key={l.label}
                      className="flex items-center gap-1.5 text-[10px] text-muted"
                    >
                      <span className={`h-2 w-2 rounded-full ${l.className}`} />
                      {l.label}
                    </span>
                  ))}
                  <span className="flex items-center gap-1.5 text-[10px] text-muted">
                    <span className="h-0 w-4 border-t border-dashed border-muted" />
                    Split / shared coverage
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] text-muted">
                    <span className="h-0 w-4 border-t border-[#00cccc]" />
                    BDR supports AE
                  </span>
                </div>
              </div>
            </Panel>

            <Panel position="top-right" className="m-3!">
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex overflow-hidden rounded-lg border border-border bg-surface/95 backdrop-blur">
                    {(['GBP', 'USD'] as Currency[]).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCurrency(c)}
                        className={`px-3 py-2 text-xs font-semibold transition-colors ${
                          currency === c
                            ? 'bg-[#00cccc]/15 text-[#00cccc]'
                            : 'text-muted hover:text-foreground'
                        }`}
                      >
                        {c === 'GBP' ? '£ GBP' : '$ USD'}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface/95 px-3 py-2 text-xs font-medium text-muted backdrop-blur transition-colors hover:text-foreground"
                  >
                    {isFullscreen ? (
                      <>
                        <Minimize2 className="h-3.5 w-3.5" />
                        Exit full screen
                      </>
                    ) : (
                      <>
                        <Maximize2 className="h-3.5 w-3.5" />
                        Full screen
                      </>
                    )}
                  </button>
                </div>
                {currency === 'USD' ? (
                  <div className="max-w-[260px] rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-right text-[10px] leading-snug text-amber-200 backdrop-blur">
                    Indicative only — converted at {USD_PER_GBP} USD/GBP ({USD_RATE_AS_OF}).
                    Checkit reports in sterling and publishes no dollar figures.
                  </div>
                ) : null}
              </div>
            </Panel>

            {liveApollo ? (
              <Panel position="bottom-left" className="m-3!">
                <ApolloStatus />
              </Panel>
            ) : null}
          </ReactFlow>
        </ApolloProvider>
      </CurrencyProvider>
    </div>
  );
}

/**
 * Reports where the Apollo mapping and the map disagree. Without this, a list
 * nobody has assigned to a segment would simply not appear anywhere.
 */
function ApolloStatus() {
  const { status, error, fetchedAt, unmappedLists, missingLists } = useApolloSnapshot();
  const [open, setOpen] = useState(false);

  if (status === 'loading') {
    return (
      <div className="rounded-lg border border-border bg-surface/95 px-3 py-2 text-[10px] text-muted backdrop-blur">
        Loading Apollo lists…
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="max-w-[280px] rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-[10px] leading-snug text-rose-200 backdrop-blur">
        Apollo lists unavailable — {error}. Segment cards show static content only.
      </div>
    );
  }

  if (status !== 'ready') return null;

  const gaps = unmappedLists.length + missingLists.length;

  return (
    <div className="max-w-[300px] rounded-lg border border-border bg-surface/95 px-3 py-2 backdrop-blur">
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-muted">
          Apollo synced{' '}
          {fetchedAt
            ? new Date(fetchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '—'}
        </span>
        {gaps > 0 ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-300 transition-colors hover:bg-amber-500/30"
          >
            {gaps} unmapped
          </button>
        ) : null}
      </div>

      {open ? (
        <div className="mt-2 space-y-2 border-t border-border pt-2">
          {unmappedLists.length > 0 ? (
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-wide text-muted">
                Not assigned to a segment
              </div>
              <ul className="mt-1 space-y-0.5">
                {unmappedLists.map((l) => (
                  <li key={l.id} className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[10px] text-foreground/80">{l.name}</span>
                    <span className="shrink-0 text-[10px] tabular-nums text-muted">{l.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {missingLists.length > 0 ? (
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-wide text-muted">
                Mapped but gone from Apollo
              </div>
              <ul className="mt-1 space-y-0.5">
                {missingLists.map((l) => (
                  <li key={l.id} className="truncate text-[10px] text-rose-300">
                    {l.name}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
