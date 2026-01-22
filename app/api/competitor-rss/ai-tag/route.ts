import { NextRequest, NextResponse } from 'next/server';
import { getItemsNeedingAITagging, updateItemTags } from '@/lib/db';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const VALID_TOPICS = [
  'product-update',
  'case-study', 
  'thought-leadership',
  'webinar',
  'compliance',
  'company-news',
  'how-to',
  'industry-news',
];

const VALID_INDUSTRIES = [
  'healthcare',
  'food-safety',
  'senior-living',
  'pharmacy',
  'hospitality',
  'retail',
  'facilities',
];

// POST - AI tag untagged articles
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const limit = body.limit || 20;
    
    // Get articles that need AI tagging
    const items = await getItemsNeedingAITagging(limit);
    
    if (items.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No items need AI tagging',
        tagged: 0,
      });
    }
    
    const results = {
      tagged: 0,
      failed: 0,
      details: [] as Array<{ id: number; title: string; topics: string[]; industries: string[] }>,
    };
    
    // Process in batches to avoid rate limits
    for (const item of items) {
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a content classifier for B2B software marketing. Classify articles by topic and industry.

Valid topics: ${VALID_TOPICS.join(', ')}
Valid industries: ${VALID_INDUSTRIES.join(', ')}

Respond with JSON only:
{"topics": ["topic1"], "industries": ["industry1"]}

Rules:
- Only use valid values from the lists above
- An article can have multiple topics and industries
- If uncertain, return empty arrays
- Focus on the PRIMARY topics and industries, not tangential mentions`,
            },
            {
              role: 'user',
              content: `Classify this article:

Title: ${item.title}
${item.content_snippet ? `Content: ${item.content_snippet}` : ''}
Competitor: ${item.competitor_id}`,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.3,
          max_tokens: 150,
        });
        
        const content = response.choices[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          const topics = (parsed.topics || []).filter((t: string) => VALID_TOPICS.includes(t));
          const industries = (parsed.industries || []).filter((i: string) => VALID_INDUSTRIES.includes(i));
          
          await updateItemTags(item.id, topics, industries);
          
          results.tagged++;
          results.details.push({
            id: item.id,
            title: item.title,
            topics,
            industries,
          });
        }
      } catch (err) {
        console.error(`Failed to tag item ${item.id}:`, err);
        results.failed++;
      }
    }
    
    return NextResponse.json({
      success: true,
      ...results,
    });
  } catch (error) {
    console.error('Error AI tagging articles:', error);
    return NextResponse.json(
      { error: 'Failed to AI tag articles' },
      { status: 500 }
    );
  }
}
