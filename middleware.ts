import { NextRequest, NextResponse, NextFetchEvent } from 'next/server';
import { neon } from '@neondatabase/serverless';

const AI_BOT_PATTERNS: Record<string, RegExp> = {
  'ChatGPT-User': /ChatGPT-User/i,
  'GPTBot': /GPTBot/i,
  'Google-Extended': /Google-Extended/i,
  'Googlebot': /Googlebot/i,
  'PerplexityBot': /PerplexityBot/i,
  'ClaudeBot': /ClaudeBot/i,
  'Claude-Web': /Claude-Web/i,
  'Amazonbot': /Amazonbot/i,
  'anthropic-ai': /anthropic-ai/i,
  'cohere-ai': /cohere-ai/i,
  'Bingbot': /bingbot/i,
  'Applebot': /Applebot/i,
  'Meta-ExternalAgent': /Meta-ExternalAgent/i,
  'Bytespider': /Bytespider/i,
  'CCBot': /CCBot/i,
  'YouBot': /YouBot/i,
};

function identifyBot(userAgent: string): string | null {
  for (const [name, pattern] of Object.entries(AI_BOT_PATTERNS)) {
    if (pattern.test(userAgent)) {
      return name;
    }
  }
  return null;
}

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const userAgent = request.headers.get('user-agent') || '';
  const botName = identifyBot(userAgent);

  if (botName && process.env.DATABASE_URL) {
    const sql = neon(process.env.DATABASE_URL);
    const path = request.nextUrl.pathname;
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') || '';
    const country = request.headers.get('x-vercel-ip-country') || '';
    const city = request.headers.get('x-vercel-ip-city') || '';
    const referer = request.headers.get('referer') || '';
    const method = request.method;

    event.waitUntil(
      sql`
        INSERT INTO bot_visits (bot_name, user_agent, path, ip_address, country, city, referer, method)
        VALUES (${botName}, ${userAgent}, ${path}, ${ip}, ${country}, ${city}, ${referer}, ${method})
      `.catch((err) => {
        console.error('Bot visit logging failed:', err);
      })
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
