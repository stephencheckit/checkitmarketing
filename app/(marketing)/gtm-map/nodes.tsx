'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';
import {
  Building2,
  TrendingDown,
  TrendingUp,
  User,
  UserPlus,
  Target,
  Megaphone,
  Layers,
  Sparkles,
} from 'lucide-react';
import { FY26, type Pillar } from './gtm-data';
import { useMoneyM } from './currency';
import { useSegmentLists } from './apollo-context';
import {
  BUCKET_COLOR,
  BUCKET_LABEL,
  bucketMarketStages,
  type StageMix,
} from '@/lib/apollo-lists';

const PILLAR_RING: Record<Pillar, string> = {
  medical: 'border-violet-500/50',
  commercial: 'border-orange-500/50',
  operational: 'border-[#00cccc]/50',
};

const PILLAR_DOT: Record<Pillar, string> = {
  medical: 'bg-violet-400',
  commercial: 'bg-orange-400',
  operational: 'bg-[#00cccc]',
};

const PILLAR_TEXT: Record<Pillar, string> = {
  medical: 'text-violet-300',
  commercial: 'text-orange-300',
  operational: 'text-[#00cccc]',
};

const TONE_RING: Record<string, string> = {
  uk: 'border-blue-500/50',
  us: 'border-rose-500/50',
};

const TONE_TEXT: Record<string, string> = {
  uk: 'text-blue-300',
  us: 'text-rose-300',
};

const DOT = 'bg-border! border-none! w-1.5! h-1.5!';

/** Shared handles — the map always flows top to bottom. */
function Ports() {
  return (
    <>
      <Handle type="target" position={Position.Top} className={DOT} />
      <Handle type="source" position={Position.Bottom} className={DOT} />
    </>
  );
}

/**
 * Rep cards additionally connect sideways, to show which AEs a BDR supports,
 * so each side gets a named handle.
 */
function RepPorts() {
  return (
    <>
      <Handle id="target-top" type="target" position={Position.Top} className={DOT} />
      <Handle id="source-bottom" type="source" position={Position.Bottom} className={DOT} />
      <Handle id="source-left" type="source" position={Position.Left} className={DOT} />
      <Handle id="target-left" type="target" position={Position.Left} className={DOT} />
      <Handle id="source-right" type="source" position={Position.Right} className={DOT} />
      <Handle id="target-right" type="target" position={Position.Right} className={DOT} />
    </>
  );
}

export function CorpNode() {
  const money = useMoneyM();
  return (
    <div className="w-[340px] rounded-xl border border-[#00cccc]/40 bg-surface px-5 py-4 shadow-lg">
      <Ports />
      <div className="flex items-center gap-2 text-[#00cccc]">
        <Building2 className="h-4 w-4" />
        <span className="text-[11px] font-semibold uppercase tracking-wider">
          Checkit plc · AIM: CKT
        </span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-bold tabular-nums text-foreground">
          {money(FY26.totalRevenueM)}
        </span>
        <span className="text-xs text-muted">FY26 revenue</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3">
        {[
          { k: 'ARR', v: money(FY26.arrM) },
          { k: 'Recurring', v: FY26.recurringPct },
          { k: 'Adj. EBITDA', v: money(FY26.ebitdaM) },
        ].map((x) => (
          <div key={x.k}>
            <div className="text-[10px] uppercase tracking-wide text-muted">{x.k}</div>
            <div className="text-sm font-semibold tabular-nums text-foreground">{x.v}</div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[10px] leading-snug text-muted">
        Year ended 31 Jan 2026 · published figures
      </p>
    </div>
  );
}

export function RegionNode({ data }: NodeProps) {
  const d = data as {
    label: string;
    revenueM: number;
    share: string;
    trend: 'up' | 'down';
    priorM: number;
    note: string;
    tone: string;
  };
  const money = useMoneyM();
  const Trend = d.trend === 'up' ? TrendingUp : TrendingDown;
  return (
    <div
      className={`w-[260px] rounded-xl border bg-surface px-4 py-3 shadow-lg ${
        TONE_RING[d.tone] ?? 'border-border'
      }`}
    >
      <Ports />
      <div className={`text-[11px] font-semibold uppercase tracking-wider ${TONE_TEXT[d.tone]}`}>
        {d.label}
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-bold tabular-nums text-foreground">
          {money(d.revenueM)}
        </span>
        <Trend
          className={`h-4 w-4 ${d.trend === 'up' ? 'text-emerald-400' : 'text-amber-400'}`}
        />
      </div>
      <div className="text-[11px] text-muted">{d.share}</div>
      <p className="mt-2 border-t border-border pt-2 text-[10px] leading-snug text-muted">
        FY25 {money(d.priorM)} — {d.note}
      </p>
    </div>
  );
}

export function ProductNode({ data }: NodeProps) {
  const d = data as { code: string; label: string; pillar: Pillar; note: string };
  return (
    <div
      className={`w-[200px] rounded-lg border bg-surface-elevated/60 px-3 py-2.5 ${
        PILLAR_RING[d.pillar]
      }`}
    >
      <Ports />
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${PILLAR_DOT[d.pillar]}`} />
        <span className={`text-sm font-bold ${PILLAR_TEXT[d.pillar]}`}>{d.code}</span>
      </div>
      <div className="mt-0.5 text-xs font-medium text-foreground">{d.label}</div>
      <div className="text-[10px] leading-snug text-muted">{d.note}</div>
    </div>
  );
}

export function RepNode({ data }: NodeProps) {
  const d = data as {
    name: string;
    role: string;
    scope: string;
    pillar: Pillar;
    tone: string;
    isBdr?: boolean;
    isOpen?: boolean;
    noBdr?: boolean;
  };
  const Icon = d.isOpen ? UserPlus : User;
  return (
    <div
      className={`w-[200px] rounded-lg border px-3 py-2.5 ${
        d.isOpen
          ? 'border-dashed border-amber-500/60 bg-amber-500/5'
          : `bg-surface ${TONE_RING[d.tone] ?? 'border-border'}`
      }`}
    >
      <RepPorts />
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <Icon className={`h-3.5 w-3.5 shrink-0 ${d.isOpen ? 'text-amber-400' : 'text-muted'}`} />
          <span className="truncate text-sm font-semibold text-foreground">{d.name}</span>
        </div>
        {d.isBdr ? (
          <span className="shrink-0 rounded bg-[#00cccc]/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#00cccc]">
            BDR
          </span>
        ) : null}
        {d.isOpen ? (
          <span className="shrink-0 rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-400">
            Open
          </span>
        ) : null}
      </div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wide text-muted">{d.role}</div>
      <div className="mt-1 text-[11px] leading-snug text-foreground/80">{d.scope}</div>
      {d.noBdr ? (
        <div className="mt-1.5 border-t border-amber-500/30 pt-1.5 text-[10px] leading-snug text-amber-300">
          No dedicated BDR cover
        </div>
      ) : null}
    </div>
  );
}

/** Stacked stage mix for a market, each account counted once. */
function StageBar({ mix }: { mix: StageMix | undefined }) {
  const accounts = mix?.accounts ?? 0;
  const buckets = mix?.buckets ?? [];
  if (accounts === 0) return null;

  return (
    <>
      <div className="mt-1.5 flex h-1.5 overflow-hidden rounded-full bg-surface-elevated">
        {buckets.map(({ bucket, count }) => (
          <div
            key={bucket}
            className={BUCKET_COLOR[bucket]}
            style={{ width: `${(count / accounts) * 100}%` }}
            title={`${BUCKET_LABEL[bucket]}: ${count}`}
          />
        ))}
      </div>
      <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
        {buckets.map(({ bucket, count }) => (
          <span key={bucket} className="flex items-center gap-1 text-[9px] text-muted">
            <span className={`h-1.5 w-1.5 rounded-full ${BUCKET_COLOR[bucket]}`} />
            {BUCKET_LABEL[bucket]} {count}
          </span>
        ))}
      </div>
    </>
  );
}

export function SegmentNode({ id, data }: NodeProps) {
  const d = data as {
    label: string;
    pillar: Pillar;
    detail: string;
    accounts: string[];
  };
  const { status, lists, market } = useSegmentLists(id);
  const mix = bucketMarketStages(market);
  // Distinct accounts, not the sum of the list counts below — a market's lists
  // overlap, so the per-list figures add up to more than the market holds.
  const totalAccounts = market?.accounts ?? 0;
  const overlap = market ? market.listRows - market.accounts : 0;
  const anyTruncated = lists.some((l) => l.truncated);

  return (
    <div className={`w-[200px] rounded-lg border bg-surface px-3 py-2.5 ${PILLAR_RING[d.pillar]}`}>
      <Ports />
      <div className="flex items-center gap-1.5">
        <Target className={`h-3.5 w-3.5 ${PILLAR_TEXT[d.pillar]}`} />
        <span className="text-xs font-semibold text-foreground">{d.label}</span>
      </div>
      <div className="mt-1 text-[10px] leading-snug text-muted">{d.detail}</div>
      <div className="mt-2 flex flex-wrap gap-1">
        {d.accounts.length > 0 ? (
          d.accounts.map((a) => (
            <span
              key={a}
              className="rounded border border-border bg-surface-elevated px-1.5 py-0.5 text-[9px] text-foreground/90"
            >
              {a}
            </span>
          ))
        ) : (
          <span className="text-[9px] italic text-muted">Beachhead TBD</span>
        )}
      </div>

      {status !== 'off' ? (
        <div className="mt-2 border-t border-border pt-2">
          {status === 'loading' ? (
            <div className="text-[9px] italic text-muted">Loading Apollo…</div>
          ) : status === 'error' ? (
            <div className="text-[9px] text-rose-300">Apollo unavailable</div>
          ) : lists.length === 0 ? (
            <div className="text-[9px] italic text-amber-300">No Apollo account list</div>
          ) : (
            <>
              <div className="flex items-baseline justify-between gap-1">
                <span className="text-[9px] font-semibold uppercase tracking-wide text-[#00cccc]">
                  Apollo
                </span>
                <span className="text-[10px] tabular-nums text-foreground">
                  {totalAccounts.toLocaleString()} acct
                  {anyTruncated ? '+' : ''} · {lists.length} list
                  {lists.length === 1 ? '' : 's'}
                </span>
              </div>
              <StageBar mix={mix} />
              {overlap > 0 ? (
                <div
                  className="mt-1 text-[9px] text-muted"
                  title="The same account appears in more than one of this market's lists"
                >
                  {overlap} overlapping across lists
                </div>
              ) : null}
              <ul className="mt-1.5 space-y-0.5">
                {lists.map((l) => (
                  <li key={l.id} className="flex items-baseline justify-between gap-1.5">
                    <span className="truncate text-[9px] text-foreground/80" title={l.name}>
                      {l.name}
                    </span>
                    <span className="shrink-0 text-[9px] tabular-nums text-muted">
                      {l.accounts.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

export function UmbrellaNode() {
  return (
    <div className="w-[340px] rounded-xl border border-dashed border-[#00cccc]/60 bg-[#00cccc]/5 px-4 py-3">
      <Ports />
      <div className="flex items-center gap-2 text-[#00cccc]">
        <Layers className="h-4 w-4" />
        <span className="text-[11px] font-semibold uppercase tracking-wider">
          Unifying position
        </span>
      </div>
      <div className="mt-1 text-sm font-semibold text-foreground">
        Facilities management umbrella
      </div>
      <p className="mt-1 text-[11px] leading-snug text-muted">
        One story across commercial and operational monitoring, led by food service. Lets CAM
        and CWM sell together instead of as separate products.
      </p>
    </div>
  );
}

export function ChannelNode({ data }: NodeProps) {
  const d = data as {
    label: string;
    kind: string;
    detail: string;
    primary?: boolean;
    isNew?: boolean;
  };
  return (
    <div
      className={`w-[200px] rounded-lg border px-3 py-2.5 ${
        d.primary ? 'border-[#00cccc]/50 bg-[#00cccc]/5' : 'border-border bg-surface'
      }`}
    >
      <Ports />
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <Megaphone
            className={`h-3.5 w-3.5 shrink-0 ${d.primary ? 'text-[#00cccc]' : 'text-muted'}`}
          />
          <span className="truncate text-xs font-semibold text-foreground">{d.label}</span>
        </div>
        {d.isNew ? (
          <Sparkles className="h-3 w-3 shrink-0 text-amber-400" />
        ) : null}
      </div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wide text-muted">{d.kind}</div>
      <div className="mt-1 text-[10px] leading-snug text-foreground/80">{d.detail}</div>
    </div>
  );
}

// Defined once at module scope — React Flow re-mounts every node if this object
// identity changes between renders.
export const nodeTypes = {
  corp: CorpNode,
  region: RegionNode,
  product: ProductNode,
  rep: RepNode,
  segment: SegmentNode,
  umbrella: UmbrellaNode,
  channel: ChannelNode,
};
