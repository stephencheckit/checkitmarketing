'use client';

import { useState, useMemo } from 'react';
import { 
  Send,
  Mail,
  Phone,
  Building2,
  User,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Filter,
  Search,
  Pill,
  ShoppingCart,
  UtensilsCrossed,
  Droplets,
  Clock,
  Hash,
  MessageSquare
} from 'lucide-react';

// Types
interface EmailTemplate {
  id: string;
  subject: string;
  body: string;
  timing: string; // e.g., "Day 1", "Day 3", etc.
}

interface CallScript {
  id: string;
  name: string;
  opener: string;
  questions: string[];
  valueProps: string[];
  objectionHandlers: { objection: string; response: string }[];
  closeAttempt: string;
}

interface Sequence {
  id: string;
  name: string;
  vertical: string;
  persona: string;
  personaTitle: string;
  description: string;
  emails: EmailTemplate[];
  callScript: CallScript;
}

// Verticals
const verticals = [
  { id: 'all', name: 'All Verticals', icon: Building2 },
  { id: 'senior-living', name: 'Senior Living', icon: Building2 },
  { id: 'food-retail', name: 'Food Retail', icon: ShoppingCart },
  { id: 'food-facilities', name: 'Food Facilities', icon: UtensilsCrossed },
  { id: 'medical', name: 'Medical / Pharma', icon: Droplets },
  { id: 'nhs-pharmacies', name: 'NHS Pharmacies', icon: Pill },
];

// Personas
const personas = [
  { id: 'all', name: 'All Personas' },
  { id: 'ops-director', name: 'Operations Director' },
  { id: 'compliance-manager', name: 'Compliance Manager' },
  { id: 'facilities-manager', name: 'Facilities Manager' },
  { id: 'quality-manager', name: 'Quality Manager' },
  { id: 'regional-manager', name: 'Regional Manager' },
];

// Sequences Data
const sequences: Sequence[] = [
  // Senior Living - Operations Director
  {
    id: 'sl-ops-director',
    name: 'Senior Living - Ops Director',
    vertical: 'senior-living',
    persona: 'ops-director',
    personaTitle: 'VP/Director of Operations',
    description: 'Target: Multi-site senior living operators. Focus on compliance burden, visibility gaps, and operational efficiency.',
    emails: [
      {
        id: 'sl-ops-1',
        subject: 'Quick question about {{company}} temperature monitoring',
        body: `Hi {{first_name}},

I noticed {{company}} operates multiple senior living communities - are you still using paper logs for temperature monitoring and compliance checks?

We work with operators like Morningstar Senior Living who were spending 8+ hours/week per community on manual compliance documentation. After switching to automated monitoring, they cut that to under 1 hour while improving audit scores.

Worth a 15-minute call to see if this could help {{company}}?

Best,
{{sender_name}}`,
        timing: 'Day 1'
      },
      {
        id: 'sl-ops-2',
        subject: 'Re: Quick question about {{company}} temperature monitoring',
        body: `{{first_name}},

Following up - I realize you're probably busy with day-to-day operations.

Here's what I'm seeing with other senior living operators:
• 40% of paper records have errors or gaps (creates audit risk)
• Staff spend 8+ hours/week on manual temp logs
• Equipment failures aren't caught until it's too late

If any of this sounds familiar, I'd love to share how we're helping similar communities.

Would Thursday or Friday work for a quick call?

{{sender_name}}`,
        timing: 'Day 3'
      },
      {
        id: 'sl-ops-3',
        subject: 'Compliance audit coming up?',
        body: `Hi {{first_name}},

One more thought - if you have state inspections or compliance audits coming up, automated monitoring can be a game-changer.

Instead of scrambling to find paper records, everything is:
• Digitally timestamped
• Instantly searchable
• Complete with corrective action trails

Our customers typically see audit prep time drop by 50%+.

Happy to show you a quick demo if helpful. No pressure either way.

{{sender_name}}`,
        timing: 'Day 7'
      },
      {
        id: 'sl-ops-4',
        subject: 'Closing the loop',
        body: `{{first_name}},

I'll keep this brief - just wanted to close the loop.

If temperature monitoring and compliance isn't a priority right now, no worries at all. But if you'd like to see how operators like {{similar_company}} are handling this, I'm happy to set up a quick call.

Either way, I'll stop filling your inbox.

Best,
{{sender_name}}`,
        timing: 'Day 14'
      }
    ],
    callScript: {
      id: 'sl-ops-call',
      name: 'Senior Living Ops Director Discovery Call',
      opener: `Hi {{first_name}}, this is {{sender_name}} from Checkit. I sent you an email about temperature monitoring at {{company}}. Did you have a chance to see it? 

[If no]: No worries - the quick version is we help senior living operators automate their compliance monitoring. I noticed {{company}} has X communities - are you currently using paper logs for temperature checks?

[If yes]: Great - does that resonate with what you're seeing at {{company}}?`,
      questions: [
        'How are you currently handling temperature monitoring across your communities?',
        'What does your compliance documentation process look like today?',
        'How much time would you estimate your staff spends on manual temperature logs per week?',
        'When was your last state inspection? How did that go?',
        'If equipment fails overnight, how quickly do you typically find out?',
        'Are you seeing any consistency issues across different communities?'
      ],
      valueProps: [
        'Automated 24/7 monitoring with instant alerts - catch problems before they become incidents',
        'Digital compliance records with timestamps and audit trails - always inspection-ready',
        'Multi-site visibility from one dashboard - see all your communities at a glance',
        'Reduce staff time on manual checks by 80%+ - free them up for resident care'
      ],
      objectionHandlers: [
        {
          objection: 'We\'re happy with our current process',
          response: 'I understand. Can I ask - what would happen if your fridge failed at 2am tonight? How would you know, and how would that impact your compliance records?'
        },
        {
          objection: 'This sounds expensive',
          response: 'That\'s fair. The way our customers think about it: one equipment failure can cost $35K+ in spoiled medication/food plus compliance violations. Our monitoring typically pays for itself with the first incident prevented.'
        },
        {
          objection: 'We don\'t have time for a new system',
          response: 'Totally get it. Actually, that\'s exactly why customers come to us - they\'re spending too much time on manual compliance. Implementation is turnkey - we handle everything.'
        }
      ],
      closeAttempt: 'Based on what you\'ve shared, it sounds like {{pain_point}} is a real challenge. Would it make sense to schedule a 20-minute demo so you can see exactly how this would work for {{company}}?'
    }
  },
  // Senior Living - Compliance Manager
  {
    id: 'sl-compliance-mgr',
    name: 'Senior Living - Compliance Manager',
    vertical: 'senior-living',
    persona: 'compliance-manager',
    personaTitle: 'Compliance/Quality Manager',
    description: 'Target: Compliance professionals at senior living operators. Focus on audit readiness, documentation gaps, and regulatory requirements.',
    emails: [
      {
        id: 'sl-comp-1',
        subject: 'Question about {{company}} compliance documentation',
        body: `Hi {{first_name}},

Quick question - when state inspectors ask for your temperature logs and corrective action records, how long does it take to pull everything together?

We work with compliance managers at communities like {{similar_company}} who used to spend days prepping for audits. Now they pull complete, timestamped records in seconds.

If audit prep is eating up your time, I'd love to show you how automated monitoring could help.

Worth a quick call?

{{sender_name}}`,
        timing: 'Day 1'
      },
      {
        id: 'sl-comp-2',
        subject: 'Re: Question about {{company}} compliance documentation',
        body: `{{first_name}},

Following up on my note about compliance documentation.

I keep hearing the same challenges from compliance managers:
• Paper logs with missing signatures or gaps
• No way to prove continuous monitoring overnight
• Corrective actions documented inconsistently across shifts

Does any of this sound familiar at {{company}}?

If so, I can show you how digital monitoring creates bulletproof audit trails in about 15 minutes.

{{sender_name}}`,
        timing: 'Day 4'
      },
      {
        id: 'sl-comp-3',
        subject: '{{company}} compliance - one last thought',
        body: `Hi {{first_name}},

Last email on this - I know you're busy.

If you're dealing with:
✓ Inconsistent documentation across communities
✓ Audit anxiety before inspections
✓ Time wasted chasing down paper records

...our platform might be worth a look. 100% digital audit trail, automatic timestamps, and corrective action tracking.

Happy to do a quick demo, or I can send over a case study if that's easier.

{{sender_name}}`,
        timing: 'Day 10'
      }
    ],
    callScript: {
      id: 'sl-comp-call',
      name: 'Senior Living Compliance Manager Discovery Call',
      opener: `Hi {{first_name}}, this is {{sender_name}} from Checkit. I reached out about compliance documentation at {{company}}. 

I work with compliance managers at senior living communities who are looking to make their audit process more bulletproof. Is that something you're focused on right now?`,
      questions: [
        'Walk me through what happens when you have an upcoming state inspection - what does prep look like?',
        'How confident are you that your paper logs are complete and accurate?',
        'What happens when a staff member forgets to sign off on a temperature check?',
        'How do you track corrective actions when something goes out of range?',
        'Are you seeing consistency in documentation across different shifts?',
        'What would it mean for you to be able to pull any compliance record in seconds?'
      ],
      valueProps: [
        'Every temperature reading automatically logged with timestamp - no manual entry needed',
        'Corrective actions tracked digitally with photos, notes, and resolution timestamps',
        'Complete audit trail exportable in seconds - instant inspection readiness',
        'Alerts when readings are out of range so you can document the response in real-time'
      ],
      objectionHandlers: [
        {
          objection: 'Our inspectors are fine with paper logs',
          response: 'They may accept them, but paper logs can\'t prove continuous monitoring. If something happens at 2am and there\'s no documentation, that\'s a gap. Digital monitoring gives you evidence of everything, 24/7.'
        },
        {
          objection: 'Staff won\'t adopt new technology',
          response: 'Actually, staff love it because it reduces their workload. No more walking around with clipboards - alerts come to their phone, and they just tap to acknowledge. It\'s less work, not more.'
        },
        {
          objection: 'We need to involve IT',
          response: 'Totally understand. Our system is cloud-based and requires minimal IT involvement - wireless sensors that connect to cellular, no network integration needed. Happy to include your IT team in the demo.'
        }
      ],
      closeAttempt: 'It sounds like having airtight compliance documentation would make your life a lot easier. Would you be open to a 20-minute demo to see exactly what the audit trail looks like?'
    }
  },
  // Food Retail - Operations Director
  {
    id: 'fr-ops-director',
    name: 'Food Retail - Ops Director',
    vertical: 'food-retail',
    persona: 'ops-director',
    personaTitle: 'Operations Director',
    description: 'Target: Convenience store and food-to-go operations. Focus on food safety compliance, equipment failures, and multi-site visibility.',
    emails: [
      {
        id: 'fr-ops-1',
        subject: 'Food safety monitoring at {{company}}',
        body: `Hi {{first_name}},

Quick question - if a refrigeration unit fails at one of your stores tonight, how quickly would you know about it?

We work with food retailers like BP and John Lewis Partners who used to find out about equipment issues the next morning - after inventory was already compromised.

Now they get instant alerts and catch problems before food safety is impacted.

Would a 15-minute call be worth exploring this for {{company}}?

{{sender_name}}`,
        timing: 'Day 1'
      },
      {
        id: 'fr-ops-2',
        subject: 'Re: Food safety monitoring at {{company}}',
        body: `{{first_name}},

Following up - here's what I'm consistently hearing from food retail operators:

• Equipment failures discovered too late (average loss: $35K per incident)
• Inconsistent HACCP documentation across stores
• No real-time visibility into compliance status

If any of this resonates, I'd love to show you how automated monitoring solves these.

Would you have 15 minutes this week?

{{sender_name}}`,
        timing: 'Day 3'
      },
      {
        id: 'fr-ops-3',
        subject: 'Food safety compliance - closing the loop',
        body: `Hi {{first_name}},

I'll keep this short - if food safety monitoring isn't a priority right now, I understand.

But if you're dealing with:
• Compliance gaps across multiple locations
• Equipment that fails silently
• Staff time wasted on manual temperature logs

...it might be worth a quick conversation.

Either way, I'll stop emailing. Let me know if there's a better time to reconnect.

{{sender_name}}`,
        timing: 'Day 10'
      }
    ],
    callScript: {
      id: 'fr-ops-call',
      name: 'Food Retail Ops Director Discovery Call',
      opener: `Hi {{first_name}}, this is {{sender_name}} from Checkit. I sent you an email about food safety monitoring for {{company}}. Do you have a quick minute?

We help food retailers automate their temperature monitoring and HACCP compliance. I'm curious - how are you currently handling this across your locations?`,
      questions: [
        'How many locations are you responsible for?',
        'What does your current temperature monitoring process look like?',
        'When equipment fails, how quickly do you typically find out?',
        'What does HACCP compliance documentation look like today?',
        'How much inventory have you lost to equipment failures in the past year?',
        'If you could see compliance status across all your stores right now, how would that change things?'
      ],
      valueProps: [
        '24/7 automated monitoring with instant alerts - catch equipment failures in minutes, not hours',
        'Digital HACCP records that are always audit-ready - no more paper log gaps',
        'Multi-site dashboard showing compliance status at a glance',
        'Reduce food waste from equipment failures by catching issues early'
      ],
      objectionHandlers: [
        {
          objection: 'We already have temperature monitoring',
          response: 'Good to hear. Is it integrated with your compliance documentation? A lot of retailers have sensors but still do manual logs. Our system ties everything together - monitoring, alerts, and audit-ready records in one place.'
        },
        {
          objection: 'This would be hard to roll out across all stores',
          response: 'Actually, our deployment is designed for multi-site. Wireless sensors, cellular connectivity, no IT integration needed. We can typically get a store live in a day.'
        },
        {
          objection: 'We\'re focused on other priorities right now',
          response: 'Totally understand. Just curious - what would the cost be if you had a food safety incident at one of your stores next month? Most retailers find that automated monitoring pays for itself with the first prevented incident.'
        }
      ],
      closeAttempt: 'Based on what you\'ve shared about {{pain_point}}, it sounds like there\'s real value here. Would it make sense to schedule a demo so you can see exactly how this would work across your stores?'
    }
  },
  // Food Facilities - Operations Director
  {
    id: 'ff-ops-director',
    name: 'Food Facilities - Ops Director',
    vertical: 'food-facilities',
    persona: 'ops-director',
    personaTitle: 'Operations Director',
    description: 'Target: Stadiums, venues, event catering, and food service operations. Focus on high-volume compliance, event readiness, and multi-outlet visibility.',
    emails: [
      {
        id: 'ff-ops-1',
        subject: 'Food safety at {{company}} venues',
        body: `Hi {{first_name}},

Running food service across multiple outlets at a venue is challenging - especially keeping up with food safety compliance across all of them simultaneously.

We work with venue operators like OVG who needed better visibility into temperature compliance across dozens of outlets during events.

Now they have real-time dashboards showing every outlet's status, with instant alerts if anything goes out of range.

Would a 15-minute call be worth exploring this for {{company}}?

{{sender_name}}`,
        timing: 'Day 1'
      },
      {
        id: 'ff-ops-2',
        subject: 'Re: Food safety at {{company}} venues',
        body: `{{first_name}},

Following up - I wanted to share what venue operators typically tell us:

• Impossible to monitor all outlets in real-time during events
• Paper logs are incomplete or hard to verify
• One food safety incident can shut down multiple outlets

If managing compliance across multiple food outlets is a challenge, I'd love to show you how we're solving this.

15 minutes this week?

{{sender_name}}`,
        timing: 'Day 4'
      },
      {
        id: 'ff-ops-3',
        subject: 'Venue food safety - one more thought',
        body: `Hi {{first_name}},

Last note on this - if you have upcoming events where food safety compliance is critical, automated monitoring can be a game-changer.

Real-time visibility across every outlet, instant alerts, and complete digital audit trails.

Happy to do a quick demo before your next big event. Just let me know.

{{sender_name}}`,
        timing: 'Day 10'
      }
    ],
    callScript: {
      id: 'ff-ops-call',
      name: 'Food Facilities Ops Director Discovery Call',
      opener: `Hi {{first_name}}, this is {{sender_name}} from Checkit. I reached out about food safety monitoring at {{company}}. 

I work with venue and food service operators who are managing compliance across multiple outlets. Is that a challenge you're dealing with?`,
      questions: [
        'How many food outlets are you managing?',
        'During events, how do you currently monitor food safety across all outlets?',
        'What happens if something goes out of range at an outlet during an event?',
        'How do you handle documentation for health inspections?',
        'Have you ever had to shut down an outlet due to a food safety issue?',
        'If you could see real-time compliance status across every outlet right now, how would that change your operations?'
      ],
      valueProps: [
        'Real-time dashboard showing every outlet\'s temperature status at a glance',
        'Instant alerts if any unit goes out of range - catch issues before they escalate',
        'Digital compliance records for every outlet - audit-ready at all times',
        'One platform for all your locations - stadiums, arenas, convention centers'
      ],
      objectionHandlers: [
        {
          objection: 'We have staff checking temperatures',
          response: 'That\'s good for spot checks, but what happens between checks? Or during the busiest part of an event when staff are focused on serving? Automated monitoring gives you continuous coverage.'
        },
        {
          objection: 'Our venues have different setups',
          response: 'That\'s actually common. Our sensors are wireless and flexible - they work in permanent installations, temporary setups, even mobile food carts. We customize for each venue.'
        },
        {
          objection: 'We\'d need to involve multiple stakeholders',
          response: 'Absolutely - food safety touches a lot of teams. We\'re happy to do a demo with your operations, compliance, and facilities teams together. Who else should be in the conversation?'
        }
      ],
      closeAttempt: 'It sounds like having real-time visibility across all your outlets would be valuable, especially during events. Would you be open to a demo to see how this could work for {{company}}?'
    }
  },
  // Medical - Quality Manager
  {
    id: 'med-quality-mgr',
    name: 'Medical - Quality Manager',
    vertical: 'medical',
    persona: 'quality-manager',
    personaTitle: 'Quality/Compliance Manager',
    description: 'Target: Plasma centers, pharma, and labs. Focus on regulatory compliance (FDA, AABB), continuous monitoring requirements, and audit trails.',
    emails: [
      {
        id: 'med-qual-1',
        subject: 'Temperature monitoring compliance at {{company}}',
        body: `Hi {{first_name}},

Quick question - are you confident your current temperature monitoring would hold up under an FDA/AABB audit?

We work with plasma centers and labs like Octapharma and Grifols who needed continuous monitoring with complete audit trails to meet regulatory requirements.

Now they have automated, 24/7 monitoring with timestamped records that satisfy the most demanding audits.

Worth a 15-minute call to discuss?

{{sender_name}}`,
        timing: 'Day 1'
      },
      {
        id: 'med-qual-2',
        subject: 'Re: Temperature monitoring compliance at {{company}}',
        body: `{{first_name}},

Following up on temperature monitoring compliance.

Regulatory auditors are increasingly scrutinizing:
• Continuous monitoring vs. periodic spot checks
• Completeness of documentation
• Corrective action trails when excursions occur

If your current system has any gaps, I'd love to show you how we're helping similar facilities.

15 minutes this week?

{{sender_name}}`,
        timing: 'Day 4'
      },
      {
        id: 'med-qual-3',
        subject: 'Regulatory compliance - last thought',
        body: `Hi {{first_name}},

Last note - if you have FDA, AABB, or other regulatory audits coming up, now might be a good time to evaluate your monitoring setup.

Our platform provides:
✓ Continuous 24/7 monitoring (not just spot checks)
✓ Complete audit trails with timestamps
✓ Automated excursion documentation
✓ ISO 17025 / UKAS accredited calibration

Happy to do a demo or send over compliance documentation if helpful.

{{sender_name}}`,
        timing: 'Day 10'
      }
    ],
    callScript: {
      id: 'med-qual-call',
      name: 'Medical Quality Manager Discovery Call',
      opener: `Hi {{first_name}}, this is {{sender_name}} from Checkit. I reached out about temperature monitoring compliance at {{company}}.

We work with plasma centers and labs that need continuous monitoring to meet FDA, AABB, and other regulatory requirements. Is that something you're focused on?`,
      questions: [
        'What regulatory bodies do you need to satisfy? (FDA, AABB, CAP, etc.)',
        'How are you currently documenting continuous temperature monitoring?',
        'What happens when you have a temperature excursion? Walk me through your documentation process.',
        'When was your last regulatory audit? Were there any findings related to monitoring?',
        'How confident are you that your records show continuous monitoring, not just periodic checks?',
        'What would it mean for you to have bulletproof audit documentation?'
      ],
      valueProps: [
        'Continuous 24/7 monitoring that proves compliance around the clock',
        'Automatic excursion documentation with timestamps, alerts, and corrective action trails',
        'ISO 17025 / UKAS accredited calibration included - meets the highest regulatory standards',
        'Complete audit trails that satisfy FDA, AABB, CAP, and other regulatory requirements'
      ],
      objectionHandlers: [
        {
          objection: 'We already have monitoring systems',
          response: 'Good to hear. Is your system providing continuous monitoring with complete audit trails? A lot of facilities have basic monitoring but struggle to prove continuous compliance during audits.'
        },
        {
          objection: 'We need to validate any new system',
          response: 'Absolutely - validation is critical. We provide full validation documentation and our calibration is ISO 17025 / UKAS accredited. We\'ve been through this process with many regulated facilities.'
        },
        {
          objection: 'This would be a big change',
          response: 'I understand. The good news is our implementation is designed to minimize disruption. Wireless sensors, cloud-based platform, and we handle the calibration. Most facilities are up and running quickly.'
        }
      ],
      closeAttempt: 'Based on what you\'ve shared about your regulatory requirements, it sounds like continuous monitoring with complete audit trails is critical. Would it make sense to schedule a demo to see exactly how our compliance documentation works?'
    }
  },
  // NHS Pharmacies - Pharmacy Manager
  {
    id: 'nhs-pharmacy-mgr',
    name: 'NHS Pharmacies - Pharmacy Manager',
    vertical: 'nhs-pharmacies',
    persona: 'facilities-manager',
    personaTitle: 'Pharmacy Manager / Superintendent',
    description: 'Target: NHS pharmacy cold chain monitoring. Focus on CQC compliance, medication storage, and Peace of Mind subscription model.',
    emails: [
      {
        id: 'nhs-pharm-1',
        subject: 'Fridge monitoring at {{company}}',
        body: `Hi {{first_name}},

Quick question - what happens at your pharmacy if the medication fridge fails overnight?

We work with NHS pharmacies who needed reliable cold chain monitoring to protect medication and meet CQC requirements.

Our Connected Automated Monitoring (CAM+) includes everything - sensors, calibration, 24/7 alerts, and support - in one annual subscription.

Worth a quick call to see if this could help {{company}}?

{{sender_name}}`,
        timing: 'Day 1'
      },
      {
        id: 'nhs-pharm-2',
        subject: 'Re: Fridge monitoring at {{company}}',
        body: `{{first_name}},

Following up on medication fridge monitoring.

I keep hearing the same concerns from pharmacy managers:
• No overnight monitoring - issues discovered the next morning
• Manual temp logs that are easy to forget
• Uncertainty about whether fridges are actually compliant

If any of this sounds familiar, I'd love to show you our CAM+ solution.

It's a simple annual subscription - hardware, calibration, 24/7 monitoring, and support all included. No capital investment.

15 minutes to discuss?

{{sender_name}}`,
        timing: 'Day 4'
      },
      {
        id: 'nhs-pharm-3',
        subject: 'CQC compliance - one more thought',
        body: `Hi {{first_name}},

Last note - if CQC compliance or medication cold chain is on your radar, automated monitoring might be worth a look.

Our CAM+ subscription includes:
✓ 24/7/365 temperature monitoring
✓ Instant alerts if fridge goes out of range
✓ Annual calibration included
✓ Peace of mind pricing - one annual fee, no surprises

Happy to send more info or set up a quick demo.

{{sender_name}}`,
        timing: 'Day 10'
      }
    ],
    callScript: {
      id: 'nhs-pharm-call',
      name: 'NHS Pharmacy Manager Discovery Call',
      opener: `Hi {{first_name}}, this is {{sender_name}} from Checkit. I reached out about medication fridge monitoring for your pharmacy.

We provide connected automated monitoring for NHS pharmacies - it's called CAM+. Are you currently using any kind of temperature monitoring system?`,
      questions: [
        'How are you currently monitoring your medication fridges?',
        'What happens if a fridge fails overnight or over a weekend?',
        'How do you document temperature compliance for CQC?',
        'Have you ever had to dispose of medication due to a temperature issue?',
        'What would it mean to have 24/7 monitoring with instant alerts?'
      ],
      valueProps: [
        '24/7/365 monitoring with instant alerts - know immediately if something goes wrong',
        'Peace of Mind subscription - hardware, calibration, support all included',
        'CQC-ready compliance records automatically generated',
        'Protect medication inventory from undetected fridge failures'
      ],
      objectionHandlers: [
        {
          objection: 'We check the fridge every day',
          response: 'That\'s good practice, but what about overnight or weekends? If the fridge fails at 11pm, you won\'t know until the next morning. Our system alerts you immediately so you can take action.'
        },
        {
          objection: 'We can\'t afford another subscription',
          response: 'I understand budgets are tight. Consider this - one fridge failure with medication spoilage can cost thousands. Our subscription is designed to pay for itself by preventing that first incident.'
        },
        {
          objection: 'We\'d need to check with the area manager',
          response: 'Absolutely. Would it help if I sent over some information you could share with them? Or I\'m happy to set up a call with both of you.'
        }
      ],
      closeAttempt: 'It sounds like having peace of mind about your medication storage would be valuable. Would you be open to a quick demo to see exactly how CAM+ works?'
    }
  }
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 px-2 py-1 text-xs bg-surface-elevated text-muted hover:text-foreground rounded transition-colors"
    >
      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function EmailCard({ email, index }: { email: EmailTemplate; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-elevated/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-medium">
            {index + 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">{email.timing}</span>
            </div>
            <p className="font-medium text-foreground">{email.subject}</p>
          </div>
        </div>
        {expanded ? <ChevronDown className="w-4 h-4 text-muted" /> : <ChevronRight className="w-4 h-4 text-muted" />}
      </button>
      
      {expanded && (
        <div className="px-4 pb-4 border-t border-border">
          <div className="flex justify-end mt-2 mb-2">
            <CopyButton text={`Subject: ${email.subject}\n\n${email.body}`} />
          </div>
          <div className="bg-surface-elevated rounded-lg p-4">
            <p className="text-xs text-muted mb-2">Subject: {email.subject}</p>
            <pre className="text-sm text-foreground whitespace-pre-wrap font-sans">{email.body}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

function CallScriptCard({ script }: { script: CallScript }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-elevated/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <p className="font-medium text-foreground">Call Script</p>
            <p className="text-xs text-muted">Discovery call framework</p>
          </div>
        </div>
        {expanded ? <ChevronDown className="w-4 h-4 text-muted" /> : <ChevronRight className="w-4 h-4 text-muted" />}
      </button>
      
      {expanded && (
        <div className="px-4 pb-4 border-t border-border space-y-4">
          {/* Opener */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-accent" />
              Opener
            </h4>
            <div className="bg-surface-elevated rounded-lg p-3">
              <pre className="text-sm text-foreground whitespace-pre-wrap font-sans">{script.opener}</pre>
            </div>
          </div>

          {/* Discovery Questions */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Discovery Questions</h4>
            <ul className="space-y-2">
              {script.questions.map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted">
                  <span className="text-accent font-medium">{i + 1}.</span>
                  {q}
                </li>
              ))}
            </ul>
          </div>

          {/* Value Props */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Value Props to Weave In</h4>
            <ul className="space-y-1">
              {script.valueProps.map((vp, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted">
                  <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                  {vp}
                </li>
              ))}
            </ul>
          </div>

          {/* Objection Handlers */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Objection Handlers</h4>
            <div className="space-y-3">
              {script.objectionHandlers.map((oh, i) => (
                <div key={i} className="bg-surface-elevated rounded-lg p-3">
                  <p className="text-sm text-red-400 font-medium mb-1">"{oh.objection}"</p>
                  <p className="text-sm text-foreground">{oh.response}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Close */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Close Attempt</h4>
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
              <p className="text-sm text-foreground">{script.closeAttempt}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SequenceCard({ sequence }: { sequence: Sequence }) {
  const [expanded, setExpanded] = useState(false);
  const verticalInfo = verticals.find(v => v.id === sequence.vertical);
  const Icon = verticalInfo?.icon || Building2;

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left hover:bg-surface-elevated/50 transition-colors"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
              <Icon className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{sequence.name}</h3>
              <p className="text-sm text-accent mt-0.5">{sequence.personaTitle}</p>
              <p className="text-sm text-muted mt-1">{sequence.description}</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1 text-xs text-muted">
                  <Mail className="w-3 h-3" />
                  {sequence.emails.length} emails
                </div>
                <div className="flex items-center gap-1 text-xs text-muted">
                  <Phone className="w-3 h-3" />
                  1 call script
                </div>
              </div>
            </div>
          </div>
          {expanded ? <ChevronDown className="w-5 h-5 text-muted" /> : <ChevronRight className="w-5 h-5 text-muted" />}
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-border">
          {/* Email Sequence */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-muted mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Sequence
            </h4>
            <div className="space-y-2">
              {sequence.emails.map((email, i) => (
                <EmailCard key={email.id} email={email} index={i} />
              ))}
            </div>
          </div>

          {/* Call Script */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-muted mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Discovery Call
            </h4>
            <CallScriptCard script={sequence.callScript} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function OutboundPage() {
  const [selectedVertical, setSelectedVertical] = useState('all');
  const [selectedPersona, setSelectedPersona] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSequences = useMemo(() => {
    return sequences.filter(seq => {
      const matchesVertical = selectedVertical === 'all' || seq.vertical === selectedVertical;
      const matchesPersona = selectedPersona === 'all' || seq.persona === selectedPersona;
      const matchesSearch = !searchQuery || 
        seq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seq.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seq.personaTitle.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesVertical && matchesPersona && matchesSearch;
    });
  }, [selectedVertical, selectedPersona, searchQuery]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Send className="w-7 h-7" style={{ stroke: 'url(#icon-gradient)' }} />
            Outbound Sequences
          </h1>
          <p className="text-sm text-muted mt-1">
            Cold email sequences and call scripts by vertical and persona
          </p>
        </div>

        {/* Filters */}
        <div className="bg-surface border border-border rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  placeholder="Search sequences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-surface-elevated border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* Vertical Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted" />
              <select
                value={selectedVertical}
                onChange={(e) => setSelectedVertical(e.target.value)}
                className="px-3 py-2 bg-surface-elevated border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
              >
                {verticals.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            {/* Persona Filter */}
            <div>
              <select
                value={selectedPersona}
                onChange={(e) => setSelectedPersona(e.target.value)}
                className="px-3 py-2 bg-surface-elevated border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
              >
                {personas.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm">
              <Hash className="w-4 h-4 text-accent" />
              <span className="text-muted">{filteredSequences.length} sequences</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-accent" />
              <span className="text-muted">{filteredSequences.reduce((sum, s) => sum + s.emails.length, 0)} total emails</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-accent" />
              <span className="text-muted">{filteredSequences.length} call scripts</span>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 mb-6">
          <h3 className="font-medium text-foreground mb-2">Tips for Using These Sequences</h3>
          <ul className="text-sm text-muted space-y-1">
            <li>• <strong>Personalize</strong>: Replace merge fields ({"{{company}}"}, {"{{first_name}}"}, etc.) with actual values</li>
            <li>• <strong>Research</strong>: Find something specific about the company to mention in the first email</li>
            <li>• <strong>Timing</strong>: Space emails according to the suggested timing (Day 1, Day 3, etc.)</li>
            <li>• <strong>Call scripts</strong>: Use as a framework, not a word-for-word script</li>
          </ul>
        </div>

        {/* Sequences */}
        <div className="space-y-4">
          {filteredSequences.length > 0 ? (
            filteredSequences.map(seq => (
              <SequenceCard key={seq.id} sequence={seq} />
            ))
          ) : (
            <div className="bg-surface border border-border rounded-xl p-8 text-center">
              <Mail className="w-12 h-12 mx-auto text-muted/30 mb-4" />
              <p className="text-muted">No sequences match your filters</p>
              <button
                onClick={() => {
                  setSelectedVertical('all');
                  setSelectedPersona('all');
                  setSearchQuery('');
                }}
                className="mt-2 text-sm text-accent hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
