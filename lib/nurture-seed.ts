import { sql } from './db';
import { createNurtureTrack, createNurtureStep, addNurtureContent } from './nurture-db';

export async function seedDefaultTrack(): Promise<number> {
  const existing = await sql`SELECT id FROM nurture_tracks WHERE name = 'Closed-Lost Generic' LIMIT 1`;
  if (existing.length > 0) {
    await migrateSteps(existing[0].id);
    return existing[0].id;
  }

  const track = await createNurtureTrack(
    'Closed-Lost Generic',
    'Re-engagement nurture track for closed-lost deals. 6 emails over 90 days — marketing content, industry insights, and product updates.'
  );

  await writeSteps(track.id);
  return track.id;
}

async function migrateSteps(trackId: number) {
  const check = await sql`SELECT delay_days FROM nurture_steps WHERE track_id = ${trackId} AND step_number = 1`;
  if (check.length > 0 && check[0].delay_days === 1) return;
  await writeSteps(trackId);
}

async function writeSteps(trackId: number) {
  await createNurtureStep(trackId, 1, 1,
    'What teams like {{company_name}} are doing differently in {{vertical}}',
    `Hi {{contact_name}},

Operations teams across {{vertical}} are rethinking how they handle compliance — moving away from paper checklists and manual temperature logs toward automated, real-time monitoring.

{{personalized_context}}

Here's what's driving the shift:

• Automated sensors that log temperatures 24/7 — no manual checks needed
• Digital checklists that flag missed tasks before they become audit issues
• Predictive alerts that catch equipment failures before they happen

We put together a quick overview of how this works in practice:

{{content_block}}

Worth a look if operational visibility is on your radar.

The Checkit Team`,
    ['account_context', 'product_update']
  );

  await createNurtureStep(trackId, 2, 10,
    'How {{vertical}} teams are cutting compliance prep by 60%',
    `Hi {{contact_name}},

We recently published a case study that's been getting a lot of attention from {{vertical}} operations leaders.

{{content_block}}

The headline numbers:
• 60% reduction in audit preparation time
• 90%+ compliance scores across all sites
• Full digital audit trail — no more paper binders

These results came from a team facing challenges similar to what many organizations in {{vertical}} deal with every day.

If you'd like to see the full breakdown, it's linked above.

The Checkit Team`,
    ['case_study', 'social_proof']
  );

  await createNurtureStep(trackId, 3, 21,
    'New from Checkit: Asset Intelligence and predictive monitoring',
    `Hi {{contact_name}},

We've been shipping some major updates to the Checkit platform and wanted to make sure you saw them:

🔧 Asset Intelligence — Track equipment health, predict failures before they happen, and reduce unplanned downtime.

🌡️ Enhanced Temperature Automation — Expanded sensor support, faster alerting, and smarter escalation rules.

📋 Workflow Builder 2.0 — Build custom compliance workflows with conditional logic, photo evidence, and automated sign-offs.

{{content_block}}

These updates were built directly from feedback from operations teams in {{vertical}} and adjacent industries.

See what's new → https://checkitv6.com/platform

The Checkit Team`,
    ['product_update', 'temperature_automation', 'asset_intelligence']
  );

  await createNurtureStep(trackId, 4, 45,
    '3 {{vertical}} trends every operations leader should know',
    `Hi {{contact_name}},

We've been tracking some important shifts in {{vertical}} that are reshaping how operations and compliance teams work:

1. Regulatory bodies are increasingly expecting digital records — paper logs are becoming a liability.

2. Insurance providers are offering better rates to facilities with automated monitoring and predictive maintenance.

3. Labor shortages are accelerating the move to technology-assisted compliance — doing more with fewer hands.

{{content_block}}

Organizations getting ahead of these trends are seeing real competitive advantages in audits, insurance costs, and staff efficiency.

The Checkit Team`,
    ['industry_insight', 'blog']
  );

  await createNurtureStep(trackId, 5, 75,
    'The ROI of automated compliance: real numbers from real teams',
    `Hi {{contact_name}},

We hear from a lot of operations leaders who want to modernize but need to make the business case first. So we pulled together the numbers:

📊 Average results across Checkit customers:
• 60% less time spent on compliance prep
• 35% reduction in equipment-related incidents
• $15K–$50K annual savings per facility from reduced waste and fewer violations

{{content_block}}

We also built a free calculator so you can estimate the impact for your specific operation:
→ https://checkitv6.com/tools/paper-to-digital

No sales pitch — just math.

The Checkit Team`,
    ['roi', 'social_proof', 'case_study']
  );

  await createNurtureStep(trackId, 6, 90,
    '{{contact_name}}, quick question',
    `Hi {{contact_name}},

We've been sharing updates from Checkit over the past few months. Before we wrap up this series, we wanted to ask:

Is operational compliance still a priority at {{company_name}}?

If so, our team would love to set up a quick 15-minute walkthrough — tailored to {{vertical}}, no slides, just a live look at the platform.

→ Book a time: https://checkitv6.com
→ Or just reply to this email

If the timing isn't right, no worries at all. We'll keep publishing useful content on our blog that you can access anytime:
→ https://checkitv6.com/blog

Thanks for reading,
The Checkit Team`,
    ['demo_request']
  );
}

// ============================================
// Industry-specific post-call tracks
// ============================================

interface TrackDef {
  name: string;
  description: string;
  steps: Array<{
    stepNumber: number;
    delayDays: number;
    subject: string;
    body: string;
    tags: string[];
  }>;
}

const INDUSTRY_TRACKS: TrackDef[] = [
  {
    name: 'Post-Call: Forecourts',
    description: 'Post-call brochure track for forecourt and fuel retail operators. 6 emails over 45 days.',
    steps: [
      {
        stepNumber: 1, delayDays: 0,
        subject: 'Your Checkit overview — forecourt operations made simple',
        body: `Hi {{contact_name}},

Great speaking with you. As promised, here's a quick overview of how Checkit helps forecourt operators like {{company_name}} stay compliant and reduce operational risk.

See the full overview here:
https://checkitv6.com/brochures/forecourts

Key highlights:

• Automated temperature monitoring across fridges, food-to-go cabinets, and cold rooms — 24/7 logging, no manual checks
• Digital checklists for fuel safety, food prep, and shift handovers — with photo evidence and escalation rules
• Real-time alerts when temperatures drift or tasks are missed, before they become incidents
• A single dashboard for multi-site visibility across your forecourt estate

{{content_block}}

Teams like yours are moving away from paper logs and spreadsheets toward automated compliance — and seeing real results.

The Checkit Team`,
        tags: ['product_update', 'industry_insight'],
      },
      {
        stepNumber: 2, delayDays: 3,
        subject: 'How forecourt operators are cutting compliance time in half',
        body: `Hi {{contact_name}},

Following up on the Checkit overview — wanted to share some results we're seeing from forecourt operations teams:

• 60% reduction in time spent on compliance paperwork
• 90%+ food safety audit scores across all sites
• Immediate visibility into which sites are compliant and which need attention

{{content_block}}

The shift from paper to digital is saving teams hours per week per site — and giving area managers confidence that nothing is being missed.

Worth a look if compliance consistency across your sites is a priority.

The Checkit Team`,
        tags: ['case_study', 'social_proof'],
      },
      {
        stepNumber: 3, delayDays: 7,
        subject: "What's new: Asset Intelligence for forecourt equipment",
        body: `Hi {{contact_name}},

Quick update — we've been shipping some features that are particularly relevant for forecourt operations:

• Asset Intelligence — Track the health of fridges, freezers, and food-to-go equipment. Predict failures before they cause waste or compliance gaps.
• Smart Escalations — If a temperature alert isn't acknowledged within your threshold, it auto-escalates to the area manager.
• Multi-site Reporting — Compare compliance scores, task completion, and equipment health across your entire estate.

{{content_block}}

These were built directly from feedback from fuel retail and convenience operators.

See what's new → https://checkitv6.com/platform

The Checkit Team`,
        tags: ['product_update', 'asset_intelligence'],
      },
      {
        stepNumber: 4, delayDays: 14,
        subject: '3 trends shaping forecourt operations in 2025',
        body: `Hi {{contact_name}},

We've been tracking some important shifts in forecourt operations:

1. Food-to-go is becoming the margin driver — and with it comes stricter food safety requirements that manual processes can't keep up with.

2. EHOs are increasingly expecting digital records — paper temperature logs are becoming a red flag during inspections.

3. Multi-site operators are consolidating compliance, safety, and maintenance into single platforms to reduce complexity and cost.

{{content_block}}

Operators getting ahead of these trends are seeing advantages in audit scores, insurance costs, and staff productivity.

The Checkit Team`,
        tags: ['industry_insight', 'blog'],
      },
      {
        stepNumber: 5, delayDays: 28,
        subject: 'The ROI of automated compliance for forecourts',
        body: `Hi {{contact_name}},

We hear from a lot of forecourt operators who want to modernize but need to build the business case. Here are the numbers:

• 60% less time on compliance paperwork per site
• 35% reduction in equipment-related waste incidents
• £10K–£30K annual savings per site from reduced waste and fewer violations

{{content_block}}

We also built a free calculator so you can estimate the impact for {{company_name}}:
→ https://checkitv6.com/tools/paper-to-digital

No sales pitch — just math.

The Checkit Team`,
        tags: ['roi', 'social_proof'],
      },
      {
        stepNumber: 6, delayDays: 45,
        subject: '{{contact_name}}, quick question',
        body: `Hi {{contact_name}},

We've been sharing some updates from Checkit over the past few weeks. Before we wrap up this series:

Is forecourt compliance still a priority at {{company_name}}?

If so, we'd love to set up a quick 15-minute walkthrough — tailored to fuel retail, no slides, just a live look at the platform.

→ Reply to this email to book a time

If the timing isn't right, no worries. We'll keep publishing useful content:
→ https://checkitv6.com/blog

Thanks for reading,
The Checkit Team`,
        tags: ['demo_request'],
      },
    ],
  },
  {
    name: 'Post-Call: Food to Go',
    description: 'Post-call brochure track for food-to-go and QSR operations. 6 emails over 45 days.',
    steps: [
      {
        stepNumber: 1, delayDays: 0,
        subject: 'Your Checkit overview — food-to-go compliance simplified',
        body: `Hi {{contact_name}},

Great speaking with you. As promised, here's an overview of how Checkit helps food-to-go operators like {{company_name}} stay on top of food safety and compliance.

See the full overview here:
https://checkitv6.com/brochures/food-to-go

Key highlights:

• Automated HACCP temperature logging — fridges, hot holds, prep areas, all monitored 24/7
• Digital food safety checklists with photo evidence, conditional logic, and automatic escalations
• Real-time alerts when temperatures breach thresholds — before product is compromised
• Multi-site dashboards for area managers to track compliance across every location

{{content_block}}

Teams running food-to-go operations are finding that automation catches the things manual processes miss — especially during peak hours.

The Checkit Team`,
        tags: ['product_update', 'industry_insight'],
      },
      {
        stepNumber: 2, delayDays: 3,
        subject: 'How food-to-go teams are achieving 90%+ audit scores',
        body: `Hi {{contact_name}},

Wanted to share some results we're seeing from food-to-go operations teams using Checkit:

• 60% reduction in audit preparation time
• 90%+ compliance scores — consistently, across all sites
• Complete digital audit trail — no more scrambling for paper records before an EHO visit

{{content_block}}

The difference is having continuous compliance rather than point-in-time checks. When every temperature reading and every task is automatically logged, audits become straightforward.

The Checkit Team`,
        tags: ['case_study', 'social_proof'],
      },
      {
        stepNumber: 3, delayDays: 7,
        subject: 'New from Checkit: smarter alerts and predictive monitoring',
        body: `Hi {{contact_name}},

Some recent platform updates that are particularly useful for food-to-go operations:

• Predictive Temperature Alerts — Know when a fridge is trending toward failure before it breaches, giving you time to act rather than react.
• Smart Task Routing — Automatically assign corrective actions to the right person when an issue is flagged.
• Waste Reduction Tracking — Correlate temperature excursions with product waste to quantify the cost of equipment issues.

{{content_block}}

These features are helping food-to-go teams reduce waste and keep food safety scores consistently high.

See what's new → https://checkitv6.com/platform

The Checkit Team`,
        tags: ['product_update', 'temperature_automation'],
      },
      {
        stepNumber: 4, delayDays: 14,
        subject: 'Food safety trends every operations leader should know',
        body: `Hi {{contact_name}},

Three shifts we're seeing in food-to-go compliance:

1. Regulatory bodies are raising the bar on digital traceability — HACCP documentation needs to be audit-ready at all times, not assembled after the fact.

2. Labour shortages mean teams need technology-assisted compliance — you can't rely on manual checks when you're short-staffed during lunch rush.

3. Multi-site operators are centralising food safety oversight — giving area managers real-time visibility instead of waiting for site visits.

{{content_block}}

The operators moving early are building a compliance advantage that's hard to replicate.

The Checkit Team`,
        tags: ['industry_insight', 'blog'],
      },
      {
        stepNumber: 5, delayDays: 28,
        subject: 'The ROI of automated food safety — real numbers',
        body: `Hi {{contact_name}},

Building the business case for food safety automation? Here's what we're seeing across our customer base:

• 60% less time spent on compliance prep per site
• 35% reduction in food waste from equipment failures
• £10K–£30K annual savings per site from reduced waste, fewer violations, and staff efficiency

{{content_block}}

Calculate the specific impact for {{company_name}}:
→ https://checkitv6.com/tools/paper-to-digital

The Checkit Team`,
        tags: ['roi', 'social_proof'],
      },
      {
        stepNumber: 6, delayDays: 45,
        subject: '{{contact_name}}, quick question',
        body: `Hi {{contact_name}},

We've shared some updates on how Checkit helps food-to-go operations. Before we wrap up:

Is food safety compliance still a priority at {{company_name}}?

If so, we'd love a quick 15-minute call — tailored to your operation, no slides, just a live walkthrough.

→ Reply to this email to book a time

If not now, no worries — our blog has plenty of useful content:
→ https://checkitv6.com/blog

Thanks for reading,
The Checkit Team`,
        tags: ['demo_request'],
      },
    ],
  },
  {
    name: 'Post-Call: Facilities Management',
    description: 'Post-call brochure track for facilities management teams. 6 emails over 45 days.',
    steps: [
      {
        stepNumber: 1, delayDays: 0,
        subject: 'Your Checkit overview — facilities compliance and monitoring',
        body: `Hi {{contact_name}},

Great speaking with you. As promised, here's an overview of how Checkit helps facilities management teams like {{company_name}} automate compliance and equipment monitoring.

See the full overview here:
https://checkitv6.com/brochures/facilities

Key highlights:

• Automated environmental monitoring — temperature, humidity, and air quality tracked 24/7 with wireless sensors
• Digital compliance checklists with automated scheduling, escalations, and audit trails
• Asset Intelligence — track equipment health, predict failures, and reduce unplanned downtime
• Multi-site dashboards that give you real-time visibility across your entire portfolio

{{content_block}}

Facilities teams are moving from reactive to proactive — catching issues before they become costly problems.

The Checkit Team`,
        tags: ['product_update', 'industry_insight'],
      },
      {
        stepNumber: 2, delayDays: 3,
        subject: 'How facilities teams are reducing unplanned downtime by 35%',
        body: `Hi {{contact_name}},

Wanted to share results from facilities teams using Checkit:

• 35% reduction in unplanned equipment downtime through predictive monitoring
• 60% less time on compliance paperwork — digital audit trails replace paper logs
• Full visibility across sites — area managers can identify issues without waiting for site visits

{{content_block}}

The shift from scheduled inspections to continuous monitoring catches problems earlier and costs less to fix.

The Checkit Team`,
        tags: ['case_study', 'social_proof'],
      },
      {
        stepNumber: 3, delayDays: 7,
        subject: 'New: Asset Intelligence and predictive maintenance',
        body: `Hi {{contact_name}},

Some platform updates particularly relevant for facilities management:

• Asset Intelligence — Monitor equipment health metrics, spot degradation trends, and schedule maintenance before failures occur.
• Environmental Monitoring — Temperature, humidity, and air quality sensors that integrate directly with your compliance workflows.
• Automated Escalations — When an issue isn't resolved within your SLA, it auto-escalates through your management chain.

{{content_block}}

These capabilities are helping facilities teams shift from reactive break-fix to proactive management.

See what's new → https://checkitv6.com/platform

The Checkit Team`,
        tags: ['product_update', 'asset_intelligence'],
      },
      {
        stepNumber: 4, delayDays: 14,
        subject: '3 trends reshaping facilities management in 2025',
        body: `Hi {{contact_name}},

Key shifts we're seeing in facilities management:

1. Smart building technology is becoming table stakes — clients expect real-time monitoring and data-driven maintenance.

2. Sustainability and energy compliance requirements are driving demand for continuous environmental monitoring.

3. Integrated platforms that combine compliance, maintenance, and environmental monitoring are replacing point solutions.

{{content_block}}

Facilities teams that embrace these shifts are winning more contracts and delivering better outcomes.

The Checkit Team`,
        tags: ['industry_insight', 'blog'],
      },
      {
        stepNumber: 5, delayDays: 28,
        subject: 'The ROI of automated facilities monitoring',
        body: `Hi {{contact_name}},

Here's what facilities teams are seeing with automated monitoring:

• 35% reduction in unplanned downtime
• 60% less time on compliance documentation
• 15–25% reduction in maintenance costs through predictive scheduling

{{content_block}}

Estimate the impact for {{company_name}}:
→ https://checkitv6.com/tools/paper-to-digital

The Checkit Team`,
        tags: ['roi', 'social_proof'],
      },
      {
        stepNumber: 6, delayDays: 45,
        subject: '{{contact_name}}, quick question',
        body: `Hi {{contact_name}},

We've shared some updates on Checkit for facilities management. Before we wrap up:

Is compliance and equipment monitoring still a priority at {{company_name}}?

If so, we'd love a quick 15-minute walkthrough — tailored to facilities, no slides.

→ Reply to this email to book a time

If not now, our blog has useful content:
→ https://checkitv6.com/blog

Thanks for reading,
The Checkit Team`,
        tags: ['demo_request'],
      },
    ],
  },
  {
    name: 'Post-Call: Chain Dining & Pub Groups',
    description: 'Post-call brochure track for chain dining and pub group operators. 6 emails over 45 days.',
    steps: [
      {
        stepNumber: 1, delayDays: 0,
        subject: 'Your Checkit overview — compliance for chain dining & pub groups',
        body: `Hi {{contact_name}},

Great speaking with you. Here's a quick overview of how Checkit helps chain dining and pub group operators like {{company_name}} manage food safety and compliance across multiple sites.

See the full overview here:
https://checkitv6.com/brochures/chain-dining

Key highlights:

• Automated HACCP temperature monitoring — fridges, freezers, hot holds, and cellars tracked 24/7
• Digital food safety checklists — opening/closing procedures, allergen management, cleaning schedules, all with photo evidence
• Real-time compliance dashboards — area managers see every site's status without waiting for visits
• Supplier and delivery checks — log delivery temperatures and flag issues immediately

{{content_block}}

Multi-site operators are finding that centralised, automated compliance is the only way to maintain consistency as they grow.

The Checkit Team`,
        tags: ['product_update', 'industry_insight'],
      },
      {
        stepNumber: 2, delayDays: 3,
        subject: 'How hospitality groups are acing food safety audits',
        body: `Hi {{contact_name}},

Results from chain dining and pub group operators using Checkit:

• 90%+ food safety audit scores — consistently, across all sites
• 60% reduction in time spent on compliance admin
• Digital audit trail that's always inspection-ready — no last-minute scramble

{{content_block}}

When compliance is automated and continuous, EHO visits become a non-event rather than a fire drill.

The Checkit Team`,
        tags: ['case_study', 'social_proof'],
      },
      {
        stepNumber: 3, delayDays: 7,
        subject: 'New: cellar monitoring and multi-site reporting',
        body: `Hi {{contact_name}},

Platform updates relevant for chain dining and pub operations:

• Cellar Temperature Monitoring — Track beer cellar temperatures automatically, with alerts when conditions drift.
• Multi-site Comparison — Rank sites by compliance score, task completion, and equipment health.
• Kitchen Display Integration — Surface compliance tasks and alerts directly where your teams work.

{{content_block}}

Built from feedback from hospitality operators running 10 to 500+ sites.

See what's new → https://checkitv6.com/platform

The Checkit Team`,
        tags: ['product_update', 'temperature_automation'],
      },
      {
        stepNumber: 4, delayDays: 14,
        subject: 'Hospitality compliance trends you should know about',
        body: `Hi {{contact_name}},

Key trends in chain dining and pub group compliance:

1. Natasha's Law and evolving allergen regulations are raising the documentation bar — digital traceability is becoming essential.

2. Insurance underwriters are increasingly asking about compliance technology — automated monitoring can reduce premiums.

3. Staff turnover in hospitality makes consistent compliance harder — technology bridges the gap by guiding new staff through procedures.

{{content_block}}

Operators getting ahead of these trends are building resilience into their compliance processes.

The Checkit Team`,
        tags: ['industry_insight', 'blog'],
      },
      {
        stepNumber: 5, delayDays: 28,
        subject: 'The ROI of automated compliance for hospitality',
        body: `Hi {{contact_name}},

Here's what chain dining and pub group operators are seeing:

• 60% reduction in compliance admin per site
• 35% fewer food waste incidents from temperature-related issues
• £10K–£30K annual savings per site from waste reduction and efficiency gains

{{content_block}}

Estimate the impact for {{company_name}}:
→ https://checkitv6.com/tools/paper-to-digital

The Checkit Team`,
        tags: ['roi', 'social_proof'],
      },
      {
        stepNumber: 6, delayDays: 45,
        subject: '{{contact_name}}, quick question',
        body: `Hi {{contact_name}},

We've shared some updates on Checkit for hospitality operations. Before we wrap up:

Is food safety compliance still a priority at {{company_name}}?

If so, we'd love a quick 15-minute walkthrough — tailored to chain dining, no slides.

→ Reply to this email to book a time

If not now, our blog has useful content:
→ https://checkitv6.com/blog

Thanks for reading,
The Checkit Team`,
        tags: ['demo_request'],
      },
    ],
  },
  {
    name: 'Post-Call: Pharmacy & Pathology (CAM+)',
    description: 'Post-call brochure track for pharmacy and pathology — CAM+ Connected Automated Monitoring. 6 emails over 45 days.',
    steps: [
      {
        stepNumber: 1, delayDays: 0,
        subject: 'Your Checkit CAM+ overview — pharmacy & pathology monitoring',
        body: `Hi {{contact_name}},

Great speaking with you. As promised, here's an overview of Checkit CAM+ — our Connected Automated Monitoring solution for pharmacy and pathology environments.

See the full overview here:
https://checkitv6.com/brochures/pharmacy

Key highlights:

• 24/7 automated temperature monitoring for fridges, freezers, blood banks, and specimen storage — fully MHRA and CQC compliant
• Continuous logging with tamper-proof digital records — replacing manual twice-daily checks
• Instant alerts when temperatures breach thresholds, with automatic escalation chains
• Dashboard visibility across multiple sites — 60+ NHS Trusts already rely on Checkit CAM+

CAM+ is purpose-built for healthcare environments where temperature excursions can compromise patient safety and regulatory compliance.

{{content_block}}

The Checkit Team`,
        tags: ['product_update', 'industry_insight'],
      },
      {
        stepNumber: 2, delayDays: 3,
        subject: 'How NHS Trusts are achieving continuous cold chain compliance',
        body: `Hi {{contact_name}},

Some results from pharmacy and pathology teams using Checkit CAM+:

• 300+ NHS sites monitored — from community pharmacies to large acute trusts
• 100% digital audit trail — always inspection-ready for CQC and MHRA
• Elimination of manual temperature checks — staff time redirected to patient care
• Immediate out-of-hours alerting — no more undetected overnight fridge failures

{{content_block}}

When you're storing vaccines, blood products, or specimens, you can't afford gaps in monitoring. CAM+ ensures there are none.

The Checkit Team`,
        tags: ['case_study', 'social_proof'],
      },
      {
        stepNumber: 3, delayDays: 7,
        subject: 'CAM+ platform update: enhanced alerting and reporting',
        body: `Hi {{contact_name}},

Recent CAM+ updates relevant for pharmacy and pathology:

• Enhanced Alert Chains — Configure multi-tier escalation with specific contacts for each storage unit, with time-based auto-escalation.
• Regulatory Reporting — One-click exports formatted for CQC inspections and MHRA audits.
• Battery-backed Sensors — Continue logging during power outages, with separate power failure alerts.
• Integration APIs — Connect CAM+ data with your existing pharmacy management or LIMS systems.

{{content_block}}

These updates reflect direct feedback from NHS pharmacy superintendents and pathology lab managers.

The Checkit Team`,
        tags: ['product_update', 'temperature_automation'],
      },
      {
        stepNumber: 4, delayDays: 14,
        subject: 'Healthcare cold chain trends and regulatory direction',
        body: `Hi {{contact_name}},

Key trends in pharmacy and pathology compliance:

1. MHRA is moving toward continuous monitoring expectations — manual twice-daily checks are increasingly insufficient for GxP environments.

2. CQC inspectors are specifically asking about digital temperature records — Trusts with automated monitoring are rated more favourably.

3. The NHS Long Term Plan's emphasis on digital transformation includes supply chain and storage monitoring — funding may be available for modernisation.

{{content_block}}

Trusts getting ahead of these shifts are in a stronger compliance position and spending less time on manual processes.

The Checkit Team`,
        tags: ['industry_insight', 'blog'],
      },
      {
        stepNumber: 5, delayDays: 28,
        subject: 'The ROI of automated cold chain monitoring',
        body: `Hi {{contact_name}},

Here's what pharmacy and pathology teams are seeing with CAM+:

• Elimination of 30+ minutes per day of manual temperature logging per site
• Zero undetected temperature excursions — vs. average of 2–3 per month with manual checks
• Significant reduction in wasted stock from undetected fridge failures
• Faster CQC/MHRA audit preparation — from days to minutes

{{content_block}}

Estimate the impact for your operation:
→ https://checkitv6.com/tools/paper-to-digital

The Checkit Team`,
        tags: ['roi', 'social_proof'],
      },
      {
        stepNumber: 6, delayDays: 45,
        subject: '{{contact_name}}, quick question',
        body: `Hi {{contact_name}},

We've shared some updates on Checkit CAM+ for pharmacy and pathology. Before we wrap up:

Is cold chain compliance still a priority for your team?

If so, we'd love a quick 15-minute walkthrough — tailored to your specific environment.

→ Reply to this email to book a time

If not now, our blog has useful healthcare content:
→ https://checkitv6.com/blog

Thanks for reading,
The Checkit Team`,
        tags: ['demo_request'],
      },
    ],
  },
];

export async function seedIndustryTracks(): Promise<void> {
  // Clean up duplicate tracks from race conditions
  for (const trackDef of INDUSTRY_TRACKS) {
    const dupes = await sql`
      SELECT id FROM nurture_tracks WHERE name = ${trackDef.name} ORDER BY id ASC
    `;
    if (dupes.length > 1) {
      for (let i = 1; i < dupes.length; i++) {
        await sql`DELETE FROM nurture_steps WHERE track_id = ${dupes[i].id}`;
        await sql`DELETE FROM nurture_tracks WHERE id = ${dupes[i].id}`;
      }
    }
  }

  for (const trackDef of INDUSTRY_TRACKS) {
    const existing = await sql`SELECT id FROM nurture_tracks WHERE name = ${trackDef.name} LIMIT 1`;
    let trackId: number;
    if (existing.length > 0) {
      trackId = existing[0].id;
    } else {
      const track = await createNurtureTrack(trackDef.name, trackDef.description);
      trackId = track.id;
    }
    for (const step of trackDef.steps) {
      await createNurtureStep(trackId, step.stepNumber, step.delayDays, step.subject, step.body, step.tags);
    }
  }
}

export async function seedDefaultContent(): Promise<void> {
  const existing = await sql`SELECT COUNT(*) as count FROM nurture_content`;
  if (parseInt(existing[0]?.count || '0') > 0) return;

  const content = [
    {
      title: 'Morningstar Senior Living Case Study',
      url: 'https://checkitv6.com/case-studies/morningstar',
      source: 'case_study',
      verticalTags: ['senior-living'],
      topicTags: ['case_study', 'social_proof', 'roi'],
      description: 'How Morningstar Senior Living automated compliance monitoring across 41 communities, cutting audit prep time and improving scores.',
    },
    {
      title: 'Texas Tech Case Study',
      url: 'https://checkitv6.com/case-studies/texas-tech',
      source: 'case_study',
      verticalTags: ['food-facilities', 'operations'],
      topicTags: ['case_study', 'social_proof', 'temperature_automation'],
      description: 'How Texas Tech University digitized food safety compliance with automated temperature monitoring.',
    },
    {
      title: 'Senior Living Industry Page',
      url: 'https://checkitv6.com/industries/senior-living',
      source: 'checkitv6',
      verticalTags: ['senior-living'],
      topicTags: ['industry_insight', 'product_update'],
      description: 'Automated compliance monitoring for senior living communities — temperature, safety checks, and audit trails.',
    },
    {
      title: 'Food Retail Industry Page',
      url: 'https://checkitv6.com/industries/food-retail',
      source: 'checkitv6',
      verticalTags: ['food-retail'],
      topicTags: ['industry_insight', 'product_update'],
      description: 'Digital food safety and temperature monitoring for grocery and food retail operations.',
    },
    {
      title: 'Food Facilities Industry Page',
      url: 'https://checkitv6.com/industries/food-facilities',
      source: 'checkitv6',
      verticalTags: ['food-facilities'],
      topicTags: ['industry_insight', 'product_update'],
      description: 'Automated HACCP compliance and temperature monitoring for commercial kitchens and food production.',
    },
    {
      title: 'Platform Overview',
      url: 'https://checkitv6.com/platform',
      source: 'checkitv6',
      verticalTags: ['senior-living', 'food-retail', 'food-facilities', 'medical', 'operations'],
      topicTags: ['product_update', 'temperature_automation', 'asset_intelligence'],
      description: 'Checkit platform overview — sensors, automated monitoring, digital checklists, reporting, and Asset Intelligence.',
    },
    {
      title: 'Paper to Digital ROI Calculator',
      url: 'https://checkitv6.com/tools/paper-to-digital',
      source: 'checkitv6',
      verticalTags: ['senior-living', 'food-retail', 'food-facilities', 'medical', 'operations'],
      topicTags: ['roi', 'social_proof'],
      description: 'Calculate ROI from switching paper-based compliance to digital automated monitoring.',
    },
    {
      title: 'Checkit Blog',
      url: 'https://checkitv6.com/blog',
      source: 'checkit_net_blog',
      verticalTags: ['senior-living', 'food-retail', 'food-facilities', 'medical', 'operations'],
      topicTags: ['blog', 'industry_insight'],
      description: 'Checkit blog — industry insights, best practices, and product updates.',
    },
  ];

  for (const c of content) {
    await addNurtureContent(c.title, c.url, c.source, c.verticalTags, c.topicTags, c.description);
  }
}
