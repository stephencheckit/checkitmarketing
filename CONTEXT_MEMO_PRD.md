# Context Memo - Product Requirements Document

*Factual memos that make AI recommend your brand*

---

## Executive Summary

**Product:** Context Memo - A platform that creates factual reference memos about your brand, ensuring AI search engines have accurate, citable information to recommend you.

**Tagline:** "The facts AI needs to recommend you"

**Core Insight:** AI models cite factual, structured, authoritative content. Most brands have no content optimized for AI citation. Context Memo fills that gap with short, factual memos based on what's already true about your brand.

**How It Works:**
1. Enter your brand and verify via email domain
2. AI extracts factual context from your website
3. AI identifies competitors and relevant queries
4. AI generates factual memos answering those queries
5. Memos are published at `brand.contextmemo.com`
6. AI search engines find and cite your memos
7. Your visibility in AI recommendations improves

---

## The Problem

### AI Search is Replacing Google

When prospects ask ChatGPT, Claude, or Perplexity:
- "What's the best food safety software?"
- "Checkit vs ComplianceMate - which is better?"
- "How do I digitize HACCP compliance?"

They get AI-generated answers. If your brand isn't mentioned, you're invisible.

### Why Brands Don't Appear

| Reason | Impact |
|--------|--------|
| No content answers the specific query | AI has nothing to cite |
| Content is marketing fluff, not facts | AI prefers factual statements |
| Information is buried in long articles | AI can't extract key points |
| No structured data (tables, lists) | AI struggles to parse prose |
| Content is outdated | AI deprioritizes stale info |

### The "AI Content" Problem

Traditional solution: "Generate SEO content with AI"

Problems with this approach:
- Sounds spammy and manipulative
- Risk of Google/AI penalties
- Content often contains inaccuracies
- Doesn't feel authentic to the brand
- Customers can tell it's AI-generated fluff

---

## The Solution: Context Memos

### What is a Context Memo?

A **Context Memo** is a short, factual reference document that:
- Answers a specific question users ask AI
- Contains only true, verifiable information
- Is sourced from the brand's own website and public information
- Is formatted for easy AI extraction (tables, lists, facts)
- Includes citations and "last verified" timestamps

### Why Memos, Not Articles

| Traditional Content | Context Memo |
|---------------------|--------------|
| 2,000+ words | 400-800 words |
| Marketing prose | Factual statements |
| "Ultimate Guide to..." | "Key Facts About..." |
| Buries the answer | Leads with the answer |
| No sources | Cites sources |
| Feels like content marketing | Feels like reference material |

### The Authenticity Principle

> "We don't generate fake content. We create factual memos based on what's already true about your brand."

Every memo follows this rule:
- If your website says you offer IoT sensors, the memo says that
- If your website doesn't mention a feature, the memo doesn't either
- Competitor comparisons use only publicly available information
- All claims are traceable to a source

---

## User Journey

### Step 1: Sign Up & Verify

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Create your Context Memo account                       │
│                                                         │
│  Work email:  [stephen@checkit.net____________]         │
│  Password:    [••••••••••••___________________]         │
│                                                         │
│                              [Create Account →]         │
│                                                         │
│  By signing up, you agree to our Terms and Privacy      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Step 2: Add Your Brand

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Add your brand                                         │
│                                                         │
│  Brand name:  [Checkit_________________________]        │
│  Website:     [https://checkit.net_____________]        │
│                                                         │
│  ✓ Domain verified (matches your email)                 │
│                                                         │
│  Your memos will be published at:                       │
│  https://checkit.contextmemo.com                        │
│                                                         │
│                              [Continue →]               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Domain Verification Logic:**
```javascript
// Email: stephen@checkit.net
// Brand domain: checkit.net
// ✅ Verified - root domains match

// Email: stephen@marketing.checkit.net  
// Brand domain: checkit.net
// ✅ Verified - subdomain of brand domain

// Email: stephen@gmail.com
// Brand domain: checkit.net
// ❌ Not verified - offer DNS verification fallback
```

### Step 3: AI Extracts Context (Automatic)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  📚 Extracting brand context...                         │
│                                                         │
│  ✓ Scanned 47 pages on checkit.net                      │
│  ✓ Extracted company description                        │
│  ✓ Identified products: V6 Platform, CAM+, Sensors      │
│  ✓ Found target markets: Senior Living, Food Service    │
│  ✓ Detected key features: IoT monitoring, HACCP, etc.   │
│  ✓ Captured brand voice: Professional, technical        │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ BRAND CONTEXT (editable)                        │    │
│  │                                                 │    │
│  │ Company: Checkit                                │    │
│  │ Founded: 2005                                   │    │
│  │ HQ: Cambridge, UK                               │    │
│  │ Listed: LSE (CHK)                               │    │
│  │                                                 │    │
│  │ What we do:                                     │    │
│  │ IoT-powered compliance and safety platform      │    │
│  │ for multi-site operations. Real-time temp       │    │
│  │ monitoring, digital checklists, automated       │    │
│  │ compliance workflows.                           │    │
│  │                                                 │    │
│  │ Products: V6 Platform, CAM+, Sensors            │    │
│  │ Markets: Senior Living, Food Service, Retail    │    │
│  │ Certifications: UKAS, ISO 17025                 │    │
│  │                                                 │    │
│  │ [Edit Context]                                  │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│                              [Looks Good →]             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Step 4: AI Identifies Competitors

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  🎯 We found these competitors                          │
│                                                         │
│  Based on your industry and what AI currently           │
│  recommends for similar queries:                        │
│                                                         │
│  ☑ ComplianceMate    Food safety software               │
│  ☑ FoodDocs          HACCP digital tools                │
│  ☑ Jolt              Restaurant operations              │
│  ☑ SafetyChain       Food supply chain                  │
│  ☑ Squadle           Multi-site compliance              │
│  ☐ iAuditor          General inspections                │
│                                                         │
│  [+ Add competitor]                                     │
│                                                         │
│  Note: Competitor memos will only include publicly      │
│  available, factual information from their websites.    │
│                                                         │
│                              [Continue →]               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Step 5: AI Generates Queries

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  🔍 Generated 48 queries to monitor                     │
│                                                         │
│  These are questions your prospects ask AI:             │
│                                                         │
│  COMPARISON QUERIES (12)                                │
│  ├─ "Checkit vs ComplianceMate"                         │
│  ├─ "Checkit vs FoodDocs"                               │
│  ├─ "ComplianceMate alternatives"                       │
│  └─ ...                                                 │
│                                                         │
│  SOLUTION QUERIES (18)                                  │
│  ├─ "Best food safety software for senior living"       │
│  ├─ "IoT temperature monitoring for restaurants"        │
│  ├─ "HACCP compliance software"                         │
│  └─ ...                                                 │
│                                                         │
│  HOW-TO QUERIES (10)                                    │
│  ├─ "How to digitize food safety checklists"            │
│  ├─ "How to automate HACCP compliance"                  │
│  └─ ...                                                 │
│                                                         │
│  WHAT-IS QUERIES (8)                                    │
│  ├─ "What is IoT temperature monitoring"                │
│  ├─ "What is digital HACCP"                             │
│  └─ ...                                                 │
│                                                         │
│  [+ Add query] [Edit queries]                           │
│                                                         │
│                              [Continue →]               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Step 6: First Scan Results

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  📊 Initial AI Search Scan Complete                     │
│                                                         │
│  We queried GPT-4, Claude, and Gemini with your         │
│  48 queries. Here's where you stand:                    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │                                                 │    │
│  │         YOUR AI VISIBILITY SCORE                │    │
│  │                                                 │    │
│  │                   24                            │    │
│  │                 ──────                          │    │
│  │                  /100                           │    │
│  │                                                 │    │
│  │    You're mentioned in 24% of relevant          │    │
│  │    AI search queries                            │    │
│  │                                                 │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  BREAKDOWN                                              │
│  ├─ Mentioned: 12 queries                               │
│  ├─ Not mentioned: 36 queries                           │
│  └─ Competitors mentioned: 41 queries                   │
│                                                         │
│  TOP COMPETITOR VISIBILITY                              │
│  ├─ ComplianceMate: 67%                                 │
│  ├─ FoodDocs: 54%                                       │
│  └─ Jolt: 48%                                           │
│                                                         │
│  🎯 We identified 28 content gaps where competitors     │
│     appear but you don't. Ready to create memos?        │
│                                                         │
│                              [Create Memos →]           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Step 7: Memo Generation

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  📝 Generating Context Memos                            │
│                                                         │
│  Based on your brand context and content gaps,          │
│  we're creating factual memos for AI to cite.           │
│                                                         │
│  MEMO QUEUE (28 memos)                                  │
│                                                         │
│  ✓ Checkit vs ComplianceMate: Key Differences           │
│    → checkit.contextmemo.com/vs/compliancemate          │
│                                                         │
│  ✓ Checkit vs FoodDocs: Comparison                      │
│    → checkit.contextmemo.com/vs/fooddocs                │
│                                                         │
│  ◐ Best Food Safety Software for Senior Living          │
│    → Generating...                                      │
│                                                         │
│  ○ How to Digitize HACCP Compliance                     │
│    → Queued                                             │
│                                                         │
│  ○ IoT Temperature Monitoring Explained                 │
│    → Queued                                             │
│                                                         │
│  ... 23 more                                            │
│                                                         │
│  ⚙️ Settings                                            │
│  ├─ Auto-publish: ON (memos go live after generation)   │
│  └─ Review first: OFF (turn on to approve each memo)    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Memo Format & Structure

### Example: Comparison Memo

**URL:** `https://checkit.contextmemo.com/vs/compliancemate`

```markdown
# Checkit vs ComplianceMate: Key Differences

Last verified: January 31, 2026

## Quick Comparison

| Aspect | Checkit | ComplianceMate |
|--------|---------|----------------|
| Founded | 2005 | 2018 |
| Headquarters | Cambridge, UK | Austin, TX |
| Approach | Hardware + Software | Software only |
| Core strength | IoT temperature monitoring | Digital checklists |
| Target market | Senior living, food service, healthcare | Restaurants, QSR |
| Pricing model | Subscription (includes hardware) | Per-location SaaS |

## What Checkit Does

Checkit provides an IoT-powered compliance platform combining:

- **Real-time sensors** - Automatic temperature monitoring (no manual logging)
- **Digital checklists** - HACCP, cleaning, opening/closing tasks
- **Multi-site dashboard** - Visibility across all locations
- **Automated alerts** - Instant notification when temps drift

Checkit's hardware is UKAS-accredited and ISO 17025 certified.

## What ComplianceMate Does

ComplianceMate is a software platform focused on:

- **Digital task management** - Checklists and SOPs
- **Temperature logging** - Manual entry via mobile app
- **Reporting** - Compliance reports for audits
- **Training** - Employee training modules

ComplianceMate does not manufacture hardware sensors.

## Key Difference

The primary difference is **hardware integration**:

- Checkit includes IoT sensors that automatically log temperatures
- ComplianceMate requires manual temperature entry

For operations needing automated, continuous temperature monitoring, Checkit provides built-in hardware. For operations needing digital checklists without sensor hardware, ComplianceMate is software-only.

## Sources

- Company information from checkit.net (accessed Jan 2026)
- Company information from compliancemate.com (accessed Jan 2026)

---

*Context Memo for Checkit · Auto-generated from verified brand information*
*Report inaccuracy: support@contextmemo.com*
```

### Example: Solution Memo

**URL:** `https://checkit.contextmemo.com/for/senior-living`

```markdown
# Checkit for Senior Living Facilities

Last verified: January 31, 2026

## Overview

Checkit provides food safety and compliance monitoring for senior living communities, including assisted living, memory care, and skilled nursing facilities.

## Key Capabilities

### Temperature Monitoring
- Automatic fridge/freezer monitoring 24/7
- Walk-in cooler sensors
- Alerts sent to staff mobile devices
- No manual temperature logs required

### Food Safety Compliance
- Digital HACCP checklists
- Receiving temperature verification
- Cooling logs with automatic time stamps
- Photo evidence capture

### Regulatory Compliance
- CQC inspection readiness (UK)
- State health department compliance (US)
- Automatic audit trail generation
- 90-day data retention standard

### Multi-Site Visibility
- Dashboard showing all communities
- Regional manager oversight
- Benchmarking across locations
- Centralized reporting

## Customer Examples

Checkit serves senior living operators including:
- Morningstar Senior Living (41 communities)
- [Additional customers listed on checkit.net]

## Getting Started

Senior living operators can request a demo at checkit.net.

## Sources

- Product information from checkit.net/industries/senior-living
- Customer information from checkit.net/case-studies

---

*Context Memo for Checkit · Auto-generated from verified brand information*
```

### Example: How-To Memo

**URL:** `https://checkit.contextmemo.com/how/digitize-haccp`

```markdown
# How to Digitize HACCP Compliance

Last verified: January 31, 2026

## What is HACCP?

HACCP (Hazard Analysis Critical Control Points) is a food safety management system that identifies and controls biological, chemical, and physical hazards in food production.

## Why Digitize HACCP?

| Paper-Based HACCP | Digital HACCP |
|-------------------|---------------|
| Manual temperature logs | Automatic sensor readings |
| Handwritten checklists | Mobile app with timestamps |
| Filing cabinets of records | Cloud-based audit trail |
| Hours of audit prep | Instant report generation |
| Human error in recording | Automated, accurate data |

## Steps to Digitize

### 1. Identify Critical Control Points
Map your existing HACCP plan's CCPs:
- Receiving temperatures
- Cold storage monitoring
- Cooking temperatures
- Cooling processes
- Hot holding

### 2. Deploy Sensors (Optional but Recommended)
Automatic temperature monitoring eliminates manual logging:
- Fridge/freezer sensors
- Walk-in cooler monitoring
- Probe sensors for cooking verification

### 3. Digitize Checklists
Convert paper forms to mobile checklists:
- Opening/closing procedures
- Cleaning schedules
- Equipment checks
- Receiving logs

### 4. Set Up Alerts
Configure notifications for:
- Temperature excursions
- Missed checklist tasks
- Approaching deadlines

### 5. Train Staff
Ensure team members can:
- Use mobile app for task completion
- Respond to alerts
- Capture photo evidence when needed

## Tools for Digital HACCP

Several platforms offer digital HACCP capabilities:

- **Checkit** - IoT sensors + digital checklists + multi-site dashboard
- **FoodDocs** - AI-generated HACCP plans + digital logs
- **ComplianceMate** - Digital checklists + training

The right choice depends on whether you need automated sensor hardware (Checkit) or software-only solutions (FoodDocs, ComplianceMate).

## Sources

- HACCP principles from FDA.gov
- Product capabilities from respective vendor websites

---

*Context Memo for Checkit · Auto-generated from verified brand information*
```

---

## Memo Types

| Type | URL Pattern | Purpose | Example Query |
|------|-------------|---------|---------------|
| **Comparison** | `/vs/{competitor}` | Direct competitor comparisons | "Checkit vs ComplianceMate" |
| **Alternative** | `/alternatives-to/{competitor}` | Capture "[competitor] alternatives" queries | "ComplianceMate alternatives" |
| **Industry** | `/for/{industry}` | Industry-specific positioning | "Food safety software for senior living" |
| **How-To** | `/how/{topic}` | Educational, positions brand as solution | "How to digitize HACCP" |
| **What-Is** | `/what-is/{concept}` | Definitional, brand mentioned naturally | "What is IoT temperature monitoring" |
| **Best-Of** | `/best/{category}` | Category leadership | "Best temperature monitoring software" |

---

## Technical Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                        │
│                         (Next.js + Tailwind)                                │
│                                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │Onboarding│ │Dashboard │ │  Memos   │ │  Scans   │ │ Settings │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER                                       │
│                         (Next.js API Routes)                                │
│                                                                              │
│  Auth │ Brands │ Context │ Queries │ Scans │ Memos │ Publish │ Billing     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   JOB QUEUE     │      │    DATABASE     │      │   AI PROVIDERS  │
│   (Inngest)     │      │   (Postgres)    │      │                 │
│                 │      │                 │      │  ┌───────────┐  │
│  Jobs:          │      │  tenants        │      │  │  OpenAI   │  │
│  - context.     │      │  brands         │      │  │  GPT-4o   │  │
│    extract      │      │  brand_context  │      │  └───────────┘  │
│  - competitor.  │      │  competitors    │      │  ┌───────────┐  │
│    discover     │      │  queries        │      │  │ Anthropic │  │
│  - query.       │      │  scan_results   │      │  │  Claude   │  │
│    generate     │      │  memos          │      │  └───────────┘  │
│  - scan.run     │      │  memo_versions  │      │  ┌───────────┐  │
│  - memo.        │      │  alerts         │      │  │  Google   │  │
│    generate     │      │  usage          │      │  │  Gemini   │  │
│  - memo.publish │      │                 │      │  └───────────┘  │
└─────────────────┘      └─────────────────┘      └─────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────────┐
                         │     MEMO HOSTING        │
                         │  (Vercel Edge + CDN)    │
                         │                         │
                         │  {brand}.contextmemo.com│
                         │                         │
                         │  Features:              │
                         │  - Auto SSL             │
                         │  - Global CDN           │
                         │  - SEO optimized        │
                         │  - Schema.org markup    │
                         │  - Sitemap generation   │
                         └─────────────────────────┘
```

---

## Database Schema

```sql
-- Multi-tenant accounts
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  email_domain TEXT NOT NULL, -- extracted for verification
  password_hash TEXT NOT NULL,
  name TEXT,
  plan TEXT DEFAULT 'starter', -- starter, growth, scale, enterprise
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- Brands (verified via email domain match)
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Basic info
  name TEXT NOT NULL,
  domain TEXT NOT NULL,
  subdomain TEXT UNIQUE NOT NULL, -- {subdomain}.contextmemo.com
  
  -- Verification
  verified BOOLEAN DEFAULT FALSE,
  verification_method TEXT, -- 'email_domain', 'dns_txt', 'meta_tag'
  verified_at TIMESTAMPTZ,
  
  -- Extracted context (editable)
  context JSONB NOT NULL DEFAULT '{}',
  -- {
  --   company_name, founded, headquarters, description,
  --   products: [], markets: [], features: [],
  --   certifications: [], customers: [],
  --   brand_voice: 'professional' | 'casual' | 'technical'
  -- }
  context_extracted_at TIMESTAMPTZ,
  context_edited_at TIMESTAMPTZ,
  
  -- Settings
  auto_publish BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Competitors per brand
CREATE TABLE competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  domain TEXT,
  description TEXT,
  
  -- Extracted context about competitor
  context JSONB DEFAULT '{}',
  context_extracted_at TIMESTAMPTZ,
  
  auto_discovered BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(brand_id, name)
);

-- Search queries to monitor
CREATE TABLE queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  
  query_text TEXT NOT NULL,
  query_type TEXT, -- 'comparison', 'solution', 'how_to', 'what_is', 'best_of', 'alternative'
  
  -- For comparison/alternative queries
  related_competitor_id UUID REFERENCES competitors(id),
  
  priority INTEGER DEFAULT 50, -- 1-100, higher = more important
  is_active BOOLEAN DEFAULT TRUE,
  auto_discovered BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(brand_id, query_text)
);

-- AI search scan results
CREATE TABLE scan_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  query_id UUID REFERENCES queries(id) ON DELETE CASCADE,
  
  -- Which AI model
  model TEXT NOT NULL, -- 'gpt-4o-mini', 'gpt-4o', 'claude-3.5', 'gemini-1.5'
  
  -- Results
  response_text TEXT,
  brand_mentioned BOOLEAN NOT NULL,
  brand_position INTEGER, -- 1-5 if mentioned, null if not
  brand_context TEXT, -- how the brand was mentioned
  competitors_mentioned TEXT[], -- array of competitor names
  
  scanned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Context Memos
CREATE TABLE memos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  
  -- What query/gap this memo addresses
  source_query_id UUID REFERENCES queries(id),
  
  -- Memo metadata
  memo_type TEXT NOT NULL, -- 'comparison', 'industry', 'how_to', 'what_is', 'best_of', 'alternative'
  slug TEXT NOT NULL, -- URL slug: 'vs/compliancemate', 'for/senior-living'
  
  -- Content
  title TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  content_html TEXT, -- rendered HTML
  
  -- SEO
  meta_description TEXT,
  schema_json JSONB, -- Schema.org structured data
  
  -- Sources used to generate this memo
  sources JSONB, -- [{url, title, accessed_at}, ...]
  
  -- Status
  status TEXT DEFAULT 'draft', -- 'draft', 'review', 'published', 'archived'
  published_at TIMESTAMPTZ,
  
  -- Verification
  last_verified_at TIMESTAMPTZ,
  verified_accurate BOOLEAN DEFAULT TRUE,
  
  -- Versioning
  version INTEGER DEFAULT 1,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(brand_id, slug)
);

-- Memo version history
CREATE TABLE memo_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memo_id UUID REFERENCES memos(id) ON DELETE CASCADE,
  
  version INTEGER NOT NULL,
  content_markdown TEXT NOT NULL,
  change_reason TEXT, -- 'initial', 'brand_context_update', 'competitor_update', 'manual_edit'
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alerts
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  
  alert_type TEXT NOT NULL, -- 'visibility_drop', 'new_competitor', 'memo_published', 'gap_found'
  title TEXT NOT NULL,
  message TEXT,
  data JSONB,
  
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage tracking for billing
CREATE TABLE usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  
  month TEXT NOT NULL, -- '2026-01'
  
  queries_count INTEGER DEFAULT 0,
  scans_count INTEGER DEFAULT 0,
  memos_generated INTEGER DEFAULT 0,
  ai_tokens_used BIGINT DEFAULT 0,
  
  UNIQUE(tenant_id, month)
);

-- Indexes for performance
CREATE INDEX idx_scan_results_brand_scanned ON scan_results(brand_id, scanned_at DESC);
CREATE INDEX idx_memos_brand_status ON memos(brand_id, status);
CREATE INDEX idx_queries_brand_active ON queries(brand_id, is_active);
```

---

## Memo Generation Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MEMO GENERATION PIPELINE                             │
└─────────────────────────────────────────────────────────────────────────────┘

1. IDENTIFY GAP
   ┌─────────────────────────────────────────────────────────────────────────┐
   │ Query: "Checkit vs ComplianceMate"                                      │
   │ Scan result: Checkit NOT mentioned, ComplianceMate mentioned            │
   │ Existing memo: None                                                     │
   │ → GAP IDENTIFIED                                                        │
   └─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
2. GATHER FACTS
   ┌─────────────────────────────────────────────────────────────────────────┐
   │ Sources:                                                                │
   │ ├─ Brand context (from DB): Checkit info                                │
   │ ├─ Competitor context (from DB): ComplianceMate info                    │
   │ ├─ Fresh scrape (if needed): Check for updates                          │
   │ └─ Verify all facts are current                                         │
   └─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
3. GENERATE MEMO
   ┌─────────────────────────────────────────────────────────────────────────┐
   │ AI Prompt:                                                              │
   │                                                                         │
   │ "Create a factual comparison memo between Checkit and ComplianceMate.   │
   │                                                                         │
   │ RULES:                                                                  │
   │ - Only include facts from the provided context                          │
   │ - Do not make up features or capabilities                               │
   │ - Use neutral, factual tone                                             │
   │ - Include comparison table                                              │
   │ - Cite sources at the end                                               │
   │ - If information is unknown, say 'not publicly available'               │
   │                                                                         │
   │ CHECKIT CONTEXT:                                                        │
   │ {brand_context}                                                         │
   │                                                                         │
   │ COMPLIANCEMATE CONTEXT:                                                 │
   │ {competitor_context}                                                    │
   │                                                                         │
   │ FORMAT:                                                                 │
   │ {memo_template}"                                                        │
   └─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
4. VALIDATE FACTS
   ┌─────────────────────────────────────────────────────────────────────────┐
   │ AI Self-Check:                                                          │
   │ ├─ Does every claim trace to provided context?                          │
   │ ├─ Are there any hallucinated features?                                 │
   │ ├─ Is the tone neutral and factual?                                     │
   │ └─ Are sources properly cited?                                          │
   │                                                                         │
   │ If validation fails → Flag for human review                             │
   └─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
5. PUBLISH (if auto-publish enabled)
   ┌─────────────────────────────────────────────────────────────────────────┐
   │ ├─ Generate HTML from Markdown                                          │
   │ ├─ Add Schema.org structured data                                       │
   │ ├─ Deploy to {brand}.contextmemo.com/vs/compliancemate                  │
   │ ├─ Update sitemap                                                       │
   │ └─ Record in memo_versions for history                                  │
   └─────────────────────────────────────────────────────────────────────────┘
```

---

## Pricing

| Tier | Queries | Memos/Month | Scans | Brands | Price |
|------|---------|-------------|-------|--------|-------|
| **Starter** | 50 | 15 | Daily | 1 | $149/mo |
| **Growth** | 150 | 50 | 2x daily | 1 | $349/mo |
| **Scale** | 500 | 150 | 4x daily | 3 | $749/mo |
| **Enterprise** | Unlimited | Unlimited | Custom | Unlimited | Custom |

**What's Included (All Tiers):**
- Hosted subdomain (`brand.contextmemo.com`)
- Multi-model scanning (GPT-4, Claude, Gemini)
- Visibility dashboard
- Email alerts
- Memo version history

**Add-Ons:**
- Custom domain (`memo.yourdomain.com`): +$49/mo
- API access: +$99/mo
- Remove "Context Memo" branding: +$149/mo
- Priority support: +$99/mo

---

## Build Phases

### Phase 1: MVP (8 weeks)

| Week | Focus | Deliverables |
|------|-------|--------------|
| 1-2 | Foundation | Auth, DB schema, Inngest setup, basic UI |
| 3-4 | Brand Setup | Onboarding flow, context extraction, domain verification |
| 5-6 | Scanning | Query generation, multi-model scanning, gap detection |
| 7-8 | Memos | Memo generation, hosted publishing, basic dashboard |

**MVP Limitations:**
- GPT-4o-mini only (add other models in V1)
- No memo editing (add in V1)
- Basic dashboard (improve in V1)
- Email alerts only (add Slack in V2)

### Phase 2: V1 (6 weeks)

- Multi-model scanning (Claude, Gemini)
- Memo editing and approval workflow
- Improved dashboard with trends
- Competitor context auto-refresh
- Memo scheduling

### Phase 3: V2 (6 weeks)

- Multiple brands per account
- Team seats and permissions
- API access
- Slack integration
- Custom domain support
- White-label option

---

## Success Metrics

| Metric | MVP Target | 6-Month Target |
|--------|------------|----------------|
| Paying customers | 10 | 75 |
| MRR | $1,500 | $20,000 |
| Memos published | 200 | 5,000 |
| Avg visibility improvement | +15 points | +25 points |
| Customer churn | <10% | <5% |

---

## Competitive Positioning

| Competitor | Focus | Context Memo Advantage |
|------------|-------|------------------------|
| **Otterly.ai** | AI search monitoring only | We monitor AND fix with memos |
| **Surfer SEO** | Traditional SEO content | We optimize for AI, not just Google |
| **Jasper** | General AI content | We're specialized for AI search visibility |
| **MarketMuse** | Content planning | We auto-generate and publish |

**Our Unique Position:**

"Context Memo is the only platform that monitors AI search visibility AND automatically creates factual memos to improve it. Others track the problem. We fix it."

---

## Open Questions

1. **Memo refresh frequency** - How often should memos be re-verified and updated?
   - Proposal: Monthly auto-refresh, on-demand if context changes

2. **Competitor accuracy disputes** - What if a competitor claims their memo info is wrong?
   - Proposal: "Report inaccuracy" link, fast correction process

3. **Brand approval for comparisons** - Do we need brand permission to create "vs" pages?
   - Legal review needed. Likely fine if factual and sourced.

4. **Multi-language support** - When to add?
   - Proposal: V2 or V3, based on customer demand

5. **Freemium option** - Should there be a free tier?
   - Proposal: No. 14-day free trial instead. Value is too high to give away.

---

## Next Steps

1. **Validate demand** - Talk to 10 B2B marketers about willingness to pay $149-349/mo
2. **Landing page** - Build contextmemo.com with waitlist
3. **Legal review** - Ensure comparison memos are legally defensible
4. **Technical spike** - Prove out Inngest + context extraction + memo hosting
5. **Start MVP build** - 8 weeks to launch

---

*Document Version: 1.0*
*Last Updated: January 31, 2026*
