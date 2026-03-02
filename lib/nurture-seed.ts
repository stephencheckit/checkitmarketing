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
    'New from Checkit: asset intelligence and predictive monitoring',
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
→ https://www.checkit.net/blog/

Thanks for reading,
The Checkit Team`,
    ['demo_request']
  );
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
      description: 'Checkit platform overview — sensors, automated monitoring, digital checklists, reporting, and asset intelligence.',
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
      title: 'Temperature Monitoring Solutions',
      url: 'https://www.checkit.net/solutions/automated-monitoring/',
      source: 'checkit_net',
      verticalTags: ['senior-living', 'food-retail', 'food-facilities', 'medical', 'operations'],
      topicTags: ['temperature_automation', 'product_update'],
      description: 'Automated temperature monitoring with wireless sensors — real-time alerts, compliance records, predictive insights.',
    },
    {
      title: 'Digital Checklists & Workflows',
      url: 'https://www.checkit.net/solutions/digital-checklists/',
      source: 'checkit_net',
      verticalTags: ['senior-living', 'food-retail', 'food-facilities', 'operations'],
      topicTags: ['product_update', 'asset_intelligence'],
      description: 'Replace paper checklists with digital workflows — photo evidence, escalation rules, and full audit trails.',
    },
    {
      title: 'Checkit Blog',
      url: 'https://www.checkit.net/blog/',
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
