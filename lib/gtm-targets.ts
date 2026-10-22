// Target lists and how their accounts are classified.
//
// The four consolidated Apollo target lists (two per region; US and UK are
// never mixed) are what the outreach plan sequences. Their accounts are
// synced nightly into gtm_target_accounts and classified here, so the GTM
// planner, the GTM map and the outreach page all read one definition of
// "customer", "too small" and "segment".
//
// The Python builders in scripts/ hold the same rules for the one-off Apollo
// list builds and Excel exports; lib/gtm-target-rules.json is shared by both.

import rules from './gtm-target-rules.json';

export type Region = 'US' | 'UK';
export type Segmenter = 'us-healthcare' | 'uk-healthcare' | 'food-service';

export interface TargetList {
  /** Apollo label id: the stable key. */
  id: string;
  name: string;
  region: Region;
  /** Market in lib/gtm-markets.ts that this list rolls up to on the map. */
  marketId: string;
  segmenter: Segmenter;
}

export const TARGET_LISTS: TargetList[] = [
  { id: '6ad8d5d602c70b00189187c0', name: 'US Healthcare targets', region: 'US', marketId: 'us-medical', segmenter: 'us-healthcare' },
  { id: '6ad8b9470082ae0010a432d2', name: 'Food service · US', region: 'US', marketId: 'us-facilities', segmenter: 'food-service' },
  { id: '6ada12d70709160020f98f7a', name: 'NHS & UK Healthcare targets', region: 'UK', marketId: 'uk-healthcare', segmenter: 'uk-healthcare' },
  { id: '6ad8b9ff8ff1d7001477f102', name: 'Food service · UK', region: 'UK', marketId: 'uk-foodservice', segmenter: 'food-service' },
];

/** US senior living lists; membership marks a food-service account as senior living. */
export const SENIOR_LIVING_LIST_IDS = ['6876afcd1cacdc001d7e7a9c', '6aac24157e513d00101ea3e2'];

export const SEGMENT_ORDER: Record<Segmenter, string[]> = {
  'us-healthcare': [
    'Plasma, blood & tissue',
    'Labs & diagnostics',
    'Hospitals & health systems',
    'Research & life sciences',
    'Pharma & biotech',
    'Medical devices',
    'Other',
    'Clinics & medical practices',
  ],
  'uk-healthcare': [
    'NHS acute trusts',
    'Health boards (Scotland, Wales, NI)',
    'Pathology networks & national bodies',
    'Independent labs & diagnostics',
    'Private hospitals',
    'NHS hospital sites',
    'Pharmacy groups & distribution',
    'Life sciences (pharma, biotech, devices)',
    'Universities & research labs',
  ],
  'food-service': [
    'Contract catering & food service',
    'Venues, stadiums & live events',
    'Senior living & care',
    'Facilities services',
    'Leisure, attractions & hospitality',
  ],
};

// ---------------------------------------------------------------------------
// Customer and size rules

export const MIN_EMPLOYEES: number = rules.minEmployees;
const DROP_UNKNOWN_SIZE: boolean = rules.dropUnknownSize;
const CUSTOMER_GROUPS = Object.entries(rules.customerGroups as Record<string, string>).map(
  ([group, rx]) => [group, new RegExp(rx, 'i')] as const
);

function normName(s: string | null | undefined) {
  return (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\b(inc|llc|ltd|limited|plc|co|corp|corporation|group|the)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface CustomerIndex {
  names: Set<string>;
  domains: Set<string>;
}

export function buildCustomerIndex(rows: { company_name: string | null; domain: string | null; match_domain: string | null }[]): CustomerIndex {
  return {
    names: new Set(rows.map((r) => normName(r.company_name)).filter((n) => n.length > 3)),
    domains: new Set(rows.flatMap((r) => [r.domain, r.match_domain]).filter(Boolean).map((d) => String(d).toLowerCase())),
  };
}

/** Why an account counts as a customer, or null if it does not. */
export function customerReason(
  account: { name: string | null; domain: string | null; stageName: string | null },
  customers: CustomerIndex
): string | null {
  if (account.stageName && /current client|do not prospect/i.test(account.stageName)) return `Apollo stage: ${account.stageName}`;
  if (account.domain && customers.domains.has(account.domain.toLowerCase())) return 'Customer domain';
  if (customers.names.has(normName(account.name))) return 'Customer name';
  const group = CUSTOMER_GROUPS.find(([, rx]) => rx.test(account.name || ''));
  return group ? `${group[0]} group` : null;
}

export function tooSmall(employees: number | null) {
  return employees === null || employees === undefined ? DROP_UNKNOWN_SIZE : employees < MIN_EMPLOYEES;
}

// ---------------------------------------------------------------------------
// Segment rules (first match wins)

function usHealthcareSegment(name: string, industry: string) {
  if (/plasma|blood|tissue|biobank|bio bank|donor|cord|transfusion/.test(name)) return 'Plasma, blood & tissue';
  if (/\blab|diagnostic|patholog|reference/.test(name)) return 'Labs & diagnostics';
  if (industry === 'pharmaceuticals' || industry === 'biotechnology') return 'Pharma & biotech';
  if (industry === 'research') return 'Research & life sciences';
  if (industry === 'medical devices') return 'Medical devices';
  if (industry === 'hospital & health care') return 'Hospitals & health systems';
  if (industry === 'medical practice') return 'Clinics & medical practices';
  return 'Other';
}

const UK_HEALTHCARE_RULES: [string, RegExp][] = [
  ['Exclude: duplicate record', /do not use|duplicate/],
  ['Exclude: not a healthcare operator', /microsoft|shred-?it|care quality commission|nmc-uk|^website$|siemens healthcare/],
  ['Exclude: care homes (UK food service)', /care uk|barchester|hc-one|avery healthcare|voyage|priory|elysium|craegmoor|partnerships in care|methodist homes|\bmha\b|care homes|lifeways|caremark|helping hands|county healthcare|achieve together|creative support|cygnet|home care/],
  ['Exclude: ambulance', /ambulance/],
  ['Exclude: mental health & community', /mental|community health|community healthcare|partnership nhs|care partnership|psychiatr|learning disab|community hospital/],
  ['Health boards (Scotland, Wales, NI)', /health board|health and social care|hscni|nhs (lothian|greater glasgow|grampian|tayside|fife|highland|lanarkshire|ayrshire|borders|dumfries|forth valley|orkney|shetland|western isles)|velindre|public health wales/],
  ['Pathology networks & national bodies', /pathology|synnovis|blood and transplant|nhsbt|ukhsa|health security|supply chain|specialist pharmacy|nhs england|education for scotland|health education|integrated care board|\bicb\b|genomics service/],
  ['Independent labs & diagnostics', /laborator|\blabs?\b|diagnostic|synlab|randox|lumiradx|inhealth/],
  ['Pharmacy groups & distribution', /pharmacy|pharmacist|alloga|medicines/],
  ['Private hospitals', /spire|nuffield|circle health|circle bath|ramsey health|\bbmi\b|\bhca\b|ramsay|bupa|british united provident|london clinic|cromwell|king edward|practice plus|benenden|aspen|one healthcare|horder|private hospital|parkside hospital|highgate|the holly/],
  ['NHS acute trusts', /^(uhbw|uhsm|sath|chsft|lhch)$|nhs|foundation trust|university hospital|teaching hospital|children.?s hospital|hospitals? trust/],
  ['NHS hospital sites', /hospital|infirmary|medical centre/],
];
const UK_INDUSTRY_SEGMENTS: Record<string, string> = {
  pharmaceuticals: 'Life sciences (pharma, biotech, devices)',
  biotechnology: 'Life sciences (pharma, biotech, devices)',
  'medical devices': 'Life sciences (pharma, biotech, devices)',
  research: 'Universities & research labs',
  'higher education': 'Universities & research labs',
};

function ukHealthcareSegment(name: string, industry: string) {
  const hit = UK_HEALTHCARE_RULES.find(([, rx]) => rx.test(name));
  if (hit) return hit[0];
  return UK_INDUSTRY_SEGMENTS[industry] ?? 'Exclude: unclassified';
}

const UK_CARE = /^care uk|barchester|hc-one|avery healthcare|methodist homes|\bmha\b|care homes|orchard care|anchor hanover|four seasons health/;

function foodServiceSegment(name: string, industry: string, isSeniorList: boolean) {
  if (isSeniorList || /senior|assisted living|retirement|care home|nursing|memory care/.test(name) || UK_CARE.test(name)) return 'Senior living & care';
  if (
    /stadium|arena|\bfc\b|football|soccer|cricket|rugby|club\b|live nation|\baeg\b|legends|convention|amphitheat|coliseum|ballpark|\bnec\b|sports|racecourse|speedway|anschutz/.test(name) ||
    industry === 'sports' ||
    industry === 'events services'
  )
    return 'Venues, stadiums & live events';
  if (
    /cater|dining|food ?service|concession|restaurant associates|hmshost|\bssp\b|elior|baxterstorey|aramark|delaware north|sodexo|levy|vending|canteen|kitchen|ch&co|thomas franks|\bwsh\b|bartlett mitchell|vacherin|lexington|gather|healthcare services group|avi foodsystems|holroyd howe|taylor shaw/.test(name) ||
    industry === 'food & beverages' ||
    industry === 'restaurants'
  )
    return 'Contract catering & food service';
  if (
    ['recreational facilities', 'entertainment', 'museums & institutions', 'hospitality', 'leisure, travel & tourism', 'gambling & casinos'].includes(industry) ||
    /casino|resort|hotel|bowl|topgolf|theme park|seaworld|zoo|museum|cinema|attraction/.test(name)
  )
    return 'Leisure, attractions & hospitality';
  return 'Facilities services';
}

export function segmentFor(
  segmenter: Segmenter,
  account: { name: string | null; industry: string | null; labelIds?: string[] }
): string {
  const name = (account.name || '').toLowerCase();
  const industry = (account.industry || '').toLowerCase();
  if (segmenter === 'us-healthcare') return usHealthcareSegment(name, industry);
  if (segmenter === 'uk-healthcare') return ukHealthcareSegment(name, industry);
  const isSenior = (account.labelIds || []).some((id) => SENIOR_LIVING_LIST_IDS.includes(id));
  return foodServiceSegment(name, industry, isSenior);
}

/** Final status of a synced account for outreach. */
export type TargetStatus = 'target' | 'customer' | 'excluded';

export function classify(
  list: TargetList,
  account: { name: string | null; domain: string | null; industry: string | null; employees: number | null; country: string | null; stageName: string | null; labelIds?: string[] },
  customers: CustomerIndex
): { status: TargetStatus; segment: string; reason: string | null } {
  const segment = segmentFor(list.segmenter, account);
  const cust = customerReason(account, customers);
  if (cust) return { status: 'customer', segment, reason: cust };
  // Apollo sometimes records Irish (HSE) hospitals as UK; the domain is the tell.
  const wrongRegion =
    (list.region === 'UK' && ((account.country && account.country !== 'United Kingdom') || account.domain?.endsWith('.ie'))) ||
    (list.region === 'US' && account.country && account.country !== 'United States');
  if (wrongRegion) return { status: 'excluded', segment, reason: `Outside ${list.region}` };
  if (segment.startsWith('Exclude')) return { status: 'excluded', segment, reason: segment.replace('Exclude: ', '') };
  if (tooSmall(account.employees)) return { status: 'excluded', segment, reason: `Under ${MIN_EMPLOYEES} staff` };
  return { status: 'target', segment, reason: null };
}
