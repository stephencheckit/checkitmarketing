// Sales playbook — the strategy layer for BDR outbound.
// One entry per focus vertical: target accounts (live from Apollo lists),
// personas + pains, use cases/proof points, talking points, and the email
// cadence (synced to Apollo sequences, or copied manually).
//
// Content is code, not CMS: edit this file to update the playbook.
// Apollo lists are referenced by name (as they appear in Apollo) and
// resolved to live counts/accounts at render time.

export interface Persona {
  title: string;
  role: string; // what they own, in one line
  pains: string[];
  caresAbout: string[]; // what a win looks like for them
  /** Job titles the BDR should search for in Apollo to find this persona */
  apolloTitleFilters?: string[];
}

export interface UseCase {
  name: string;
  detail: string;
}

export interface CadenceStep {
  /** Days to wait after the previous step (0 = immediately on enrollment) */
  waitDays: number;
  channel: 'email' | 'linkedin' | 'call';
  subject: string; // for non-email steps, used as the step title
  body: string;
}

export interface Cadence {
  name: string; // becomes the Apollo sequence name
  persona: string; // which persona this cadence targets
  steps: CadenceStep[];
}

/**
 * Curated account for an ABM vertical. Pushed into Apollo via
 * /accounts/bulk_create with append_label_names (see lib/apollo.ts).
 */
export interface TargetAccount {
  name: string;
  domain: string;
  segment: string; // vertical-defined bucket (e.g. 'plasma', 'blood', 'opo')
  tier: 1 | 2 | 3; // 1 = top priority, 3 = fill-in
  relationship: 'prospect' | 'customer';
  /** One-line note: footprint + why now. Include 'verify domain' if uncertain. */
  note: string;
}

export interface Vertical {
  id: string;
  name: string;
  region: 'UK' | 'US';
  status: 'active' | 'exploring';
  summary: string;
  /** Names of Apollo account lists (modality: accounts) for this vertical */
  apolloAccountLists: string[];
  /** Names of Apollo contact lists for this vertical */
  apolloContactLists: string[];
  personas: Persona[];
  useCases: UseCase[];
  proofPoints: string[];
  talkingPoints: string[];
  objections: { objection: string; response: string }[];
  cadences: Cadence[];
  /** Optional: curated target accounts (ABM). Pushed to Apollo on demand. */
  targetAccounts?: TargetAccount[];
  /** Optional: things the BDR should research per account before outreach */
  triggers?: string[];
}

export const PLAYBOOK: Vertical[] = [
  // ==========================================================================
  {
    id: 'nhs-pharmacy',
    name: 'NHS Hospital Pharmacies',
    region: 'UK',
    status: 'active',
    summary:
      'CAM+ continuous monitoring for hospital pharmacies — main pharmacy, satellites, and ward fridges. Regulated cold chain, high-value biologics, audit pressure, and shrinking pharmacy workforce. Key accounts: NHS trusts (sold via pharmacy leadership, procurement frameworks).',
    apolloAccountLists: ['NHS Pharmacy Tier 1 Meg TF'],
    apolloContactLists: ['NHS Pharmacy Tier 1 contacts', 'Pharmacy contacts 08.09'],
    personas: [
      {
        title: 'Chief Pharmacist / Director of Pharmacy',
        role: 'Accountable for medicines safety and governance across the trust',
        pains: [
          'A single overnight fridge excursion can silently ruin biologics or chemotherapy — patient safety risk they carry personally',
          'One lost batch can cost tens of thousands of pounds from a budget already under pressure',
          'Paper logbooks fail CQC/MHRA audits — auditors now expect continuous monitoring with a validated trail',
          'Skilled pharmacist time lost to manual checks, transcription, and backtracking after excursions',
        ],
        caresAbout: [
          'Zero unexplained excursions and a defensible audit position',
          'Releasing clinical time back to patient-facing work',
          'One standard across main pharmacy, satellites, and ward fridges',
        ],
      },
      {
        title: 'Quality / Governance Lead',
        role: 'Owns audit readiness and compliance procedures for pharmacy services',
        pains: [
          'Reconstructing temperature records after the fact is impossible with paper',
          'Calibration traceability is scattered across spreadsheets and certificates',
          'Compounding units: fewer staff, larger portfolios — manual checks physically don\u2019t scale',
        ],
        caresAbout: [
          'Audit-ready reporting on demand, not assembled in a panic',
          'Standardised procedures across every site and satellite',
        ],
      },
    ],
    useCases: [
      { name: 'Automated temperature records', detail: '100% of fridge/freezer temps captured continuously, no manual logging' },
      { name: 'Excursion alerts and escalation', detail: '24/7 alerting with escalation paths so overnight drift never goes unseen' },
      { name: 'Audit-ready reporting', detail: 'Validated, timestamped records that satisfy CQC/MHRA expectations' },
      { name: 'Calibration traceability', detail: 'Annual on-site calibration with full certificate trail' },
      { name: 'Multi-site dashboards', detail: 'One view across main pharmacy, satellites, and ward fridges' },
    ],
    proofPoints: [
      '24/7 continuous monitoring; 100% of temperature records captured automatically',
      'Zero manual fridge checks — pharmacy time returned to clinical work',
      'One platform across pharmacy, wards, and sites',
      'Subscription model: hardware, warranty, annual calibration, and support included — no capital outlay',
    ],
    talkingPoints: [
      'Open with patient safety, not efficiency: an unseen overnight excursion means compromised medicines reaching patients.',
      'The audit angle lands with quality leads: "could you reconstruct last March\u2019s records for an inspector today?"',
      'NHS budget angle: subscription pricing avoids capital business cases — it\u2019s an operational cost with a waste-avoidance payback (one saved batch can cover a year).',
      'Workforce angle: pharmacy teams are short-staffed; manual checks are the first thing skipped and the last thing anyone wants to do.',
    ],
    objections: [
      {
        objection: 'We already do manual checks twice a day.',
        response: 'Manual checks are snapshots — excursions happen between them, especially overnight and weekends. Auditors increasingly treat twice-daily logs as insufficient for high-value biologics.',
      },
      {
        objection: 'No budget this year.',
        response: 'No capital required — it\u2019s a subscription that includes hardware, calibration, and support. One prevented batch loss typically covers the annual cost.',
      },
      {
        objection: 'IT won\u2019t approve another connected system.',
        response: 'Checkit runs on its own wireless mesh network — nothing touches the trust\u2019s network, so there\u2019s no IT integration project or security review of hospital infrastructure.',
      },
    ],
    cadences: [
      {
        name: 'Playbook — NHS Pharmacy — Chief Pharmacist',
        persona: 'Chief Pharmacist / Director of Pharmacy',
        steps: [
          {
            waitDays: 0,
            channel: 'email',
            subject: 'Overnight fridge drift at {{account.name}}',
            body: `Hi {{first_name}},

A question we ask every pharmacy director: if a ward fridge drifted out of range at 2am last Saturday, when would your team have found out — and what would it have cost?

Checkit's CAM+ gives hospital pharmacies continuous monitoring with 24/7 alerting across main pharmacy, satellites, and ward fridges. 100% of temperature records captured automatically, zero manual checks, and an audit trail your quality team can hand an inspector on demand.

It's a subscription — hardware, annual on-site calibration, and support included — so there's no capital business case to fight through.

Worth 20 minutes to see how other NHS pharmacy teams run it?

{{sender_first_name}}`,
          },
          {
            waitDays: 3,
            channel: 'email',
            subject: 'Re: Overnight fridge drift at {{account.name}}',
            body: `Hi {{first_name}},

Following up briefly. The number that gets attention: a single lost batch of biologics or chemo can run into tens of thousands of pounds — usually more than a year of continuous monitoring costs.

Beyond the waste risk, CQC and MHRA inspectors increasingly expect continuous monitoring with a validated trail rather than paper logbooks.

Happy to share a short overview of how CAM+ works in an NHS pharmacy estate — or a 15-minute call if easier.

{{sender_first_name}}`,
          },
          {
            waitDays: 4,
            channel: 'linkedin',
            subject: 'LinkedIn: connect + view profile',
            body: 'Connect with a short note referencing the email thread. No pitch in the connection request — "Sent you a note about fridge monitoring across the trust — thought it was worth connecting here too."',
          },
          {
            waitDays: 4,
            channel: 'email',
            subject: 'Giving pharmacist time back',
            body: `Hi {{first_name}},

Different angle: your pharmacists didn't train for years to log fridge temperatures.

Teams using CAM+ report zero manual fridge checks — that time goes back to clinical work, which matters when every pharmacy team we speak to is running short-staffed.

If cold-chain monitoring is already handled at {{account.name}}, tell me and I'll close the loop. If it's on paper or a mix of systems, it's worth a look before your next inspection.

{{sender_first_name}}`,
          },
          {
            waitDays: 5,
            channel: 'email',
            subject: 'Closing the loop',
            body: `Hi {{first_name}},

Last note from me. If audit-ready cold-chain monitoring becomes a priority — before an inspection, after an excursion, or when the estate grows — we're easy to find.

One question before I go: is there someone else at {{account.name}} who owns fridge compliance day-to-day? Happy to speak with them instead.

{{sender_first_name}}`,
          },
        ],
      },
    ],
  },

  // ==========================================================================
  {
    id: 'pathology',
    name: 'NHS Pathology Networks & Blood Sciences',
    region: 'UK',
    status: 'active',
    summary:
      'CAM+ for consolidated pathology networks and blood sciences — hub-and-spoke labs where samples travel further, monitoring is a patchwork, and a single excursion costs four ways: patient safety, wasted donations, audit exposure, and public trust. Key accounts: NHS trusts and pathology network partnerships. Live LP: checkit.net/industries/pathology.',
    apolloAccountLists: ['TF All healthcare uk', 'UK Healthcare page 3-10 TF'],
    apolloContactLists: ['Pathology contacts', 'UK Healthcare list 1'],
    personas: [
      {
        title: 'Pathology Services / Laboratory Manager',
        role: 'Runs lab operations across hub and spoke sites',
        pains: [
          'Samples travel further, more often — what was a walk down a corridor is now a 40-minute courier run, and every transfer introduces exposure',
          'A patchwork of monitoring: one fridge has a digital logger, another paper charts, another occasional checks — inconsistency multiplies error',
          'Staff move between hubs and spokes and hit a different system at every site — confusion, retraining, gaps at the wrong moments',
          'The most common excursion cause is mundane: a fridge door left ajar, caught hours later at the next manual check',
          'Equipment fails with stock inside — no early warning from compressor behaviour or temperature patterns',
        ],
        caresAbout: [
          'One monitoring standard across the whole network — same system, same interface, rural spoke or city-centre hub',
          'Monitoring that travels with samples between sites, not just inside buildings',
          'Skilled staff time back on the bench (zero manual logs)',
        ],
      },
      {
        title: 'Quality Manager (UKAS/ISO 15189)',
        role: 'Owns accreditation and quality management across the network',
        pains: [
          'Audit demand multiplies across trusts — central teams need consistent compliance data, and patchy systems produce patchy records',
          'When an excursion happens, hours of skilled staff time disappear into reconstructing events for auditors — and a missing log carries serious consequences',
          'Regulators expect evidence that alerts were acted on, not just that alarms existed',
          'Wasted blood units are doubly costly — financially and ethically; each one was given voluntarily by a donor who trusted the system',
        ],
        caresAbout: [
          'Tamper-proof, inspection-ready records available instantly — no binders, no scrambling',
          'Calibration traceability answered in seconds',
          'Fewer nonconformities at assessment',
        ],
      },
      {
        title: 'Procurement / Network Programme Lead',
        role: 'Evaluates suppliers for the consolidated network and builds the business case',
        pains: [
          'Consolidation is disruptive enough — months-long rollouts with complex integrations are non-starters',
          'Finance needs itemised CapEx/revenue splits and ROI that holds up, not general efficiency claims',
        ],
        caresAbout: [
          'Deployment in days: wireless sensors, no integrations, training in minutes',
          'A supplier aligned with where the NHS is going — standardisation, efficiency, risk reduction at scale',
        ],
      },
    ],
    useCases: [
      { name: 'Blood bank refrigerators', detail: 'Continuous monitoring at validated ranges — alerts before stock is at risk, not after' },
      { name: 'Plasma & ultra-low freezers', detail: 'Long-term sample storage down to ULT, watched nights, weekends, and holidays' },
      { name: 'Transport between sites', detail: 'The most exposed link in the chain — monitoring that travels with the sample, spoke to hub' },
      { name: 'Door & seal events', detail: 'A door left ajar caught in minutes, not at the next manual check' },
      { name: 'Equipment health', detail: 'Compressor behaviour and temperature patterns flag a failing unit before it fails with stock inside' },
      { name: 'Ambient lab environments & incubators', detail: 'Reagents, cultures, and room conditions logged against validated ranges' },
      { name: 'Network-wide dashboards', detail: 'Every site, every asset, one live view for central quality teams' },
      { name: 'Audit-ready reporting', detail: 'Tamper-proof records, excursion response captured, calibration traceability on demand' },
    ],
    proofPoints: [
      '24/7 monitoring of every asset — nights, weekends, and transport included',
      '100% of temperature records captured automatically; 0 manual logs — skilled staff time back on the bench',
      '1 system across the whole network — every hub, every spoke, one view',
      'Deploys in days, not months: wireless sensors, no complex integrations, training measured in minutes',
      'Business-case support: itemised CapEx/revenue costings and ROI models grounded in time saved, stock protected, and risk reduced',
    ],
    talkingPoints: [
      'Lead with the hidden-risk story: the most serious risks don\u2019t happen under bright lights — a fridge drifts overnight, a courier run overruns, and nothing looks different until a transfusion fails or a test returns a false result.',
      'The four-costs frame for one excursion: patient safety (the consequence that stays hidden), wasted donations (a gift thrown away), audit exposure (the record that can\u2019t be reconstructed), and public trust (confidence lost in a single lapse).',
      'The consolidation angle: hub-and-spoke magnifies both opportunity and risk — a single hub failure disrupts several hospitals, and one incident becomes a systemic question auditors ask everywhere.',
      'Transport is the gap most networks miss: monitoring usually stops at the building door, but the van journey between spoke and hub is the most exposed link.',
      'For procurement: the four non-negotiables — proven scalability across networks, compliance designed in (not bolted on), minimal implementation burden, and alignment with where the NHS is going.',
      'Budget-cycle timing: if they\u2019re preparing a submission for the next financial year, offer the business-case pack (CapEx/revenue split, ROI model, realistic timelines).',
    ],
    objections: [
      {
        objection: 'Each site already has its own monitoring.',
        response: 'That\u2019s the problem — one fridge has a digital logger, another paper charts. Network-level governance needs one standard; patchy systems produce patchy records, and assembling evidence from five systems is weeks of work.',
      },
      {
        objection: 'We\u2019re mid-consolidation, too busy for another project.',
        response: 'Consolidation is exactly when gaps appear — new transport routes, more handoffs, sites on legacy kit. CAM+ deploys in days: wireless sensors, no integrations, training in minutes. Start with the highest-risk assets at the hub and roll out spoke by spoke.',
      },
      {
        objection: 'We\u2019ve never had a serious excursion.',
        response: 'The consequences stay hidden until it\u2019s too late — a degraded sample produces a false result, not an alarm. The question isn\u2019t whether excursions happen; it\u2019s whether you\u2019d know, and whether you could prove the record to an auditor.',
      },
      {
        objection: 'No budget until next financial year.',
        response: 'That\u2019s the right time to talk — we provide itemised CapEx/revenue costings and ROI models for the submission, and implementation plans ready to move the moment funding is approved.',
      },
    ],
    cadences: [
      {
        name: 'Playbook — Pathology — Lab Manager',
        persona: 'Pathology Services / Laboratory Manager',
        steps: [
          {
            waitDays: 0,
            channel: 'email',
            subject: 'A fridge drifts overnight at {{account.name}} — then what?',
            body: `Hi {{first_name}},

The most serious risks in pathology don't happen under bright lights. A fridge drifts overnight. A freezer door doesn't quite seal. A courier run takes longer than planned. Nothing looks different — until a transfusion fails or a test returns a false result.

Checkit CAM+ gives consolidated pathology networks one continuous monitoring standard across every hub and spoke: blood bank fridges, ULT freezers, incubators, and the transport in between. 24/7 alerting, 100% of records captured automatically, audit-ready by default.

Worth a short call to compare notes on how your network handles this today?

{{sender_first_name}}`,
          },
          {
            waitDays: 3,
            channel: 'email',
            subject: 'Re: A fridge drifts overnight at {{account.name}}',
            body: `Hi {{first_name}},

One excursion costs four ways:

1. Patient safety — a degraded sample produces a false result, not an alarm
2. Wasted donations — every lost unit was given freely by a donor who trusted the system
3. Audit exposure — hours of skilled staff time reconstructing events for assessors
4. Public trust — built over years, lost in one mishandled incident

Most networks we meet have monitoring at each site. Fewer can prove one consistent record across every site — and almost none monitor the courier run between spoke and hub, which is the most exposed link in the chain.

Happy to send a two-page overview built for pathology networks.

{{sender_first_name}}`,
          },
          {
            waitDays: 5,
            channel: 'email',
            subject: 'Five sites, five logging procedures',
            body: `Hi {{first_name}},

Two more reasons consolidated networks standardise monitoring, beyond audits:

1. Staff move between hubs and spokes — a different system at every site means retraining, confusion, and gaps at exactly the wrong moments.
2. The most common excursion cause is a fridge door left ajar — caught in minutes with sensors, or hours later at the next manual check.

Deployment is days, not months: wireless sensors, no integrations, training measured in minutes. Start with the blood bank fridges at your hub, then roll out spoke by spoke.

If this is already solved at {{account.name}}, tell me and I'll stop. If not, 20 minutes is the fastest way to see whether it fits.

{{sender_first_name}}`,
          },
          {
            waitDays: 5,
            channel: 'email',
            subject: 'Closing the loop',
            body: `Hi {{first_name}},

Last note from me. If network-wide monitoring becomes a priority — ahead of a UKAS assessment, after an excursion, or as consolidation continues — we're easy to find.

One thing worth knowing: if you're preparing a budget submission for the next financial year, we provide itemised CapEx/revenue costings and ROI models that hold up with finance teams, plus implementation plans ready to move when funding is approved.

Is there someone else who owns storage compliance across the network I should speak with instead?

{{sender_first_name}}`,
          },
        ],
      },
    ],
  },

  // ==========================================================================
  {
    id: 'forecourts',
    name: 'Forecourts & Fuel Retail',
    region: 'UK',
    status: 'active',
    summary:
      'Full Checkit platform for forecourt operators (50–500+ sites) — food safety, pump/fuel compliance, H&S, and estate visibility on one platform. Growth via acquisition/franchise left no standard operating model; the brand risk sits with the operator.',
    apolloAccountLists: ['Petrol stations UK'],
    apolloContactLists: ['All Petrol Station contacts', 'April 2026 Forecourts', 'April Forecourt & retail 21.10'],
    personas: [
      {
        title: 'Operations Director',
        role: 'Owns operating standards and performance across the estate',
        pains: [
          'Growth through acquisition/franchise means no standardised operating model across sites',
          'Visibility is retrospective — site visits and paper, not real-time',
          'Regulatory and brand risk sits with the operator, not the site manager',
          'Four to six separate vendor contracts for food safety, fuel, incidents, maintenance',
        ],
        caresAbout: [
          'Every site running the same playbook, visible from head office',
          'Fewer tools, fewer contracts, one source of truth',
          'Audit scores and mystery-shopper results trending up',
        ],
      },
      {
        title: 'Area / Regional Manager',
        role: 'Responsible for 10–30 sites day-to-day',
        pains: [
          'High staff turnover — paper training and paper checks don\u2019t survive it',
          'Finds out about problems on site visits, weeks after they happened',
          'Paper evidence fails EHO inspections and internal audits',
        ],
        caresAbout: [
          'Knowing which sites need attention before driving there',
          'New starters productive on day one',
        ],
      },
    ],
    useCases: [
      { name: 'Food safety & Natasha\u2019s Law', detail: 'Food prep, labelling, and HACCP checks digitised for food-to-go' },
      { name: 'Pump & fuel compliance', detail: 'APEA/HSE pump safety checks, fuel delivery procedures, spill/incident reporting' },
      { name: 'Automated monitoring', detail: '24/7 sensor monitoring of fridges/freezers — no manual temp checks' },
      { name: 'Shift handover & H&S audits', detail: 'Digital workflows for handover, contractor sign-in, car wash checks' },
      { name: 'EHO & mystery-shopper readiness', detail: 'Audit-ready records and consistent standards at every site' },
    ],
    proofPoints: [
      '60% reduction in compliance admin vs paper',
      '90%+ audit-ready scores (up from 50–70% on paper)',
      'Mystery shopper readiness: 20%+ improvement',
      'Rollout at 5–10 sites/week, ~30 min sensor install per asset',
      'One platform replacing 4–6 separate tools',
    ],
    talkingPoints: [
      'Lead with standardisation: "you grew by acquisition — every site still runs its own version of the rules."',
      'Risk ownership: fines and brand damage land on the operator, but compliance evidence lives on paper at site level.',
      'Consolidation saves money: one platform replaces several point solutions and contracts.',
      'Frontline reality: high-turnover staff need tools that work day one — that\u2019s a design requirement, not a nice-to-have.',
    ],
    objections: [
      {
        objection: 'Sites already do paper checks and we pass most inspections.',
        response: 'Operators on paper typically audit at 50–70% ready; Checkit customers run 90%+. "Most" inspections is the issue — one failed EHO visit at one site is a brand problem for the whole estate.',
      },
      {
        objection: 'We have too many systems already.',
        response: 'Agreed — that\u2019s the point. Checkit replaces the separate food safety, monitoring, incident, and checklist tools with one platform and one contract.',
      },
      {
        objection: 'Our staff won\u2019t adopt new tech.',
        response: 'It\u2019s built for high-turnover frontline teams — guided checks on a handheld, no training course. New starters follow the workflow from day one.',
      },
    ],
    cadences: [
      {
        name: 'Playbook — Forecourts — Ops Director',
        persona: 'Operations Director',
        steps: [
          {
            waitDays: 0,
            channel: 'email',
            subject: 'One operating standard across {{account.name}}',
            body: `Hi {{first_name}},

Most forecourt groups that grew through acquisition tell us the same thing: every site runs its own version of the rules, and head office finds out about problems on the next site visit.

Checkit puts food safety, pump checks, monitoring, and incident reporting on one platform — sensors plus guided workflows plus estate-wide dashboards. Operators see a 60% cut in compliance admin and audit-readiness moving from 50–70% to 90%+.

Rollout runs at 5–10 sites a week, so a full estate goes live in weeks, not quarters.

Worth 20 minutes to see it against how {{account.name}} runs today?

{{sender_first_name}}`,
          },
          {
            waitDays: 3,
            channel: 'email',
            subject: 'Re: One operating standard across {{account.name}}',
            body: `Hi {{first_name}},

Quick follow-up. The uncomfortable question for any multi-site operator: if an EHO walked into your furthest site tomorrow, how confident are you in what they'd find?

The risk sits with you, not the site manager — but the evidence lives on clipboards at site level. That's the gap we close: real-time visibility of every check, every site, from head office.

Happy to send a short overview built for forecourt operators.

{{sender_first_name}}`,
          },
          {
            waitDays: 4,
            channel: 'linkedin',
            subject: 'LinkedIn: connect',
            body: 'Connect with a short note — reference estate standardisation, not the product. "Enjoyed looking at how {{account.name}} has grown — sent you a note on operating standards across the estate."',
          },
          {
            waitDays: 4,
            channel: 'email',
            subject: 'Replacing 4–6 tools with one',
            body: `Hi {{first_name}},

One more angle: most operators we meet are paying for separate tools for food safety checks, temperature monitoring, incident reporting, and maintenance — plus the admin of managing those vendors.

Checkit consolidates that into one platform and one contract. The business case usually stands up on tool consolidation alone, before counting the compliance and labour savings.

If ops tooling is under review at {{account.name}} this year, this is worth 20 minutes.

{{sender_first_name}}`,
          },
          {
            waitDays: 5,
            channel: 'email',
            subject: 'Closing the loop',
            body: `Hi {{first_name}},

Last note from me. When estate standardisation moves up the agenda — after an acquisition, a failed audit, or a contract renewal on one of your point solutions — we're easy to find.

Is there someone else who owns site compliance across the estate I should be talking to?

{{sender_first_name}}`,
          },
        ],
      },
    ],
  },

  // ==========================================================================
  {
    id: 'coffee-shops',
    name: 'Coffee Shops & Café Chains',
    region: 'UK',
    status: 'active',
    summary:
      'The "Silent Grind" play: manual temp checks pull staff off the till during rush at multi-site café chains. Automated monitoring plus digital checklists keep staff at the counter and give head office estate-wide visibility. Concentrated market — the top operators control most sites.',
    apolloAccountLists: [],
    apolloContactLists: ['coffee shops list', 'Costa List', 'April top 10 - Costa', 'April top 10 - Gails'],
    personas: [
      {
        title: 'Head of Operations (multi-site chain)',
        role: 'Owns store operations, standards, and labour productivity across the estate',
        pains: [
          'Manual temp checks take 2–3 minutes each, several times a day, at peak hours, at every site — unlogged revenue loss',
          'The sale never rings: customers walk when the queue stalls because staff are off logging fridges',
          'Clipboard records get skipped or backfilled — audit gaps head office can\u2019t see',
          'Staff hired to make drinks burn out on compliance chores; turnover is already brutal',
        ],
        caresAbout: [
          'Staff never leaving the counter during service',
          'Trustworthy, timestamped records across the estate',
          'Simple tools that survive high staff turnover',
        ],
      },
    ],
    useCases: [
      { name: 'Automated temperature monitoring', detail: 'Wireless sensors — zero manual checks during service' },
      { name: 'Opening/closing & cleaning checks', detail: 'Guided digital checklists replacing the clipboard' },
      { name: 'Allergen & date labelling', detail: 'Natasha\u2019s Law workflows for food prep' },
      { name: 'EHO readiness', detail: 'Audit-ready records head office can see in real time' },
      { name: 'Machine care & delivery checks', detail: 'Equipment and goods-in workflows in the same app' },
    ],
    proofPoints: [
      '0 manual temperature checks during service',
      '100% of temperature logs captured automatically, 24/7',
      'One platform across the estate',
      'Revenue math: 2–3 min/check × several checks/day × peak × every site — the calculator makes it concrete per estate',
    ],
    talkingPoints: [
      'Lead with the Silent Grind story: compliance is quietly taxing service at the worst possible moments.',
      'Make the revenue math theirs: run their store count through the calculator — it turns compliance into a P&L conversation.',
      'The trust angle for head office: backfilled clipboard records mean you don\u2019t actually know what\u2019s happening in stores.',
      'This market is concentrated — treat the top chains as named accounts with tailored outreach, not volume plays.',
    ],
    objections: [
      {
        objection: 'Temp checks only take a couple of minutes.',
        response: 'Per check — but it\u2019s several a day, during rush, at every store. Multiply it across the estate and it\u2019s real labour and lost sales. And rushed checks get skipped or backfilled, which is an audit problem.',
      },
      {
        objection: 'We\u2019re rolling out a new POS/app already, no bandwidth.',
        response: 'Sensor install is ~30 minutes per asset and the checklists replace paper, not another system. Stores don\u2019t need a training programme — staff follow guided checks from day one.',
      },
    ],
    cadences: [
      {
        name: 'Playbook — Coffee — Head of Ops',
        persona: 'Head of Operations (multi-site chain)',
        steps: [
          {
            waitDays: 0,
            channel: 'email',
            subject: 'The 2-minute check that costs {{account.name}} sales',
            body: `Hi {{first_name}},

Every manual fridge check pulls someone off the counter for 2–3 minutes. During the morning rush, that's when the queue stalls and the sale never rings.

Multiply that across every store, several checks a day, and it's a quiet tax on revenue — plus clipboard records that get skipped or backfilled when it's busy.

Checkit removes the checks entirely: wireless sensors log every fridge automatically, 24/7, with audit-ready records head office can see in real time. Staff never leave the counter.

Worth 15 minutes to run the numbers for {{account.name}}'s estate?

{{sender_first_name}}`,
          },
          {
            waitDays: 3,
            channel: 'email',
            subject: 'Re: The 2-minute check that costs {{account.name}} sales',
            body: `Hi {{first_name}},

Following up with the head-office angle: when clipboard checks get backfilled at the end of a shift, your records say everything's fine — and you have no way to know otherwise until an EHO visit finds the gap.

Automated monitoring means the records are real, timestamped, and visible across the estate without asking store managers for anything.

Happy to share how other multi-site café operators run this.

{{sender_first_name}}`,
          },
          {
            waitDays: 4,
            channel: 'email',
            subject: 'Staff turnover and the clipboard',
            body: `Hi {{first_name}},

One more angle. Your baristas were hired to make drinks and serve customers — every compliance chore you remove is retention you keep. And with turnover as it is, paper-based training doesn't survive the handover anyway.

Checkit's guided digital checks work for a new starter on day one, and the temperature logging just disappears.

If store labour productivity is a 2026 theme at {{account.name}}, this belongs on the list. 15 minutes?

{{sender_first_name}}`,
          },
          {
            waitDays: 5,
            channel: 'email',
            subject: 'Closing the loop',
            body: `Hi {{first_name}},

Last note from me. When this bubbles up — an EHO surprise, a labour cost review, or an estate refresh — we're easy to find.

Who owns food safety compliance across stores day-to-day? Happy to speak with them instead.

{{sender_first_name}}`,
          },
        ],
      },
    ],
  },

  // ==========================================================================
  {
    id: 'us-plasma',
    name: 'US Medical Monitoring (Plasma, Blood, Biorepositories, OPOs)',
    region: 'US',
    status: 'active',
    summary:
      'ABM motion against ~60 named US organizations that own the cold chain for irreplaceable biological material: plasma collection networks, community blood centers, biorepositories/reference labs/CROs, and organ procurement organizations. Corporate quality and operations own the decision at the network level, not the site. This is displacement selling — most accounts already have a monitoring vendor (Rees, Sensoscientific, Primex, TempGenius, Sonicu, Vaisala, Elpro, Dickson, Monnit) — so outreach should be trigger-anchored (FDA 483s, network expansion, incumbent renewal, new Quality leadership) rather than generic pitching.',
    apolloAccountLists: [
      'US Medical — Target Accounts',
      'US Medical — Customers (do not sequence)',
    ],
    apolloContactLists: [
      'US Medical — VP Quality',
      'US Medical — Director Operations',
      'US Medical — Facilities / Biomed / Metrology',
      'US Medical — Biorepository / Lab Director',
    ],
    triggers: [
      'FDA 483 observation or Warning Letter in the last 12 months (public on fda.gov)',
      'Announced new center, lab, or biorepository openings',
      'M&A, network consolidation, or private equity activity',
      'New VP/Director of Quality or Operations (LinkedIn job change in last 90 days)',
      'Monitoring vendor renewal or contract end (ask on discovery)',
      'Job postings for Quality/Compliance, Facilities, or Biomedical Engineering roles',
      'Recent CAP, AABB, or ISO accreditation cycle',
    ],
    personas: [
      {
        title: 'VP / Director Quality & Regulatory Affairs',
        role: 'Owns FDA compliance, validation, and quality systems across the network',
        pains: [
          '21 CFR Part 11 requires validated, tamper-proof electronic records — patchwork or manual systems are a 483 observation waiting to happen',
          'A single undetected freezer failure destroys irreplaceable, high-value product (plasma units, biospecimens, tissues)',
          'Hundreds of centers means hundreds of local SOPs unless monitoring is standardized centrally',
          'Calibration and maintenance evidence across the network is a constant audit burden',
        ],
        caresAbout: [
          'Enterprise-wide compliance from one validated system',
          'Zero unexplained excursions with 24/7 alarm management',
          'Vendor takes hardware, calibration, and validation risk, not internal QA',
        ],
        apolloTitleFilters: [
          'VP Quality',
          'Vice President Quality',
          'Director Quality',
          'Senior Director Quality',
          'VP Regulatory Affairs',
          'Director Regulatory Affairs',
          'Director Quality Assurance',
          'Head of Quality',
          'Chief Quality Officer',
        ],
      },
      {
        title: 'VP / Director Operations (network)',
        role: 'Runs center/lab operations, equipment, and expansion across the network',
        pains: [
          'Center staff turnover — monitoring cannot depend on local diligence',
          'New center openings need monitoring live on day one, on schedule, no punch list',
          'Corporate IT does not want hundreds of sites\u2019 sensors on the corporate network',
          'Capex per site kills the rollout math; procurement wants opex predictability',
        ],
        caresAbout: [
          'Predictable multi-site rollout with vendor-owned installation',
          'No IT dependency — monitoring independent of corporate infrastructure',
          'Subscription pricing, no capex per center',
        ],
        apolloTitleFilters: [
          'VP Operations',
          'Vice President Operations',
          'Director Operations',
          'Senior Director Operations',
          'Director Center Operations',
          'Director Network Operations',
          'COO',
          'Chief Operating Officer',
        ],
      },
      {
        title: 'Facilities / Biomedical Engineering / Metrology',
        role: 'Keeps freezers, fridges, LN2, incubators, and calibration programs running',
        pains: [
          'Alarm fatigue and false positives from legacy monitoring',
          'Owning calibration in-house is expensive and hard to staff',
          'Local IT will not allow another agent or VLAN change per site',
          'Vendor SLAs on hardware replacement are the difference between a save and a loss',
        ],
        caresAbout: [
          'Sensors on a dedicated wireless mesh — no IT ticket per site',
          'Annual on-site NIST-traceable calibration included, not billed separately',
          'One number to call, one vendor accountable, hardware failure is theirs',
        ],
        apolloTitleFilters: [
          'Director Facilities',
          'Facilities Manager',
          'Director Biomedical Engineering',
          'Biomed Manager',
          'Metrology Manager',
          'Director Metrology',
          'Calibration Manager',
          'Director Engineering',
        ],
      },
      {
        title: 'Biorepository / Laboratory Director',
        role: 'Scientific and operational owner of a biorepository or reference lab',
        pains: [
          'Irreplaceable specimens: one ULT or LN2 excursion is a scientific and financial loss',
          'Sponsor/client audits require continuous evidence, not spot checks',
          'CAP, CLIA, and ISO 20387 (biobanking) all want documented environmental control',
          'Chain-of-custody and data integrity questions from every new sponsor',
        ],
        caresAbout: [
          'Continuous, tamper-evident environmental record per specimen location',
          'Sponsor-ready reports without a scramble',
          'One platform across ULT, LN2, fridge, incubator, and ambient rooms',
        ],
        apolloTitleFilters: [
          'Director Biorepository',
          'Biorepository Manager',
          'Laboratory Director',
          'Director Laboratory Operations',
          'Director Biobank',
          'Biobank Manager',
          'Director Specimen Management',
        ],
      },
    ],
    useCases: [
      { name: 'Freezer / fridge / ULT / LN2 continuous monitoring', detail: 'Every temperature-critical asset monitored 24/7 with alarm escalation until acknowledged' },
      { name: '21 CFR Part 11 electronic records', detail: 'Validated, tamper-evident audit trails with long-term data integrity' },
      { name: 'NIST-traceable annual on-site calibration', detail: 'Checkit\u2019s own US-based engineers handle calibration; traceability documentation included' },
      { name: 'Enterprise dashboards', detail: 'Every center or lab visible from corporate quality — one standard nationwide' },
      { name: 'Asset Intelligence', detail: 'Machine learning flags underperforming freezers before they fail' },
      { name: 'Sponsor / accreditor evidence packs', detail: 'CAP, CLIA, AABB, ISO 17025, ISO 20387 documentation on demand' },
    ],
    proofPoints: [
      '800+ successful US installations, including Grifols, Quest Diagnostics, NAMSA, and the Center for Organ Recovery & Education',
      'In-house engineers across the continental US — 50 years combined installation experience; guaranteed installation schedules',
      'Dedicated wireless mesh network — sensors never touch corporate IT',
      'Full subscription: hardware, warranty, annual NIST-traceable calibration, and 24x7 alarm management included; hardware failure risk sits with Checkit',
      'Multi-site specialists — the same validated system across every site in the network',
    ],
    talkingPoints: [
      'Lead with proof: Grifols, Quest, NAMSA, CORE — we already run monitoring at scale for the biggest names in the US market, this is not an experiment.',
      'Displacement is the reality. Ask what they have, ask what they wish it did, log the incumbent. Do not pitch until you know who you are replacing.',
      'The Part 11 angle: validated electronic records and data integrity are built in, not bolted on — the compliance story sells to VP Quality without a demo.',
      'The subscription flips the risk: no capex per site, hardware failure is Checkit\u2019s problem, calibration is included — a procurement story that finance likes.',
      'This is a ~60-account ABM motion. Research each account\u2019s recent FDA inspection history, expansion plans, and quality leadership before outreach. Volume prospecting is the wrong tool here.',
    ],
    objections: [
      {
        objection: 'We have a monitoring vendor already.',
        response: 'Most do. The question is whether it is one validated system across every site or an inherited patchwork, and who carries the hardware and calibration burden. Our subscription moves that risk to us, and switching is an installation project we own end to end.',
      },
      {
        objection: 'Corporate IT review will take a year.',
        response: 'Our sensors run on a dedicated wireless mesh and never touch your corporate network — that typically removes the heaviest part of the IT security review.',
      },
      {
        objection: 'We are opening centers too fast to add a project.',
        response: 'That is the case for us: we guarantee installation schedules with our own US engineers, so monitoring is live when the center opens — not retrofitted after.',
      },
      {
        objection: 'We just passed our last audit.',
        response: 'Good — that is the moment to look, not after the next 483. Our customers switched between audit cycles specifically so the next inspection had no monitoring findings to defend.',
      },
      {
        objection: 'We validated our current system, revalidating is too much work.',
        response: 'We bring the validation package and our engineers do the on-site work, so the burden on your QA team is much lower than teams expect. Happy to walk you through what a validated cutover looks like at a plasma or lab reference.',
      },
    ],
    cadences: [
      // ----------------------------------------------------------------------
      {
        name: 'US Medical \u2014 VP Quality',
        persona: 'VP / Director Quality & Regulatory Affairs',
        steps: [
          {
            waitDays: 0,
            channel: 'email',
            subject: 'Monitoring across {{account.name}} — one validated system',
            body: `Hi {{first_name}},

Checkit runs continuous environmental monitoring for some of the largest plasma and laboratory operators in the US — Grifols, Quest Diagnostics, NAMSA — with 800+ installations nationwide.

For a network like {{account.name}}, that means one validated system across every site: 24/7 alarm management, 21 CFR Part 11 electronic records, and annual NIST-traceable on-site calibration by our own engineers, on a single subscription with no capex per site.

Worth a short call to compare against how {{account.name}} handles monitoring today?

{{sender_first_name}}`,
          },
          {
            waitDays: 3,
            channel: 'email',
            subject: 'Re: Monitoring across {{account.name}}',
            body: `Hi {{first_name}},

Quick follow-up with the risk math: one undetected freezer failure destroys irreplaceable product, and one weak audit trail is a 483 observation waiting for the next inspection.

Two things our medical customers value most:
1. Sensors run on a dedicated wireless mesh — nothing touches your corporate network, which shortens IT security review dramatically.
2. Hardware failure risk sits with us — the subscription includes hardware, warranty, calibration, and 24/7 alarm management.

Happy to share a short overview or reference details.

{{sender_first_name}}`,
          },
          {
            waitDays: 2,
            channel: 'linkedin',
            subject: 'Connect + short note',
            body: `Connection request note:

Hi {{first_name}} — I lead US medical monitoring for Checkit; we run continuous monitoring for Grifols, Quest, and NAMSA. Sending a note over on email about {{account.name}} — would value your view even if the timing is not right. {{sender_first_name}}`,
          },
          {
            waitDays: 2,
            channel: 'call',
            subject: 'Call — VP Quality',
            body: `Opening:
"Hi {{first_name}}, this is {{sender_first_name}} from Checkit — quick call, not a pitch. We run continuous environmental monitoring at Grifols, Quest Diagnostics, and NAMSA, and I wanted to see how {{account.name}} handles monitoring across its sites today."

Discovery to run if they engage:
- Who owns monitoring at the corporate level vs the site?
- Which vendor is in place today, and how long is left on the contract?
- Any findings on monitoring or data integrity in the last two audits?
- Are you opening or acquiring sites this year?

Ask for the meeting, not the demo:
"Would a 20-minute working session with me and one of our regulatory engineers make sense — we can compare notes against how Grifols and Quest handle Part 11 at network scale."`,
          },
          {
            waitDays: 3,
            channel: 'email',
            subject: 'How Grifols standardized monitoring across their US network',
            body: `Hi {{first_name}},

Short one. Grifols runs Checkit across a large US footprint because a single vendor, one validated system, and included calibration is easier to defend to FDA than a patchwork built up over years of expansion.

If any of that applies at {{account.name}} — network standardization, calibration burden, audit prep — happy to make an intro to their team or share the reference details in writing.

{{sender_first_name}}`,
          },
          {
            waitDays: 4,
            channel: 'email',
            subject: 'Closing the loop',
            body: `Hi {{first_name}},

Last note from me. When monitoring comes under review at {{account.name}} — an inspection finding, a vendor renewal, or an expansion push — we are easy to find, and we can share medical-specific references.

{{sender_first_name}}`,
          },
        ],
      },
      // ----------------------------------------------------------------------
      {
        name: 'US Medical \u2014 Director Operations',
        persona: 'VP / Director Operations (network)',
        steps: [
          {
            waitDays: 0,
            channel: 'email',
            subject: 'Monitoring at every {{account.name}} site, live on day one',
            body: `Hi {{first_name}},

Checkit installs and runs continuous monitoring for large US medical networks — Grifols, Quest Diagnostics, NAMSA, CORE — with 800+ US installations.

For an operator opening or acquiring sites, that means monitoring live on opening day, no site-by-site vendor variation, and no capex per center: our own US engineers handle install, calibration, and hardware replacement under a single subscription.

Worth a short call on how {{account.name}} handles site rollout today?

{{sender_first_name}}`,
          },
          {
            waitDays: 3,
            channel: 'email',
            subject: 'Re: Monitoring at every {{account.name}} site',
            body: `Hi {{first_name}},

Following up with the operational math:

- Sensors run on a dedicated wireless mesh — no site-by-site IT ticket, no VLAN change, no agent on your network.
- Hardware, warranty, calibration, and 24/7 alarm management are one subscription line — no capex per site, predictable per-site opex for finance.
- We employ our own US engineers and guarantee installation schedules, so monitoring is live when the site opens, not retrofitted after.

Happy to share how Grifols and NAMSA run this at scale.

{{sender_first_name}}`,
          },
          {
            waitDays: 2,
            channel: 'linkedin',
            subject: 'Connect + short note',
            body: `Connection request note:

Hi {{first_name}} — Checkit runs multi-site monitoring for Grifols, Quest, NAMSA and CORE. Curious how {{account.name}} handles site rollout and monitoring standardization today. {{sender_first_name}}`,
          },
          {
            waitDays: 2,
            channel: 'call',
            subject: 'Call — Director Operations',
            body: `Opening:
"Hi {{first_name}}, this is {{sender_first_name}} from Checkit. Quick call — we run continuous monitoring for Grifols, Quest, NAMSA and CORE, and I wanted to see how {{account.name}} handles monitoring across its sites."

Discovery:
- How many sites, and how many opening in the next 12 months?
- Who installs and calibrates monitoring today — internal or vendor?
- Is monitoring standardized across the network or site-specific?
- What is the current vendor and when is renewal?

Ask:
"Would 20 minutes with me and one of our rollout engineers be useful — I can share exactly how we sequence installs across networks the size of {{account.name}}."`,
          },
          {
            waitDays: 3,
            channel: 'email',
            subject: 'Rollout playbook from a similar network',
            body: `Hi {{first_name}},

Short one. Multi-site medical operators use us for one reason above all: predictable rollout. Our own US engineers own install, calibration, and hardware SLA — so opening 5, 20, or 100 sites this year does not add project management load to your team.

If any of that resonates for {{account.name}}, happy to walk through what a rollout schedule looks like.

{{sender_first_name}}`,
          },
          {
            waitDays: 4,
            channel: 'email',
            subject: 'Closing the loop',
            body: `Hi {{first_name}},

Last note. When {{account.name}} is next reviewing monitoring vendors — at renewal, ahead of an opening wave, or during a network standardization push — we are easy to find.

{{sender_first_name}}`,
          },
        ],
      },
      // ----------------------------------------------------------------------
      {
        name: 'US Medical \u2014 Biorepository / Lab Director',
        persona: 'Biorepository / Laboratory Director',
        steps: [
          {
            waitDays: 0,
            channel: 'email',
            subject: 'Environmental record for every specimen location at {{account.name}}',
            body: `Hi {{first_name}},

Checkit runs continuous environmental monitoring for US biorepositories, reference labs, and CROs — including Quest Diagnostics and NAMSA, with 800+ US installations.

For a biorepository, that means a tamper-evident, continuous environmental record per ULT, LN2, fridge, incubator, and ambient room — sponsor-ready without a scramble, and aligned to 21 CFR Part 11, CAP, and ISO 20387 expectations.

Worth 20 minutes to compare against what {{account.name}} has in place today?

{{sender_first_name}}`,
          },
          {
            waitDays: 3,
            channel: 'email',
            subject: 'Re: Environmental record for every specimen location',
            body: `Hi {{first_name}},

Following up. Three things biorepository directors tell us matter most:

1. One platform across ULT, LN2, fridge, incubator, and ambient — no separate systems per asset type.
2. Sponsor and accreditor evidence available on demand, not built by hand for each audit.
3. Sensors on a dedicated wireless mesh — no IT ticket per specimen room, no VLAN change.

Included in the subscription: hardware, annual NIST-traceable calibration by our own engineers, and 24/7 alarm management.

Happy to share a short overview or an intro to a comparable reference.

{{sender_first_name}}`,
          },
          {
            waitDays: 2,
            channel: 'linkedin',
            subject: 'Connect + short note',
            body: `Connection request note:

Hi {{first_name}} — we run environmental monitoring for large US biorepositories and reference labs (Quest, NAMSA). Sending a short note about {{account.name}} on email — would value your view. {{sender_first_name}}`,
          },
          {
            waitDays: 2,
            channel: 'call',
            subject: 'Call — Biorepository / Lab Director',
            body: `Opening:
"Hi {{first_name}}, {{sender_first_name}} from Checkit — we monitor environmental conditions for Quest, NAMSA, and a number of biorepositories. I wanted to ask how {{account.name}} handles continuous environmental evidence for specimen storage today."

Discovery:
- Asset mix: how many ULT, LN2, fridge, incubator, ambient rooms?
- Current monitoring vendor and how it handles sponsor audits.
- Any specimen losses in the last 24 months and root cause.
- CAP, CLIA, or ISO 20387 cycle coming up?

Ask:
"Would it make sense to compare what your current system produces at audit against what our biorepository customers hand over — 20 minutes, screen-share."`,
          },
          {
            waitDays: 3,
            channel: 'email',
            subject: 'How a similar biorepository handles sponsor audits',
            body: `Hi {{first_name}},

Short one. Our biorepository customers stopped building audit packs by hand — the platform assembles per-asset environmental history, alarm response, and calibration evidence, ready to hand to a sponsor or CAP inspector.

If audit prep is a real cost at {{account.name}}, happy to walk through what that looks like.

{{sender_first_name}}`,
          },
          {
            waitDays: 4,
            channel: 'email',
            subject: 'Closing the loop',
            body: `Hi {{first_name}},

Last note. If {{account.name}} is looking at monitoring — new sponsor requirements, an expansion, or a specimen loss investigation — we are easy to find.

{{sender_first_name}}`,
          },
        ],
      },
    ],
    targetAccounts: [
      // Plasma collection networks --------------------------------------------
      { name: 'CSL Plasma', domain: 'cslplasma.com', segment: 'plasma', tier: 1, relationship: 'prospect', note: 'Largest US plasma collector, ~300+ centers; corporate quality/ops decision.' },
      { name: 'Grifols', domain: 'grifols.com', segment: 'plasma', tier: 1, relationship: 'customer', note: 'Customer — expansion + reference. Do not cold-sequence.' },
      { name: 'Biomat USA (Grifols)', domain: 'grifolsplasma.com', segment: 'plasma', tier: 1, relationship: 'customer', note: 'Grifols US plasma brand. Customer relationship — verify domain during push.' },
      { name: 'Octapharma Plasma', domain: 'octapharmaplasma.com', segment: 'plasma', tier: 1, relationship: 'customer', note: 'Customer — expansion + reference. Do not cold-sequence.' },
      { name: 'BioLife Plasma Services (Takeda)', domain: 'biolifeplasma.com', segment: 'plasma', tier: 1, relationship: 'prospect', note: 'Takeda subsidiary, ~200+ US centers; corporate decision at Takeda BioLife HQ.' },
      { name: 'KEDPLASMA (Kedrion)', domain: 'kedplasma.com', segment: 'plasma', tier: 2, relationship: 'prospect', note: 'Kedrion US plasma arm, ~30 centers.' },
      { name: 'ImmunoTek Bio Centers', domain: 'immunotek.com', segment: 'plasma', tier: 2, relationship: 'prospect', note: 'US-owned plasma developer/operator; active expansion.' },
      { name: 'BPL Plasma', domain: 'bplplasma.com', segment: 'plasma', tier: 2, relationship: 'prospect', note: 'Bio Products Laboratory US collection arm.' },
      { name: 'ADMA BioCenters', domain: 'admabiocenters.com', segment: 'plasma', tier: 2, relationship: 'prospect', note: 'ADMA Biologics collection network.' },
      { name: 'GCAM Plasma', domain: 'gcamplasma.com', segment: 'plasma', tier: 3, relationship: 'prospect', note: 'Verify domain during push; small independent collector.' },
      { name: 'Olgam Life', domain: 'olgamlife.com', segment: 'plasma', tier: 3, relationship: 'prospect', note: 'NYC-area collector; verify domain during push.' },
      { name: 'Freedom Plasma', domain: 'freedomplasma.com', segment: 'plasma', tier: 3, relationship: 'prospect', note: 'Regional collector; verify domain during push.' },

      // Community blood centers ----------------------------------------------
      { name: 'American Red Cross Biomedical Services', domain: 'redcrossblood.org', segment: 'blood', tier: 1, relationship: 'prospect', note: 'Largest US blood supplier; multi-region operations.' },
      { name: 'Vitalant', domain: 'vitalant.org', segment: 'blood', tier: 1, relationship: 'prospect', note: 'One of the largest independent blood centers, multi-state.' },
      { name: 'OneBlood', domain: 'oneblood.org', segment: 'blood', tier: 2, relationship: 'prospect', note: 'Southeast US, multi-state.' },
      { name: 'New York Blood Center Enterprises', domain: 'nybc.org', segment: 'blood', tier: 2, relationship: 'prospect', note: 'NYBCe covers NY/NJ + acquired centers.' },
      { name: 'Versiti', domain: 'versiti.org', segment: 'blood', tier: 2, relationship: 'prospect', note: 'Blood + research organization, multi-state.' },
      { name: 'LifeSouth Community Blood Centers', domain: 'lifesouth.org', segment: 'blood', tier: 2, relationship: 'prospect', note: 'Southeast US, multi-state.' },
      { name: 'Bloodworks Northwest', domain: 'bloodworksnw.org', segment: 'blood', tier: 2, relationship: 'prospect', note: 'PNW; research + collection.' },
      { name: 'Gulf Coast Regional Blood Center', domain: 'giveblood.org', segment: 'blood', tier: 2, relationship: 'prospect', note: 'Houston region; verify domain during push.' },
      { name: 'Carter BloodCare', domain: 'carterbloodcare.org', segment: 'blood', tier: 2, relationship: 'prospect', note: 'North Texas.' },
      { name: 'ImpactLife', domain: 'bloodcenter.org', segment: 'blood', tier: 2, relationship: 'prospect', note: 'Formerly Mississippi Valley Regional Blood Center; verify domain during push.' },
      { name: 'San Diego Blood Bank', domain: 'sandiegobloodbank.org', segment: 'blood', tier: 3, relationship: 'prospect', note: 'Southern CA regional.' },
      { name: 'Stanford Blood Center', domain: 'stanfordbloodcenter.org', segment: 'blood', tier: 3, relationship: 'prospect', note: 'Stanford-affiliated.' },
      { name: 'Hoxworth Blood Center', domain: 'hoxworth.org', segment: 'blood', tier: 3, relationship: 'prospect', note: 'University of Cincinnati blood center.' },
      { name: 'LifeServe Blood Center', domain: 'lifeservebloodcenter.org', segment: 'blood', tier: 3, relationship: 'prospect', note: 'Iowa/Nebraska/SD regional.' },
      { name: 'Blood Assurance', domain: 'bloodassurance.org', segment: 'blood', tier: 3, relationship: 'prospect', note: 'TN/GA/AL/VA/KY/NC regional.' },

      // Biorepositories / reference labs / CROs ------------------------------
      { name: 'BioIVT', domain: 'bioivt.com', segment: 'biorepository', tier: 1, relationship: 'prospect', note: 'Live RFP response in repo (rfp/); highest-intent account.' },
      { name: 'Quest Diagnostics', domain: 'questdiagnostics.com', segment: 'biorepository', tier: 1, relationship: 'customer', note: 'Customer — expansion + reference. Do not cold-sequence.' },
      { name: 'NAMSA', domain: 'namsa.com', segment: 'biorepository', tier: 1, relationship: 'customer', note: 'Customer — expansion + reference. Do not cold-sequence.' },
      { name: 'Labcorp', domain: 'labcorp.com', segment: 'biorepository', tier: 1, relationship: 'prospect', note: 'Reference lab giant; expansion via BioReference acquisition.' },
      { name: 'Charles River Laboratories', domain: 'criver.com', segment: 'biorepository', tier: 1, relationship: 'prospect', note: 'Global CRO with US biorepository footprint.' },
      { name: 'Precision for Medicine', domain: 'precisionformedicine.com', segment: 'biorepository', tier: 2, relationship: 'prospect', note: 'Specimen management + CRO services.' },
      { name: 'Discovery Life Sciences', domain: 'dls.com', segment: 'biorepository', tier: 2, relationship: 'prospect', note: 'Specimen + genomics provider; verify domain during push (also discoverylifesciences.com).' },
      { name: 'Sanguine Biosciences', domain: 'sanguinebio.com', segment: 'biorepository', tier: 3, relationship: 'prospect', note: 'Distributed specimen collection.' },
      { name: 'Coriell Institute for Medical Research', domain: 'coriell.org', segment: 'biorepository', tier: 2, relationship: 'prospect', note: 'Biobanking + cell repositories.' },
      { name: 'ATCC', domain: 'atcc.org', segment: 'biorepository', tier: 2, relationship: 'prospect', note: 'Global biological resource center.' },
      { name: 'Infinity BiologiX (IBX)', domain: 'infinitybiologix.com', segment: 'biorepository', tier: 2, relationship: 'prospect', note: 'RUCDR spinout; large biorepository operations.' },
      { name: 'Fisher BioServices (Thermo Fisher)', domain: 'fisherbioservices.com', segment: 'biorepository', tier: 2, relationship: 'prospect', note: 'Cold chain + biorepository services arm.' },
      { name: 'Eurofins US', domain: 'eurofinsus.com', segment: 'biorepository', tier: 2, relationship: 'prospect', note: 'US reference labs + CRO footprint; verify best domain during push.' },
      { name: 'ARUP Laboratories', domain: 'aruplab.com', segment: 'biorepository', tier: 2, relationship: 'prospect', note: 'National reference lab, Utah HQ.' },
      { name: 'Mayo Clinic Laboratories', domain: 'mayocliniclabs.com', segment: 'biorepository', tier: 2, relationship: 'prospect', note: 'Reference lab arm of Mayo Clinic.' },
      { name: 'BioReference Laboratories', domain: 'bioreference.com', segment: 'biorepository', tier: 3, relationship: 'prospect', note: 'Acquired by Labcorp — status may be shifting; verify decision authority.' },
      { name: 'Sonic Healthcare USA', domain: 'sonichealthcareusa.com', segment: 'biorepository', tier: 2, relationship: 'prospect', note: 'US arm of Sonic Healthcare; multiple lab brands.' },
      { name: 'Azenta Life Sciences', domain: 'azenta.com', segment: 'biorepository', tier: 2, relationship: 'prospect', note: 'Sample management + cold chain (Brooks Life Sciences legacy).' },

      // Organ procurement organizations --------------------------------------
      { name: 'Center for Organ Recovery & Education (CORE)', domain: 'core.org', segment: 'opo', tier: 1, relationship: 'customer', note: 'Customer — reference. Do not cold-sequence; verify domain during push.' },
      { name: 'Gift of Life Donor Program', domain: 'donors1.org', segment: 'opo', tier: 2, relationship: 'prospect', note: 'Philadelphia-region OPO; largest by volume historically.' },
      { name: 'LifeGift', domain: 'lifegift.org', segment: 'opo', tier: 3, relationship: 'prospect', note: 'Texas OPO.' },
      { name: 'Donor Network West', domain: 'donornetworkwest.org', segment: 'opo', tier: 3, relationship: 'prospect', note: 'Northern CA + NV OPO.' },
      { name: 'OneLegacy', domain: 'onelegacy.org', segment: 'opo', tier: 2, relationship: 'prospect', note: 'Largest OPO by population served (Los Angeles).' },
      { name: 'LifeNet Health', domain: 'lifenethealth.org', segment: 'opo', tier: 2, relationship: 'prospect', note: 'OPO + tissue bank; large biorepository footprint.' },
      { name: 'Mid-America Transplant', domain: 'midamericatransplant.org', segment: 'opo', tier: 3, relationship: 'prospect', note: 'St Louis-based OPO.' },
      { name: 'Gift of Hope', domain: 'giftofhope.org', segment: 'opo', tier: 3, relationship: 'prospect', note: 'Illinois/Indiana OPO.' },
      { name: 'Donor Alliance', domain: 'donoralliance.org', segment: 'opo', tier: 3, relationship: 'prospect', note: 'Colorado + Wyoming OPO.' },
      { name: 'New England Donor Services', domain: 'neds.org', segment: 'opo', tier: 3, relationship: 'prospect', note: 'New England multi-state OPO.' },
      { name: 'LiveOnNY', domain: 'liveonny.org', segment: 'opo', tier: 3, relationship: 'prospect', note: 'NYC-metro OPO.' },
      { name: 'Southwest Transplant Alliance', domain: 'organ.org', segment: 'opo', tier: 3, relationship: 'prospect', note: 'Texas OPO; verify domain during push.' },
      { name: 'Indiana Donor Network', domain: 'indianadonornetwork.org', segment: 'opo', tier: 3, relationship: 'prospect', note: 'Indiana OPO.' },
      { name: 'LifeCenter Northwest', domain: 'lcnw.org', segment: 'opo', tier: 3, relationship: 'prospect', note: 'PNW OPO.' },
    ],
  },

  // ==========================================================================
  {
    id: 'fm-food-service',
    name: 'Facilities Management (Food Service)',
    region: 'UK',
    status: 'exploring',
    summary:
      'Exploratory: FM providers running food service for their clients (contract catering, integrated FM). Indirect motion — the FM resells compliance to their client, which changes the pitch. Hold at opportunistic until a core vertical is clearly working.',
    apolloAccountLists: ['FM Companies UK', 'Facilities Management companies'],
    apolloContactLists: ['FM contacts UK', 'UK Facilities Management contacts in our CRM'],
    personas: [
      {
        title: 'Account / Contract Director (FM)',
        role: 'Owns client contracts where food service compliance is a deliverable',
        pains: [
          'Compliance failures at a client site risk the whole contract, not just a fine',
          'Proving service quality to the client requires evidence, and paper doesn\u2019t travel',
          'Managing compliance differently at every client site doesn\u2019t scale',
        ],
        caresAbout: [
          'Client-facing compliance reporting as a differentiator at renewal',
          'One operating standard deployable across client sites',
        ],
      },
    ],
    useCases: [
      { name: 'Client compliance reporting', detail: 'Evidence packs the FM can hand to their client — compliance as a service deliverable' },
      { name: 'Multi-client dashboards', detail: 'One platform across different client estates' },
      { name: 'Automated monitoring + digital checks', detail: 'Same core platform as direct verticals' },
    ],
    proofPoints: [
      'Same platform proof points as forecourts/coffee: 60% less compliance admin, 90%+ audit-ready, 24/7 monitoring',
      'Angle shift: for FM, compliance evidence is a revenue defence (contract renewal), not just risk reduction',
    ],
    talkingPoints: [
      'Pitch compliance as a client deliverable: "walk into your QBR with live compliance dashboards instead of a binder."',
      'Contract risk framing: one food safety incident at a client site can lose an entire FM contract.',
      'Keep this vertical opportunistic — respond to inbound and warm intros; don\u2019t fund proactive cadences until a core vertical is scaled.',
    ],
    objections: [
      {
        objection: 'Our clients specify their own systems.',
        response: 'Some do — but where the FM brings the operating model, bringing your own compliance platform is a differentiator, and the reporting becomes part of your service value at renewal.',
      },
    ],
    cadences: [],
  },
];

export function getVertical(id: string): Vertical | undefined {
  return PLAYBOOK.find((v) => v.id === id);
}
