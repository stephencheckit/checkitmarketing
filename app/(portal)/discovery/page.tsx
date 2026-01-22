'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  ChevronDown, 
  ChevronRight,
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users,
  Shield,
  TrendingUp,
  Zap,
  Copy,
  CheckCircle2,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import ContributionModal from '@/components/ContributionModal';

interface DiscoveryQuestion {
  id: string;
  question: string;
  whyWeAsk: string;
  mapsTo: string[];
  followUps?: string[];
  listenFor?: string[];
  stage: 'opening' | 'pain' | 'impact' | 'current-state' | 'decision' | 'closing';
}

const discoveryQuestions: DiscoveryQuestion[] = [
  // OPENING - Build rapport and understand context
  {
    id: 'o1',
    question: "Can you walk me through how compliance and safety monitoring works at your organization today?",
    whyWeAsk: "Opens conversation without leading. Lets them reveal their current workflow, pain points, and priorities organically. Establishes baseline for positioning Checkit.",
    mapsTo: ['Operational Visibility', 'Current State'],
    followUps: [
      "Who's responsible for managing that process?",
      "How long have you been doing it that way?"
    ],
    listenFor: ['Manual processes', 'Spreadsheets', 'Paper logs', 'Multiple systems', 'Staff burden'],
    stage: 'opening'
  },
  {
    id: 'o2',
    question: "What prompted you to start looking at solutions like Checkit?",
    whyWeAsk: "Uncovers the trigger event. Understanding what changed helps us position urgency and tailor the solution to their immediate driver.",
    mapsTo: ['Trigger Event', 'Decision Timeline'],
    followUps: [
      "When did this become a priority?",
      "Has anything happened recently that escalated this?"
    ],
    listenFor: ['Audit failure', 'Near-miss incident', 'Staff shortage', 'Expansion', 'New regulations'],
    stage: 'opening'
  },

  // PAIN DISCOVERY - Uncover problems
  {
    id: 'p1',
    question: "What happens when a temperature excursion or compliance breach occurs? Walk me through the last time.",
    whyWeAsk: "Forces them to relive the pain. Specific examples create emotional connection to the problem and reveal the true cost of manual processes.",
    mapsTo: ['Proactive Compliance', 'Real-time Alerting'],
    followUps: [
      "How did you find out about it?",
      "How long between the event and when you knew?",
      "What was the outcome?"
    ],
    listenFor: ['Delayed discovery', 'Product loss', 'Audit findings', 'Customer complaints', 'Scrambling'],
    stage: 'pain'
  },
  {
    id: 'p2',
    question: "How much time do your team members spend on compliance documentation and logging each day?",
    whyWeAsk: "Quantifies the labor burden. This maps directly to our ROI case - staff time freed up for higher-value work.",
    mapsTo: ['Operational Efficiency', 'Staff Productivity', 'Cost Savings'],
    followUps: [
      "What would they be doing instead if that time was freed up?",
      "Is that the best use of their expertise?"
    ],
    listenFor: ['Hours per day', 'Multiple staff involved', 'Overtime', 'Frustration', 'High turnover'],
    stage: 'pain'
  },
  {
    id: 'p3',
    question: "When was your last audit, and how did it go?",
    whyWeAsk: "Audits are high-stakes events. Poor audit experiences create urgency. Good ones reveal complacency we need to address.",
    mapsTo: ['Effortless Audits', 'Audit Readiness', 'Compliance Documentation'],
    followUps: [
      "How long did it take to prepare?",
      "Were there any findings or observations?",
      "How confident were you going in?"
    ],
    listenFor: ['Stressful', 'Weeks of prep', 'Scrambling for records', 'Findings', 'Corrective actions'],
    stage: 'pain'
  },
  {
    id: 'p4',
    question: "Have you ever had a near-miss or actual incident related to temperature, safety, or compliance?",
    whyWeAsk: "Near-misses are powerful motivators. They've already felt the risk without the full consequences. This is emotional fuel for change.",
    mapsTo: ['Risk Mitigation', 'Proactive Monitoring', 'Peace of Mind'],
    followUps: [
      "What could have happened if it had gone differently?",
      "What changes did you make after that?"
    ],
    listenFor: ['Close calls', 'Product at risk', 'Customer safety', 'Regulatory scrutiny', 'Management attention'],
    stage: 'pain'
  },

  // IMPACT - Quantify the cost of problems
  {
    id: 'i1',
    question: "If a refrigeration unit fails overnight and you don't catch it until morning, what's the potential cost?",
    whyWeAsk: "Forces calculation of real financial impact. This number becomes the ROI anchor - our solution cost vs. prevention of this loss.",
    mapsTo: ['24/7 Monitoring', 'Real-time Alerts', 'Loss Prevention'],
    followUps: [
      "Has that actually happened?",
      "What's the value of inventory in your highest-risk area?"
    ],
    listenFor: ['Dollar amounts', 'Insurance claims', 'Customer compensation', 'Reputation damage'],
    stage: 'impact'
  },
  {
    id: 'i2',
    question: "What would a failed audit or compliance violation cost your organization?",
    whyWeAsk: "Compliance failures have cascading costs: fines, remediation, lost business, reputation. Quantifying this justifies investment in prevention.",
    mapsTo: ['Compliance Automation', 'Audit Trail', 'Risk Reduction'],
    followUps: [
      "Beyond fines, what about the operational disruption?",
      "How would your customers or partners react?"
    ],
    listenFor: ['Fines', 'Shutdown risk', 'Contract loss', 'Reputation', 'Management pressure'],
    stage: 'impact'
  },
  {
    id: 'i3',
    question: "How does staff turnover affect your compliance program?",
    whyWeAsk: "Turnover is expensive and creates knowledge gaps. Systems that reduce training burden and ensure consistency are valuable.",
    mapsTo: ['Ease of Use', 'Standardization', 'Training Reduction', 'Consistency'],
    followUps: [
      "How long does it take to train someone on your current process?",
      "What gets missed when someone new starts?"
    ],
    listenFor: ['Training time', 'Knowledge loss', 'Inconsistency', 'Errors', 'Supervision required'],
    stage: 'impact'
  },

  // CURRENT STATE - Understand what they're using
  {
    id: 'c1',
    question: "What systems or tools are you currently using for monitoring and compliance?",
    whyWeAsk: "Maps the competitive landscape. Knowing their current stack helps us position against specific alternatives and identify integration needs.",
    mapsTo: ['Integration', 'Consolidation', 'Single Platform'],
    followUps: [
      "How well do those systems work together?",
      "What do you like about your current setup? What frustrates you?"
    ],
    listenFor: ['Competitor names', 'Manual systems', 'Multiple tools', 'Spreadsheets', 'Gaps'],
    stage: 'current-state'
  },
  {
    id: 'c2',
    question: "How do you currently get visibility into what's happening across all your locations or areas?",
    whyWeAsk: "Multi-site visibility is a key differentiator. This reveals whether they have centralized oversight or are managing blind.",
    mapsTo: ['Centralized Dashboard', 'Multi-site Management', 'Real-time Visibility'],
    followUps: [
      "Can you see everything in one place?",
      "How do you compare performance across locations?"
    ],
    listenFor: ['No central view', 'Delayed reports', 'Site-by-site', 'Inconsistent data', 'Blind spots'],
    stage: 'current-state'
  },
  {
    id: 'c3',
    question: "How do you handle after-hours monitoring and alerts?",
    whyWeAsk: "24/7 monitoring is critical. Most incidents happen when no one is watching. This reveals a major risk gap we can solve.",
    mapsTo: ['24/7 Automated Monitoring', 'Mobile Alerts', 'Escalation'],
    followUps: [
      "What happens if something fails at 2am?",
      "Who gets notified and how?"
    ],
    listenFor: ['No monitoring', 'Staff rounds only', 'Morning discovery', 'On-call burden', 'Gaps'],
    stage: 'current-state'
  },

  // DECISION PROCESS - Understand how they'll buy
  {
    id: 'd1',
    question: "Beyond yourself, who else would be involved in evaluating and deciding on a solution like this?",
    whyWeAsk: "Maps the buying committee. We need to understand all stakeholders to tailor our approach and avoid surprise blockers.",
    mapsTo: ['Stakeholder Alignment', 'Business Case'],
    followUps: [
      "What matters most to each of them?",
      "Who has final sign-off on budget?"
    ],
    listenFor: ['IT', 'Finance', 'Operations', 'Quality', 'C-level', 'Procurement'],
    stage: 'decision'
  },
  {
    id: 'd2',
    question: "What criteria are most important to you when evaluating solutions?",
    whyWeAsk: "Reveals decision criteria we must address. Allows us to emphasize our strengths and proactively handle potential objections.",
    mapsTo: ['Differentiators', 'Proof Points', 'ROI'],
    followUps: [
      "How would you weight those against each other?",
      "What would make this a clear 'yes' for you?"
    ],
    listenFor: ['Ease of use', 'Price', 'Integration', 'Support', 'Reliability', 'Scalability'],
    stage: 'decision'
  },
  {
    id: 'd3',
    question: "What's your timeline for making a decision and implementing a solution?",
    whyWeAsk: "Establishes urgency and helps us prioritize. Also reveals any hard deadlines (audits, expansions) we should align to.",
    mapsTo: ['Implementation', 'Timeline'],
    followUps: [
      "Is there an event driving that timeline?",
      "What happens if this slips?"
    ],
    listenFor: ['Specific dates', 'Audit deadlines', 'Budget cycles', 'Expansion plans', 'No urgency'],
    stage: 'decision'
  },
  {
    id: 'd4',
    question: "Have you looked at other solutions? What did you think?",
    whyWeAsk: "Understand competitive positioning. Their experience with alternatives reveals what matters and where competitors fell short.",
    mapsTo: ['Competitive Differentiation', 'Win Themes'],
    followUps: [
      "What did you like? What concerned you?",
      "Why didn't you move forward with them?"
    ],
    listenFor: ['Competitor names', 'Pricing concerns', 'Feature gaps', 'Implementation fears', 'Reference issues'],
    stage: 'decision'
  },

  // CLOSING - Confirm fit and next steps
  {
    id: 'cl1',
    question: "Based on what we've discussed, what would success look like for you 12 months from now?",
    whyWeAsk: "Gets them to articulate their vision of success. This becomes the benchmark we commit to and gives us their definition of value.",
    mapsTo: ['Success Metrics', 'Value Realization', 'Partnership'],
    followUps: [
      "How would you measure that?",
      "What would change for your team?"
    ],
    listenFor: ['Specific outcomes', 'Metrics', 'Reduced stress', 'Confidence', 'Growth enabled'],
    stage: 'closing'
  },
  {
    id: 'cl2',
    question: "What concerns or questions do you have about moving forward with something like Checkit?",
    whyWeAsk: "Surfaces objections proactively. It's better to address concerns now than have them derail the deal later.",
    mapsTo: ['Objection Handling', 'Risk Mitigation'],
    followUps: [
      "What would help address that concern?",
      "Have you seen that be a problem with other vendors?"
    ],
    listenFor: ['Implementation', 'Cost', 'Adoption', 'Integration', 'Change management'],
    stage: 'closing'
  }
];

const stageInfo = {
  'opening': { label: 'Opening', color: 'text-blue-400', bg: 'bg-blue-500/20', icon: Users, description: 'Build rapport and understand context' },
  'pain': { label: 'Pain Discovery', color: 'text-red-400', bg: 'bg-red-500/20', icon: AlertTriangle, description: 'Uncover problems and challenges' },
  'impact': { label: 'Impact', color: 'text-orange-400', bg: 'bg-orange-500/20', icon: TrendingUp, description: 'Quantify the cost of problems' },
  'current-state': { label: 'Current State', color: 'text-purple-400', bg: 'bg-purple-500/20', icon: Shield, description: 'Understand existing tools and processes' },
  'decision': { label: 'Decision Process', color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: Target, description: 'Map the buying process' },
  'closing': { label: 'Closing', color: 'text-green-400', bg: 'bg-green-500/20', icon: CheckCircle, description: 'Confirm fit and next steps' }
};

const stages = ['opening', 'pain', 'impact', 'current-state', 'decision', 'closing'] as const;

export default function DiscoveryPage() {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [activeStage, setActiveStage] = useState<string | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showContribution, setShowContribution] = useState(false);

  const toggleQuestion = (id: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedQuestions(newExpanded);
  };

  const copyQuestion = async (question: string, id: string) => {
    await navigator.clipboard.writeText(question);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredQuestions = activeStage === 'all' 
    ? discoveryQuestions 
    : discoveryQuestions.filter(q => q.stage === activeStage);

  const groupedQuestions = stages.reduce((acc, stage) => {
    acc[stage] = filteredQuestions.filter(q => q.stage === stage);
    return acc;
  }, {} as Record<string, DiscoveryQuestion[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Search className="w-7 h-7 text-accent" />
            Discovery Questions
          </h1>
          <p className="text-sm text-muted mt-1">
            Qualification questions in recommended order, with explanations of why we ask each one.
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
        <span className="px-3 py-1 bg-accent text-white rounded-lg font-medium">Discovery</span>
        <ArrowRight className="w-4 h-4 text-muted" />
        <Link href="/solutioning" className="px-3 py-1 bg-surface-elevated text-muted rounded-lg hover:text-foreground hover:bg-surface transition-colors">
          Solutioning
        </Link>
        <ArrowRight className="w-4 h-4 text-muted" />
        <Link href="/closing" className="px-3 py-1 bg-surface-elevated text-muted rounded-lg hover:text-foreground hover:bg-surface transition-colors">
          Closing
        </Link>
      </div>

      {/* Key principle */}
      <div className="bg-accent/10 border border-accent/30 rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-accent mb-1">Discovery is about understanding, not pitching</h3>
            <p className="text-sm text-foreground">
              Ask questions, listen deeply, and take notes. The goal is to understand their situation so well 
              that your solution presentation feels inevitable. Let them talk 70% of the time.
            </p>
          </div>
        </div>
      </div>

      {/* Stage filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveStage('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeStage === 'all'
              ? 'bg-accent text-white'
              : 'bg-surface-elevated text-muted hover:text-foreground'
          }`}
        >
          All Stages
        </button>
        {stages.map(stage => {
          const info = stageInfo[stage];
          const Icon = info.icon;
          const count = discoveryQuestions.filter(q => q.stage === stage).length;
          return (
            <button
              key={stage}
              onClick={() => setActiveStage(stage)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeStage === stage
                  ? `${info.bg} ${info.color}`
                  : 'bg-surface-elevated text-muted hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {info.label}
              <span className="text-xs opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Questions by stage */}
      <div className="space-y-8">
        {stages.map(stage => {
          const questions = groupedQuestions[stage];
          if (questions.length === 0) return null;
          
          const info = stageInfo[stage];
          const Icon = info.icon;

          return (
            <div key={stage} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 ${info.bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${info.color}`} />
                </div>
                <div>
                  <h2 className={`font-semibold ${info.color}`}>{info.label}</h2>
                  <p className="text-xs text-muted">{info.description}</p>
                </div>
              </div>

              <div className="space-y-3">
                {questions.map((q, idx) => {
                  const isExpanded = expandedQuestions.has(q.id);
                  const globalIndex = discoveryQuestions.findIndex(dq => dq.id === q.id) + 1;
                  
                  return (
                    <div 
                      key={q.id}
                      className="bg-surface border border-border rounded-xl overflow-hidden"
                    >
                      {/* Question header */}
                      <div
                        className="w-full flex items-start gap-4 p-4 text-left hover:bg-surface-elevated/50 transition-colors cursor-pointer"
                      >
                        <div 
                          className="flex items-center gap-3 shrink-0"
                          onClick={() => toggleQuestion(q.id)}
                        >
                          <span className="text-xs text-muted font-mono w-6">{globalIndex}.</span>
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-muted" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-muted" />
                          )}
                        </div>
                        <div 
                          className="flex-1 min-w-0"
                          onClick={() => toggleQuestion(q.id)}
                        >
                          <p className="font-medium text-foreground">&quot;{q.question}&quot;</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {q.mapsTo.map(tag => (
                              <span 
                                key={tag}
                                className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => copyQuestion(q.question, q.id)}
                          className="shrink-0 p-2 text-muted hover:text-foreground transition-colors"
                          title="Copy question"
                        >
                          {copiedId === q.id ? (
                            <CheckCircle2 className="w-4 h-4 text-success" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Expanded content */}
                      {isExpanded && (
                        <div className="border-t border-border p-4 bg-background/50 space-y-4">
                          {/* Why we ask */}
                          <div>
                            <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">
                              Why We Ask This
                            </h4>
                            <p className="text-sm text-foreground">{q.whyWeAsk}</p>
                          </div>

                          {/* Follow-ups */}
                          {q.followUps && q.followUps.length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                                Follow-up Questions
                              </h4>
                              <ul className="space-y-1.5">
                                {q.followUps.map((fu, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm">
                                    <span className="text-accent">→</span>
                                    <span className="text-foreground">&quot;{fu}&quot;</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Listen for */}
                          {q.listenFor && q.listenFor.length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                                Listen For
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {q.listenFor.map((item, i) => (
                                  <span 
                                    key={i}
                                    className="text-xs px-2 py-1 bg-surface-elevated text-muted rounded border border-border"
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Best practices */}
      <div className="bg-surface border border-border rounded-xl p-6 mt-8">
        <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-accent" />
          Discovery Call Best Practices
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Let them talk</p>
                <p className="text-xs text-muted">Aim for 70% prospect, 30% you. Use silence.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Take detailed notes</p>
                <p className="text-xs text-muted">Use their exact words in your follow-up and proposal.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Confirm understanding</p>
                <p className="text-xs text-muted">&quot;So what I&apos;m hearing is...&quot; - reflect back to validate.</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Quantify everything</p>
                <p className="text-xs text-muted">Hours, dollars, incidents - numbers make the case.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Don&apos;t pitch yet</p>
                <p className="text-xs text-muted">Resist the urge to present. Discovery is for learning.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">End with clear next steps</p>
                <p className="text-xs text-muted">Schedule the demo before you hang up.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contribution Modal */}
      <ContributionModal
        isOpen={showContribution}
        onClose={() => setShowContribution(false)}
        targetType="positioning"
        targetSection="discovery"
        sectionLabel="Discovery Questions"
      />
    </div>
  );
}
