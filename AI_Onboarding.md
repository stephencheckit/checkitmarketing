# AI Onboarding - Check It Marketing

## Project Overview

**Name:** Check It Marketing  
**Type:** Web Application  
**Status:** 🟢 Active development - Content Hub + Competitor Hub live

## Tech Stack

| Technology | Version |
|------------|---------|
| Next.js | 16.1.4 |
| React | 19.2.3 |
| TypeScript | ^5 |
| Tailwind CSS | ^4 |
| ESLint | ^9 |
| Cheerio | 1.1.2 |
| Lucide React | latest |
| OpenAI SDK | latest |
| Neon Database | Serverless Postgres |

## Project Structure

```
checkitmarketing/
├── app/
│   ├── api/
│   │   ├── scrape/
│   │   │   └── route.ts      # Blog content scraper API
│   │   ├── ideate/
│   │   │   └── route.ts      # AI content ideation API (OpenAI)
│   │   └── battlecard/
│   │       ├── route.ts      # Battlecard CRUD API
│   │       └── versions/
│   │           └── route.ts  # Version history API
│   ├── content/
│   │   └── page.tsx          # Content Ideation Hub UI
│   ├── competitors/
│   │   └── page.tsx          # Competitor Hub / Battlecard Matrix
│   ├── page.tsx              # Redirects to /content
│   ├── layout.tsx            # Root layout with Geist fonts
│   ├── globals.css           # Tailwind + CSS variables
│   └── favicon.ico
├── lib/
│   ├── db.ts                 # Neon database operations
│   ├── types.ts              # TypeScript interfaces
│   └── social-posts.ts       # Social media post generator
├── public/                   # Static assets
├── .env.local                # OPENAI_API_KEY, DATABASE_URL
├── package.json
├── tsconfig.json
└── next.config.ts
```

## Current Features

### Content Ideation Hub (`/content`)
AI-powered content strategy tool that:
- Scrapes and analyzes existing blog content from https://www.checkit.net/blog
- Uses OpenAI GPT-4o to generate **new article ideas** based on historical content
- Each idea includes:
  - **Title** - Compelling, SEO-friendly article headline
  - **Target Audience** - Who the content is for (e.g., "Healthcare compliance officers")
  - **Description** - 2-sentence overview of the article
  - **Key Points** - 3 bullet points the article should cover
  - **Social Posts** - Ready-to-copy content for LinkedIn, Facebook, and X
- Collapsible cards for easy scanning
- One-click copy to clipboard functionality
- Character counts for each social post

### Competitor Hub (`/competitors`)
Battlecard matrix for competitive intelligence:
- **Battlecard Matrix** - Side-by-side competitor comparison
- Add/remove competitors with name and website
- Default comparison categories:
  - Company Overview
  - Target Market
  - Key Features
  - Pricing Model
  - Strengths
  - Weaknesses
  - Our Differentiators
- Add/remove/rename custom categories
- **Full Version History**:
  - Every save creates a timestamped version
  - View all past versions with change notes
  - Restore any previous version (creates new version)
- Copy battlecard as markdown table for slides/docs
- Data persisted in Neon Postgres database

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (redirects to `/content`)

---

## Deployment Log

| Date | Changes | Deployed By |
|------|---------|-------------|
| Jan 22, 2026 | Competitor Hub - Battlecard matrix with full version history (Neon DB) | AI |
| Jan 22, 2026 | Content Ideation Hub - AI-powered content strategy with OpenAI GPT-4o | AI |
| Jan 22, 2026 | Content Hub feature - blog scraper + social post generator | AI |
| Jan 22, 2026 | Initial project setup - AI onboarding document created | AI |

---

## Problems & Opportunities

### Current Problems (Stack Ranked)

| Rank | Problem | Score | Notes |
|------|---------|-------|-------|
| 1 | No nav between tools | 50 | Content Hub and Competitor Hub are separate URLs |
| 2 | No persistent storage for ideas | 45 | Content ideas lost on refresh |
| 3 | No edit/customize posts | 40 | Can only copy, not modify in-app |
| 4 | Only analyzes 10 articles | 35 | Could scrape more pages for deeper context |
| 5 | No custom branding/logo | 25 | Using text header only |

### High-Value Opportunities (Stack Ranked)

| Rank | Opportunity | Score | Notes |
|------|-------------|-------|-------|
| 1 | Scheduled posting integration | 85 | Direct post to LinkedIn/FB/X via APIs |
| 2 | Save/favorite ideas | 80 | Database to persist generated ideas |
| 3 | Competitor website scraping | 75 | Auto-extract basic info from competitor URLs |
| 4 | Content calendar view | 70 | Plan and schedule posts visually |
| 5 | Edit posts in-app | 65 | Inline editing before copying |
| 6 | Analytics/tracking | 60 | Track which posts perform best |
| 7 | Unified navigation header | 55 | Single nav for all marketing tools |

---

## Notes

- Content Ideation Hub uses OpenAI GPT-4o for intelligent content suggestions
- Scrapes checkit.net blog to understand existing content themes
- Generates 5 fresh article ideas per request with full social post drafts
- Competitor Hub persists data in Neon Postgres with full version history
- Requires `OPENAI_API_KEY` and `DATABASE_URL` in `.env.local`
