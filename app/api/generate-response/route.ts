import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getCurrentPositioningData, saveCompetitorResponse, initializeCompetitorResponsesTable } from '@/lib/db';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GenerateRequest {
  competitorName: string;
  competitorArticleTitle: string;
  competitorArticleSnippet?: string;
  competitorArticleUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { competitorName, competitorArticleTitle, competitorArticleSnippet, competitorArticleUrl } = body;

    if (!competitorArticleTitle) {
      return NextResponse.json(
        { error: 'Article title is required' },
        { status: 400 }
      );
    }

    // Fetch Checkit positioning for voice/messaging
    let positioningContext = '';
    try {
      const positioning = await getCurrentPositioningData();
      if (positioning?.data) {
        const p = positioning.data;
        positioningContext = `
CHECKIT POSITIONING:
- Mission: ${p.mission || 'Digital operations management platform'}
- Vision: ${p.vision || 'Helping businesses eliminate paper-based processes'}
- Value Proposition: ${p.valueProposition || 'Automated compliance and operational efficiency'}
- Key Differentiators: ${p.differentiators?.map((d: { title: string }) => d.title).join(', ') || 'IoT sensors, automated monitoring, real-time alerts'}
- Messaging Pillars: ${p.messagingPillars?.map((m: { theme: string }) => m.theme).join(', ') || 'Compliance, Efficiency, Visibility'}
- Elevator Pitch (30s): ${p.elevatorPitches?.thirtySecond || 'Checkit helps businesses digitize operations, automate compliance, and gain real-time visibility.'}
`;
      }
    } catch {
      // Use default positioning if fetch fails
      positioningContext = `
CHECKIT POSITIONING:
- Checkit is a digital operations management platform
- Core focus: Automated compliance, temperature monitoring, task management
- Target markets: Food retail, hospitality, healthcare, senior living
- Value proposition: Replace paper with digital, automate compliance, reduce risk
`;
    }

    const prompt = `You are a content marketing expert for Checkit, a digital operations management platform.

A competitor (${competitorName}) just published content on this topic:
"${competitorArticleTitle}"

${competitorArticleSnippet ? `Article snippet: "${competitorArticleSnippet}"` : ''}

${positioningContext}

Your task: Create Checkit's own original content on this same topic. DO NOT copy or plagiarize the competitor's content. Instead, provide Checkit's unique perspective and expertise on this topic.

Generate:
1. A compelling article title (different from the competitor's)
2. A brief description (2-3 sentences)
3. 4-5 key points Checkit could make on this topic
4. A LinkedIn post (200-300 chars) sharing Checkit's perspective
5. A full article (500-700 words) in Checkit's voice

The tone should be:
- Professional but accessible
- Focus on practical value and outcomes
- Emphasize digital transformation and operational efficiency
- Include specific benefits like compliance, visibility, and time savings

Format your response as JSON:
{
  "title": "...",
  "description": "...",
  "keyPoints": ["...", "...", "...", "...", "..."],
  "linkedinPost": "...",
  "article": "..."
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a B2B content marketing expert specializing in operations management, compliance, and digital transformation. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content || '';
    
    // Parse JSON from response
    let parsed;
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    const wordCount = parsed.article?.split(/\s+/).length || 0;
    
    // Save to database
    await initializeCompetitorResponsesTable();
    const saved = await saveCompetitorResponse({
      competitorName,
      sourceArticleTitle: competitorArticleTitle,
      sourceArticleUrl: competitorArticleUrl,
      sourceArticleSnippet: competitorArticleSnippet,
      responseTitle: parsed.title,
      responseDescription: parsed.description,
      responseKeyPoints: parsed.keyPoints || [],
      responseLinkedinPost: parsed.linkedinPost,
      responseArticle: parsed.article,
      responseWordCount: wordCount,
    });

    return NextResponse.json({
      success: true,
      id: saved.id,
      basedOn: {
        competitor: competitorName,
        originalTitle: competitorArticleTitle,
      },
      generated: {
        title: parsed.title,
        description: parsed.description,
        keyPoints: parsed.keyPoints || [],
        linkedinPost: parsed.linkedinPost,
        article: parsed.article,
        wordCount,
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error generating response content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
