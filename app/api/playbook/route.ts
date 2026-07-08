import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getVertical } from '@/lib/playbook';
import {
  getLabels,
  getAccountsForLabel,
  searchSequences,
  createSequenceWithSteps,
} from '@/lib/apollo';

// GET /api/playbook?vertical=<id>
// Resolves a vertical's Apollo lists to live counts + accounts, and reports
// whether each cadence already exists as an Apollo sequence.
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const verticalId = request.nextUrl.searchParams.get('vertical');
  if (!verticalId) {
    return NextResponse.json({ error: 'vertical param required' }, { status: 400 });
  }
  const vertical = getVertical(verticalId);
  if (!vertical) {
    return NextResponse.json({ error: 'Unknown vertical' }, { status: 404 });
  }

  try {
    const [labels, sequences] = await Promise.all([getLabels(), searchSequences()]);
    const byName = new Map(labels.map((l) => [l.name.toLowerCase(), l]));

    const accountLists = await Promise.all(
      vertical.apolloAccountLists.map(async (name) => {
        const label = byName.get(name.toLowerCase());
        if (!label) return { name, found: false as const, count: 0, accounts: [] };
        const accounts = await getAccountsForLabel(label.id);
        return { name, found: true as const, count: label.cachedCount, accounts };
      })
    );

    const contactLists = vertical.apolloContactLists.map((name) => {
      const label = byName.get(name.toLowerCase());
      return { name, found: !!label, count: label?.cachedCount ?? 0 };
    });

    const sequenceByName = new Map(sequences.map((s) => [s.name.toLowerCase(), s]));
    const cadences = vertical.cadences.map((c) => {
      const existing = sequenceByName.get(c.name.toLowerCase());
      return {
        name: c.name,
        syncedSequenceId: existing?.id ?? null,
        active: existing?.active ?? false,
      };
    });

    return NextResponse.json({ accountLists, contactLists, cadences });
  } catch (e) {
    console.error('Playbook Apollo fetch failed:', e);
    return NextResponse.json({ error: 'Apollo fetch failed' }, { status: 502 });
  }
}

// POST /api/playbook  { verticalId, cadenceName }
// Creates the cadence as an (inactive) Apollo sequence with its email steps.
// Non-email steps (LinkedIn/call) are skipped — Apollo manual tasks aren't
// reliably creatable via API; those steps stay in the playbook for the BDR.
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  if (session.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
  }

  const { verticalId, cadenceName } = await request.json();
  const vertical = getVertical(verticalId);
  const cadence = vertical?.cadences.find((c) => c.name === cadenceName);
  if (!vertical || !cadence) {
    return NextResponse.json({ error: 'Cadence not found' }, { status: 404 });
  }

  // Guard against duplicate sequences in Apollo
  const existing = await searchSequences(cadence.name);
  if (existing.some((s) => s.name.toLowerCase() === cadence.name.toLowerCase() && !s.archived)) {
    return NextResponse.json(
      { error: 'A sequence with this name already exists in Apollo' },
      { status: 409 }
    );
  }

  const emailSteps = cadence.steps
    .filter((s) => s.channel === 'email')
    .map((s) => ({ waitDays: s.waitDays, subject: s.subject, body: s.body }));

  const result = await createSequenceWithSteps(cadence.name, emailSteps);

  if (!result.success) {
    const status = result.needsMasterKey ? 403 : 502;
    const error = result.needsMasterKey
      ? 'Your Apollo API key cannot create sequences. Generate a master API key in Apollo (Settings → Integrations → API) and update APOLLO_API_KEY, or copy the cadence into Apollo manually.'
      : result.error || 'Sequence creation failed';
    return NextResponse.json({ error, ...result }, { status });
  }

  return NextResponse.json(result);
}
