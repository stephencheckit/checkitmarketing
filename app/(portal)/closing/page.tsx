'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Handshake, 
  ChevronDown, 
  ChevronRight,
  FileSignature, 
  DollarSign, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Lightbulb,
  Calendar,
  Shield,
  Scale,
  ArrowRight,
  Clock,
  Target,
  Copy,
  CheckCircle2
} from 'lucide-react';
import ContributionModal from '@/components/ContributionModal';

interface ClosingItem {
  id: string;
  title: string;
  description: string;
  details?: string[];
  phrases?: string[];
  warnings?: string[];
}

interface ClosingSection {
  id: string;
  name: string;
  icon: typeof Handshake;
  color: string;
  bgColor: string;
  description: string;
  items: ClosingItem[];
}

const closingSections: ClosingSection[] = [
  {
    id: 'negotiation',
    name: 'Negotiation Strategy',
    icon: Scale,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    description: 'Handling pricing, terms, and deal structure',
    items: [
      {
        id: 'n1',
        title: 'Understand Their Constraints',
        description: 'Know what flexibility they have before negotiating.',
        details: [
          'Budget cycles: When does their fiscal year end? Is this budgeted?',
          'Authority: Who can approve this spend? What\'s their limit?',
          'Timeline: Is there urgency? What happens if this slips?',
          'Alternatives: What are they comparing us to?'
        ],
        phrases: [
          '"Help me understand your budget process - is this allocated or do we need to make a case for funding?"',
          '"What does the approval process look like for a purchase like this?"',
          '"Is there a deadline driving your timeline?"'
        ]
      },
      {
        id: 'n2',
        title: 'Anchor on Value, Not Price',
        description: 'Always tie price discussions back to business value.',
        details: [
          'Restate the problem cost before discussing solution cost',
          'Frame as investment with return, not expense',
          'Compare to cost of status quo or alternatives',
          'Use their numbers: "You mentioned losing $X per incident..."'
        ],
        phrases: [
          '"Before we discuss pricing, let\'s make sure we agree on the value. You mentioned saving 10 hours per week - at your labor costs, that\'s $X per year..."',
          '"The question isn\'t whether $X is a lot - it\'s whether preventing $Y in losses is worth $X."'
        ],
        warnings: [
          'Never lead with price - establish value first',
          'Don\'t discount without getting something in return',
          'Avoid percentage discounts - use specific dollar amounts'
        ]
      },
      {
        id: 'n3',
        title: 'Negotiation Tactics',
        description: 'How to handle common negotiation scenarios.',
        details: [
          'If asked for discount: "What would you need to see to move forward at this price?"',
          'Trade, don\'t give: Multi-year commit for better rate, faster decision for added value',
          'Create urgency: End of quarter, implementation timeline, pilot availability',
          'Use silence: After stating price, wait. Let them respond first.'
        ],
        phrases: [
          '"I can look at adjusting the price if we can commit to a multi-year agreement."',
          '"If we can get this signed by [date], I can include [added value] at no extra cost."',
          '"What would need to happen to make a decision this month?"'
        ],
        warnings: [
          'Don\'t negotiate against yourself - wait for their counter',
          'Don\'t reveal your floor too early',
          'Never say "that\'s our best price" unless it actually is'
        ]
      },
      {
        id: 'n4',
        title: 'Handling "It\'s Too Expensive"',
        description: 'Price objections are rarely about the number.',
        details: [
          'First, understand the real objection: budget, value perception, or comparison',
          '"Too expensive compared to what?" - understand the benchmark',
          'Break down the cost: per location, per day, per user',
          'Show ROI timeline: "This pays for itself in X months"'
        ],
        phrases: [
          '"I understand budget is a concern. Help me understand - is it that the total amount isn\'t available, or that the value isn\'t clear yet?"',
          '"Compared to doing nothing, how does this cost stack up against the losses you described?"',
          '"If I could show you how this pays for itself within 6 months, would that change the conversation?"'
        ]
      }
    ]
  },
  {
    id: 'stakeholders',
    name: 'Stakeholder Alignment',
    icon: Users,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    description: 'Getting all decision-makers on board',
    items: [
      {
        id: 's1',
        title: 'Identify the Blockers',
        description: 'Someone always has concerns. Find them early.',
        details: [
          'Ask your champion: "Who might push back on this?"',
          'Common blockers: IT (security), Finance (budget), Ops (change resistance)',
          'Understand their concerns before the final meeting',
          'Address concerns proactively - don\'t let them surface late'
        ],
        phrases: [
          '"To make sure this goes smoothly, who else should we be talking to?"',
          '"What objections do you anticipate from your leadership?"',
          '"Is there anyone who\'s been burned by a similar purchase before?"'
        ]
      },
      {
        id: 's2',
        title: 'Build Executive Sponsorship',
        description: 'Deals with executive buy-in close faster.',
        details: [
          'Get your champion to introduce you to their leadership',
          'Prepare executive-level messaging: strategic value, competitive advantage',
          'Make it easy for your sponsor to sell internally',
          'Offer to present directly to leadership if helpful'
        ],
        phrases: [
          '"Would it be helpful if I provided materials you could share with [executive]?"',
          '"I\'d be happy to join a call with your leadership to address any questions directly."',
          '"What does [executive] care most about? I want to make sure our proposal addresses that."'
        ]
      },
      {
        id: 's3',
        title: 'Handle the "Committee" Delay',
        description: 'When decisions get stuck in committee.',
        details: [
          'Get invited to present directly - don\'t let your proposal be presented without you',
          'Understand the committee\'s decision criteria',
          'Provide comparison materials if you\'re being evaluated against alternatives',
          'Set a timeline: "When does the committee meet next?"'
        ],
        warnings: [
          'Proposals presented by someone else rarely win',
          'Committees often delay - create urgency',
          'The more people involved, the longer it takes'
        ]
      }
    ]
  },
  {
    id: 'mutual-plan',
    name: 'Mutual Action Plans',
    icon: Calendar,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    description: 'Structured path to close with clear accountability',
    items: [
      {
        id: 'm1',
        title: 'What is a Mutual Action Plan?',
        description: 'A shared document outlining the steps to close and implement.',
        details: [
          'Lists every action needed to get to signature',
          'Assigns owners and due dates to each action',
          'Shared with both parties - creates accountability',
          'Includes both pre-signature and post-signature activities'
        ],
        phrases: [
          '"Let\'s map out what needs to happen to get you live by [date]. I\'ll share a document we can both update."',
          '"Based on your target date, let\'s work backwards on the timeline."'
        ]
      },
      {
        id: 'm2',
        title: 'Building the Plan Together',
        description: 'Collaborate on the plan - don\'t dictate it.',
        details: [
          'Start with their go-live goal and work backwards',
          'Identify all activities: legal review, security review, procurement, implementation',
          'Get realistic timelines for each step on their side',
          'Build in buffer for delays'
        ],
        phrases: [
          '"What\'s your ideal go-live date? Let\'s see what needs to happen to hit that."',
          '"How long does legal review typically take for a contract like this?"',
          '"Who on your team should own each of these steps?"'
        ]
      },
      {
        id: 'm3',
        title: 'Sample Mutual Action Plan',
        description: 'Template structure for closing a deal.',
        details: [
          '1. Final proposal sent → Owner: [AE], Due: [Date]',
          '2. Internal budget approval → Owner: [Champion], Due: [Date]',
          '3. Security questionnaire completed → Owner: [IT], Due: [Date]',
          '4. Legal review of contract → Owner: [Legal], Due: [Date]',
          '5. Contract signed → Owner: [Decision Maker], Due: [Date]',
          '6. Implementation kickoff → Owner: [CSM], Due: [Date]',
          '7. Go-live → Target: [Date]'
        ]
      },
      {
        id: 'm4',
        title: 'Using the Plan to Drive Urgency',
        description: 'The plan creates natural pressure without being pushy.',
        details: [
          'Review the plan on every call - "Where are we?"',
          'When steps slip, discuss impact on go-live date',
          'Use the plan to identify stuck points early',
          'Reference the plan in emails to maintain momentum'
        ],
        phrases: [
          '"Looking at our plan, we\'re at step 3. What do you need from me to complete the security review?"',
          '"If legal review takes another week, that pushes go-live to [date]. Is that acceptable?"'
        ]
      }
    ]
  },
  {
    id: 'contracting',
    name: 'Contracting & Legal',
    icon: FileSignature,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    description: 'Navigating contracts, procurement, and legal review',
    items: [
      {
        id: 'c1',
        title: 'Anticipate Legal Concerns',
        description: 'Common contract issues and how to address them.',
        details: [
          'Data privacy and security: Have your DPA and security docs ready',
          'Liability and indemnification: Know what\'s negotiable',
          'Auto-renewal terms: Be prepared to discuss',
          'SLAs and uptime guarantees: Know your commitments'
        ],
        warnings: [
          'Legal review can add weeks - start early',
          'Don\'t promise what you can\'t deliver contractually',
          'Get your legal involved if they want significant changes'
        ]
      },
      {
        id: 'c2',
        title: 'Procurement Process',
        description: 'Enterprise procurement can be complex.',
        details: [
          'Ask early: "What\'s your procurement process?"',
          'Register as a vendor if required - can take time',
          'Understand payment terms requirements',
          'Know if you need to go through an RFP'
        ],
        phrases: [
          '"What does your procurement process look like for a purchase of this size?"',
          '"Is there anything I should prepare for your vendor registration process?"',
          '"Do you typically require net-30 or net-60 terms?"'
        ]
      },
      {
        id: 'c3',
        title: 'Redlines and Negotiations',
        description: 'How to handle contract redlines efficiently.',
        details: [
          'Get their redlines all at once - avoid back-and-forth',
          'Prioritize: What\'s a dealbreaker vs. nice-to-have?',
          'Escalate internally early for non-standard requests',
          'Keep a record of all agreed changes'
        ],
        phrases: [
          '"Please send all your requested changes in one document so we can review comprehensively."',
          '"Which of these items are must-haves vs. would-be-nice?"',
          '"I\'ll need to check with our legal team on that one - I\'ll have an answer by [date]."'
        ]
      }
    ]
  },
  {
    id: 'closing-techniques',
    name: 'Closing Techniques',
    icon: Target,
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    description: 'Asking for the business and handling final objections',
    items: [
      {
        id: 'ct1',
        title: 'Ask for the Business',
        description: 'At some point, you have to ask.',
        details: [
          'Don\'t wait for them to offer - be direct',
          'Make it easy to say yes',
          'Assume the close when appropriate',
          'Have the paperwork ready'
        ],
        phrases: [
          '"Based on everything we\'ve discussed, are you ready to move forward?"',
          '"What would you need to see to sign this week?"',
          '"I\'ll send over the agreement today - can you get it back to me by Friday?"',
          '"Should I schedule the kickoff call for next week?"'
        ]
      },
      {
        id: 'ct2',
        title: 'Handle Last-Minute Objections',
        description: 'New concerns often surface right before signing.',
        details: [
          'Stay calm - this is normal',
          'Understand the real concern: Is this a genuine issue or cold feet?',
          'Ask: "Is this the only thing standing in the way?"',
          'Offer to address it directly with whoever has the concern'
        ],
        phrases: [
          '"I want to make sure you feel confident about this. What\'s driving that concern?"',
          '"If we can address [concern], are we ready to move forward?"',
          '"Would it help if I spoke directly with [person with concern]?"'
        ],
        warnings: [
          'Don\'t panic and over-discount',
          'Don\'t dismiss legitimate concerns',
          'Don\'t let deals go dark - address issues head-on'
        ]
      },
      {
        id: 'ct3',
        title: 'Create Appropriate Urgency',
        description: 'Help them prioritize without being manipulative.',
        details: [
          'Connect to their goals: "To hit your Q2 target, we need to start by..."',
          'Reference implementation timelines: "Implementation takes X weeks..."',
          'Use real deadlines: quarter-end, price increases, resource availability',
          'Remind them of the cost of waiting'
        ],
        phrases: [
          '"Every month you wait is another month of [problem they described]."',
          '"If you want to be live before [their milestone], we need to start by [date]."',
          '"I have implementation capacity next month - after that, there\'s a backlog."'
        ],
        warnings: [
          'Fake urgency destroys trust',
          'Don\'t threaten - create value-based urgency',
          'Be honest about what\'s real and what\'s flexible'
        ]
      },
      {
        id: 'ct4',
        title: 'When They Go Dark',
        description: 'How to re-engage stalled deals.',
        details: [
          'First, check: Did something change? New priorities, budget shift, org change?',
          'Try different channels: email, phone, LinkedIn, through another contact',
          'Provide value: Share relevant news, case study, or insight',
          'Create a reason to reconnect: "I was thinking about your [specific situation]..."'
        ],
        phrases: [
          '"I wanted to check in - has anything changed on your end?"',
          '"I came across this [article/case study] and thought of your situation with [specific issue]."',
          '"I understand things get busy. What would be helpful for me to provide?"',
          '"Is this still a priority, or should I check back in a few months?"'
        ]
      }
    ]
  },
  {
    id: 'handoff',
    name: 'Customer Handoff',
    icon: Handshake,
    color: 'text-teal-400',
    bgColor: 'bg-teal-500/20',
    description: 'Transitioning from sales to success',
    items: [
      {
        id: 'h1',
        title: 'Internal Handoff',
        description: 'Set up the customer success team for success.',
        details: [
          'Document everything: discovery notes, pain points, key stakeholders',
          'Share what was promised - no surprises',
          'Introduce the CSM before the deal closes',
          'Brief the implementation team on any special requirements'
        ],
        warnings: [
          'Don\'t overpromise to close - CSM inherits your commitments',
          'Incomplete handoffs lead to churn',
          'The customer experience starts before they sign'
        ]
      },
      {
        id: 'h2',
        title: 'Customer Kickoff',
        description: 'Set the right expectations for what comes next.',
        details: [
          'Reconfirm goals and success criteria',
          'Introduce implementation and support teams',
          'Review timeline and milestones',
          'Set expectations for their involvement'
        ],
        phrases: [
          '"Now that we\'re signed, let me introduce [CSM] who will be your main point of contact."',
          '"Before we hand off, I want to make sure we\'re aligned on what success looks like."',
          '"Here\'s what the next 30/60/90 days will look like..."'
        ]
      }
    ]
  }
];

export default function ClosingPage() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['negotiation']));
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
    await navigator.clipboard.writeText(text.replace(/"/g, ''));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Handshake className="w-7 h-7 text-accent" />
            Closing
          </h1>
          <p className="text-sm text-muted mt-1">
            Negotiation, contracts, stakeholder alignment, and getting deals signed.
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
        <Link href="/solutioning" className="px-3 py-1 bg-surface-elevated text-muted rounded-lg hover:text-foreground hover:bg-surface transition-colors">
          Solutioning
        </Link>
        <ArrowRight className="w-4 h-4 text-muted" />
        <span className="px-3 py-1 bg-accent text-white rounded-lg font-medium">Closing</span>
      </div>

      {/* Key principle */}
      <div className="bg-accent/10 border border-accent/30 rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-accent mb-1">Closing is about removing obstacles, not pressure</h3>
            <p className="text-sm text-foreground">
              A well-run sales process naturally leads to a close. Your job now is to identify and remove 
              the remaining barriers - budget, stakeholders, legal, timing - not to push them into a corner.
            </p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {closingSections.map((section) => {
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
                                  Key Points
                                </h4>
                                <ul className="space-y-2">
                                  {item.details.map((detail, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                      <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                                      <span className="text-foreground">{detail}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Phrases */}
                            {item.phrases && (
                              <div>
                                <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                                  What to Say
                                </h4>
                                <div className="space-y-2">
                                  {item.phrases.map((phrase, i) => (
                                    <div 
                                      key={i} 
                                      className="flex items-start gap-2 text-sm bg-surface-elevated rounded-lg p-3"
                                    >
                                      <span className="text-foreground flex-1">{phrase}</span>
                                      <button
                                        onClick={() => copyText(phrase, `${item.id}-p-${i}`)}
                                        className="shrink-0 p-1 text-muted hover:text-foreground transition-colors"
                                      >
                                        {copiedId === `${item.id}-p-${i}` ? (
                                          <CheckCircle2 className="w-4 h-4 text-success" />
                                        ) : (
                                          <Copy className="w-4 h-4" />
                                        )}
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Warnings */}
                            {item.warnings && (
                              <div>
                                <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                                  Watch Out For
                                </h4>
                                <ul className="space-y-1.5">
                                  {item.warnings.map((warning, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                      <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                                      <span className="text-foreground">{warning}</span>
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

      {/* Closing checklist */}
      <div className="bg-surface border border-border rounded-xl p-6 mt-8">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-accent" />
          Deal Close Checklist
        </h2>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            'All stakeholders identified and engaged',
            'Decision criteria understood and addressed',
            'Mutual action plan created and agreed',
            'Budget confirmed and allocated',
            'Legal/security review timeline known',
            'Procurement process understood',
            'Contract sent and being reviewed',
            'Implementation date scheduled',
            'Success metrics defined',
            'Customer success handoff prepared'
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
        targetSection="closing"
        sectionLabel="Closing"
      />
    </div>
  );
}
