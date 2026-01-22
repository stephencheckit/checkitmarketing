import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { title, description, targetAudience, keyPoints } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const prompt = `Write a professional blog article for Checkit, a B2B company specializing in predictive operations technology for food safety, healthcare monitoring, and operational compliance.

Article Details:
- Title: ${title}
- Target Audience: ${targetAudience}
- Description: ${description}
- Key Points to Cover: ${keyPoints?.join(', ')}

Requirements:
1. Write in a professional but accessible tone suitable for ${targetAudience}
2. Include an engaging introduction that hooks the reader
3. Cover each key point in dedicated sections with subheadings
4. Include practical, actionable insights
5. Add a conclusion with a clear call-to-action
6. Aim for approximately 800-1200 words
7. Use markdown formatting (## for headings, **bold** for emphasis, bullet points where appropriate)

Write the complete article now:`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert B2B content writer specializing in operational technology, IoT, compliance, and digital transformation. Write engaging, informative articles that provide real value to readers.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const article = completion.choices[0]?.message?.content;
    if (!article) {
      throw new Error('No response from OpenAI');
    }

    // Count words
    const wordCount = article.split(/\s+/).length;

    return NextResponse.json({
      title,
      article,
      wordCount,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Article generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate article' },
      { status: 500 }
    );
  }
}
