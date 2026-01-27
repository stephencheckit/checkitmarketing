'use client';

import { useState } from 'react';
import { 
  Crown, 
  Copy,
  Check,
  Users,
  Thermometer,
  Building2,
  Shield,
  Activity,
  Eye,
  Pencil,
  X,
  Save,
  Plus,
  Trash2,
  Target,
  TrendingUp,
  Layers,
  User,
  Heart,
  ShoppingCart,
  Handshake,
  Store,
  CheckCircle2,
  RotateCcw,
  Calendar,
  ChevronLeft,
  ChevronRight,
  List
} from 'lucide-react';

interface Post {
  id: string;
  category: string;
  personas: string[]; // Which personas this post is good for
  title: string;
  content: string;
  hashtags: string[];
}

interface Persona {
  id: string;
  name: string;
  role: string;
  focus: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const personas: Persona[] = [
  { id: 'ceo', name: 'Kit', role: 'CEO', focus: 'Thought leadership, executive connection, predictive ops', icon: Crown, color: 'amber' },
  { id: 'uk-vp-sales', name: 'Tonks', role: 'UK VP of Sales', focus: 'Multi-site food safety, temp monitoring, retention/expansion', icon: TrendingUp, color: 'blue' },
  { id: 'us-vp-sales', name: 'Ryan', role: 'US VP of Sales', focus: 'Plasma, critical inventory, senior living, digitizing ops', icon: TrendingUp, color: 'emerald' },
  { id: 'us-senior-living', name: 'Albert', role: 'US Head of Sales', focus: 'Senior living market, landing new deals', icon: Heart, color: 'rose' },
  { id: 'uk-food-retail', name: 'April', role: 'UK Head of Food Retail', focus: 'BP, JLP, enterprise multi-site, food safety', icon: Store, color: 'orange' },
  { id: 'uk-cs', name: 'Ellie', role: 'UK Head of CS', focus: 'Expansion, Asset Intelligence upsell, customer value', icon: Handshake, color: 'green' },
];

const categories = [
  { id: 'strategy', name: 'Operational Strategy', icon: Target },
  { id: 'predictive', name: 'Predictive Operations', icon: Eye },
  { id: 'assets', name: 'Asset Intelligence', icon: Thermometer },
  { id: 'multisite', name: 'Multi-Site Operations', icon: Building2 },
  { id: 'food-safety', name: 'Food Safety & Retail', icon: ShoppingCart },
  { id: 'senior-living', name: 'Senior Living', icon: Heart },
  { id: 'expansion', name: 'Customer Expansion', icon: TrendingUp },
  { id: 'compliance', name: 'Compliance & Safety', icon: Shield },
];

const defaultPosts: Post[] = [
  // CEO - EXECUTIVE THOUGHT LEADERSHIP
  {
    id: 'ceo-1',
    category: 'strategy',
    personas: ['ceo'],
    title: 'Operations Is Strategy',
    content: `Too many companies treat operations as execution.

"Strategy happens in the boardroom. Operations just delivers it."

This is backwards.

Operations IS strategy.

How you execute is what you actually are—not what your slides say.

The companies winning in competitive markets aren't winning on vision.

They're winning on operational capability that competitors can't replicate.

Your operations are either a competitive advantage or a liability.

There's no neutral.`,
    hashtags: ['OperationalStrategy', 'CEO', 'Leadership', 'CompetitiveAdvantage']
  },
  {
    id: 'ceo-2',
    category: 'predictive',
    personas: ['ceo'],
    title: 'The Predictive Operations Shift',
    content: `There are two types of operations:

Reactive: "The fridge failed. We lost $30K in inventory."

Predictive: "The fridge is showing early warning signs. Scheduling maintenance now."

Same business. Same equipment. Completely different outcomes.

The shift from reactive to predictive isn't about technology.

It's about seeing problems before they become emergencies.

And the companies making that shift? They're not just saving money.

They're sleeping better at night.`,
    hashtags: ['PredictiveOperations', 'OperationalExcellence', 'RiskManagement']
  },
  {
    id: 'ceo-3',
    category: 'strategy',
    personas: ['ceo'],
    title: 'The Operational Moat',
    content: `Products can be copied.
Pricing can be matched.
Marketing can be imitated.

But operational excellence? That takes years to build.

McDonald's doesn't win because of better burgers.
Amazon doesn't win because of better products.
Walmart doesn't win because of better stores.

They win because their operations are a moat.

Consistency at scale. Reliability at volume. Efficiency under pressure.

If your competitors can't replicate how you operate, you have something defensible.`,
    hashtags: ['OperationalMoat', 'CompetitiveAdvantage', 'Strategy', 'CEO']
  },
  {
    id: 'ceo-4',
    category: 'predictive',
    personas: ['ceo', 'uk-vp-sales', 'us-vp-sales'],
    title: 'Problems Have Warning Signs',
    content: `Every operational crisis has warning signs.

The fridge that fails? Its compression cycles were trending wrong for weeks.

The food safety incident? There were missed checks in the days before.

The employee who quits? Their compliance scores dropped before they gave notice.

The site that fails an audit? The data showed trouble for months.

Most businesses only see these patterns in hindsight.

The best operators see them in real-time.

That's the difference between reactive and predictive.`,
    hashtags: ['PredictiveOperations', 'EarlyWarning', 'DataDriven']
  },
  {
    id: 'ceo-5',
    category: 'strategy',
    personas: ['ceo'],
    title: 'Operational Debt',
    content: `Technical debt is well understood.

Operational debt? Less discussed, but equally dangerous.

Every shortcut you take in operations compounds:
→ The manual process you never automated
→ The training you skipped to save time
→ The system you duct-taped together
→ The standard you let slide "just this once"

Operational debt accrues interest.

What started as "we'll fix it later" becomes "this is just how we do things."

The best COOs I know budget time for paying down operational debt.

Every. Single. Quarter.`,
    hashtags: ['OperationalDebt', 'COO', 'Operations', 'Strategy']
  },

  // MULTI-SITE OPERATIONS - UK VP SALES, UK FOOD RETAIL
  {
    id: 'multi-1',
    category: 'multisite',
    personas: ['uk-vp-sales', 'uk-food-retail', 'ceo'],
    title: 'The Multi-Site Visibility Gap',
    content: `Here's what keeps multi-site operators up at night:

"I have 50 locations. I trust my managers. But I don't really know what's happening."

That's the visibility gap.

Not because managers are hiding things.

Because paper processes don't travel. Manual checks don't aggregate. Problems stay local until they become crises.

The first step to multi-site excellence isn't better people.

It's better visibility.

You can't improve what you can't see.`,
    hashtags: ['MultiSite', 'Visibility', 'Operations', 'FoodSafety']
  },
  {
    id: 'multi-2',
    category: 'multisite',
    personas: ['uk-vp-sales', 'uk-food-retail'],
    title: 'Consistency at 100 Sites',
    content: `Your best site and your worst site are running completely different operations.

Same brand. Same standards. Different execution.

At 10 sites, you can manage this personally.
At 50 sites, it's getting away from you.
At 100 sites, you need systems.

Consistency at scale isn't about control.

It's about giving every location the same visibility, tools, and standards that make your best site successful.

Replicate excellence. Don't just hope for it.`,
    hashtags: ['MultiSite', 'Consistency', 'FoodRetail', 'Operations']
  },
  {
    id: 'multi-3',
    category: 'multisite',
    personas: ['uk-food-retail', 'uk-vp-sales'],
    title: 'The Regional Manager Multiplier',
    content: `Where should your regional manager spend their time this week?

The reactive answer: wherever there's a fire.

The predictive answer: wherever the data shows early warning signs.

When RMs have real-time visibility into every site:
→ They focus on prevention, not firefighting
→ They coach before problems compound
→ They scale their impact across more locations

Great RMs aren't superheroes.

They're force multipliers with the right information.`,
    hashtags: ['RegionalManagers', 'MultiSite', 'Leadership', 'Operations']
  },

  // FOOD SAFETY & RETAIL - UK VP SALES, UK FOOD RETAIL
  {
    id: 'food-1',
    category: 'food-safety',
    personas: ['uk-vp-sales', 'uk-food-retail'],
    title: 'Food Safety Isn\'t a Department',
    content: `Food safety isn't something you add on.

It's something you build in.

The organizations with the best safety records don't have bigger compliance teams.

They have systems where:
→ Checks happen automatically
→ Exceptions are caught immediately
→ Trends are visible in real-time
→ Accountability is clear

Food safety culture isn't about fear.

It's about making the right thing the easy thing.`,
    hashtags: ['FoodSafety', 'Compliance', 'Culture', 'Operations']
  },
  {
    id: 'food-2',
    category: 'food-safety',
    personas: ['uk-food-retail', 'uk-vp-sales'],
    title: 'The BP/JLP Challenge',
    content: `Running food-to-go operations in convenience retail is a unique challenge.

High volume. Constant turnover. Tight margins. Zero tolerance for safety failures.

The retailers winning this space have figured out:

→ Simplified digital workflows that staff actually use
→ Automated temperature monitoring that never sleeps
→ Real-time visibility for area managers
→ Compliance that proves itself to auditors

Paper processes in high-volume retail? That's a liability waiting to happen.`,
    hashtags: ['FoodRetail', 'ConvenienceRetail', 'FoodSafety', 'Operations']
  },
  {
    id: 'food-3',
    category: 'food-safety',
    personas: ['uk-food-retail'],
    title: 'Enterprise Food Safety',
    content: `Enterprise food safety isn't about doing more checks.

It's about:
→ Standardizing processes across all sites
→ Proving compliance with auditable data
→ Catching problems before they become incidents
→ Giving leadership visibility without micromanaging

The conversations I have with enterprise food safety leaders always come back to the same thing:

"I need to know we're compliant. Everywhere. Every day."

That's not paranoia. That's good governance.`,
    hashtags: ['EnterpriseFoodSafety', 'Compliance', 'Governance', 'FoodRetail']
  },

  // ASSET INTELLIGENCE - ALL SALES, UK CS
  {
    id: 'asset-1',
    category: 'assets',
    personas: ['uk-vp-sales', 'us-vp-sales', 'uk-food-retail', 'uk-cs'],
    title: 'Compression Cycles Tell Stories',
    content: `Your refrigeration equipment is talking to you.

You're probably just not listening.

Compression cycles tell you everything:

→ A unit cycling more frequently? Seal might be failing.
→ Run times getting longer? Compressor strain.
→ Unusual patterns at night? Door being left open.

This data exists. Most businesses just ignore it.

Asset Intelligence means letting your equipment tell you when it needs help—before it fails at 2am and costs you $30K in spoiled inventory.`,
    hashtags: ['AssetIntelligence', 'Refrigeration', 'PredictiveMaintenance']
  },
  {
    id: 'asset-2',
    category: 'assets',
    personas: ['uk-vp-sales', 'us-vp-sales', 'uk-cs'],
    title: 'The 2am Failure',
    content: `Equipment always fails at the worst time.

Friday night. Holiday weekend. 2am when no one's watching.

By the time someone notices, the damage is done.

But what if you knew 3 days earlier?

What if the data showed the compressor struggling before it gave out?

What if you got an alert when run times started trending wrong?

Predictive asset monitoring doesn't prevent all failures.

But it turns emergencies into scheduled maintenance.`,
    hashtags: ['AssetIntelligence', 'EquipmentFailure', 'PredictiveMaintenance']
  },
  {
    id: 'asset-3',
    category: 'assets',
    personas: ['uk-cs'],
    title: 'Beyond Temperature Monitoring',
    content: `"We already have temperature monitoring."

Great. That's step one.

Step two: What do you do with that data?

Most businesses use temp monitoring to react.
Alert comes in → Someone checks → Problem gets fixed.

The next level?

Using patterns to predict.
Using energy data to spot efficiency issues.
Using compression cycles to prevent failures.
Using door-open data to change behavior.

Temperature is just the start. Asset Intelligence is the destination.`,
    hashtags: ['AssetIntelligence', 'IoT', 'PredictiveMaintenance', 'CustomerSuccess']
  },

  // SENIOR LIVING - US VP SALES, US SENIOR LIVING
  {
    id: 'senior-1',
    category: 'senior-living',
    personas: ['us-vp-sales', 'us-senior-living'],
    title: 'Senior Living Compliance Pressure',
    content: `Senior living operators face a compliance reality no other industry matches.

CQC inspections. State surveys. Family scrutiny. Media attention.

One incident can define a community for years.

The operators sleeping well at night aren't the ones hoping everything's okay.

They're the ones who KNOW everything's okay.

Real-time compliance visibility. Automated safety checks. Auditable records.

In senior living, peace of mind isn't a luxury. It's a requirement.`,
    hashtags: ['SeniorLiving', 'Compliance', 'ElderCare', 'Operations']
  },
  {
    id: 'senior-2',
    category: 'senior-living',
    personas: ['us-senior-living', 'us-vp-sales'],
    title: 'Protecting Residents, Protecting Reputation',
    content: `In senior living, operational failures aren't just business problems.

They're safety problems. Trust problems. Family problems.

→ A missed medication check affects a real person.
→ A temperature excursion risks the food your residents eat.
→ A compliance gap invites regulatory scrutiny.

The best operators treat every check as if a family member is watching.

Because in a way, they are.

Operational excellence in senior living isn't about efficiency.

It's about trust.`,
    hashtags: ['SeniorLiving', 'ResidentSafety', 'Compliance', 'Trust']
  },
  {
    id: 'senior-3',
    category: 'senior-living',
    personas: ['us-senior-living'],
    title: 'The Survey-Ready Community',
    content: `Some communities panic before state surveys.

Others welcome them.

The difference?

Survey-ready communities don't prepare for inspections.

They operate inspection-ready every day.

→ Documentation is always current
→ Compliance is tracked in real-time
→ Issues are caught and corrected immediately
→ Nothing is a surprise

Surveys become a chance to showcase excellence.

Not a source of anxiety.`,
    hashtags: ['SeniorLiving', 'StateSurvey', 'Compliance', 'Operations']
  },

  // CUSTOMER EXPANSION - UK CS, ALL SALES
  {
    id: 'expand-1',
    category: 'expansion',
    personas: ['uk-cs', 'uk-vp-sales', 'us-vp-sales'],
    title: 'The Expansion Conversation',
    content: `The best time to expand a customer relationship is when they're seeing value.

Not when your quota needs it.

When customers are:
→ Hitting compliance targets consistently
→ Catching problems before they escalate
→ Seeing ROI in their current deployment

That's when the expansion conversation is natural:

"What if we could do this for your other locations?"
"What if we could add Asset Intelligence?"
"What if we could cover more use cases?"

Value first. Expansion follows.`,
    hashtags: ['CustomerSuccess', 'Expansion', 'AccountGrowth', 'Sales']
  },
  {
    id: 'expand-2',
    category: 'expansion',
    personas: ['uk-cs'],
    title: 'Asset Intelligence as an Upsell',
    content: `Customers who start with compliance monitoring often don't know what else is possible.

They're solving today's problem: "We need temp logs."

Asset Intelligence opens a new conversation:

"What if we could predict equipment failures?"
"What if we could show you energy efficiency trends?"
"What if we could prevent the 2am fridge failure?"

The jump from monitoring to intelligence isn't a feature upgrade.

It's a capability expansion.

And customers who've seen the value of visibility are ready for the next level.`,
    hashtags: ['AssetIntelligence', 'CustomerSuccess', 'Upsell', 'CustomerValue']
  },
  {
    id: 'expand-3',
    category: 'expansion',
    personas: ['uk-cs', 'uk-vp-sales'],
    title: 'From Pilot to Enterprise',
    content: `The pilot went well. Now what?

The move from pilot to enterprise rollout is where value compounds:

→ Standardized processes across all locations
→ Central visibility for leadership
→ Benchmarking between sites
→ Enterprise-wide compliance assurance

The pilot proves the technology works.

The rollout proves the organization is committed to operational excellence.

Every successful pilot should have a rollout plan built in from day one.`,
    hashtags: ['EnterpriseSales', 'Pilot', 'CustomerSuccess', 'Rollout']
  },
  {
    id: 'expand-4',
    category: 'expansion',
    personas: ['us-vp-sales'],
    title: 'Referral-Driven Growth',
    content: `In specialized markets, referrals are everything.

Plasma center directors talk to each other.
Senior living operators share best practices.
NHS pharmacy groups compare notes.

When you deliver real value, customers become advocates.

The question is whether you're actively cultivating referrals or hoping they happen.

Every happy customer is a potential introduction.

Every success story is a conversation starter.

Referral-driven growth isn't passive. It's a strategy.`,
    hashtags: ['Referrals', 'CustomerSuccess', 'Growth', 'Sales']
  },

  // COMPLIANCE SIGNALS - ALL
  {
    id: 'comp-1',
    category: 'compliance',
    personas: ['ceo', 'uk-vp-sales', 'us-vp-sales', 'uk-food-retail'],
    title: 'Compliance Data as Early Warning',
    content: `Compliance scores don't just tell you about compliance.

They tell you about:
→ Management attention
→ Team engagement
→ Process effectiveness
→ Training quality
→ Staffing adequacy

A location with declining compliance isn't just a regulatory risk.

It's a signal that something else is wrong.

Use compliance data as an early warning system—not just a scorecard.`,
    hashtags: ['Compliance', 'LeadingIndicators', 'Operations', 'EarlyWarning']
  },
  {
    id: 'comp-2',
    category: 'compliance',
    personas: ['uk-vp-sales', 'uk-food-retail', 'us-senior-living'],
    title: 'Before the Auditor Arrives',
    content: `The best time to prepare for an audit is not the week before.

It's every day.

Real-time compliance visibility means:
→ You know exactly where you stand
→ Issues are caught and fixed immediately
→ Records are complete and accurate
→ There are no surprises

Audit anxiety is a symptom of reactive operations.

Audit confidence comes from predictive operations.

Which would you rather have?`,
    hashtags: ['AuditReady', 'Compliance', 'Operations', 'Proactive']
  },
  {
    id: 'comp-3',
    category: 'compliance',
    personas: ['uk-vp-sales', 'us-vp-sales', 'uk-food-retail'],
    title: 'The Cost of Non-Compliance',
    content: `Everyone knows the fine for a food safety violation.

But here's what the spreadsheet doesn't show:

→ Insurance premiums that spike 40% after an incident
→ The PR crisis that takes 6 months to recover from
→ The contracts you lose because enterprise buyers check your record
→ The store closures during investigation
→ The team members who leave because they're embarrassed

One incident can cost more than 10 years of prevention.

Compliance isn't a cost center. It's business continuity insurance.`,
    hashtags: ['Compliance', 'FoodSafety', 'RiskManagement', 'ROI']
  },

  // DIGITAL TRANSFORMATION - ALL
  {
    id: 'digital-1',
    category: 'predictive',
    personas: ['us-vp-sales', 'us-senior-living', 'ceo'],
    title: 'Digitizing Operations',
    content: `We put tablets in customers' hands.

We built apps for ordering, payments, loyalty.

We invested millions in front-of-house technology.

But walk into the back of house?

Clipboards. Paper logs. Filing cabinets.

The operational backbone—the stuff that keeps food safe, equipment running, compliance on track—is often 10 years behind.

That gap creates risk.

It's time to bring the same innovation mindset to operations that we brought to customer experience.`,
    hashtags: ['DigitalTransformation', 'Operations', 'Innovation', 'BackOfHouse']
  },
  {
    id: 'digital-2',
    category: 'predictive',
    personas: ['us-vp-sales', 'us-senior-living', 'us-medical'],
    title: 'From Paper to Predictive',
    content: `The journey from paper to predictive has stages:

Stage 1: Paper (where most still are)
Stage 2: Digital capture (same process, digital format)
Stage 3: Digital workflows (process improvement)
Stage 4: Monitoring (real-time visibility)
Stage 5: Predictive (seeing what's coming)

Most organizations try to jump from Stage 1 to Stage 5.

That doesn't work.

Each stage builds capability for the next.

The question isn't "where do you want to be?"

It's "what's your next step?"`,
    hashtags: ['DigitalTransformation', 'PredictiveOperations', 'ProcessImprovement']
  },
];

// Track used posts by persona: { personaId: Set of postIds }
type UsedPostsMap = Record<string, Set<string>>;

export default function SocialToolkitPage() {
  const [posts, setPosts] = useState<Post[]>(defaultPosts);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ title: string; content: string; hashtags: string }>({ title: '', content: '', hashtags: '' });
  const [showNewForm, setShowNewForm] = useState(false);
  const [showUsed, setShowUsed] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [scheduledPosts, setScheduledPosts] = useState<Record<string, string[]>>(() => {
    // postId -> array of ISO date strings when scheduled
    return {};
  });
  const [usedPosts, setUsedPosts] = useState<UsedPostsMap>(() => {
    // Initialize empty sets for each persona
    const initial: UsedPostsMap = {};
    personas.forEach(p => { initial[p.id] = new Set(); });
    return initial;
  });
  const [newForm, setNewForm] = useState<{ category: string; personas: string[]; title: string; content: string; hashtags: string }>({ 
    category: 'strategy', 
    personas: ['ceo'],
    title: '', 
    content: '', 
    hashtags: '' 
  });

  // Check if a post is used by the selected persona (or any persona if none selected)
  const isPostUsed = (postId: string): boolean => {
    if (selectedPersona) {
      return usedPosts[selectedPersona]?.has(postId) || false;
    }
    // If no persona selected, check if used by ALL personas it's tagged for
    const post = posts.find(p => p.id === postId);
    if (!post) return false;
    return post.personas.every(personaId => usedPosts[personaId]?.has(postId));
  };

  // Check if post is used by a specific persona
  const isPostUsedByPersona = (postId: string, personaId: string): boolean => {
    return usedPosts[personaId]?.has(postId) || false;
  };

  const filteredPosts = posts.filter(p => {
    const categoryMatch = !selectedCategory || p.category === selectedCategory;
    const personaMatch = !selectedPersona || p.personas.includes(selectedPersona);
    const usedMatch = showUsed || !isPostUsed(p.id);
    return categoryMatch && personaMatch && usedMatch;
  });

  const handleCopy = async (post: Post, markAsUsed: boolean = false) => {
    const fullPost = `${post.content}\n\n${post.hashtags.map(t => `#${t}`).join(' ')}`;
    await navigator.clipboard.writeText(fullPost);
    setCopiedId(post.id);
    
    if (markAsUsed && selectedPersona) {
      // Mark as used for the selected persona
      setUsedPosts(prev => {
        const newUsed = { ...prev };
        newUsed[selectedPersona] = new Set(prev[selectedPersona]);
        newUsed[selectedPersona].add(post.id);
        return newUsed;
      });
    }
    
    setTimeout(() => setCopiedId(null), 2000);
  };

  const markAsUsed = (postId: string, personaId: string) => {
    setUsedPosts(prev => {
      const newUsed = { ...prev };
      newUsed[personaId] = new Set(prev[personaId]);
      newUsed[personaId].add(postId);
      return newUsed;
    });
  };

  const markAsUnused = (postId: string, personaId: string) => {
    setUsedPosts(prev => {
      const newUsed = { ...prev };
      newUsed[personaId] = new Set(prev[personaId]);
      newUsed[personaId].delete(postId);
      return newUsed;
    });
  };

  const getUsedCount = (personaId?: string): number => {
    if (personaId) {
      return usedPosts[personaId]?.size || 0;
    }
    // Total unique used posts
    const allUsed = new Set<string>();
    Object.values(usedPosts).forEach(set => set.forEach(id => allUsed.add(id)));
    return allUsed.size;
  };

  const startEdit = (post: Post) => {
    setEditingId(post.id);
    setEditForm({
      title: post.title,
      content: post.content,
      hashtags: post.hashtags.join(', ')
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: '', content: '', hashtags: '' });
  };

  const saveEdit = (postId: string) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          title: editForm.title,
          content: editForm.content,
          hashtags: editForm.hashtags.split(',').map(t => t.trim()).filter(t => t)
        };
      }
      return p;
    }));
    setEditingId(null);
  };

  const deletePost = (postId: string) => {
    if (confirm('Delete this post?')) {
      setPosts(posts.filter(p => p.id !== postId));
    }
  };

  const addNewPost = () => {
    const newPost: Post = {
      id: `new-${Date.now()}`,
      category: newForm.category,
      personas: newForm.personas,
      title: newForm.title,
      content: newForm.content,
      hashtags: newForm.hashtags.split(',').map(t => t.trim()).filter(t => t)
    };
    setPosts([newPost, ...posts]);
    setShowNewForm(false);
    setNewForm({ category: 'strategy', personas: ['ceo'], title: '', content: '', hashtags: '' });
  };

  const togglePersonaInNew = (personaId: string) => {
    if (newForm.personas.includes(personaId)) {
      setNewForm({ ...newForm, personas: newForm.personas.filter(p => p !== personaId) });
    } else {
      setNewForm({ ...newForm, personas: [...newForm.personas, personaId] });
    }
  };

  const getPersonaColor = (personaId: string) => {
    const persona = personas.find(p => p.id === personaId);
    switch (persona?.color) {
      case 'amber': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'blue': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'emerald': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'rose': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'cyan': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'purple': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'orange': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'green': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    return { daysInMonth, startingDay };
  };

  const getDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const schedulePost = (postId: string, dateKey: string) => {
    setScheduledPosts(prev => {
      const existing = prev[postId] || [];
      if (existing.includes(dateKey)) {
        // Remove if already scheduled
        return { ...prev, [postId]: existing.filter(d => d !== dateKey) };
      }
      return { ...prev, [postId]: [...existing, dateKey] };
    });
  };

  const getPostsForDate = (dateKey: string) => {
    return Object.entries(scheduledPosts)
      .filter(([_, dates]) => dates.includes(dateKey))
      .map(([postId]) => posts.find(p => p.id === postId))
      .filter(Boolean) as Post[];
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Crown className="w-7 h-7 text-amber-400" />
              Social Toolkit
            </h1>
            <p className="text-sm text-muted mt-1">
              Thought leadership posts for the team • Copy, edit, and track usage
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center bg-surface-elevated rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-accent text-white'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                <List className="w-4 h-4" />
                List
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'calendar'
                    ? 'bg-accent text-white'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Calendar
              </button>
            </div>
            <button
              onClick={() => setShowNewForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Post
            </button>
          </div>
        </div>

        {/* Persona Filter */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted uppercase tracking-wider">Filter by person</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedPersona(null)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedPersona === null
                  ? 'btn-gradient text-white'
                  : 'bg-surface-elevated text-muted hover:text-foreground'
              }`}
            >
              All Team
            </button>
            {personas.map((persona) => {
              const Icon = persona.icon;
              const totalCount = posts.filter(p => p.personas.includes(persona.id)).length;
              const usedCount = getUsedCount(persona.id);
              const availableCount = totalCount - usedCount;
              return (
                <button
                  key={persona.id}
                  onClick={() => setSelectedPersona(persona.id === selectedPersona ? null : persona.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedPersona === persona.id
                      ? 'btn-gradient text-white'
                      : 'bg-surface-elevated text-muted hover:text-foreground'
                  }`}
                  title={`${persona.focus}\n${availableCount} available, ${usedCount} used`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {persona.name}
                  <span className="text-xs opacity-60">
                    {showUsed ? totalCount : availableCount}
                    {usedCount > 0 && !showUsed && <span className="text-accent ml-0.5">/{totalCount}</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6 sticky top-16 bg-background py-4 z-10 border-b border-border">
          <p className="text-xs text-muted mb-2 uppercase tracking-wider">Filter by topic</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === null
                  ? 'bg-accent text-white'
                  : 'bg-surface-elevated text-muted hover:text-foreground'
              }`}
            >
              All Topics
            </button>
            {categories.map((cat) => {
              const Icon = cat.icon;
              const count = posts.filter(p => p.category === cat.id && (!selectedPersona || p.personas.includes(selectedPersona))).length;
              if (count === 0 && selectedPersona) return null;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-accent text-white'
                      : 'bg-surface-elevated text-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.name}
                  <span className="text-xs opacity-60">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* New Post Form */}
        {showNewForm && (
          <div className="mb-6 bg-surface border border-accent/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">New Post</h3>
              <button onClick={() => setShowNewForm(false)} className="text-muted hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted mb-1">Category</label>
                  <select
                    value={newForm.category}
                    onChange={(e) => setNewForm({ ...newForm, category: e.target.value })}
                    className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-foreground text-sm"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-muted mb-1">Title</label>
                  <input
                    type="text"
                    value={newForm.title}
                    onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                    className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-foreground text-sm"
                    placeholder="Post title..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Who should post this?</label>
                <div className="flex flex-wrap gap-2">
                  {personas.map((persona) => (
                    <button
                      key={persona.id}
                      onClick={() => togglePersonaInNew(persona.id)}
                      className={`px-3 py-1 rounded text-xs font-medium border transition-all ${
                        newForm.personas.includes(persona.id)
                          ? getPersonaColor(persona.id)
                          : 'bg-surface-elevated text-muted border-border hover:border-accent/30'
                      }`}
                    >
                      {persona.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Content</label>
                <textarea
                  value={newForm.content}
                  onChange={(e) => setNewForm({ ...newForm, content: e.target.value })}
                  className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-foreground text-sm min-h-[200px] font-sans"
                  placeholder="Write your post..."
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Hashtags (comma-separated)</label>
                <input
                  type="text"
                  value={newForm.hashtags}
                  onChange={(e) => setNewForm({ ...newForm, hashtags: e.target.value })}
                  className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-foreground text-sm"
                  placeholder="PredictiveOperations, Leadership, IoT"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowNewForm(false)}
                  className="px-4 py-2 text-muted hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addNewPost}
                  disabled={!newForm.title || !newForm.content || newForm.personas.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  Add Post
                </button>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'list' ? (
          <>
            {/* Results count */}
            <div className="mb-4 text-sm text-muted">
              Showing {filteredPosts.length} posts
              {selectedPersona && ` for ${personas.find(p => p.id === selectedPersona)?.name}`}
              {selectedCategory && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
            </div>

            {/* Posts */}
            <div className="space-y-4">
          {filteredPosts.map((post) => {
            const category = categories.find(c => c.id === post.category);
            const isEditing = editingId === post.id;
            const postIsUsed = isPostUsed(post.id);
            
            return (
              <div
                key={post.id}
                className={`bg-surface border rounded-xl p-5 transition-colors ${
                  isEditing ? 'border-accent/50' : postIsUsed ? 'border-green-500/30 opacity-60' : 'border-border hover:border-accent/30'
                }`}
              >
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted">{category?.name}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={cancelEdit} className="text-muted hover:text-foreground text-sm">Cancel</button>
                        <button onClick={() => saveEdit(post.id)} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600">
                          <Save className="w-4 h-4" /> Save
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-foreground font-semibold"
                    />
                    <textarea
                      value={editForm.content}
                      onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                      className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-foreground text-sm min-h-[250px] font-sans leading-relaxed"
                    />
                    <input
                      type="text"
                      value={editForm.hashtags}
                      onChange={(e) => setEditForm({ ...editForm, hashtags: e.target.value })}
                      placeholder="Hashtags (comma-separated)"
                      className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-accent text-sm"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted">{category?.name}</span>
                          {postIsUsed && (
                            <span className="flex items-center gap-1 text-xs text-green-400">
                              <CheckCircle2 className="w-3 h-3" />
                              Used
                            </span>
                          )}
                        </div>
                        <h3 className={`text-base font-semibold ${postIsUsed ? 'text-muted' : 'text-foreground'}`}>{post.title}</h3>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {post.personas.map(personaId => {
                            const persona = personas.find(p => p.id === personaId);
                            const usedByThisPersona = isPostUsedByPersona(post.id, personaId);
                            return persona ? (
                              <span 
                                key={personaId} 
                                className={`px-2 py-0.5 text-xs rounded border flex items-center gap-1 ${getPersonaColor(personaId)} ${usedByThisPersona ? 'opacity-50' : ''}`}
                              >
                                {usedByThisPersona && <CheckCircle2 className="w-2.5 h-2.5" />}
                                {persona.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => startEdit(post)} className="p-2 text-muted hover:text-foreground hover:bg-surface-elevated rounded-lg" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => deletePost(post.id)} className="p-2 text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {selectedPersona && isPostUsedByPersona(post.id, selectedPersona) ? (
                          <button
                            onClick={() => markAsUnused(post.id, selectedPersona)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ml-1 bg-surface-elevated text-muted hover:text-foreground"
                            title="Mark as unused (can use again)"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Reuse
                          </button>
                        ) : (
                          <button
                            onClick={() => handleCopy(post, true)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ml-1 ${
                              copiedId === post.id
                                ? 'bg-green-500 text-white'
                                : 'bg-accent text-white hover:bg-accent-hover'
                            }`}
                            title={selectedPersona ? "Copy and mark as used" : "Copy (select a person to track usage)"}
                          >
                            {copiedId === post.id ? (
                              <><Check className="w-3.5 h-3.5" /> Done</>
                            ) : (
                              <><Copy className="w-3.5 h-3.5" /> {selectedPersona ? 'Copy & Use' : 'Copy'}</>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className={`bg-background rounded-lg p-4 mb-3 border border-border ${postIsUsed ? 'opacity-75' : ''}`}>
                      <pre className="text-foreground/80 text-sm whitespace-pre-wrap font-sans leading-relaxed">{post.content}</pre>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {post.hashtags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 text-xs bg-surface-elevated text-accent rounded">#{tag}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12 text-muted">
                No posts match the current filters.
              </div>
            )}
          </>
        ) : (
          /* Calendar View */
          <div className="space-y-4">
            {/* Instruction Bar */}
            <div className={`p-4 rounded-xl border transition-all ${
              selectedPostId 
                ? 'bg-accent/10 border-accent/30' 
                : 'bg-surface border-border'
            }`}>
              {selectedPostId ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-foreground">
                      Selected: <span className="text-accent">{posts.find(p => p.id === selectedPostId)?.title}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted">Click any date to schedule</span>
                    <button
                      onClick={() => setSelectedPostId(null)}
                      className="px-3 py-1 text-sm bg-surface-elevated text-muted hover:text-foreground rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-sm text-muted">
                  <Calendar className="w-4 h-4" />
                  <span>Select a post below, then click a date to schedule it. Click scheduled posts to remove them.</span>
                </div>
              )}
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={prevMonth}
                  className="p-2 text-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-semibold text-foreground">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h2>
                <button
                  onClick={nextMonth}
                  className="p-2 text-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-xs text-muted py-2 font-medium">
                    {day}
                  </div>
                ))}

                {/* Calendar Days */}
                {(() => {
                  const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
                  const days = [];
                  const today = new Date();
                  const isCurrentMonth = today.getMonth() === currentMonth.getMonth() && today.getFullYear() === currentMonth.getFullYear();

                  // Empty cells for days before the month starts
                  for (let i = 0; i < startingDay; i++) {
                    days.push(<div key={`empty-${i}`} className="min-h-[100px] bg-surface-elevated/30 rounded-lg" />);
                  }

                  // Days of the month
                  for (let day = 1; day <= daysInMonth; day++) {
                    const dateKey = getDateKey(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                    const scheduledForDay = getPostsForDate(dateKey);
                    const isToday = isCurrentMonth && today.getDate() === day;

                    days.push(
                      <div
                        key={day}
                        onClick={() => {
                          if (selectedPostId) {
                            schedulePost(selectedPostId, dateKey);
                            setSelectedPostId(null);
                          }
                        }}
                        className={`min-h-[100px] bg-surface-elevated rounded-lg p-2 transition-all ${
                          isToday ? 'ring-2 ring-accent' : ''
                        } ${
                          selectedPostId 
                            ? 'cursor-pointer hover:bg-accent/20 hover:ring-2 hover:ring-accent/50' 
                            : ''
                        }`}
                      >
                        <div className={`text-sm font-medium mb-1 ${isToday ? 'text-accent' : 'text-muted'}`}>
                          {day}
                        </div>
                        <div className="space-y-1">
                          {scheduledForDay.slice(0, 3).map((post) => {
                            const persona = personas.find(p => post.personas.includes(p.id));
                            return (
                              <div
                                key={post.id}
                                className={`text-[10px] px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80 flex items-center gap-1 ${getPersonaColor(persona?.id || '')}`}
                                title={`${post.title}\nClick to remove from this date`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  schedulePost(post.id, dateKey);
                                }}
                              >
                                <X className="w-2.5 h-2.5 opacity-60" />
                                <span className="truncate">{post.title}</span>
                              </div>
                            );
                          })}
                          {scheduledForDay.length > 3 && (
                            <div className="text-[10px] text-muted">+{scheduledForDay.length - 3} more</div>
                          )}
                        </div>
                      </div>
                    );
                  }

                  return days;
                })()}
              </div>
            </div>

            {/* Posts to Schedule */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                <span>Posts to Schedule</span>
                <span className="text-xs text-muted font-normal">({filteredPosts.length} available)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredPosts.map((post) => {
                  const scheduled = scheduledPosts[post.id]?.length > 0;
                  const isSelected = selectedPostId === post.id;
                  return (
                    <div
                      key={post.id}
                      onClick={() => setSelectedPostId(isSelected ? null : post.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-accent/20 border-accent ring-2 ring-accent'
                          : scheduled
                            ? 'bg-green-500/10 border-green-500/30 hover:border-green-500/50'
                            : 'bg-surface-elevated border-border hover:border-accent/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${isSelected ? 'text-accent' : 'text-foreground'}`}>
                            {post.title}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {post.personas.slice(0, 2).map(personaId => {
                              const persona = personas.find(p => p.id === personaId);
                              return persona ? (
                                <span key={personaId} className={`px-1.5 py-0.5 text-[10px] rounded ${getPersonaColor(personaId)}`}>
                                  {persona.name}
                                </span>
                              ) : null;
                            })}
                            {post.personas.length > 2 && (
                              <span className="text-[10px] text-muted">+{post.personas.length - 2}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          {scheduled && (
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                          )}
                          {isSelected && (
                            <div className="w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                      {scheduledPosts[post.id]?.length > 0 && (
                        <div className="mt-2 text-[10px] text-muted">
                          Scheduled: {scheduledPosts[post.id].map(d => {
                            const [year, month, dayNum] = d.split('-');
                            return `${parseInt(month)}/${parseInt(dayNum)}`;
                          }).join(', ')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 p-4 bg-surface border border-border rounded-xl">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-accent">{posts.length}</div>
              <div className="text-xs text-muted">Total Posts</div>
            </div>
            <div>
              <div className="text-xl font-bold text-accent">{personas.length}</div>
              <div className="text-xs text-muted">Team Members</div>
            </div>
            <div>
              <div className="text-xl font-bold text-accent">{categories.length}</div>
              <div className="text-xs text-muted">Topics</div>
            </div>
            <div>
              <div className="text-xl font-bold text-accent">2-3x</div>
              <div className="text-xs text-muted">/Week Goal</div>
            </div>
            <div>
              <div className="text-xl font-bold text-accent">{Math.ceil(posts.length / (personas.length * 2))}</div>
              <div className="text-xs text-muted">Weeks/Person</div>
            </div>
            <div>
              <div className="text-xl font-bold text-accent">{posts.length * personas.length}</div>
              <div className="text-xs text-muted">Potential Reach</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
