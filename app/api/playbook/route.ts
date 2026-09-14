import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getVertical, type TargetAccount } from '@/lib/playbook';
import {
  getLabels,
  getAccountsForLabel,
  searchSequences,
  createSequenceWithSteps,
  bulkCreateAccounts,
} from '@/lib/apollo';

// GET /api/playbook?vertical=<id>[&format=csv]
// Default: resolves a vertical's Apollo lists to live counts + accounts, and reports
// whether each cadence already exists as an Apollo sequence.
// format=csv: returns the curated targetAccounts as an Apollo-import-ready CSV.
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

  const format = request.nextUrl.searchParams.get('format');
  if (format === 'csv') {
    if (!vertical.targetAccounts || vertical.targetAccounts.length === 0) {
      return NextResponse.json(
        { error: 'This vertical has no curated targetAccounts' },
        { status: 404 }
      );
    }
    const csv = accountsToCsv(vertical.targetAccounts);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${verticalId}-target-accounts.csv"`,
        'Cache-Control': 'no-store',
      },
    });
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

// POST /api/playbook
// Two actions, discriminated by `action` in the body (default: syncCadence for
// backward compatibility):
//
//   { action: 'syncCadence', verticalId, cadenceName }
//     Creates the cadence as an (inactive) Apollo sequence with its email steps.
//     Non-email steps (LinkedIn/call) are skipped — Apollo manual tasks aren't
//     reliably creatable via API; those steps stay in the playbook for the BDR.
//
//   { action: 'pushAccounts', verticalId }
//     Pushes the vertical's curated targetAccounts into two Apollo lists:
//     'US Medical — Target Accounts' (prospects) and
//     'US Medical — Customers (do not sequence)' (customers). List names come
//     from vertical.apolloAccountLists in that order.
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  if (session.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
  }

  const body = await request.json();
  const action: string = body.action || 'syncCadence';
  const verticalId: string | undefined = body.verticalId;
  const vertical = verticalId ? getVertical(verticalId) : undefined;
  if (!vertical) {
    return NextResponse.json({ error: 'Unknown vertical' }, { status: 404 });
  }

  if (action === 'pushAccounts') {
    const targets = vertical.targetAccounts ?? [];
    if (targets.length === 0) {
      return NextResponse.json(
        { error: 'This vertical has no curated targetAccounts to push' },
        { status: 400 }
      );
    }
    const [prospectListName, customerListName] = vertical.apolloAccountLists;
    if (!prospectListName) {
      return NextResponse.json(
        { error: 'Vertical is missing apolloAccountLists[0] (prospect list name)' },
        { status: 400 }
      );
    }

    const prospects = targets.filter((a) => a.relationship === 'prospect');
    const customers = targets.filter((a) => a.relationship === 'customer');

    const prospectResult =
      prospects.length > 0
        ? await bulkCreateAccounts(prospects, [prospectListName])
        : null;

    if (prospectResult && !prospectResult.success) {
      return respondBulkFailure(prospectResult, prospectListName);
    }

    const customerResult =
      customers.length > 0 && customerListName
        ? await bulkCreateAccounts(customers, [customerListName])
        : null;

    if (customerResult && !customerResult.success) {
      return respondBulkFailure(customerResult, customerListName!);
    }

    return NextResponse.json({
      success: true,
      prospects: prospectResult
        ? {
            list: prospectListName,
            created: prospectResult.createdCount,
            existing: prospectResult.existingCount,
            attempted: prospects.length,
          }
        : null,
      customers: customerResult
        ? {
            list: customerListName,
            created: customerResult.createdCount,
            existing: customerResult.existingCount,
            attempted: customers.length,
          }
        : null,
    });
  }

  // Default: syncCadence
  const cadenceName: string | undefined = body.cadenceName;
  const cadence = vertical.cadences.find((c) => c.name === cadenceName);
  if (!cadence) {
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

// ---------------------------------------------------------------------------

function respondBulkFailure(
  result: { needsPermission?: boolean; error?: string; createdCount: number; existingCount: number; batchesProcessed: number },
  listName: string
) {
  const status = result.needsPermission ? 403 : 502;
  const error = result.needsPermission
    ? `Your Apollo API key cannot create accounts. Generate a master API key in Apollo (Settings → Integrations → API) and update APOLLO_API_KEY, or use "Download CSV" and import "${listName}" manually.`
    : result.error || 'Account push to Apollo failed';
  return NextResponse.json({ error, list: listName, ...result }, { status });
}

function accountsToCsv(accounts: TargetAccount[]): string {
  const header = ['Company', 'Website', 'Segment', 'Tier', 'Relationship', 'Note'];
  const rows = accounts.map((a) => [
    csvField(a.name),
    csvField(a.domain),
    csvField(a.segment),
    csvField(String(a.tier)),
    csvField(a.relationship),
    csvField(a.note),
  ]);
  return [header.join(','), ...rows.map((r) => r.join(','))].join('\n') + '\n';
}

function csvField(v: string): string {
  if (/[",\n\r]/.test(v)) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return v;
}
