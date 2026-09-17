import { NextRequest, NextResponse } from 'next/server';
import {
  initializeProspectingTables,
  getProspectingSprints,
  updateProspectingSprintStatus,
  upsertProspectingAssignment,
  upsertAccountSnapshot,
  upsertPersonaSnapshot,
  startProspectingSync,
  finishProspectingSync,
} from '@/lib/db';
import {
  getAccountStages,
  getUsers,
  getAccountDetailsForLabel,
  getContactsForAccounts,
} from '@/lib/apollo';

export const maxDuration = 300;

const CRON_SECRET = process.env.CRON_SECRET;

// Apollo's sequence tally counts contacts, not accounts, so a large list can
// pull a lot of contacts. Cap per sprint to stay inside maxDuration.
const CONTACT_PAGE_CAP = 10;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = Date.now();
  const log: string[] = [];
  const today = new Date().toISOString().slice(0, 10);

  try {
    await initializeProspectingTables();

    const sprints = await getProspectingSprints('active');
    if (sprints.length === 0) {
      log.push('No active sprints. Nothing to snapshot.');
      return NextResponse.json({ success: true, log, duration: Date.now() - startTime });
    }

    // Resolve Apollo's id-based fields to names once for all sprints.
    const [stages, users] = await Promise.all([getAccountStages(), getUsers()]);
    const stageById = new Map(stages.map((s) => [s.id, s]));
    const userById = new Map(users.map((u) => [u.id, u]));
    log.push(`Resolved ${stages.length} stages, ${users.length} Apollo users.`);

    const summary: {
      sprint: string;
      accounts: number;
      contacts: number;
      unowned: number;
      completed: boolean;
    }[] = [];

    for (const sprint of sprints) {
      const sync = await startProspectingSync(sprint.id);
      try {
        const accounts = await getAccountDetailsForLabel(sprint.apollo_label_id);
        log.push(`Sprint "${sprint.name}": ${accounts.length} accounts in Apollo list.`);

        let unowned = 0;
        for (const a of accounts) {
          const stage = a.accountStageId ? stageById.get(a.accountStageId) : undefined;
          const owner = a.ownerId ? userById.get(a.ownerId) : undefined;
          if (!a.ownerId) unowned++;

          // Keeps the roster in step with the Apollo list, and records the
          // owner at the point an account first entered the sprint.
          await upsertProspectingAssignment({
            sprintId: sprint.id,
            apolloAccountId: a.id,
            accountName: a.name,
            domain: a.domain,
            hubspotCompanyId: a.hubspotId,
            assignedOwnerId: a.ownerId,
            assignedOwnerName: owner?.name || owner?.email || null,
          });

          await upsertAccountSnapshot({
            sprintId: sprint.id,
            apolloAccountId: a.id,
            snapshotDate: today,
            accountStageId: a.accountStageId,
            accountStageName: stage?.name || null,
            accountStageCategory: stage?.category || null,
            ownerId: a.ownerId,
            ownerName: owner?.name || owner?.email || null,
            numContacts: a.numContacts,
            contactsActive: a.tally.active,
            contactsFinished: a.tally.finished,
            contactsPaused: a.tally.paused,
            contactsBounced: a.tally.bounced,
            contactsNotSent: a.tally.notSent,
            sequenceCount: a.sequenceIds.length,
            lastActivityDate: a.lastActivityDate,
          });
        }

        if (unowned > 0) {
          log.push(
            `  Warning: ${unowned}/${accounts.length} accounts have no Apollo owner — BDR attribution will be blank for these.`
          );
        }

        // Personas: only for accounts that have contacts, to avoid paging
        // through empty accounts.
        const accountIds = accounts.filter((a) => a.numContacts > 0).map((a) => a.id);
        const contacts = await getContactsForAccounts(accountIds, CONTACT_PAGE_CAP);
        for (const c of contacts) {
          if (!c.accountId) continue;
          await upsertPersonaSnapshot({
            sprintId: sprint.id,
            apolloAccountId: c.accountId,
            snapshotDate: today,
            apolloContactId: c.id,
            contactName: c.name,
            title: c.title,
            ownerId: c.ownerId,
            inSequence: c.sequenceIds.length > 0,
            lastActivityDate: c.lastActivityDate,
          });
        }
        log.push(`  Snapshotted ${accounts.length} accounts, ${contacts.length} contacts.`);

        await finishProspectingSync(sync.id, {
          status: 'completed',
          accountsSynced: accounts.length,
          contactsSynced: contacts.length,
        });

        // Take the final snapshot on the closing day, then stop tracking.
        const ended = sprint.ends_on && today > String(sprint.ends_on).slice(0, 10);
        if (ended) {
          await updateProspectingSprintStatus(sprint.id, 'completed');
          log.push(`  Sprint window closed — marked completed.`);
        }

        summary.push({
          sprint: sprint.name,
          accounts: accounts.length,
          contacts: contacts.length,
          unowned,
          completed: !!ended,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        await finishProspectingSync(sync.id, { status: 'failed', errorMessage: message });
        log.push(`  Sprint "${sprint.name}" failed: ${message}`);
      }
    }

    return NextResponse.json({
      success: true,
      snapshotDate: today,
      summary,
      log,
      duration: Date.now() - startTime,
    });
  } catch (error) {
    log.push(`Snapshot error: ${error}`);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        log,
        duration: Date.now() - startTime,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
