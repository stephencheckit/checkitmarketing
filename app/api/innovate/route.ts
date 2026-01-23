import { NextRequest, NextResponse } from 'next/server';
import { getCurrentPositioningData } from '@/lib/db';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface CompetitorArticle {
  title: string;
  snippet: string;
}

interface CompetitorContent {
  competitor: string;
  articles: CompetitorArticle[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { competitorContent } = body as { competitorContent: CompetitorContent[] };
    
    if (!competitorContent || competitorContent.length === 0) {
      return NextResponse.json({ error: 'No competitor content provided' }, { status: 400 });
    }
    
    // Get Checkit's positioning for context
    const positioning = await getCurrentPositioningData();
    const positioningContext = positioning?.data ? JSON.stringify(positioning.data) : '';
    
    // Build competitor summary
    const competitorSummary = competitorContent.map(c => {
      const articles = c.articles.map(a => `- ${a.title}${a.snippet ? `: ${a.snippet.slice(0, 100)}...` : ''}`).join('\n');
      return `${c.competitor}:\n${articles}`;
    }).join('\n\n');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a strategic content innovation analyst for Checkit, an intelligent operations platform for compliance, safety, and efficiency across industries like healthcare, food safety, senior living, and facilities management.

Your job is to analyze what competitors are publishing and identify UNIQUE content opportunities for Checkit - angles competitors are missing, topics they're not covering well, or ways Checkit can differentiate its thought leadership.

Checkit's key differentiators:
- Multi-site visibility and control (single platform for all locations)
- Automated compliance (proactive, not reactive)
- IoT sensors + mobile apps + cloud platform (complete solution)
- Peace of mind through automation

${positioningContext ? `Additional Checkit positioning context:\n${positioningContext}` : ''}

Generate innovation ideas that:
1. Fill gaps competitors are missing
2. Take a contrarian or unique angle on topics competitors cover
3. Position Checkit's strengths against competitor weaknesses
4. Address emerging trends competitors haven't picked up on
5. Combine topics in novel ways

Respond with JSON only:
{
  "ideas": [
    {
      "title": "Compelling headline for the content",
      "angle": "Brief description of the unique angle (1 sentence)",
      "competitorInsight": "What competitors are doing/saying that creates this opportunity (2-3 sentences)",
      "checkitOpportunity": "How Checkit can uniquely address this with its platform/approach (2-3 sentences)",
      "targetAudience": "Specific audience this resonates with",
      "contentTypes": ["Blog post", "LinkedIn article", "Webinar", "Case study", "Infographic"],
      "keyMessages": ["Key message 1", "Key message 2", "Key message 3"]
    }
  ]
}

Generate 5 innovation ideas.`
        },
        {
          role: 'user',
          content: `Here's what competitors are currently publishing:\n\n${competitorSummary}\n\nBased on this, what unique content opportunities exist for Checkit?`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
      max_tokens: 3000,
    });
    
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }
    
    const parsed = JSON.parse(content);
    
    return NextResponse.json({
      ideas: parsed.ideas || [],
      generatedAt: new Date().toISOString(),
      basedOn: competitorContent.reduce((sum, c) => sum + c.articles.length, 0),
    });
  } catch (error) {
    console.error('Error generating innovation ideas:', error);
    return NextResponse.json(
      { error: 'Failed to generate innovation ideas' },
      { status: 500 }
    );
  }
}
