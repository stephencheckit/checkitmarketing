import { NextRequest, NextResponse } from 'next/server';
import { getPpcLeads, getPpcLeadStats, updatePpcLeadStatus, initializePpcLeadsTable } from '@/lib/db';

let initialized = false;

async function ensureInitialized() {
  if (!initialized) {
    await initializePpcLeadsTable();
    initialized = true;
  }
}

// GET - Fetch PPC leads and stats
export async function GET(request: NextRequest) {
  try {
    await ensureInitialized();

    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') || 'stats';
    const source = searchParams.get('source') || undefined;
    const status = searchParams.get('status') || undefined;
    const daysBack = parseInt(searchParams.get('days') || '90');

    if (view === 'stats') {
      const stats = await getPpcLeadStats(daysBack);
      return NextResponse.json(stats);
    }

    // view === 'leads'
    const leads = await getPpcLeads({ source, status, daysBack });
    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Error fetching PPC leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch PPC data' },
      { status: 500 }
    );
  }
}

// PATCH - Update lead status
export async function PATCH(request: NextRequest) {
  try {
    await ensureInitialized();

    const body = await request.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'id and status are required' },
        { status: 400 }
      );
    }

    const lead = await updatePpcLeadStatus(id, status, notes);
    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ lead });
  } catch (error) {
    console.error('Error updating PPC lead:', error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}
