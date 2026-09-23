// Ideal-customer profiles per GTM market, used to find lookalike accounts in
// Apollo's global company database.
//
// Why this is configuration rather than something derived at runtime:
//
//   1. Apollo's search API has no industry filter. `organization_industries` is
//      silently ignored and there is no endpoint listing industry tag ids, so
//      the only workable pattern is a keyword search to narrow the pool cheaply
//      followed by a strict client-side check on the returned `industry` value.
//      Both the keywords and the accepted industry strings have to be stated.
//   2. Apollo's taxonomy is LinkedIn's older vintage ("hospital & health care",
//      "food & beverages") while the customer export carries the current one
//      ("hospitals and health care", "food and beverage services"), so the two
//      cannot be compared directly.
//   3. Two markets (us-senior, us-venues) have one customer or none, so no
//      profile can be inferred from the installed base at all.
//
// The industry strings are Apollo's exact spellings, sampled from live search
// responses. The headcount bands bracket the active customer percentiles per
// market, measured from customer_accounts:
//
//   market            p25     median   p90
//   uk-healthcare     1,076    1,676   4,399
//   uk-foodservice       13       59     526
//   uk-entertainment     22       81     630
//   us-medical           32       78   3,696
//   us-facilities        25       44   7,882
//   us-venues         1,070    1,070   1,070   (single customer)
//   uk-forecourts    65,862   65,862  65,862   (single customer, BP)

export interface IcpProfile {
  marketId: string;
  /** Apollo's `organization_locations` values. */
  locations: string[];
  /** Apollo's `organization_num_employees_ranges` values. */
  employeeRanges: string[];
  /**
   * Passed as `q_organization_keyword_tags`, one search per keyword. Keywords
   * alone are noisy — searching "hospital" returns recruitment agencies and a
   * job board called "Hospital Jobs" — so they only narrow the pool.
   */
  keywords: string[];
  /**
   * Candidates are kept only if Apollo's `industry` is in this set. This is
   * what removes the keyword noise.
   */
  industries: string[];
}

const UK = ['United Kingdom'];
const US = ['United States'];

export const ICP_PROFILES: IcpProfile[] = [
  {
    // Includes pharma and biotech: UK life sciences is only ~$320k across a
    // dozen accounts, too small for its own market, so it sits here with NHS.
    marketId: 'uk-healthcare',
    locations: UK,
    employeeRanges: ['201,1000', '1001,5000', '5001,10000'],
    keywords: ['hospital', 'nhs trust', 'pathology', 'pharmacy', 'pharmaceutical', 'biotechnology'],
    // "mental health care" is deliberately absent: it matched charities and
    // advocacy groups (Mind, YoungMinds) rather than anything with a pharmacy
    // or pathology estate.
    industries: [
      'hospital & health care',
      'medical practice',
      'pharmaceuticals',
      'biotechnology',
      'medical devices',
    ],
  },
  {
    // Deliberately broad across labs, biobanks, devices and plasma rather than
    // anchored on plasma alone.
    marketId: 'us-medical',
    locations: US,
    employeeRanges: ['51,200', '201,1000', '1001,5000'],
    keywords: [
      'plasma',
      'biologics',
      'clinical laboratory',
      'biobank',
      'diagnostics',
      'medical device',
      'pharmaceutical',
      'biotechnology',
    ],
    industries: [
      'hospital & health care',
      'medical devices',
      'pharmaceuticals',
      'biotechnology',
      'medical practice',
    ],
  },
  {
    marketId: 'uk-forecourts',
    locations: UK,
    // BP is 65k staff, but the addressable set is multi-site operators well
    // below that, so the band is widened downward rather than matched to BP.
    employeeRanges: ['201,1000', '1001,5000', '5001,10000', '10001,50000'],
    keywords: ['petrol station', 'forecourt', 'convenience store', 'fuel retail', 'service station'],
    industries: ['oil & energy', 'retail', 'utilities'],
  },
  {
    marketId: 'uk-entertainment',
    locations: UK,
    employeeRanges: ['51,200', '201,1000', '1001,5000'],
    keywords: ['bowling', 'ferry', 'theme park', 'visitor attraction', 'cinema', 'leisure centre'],
    industries: [
      'entertainment',
      'leisure, travel & tourism',
      'recreational facilities',
      'gambling & casinos',
      'sports',
    ],
  },
  {
    marketId: 'uk-foodservice',
    locations: UK,
    employeeRanges: ['51,200', '201,1000', '1001,5000'],
    keywords: [
      'coffee shop',
      'restaurant group',
      'food to go',
      'contract catering',
      'facilities management',
      'food production',
    ],
    industries: [
      'restaurants',
      'food & beverages',
      'food production',
      'hospitality',
      'facilities services',
      'retail',
    ],
  },
  {
    marketId: 'us-venues',
    locations: US,
    employeeRanges: ['201,1000', '1001,5000', '5001,10000'],
    keywords: ['stadium', 'arena', 'amphitheater', 'convention center', 'museum', 'theme park'],
    industries: [
      'entertainment',
      'recreational facilities',
      'sports',
      'hospitality',
      'museums & institutions',
    ],
  },
  {
    // No customers at all, so the profile is derived from the stated beachhead
    // (Morningstar) rather than from revenue.
    marketId: 'us-senior',
    locations: US,
    employeeRanges: ['51,200', '201,1000', '1001,5000'],
    keywords: ['senior living', 'assisted living', 'retirement community', 'nursing home'],
    industries: ['hospital & health care', 'individual & family services', 'medical practice'],
  },
  {
    marketId: 'us-facilities',
    locations: US,
    employeeRanges: ['51,200', '201,1000', '1001,5000', '5001,10000'],
    keywords: [
      'contract catering',
      'facilities management',
      'food service management',
      'dining services',
      'janitorial',
    ],
    industries: ['facilities services', 'restaurants', 'food & beverages', 'hospitality'],
  },
];

export function icpForMarket(marketId: string) {
  return ICP_PROFILES.find((p) => p.marketId === marketId);
}

/**
 * Organisations that sit in a buying industry but do not operate the estate
 * the product monitors — trade press, regulators, recruiters and job boards.
 * Apollo classifies Nursing Times as "hospital & health care", so the industry
 * filter alone lets them through.
 *
 * Councils are not excluded: they run school and civic catering, and one is
 * already a customer.
 */
const NON_OPERATOR = new RegExp(
  [
    // Trade press, recruiters, events
    /\b(times|gazette|journal|magazine|newspaper|publishing|publisher|recruitment|recruiters|staffing|jobs|careers|classifieds|directory|conferences?|expo)\b/
      .source,
    // Professional bodies, regulators and membership organisations. Written as
    // "X of Y" forms and specific names so they do not catch real operators —
    // a plain /society/ would drop Co-operative Society, a convenience chain.
    /\broyal college\b|\b(college|institute|association|federation|academy|faculty|board) of\b|\bchartered institute\b|\bmidwifery council\b|\bleadership academy\b/
      .source,
  ].join('|'),
  'i'
);

/**
 * Country-code TLDs that contradict the market's region. Apollo's
 * `organization_locations` filter leaks — a US facilities search returned
 * catering-academy.co.uk and alliedcatering.com.sa — so the domain is used as
 * a second opinion. Generic TLDs (.com, .org, and the short ones used
 * generically) are always allowed, since UK and US firms both use them.
 */
const GENERIC_SHORT_TLD = new Set(['io', 'ai', 'co', 'me', 'tv', 'ly', 'app', 'dev']);
const REGION_TLD: Record<string, Set<string>> = {
  'United Kingdom': new Set(['uk']),
  'United States': new Set(['us', 'ca']),
};

export function plausibleForRegion(domain: string, locations: string[]) {
  const last = domain.split('.').pop() || '';
  if (last.length !== 2) return true;
  if (GENERIC_SHORT_TLD.has(last)) return true;
  return locations.some((loc) => REGION_TLD[loc]?.has(last));
}

export function isOperator(name: string) {
  return !NON_OPERATOR.test(name);
}
