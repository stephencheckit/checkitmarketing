import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import * as cheerio from 'cheerio';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ScrapedArticle {
  title: string;
  description: string;
  date: string;
}

async function scrapeExistingContent(): Promise<ScrapedArticle[]> {
  const response = await fetch('https://www.checkit.net/blog', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    },
  });

  const html = await response.text();
  const $ = cheerio.load(html);
  const articles: ScrapedArticle[] = [];

  $('a[href*="/blog/"]').each((_, element) => {
    const $el = $(element);
    const href = $el.attr('href');
    
    if (!href || href === 'https://www.checkit.net/blog' || href.includes('/tag/') || href.includes('/page/')) {
      return;
    }

    const $title = $el.find('h2');
    if ($title.length === 0) return;

    const title = $title.text().trim();
    if (!title) return;

    const fullText = $el.text().trim();
    const dateMatch = fullText.match(/([A-Z][a-z]{2}\s+\d{1,2},\s+\d{4})/);
    const date = dateMatch ? dateMatch[1].trim() : '';

    const startReadingIndex = fullText.indexOf('Start Reading');
    const titleIndex = fullText.indexOf(title);
    let description = '';
    if (titleIndex !== -1 && startReadingIndex !== -1) {
      description = fullText.substring(titleIndex + title.length, startReadingIndex).replace(/\s+/g, ' ').trim();
    }

    const exists = articles.some(a => a.title === title);
    if (!exists && title) {
      articles.push({ title, description, date });
    }
  });

  return articles;
}

export async function GET() {
  try {
    // Scrape existing content for context
    const existingArticles = await scrapeExistingContent();
    
    const articleSummary = existingArticles
      .map(a => `- "${a.title}" (${a.date}): ${a.description}`)
      .join('\n');

    const prompt = `You are a content strategist for Checkit, a B2B company that provides predictive operations technology for food safety, healthcare/medical monitoring, and operational compliance.

Here are their recent blog articles:
${articleSummary}

Based on this content history, generate 5 NEW article ideas that would resonate with their audience. For each idea:
1. The topics should be fresh angles, not repeating what's already written
2. Focus on practical value for operations managers, compliance officers, and facility managers
3. Consider current trends in IoT, AI, sustainability, and regulatory compliance

For each article idea, provide:
- A compelling title
- A 2-sentence description of what the article would cover
- The target audience (e.g., "Hospital procurement leaders", "Food service managers")
- 3 key points the article should cover
- A ready-to-post LinkedIn post (professional tone, include relevant hashtags)
- A ready-to-post Facebook post (conversational, engaging)
- A ready-to-post X/Twitter post (under 280 characters)

Respond in JSON format:
{
  "ideas": [
    {
      "title": "Article Title",
      "description": "2-sentence description",
      "targetAudience": "Who this is for",
      "keyPoints": ["Point 1", "Point 2", "Point 3"],
      "linkedinPost": "Full LinkedIn post text with hashtags",
      "facebookPost": "Full Facebook post text",
      "twitterPost": "Short X post under 280 chars"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a B2B content strategist specializing in operational technology, IoT, and compliance. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const ideas = JSON.parse(content);

    return NextResponse.json({
      ...ideas,
      basedOn: existingArticles.length,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Ideation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate content ideas' },
      { status: 500 }
    );
  }
}
