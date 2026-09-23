// Single source of truth for GTM markets.
//
// Both the GTM map (/gtm-map) and the GTM planner (/gtm-planning) previously
// carried their own market lists, which drifted: the planner had a UK
// entertainment market the map never showed, and the two disagreed on
// beachheads for US venues and facilities. Everything now derives from here.
//
// Two separate axes, deliberately:
//   pillar   — the product line, used for colour and grouping on the map.
//   category — the planner's revenue split. CWM/operational is merged into
//              commercial because operational is not planned as its own
//              number today, even though it is a distinct product.

export type Pillar = 'medical' | 'commercial' | 'operational';

/** The planner splits revenue two ways only. Operational rolls into commercial. */
export type PlanCategory = 'medical' | 'commercial';

export type Region = 'uk' | 'us';

export interface Beachhead {
  name: string;
  logo?: string;
}

export interface ApolloListRef {
  id: string;
  name: string;
}

export interface GtmMarket {
  id: string;
  label: string;
  detail?: string;
  region: Region;
  pillar: Pillar;
  category: PlanCategory;
  beachheads: Beachhead[];
  /**
   * Apollo account lists backing this market. Apollo has no field linking a
   * list to a market and list names are edited freely, so the link is stated
   * here. The id is the stable key; the name keeps this file readable and
   * still lets a deleted list be named in the UI.
   *
   * Account lists only — contact lists hold far more records (~5.7k in "TF
   * Retail and Food Manufacturing UK" alone) and are out of scope.
   */
  apolloLists: ApolloListRef[];
}

export const GTM_MARKETS: GtmMarket[] = [
  {
    id: 'uk-healthcare',
    label: 'Healthcare / NHS hospitals',
    detail: 'Pharmacy and pathology demand',
    region: 'uk',
    pillar: 'medical',
    category: 'medical',
    beachheads: [{ name: 'NHS', logo: '/logos/nhs.svg' }],
    apolloLists: [
      { id: '689b195b862ab80019c4da59', name: 'TF All healthcare uk' },
      { id: '68a848bfd711200019039aba', name: 'NHS Pharmacy Tier 1 Meg TF' },
      { id: '689f0d2056a00e001541be97', name: 'UK Healthcare page 3-10 TF' },
      { id: '692036668212e30021509339', name: "children's hospitals uk" },
      { id: '6894c87336eecf000d2976ab', name: 'First 2 pages of healthcare - none customers' },
      { id: '6aac21f9c26b4800181c20c0', name: 'Lookalike · Healthcare / NHS hospitals · 2026-09' },
    ],
  },
  {
    id: 'us-medical',
    label: 'Medical / labs',
    detail: 'Plasma, labs and biobanks',
    region: 'us',
    pillar: 'medical',
    category: 'medical',
    beachheads: [
      { name: 'Grifols', logo: '/logos/grifols.svg' },
      { name: 'Octapharma', logo: '/logos/octapharma.svg' },
      { name: 'BioIVT' },
    ],
    apolloLists: [
      { id: '6aa8651bb8d1e20018dcd9f7', name: 'US Medical — Target Accounts' },
      { id: '6aa9a90198d02f000cc6d9fd', name: 'US Medical — Labs V1' },
      { id: '6a9b068bdf35bc0018c46a88', name: 'Medical Monitoring - V1' },
      { id: '6aa04f209552770018dc6242', name: 'BioIVT Lookalikes List' },
      { id: '6aac2280849261001c7d61cb', name: 'Lookalike · Medical / labs · 2026-09' },
    ],
  },
  {
    id: 'uk-forecourts',
    label: 'Forecourts & convenience',
    detail: 'Multi-site operators',
    region: 'uk',
    pillar: 'commercial',
    category: 'commercial',
    beachheads: [{ name: 'BP', logo: '/logos/bp.png' }],
    apolloLists: [
      { id: '68a867a5d22893000d276b50', name: 'Petrol stations UK' },
      { id: '6aac2161c73aad001c768c99', name: 'Lookalike · Forecourts & convenience · 2026-09' },
    ],
  },
  {
    id: 'uk-entertainment',
    label: 'Entertainment & leisure',
    detail: 'Ferries, bowling, attractions',
    region: 'uk',
    pillar: 'commercial',
    category: 'commercial',
    beachheads: [
      { name: 'P&O Ferries', logo: '/logos/poferries.png' },
      { name: 'Tenpin', logo: '/logos/tenpin.png' },
    ],
    // Had no account list at all until the lookalike run; the UK hospitality
    // list still sits under food service.
    apolloLists: [
      { id: '6aac23100a208c0014c2f9e3', name: 'Lookalike · Entertainment & leisure · 2026-09' },
    ],
  },
  {
    id: 'uk-foodservice',
    label: 'Food service & FM',
    detail: 'Coffee shops, food-to-go, facilities mgmt',
    region: 'uk',
    pillar: 'commercial',
    category: 'commercial',
    beachheads: [],
    apolloLists: [
      { id: '689c5cb3db810c001d95b1a2', name: 'TF Food production & retail UK' },
      { id: '689b2d5151e73a00151f7284', name: 'TF Hospitality uk' },
      { id: '68a87fd85b5092001931dd64', name: "Restaurants, pubs, bars UK first 20 Luis's list" },
      { id: '6ab1465c304a16000cf8fefb', name: 'FM · UK · 2026-09' },
      // Despite the name, this is largely food manufacturers (Tate & Lyle,
      // Müller, Warburtons) rather than food service or FM operators: the ICP
      // accepts "food production" as an industry. A CAM target, but a
      // production/QA buyer rather than a facilities one.
      { id: '6aac233500f6cc001c1f809f', name: 'Lookalike · Food service & FM · 2026-09' },
    ],
  },
  {
    id: 'uk-water',
    label: 'Water utilities',
    detail: 'Operational monitoring — CWM led',
    region: 'uk',
    pillar: 'operational',
    // Operational has no separate planning number, so it competes for the
    // commercial allocation.
    category: 'commercial',
    beachheads: [],
    apolloLists: [
      { id: '6927063e1e2d2f0015cc748a', name: 'water companies UK' },
      { id: '6aac236d5a2fa300107fdf5d', name: 'Lookalike · Water utilities · 2026-09' },
    ],
  },
  {
    id: 'us-venues',
    label: 'Venues & entertainment',
    detail: 'Stadiums, arenas, attractions',
    region: 'us',
    pillar: 'commercial',
    category: 'commercial',
    beachheads: [{ name: 'OVG' }, { name: 'Guggenheim' }],
    // Was contact-list only ("OVG GM/Chef List"); the lookalike run gave this
    // market its first account list. Most of it has no contacts yet.
    apolloLists: [
      { id: '6aac23865a2fa300107fdfac', name: 'Lookalike · Venues & entertainment · 2026-09' },
    ],
  },
  {
    id: 'us-senior',
    label: 'Senior living',
    detail: 'Food safety across facilities',
    region: 'us',
    pillar: 'commercial',
    category: 'commercial',
    beachheads: [{ name: 'Morningstar' }],
    apolloLists: [
      { id: '6876afcd1cacdc001d7e7a9c', name: 'senior living upload' },
      { id: '6aac24157e513d00101ea3e2', name: 'Lookalike · Senior living · 2026-09' },
    ],
  },
  {
    id: 'us-facilities',
    label: 'Contract catering & FM',
    detail: 'Outsourced food service at scale',
    region: 'us',
    pillar: 'commercial',
    category: 'commercial',
    beachheads: [{ name: 'ISS' }, { name: 'Compass' }],
    apolloLists: [
      { id: '6ab1465d0bf79c001c3e8944', name: 'FM · US · 2026-09' },
      { id: '6aac24944ee6930018fcdfd7', name: 'Lookalike · Contract catering & FM · 2026-09' },
    ],
  },
];

/**
 * Account lists deliberately kept off the map, so an unmapped list surfaces as
 * a gap to triage rather than being silently ignored.
 */
export const EXCLUDED_APOLLO_LISTS: Record<string, string> = {
  '6877e7cd5f3f7c0019db6424': 'Customers — installed base, not a target list',
  '6aa8651c867a3200141c7ae9': 'US Medical — Customers (do not sequence)',
  '6aa00bdac5921f0014b93f5e': 'BB — single account, looks like a test list',
  '6aad78619393ba0014413096':
    'Customer · GTM1 — installed base from the GTM1 export, used to exclude customers from prospecting',
  '6aad77559393ba001441242f':
    'Lookalike · Active opp — parked lookalikes with a live opportunity, held back from cold sequences',
  // Superseded by FM · UK and FM · US. Between them these two held 122 records
  // that deduplicate to 68 companies, 53 of those records being five customer
  // groups (Sodexo alone appears 28 times), so their counts badly overstate
  // the addressable set.
  '689331aa3beb9c0015a72908': 'Facilities Management companies — superseded by FM · UK / FM · US',
  '68a8778984f38f000d15e467': 'FM Companies UK — superseded by FM · UK',
};

/** The map's segment node id for a market. */
export function segmentNodeId(marketId: string) {
  return `seg-${marketId}`;
}

export function marketsByRegion(region: Region) {
  return GTM_MARKETS.filter((m) => m.region === region);
}

export function marketById(id: string) {
  return GTM_MARKETS.find((m) => m.id === id);
}

/** Every mapped list, flattened, with the market that claims it. */
export function mappedApolloLists() {
  return GTM_MARKETS.flatMap((m) =>
    m.apolloLists.map((l) => ({ ...l, marketId: m.id, segmentId: segmentNodeId(m.id) }))
  );
}
