import { sql } from './db';
import { createNurtureTrack, createNurtureStep, addNurtureContent } from './nurture-db';

export async function seedDefaultTrack(): Promise<number> {
  const existing = await sql`SELECT id FROM nurture_tracks WHERE name = 'Closed-Lost Generic' LIMIT 1`;
  if (existing.length > 0) return existing[0].id;

  const track = await createNurtureTrack(
    'Closed-Lost Generic',
    'Re-engagement nurture track for closed-lost deals. 6 emails over 90 days covering value stories, product updates, and social proof.'
  );

  await createNurtureStep(track.id, 1, 3,
    'Thinking of you, {{contact_name}}',
    `Hi {{contact_name}},

It's been a little while since we last connected about operational compliance at {{company_name}}. I wanted to reach out because I've been thinking about some of the challenges you mentioned.

{{personalized_context}}

A lot has been happening on our end, and I think some of it might be relevant to what you're working on. No pressure — just wanted to keep the line open.

If you'd ever like to revisit the conversation, I'm here.

Best,
{{sender_name}}
Checkit`,
    ['account_context']
  );

  await createNurtureStep(track.id, 2, 10,
    '{{company_name}} — a quick story I thought you\'d find interesting',
    `Hi {{contact_name}},

I wanted to share a quick customer story that reminded me of {{company_name}}.

{{content_block}}

The results have been significant — reduced compliance prep time, fewer manual errors, and better visibility across sites.

Thought it might spark some ideas for you. Happy to walk through the details if you're curious.

{{sender_name}}
Checkit`,
    ['case_study']
  );

  await createNurtureStep(track.id, 3, 21,
    'What\'s new at Checkit — thought you should know',
    `Hi {{contact_name}},

Since we last spoke, we've been busy. A few things that might be on your radar:

{{content_block}}

These updates address some of the most common challenges we hear from operations and compliance teams — and they're directly applicable to organizations like {{company_name}}.

Would love to show you what's changed. A quick 15-minute call would do it.

{{sender_name}}
Checkit`,
    ['product_update', 'temperature_automation', 'asset_intelligence']
  );

  await createNurtureStep(track.id, 4, 45,
    'A trend worth watching in {{vertical}}',
    `Hi {{contact_name}},

I've been tracking some trends in the {{vertical}} space that I thought you'd find relevant.

{{content_block}}

Organizations that are getting ahead of this are seeing real operational advantages. Curious whether this is something {{company_name}} is thinking about.

Either way, I thought it was worth sharing.

{{sender_name}}
Checkit`,
    ['industry_insight', 'blog']
  );

  await createNurtureStep(track.id, 5, 75,
    'The numbers speak for themselves',
    `Hi {{contact_name}},

I wanted to share some results we've been seeing across our customer base:

{{content_block}}

These aren't theoretical — they're measured outcomes from organizations similar to {{company_name}}.

If ROI is a factor in revisiting this conversation, I'd be happy to run a quick analysis specific to your operation. No strings attached.

{{sender_name}}
Checkit`,
    ['roi', 'social_proof', 'case_study']
  );

  await createNurtureStep(track.id, 6, 90,
    'Door\'s always open, {{contact_name}}',
    `Hi {{contact_name}},

I'll keep this brief. I know timing is everything, and what didn't work before might make sense now.

If anything has changed at {{company_name}} — new compliance requirements, staffing shifts, equipment concerns — I'd love to pick up where we left off.

No pressure at all. But if you'd like to reconnect, you can grab time with our team here: https://checkitv6.com

Either way, I wish you and the team all the best.

{{sender_name}}
Checkit`,
    ['demo_request']
  );

  return track.id;
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
