// Seed positioning data via API
const positioningData = {
  companyName: "Checkit",
  sections: [
    {
      id: "mission-vision",
      name: "Mission & Vision",
      order: 1,
      fields: [
        {
          id: "mission",
          label: "Mission Statement",
          type: "textarea",
          value: "To eliminate unnecessary operational waste that costs companies precious time, money, and opportunities. We provide connected digital solutions that enable organizations to thrive in this new era of working by generating better data, implementing smarter processes, and unlocking intelligence faster.",
          placeholder: "Why does Checkit exist? What problem do we solve?"
        },
        {
          id: "vision",
          label: "Vision Statement",
          type: "textarea",
          value: "To turn operational waste into predictive operations. We are transforming how organizations manage frontline operations by replacing wasteful, error-prone manual systems with proven digital solutions that are predictable, scalable, and simple.",
          placeholder: "Where is Checkit headed? What future are we building?"
        }
      ]
    },
    {
      id: "target-markets",
      name: "Target Markets",
      order: 2,
      fields: [
        {
          id: "primary-verticals",
          label: "Primary Verticals",
          type: "textarea",
          value: `• Food & Beverage - restaurants, food manufacturing, commercial kitchens
• Healthcare - hospitals, clinics, medical facilities
• Care Homes - senior care, assisted living
• Hospitality - hotels, resorts, event venues
• Retail - grocery, convenience stores
• Pharma & Biotech - laboratories, manufacturing
• Higher Education - universities, research facilities`,
          placeholder: "e.g., Healthcare, Food Safety, Hospitality"
        },
        {
          id: "buyer-personas",
          label: "Buyer Personas",
          type: "textarea",
          value: `• Operations Directors/VPs - Responsible for multi-site operational performance, looking for visibility and control
• Compliance/Quality Managers - Need audit-ready documentation and consistent processes
• Facilities Managers - Managing assets, equipment maintenance, and environmental conditions
• Food Safety Managers - Ensuring HACCP compliance, temperature monitoring, and food safety protocols
• IT Directors - Evaluating technology solutions, concerned with integration and security`,
          placeholder: "Who are our primary buyers?"
        },
        {
          id: "user-personas",
          label: "User Personas",
          type: "textarea",
          value: `• Frontline Workers - Using mobile apps to complete guided workflows and daily tasks
• Site Managers - Monitoring site performance, managing teams, responding to alerts
• Regional Managers - Overseeing multiple sites, comparing performance, identifying issues
• Auditors - Pulling compliance reports and reviewing documentation`,
          placeholder: "Who uses the product day-to-day?"
        }
      ]
    },
    {
      id: "value-proposition",
      name: "Value Proposition",
      order: 3,
      fields: [
        {
          id: "core-promise",
          label: "Core Value Promise",
          type: "textarea",
          value: "One platform, total operational foresight. Checkit frees up your frontline workers and provides visibility and intelligence into your sites, assets, and operational workflows - giving you the foresight needed to deliver exceptional customer experiences and drive better outcomes.",
          placeholder: "The single most important benefit we deliver"
        },
        {
          id: "key-benefits",
          label: "Key Benefits",
          type: "textarea",
          value: `• Improve margins through operational efficiency
• Gain centralized operational visibility across all sites
• Eliminate inefficiencies from manual, paper-based processes
• Predict maintenance needs before equipment fails
• Optimize stock placement and reduce waste
• Achieve audit-readiness with automatic compliance documentation
• Accelerate onboarding and reduce training costs`,
          placeholder: "Top 3-5 benefits"
        },
        {
          id: "proof-points",
          label: "Proof Points",
          type: "textarea",
          value: `• Trusted by leading organizations across Food & Beverage, Healthcare, Hospitality, and Retail
• Real-time monitoring across multiple environmental conditions (temperature, humidity, equipment status)
• Secure cloud-based platform with audit-ready reporting
• Proven ROI through reduced waste, fewer compliance failures, and improved operational efficiency`,
          placeholder: "Evidence that supports our claims"
        }
      ]
    },
    {
      id: "differentiators",
      name: "Key Differentiators",
      order: 4,
      fields: [
        { id: "diff-1", label: "Differentiator 1", type: "text", value: "Predictive Operations (Not Just Reactive Compliance)", placeholder: "What makes us unique?" },
        { id: "diff-1-detail", label: "Detail", type: "textarea", value: "Unlike traditional compliance tools that simply record what happened, Checkit uses Asset Intelligence to anticipate problems before they occur. We help organizations predict compliance risks, equipment failures, and operational issues - transforming data into predictability rather than just documentation.", placeholder: "Explain why this matters" },
        { id: "diff-2", label: "Differentiator 2", type: "text", value: "Unified Platform: Workflows + IoT Monitoring", placeholder: "What makes us unique?" },
        { id: "diff-2-detail", label: "Detail", type: "textarea", value: "Competitors typically offer either workflow management OR sensor monitoring. Checkit uniquely combines both in a single integrated platform - guided digital workflows for human tasks plus automated IoT sensors for continuous environmental monitoring. This eliminates the need to stitch together multiple point solutions.", placeholder: "Explain why this matters" },
        { id: "diff-3", label: "Differentiator 3", type: "text", value: "Domain Expertise + Connected Technology", placeholder: "What makes us unique?" },
        { id: "diff-3-detail", label: "Detail", type: "textarea", value: "Checkit combines proprietary data models with in-house domain expertise across food safety, healthcare, and operational compliance. We're not just a generic software vendor - we understand the specific regulatory requirements, operational challenges, and best practices in each industry we serve.", placeholder: "Explain why this matters" }
      ]
    },
    {
      id: "messaging-pillars",
      name: "Messaging Pillars",
      order: 5,
      fields: [
        { id: "pillar-1", label: "Pillar 1", type: "text", value: "Predictability", placeholder: "e.g., Proactive Compliance" },
        { id: "pillar-1-detail", label: "Supporting Points", type: "textarea", value: `• From HQ, spot essential details: Is work being done on time? Is equipment operating as it should?
• Track performance by site, team, and process
• Intervene before dips in performance turn into major issues
• Transform data into predictability, not just documentation`, placeholder: "Key messages" },
        { id: "pillar-2", label: "Pillar 2", type: "text", value: "Scalability", placeholder: "e.g., Operational Visibility" },
        { id: "pillar-2-detail", label: "Supporting Points", type: "textarea", value: `• Real-time monitoring across multiple conditions from a single cloud system
• Continuous automated recording of temperature, humidity, equipment status
• Unified collaboration across all sites and teams
• Consistent operations whether you have 10 sites or 1,000`, placeholder: "Key messages" },
        { id: "pillar-3", label: "Pillar 3", type: "text", value: "Simplicity", placeholder: "e.g., Effortless Audits" },
        { id: "pillar-3-detail", label: "Supporting Points", type: "textarea", value: `• Staff carry out the right tasks, the right way, without fail
• Guided workflows that boost quality while reducing risk and training costs
• Transform manual tasks into intuitive digital processes
• Accelerate onboarding and seamlessly manage flexible teams`, placeholder: "Key messages" }
      ]
    },
    {
      id: "elevator-pitches",
      name: "Elevator Pitches",
      order: 6,
      fields: [
        { id: "pitch-10s", label: "10-Second Pitch", type: "textarea", value: "Checkit is a predictive operations platform that helps organizations digitize workflows, automate monitoring, and gain real-time visibility across all their sites and assets.", placeholder: "One sentence" },
        { id: "pitch-30s", label: "30-Second Pitch", type: "textarea", value: "Checkit replaces paper-based processes and disconnected systems with one integrated platform for operational compliance. We combine guided digital workflows for your frontline teams with IoT sensors that automatically monitor temperature, equipment, and environmental conditions. The result? Total operational foresight - you can predict problems before they happen, ensure compliance without the paperwork burden, and improve margins across every site.", placeholder: "A brief paragraph" },
        { id: "pitch-2m", label: "2-Minute Pitch", type: "textarea", value: `Every day, organizations waste time and money on manual compliance processes - clipboards, spreadsheets, disconnected systems. Managers lack visibility into what's actually happening at their sites. Equipment fails without warning. Audits become fire drills.

Checkit solves this by providing one platform for total operational foresight.

First, we digitize your workflows. Your frontline teams use our mobile app to complete guided tasks - ensuring consistent execution, reducing training time, and capturing compliance evidence automatically.

Second, we automate monitoring. Our IoT sensors continuously track temperature, humidity, and equipment status - alerting the right people when something needs attention, before it becomes a problem.

Third, we provide actionable intelligence. Real-time dashboards give you visibility across all your sites. You can compare performance, identify issues, and make data-driven decisions.

The result is predictive operations. Instead of reacting to compliance failures and equipment breakdowns, you can anticipate and prevent them. Our customers see improved margins, fewer audit issues, and better operational outcomes.

We work with organizations in food service, healthcare, hospitality, retail, and pharma - anywhere operational compliance matters. Would you like to see a demo?`, placeholder: "Full pitch" }
      ]
    },
    {
      id: "objection-handling",
      name: "Objection Handling",
      order: 7,
      fields: [
        { id: "objection-1", label: "Common Objection 1", type: "text", value: "We already have a system for this", placeholder: "Common objection" },
        { id: "response-1", label: "Response", type: "textarea", value: "Most organizations have some system - often paper-based, spreadsheets, or point solutions. The question is: does it give you predictive visibility? Can you see across all sites in real-time? Does it automatically capture compliance evidence? Checkit uniquely combines workflow management AND automated monitoring in one platform, eliminating the need to stitch together multiple tools. Our customers typically replace 3-4 disconnected systems.", placeholder: "How to address" },
        { id: "objection-2", label: "Common Objection 2", type: "text", value: "It seems expensive / We need to see ROI", placeholder: "Common objection" },
        { id: "response-2", label: "Response", type: "textarea", value: "The cost of NOT having visibility is much higher - compliance failures, equipment breakdowns, wasted inventory, inefficient labor. Our customers typically see ROI within months through: reduced food waste from temperature excursions, fewer failed audits and associated fines, lower training costs with guided workflows, and prevented equipment failures through predictive maintenance. We can model the ROI for your specific operation.", placeholder: "How to address" },
        { id: "objection-3", label: "Common Objection 3", type: "text", value: "Our frontline team won't adopt new technology", placeholder: "Common objection" },
        { id: "response-3", label: "Response", type: "textarea", value: "This is actually where Checkit excels. Our mobile app is designed for frontline workers - intuitive, guided workflows that are easier than paper. Simplicity is one of our three core pillars. We accelerate onboarding because new staff just follow the app. And because tasks are digital, managers can see completion in real-time rather than chasing down paperwork. Teams actually prefer it once they experience how much easier their day becomes.", placeholder: "How to address" }
      ]
    },
    {
      id: "competitive-stance",
      name: "Competitive Stance",
      order: 8,
      fields: [
        { id: "positioning-statement", label: "Competitive Positioning Statement", type: "textarea", value: "Checkit is the only predictive operations platform that combines guided digital workflows with automated IoT monitoring in a single, unified solution. While competitors focus on either task management OR sensor monitoring, we deliver both - plus the asset intelligence to anticipate problems before they occur.", placeholder: "How we position against the market" },
        { id: "win-themes", label: "Win Themes", type: "textarea", value: `• Unified platform vs. point solutions - one system instead of many
• Predictive vs. reactive - anticipate problems, don't just document them
• Domain expertise - we understand food safety, healthcare compliance, operational regulations
• Simplicity for frontline - designed for workers, not just managers
• Scalability - works for 10 sites or 1,000`, placeholder: "Why customers choose us" },
        { id: "land-mines", label: "Competitive Land Mines", type: "textarea", value: `Ask competitors:
• Can your platform predict equipment failures before they happen?
• How do you combine workflow management with automated monitoring?
• What domain expertise do you have in [food safety/healthcare/specific industry]?
• How quickly can frontline workers be trained on your mobile app?
• Can you show me a single dashboard across all sites and all data types?`, placeholder: "Questions to plant" }
      ]
    }
  ]
};

async function seed() {
  console.log('Seeding positioning data via API...');
  
  const res = await fetch('http://localhost:3000/api/positioning', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: positioningData,
      changeNotes: 'Initial version populated with Checkit company research from checkit.net'
    })
  });
  
  const result = await res.json();
  console.log('Result:', result);
}

seed().catch(console.error);
