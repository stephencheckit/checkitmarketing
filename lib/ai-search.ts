// AI Search Monitor - Query AI engines and track brand mentions
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Checkit and competitor brands to track
export const BRANDS_TO_TRACK = [
  'Checkit',
  'ComplianceMate',
  'Therma',
  'Squadle',
  'Jolt',
  'Zenput',
  'Testo',
  'SmartSense',
  'Paragon',
  'FoodDocs',
  'iAuditor',
  'SafetyCulture',
];

// Default queries to monitor - organized by category
export const DEFAULT_QUERIES = [
  // Buyer Intent - Primary
  'What is the best temperature monitoring software for restaurants?',
  'Best food safety compliance software',
  'Top temperature monitoring systems for commercial kitchens',
  'HACCP compliance software recommendations',
  'Best digital food safety management system',
  // Buyer Intent - Industry Specific
  'Best IoT temperature monitoring for food service',
  'Senior living facility compliance management software',
  'Temperature monitoring solutions for healthcare',
  'Restaurant compliance software comparison',
  'Cold chain monitoring software for food retail',
  // Problem/Solution
  'How to automate HACCP compliance',
  'How to reduce food safety violations',
  'Best way to monitor walk-in cooler temperatures remotely',
  'How to digitize paper food safety checklists',
  // Comparison
  'ComplianceMate vs alternatives',
  'Therma temperature monitoring review',
  'Best SmartSense competitors',
  'Zenput vs other restaurant compliance apps',
];

// Query categories for organization
export const QUERY_CATEGORIES = {
  'buyer-intent': 'Buyer Intent',
  'industry-specific': 'Industry Specific', 
  'problem-solution': 'Problem/Solution',
  'comparison': 'Comparison',
  'feature': 'Feature Focused',
  'custom': 'Custom',
} as const;

// Filter out branded queries (queries containing our brand name skew results)
export function isNonBrandedQuery(query: string): boolean {
  const brandTerms = ['checkit', 'check-it', 'check it'];
  const lowerQuery = query.toLowerCase();
  return !brandTerms.some(term => lowerQuery.includes(term));
}

export interface AISearchResult {
  query: string;
  response: string;
  brandsFound: { brand: string; mentioned: boolean; context: string | null }[];
  checkitMentioned: boolean;
  checkitPosition: number | null; // Position in list if mentioned (1 = first)
  competitorsMentioned: string[];
  timestamp: Date;
  source: 'openai' | 'perplexity';
}

// Query OpenAI as if asking for recommendations
export async function queryOpenAI(query: string): Promise<AISearchResult> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant providing recommendations for business software. Give specific product recommendations when asked, mentioning actual company and product names. Be concise but comprehensive.',
      },
      {
        role: 'user',
        content: query,
      },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  const response = completion.choices[0]?.message?.content || '';
  
  return analyzeResponse(query, response, 'openai');
}

// Analyze AI response for brand mentions
function analyzeResponse(
  query: string,
  response: string,
  source: 'openai' | 'perplexity'
): AISearchResult {
  const responseLower = response.toLowerCase();
  const brandsFound: AISearchResult['brandsFound'] = [];
  const competitorsMentioned: string[] = [];
  let checkitMentioned = false;
  let checkitPosition: number | null = null;
  
  // Track order of mentions
  const mentionOrder: { brand: string; index: number }[] = [];
  
  for (const brand of BRANDS_TO_TRACK) {
    const brandLower = brand.toLowerCase();
    const index = responseLower.indexOf(brandLower);
    const mentioned = index !== -1;
    
    // Extract context around mention (50 chars before and after)
    let context: string | null = null;
    if (mentioned) {
      const start = Math.max(0, index - 50);
      const end = Math.min(response.length, index + brand.length + 50);
      context = response.substring(start, end).trim();
      if (start > 0) context = '...' + context;
      if (end < response.length) context = context + '...';
      
      mentionOrder.push({ brand, index });
      
      if (brandLower === 'checkit') {
        checkitMentioned = true;
      } else {
        competitorsMentioned.push(brand);
      }
    }
    
    brandsFound.push({ brand, mentioned, context });
  }
  
  // Determine Checkit's position in mention order
  mentionOrder.sort((a, b) => a.index - b.index);
  const checkitIndex = mentionOrder.findIndex(m => m.brand.toLowerCase() === 'checkit');
  if (checkitIndex !== -1) {
    checkitPosition = checkitIndex + 1;
  }
  
  return {
    query,
    response,
    brandsFound,
    checkitMentioned,
    checkitPosition,
    competitorsMentioned,
    timestamp: new Date(),
    source,
  };
}

// Run all default queries
export async function runFullScan(): Promise<AISearchResult[]> {
  const results: AISearchResult[] = [];
  
  for (const query of DEFAULT_QUERIES) {
    try {
      const result = await queryOpenAI(query);
      results.push(result);
      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Error querying "${query}":`, error);
    }
  }
  
  return results;
}

// Run a single custom query
export async function runSingleQuery(query: string): Promise<AISearchResult> {
  return queryOpenAI(query);
}

// Generate content brief for a query where Checkit wasn't mentioned
export async function generateContentBrief(
  query: string,
  competitorsMentioned: string[]
): Promise<{
  title: string;
  targetKeywords: string[];
  outline: string[];
  keyPoints: string[];
  faqQuestions: string[];
  estimatedWordCount: number;
}> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a content strategist for Checkit, a leading temperature monitoring and operational compliance platform for food service, healthcare, and senior living facilities.

Your job is to create content briefs that will help Checkit appear in AI search results and rank well in traditional search engines.

Checkit's key differentiators:
- Real-time IoT temperature monitoring with automated alerts
- Digital checklists and compliance workflows
- HACCP and food safety compliance automation
- Senior living facility management features
- Mobile-first design for frontline workers
- Integration with existing systems
- Proven ROI and time savings

Competitors include: ${competitorsMentioned.join(', ')}

Create content that is:
1. Comprehensive and authoritative
2. Structured for AI consumption (clear sections, FAQs)
3. SEO-optimized with natural keyword usage
4. Genuinely helpful to readers
5. Positions Checkit as a top solution without being overly salesy`,
      },
      {
        role: 'user',
        content: `Create a content brief for this search query: "${query}"

The goal is to create content that will make AI assistants recommend Checkit when users ask this question.

Return a JSON object with:
- title: Compelling, SEO-friendly article title (include primary keyword)
- targetKeywords: Array of 5-8 keywords/phrases to target
- outline: Array of H2 section headings for the article
- keyPoints: Array of 5-7 key points the article must cover
- faqQuestions: Array of 4-6 FAQ questions to include
- estimatedWordCount: Recommended word count (usually 1500-2500)`,
      },
    ],
    temperature: 0.7,
    max_tokens: 1000,
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0]?.message?.content || '{}';
  const parsed = JSON.parse(content);

  return {
    title: parsed.title || `Guide to ${query}`,
    targetKeywords: parsed.targetKeywords || [query],
    outline: parsed.outline || [],
    keyPoints: parsed.keyPoints || [],
    faqQuestions: parsed.faqQuestions || [],
    estimatedWordCount: parsed.estimatedWordCount || 2000,
  };
}

// Generate full article content from a brief
export async function generateFullArticle(brief: {
  title: string;
  targetKeywords: string[];
  outline: string[];
  keyPoints: string[];
  faqQuestions: string[];
}): Promise<{
  content: string;
  metaDescription: string;
  excerpt: string;
}> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a content writer for Checkit, a leading temperature monitoring and operational compliance platform.

Write content that is:
1. Comprehensive, authoritative, and genuinely helpful
2. Structured with clear H2 and H3 headings (use markdown ##/###)
3. Includes an FAQ section at the end
4. Uses natural, conversational language
5. Mentions Checkit where relevant, but isn't overly promotional
6. Optimized for both AI search engines and human readers
7. Uses bullet points and short paragraphs for scannability

Format the article in markdown.`,
      },
      {
        role: 'user',
        content: `Write a comprehensive article based on this brief:

Title: ${brief.title}

Target Keywords: ${brief.targetKeywords.join(', ')}

Sections to cover:
${brief.outline.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Key points to include:
${brief.keyPoints.map((p) => `- ${p}`).join('\n')}

FAQ questions to answer:
${brief.faqQuestions.map((q) => `- ${q}`).join('\n')}

Write the full article (aim for 1500-2000 words). Start with an engaging introduction, cover all sections, and end with the FAQ section.

Also provide:
- A meta description (150-160 characters)
- A short excerpt (2-3 sentences for previews)`,
      },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  const response = completion.choices[0]?.message?.content || '';
  
  // Extract meta description and excerpt if included
  let content = response;
  let metaDescription = '';
  let excerpt = '';

  // Try to extract meta description
  const metaMatch = response.match(/Meta [Dd]escription:\s*(.+?)(?:\n|$)/);
  if (metaMatch) {
    metaDescription = metaMatch[1].trim();
    content = content.replace(metaMatch[0], '');
  }

  // Try to extract excerpt
  const excerptMatch = response.match(/Excerpt:\s*([^\n]+(?:\n[^\n]+)*)(?:\n\n|$)/);
  if (excerptMatch) {
    excerpt = excerptMatch[1].trim();
    content = content.replace(excerptMatch[0], '');
  }

  // Generate meta description if not found
  if (!metaDescription) {
    const metaCompletion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Write a meta description (150-160 characters) for this article titled "${brief.title}" about ${brief.targetKeywords[0]}. Include a call to action.`,
        },
      ],
      max_tokens: 100,
    });
    metaDescription = metaCompletion.choices[0]?.message?.content?.trim() || '';
  }

  // Generate excerpt if not found
  if (!excerpt) {
    excerpt = content.split('\n\n').slice(1, 3).join(' ').substring(0, 300) + '...';
  }

  return {
    content: content.trim(),
    metaDescription,
    excerpt,
  };
}

// Generate AI search queries from Search Console data
export async function generateQueriesFromSearchTerms(
  searchTerms: string[]
): Promise<{
  queries: { query: string; category: string; source: string }[];
}> {
  if (searchTerms.length === 0) {
    return { queries: [] };
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are helping Checkit (a temperature monitoring and compliance platform) discover what questions people ask AI assistants.

Given a list of search terms that bring traffic to Checkit's website, convert them into natural questions that someone might ask an AI assistant like ChatGPT.

Focus on questions where:
1. Someone is looking for software recommendations
2. Someone is comparing solutions
3. Someone has a problem Checkit could solve

Ignore branded searches or navigational queries.
IMPORTANT: Do NOT include "Checkit" or any brand name in the generated queries. We want unbranded, generic questions.`,
      },
      {
        role: 'user',
        content: `Convert these search terms into AI assistant questions:

${searchTerms.slice(0, 30).map((t, i) => `${i + 1}. ${t}`).join('\n')}

Return JSON:
{
  "queries": [
    { "query": "natural question form WITHOUT any brand names", "category": "buyer-intent|comparison|problem-solution|feature", "source": "search-console" }
  ]
}

Only include relevant queries. Skip any that are navigational, branded, or contain "Checkit".`,
      },
    ],
    temperature: 0.7,
    max_tokens: 1500,
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0]?.message?.content || '{}';
  const parsed = JSON.parse(content);

  return { queries: parsed.queries || [] };
}

// Generate query recommendations based on existing queries
export async function generateQueryRecommendations(
  existingQueries: string[],
  contentGaps: string[] = []
): Promise<{
  recommendations: {
    query: string;
    rationale: string;
    category: 'expansion' | 'competitor' | 'feature' | 'use-case' | 'comparison';
    priority: 'high' | 'medium' | 'low';
  }[];
}> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an AI search strategist helping Checkit (a temperature monitoring and operational compliance platform) improve their visibility in AI search results.

Checkit competes with:
- Therma (temperature monitoring)
- ComplianceMate (compliance checklists)
- SmartSense (cold chain monitoring)
- Testo Saveris (data loggers)
- HACCP software solutions

Checkit serves: food service, restaurants, commercial kitchens, senior living facilities, healthcare, food retail.

Key features: IoT temperature monitoring, digital checklists, HACCP compliance, automated alerts, mobile app.

Analyze the existing queries being tracked and recommend NEW queries that would:
1. Expand coverage into related search intents
2. Target competitor comparison searches
3. Focus on specific features/use cases
4. Address common buyer questions
5. Cover industry-specific needs`,
      },
      {
        role: 'user',
        content: `Current queries being tracked:
${existingQueries.map((q, i) => `${i + 1}. ${q}`).join('\n')}

${contentGaps.length > 0 ? `\nContent gaps (Checkit not mentioned for these):
${contentGaps.map((q, i) => `- ${q}`).join('\n')}` : ''}

Recommend 8-10 NEW queries to add for better coverage. Focus on queries where:
- People are making buying decisions
- Competitors might be mentioned
- Checkit's features would be relevant

IMPORTANT: Do NOT include "Checkit" in any query. We want unbranded queries to see organic AI recommendations.

Return JSON:
{
  "recommendations": [
    {
      "query": "the search query",
      "rationale": "why this query matters",
      "category": "expansion|competitor|feature|use-case|comparison",
      "priority": "high|medium|low"
    }
  ]
}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 1500,
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0]?.message?.content || '{}';
  const parsed = JSON.parse(content);

  return {
    recommendations: parsed.recommendations || [],
  };
}

// Calculate summary statistics
export function calculateSummary(results: AISearchResult[]): {
  totalQueries: number;
  checkitMentions: number;
  checkitMentionRate: number;
  avgCheckitPosition: number | null;
  topCompetitors: { name: string; mentions: number }[];
} {
  const totalQueries = results.length;
  const checkitMentions = results.filter(r => r.checkitMentioned).length;
  const checkitMentionRate = totalQueries > 0 ? checkitMentions / totalQueries : 0;
  
  // Calculate average position when mentioned
  const positions = results
    .filter(r => r.checkitPosition !== null)
    .map(r => r.checkitPosition!);
  const avgCheckitPosition = positions.length > 0 
    ? positions.reduce((a, b) => a + b, 0) / positions.length 
    : null;
  
  // Count competitor mentions
  const competitorCounts: Record<string, number> = {};
  for (const result of results) {
    for (const competitor of result.competitorsMentioned) {
      competitorCounts[competitor] = (competitorCounts[competitor] || 0) + 1;
    }
  }
  
  const topCompetitors = Object.entries(competitorCounts)
    .map(([name, mentions]) => ({ name, mentions }))
    .sort((a, b) => b.mentions - a.mentions)
    .slice(0, 10);
  
  return {
    totalQueries,
    checkitMentions,
    checkitMentionRate,
    avgCheckitPosition,
    topCompetitors,
  };
}
