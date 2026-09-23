// GTM map content.
//
// Markets/segments come from lib/gtm-markets.ts, which the GTM planner also
// reads — edit a market there and both pages follow. This file owns only what
// is specific to the map: corporate figures, the rep roster, coverage links,
// demand channels, and layout.
//
// Corporate figures are FY26 actuals (year ended 31 Jan 2026) from Checkit
// plc's published annual report, so they can be quoted externally:
//   Total revenue £13.7m (FY25 £14.1m) · ARR £14.3m · recurring 96% of revenue
//   By geography: UK £9.6m · Americas £3.5m · Rest of World £0.6m
//
// Coverage and channels are internal and not published anywhere.

import type { Edge, Node } from '@xyflow/react';
import {
  GTM_MARKETS,
  marketsByRegion,
  segmentNodeId,
  type GtmMarket,
  type Pillar,
} from '@/lib/gtm-markets';

export type { Pillar } from '@/lib/gtm-markets';

// Reported figures are sterling — the Group's presentation currency.
// Values are £m so the USD toggle can convert them.
export const FY26 = {
  totalRevenueM: 13.7,
  arrM: 14.3,
  ebitdaM: 0.3,
  recurringPct: '96%',
  ukM: 9.6,
  americasM: 3.5,
  rowM: 0.6,
};

// Checkit does not publish a GBP/USD rate, so any dollar figure on this map is
// our own conversion rather than a reported number. Applying one rate to a
// full-year result is an approximation: the Americas revenue was earned in
// dollars and translated into sterling at the average rate for the year, so
// converting it back will not reproduce the original dollar amount.
//
// Update this single value to re-rate every dollar figure on the map.
export const USD_PER_GBP = 1.27;
export const USD_RATE_AS_OF = 'Sept 2026';

// ---------------------------------------------------------------------------
// Layout
//
// Positions are computed rather than hand-written so that adding a market in
// lib/gtm-markets.ts cannot silently overlap two cards. The widest row in each
// region sets that region's width.

const CARD_W = 200;
const STEP = 250;
const REGION_GAP = 180;
const WIDE_CARD_W = 340;
const REGION_CARD_W = 260;

const UK_X0 = 120;

const UK_PRODUCTS = ['CAM+', 'CAM', 'CWM'] as const;

const UK_REPS = ['rep-meg', 'rep-tom', 'rep-april'] as const;
const US_REPS = ['rep-jen', 'rep-bryan', 'rep-open', 'rep-jordan'] as const;

const ukMarkets = marketsByRegion('uk');
const usMarkets = marketsByRegion('us');

const ukSlots = Math.max(ukMarkets.length, UK_PRODUCTS.length, UK_REPS.length);
const usSlots = Math.max(usMarkets.length, UK_PRODUCTS.length, US_REPS.length);

const US_X0 = UK_X0 + ukSlots * STEP + REGION_GAP;

const ukSpanEnd = UK_X0 + (ukSlots - 1) * STEP + CARD_W;
const usSpanEnd = US_X0 + (usSlots - 1) * STEP + CARD_W;

/** Left edge that centres a card of `width` over a span. */
function centre(from: number, to: number, width: number) {
  return Math.round((from + to) / 2 - width / 2);
}

const ROW = {
  corp: 0,
  region: 220,
  product: 400,
  rep: 560,
  segment: 740,
  // Segment cards grow with the number of Apollo lists attached, so the rows
  // below sit clear of the tallest one.
  umbrella: 1000,
  channel: 1170,
};

const col = (x0: number, index: number) => x0 + index * STEP;

// ---------------------------------------------------------------------------
// Nodes

const CANVAS_CENTRE_X = centre(UK_X0, usSpanEnd, WIDE_CARD_W);

const corpNode: Node = {
  id: 'corp',
  type: 'corp',
  position: { x: CANVAS_CENTRE_X, y: ROW.corp },
  data: {},
  draggable: false,
};

const regionNodes: Node[] = [
  {
    id: 'region-uk',
    type: 'region',
    position: { x: centre(UK_X0, ukSpanEnd, REGION_CARD_W), y: ROW.region },
    data: {
      label: 'UK & Ireland',
      revenueM: FY26.ukM,
      share: '70% of revenue',
      trend: 'up',
      priorM: 9.5,
      note: 'held and grew slightly',
      tone: 'uk',
    },
  },
  {
    id: 'region-us',
    type: 'region',
    position: { x: centre(US_X0, usSpanEnd, REGION_CARD_W), y: ROW.region },
    data: {
      label: 'Americas (US)',
      revenueM: FY26.americasM,
      share: '26% of revenue',
      trend: 'down',
      priorM: 3.8,
      note: 'declined, yet named the FY27 priority market',
      tone: 'us',
    },
  },
];

const PRODUCT_DATA: Record<
  (typeof UK_PRODUCTS)[number],
  { label: string; pillar: Pillar; note: string }
> = {
  'CAM+': { label: 'Medical monitoring', pillar: 'medical', note: 'Sensor-based, regulated' },
  CAM: { label: 'Commercial monitoring', pillar: 'commercial', note: 'Food safety, sensor-based' },
  // CWM has no market of its own now that UK water is dropped: it is carried
  // into the commercial markets alongside CAM rather than sold into a segment
  // of its own, so nothing hangs below this card.
  CWM: { label: 'Operational monitoring', pillar: 'operational', note: 'Workflow — often no sensors' },
};

function productNodes(region: 'uk' | 'us', x0: number): Node[] {
  return UK_PRODUCTS.map((code, i) => ({
    id: `${region}-${code === 'CAM+' ? 'cam-plus' : code.toLowerCase()}`,
    type: 'product',
    position: { x: col(x0, i), y: ROW.product },
    data: { code, ...PRODUCT_DATA[code] },
  }));
}

const REP_DATA: Record<string, Record<string, unknown>> = {
  'rep-meg': {
    name: 'Meg',
    role: 'Account exec',
    scope: 'CAM+ · NHS hospitals',
    pillar: 'medical',
    tone: 'uk',
  },
  'rep-tom': {
    name: 'Tom',
    role: 'BDR',
    scope: 'Supports Meg + April · splits CAM+ / CAM',
    pillar: 'commercial',
    tone: 'uk',
    isBdr: true,
  },
  'rep-april': {
    name: 'April',
    role: 'Account exec',
    scope: 'CAM + CWM · multi-site ops',
    pillar: 'commercial',
    tone: 'uk',
  },
  'rep-jen': {
    name: 'Jen',
    role: 'Account exec',
    scope: 'CAM+ · primarily account mgmt',
    pillar: 'medical',
    tone: 'us',
  },
  'rep-bryan': {
    name: 'Bryan',
    role: 'BDR',
    scope: 'Supports Jen · CAM+',
    pillar: 'medical',
    tone: 'us',
    isBdr: true,
  },
  'rep-open': {
    name: 'Open headcount',
    role: 'Unfilled',
    scope: 'CAM / CWM commercial + operational',
    pillar: 'commercial',
    tone: 'us',
    isOpen: true,
    noBdr: true,
  },
  'rep-jordan': {
    name: 'Jordan',
    role: 'BDR + account mgmt',
    scope: 'Hybrid · prospects his own CAM accounts',
    pillar: 'commercial',
    tone: 'us',
    isBdr: true,
  },
};

// Order within the row is deliberate: each BDR sits next to the AEs they
// support, so the support links stay short and never cross another card.
function repNodes(ids: readonly string[], x0: number): Node[] {
  return ids.map((id, i) => ({
    id,
    type: 'rep',
    position: { x: col(x0, i), y: ROW.rep },
    data: REP_DATA[id],
  }));
}

function segmentNodes(markets: GtmMarket[], x0: number): Node[] {
  return markets.map((m, i) => ({
    id: segmentNodeId(m.id),
    type: 'segment',
    position: { x: col(x0, i), y: ROW.segment },
    data: {
      label: m.label,
      pillar: m.pillar,
      detail: m.detail ?? '',
      accounts: m.beachheads.map((b) => b.name),
    },
  }));
}

const CHANNELS: Record<string, unknown>[] = [
  {
    id: 'ch-apollo',
    label: 'Apollo',
    kind: 'Target account lists',
    detail: 'Lists built per market, handed to BDRs',
    primary: true,
  },
  {
    id: 'ch-linkedin',
    label: 'LinkedIn Ads',
    kind: 'Paid social',
    detail: 'Persona targeting by segment',
  },
  { id: 'ch-google', label: 'Google Ads', kind: 'Paid search', detail: 'Intent capture' },
  {
    id: 'ch-chatgpt',
    label: 'ChatGPT Ads',
    kind: 'Paid AI search',
    detail: 'New channel — unproven',
    isNew: true,
  },
];

const channelSpan = (CHANNELS.length - 1) * STEP + CARD_W;
const CHANNEL_X0 = centre(UK_X0, usSpanEnd, channelSpan);

const channelNodes: Node[] = CHANNELS.map((c, i) => {
  const { id, ...data } = c as { id: string } & Record<string, unknown>;
  return {
    id,
    type: 'channel',
    position: { x: col(CHANNEL_X0, i), y: ROW.channel },
    data,
  };
});

export const nodes: Node[] = [
  corpNode,
  ...regionNodes,
  ...productNodes('uk', UK_X0),
  ...productNodes('us', US_X0),
  ...repNodes(UK_REPS, UK_X0),
  ...repNodes(US_REPS, US_X0),
  ...segmentNodes(ukMarkets, UK_X0),
  ...segmentNodes(usMarkets, US_X0),
  {
    id: 'umbrella',
    type: 'umbrella',
    position: { x: CANVAS_CENTRE_X, y: ROW.umbrella },
    data: {},
  },
  ...channelNodes,
];

// ---------------------------------------------------------------------------
// Edges

const PILLAR_STROKE: Record<Pillar, string> = {
  medical: '#a78bfa',
  commercial: '#fb923c',
  operational: '#00cccc',
};

// Rep cards expose handles on all four sides, so any edge touching one must
// name the handle it wants — otherwise React Flow picks arbitrarily.
function edge(
  id: string,
  source: string,
  target: string,
  pillar: Pillar,
  opts: {
    dashed?: boolean;
    label?: string;
    sourceHandle?: string;
    targetHandle?: string;
    stroke?: string;
  } = {}
): Edge {
  return {
    id,
    source,
    target,
    sourceHandle: opts.sourceHandle,
    targetHandle: opts.targetHandle,
    type: 'smoothstep',
    animated: false,
    label: opts.label,
    labelStyle: { fill: '#9ca3af', fontSize: 9 },
    labelBgStyle: { fill: '#1f2937' },
    labelBgPadding: [4, 2] as [number, number],
    style: {
      stroke: opts.stroke ?? PILLAR_STROKE[pillar],
      strokeWidth: 1.6,
      strokeDasharray: opts.dashed ? '5 4' : undefined,
      opacity: opts.dashed ? 0.55 : 0.8,
    },
  };
}

/** BDR → AE support relationship, drawn sideways within the coverage row. */
function supportEdge(id: string, bdr: string, ae: string, side: 'left' | 'right'): Edge {
  return edge(id, bdr, ae, 'operational', {
    label: 'supports',
    stroke: '#00cccc',
    sourceHandle: side === 'left' ? 'source-left' : 'source-right',
    targetHandle: side === 'left' ? 'target-right' : 'target-left',
  });
}

// Handle names on the rep cards, used by every edge that enters or leaves one.
const T = 'target-top';
const S = 'source-bottom';

/**
 * Who works each market. `support` is the BDR feeding the AE — note that
 * April carries three UK markets with BDR cover on only one of them, which the
 * map shows rather than smooths over.
 */
const COVERAGE: Record<string, { primary: string[]; support: string[] }> = {
  'uk-healthcare': { primary: ['rep-meg'], support: ['rep-tom'] },
  'uk-forecourts': { primary: ['rep-april'], support: [] },
  'uk-entertainment': { primary: ['rep-april'], support: [] },
  'uk-foodservice': { primary: ['rep-april'], support: ['rep-tom'] },
  'us-medical': { primary: ['rep-jen'], support: ['rep-bryan'] },
  'us-venues': { primary: ['rep-open'], support: ['rep-jordan'] },
  'us-senior': { primary: ['rep-open'], support: [] },
  'us-facilities': { primary: ['rep-open'], support: ['rep-jordan'] },
};

/** Which product each rep carries, per region. */
const PRODUCT_COVERAGE: { product: string; rep: string; pillar: Pillar; dashed?: boolean }[] = [
  { product: 'uk-cam-plus', rep: 'rep-meg', pillar: 'medical' },
  { product: 'uk-cam-plus', rep: 'rep-tom', pillar: 'medical', dashed: true },
  { product: 'uk-cam', rep: 'rep-april', pillar: 'commercial' },
  { product: 'uk-cam', rep: 'rep-tom', pillar: 'commercial', dashed: true },
  { product: 'uk-cwm', rep: 'rep-april', pillar: 'operational' },
  { product: 'us-cam-plus', rep: 'rep-jen', pillar: 'medical' },
  { product: 'us-cam-plus', rep: 'rep-bryan', pillar: 'medical', dashed: true },
  { product: 'us-cam', rep: 'rep-open', pillar: 'commercial' },
  { product: 'us-cam', rep: 'rep-jordan', pillar: 'commercial', dashed: true },
  { product: 'us-cwm', rep: 'rep-open', pillar: 'operational' },
];

const coverageEdges: Edge[] = GTM_MARKETS.flatMap((m) => {
  const cover = COVERAGE[m.id];
  if (!cover) return [];
  const seg = segmentNodeId(m.id);
  return [
    ...cover.primary.map((rep) =>
      edge(`e-${rep}-${m.id}`, rep, seg, m.pillar, { sourceHandle: S })
    ),
    ...cover.support.map((rep) =>
      edge(`e-${rep}-${m.id}`, rep, seg, m.pillar, { sourceHandle: S, dashed: true })
    ),
  ];
});

export const edges: Edge[] = [
  // Corporate → regions
  edge('e-corp-uk', 'corp', 'region-uk', 'commercial'),
  edge('e-corp-us', 'corp', 'region-us', 'commercial'),

  // Regions → products
  edge('e-uk-camplus', 'region-uk', 'uk-cam-plus', 'medical'),
  edge('e-uk-cam', 'region-uk', 'uk-cam', 'commercial'),
  edge('e-uk-cwm', 'region-uk', 'uk-cwm', 'operational'),
  edge('e-us-camplus', 'region-us', 'us-cam-plus', 'medical'),
  edge('e-us-cam', 'region-us', 'us-cam', 'commercial'),
  edge('e-us-cwm', 'region-us', 'us-cwm', 'operational'),

  // Products → who carries them
  ...PRODUCT_COVERAGE.map((p) =>
    edge(`e-${p.product}-${p.rep}`, p.product, p.rep, p.pillar, {
      targetHandle: T,
      dashed: p.dashed,
    })
  ),

  // BDR → AE support. Tom covers both UK AEs; Bryan covers Jen.
  supportEdge('e-tom-supports-meg', 'rep-tom', 'rep-meg', 'left'),
  supportEdge('e-tom-supports-april', 'rep-tom', 'rep-april', 'right'),
  supportEdge('e-bryan-supports-jen', 'rep-bryan', 'rep-jen', 'left'),

  // Coverage → markets
  ...coverageEdges,

  // Non-medical markets roll up under the facilities-management umbrella
  ...GTM_MARKETS.filter((m) => m.pillar !== 'medical').map((m) =>
    edge(`e-${m.id}-umbrella`, segmentNodeId(m.id), 'umbrella', m.pillar)
  ),

  // Umbrella positioning drives the channel plan
  ...CHANNELS.map((c) =>
    edge(`e-umbrella-${c.id}`, 'umbrella', c.id as string, 'commercial')
  ),
];
