// PPC Landing Page Configuration
// Add categories as needed. Each entry creates a landing page at /capterra/[slug]

export interface CapterraCategory {
  slug: string;
  category: string;       // Capterra listing category name
  headline: string;
  subheadline: string;
  benefits: string[];
  metaTitle: string;
  ctaText: string;
}

// ============================================================
// CAPTERRA LISTING CATEGORIES
// Each entry generates a page at: /capterra/{slug}
//
// Full Capterra category list (uncomment to activate):
//   - Asset Tracking
//   - Audit
//   - Business Performance Management
//   - Calibration Management
//   - Compliance
//   - EAM (Enterprise Asset Management)
//   - EHS Management
//   - Environmental
//   - Fixed Asset Management
//   - Food Service Management
//   - Forms Automation
//   - Governance, Risk and Compliance (GRC)
//   - Inspection
//   - IoT                    ✅ ACTIVE
//   - IoT Analytics          ✅ ACTIVE
//   - Nursing Home
//   - Quality Management
//   - Risk Management
//   - Training
//   - Workforce Management
// ============================================================
export const capterraCategories: Record<string, CapterraCategory> = {
  'iot': {
    slug: 'iot',
    category: 'IoT Software',
    headline: 'IoT Sensors and Software Built for Operational Compliance',
    subheadline: 'Connect temperature, humidity, door, and environmental sensors to a single platform — with automated alerts, digital checklists, and a complete audit trail.',
    benefits: [
      '24/7 automated monitoring with wireless IoT sensors',
      'Instant alerts when readings go out of range',
      'Digital checklists replace paper-based processes',
      'Multi-site visibility from one cloud dashboard',
    ],
    metaTitle: 'Checkit | IoT Software - Request a Demo',
    ctaText: 'Get Your Free Demo',
  },
  'iot-analytics': {
    slug: 'iot-analytics',
    category: 'IoT Analytics Software',
    headline: 'Turn Sensor Data Into Operational Intelligence',
    subheadline: 'Go beyond raw data. Checkit transforms IoT sensor feeds into actionable compliance insights, trend analysis, and real-time dashboards across every location.',
    benefits: [
      'Real-time dashboards across all sites and sensors',
      'Trend analysis to spot issues before they become failures',
      'Automated compliance reporting for audits and regulators',
      'Exception-based alerts so you only act on what matters',
    ],
    metaTitle: 'Checkit | IoT Analytics Software - Request a Demo',
    ctaText: 'Get Your Free Demo',
  },
  'asset-tracking': {
    slug: 'asset-tracking',
    category: 'Asset Tracking Software',
    headline: 'Track Every Asset Across Every Location in Real Time',
    subheadline: 'Know the status, condition, and compliance history of every piece of equipment across your estate — from fridges and freezers to safety-critical assets.',
    benefits: [
      'Real-time asset status across all sites',
      'Automated condition monitoring with IoT sensors',
      'Full maintenance and calibration history per asset',
      'Proactive failure alerts before equipment goes down',
    ],
    metaTitle: 'Checkit | Asset Tracking Software - Request a Demo',
    ctaText: 'Get Your Free Demo',
  },
  'audit': {
    slug: 'audit',
    category: 'Audit Software',
    headline: 'Audit-Ready in Seconds, Not Weeks',
    subheadline: 'Replace paper logs and manual record-gathering with automated digital audit trails. Every check, every sensor reading, every corrective action — timestamped and traceable.',
    benefits: [
      'Complete digital audit trail for every check and reading',
      'Generate compliance reports in seconds',
      'Photo evidence and GPS tagging on every inspection',
      'Full traceability from sensor reading to corrective action',
    ],
    metaTitle: 'Checkit | Audit Software - Request a Demo',
    ctaText: 'Get Your Free Demo',
  },
  'business-performance-management': {
    slug: 'business-performance-management',
    category: 'Business Performance Management Software',
    headline: 'Measure Operational Performance Across Every Site',
    subheadline: 'Get real-time visibility into compliance rates, task completion, and operational KPIs across your entire estate — so you can manage by exception, not guesswork.',
    benefits: [
      'Multi-site performance dashboards in real time',
      'Compliance rate tracking by site, team, and time period',
      'Exception-based management — focus on what needs attention',
      'Benchmark and compare performance across locations',
    ],
    metaTitle: 'Checkit | Business Performance Management - Request a Demo',
    ctaText: 'Get Your Free Demo',
  },
  'calibration-management': {
    slug: 'calibration-management',
    category: 'Calibration Management Software',
    headline: 'UKAS-Accredited Calibration You Can Trust',
    subheadline: 'Manage sensor calibration schedules, certificates, and compliance from a single platform — backed by our own ISO 17025 accredited calibration laboratory.',
    benefits: [
      'ISO 17025 / UKAS accredited calibration lab',
      'Automated calibration scheduling and reminders',
      'Digital calibration certificates per sensor',
      'Full calibration history and traceability',
    ],
    metaTitle: 'Checkit | Calibration Management Software - Request a Demo',
    ctaText: 'Get Your Free Demo',
  },
  'compliance': {
    slug: 'compliance',
    category: 'Compliance Software',
    headline: 'Automate Compliance Across Every Location',
    subheadline: 'Replace paper processes with real-time digital compliance monitoring. Automated sensor readings, guided checklists, and audit-ready reports — trusted by 500+ locations.',
    benefits: [
      'Automated compliance monitoring 24/7',
      'Digital checklists with timestamped evidence',
      'Audit-ready reports generated in seconds',
      'Real-time alerts when compliance gaps emerge',
    ],
    metaTitle: 'Checkit | Compliance Software - Request a Demo',
    ctaText: 'Get Your Free Demo',
  },
  'eam': {
    slug: 'eam',
    category: 'Enterprise Asset Management Software',
    headline: 'Monitor and Manage Assets Across Your Entire Estate',
    subheadline: 'Combine IoT sensor monitoring with digital checklists to track asset health, automate maintenance workflows, and prevent costly equipment failures.',
    benefits: [
      'Continuous IoT monitoring of equipment condition',
      'Predictive alerts before assets fail',
      'Digital maintenance logs with full audit trail',
      'Multi-site asset visibility from one dashboard',
    ],
    metaTitle: 'Checkit | Enterprise Asset Management - Request a Demo',
    ctaText: 'Get Your Free Demo',
  },
  'ehs-management': {
    slug: 'ehs-management',
    category: 'EHS Management Software',
    headline: 'Digitize Environment, Health & Safety Compliance',
    subheadline: 'Automate safety checks, environmental monitoring, and incident recording across every site — with guided mobile workflows and real-time dashboards.',
    benefits: [
      'Automated environmental monitoring (temp, humidity, CO₂)',
      'Digital safety checklists with photo evidence',
      'Real-time alerts for out-of-range conditions',
      'Audit-ready EHS reporting across all sites',
    ],
    metaTitle: 'Checkit | EHS Management Software - Request a Demo',
    ctaText: 'Get Your Free Demo',
  },
  'environmental': {
    slug: 'environmental',
    category: 'Environmental Software',
    headline: 'Continuous Environmental Monitoring Across Every Site',
    subheadline: 'Monitor temperature, humidity, CO₂, and air quality with wireless IoT sensors — 24/7, across every location, with instant alerts when conditions go out of range.',
    benefits: [
      '24/7 temperature, humidity, and air quality monitoring',
      'Wireless sensors with 5-year battery life',
      'Instant SMS and email alerts for breaches',
      'Historical trend data for analysis and reporting',
    ],
    metaTitle: 'Checkit | Environmental Monitoring Software - Request a Demo',
    ctaText: 'Get Your Free Demo',
  },
  'fixed-asset-management': {
    slug: 'fixed-asset-management',
    category: 'Fixed Asset Management Software',
    headline: 'Full Visibility Into Every Fixed Asset Across Your Sites',
    subheadline: 'Track equipment status, maintenance history, and sensor readings for every fixed asset — from fridges and HVAC to production equipment and safety systems.',
    benefits: [
      'IoT-connected monitoring for critical equipment',
      'Automated maintenance scheduling and tracking',
      'Complete asset history with calibration records',
      'Multi-site asset dashboard with drill-down views',
    ],
    metaTitle: 'Checkit | Fixed Asset Management Software - Request a Demo',
    ctaText: 'Get Your Free Demo',
  },
  'food-service-management': {
    slug: 'food-service-management',
    category: 'Food Service Management Software',
    headline: 'Digitize Food Safety and Kitchen Operations',
    subheadline: 'Automate temperature monitoring, HACCP checklists, cleaning schedules, and food safety compliance across every kitchen and food service location.',
    benefits: [
      'Automated fridge and freezer temperature monitoring',
      'Digital HACCP and food safety checklists',
      'Guided workflows for opening, closing, and cleaning',
      'Audit-ready food safety records with photo evidence',
    ],
    metaTitle: 'Checkit | Food Service Management Software - Request a Demo',
    ctaText: 'Get Your Free Demo',
  },
  'forms-automation': {
    slug: 'forms-automation',
    category: 'Forms Automation Software',
    headline: 'Replace Paper Forms With Guided Digital Workflows',
    subheadline: 'Digitize checklists, inspections, and operational forms across your sites — with timestamped entries, photo evidence, GPS tagging, and automatic cloud sync.',
    benefits: [
      'Guided mobile checklists your team completes on their phone',
      'Timestamped, photo-verified, GPS-tagged — every time',
      'Works offline and syncs automatically',
      'Configurable forms for any workflow or process',
    ],
    metaTitle: 'Checkit | Forms Automation Software - Request a Demo',
    ctaText: 'Get Your Free Demo',
  },
  'grc': {
    slug: 'grc',
    category: 'Governance, Risk & Compliance Software',
    headline: 'Automate Governance, Risk, and Compliance at Scale',
    subheadline: 'Combine IoT monitoring with digital workflows to enforce compliance policies, track risk indicators, and generate governance reports across your entire operation.',
    benefits: [
      'Automated compliance monitoring with IoT sensors',
      'Risk identification through trend analysis and alerts',
      'Audit-ready governance reports in seconds',
      'Multi-site compliance visibility from one dashboard',
    ],
    metaTitle: 'Checkit | GRC Software - Request a Demo',
    ctaText: 'Get Your Free Demo',
  },
  'inspection': {
    slug: 'inspection',
    category: 'Inspection Software',
    headline: 'Run Consistent Inspections Across Every Location',
    subheadline: 'Standardize inspection workflows with guided mobile checklists, photo capture, and automatic scoring — then track results across all sites in real time.',
    benefits: [
      'Guided mobile inspection checklists',
      'Photo evidence and annotation on every item',
      'Automatic scoring and exception flagging',
      'Cross-site inspection dashboards and trend tracking',
    ],
    metaTitle: 'Checkit | Inspection Software - Request a Demo',
    ctaText: 'Get Your Free Demo',
  },
  'nursing-home': {
    slug: 'nursing-home',
    category: 'Nursing Home Software',
    headline: 'Automate Compliance and Safety for Senior Living',
    subheadline: 'Monitor food safety, environmental conditions, and daily operational checks across your communities — with automated alerts, digital logs, and audit-ready records.',
    benefits: [
      'Automated temperature monitoring for kitchens and storage',
      'Digital daily checks for safety and compliance',
      'Real-time alerts for missed checks or out-of-range readings',
      'Audit-ready records for state and CQC inspections',
    ],
    metaTitle: 'Checkit | Nursing Home Software - Request a Demo',
    ctaText: 'Get Your Free Demo',
  },
  'quality-management': {
    slug: 'quality-management',
    category: 'Quality Management Software',
    headline: 'Drive Consistent Quality Across Every Site',
    subheadline: 'Standardize quality checks with digital workflows and IoT monitoring — track non-conformances, enforce corrective actions, and prove compliance at every step.',
    benefits: [
      'Standardized quality checklists across all locations',
      'Automated non-conformance detection via sensors',
      'Corrective action tracking with evidence capture',
      'Quality trend analysis and continuous improvement dashboards',
    ],
    metaTitle: 'Checkit | Quality Management Software - Request a Demo',
    ctaText: 'Get Your Free Demo',
  },
  'risk-management': {
    slug: 'risk-management',
    category: 'Risk Management Software',
    headline: 'Identify Operational Risks Before They Become Failures',
    subheadline: 'Combine continuous IoT monitoring with trend analysis to detect risks early — from equipment failures and compliance gaps to missed checks and environmental breaches.',
    benefits: [
      'Proactive alerts for emerging risks and trends',
      'Equipment failure prediction through sensor analytics',
      'Compliance gap identification across all sites',
      'Exception-based dashboards so you act on what matters',
    ],
    metaTitle: 'Checkit | Risk Management Software - Request a Demo',
    ctaText: 'Get Your Free Demo',
  },
  'training': {
    slug: 'training',
    category: 'Training Software',
    headline: 'Guided Workflows That Train While Your Team Works',
    subheadline: 'Checkit\'s step-by-step mobile checklists guide staff through the right process every time — embedding best practices into daily operations instead of a classroom.',
    benefits: [
      'Guided workflows enforce correct procedures on every task',
      'New staff follow best practices from day one',
      'Track completion rates and compliance by team member',
      'Reduce errors by embedding training into daily operations',
    ],
    metaTitle: 'Checkit | Training Software - Request a Demo',
    ctaText: 'Get Your Free Demo',
  },
  'workforce-management': {
    slug: 'workforce-management',
    category: 'Workforce Management Software',
    headline: 'See What Every Team Is Doing Across Every Site',
    subheadline: 'Track task completion, checklist adherence, and operational performance by team, site, and individual — so managers can identify gaps and coach effectively.',
    benefits: [
      'Real-time task completion tracking across all sites',
      'Performance visibility by team, location, and individual',
      'Automated reminders for overdue or missed checks',
      'Manager dashboards with exception-based alerts',
    ],
    metaTitle: 'Checkit | Workforce Management Software - Request a Demo',
    ctaText: 'Get Your Free Demo',
  },
};

export function getCategory(slug: string): CapterraCategory | null {
  return capterraCategories[slug] || null;
}

export function getAllCategorySlugs(): string[] {
  return Object.keys(capterraCategories);
}
