// Lead scoring — AI-assisted with a deterministic rules fallback.
// IMPORTANT: scoring uses fit/intent signals only (job title, email DOMAIN,
// company, vertical, source, engagement counts). We never send the person's
// name or full email address to the model.

import OpenAI from 'openai';
import {
  getLeadTriageByEmail,
  getLeadSubmissions,
  getLeadEngagementCounts,
  setLeadScore,
  type LeadTriage,
  type LeadSubmission,
} from './db';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface LeadFeatures {
  jobTitle: string | null;
  emailDomain: string | null;
  hasBusinessEmail: boolean;
  company: string | null;
  industries: string[];
  sources: string[];
  campaigns: string[];
  submissionCount: number;
  engagementOpens: number;
  engagementClicks: number;
}

export type LeadBand = 'hot' | 'warm' | 'cold';

export interface LeadScoreResult {
  score: number;
  band: LeadBand;
  rationale: string;
  method: 'ai' | 'rules';
}

const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com',
  'aol.com', 'live.com', 'msn.com', 'protonmail.com', 'gmx.com', 'mail.com',
  'ymail.com', 'me.com', 'comcast.net',
]);

const SENIOR_TITLE_KEYWORDS = [
  'chief', 'ceo', 'cfo', 'coo', 'cto', 'president', 'vp', 'vice president',
  'director', 'head of', 'founder', 'owner', 'partner', 'principal',
];
const MID_TITLE_KEYWORDS = [
  'manager', 'lead', 'supervisor', 'specialist', 'coordinator', 'administrator',
];

function bandForScore(score: number): LeadBand {
  if (score >= 70) return 'hot';
  if (score >= 40) return 'warm';
  return 'cold';
}

function uniq(values: (string | null | undefined)[]): string[] {
  return Array.from(new Set(values.filter((v): v is string => !!v)));
}

export function buildLeadFeatures(
  lead: LeadTriage,
  submissions: LeadSubmission[],
  engagement: { opens: number; clicks: number }
): LeadFeatures {
  const emailDomain = lead.email?.includes('@')
    ? lead.email.split('@')[1].toLowerCase()
    : null;
  const hasBusinessEmail = !!emailDomain && !FREE_EMAIL_DOMAINS.has(emailDomain);

  return {
    jobTitle: lead.job_title,
    emailDomain,
    hasBusinessEmail,
    company: lead.company,
    industries: uniq(submissions.map((s) => s.industry)),
    sources: uniq(submissions.map((s) => s.source)),
    campaigns: uniq(submissions.map((s) => s.utm_campaign)),
    submissionCount: lead.submission_count,
    engagementOpens: engagement.opens,
    engagementClicks: engagement.clicks,
  };
}

// Deterministic fallback so every lead always gets a score.
export function computeRulesScore(f: LeadFeatures): LeadScoreResult {
  let score = 25;
  const reasons: string[] = [];

  if (f.hasBusinessEmail) {
    score += 20;
    reasons.push('business email domain');
  } else {
    reasons.push('free/personal email domain');
  }

  const title = (f.jobTitle || '').toLowerCase();
  if (title) {
    if (SENIOR_TITLE_KEYWORDS.some((k) => title.includes(k))) {
      score += 20;
      reasons.push('senior job title');
    } else if (MID_TITLE_KEYWORDS.some((k) => title.includes(k))) {
      score += 12;
      reasons.push('mid-level job title');
    } else {
      score += 5;
      reasons.push('job title provided');
    }
  }

  if (f.submissionCount > 1) {
    score += 10;
    reasons.push(`${f.submissionCount} submissions`);
  }

  if (f.sources.includes('demo-request')) {
    score += 15;
    reasons.push('requested a demo');
  } else if (f.sources.some((s) => s === 'capterra' || s === 'google')) {
    score += 8;
    reasons.push('high-intent paid search/listing');
  }

  if (f.engagementClicks > 0) {
    score += 15;
    reasons.push('clicked a nurture email');
  } else if (f.engagementOpens > 0) {
    score += 6;
    reasons.push('opened a nurture email');
  }

  if (f.industries.length > 0) {
    score += 5;
    reasons.push(`vertical: ${f.industries.join(', ')}`);
  }

  score = Math.max(0, Math.min(100, score));
  return {
    score,
    band: bandForScore(score),
    rationale: `Rules-based: ${reasons.join('; ')}.`,
    method: 'rules',
  };
}

export async function scoreLeadWithAI(f: LeadFeatures): Promise<LeadScoreResult> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const prompt = `You are a B2B lead-scoring assistant for Checkit, an IoT compliance and monitoring platform for multi-site operations (food service, senior living, healthcare/pharma, retail, facilities). Score this lead from 0-100 for sales priority based ONLY on the fit and intent signals below. Do not invent information.

Signals:
- Job title: ${f.jobTitle || 'unknown'}
- Email domain: ${f.emailDomain || 'unknown'} (${f.hasBusinessEmail ? 'business' : 'free/personal'})
- Company: ${f.company || 'unknown'}
- Verticals: ${f.industries.join(', ') || 'unknown'}
- Lead sources: ${f.sources.join(', ') || 'unknown'}
- Campaigns: ${f.campaigns.join(', ') || 'none'}
- Submission count: ${f.submissionCount}
- Nurture email opens: ${f.engagementOpens}, clicks: ${f.engagementClicks}

Guidance: senior decision-makers, business email domains, target verticals, demo requests, repeat submissions, and email engagement indicate HIGHER priority. Free email domains, missing titles, and single low-intent touches indicate LOWER priority.

Respond ONLY with JSON: {"score": <integer 0-100>, "band": "hot|warm|cold", "rationale": "<one concise sentence explaining the score>"}. Bands: hot = score >= 70, warm = 40-69, cold < 40.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.2,
  });

  const raw = completion.choices[0]?.message?.content || '{}';
  const parsed = JSON.parse(raw);

  let score = Math.round(Number(parsed.score));
  if (Number.isNaN(score)) throw new Error('AI returned an invalid score');
  score = Math.max(0, Math.min(100, score));

  const band: LeadBand = ['hot', 'warm', 'cold'].includes(parsed.band)
    ? parsed.band
    : bandForScore(score);

  const rationale =
    typeof parsed.rationale === 'string' && parsed.rationale.trim()
      ? parsed.rationale.trim()
      : 'Scored from fit and intent signals.';

  return { score, band, rationale, method: 'ai' };
}

// Orchestration used by the Inngest worker: load the lead, build features,
// score (AI, falling back to rules), and persist.
export async function runLeadScoring(
  email: string
): Promise<(LeadScoreResult & { email: string }) | null> {
  const lead = await getLeadTriageByEmail(email);
  if (!lead) return null;

  const submissions = await getLeadSubmissions(email);

  let engagement = { opens: 0, clicks: 0 };
  try {
    engagement = await getLeadEngagementCounts(email);
  } catch {
    // Nurture tables may not exist yet — engagement is optional.
  }

  const features = buildLeadFeatures(lead, submissions, engagement);

  let result: LeadScoreResult;
  try {
    result = await scoreLeadWithAI(features);
  } catch (e) {
    console.error('AI lead scoring failed, using rules fallback:', e);
    result = computeRulesScore(features);
  }

  await setLeadScore(email, result.score, result.band, result.rationale);
  return { ...result, email };
}
