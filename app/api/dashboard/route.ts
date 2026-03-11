import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getNurtureStats } from '@/lib/nurture-db';
import { getAllBufferPosts } from '@/lib/buffer';

export const dynamic = 'force-dynamic';

async function getRecentActivity(limit = 20) {
  const [
    recentNurtureEvents,
    recentEnrollments,
    recentSends,
    recentDemos,
    recentContent,
    recentBots,
    recentPpcLeads,
  ] = await Promise.all([
    sql`
      SELECT ne.event_type, ne.clicked_url, ne.event_timestamp as ts,
        ns.subject_sent, enr.contact_name, enr.company_name
      FROM nurture_events ne
      JOIN nurture_sends ns ON ns.id = ne.send_id
      JOIN nurture_enrollments enr ON enr.id = ns.enrollment_id
      WHERE ne.event_timestamp >= NOW() - INTERVAL '7 days'
      ORDER BY ne.event_timestamp DESC
      LIMIT ${limit}
    `.catch(() => []),
    sql`
      SELECT contact_name, company_name, contact_email, enrolled_at as ts
      FROM nurture_enrollments
      WHERE enrolled_at >= NOW() - INTERVAL '7 days'
      ORDER BY enrolled_at DESC
      LIMIT ${limit}
    `.catch(() => []),
    sql`
      SELECT ns.subject_sent, ns.sent_at as ts, enr.contact_name, enr.company_name
      FROM nurture_sends ns
      JOIN nurture_enrollments enr ON enr.id = ns.enrollment_id
      WHERE ns.sent_at >= NOW() - INTERVAL '7 days'
      ORDER BY ns.sent_at DESC
      LIMIT ${limit}
    `.catch(() => []),
    sql`
      SELECT name, email, company, source_page, created_at as ts
      FROM demo_requests
      WHERE created_at >= NOW() - INTERVAL '14 days'
      ORDER BY created_at DESC
      LIMIT 5
    `.catch(() => []),
    sql`
      SELECT title, status, source_query, created_at as ts, updated_at
      FROM content_drafts
      WHERE created_at >= NOW() - INTERVAL '14 days' OR updated_at >= NOW() - INTERVAL '14 days'
      ORDER BY GREATEST(created_at, updated_at) DESC
      LIMIT 5
    `.catch(() => []),
    sql`
      SELECT bot_name, path, country, city, visited_at as ts
      FROM bot_visits
      WHERE visited_at >= NOW() - INTERVAL '3 days'
      ORDER BY visited_at DESC
      LIMIT 10
    `.catch(() => []),
    sql`
      SELECT source, listing, category_name, created_at as ts
      FROM ppc_leads
      WHERE created_at >= NOW() - INTERVAL '14 days'
      ORDER BY created_at DESC
      LIMIT 5
    `.catch(() => []),
  ]);

  type ActivityItem = { type: string; ts: string; data: Record<string, unknown> };
  const items: ActivityItem[] = [];

  for (const e of recentNurtureEvents) {
    items.push({
      type: `nurture_${e.event_type}`,
      ts: e.ts,
      data: { subject: e.subject_sent, contact: e.contact_name, company: e.company_name, url: e.clicked_url },
    });
  }
  for (const e of recentEnrollments) {
    items.push({
      type: 'nurture_enrolled',
      ts: e.ts,
      data: { contact: e.contact_name, company: e.company_name },
    });
  }
  for (const s of recentSends) {
    items.push({
      type: 'nurture_sent',
      ts: s.ts,
      data: { subject: s.subject_sent, contact: s.contact_name, company: s.company_name },
    });
  }
  for (const d of recentDemos) {
    items.push({
      type: 'demo_request',
      ts: d.ts,
      data: { name: d.name, company: d.company, source: d.source_page },
    });
  }
  for (const c of recentContent) {
    items.push({
      type: 'content_update',
      ts: c.updated_at || c.ts,
      data: { title: c.title, status: c.status, query: c.source_query },
    });
  }
  for (const b of recentBots) {
    items.push({
      type: 'bot_visit',
      ts: b.ts,
      data: { bot: b.bot_name, path: b.path, location: [b.city, b.country].filter(Boolean).join(', ') },
    });
  }
  for (const p of recentPpcLeads) {
    items.push({
      type: 'ppc_lead',
      ts: p.ts,
      data: { source: p.source, listing: p.listing, category: p.category_name },
    });
  }

  items.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
  return items.slice(0, 30);
}

async function getQuickStats() {
  const [botCount, contentStats, ppcCount] = await Promise.all([
    sql`SELECT COUNT(*) as count FROM bot_visits WHERE visited_at >= NOW() - INTERVAL '7 days'`.catch(() => [{ count: 0 }]),
    sql`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'published') as published,
        COUNT(*) FILTER (WHERE status IN ('draft', 'brief', 'review')) as in_progress
      FROM content_drafts
    `.catch(() => [{ total: 0, published: 0, in_progress: 0 }]),
    sql`SELECT COUNT(*) as count FROM ppc_leads WHERE created_at >= NOW() - INTERVAL '30 days'`.catch(() => [{ count: 0 }]),
  ]);

  return {
    botVisits7d: Number(botCount[0]?.count || 0),
    contentTotal: Number(contentStats[0]?.total || 0),
    contentPublished: Number(contentStats[0]?.published || 0),
    contentInProgress: Number(contentStats[0]?.in_progress || 0),
    ppcLeads30d: Number(ppcCount[0]?.count || 0),
  };
}

export async function GET() {
  try {
    const [nurtureStats, activity, quickStats, bufferPosts] = await Promise.allSettled([
      getNurtureStats(),
      getRecentActivity(),
      getQuickStats(),
      getAllBufferPosts(5, 5),
    ]);

    return NextResponse.json({
      nurture: nurtureStats.status === 'fulfilled' ? nurtureStats.value : null,
      activity: activity.status === 'fulfilled' ? activity.value : [],
      stats: quickStats.status === 'fulfilled' ? quickStats.value : null,
      buffer: bufferPosts.status === 'fulfilled' ? bufferPosts.value : null,
      bufferError: bufferPosts.status === 'rejected' ? bufferPosts.reason?.message : null,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
