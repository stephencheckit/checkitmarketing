# AI Onboarding - Checkit Marketing

## Project Overview

**Name:** Checkit Marketing GTM Platform  
**Type:** Web Application  
**Status:** 🟢 Active development - Full marketing toolkit + V6 Enablement Portal

## Tech Stack

| Technology | Version |
|------------|---------|
| Next.js | 16.1.4 |
| React | 19.2.3 |
| TypeScript | ^5 |
| Tailwind CSS | ^4 |
| ESLint | ^9 |
| Neon Database | Serverless Postgres |
| iron-session | Session auth |
| bcryptjs | Password hashing |
| Cheerio | 1.1.2 |
| Lucide React | latest |
| OpenAI SDK | latest |
| League Spartan | Google Font |

## Project Structure

```
checkitmarketing/
├── app/
│   ├── (auth)/                    # Auth pages (login, register)
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (marketing)/               # Protected marketing tools
│   │   ├── positioning/page.tsx   # Corporate Positioning Strategy
│   │   ├── competitors/page.tsx   # Competitor Hub / Battlecard
│   │   ├── content/page.tsx       # Content Ideation Hub
│   │   ├── tools/page.tsx         # ROI Tools & Calculators Hub
│   │   │   └── paper-to-digital/  # Paper to Digital ROI Calculator
│   │   └── layout.tsx             # Marketing layout with MainNav
│   ├── (portal)/                  # Protected enablement portal
│   │   ├── dashboard/page.tsx     # User dashboard
│   │   ├── learn/                 # Learning modules
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── quiz/page.tsx          # Certification quiz
│   │   ├── reference/page.tsx     # Quick reference guide
│   │   ├── discovery/page.tsx     # Sales discovery questions
│   │   ├── solutioning/page.tsx   # Demo & engagement playbook
│   │   ├── closing/page.tsx       # Negotiation & contracting
│   │   ├── admin/page.tsx         # Admin dashboard
│   │   └── layout.tsx             # Portal layout with MainNav
│   ├── api/
│   │   ├── auth/                  # Auth API routes
│   │   ├── positioning/           # Positioning document CRUD
│   │   │   ├── route.ts
│   │   │   └── versions/route.ts
│   │   ├── battlecard/            # Battlecard CRUD
│   │   ├── ideate/route.ts        # AI content ideation
│   │   ├── progress/route.ts      # Module progress tracking
│   │   ├── quiz/route.ts          # Quiz submission/scoring
│   │   └── admin/stats/route.ts   # Admin statistics
│   ├── page.tsx                   # Redirects to /positioning or /login
│   └── layout.tsx                 # Root layout (League Spartan font)
├── components/
│   ├── MainNav.tsx                # Unified navigation (all pages)
│   ├── PortalNav.tsx              # Legacy (unused)
│   └── ModuleContent.tsx          # Learning module content
├── lib/
│   ├── db.ts                      # Database operations (users, battlecard, positioning)
│   ├── session.ts                 # Session management
│   ├── modules.ts                 # Learning module + quiz definitions
│   ├── types.ts
│   └── social-posts.ts
├── .env.local                     # DATABASE_URL, SESSION_SECRET, OPENAI_API_KEY
└── package.json
```

## Current Features

### Unified Navigation
All pages now share a consistent navigation bar with:
- **Positioning** - Corporate strategy document
- **Competitors** - Battlecard matrix
- **Content** - AI-powered ideation
- **Enablement** dropdown - Dashboard, Learn, Quiz, Reference
- User name and sign out

### Corporate Positioning (`/positioning`) - NEW
Strategic messaging framework document with 8 sections:
1. **Mission & Vision** - Why Checkit exists, where it's headed
2. **Target Markets** - Verticals, buyer personas, user personas
3. **Value Proposition** - Core promise, key benefits, proof points
4. **Key Differentiators** - 3 unique selling points with explanations
5. **Messaging Pillars** - 3 core themes with supporting points
6. **Elevator Pitches** - 10-second, 30-second, 2-minute versions
7. **Objection Handling** - Common objections with approved responses
8. **Competitive Stance** - Positioning statement, win themes, land mines

Features:
- Version history with restore capability
- Export to markdown
- Completion tracking (32 fields)
- Persisted in Neon Postgres

### Competitor Hub (`/competitors`)
Battlecard matrix for competitive intelligence with version history

### Content Ideation Hub (`/content`)
AI-powered content strategy tool using OpenAI GPT-4o

### ROI Tools & Calculators (`/tools`)
Sales enablement tools to quantify business value:
- **Paper to Digital ROI Calculator** - Labor savings, audit prep, manager visibility, compliance risk
- Vertical-specific presets:
  - Senior Living (US) - CQC/state compliance, resident safety
  - Facilities Food Ops - Stadiums, venues, event-day operations
  - NHS Pharmacies (UK) - GPhC compliance, controlled drugs, fridge temps
  - Multi-site Food Retail - BP, Greggs, John Lewis (UK/EU)
  - Plasma & Blood Products (US) - Octapharma, Grifols, university plasma centers, FDA/AABB compliance
- Auto currency switching (USD/GBP)
- Real-time calculations with investment summary
- Coming soon: Temperature Monitoring ROI, Compliance Risk Calculator

### V6 Enablement Portal
Complete internal training platform for V6 launch:
- User registration, session auth, dashboard
- 5 learning modules, 10-question quiz, certification
- Quick reference page, admin dashboard

### Sales Playbook
Full sales enablement workflow with contribution system:
- **Discovery** (`/discovery`) - 17 qualification questions across 6 stages with explanations, follow-ups, and "listen for" cues
- **Solutioning** (`/solutioning`) - Demo preparation, delivery techniques, stakeholder engagement, proof/validation
- **Closing** (`/closing`) - Negotiation tactics, mutual action plans, contracting, closing techniques, customer handoff
- All pages support "Add Insight" contributions from field reps

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment Log

| Date | Changes | Deployed By |
|------|---------|-------------|
| Jan 22, 2026 | **UI Consistency + Color Update** - Changed accent color from purple (#6366f1) to darker blue (#2563eb). Consistent icons across nav and page headers (Target/Building2/FileText). Removed redundant Dashboard from Enablement nav. Auto-expanding textareas on Positioning page. Verified mobile responsiveness across all pages. | AI |
| Jan 22, 2026 | **ROI Tools & Calculators** - New `/tools` section with Paper to Digital ROI Calculator. Vertical-specific presets for Senior Living (US), Facilities Food Ops, NHS Pharmacies (UK), Multi-site Food Retail. Auto currency switching (USD/GBP). Real-time calculations for labor savings, audit prep, manager visibility, compliance risk. Investment summary with ROI and payback period. | AI |
| Jan 22, 2026 | **Corporate Positioning + Unified Nav** - New positioning strategy document with 8 sections (mission, target markets, value prop, differentiators, messaging pillars, elevator pitches, objection handling, competitive stance). Unified MainNav component across all pages. League Spartan font. All tools now password-protected via route groups. | AI |
| Jan 22, 2026 | **V6 Enablement Portal** - Full internal training platform with registration, learning modules, quiz certification, admin dashboard. Neon Postgres database with users, progress, and quiz_attempts tables. | AI |
| Jan 22, 2026 | Competitor Hub - Battlecard matrix with full version history (Neon DB) | AI |
| Jan 22, 2026 | Content Ideation Hub - AI-powered content strategy with OpenAI GPT-4o | AI |
| Jan 22, 2026 | Initial project setup - AI onboarding document created | AI |

---

## Problems & Opportunities

### Current Problems (Stack Ranked)

| Rank | Problem | Score | Notes |
|------|---------|-------|-------|
| 1 | Admin role not enforced | 50 | All users can see admin page currently |
| 2 | No persistent storage for content ideas | 45 | Ideas lost on refresh |
| 3 | No password reset flow | 40 | Users can't recover accounts |
| 4 | Positioning not linked to Battlecard | 35 | Differentiators should sync |
| 5 | No custom logo asset | 25 | Using icon + text |

### High-Value Opportunities (Stack Ranked)

| Rank | Opportunity | Score | Notes |
|------|-------------|-------|-------|
| 1 | Market feedback capture tool | 90 | Sales/CS log win/loss, objections, feature requests |
| 2 | V6 launch site (public) | 85 | External marketing page for V6 release |
| 3 | Role-based admin access | 75 | Restrict admin dashboard to managers |
| 4 | Certificate download (PDF) | 70 | Shareable proof of certification |
| 5 | Positioning → Battlecard sync | 68 | Auto-populate battlecard from positioning |
| 6 | Email notifications | 65 | Remind users to complete training |
| 7 | Scheduled posting integration | 60 | Direct post to LinkedIn/FB/X |
| 8 | Content calendar view | 55 | Plan and schedule posts visually |

---

## Database Schema

### Users
- id, name, email, password_hash, department, role, created_at, last_login

### Module Progress
- id, user_id, module_slug, started_at, completed_at

### Quiz Attempts
- id, user_id, score, total_questions, passed, answers (JSONB), completed_at

### Battlecards
- id, name, current_version, created_at, updated_at

### Battlecard Versions
- id, battlecard_id, version_number, data (JSONB), change_notes, created_at

### Positioning Documents
- id, name, current_version, created_at, updated_at

### Positioning Versions
- id, document_id, version_number, data (JSONB), change_notes, created_at

---

## Environment Variables Required

```
DATABASE_URL=postgres://...          # Neon Postgres connection
SESSION_SECRET=...                   # 32+ char secret for sessions
OPENAI_API_KEY=...                   # For content ideation
ACCESS_CODES=CHECKIT2026             # Comma-separated access codes for registration
```

---

## Notes

- V6 Enablement Portal is password-protected, tracks user progress
- Quiz content based on actual V6 naming conventions email
- All 5 modules contain real Checkit V6 terminology and talk tracks
- Admin dashboard shows certification rates by department
