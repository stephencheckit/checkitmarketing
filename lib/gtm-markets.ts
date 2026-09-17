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
    apolloLists: [{ id: '68a867a5d22893000d276b50', name: 'Petrol stations UK' }],
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
    // No Apollo account list exists for this market — the UK hospitality list
    // sits under food service. This is a genuine prospecting gap.
    apolloLists: [],
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
      { id: '68a8778984f38f000d15e467', name: 'FM Companies UK' },
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
    apolloLists: [{ id: '6927063e1e2d2f0015cc748a', name: 'water companies UK' }],
  },
  {
    id: 'us-venues',
    label: 'Venues & entertainment',
    detail: 'Stadiums, arenas, attractions',
    region: 'us',
    pillar: 'commercial',
    category: 'commercial',
    beachheads: [{ name: 'OVG' }, { name: 'Guggenheim' }],
    // Tracked only as a contact list ("OVG GM/Chef List"), so account-based
    // prospecting does not cover this market at all.
    apolloLists: [],
  },
  {
    id: 'us-senior',
    label: 'Senior living',
    detail: 'Food safety across facilities',
    region: 'us',
    pillar: 'commercial',
    category: 'commercial',
    beachheads: [{ name: 'Morningstar' }],
    apolloLists: [{ id: '6876afcd1cacdc001d7e7a9c', name: 'senior living upload' }],
  },
  {
    id: 'us-facilities',
    label: 'Contract catering & FM',
    detail: 'Outsourced food service at scale',
    region: 'us',
    pillar: 'commercial',
    category: 'commercial',
    beachheads: [{ name: 'ISS' }, { name: 'Compass' }],
    // "Facilities Management companies" carries no region in its name —
    // assigned here on the assumption it is the US FM pool.
    apolloLists: [{ id: '689331aa3beb9c0015a72908', name: 'Facilities Management companies' }],
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
