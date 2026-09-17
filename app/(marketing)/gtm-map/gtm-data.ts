// GTM map content — the single place to edit the map.
//
// Corporate figures are FY26 actuals (year ended 31 Jan 2026) from Checkit plc's
// published annual report, so they can be quoted externally:
//   Total revenue £13.7m (FY25 £14.1m) · ARR £14.3m · recurring 96% of revenue
//   By geography: UK £9.6m · Americas £3.5m · Rest of World £0.6m
//
// Coverage, segments and channels are internal and not published anywhere —
// they come from how the team is actually organised today.

import type { Edge, Node } from '@xyflow/react';

export type Pillar = 'medical' | 'commercial' | 'operational';

// Layout is hand-positioned rather than auto-laid-out so the picture stays
// stable and readable — this is a briefing diagram, not a generated graph.
const UK_COL = [120, 370, 620];
const US_COL = [1120, 1370, 1620, 1870];

// Row spacing accounts for the tallest card in each row (the corporate and
// region cards are much taller than the rest), so edges stay short and no card
// crowds the row below it.
const ROW = {
  corp: 0,
  region: 220,
  product: 400,
  rep: 560,
  segment: 740,
  umbrella: 940,
  channel: 1110,
};

// Reported figures are sterling — that is the Group's presentation currency.
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

export const nodes: Node[] = [
  {
    id: 'corp',
    type: 'corp',
    position: { x: 925, y: ROW.corp },
    data: {},
    draggable: false,
  },

  // --- Regions -------------------------------------------------------------
  {
    id: 'region-uk',
    type: 'region',
    position: { x: 340, y: ROW.region },
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
    position: { x: 1465, y: ROW.region },
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

  // --- Products per region -------------------------------------------------
  {
    id: 'uk-cam-plus',
    type: 'product',
    position: { x: UK_COL[0], y: ROW.product },
    data: {
      code: 'CAM+',
      label: 'Medical monitoring',
      pillar: 'medical',
      note: 'Sensor-based, regulated',
    },
  },
  {
    id: 'uk-cam',
    type: 'product',
    position: { x: UK_COL[1], y: ROW.product },
    data: {
      code: 'CAM',
      label: 'Commercial monitoring',
      pillar: 'commercial',
      note: 'Food safety, sensor-based',
    },
  },
  {
    id: 'uk-cwm',
    type: 'product',
    position: { x: UK_COL[2], y: ROW.product },
    data: {
      code: 'CWM',
      label: 'Operational monitoring',
      pillar: 'operational',
      note: 'Workflow — often no sensors',
    },
  },
  {
    id: 'us-cam-plus',
    type: 'product',
    position: { x: US_COL[0], y: ROW.product },
    data: {
      code: 'CAM+',
      label: 'Medical monitoring',
      pillar: 'medical',
      note: 'Sensor-based, regulated',
    },
  },
  {
    id: 'us-cam',
    type: 'product',
    position: { x: US_COL[1], y: ROW.product },
    data: {
      code: 'CAM',
      label: 'Commercial monitoring',
      pillar: 'commercial',
      note: 'Food safety, sensor-based',
    },
  },
  {
    id: 'us-cwm',
    type: 'product',
    position: { x: US_COL[2], y: ROW.product },
    data: {
      code: 'CWM',
      label: 'Operational monitoring',
      pillar: 'operational',
      note: 'Workflow — often no sensors',
    },
  },

  // --- Coverage ------------------------------------------------------------
  // Order within the row is deliberate: each BDR sits next to the AEs they
  // support, so the support links stay short and never cross another card.
  {
    id: 'rep-meg',
    type: 'rep',
    position: { x: UK_COL[0], y: ROW.rep },
    data: {
      name: 'Meg',
      role: 'Account exec',
      scope: 'CAM+ · NHS hospitals',
      pillar: 'medical',
      tone: 'uk',
    },
  },
  {
    id: 'rep-tom',
    type: 'rep',
    position: { x: UK_COL[1], y: ROW.rep },
    data: {
      name: 'Tom',
      role: 'BDR',
      scope: 'Supports Meg + April · splits CAM+ / CAM',
      pillar: 'commercial',
      tone: 'uk',
      isBdr: true,
    },
  },
  {
    id: 'rep-april',
    type: 'rep',
    position: { x: UK_COL[2], y: ROW.rep },
    data: {
      name: 'April',
      role: 'Account exec',
      scope: 'CAM + CWM · multi-site ops',
      pillar: 'commercial',
      tone: 'uk',
    },
  },
  {
    id: 'rep-jen',
    type: 'rep',
    position: { x: US_COL[0], y: ROW.rep },
    data: {
      name: 'Jen',
      role: 'Account exec',
      scope: 'CAM+ · primarily account mgmt',
      pillar: 'medical',
      tone: 'us',
    },
  },
  {
    id: 'rep-bryan',
    type: 'rep',
    position: { x: US_COL[1], y: ROW.rep },
    data: {
      name: 'Bryan',
      role: 'BDR',
      scope: 'Supports Jen · CAM+',
      pillar: 'medical',
      tone: 'us',
      isBdr: true,
    },
  },
  {
    id: 'rep-open',
    type: 'rep',
    position: { x: US_COL[2], y: ROW.rep },
    data: {
      name: 'Open headcount',
      role: 'Unfilled',
      scope: 'CAM / CWM commercial + operational',
      pillar: 'commercial',
      tone: 'us',
      isOpen: true,
      noBdr: true,
    },
  },
  {
    id: 'rep-jordan',
    type: 'rep',
    position: { x: US_COL[3], y: ROW.rep },
    data: {
      name: 'Jordan',
      role: 'BDR + account mgmt',
      scope: 'Hybrid · prospects his own CAM accounts',
      pillar: 'commercial',
      tone: 'us',
      isBdr: true,
    },
  },

  // --- Target segments -----------------------------------------------------
  {
    id: 'seg-nhs',
    type: 'segment',
    position: { x: UK_COL[0], y: ROW.segment },
    data: {
      label: 'NHS hospitals',
      pillar: 'medical',
      detail: 'Pharmacy and pathology demand',
      accounts: ['NHS trusts'],
    },
  },
  {
    id: 'seg-forecourts',
    type: 'segment',
    position: { x: UK_COL[1], y: ROW.segment },
    data: {
      label: 'Forecourts & convenience',
      pillar: 'commercial',
      detail: 'Multi-site operators',
      accounts: ['BP'],
    },
  },
  {
    id: 'seg-uk-food',
    type: 'segment',
    position: { x: UK_COL[2], y: ROW.segment },
    data: {
      label: 'Food service & FM',
      pillar: 'commercial',
      detail: 'Coffee shops, food-to-go, facilities mgmt',
      accounts: [],
    },
  },
  {
    id: 'seg-us-medical',
    type: 'segment',
    position: { x: US_COL[0], y: ROW.segment },
    data: {
      label: 'Medical & plasma',
      pillar: 'medical',
      detail: 'Installed base — expansion led',
      accounts: [],
    },
  },
  {
    id: 'seg-senior',
    type: 'segment',
    position: { x: US_COL[1], y: ROW.segment },
    data: {
      label: 'Senior living',
      pillar: 'commercial',
      detail: 'Food safety across facilities',
      accounts: [],
    },
  },
  {
    id: 'seg-catering',
    type: 'segment',
    position: { x: US_COL[2], y: ROW.segment },
    data: {
      label: 'Contract catering & FM',
      pillar: 'commercial',
      detail: 'Outsourced food service at scale',
      accounts: ['ISS', 'Compass'],
    },
  },
  {
    id: 'seg-venues',
    type: 'segment',
    position: { x: US_COL[3], y: ROW.segment },
    data: {
      label: 'Venues & entertainment',
      pillar: 'commercial',
      detail: 'Stadiums, arenas, attractions',
      accounts: ['OVG', 'Guggenheim'],
    },
  },

  // --- Positioning ---------------------------------------------------------
  {
    id: 'umbrella',
    type: 'umbrella',
    position: { x: 890, y: ROW.umbrella },
    data: {},
  },

  // --- Demand channels -----------------------------------------------------
  {
    id: 'ch-apollo',
    type: 'channel',
    position: { x: 620, y: ROW.channel },
    data: {
      label: 'Apollo',
      kind: 'Target account lists',
      detail: 'Lists built per segment, handed to BDRs',
      primary: true,
    },
  },
  {
    id: 'ch-linkedin',
    type: 'channel',
    position: { x: 870, y: ROW.channel },
    data: {
      label: 'LinkedIn Ads',
      kind: 'Paid social',
      detail: 'Persona targeting by segment',
    },
  },
  {
    id: 'ch-google',
    type: 'channel',
    position: { x: 1120, y: ROW.channel },
    data: {
      label: 'Google Ads',
      kind: 'Paid search',
      detail: 'Intent capture',
    },
  },
  {
    id: 'ch-chatgpt',
    type: 'channel',
    position: { x: 1370, y: ROW.channel },
    data: {
      label: 'ChatGPT Ads',
      kind: 'Paid AI search',
      detail: 'New channel — unproven',
      isNew: true,
    },
  },
];

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
  edge('e-ukcamplus-meg', 'uk-cam-plus', 'rep-meg', 'medical', { targetHandle: T }),
  edge('e-ukcamplus-tom', 'uk-cam-plus', 'rep-tom', 'medical', { dashed: true, targetHandle: T }),
  edge('e-ukcam-april', 'uk-cam', 'rep-april', 'commercial', { targetHandle: T }),
  edge('e-ukcam-tom', 'uk-cam', 'rep-tom', 'commercial', { dashed: true, targetHandle: T }),
  edge('e-ukcwm-april', 'uk-cwm', 'rep-april', 'operational', { targetHandle: T }),
  edge('e-uscamplus-jen', 'us-cam-plus', 'rep-jen', 'medical', { targetHandle: T }),
  edge('e-uscamplus-bryan', 'us-cam-plus', 'rep-bryan', 'medical', {
    dashed: true,
    targetHandle: T,
  }),
  edge('e-uscam-open', 'us-cam', 'rep-open', 'commercial', { targetHandle: T }),
  edge('e-uscam-jordan', 'us-cam', 'rep-jordan', 'commercial', {
    dashed: true,
    targetHandle: T,
  }),
  edge('e-uscwm-open', 'us-cwm', 'rep-open', 'operational', { targetHandle: T }),

  // BDR → AE support. Tom covers both UK AEs; Bryan covers Jen.
  supportEdge('e-tom-supports-meg', 'rep-tom', 'rep-meg', 'left'),
  supportEdge('e-tom-supports-april', 'rep-tom', 'rep-april', 'right'),
  supportEdge('e-bryan-supports-jen', 'rep-bryan', 'rep-jen', 'left'),

  // Coverage → segments
  edge('e-meg-nhs', 'rep-meg', 'seg-nhs', 'medical', { sourceHandle: S }),
  edge('e-tom-nhs', 'rep-tom', 'seg-nhs', 'medical', { dashed: true, sourceHandle: S }),
  edge('e-april-forecourts', 'rep-april', 'seg-forecourts', 'commercial', { sourceHandle: S }),
  edge('e-april-food', 'rep-april', 'seg-uk-food', 'commercial', { sourceHandle: S }),
  edge('e-tom-food', 'rep-tom', 'seg-uk-food', 'commercial', { dashed: true, sourceHandle: S }),
  edge('e-jen-medical', 'rep-jen', 'seg-us-medical', 'medical', { sourceHandle: S }),
  edge('e-bryan-medical', 'rep-bryan', 'seg-us-medical', 'medical', {
    dashed: true,
    sourceHandle: S,
  }),
  edge('e-open-senior', 'rep-open', 'seg-senior', 'commercial', { sourceHandle: S }),
  edge('e-open-catering', 'rep-open', 'seg-catering', 'commercial', { sourceHandle: S }),
  edge('e-jordan-catering', 'rep-jordan', 'seg-catering', 'commercial', {
    dashed: true,
    sourceHandle: S,
  }),
  edge('e-jordan-venues', 'rep-jordan', 'seg-venues', 'commercial', {
    dashed: true,
    sourceHandle: S,
  }),
  edge('e-open-venues', 'rep-open', 'seg-venues', 'commercial', { sourceHandle: S }),

  // Commercial segments roll up under the facilities-management umbrella
  edge('e-ukfood-umbrella', 'seg-uk-food', 'umbrella', 'commercial'),
  edge('e-forecourts-umbrella', 'seg-forecourts', 'umbrella', 'commercial'),
  edge('e-senior-umbrella', 'seg-senior', 'umbrella', 'commercial'),
  edge('e-catering-umbrella', 'seg-catering', 'umbrella', 'commercial'),
  edge('e-venues-umbrella', 'seg-venues', 'umbrella', 'commercial'),

  // Umbrella positioning drives the channel plan
  edge('e-umbrella-apollo', 'umbrella', 'ch-apollo', 'commercial'),
  edge('e-umbrella-linkedin', 'umbrella', 'ch-linkedin', 'commercial'),
  edge('e-umbrella-google', 'umbrella', 'ch-google', 'commercial'),
  edge('e-umbrella-chatgpt', 'umbrella', 'ch-chatgpt', 'commercial'),
];
