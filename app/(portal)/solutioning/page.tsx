'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Presentation, 
  ChevronDown, 
  ChevronRight,
  Monitor, 
  MessageCircle, 
  CheckCircle, 
  AlertTriangle,
  Target,
  Users,
  Lightbulb,
  FileText,
  Clock,
  ArrowRight,
  Sparkles,
  Copy,
  CheckCircle2
} from 'lucide-react';
import ContributionModal from '@/components/ContributionModal';

interface SolutioningItem {
  id: string;
  title: string;
  description: string;
  details?: string[];
  tips?: string[];
  pitfalls?: string[];
}

interface SolutioningSection {
  id: string;
  name: string;
  icon: typeof Monitor;
  color: string;
  bgColor: string;
  description: string;
  items: SolutioningItem[];
}

const solutioningSections: SolutioningSection[] = [
  {
    id: 'demo-prep',
    name: 'Demo Preparation',
    icon: FileText,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    description: 'Before the demo - research and customization',
    items: [
      {
        id: 'dp1',
        title: 'Review Discovery Notes',
        description: 'Before any demo, revisit your discovery notes to personalize the presentation.',
        details: [
          'Identify their top 3 pain points from discovery',
          'Note specific metrics or numbers they mentioned',
          'Understand their current state and what they\'re comparing against',
          'Know who will be in the room and their roles'
        ],
        tips: [
          'Use their exact words when describing problems',
          'Prepare to address any objections that surfaced',
          'Have relevant case studies ready for their industry'
        ]
      },
      {
        id: 'dp2',
        title: 'Customize the Demo Environment',
        description: 'Tailor the demo to look and feel like their world.',
        details: [
          'Set up sample data matching their use case (locations, teams, assets)',
          'Configure alerts/rules relevant to their industry',
          'Prepare reports showing metrics they care about',
          'Have mobile app ready if relevant to their workflow'
        ],
        tips: [
          'Never demo with generic "Sample Company" data',
          'Pre-stage any features you know they\'ll need',
          'Test everything before the call - nothing should break live'
        ]
      },
      {
        id: 'dp3',
        title: 'Plan the Demo Flow',
        description: 'Structure the demo around their priorities, not your feature list.',
        details: [
          'Lead with their #1 pain point - show the solution first',
          'Build a "day in the life" story using their personas',
          'Plan transitions: what -> so what -> now what',
          'Leave time for questions (50% demo, 50% discussion)'
        ],
        pitfalls: [
          'Don\'t do a feature tour - that\'s boring and irrelevant',
          'Don\'t show everything - focus on what matters to them',
          'Don\'t rush through - let impact land'
        ]
      }
    ]
  },
  {
    id: 'demo-delivery',
    name: 'Demo Delivery',
    icon: Monitor,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    description: 'Executing a compelling, personalized demo',
    items: [
      {
        id: 'dd1',
        title: 'Open with Confirmation',
        description: 'Confirm understanding before you start showing anything.',
        details: [
          '"Based on our last conversation, I understand your top priorities are... Is that still accurate?"',
          '"Before I show you anything, any changes since we last spoke?"',
          '"Who\'s new to the call? Quick intro of what we discussed..."'
        ],
        tips: [
          'This shows you listened and gives permission to proceed',
          'Adjust the demo on the fly if priorities changed',
          'Get new stakeholders up to speed quickly'
        ]
      },
      {
        id: 'dd2',
        title: 'The "Tell-Show-Tell" Framework',
        description: 'Structure each feature demonstration for maximum impact.',
        details: [
          'TELL: "You mentioned that finding out about temperature issues hours later was costing you product..."',
          'SHOW: "Here\'s how Checkit alerts you in real-time..." [demonstrate]',
          'TELL: "So instead of discovering problems the next morning, you\'re notified instantly - meaning you can save that product."'
        ],
        tips: [
          'Always connect back to THEIR problem, not our feature',
          'Pause after showing impact - let it sink in',
          'Ask "Does that address what you were looking for?" after each section'
        ]
      },
      {
        id: 'dd3',
        title: 'Involve the Audience',
        description: 'A demo should be a conversation, not a presentation.',
        details: [
          'Ask questions throughout: "How does that compare to what you do today?"',
          'Invite them to try: "Want to click around? I\'ll hand you control..."',
          'Address stakeholders by name: "Sarah, from an ops perspective..."'
        ],
        pitfalls: [
          'Don\'t talk for 30 minutes straight',
          'Don\'t assume silence means agreement',
          'Don\'t ignore the quiet stakeholder - ask them directly'
        ]
      },
      {
        id: 'dd4',
        title: 'Handle Questions and Objections',
        description: 'Questions are buying signals. Objections are opportunities.',
        details: [
          'When asked "Can it do X?" - answer, then ask "Is that important to you? Why?"',
          'For concerns, acknowledge then address: "That\'s a fair point. Here\'s how our customers handle that..."',
          'If you don\'t know, say so: "Good question - let me get you a definitive answer on that."'
        ],
        tips: [
          'Write down every question - follow up thoroughly',
          'Objections often reveal what they need to feel confident',
          'Never dismiss a concern or get defensive'
        ]
      }
    ]
  },
  {
    id: 'stakeholder-engagement',
    name: 'Stakeholder Engagement',
    icon: Users,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    description: 'Managing multiple buyers and influencers',
    items: [
      {
        id: 'se1',
        title: 'Map the Buying Committee',
        description: 'Understand who influences and who decides.',
        details: [
          'Champion: Who brought us in? Who\'s fighting for us internally?',
          'Economic Buyer: Who controls the budget? What do they care about?',
          'Technical Buyer: Who vets the solution? What\'s their checklist?',
          'End Users: Who will use it daily? What makes their lives easier?',
          'Blocker: Who might say no? What would scare them?'
        ],
        tips: [
          'Ask your champion: "Who else needs to be involved?"',
          'Understand each person\'s success metrics',
          'Never assume one title = one role'
        ]
      },
      {
        id: 'se2',
        title: 'Executive Conversations',
        description: 'When presenting to leadership, adjust your approach.',
        details: [
          'Lead with business outcomes, not features',
          'Quantify everything: ROI, time savings, risk reduction',
          'Keep it high-level - they don\'t need to see every button',
          'Respect their time - be prepared to compress if needed'
        ],
        tips: [
          'Have a 5-minute version of every demo ready',
          'Know their strategic initiatives and tie to them',
          'Bring a clear ask: what decision do you need from them?'
        ],
        pitfalls: [
          'Don\'t get too deep in the weeds',
          'Don\'t talk only to the exec - include the team',
          'Don\'t leave without clear next steps'
        ]
      },
      {
        id: 'se3',
        title: 'Multi-Threaded Engagement',
        description: 'Build relationships across the organization.',
        details: [
          'Connect with multiple stakeholders, not just one champion',
          'Schedule separate sessions for different audiences if needed',
          'Get introductions to other departments who might benefit',
          'Send personalized follow-ups to each stakeholder'
        ],
        tips: [
          'If your single champion leaves, deal often dies',
          'Different stakeholders need different value messages',
          'The broader your support, the stronger the deal'
        ]
      }
    ]
  },
  {
    id: 'next-steps',
    name: 'Securing Next Steps',
    icon: ArrowRight,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    description: 'Moving the deal forward with momentum',
    items: [
      {
        id: 'ns1',
        title: 'Close Every Meeting with Action',
        description: 'Never end a call without a concrete next step.',
        details: [
          '"Based on what we\'ve seen today, what would be a good next step?"',
          '"Who else should we include in the next conversation?"',
          '"What information would help you move forward?"',
          'Schedule the next meeting before you hang up'
        ],
        pitfalls: [
          'Don\'t accept "We\'ll get back to you"',
          'Don\'t leave timing vague - get a specific date',
          'Don\'t end without understanding what happens next internally'
        ]
      },
      {
        id: 'ns2',
        title: 'Trial / Pilot Structuring',
        description: 'If they want to "try it first", structure it for success.',
        details: [
          'Define success criteria upfront: what does "it works" mean?',
          'Set a timeline with check-in milestones',
          'Identify who will be involved and ensure they\'re committed',
          'Agree on what happens after a successful trial'
        ],
        tips: [
          'Trials without clear criteria become endless',
          'Free trials often signal low commitment - charge for pilots',
          'Regular check-ins keep momentum and surface issues'
        ]
      },
      {
        id: 'ns3',
        title: 'Follow-Up Excellence',
        description: 'Your follow-up is as important as the demo itself.',
        details: [
          'Send recap within 24 hours: what we discussed, what we agreed, next steps',
          'Include relevant resources: case studies, ROI calculator, proposal',
          'Personalize for each stakeholder - reference their specific concerns',
          'Set a calendar reminder for promised follow-ups'
        ],
        tips: [
          'Use their language in the recap',
          'Make it easy to forward - your champion will share it',
          'If you promised something, deliver it fast'
        ]
      }
    ]
  },
  {
    id: 'proof-points',
    name: 'Proof & Validation',
    icon: Sparkles,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    description: 'Providing evidence that builds confidence',
    items: [
      {
        id: 'pp1',
        title: 'Customer References',
        description: 'Real customers are your most powerful proof.',
        details: [
          'Offer reference calls with similar customers',
          'Share case studies from their industry',
          'Provide logos of recognizable brands using Checkit',
          'If possible, arrange site visits to see it in action'
        ],
        tips: [
          'Match references to their specific concerns',
          'Prep your reference customer on what to emphasize',
          'Follow up after reference calls to address any new questions'
        ]
      },
      {
        id: 'pp2',
        title: 'ROI and Business Case',
        description: 'Help them build the internal justification.',
        details: [
          'Provide ROI calculator or help them build one',
          'Quantify: time saved, losses prevented, efficiency gains',
          'Show payback period and total cost of ownership',
          'Offer to present directly to their finance team'
        ],
        tips: [
          'Use their numbers, not industry averages when possible',
          'Include both hard ROI and soft benefits',
          'Make it easy for them to present internally'
        ]
      },
      {
        id: 'pp3',
        title: 'Technical Validation',
        description: 'Address technical concerns proactively.',
        details: [
          'Provide security documentation and compliance certifications',
          'Share integration capabilities and API documentation',
          'Offer technical deep-dive sessions for IT stakeholders',
          'Address data privacy, hosting, and uptime SLAs'
        ],
        tips: [
          'Technical blockers can kill deals late - surface them early',
          'Involve your technical resources when needed',
          'Make compliance docs easy to share with their security team'
        ]
      }
    ]
  }
];

export default function SolutioningPage() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['demo-prep']));
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [showContribution, setShowContribution] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const copyText = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Presentation className="w-7 h-7 text-accent" />
            Solutioning
          </h1>
          <p className="text-sm text-muted mt-1">
            Post-discovery: demos, stakeholder engagement, and moving deals forward.
          </p>
        </div>
        <button
          onClick={() => setShowContribution(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors text-sm font-medium shrink-0"
        >
          <Lightbulb className="w-4 h-4" />
          Add Insight
        </button>
      </div>

      {/* Sales stage navigator */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/discovery" className="px-3 py-1 bg-surface-elevated text-muted rounded-lg hover:text-foreground hover:bg-surface transition-colors">
          Discovery
        </Link>
        <ArrowRight className="w-4 h-4 text-muted" />
        <span className="px-3 py-1 bg-accent text-white rounded-lg font-medium">Solutioning</span>
        <ArrowRight className="w-4 h-4 text-muted" />
        <Link href="/closing" className="px-3 py-1 bg-surface-elevated text-muted rounded-lg hover:text-foreground hover:bg-surface transition-colors">
          Closing
        </Link>
      </div>

      {/* Key principle */}
      <div className="bg-accent/10 border border-accent/30 rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center shrink-0">
            <Target className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-accent mb-1">Demos should feel like consultations, not presentations</h3>
            <p className="text-sm text-foreground">
              Your demo isn&apos;t about showing features - it&apos;s about showing them their future. 
              Every screen should answer &quot;how does this solve MY problem?&quot;
            </p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {solutioningSections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSections.has(section.id);

          return (
            <div key={section.id} className="bg-surface border border-border rounded-xl overflow-hidden">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-surface-elevated/50 transition-colors"
              >
                <div className={`w-10 h-10 ${section.bgColor} rounded-lg flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${section.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className={`font-semibold ${section.color}`}>{section.name}</h2>
                  <p className="text-sm text-muted">{section.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">{section.items.length} items</span>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-muted" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted" />
                  )}
                </div>
              </button>

              {/* Section Content */}
              {isExpanded && (
                <div className="border-t border-border">
                  {section.items.map((item, idx) => {
                    const isItemExpanded = expandedItems.has(item.id);
                    
                    return (
                      <div 
                        key={item.id}
                        className={`${idx > 0 ? 'border-t border-border/50' : ''}`}
                      >
                        <button
                          onClick={() => toggleItem(item.id)}
                          className="w-full flex items-start gap-3 p-4 text-left hover:bg-background/50 transition-colors"
                        >
                          <span className="text-xs text-muted font-mono mt-1">{idx + 1}.</span>
                          {isItemExpanded ? (
                            <ChevronDown className="w-4 h-4 text-muted mt-1 shrink-0" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-muted mt-1 shrink-0" />
                          )}
                          <div className="flex-1">
                            <h3 className="font-medium text-foreground">{item.title}</h3>
                            <p className="text-sm text-muted mt-0.5">{item.description}</p>
                          </div>
                        </button>

                        {isItemExpanded && (
                          <div className="px-4 pb-4 pl-14 space-y-4">
                            {/* Details */}
                            {item.details && (
                              <div>
                                <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                                  Key Actions
                                </h4>
                                <ul className="space-y-2">
                                  {item.details.map((detail, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                      <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                                      <span className="text-foreground">{detail}</span>
                                      {detail.startsWith('"') && (
                                        <button
                                          onClick={() => copyText(detail.replace(/"/g, ''), `${item.id}-${i}`)}
                                          className="shrink-0 p-1 text-muted hover:text-foreground transition-colors"
                                        >
                                          {copiedId === `${item.id}-${i}` ? (
                                            <CheckCircle2 className="w-3 h-3 text-success" />
                                          ) : (
                                            <Copy className="w-3 h-3" />
                                          )}
                                        </button>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Tips */}
                            {item.tips && (
                              <div>
                                <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                                  Pro Tips
                                </h4>
                                <ul className="space-y-1.5">
                                  {item.tips.map((tip, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                      <Sparkles className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                                      <span className="text-foreground">{tip}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Pitfalls */}
                            {item.pitfalls && (
                              <div>
                                <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                                  Avoid These Pitfalls
                                </h4>
                                <ul className="space-y-1.5">
                                  {item.pitfalls.map((pitfall, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                      <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                                      <span className="text-foreground">{pitfall}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick checklist */}
      <div className="bg-surface border border-border rounded-xl p-6 mt-8">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-accent" />
          Pre-Demo Checklist
        </h2>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            'Reviewed discovery notes and pain points',
            'Demo environment customized with their data',
            'Tested all features I plan to show',
            'Know who\'s attending and their roles',
            'Prepared relevant case studies',
            'Have ROI/business case ready if needed',
            'Calendar invite with clear agenda sent',
            'Follow-up email template drafted'
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-5 h-5 border border-border rounded flex items-center justify-center shrink-0">
                <CheckCircle className="w-3 h-3 text-muted" />
              </div>
              <span className="text-sm text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contribution Modal */}
      <ContributionModal
        isOpen={showContribution}
        onClose={() => setShowContribution(false)}
        targetType="positioning"
        targetSection="solutioning"
        sectionLabel="Solutioning"
      />
    </div>
  );
}
