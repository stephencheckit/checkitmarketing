// Apollo.io API client — read lists/accounts/sequences, and (with a master
// API key) create sequences from playbook cadences.
//
// NOTE: sequence creation requires a "master" API key (Apollo Settings → API).
// A regular key can read labels, accounts, and sequences but returns
// 403 API_INACCESSIBLE on emailer_campaigns create endpoints.

const APOLLO_API = 'https://api.apollo.io/api/v1';

function getKey(): string | null {
  return process.env.APOLLO_API_KEY || null;
}

async function apolloFetch(
  path: string,
  options: { method?: 'GET' | 'POST' | 'PUT'; body?: unknown } = {}
): Promise<{ ok: boolean; status: number; data: unknown; error?: string }> {
  const key = getKey();
  if (!key) {
    return { ok: false, status: 0, data: null, error: 'APOLLO_API_KEY not configured' };
  }

  const res = await fetch(`${APOLLO_API}${path}`, {
    method: options.method || 'GET',
    headers: {
      'x-api-key': key,
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: 'no-store',
  });

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // Non-JSON response body
  }

  if (!res.ok) {
    const err = (data as { error?: string } | null)?.error || `Apollo API error ${res.status}`;
    return { ok: false, status: res.status, data, error: err };
  }
  return { ok: true, status: res.status, data };
}

// ---------------------------------------------------------------------------
// Labels (saved lists)

export interface ApolloLabel {
  id: string;
  name: string;
  modality: 'contacts' | 'accounts' | 'emailer_campaigns';
  cachedCount: number;
}

export async function getLabels(): Promise<ApolloLabel[]> {
  const res = await apolloFetch('/labels');
  if (!res.ok || !Array.isArray(res.data)) return [];
  return (res.data as Record<string, unknown>[]).map((l) => ({
    id: String(l.id),
    name: String(l.name),
    modality: l.modality as ApolloLabel['modality'],
    cachedCount: Number(l.cached_count) || 0,
  }));
}

// ---------------------------------------------------------------------------
// Accounts in a saved account list

export interface ApolloAccount {
  id: string;
  name: string;
  domain: string | null;
  websiteUrl: string | null;
}

export async function getAccountsForLabel(
  labelId: string,
  perPage = 100
): Promise<ApolloAccount[]> {
  const accounts: ApolloAccount[] = [];
  let page = 1;
  // Cap at 5 pages (500 accounts) — playbook lists are curated, not bulk data.
  while (page <= 5) {
    const res = await apolloFetch('/accounts/search', {
      method: 'POST',
      body: { account_label_ids: [labelId], page, per_page: perPage },
    });
    if (!res.ok) break;
    const d = res.data as {
      accounts?: Record<string, unknown>[];
      pagination?: { page: number; total_pages: number };
    };
    for (const a of d.accounts || []) {
      accounts.push({
        id: String(a.id),
        name: String(a.name),
        domain: a.domain ? String(a.domain) : null,
        websiteUrl: a.website_url ? String(a.website_url) : null,
      });
    }
    if (!d.pagination || d.pagination.page >= d.pagination.total_pages) break;
    page++;
  }
  return accounts;
}

// ---------------------------------------------------------------------------
// Account stages — the picklist behind an account's status (Cold, Active
// Opportunity, Dead Opportunity, ...). Used to resolve account_stage_id to a
// readable name, and to tell "good" outcomes from "bad" ones via category.

export interface ApolloAccountStage {
  id: string;
  name: string;
  /** Apollo's own grouping: in_progress | succeeded | failed */
  category: string | null;
  displayOrder: number;
}

export async function getAccountStages(): Promise<ApolloAccountStage[]> {
  const res = await apolloFetch('/account_stages');
  if (!res.ok) return [];
  const d = res.data as { account_stages?: Record<string, unknown>[] };
  return (d.account_stages || []).map((s) => ({
    id: String(s.id),
    name: String(s.display_name || s.name),
    category: s.category ? String(s.category) : null,
    displayOrder: Number(s.display_order) || 0,
  }));
}

// ---------------------------------------------------------------------------
// Users (Apollo seats) — resolves owner_id to a named rep.

export interface ApolloUser {
  id: string;
  name: string | null;
  email: string | null;
}

export async function getUsers(): Promise<ApolloUser[]> {
  const res = await apolloFetch('/users/search?per_page=100');
  if (!res.ok) return [];
  const d = res.data as { users?: Record<string, unknown>[] };
  return (d.users || []).map((u) => ({
    id: String(u.id),
    name: u.name ? String(u.name) : null,
    email: u.email ? String(u.email) : null,
  }));
}

// ---------------------------------------------------------------------------
// Accounts in a list, with the prospecting-relevant fields Apollo already
// tracks: who owns it, what stage it's in, and how its contacts are moving
// through sequences.
//
// Kept separate from getAccountsForLabel so the playbook route's narrower
// shape stays untouched.

export interface SequenceTally {
  active: number;
  finished: number;
  paused: number;
  bounced: number;
  notSent: number;
}

export interface ApolloAccountDetail {
  id: string;
  name: string;
  domain: string | null;
  /** Apollo seat that owns the account — the BDR pursuing it */
  ownerId: string | null;
  accountStageId: string | null;
  numContacts: number;
  lastActivityDate: string | null;
  /** Contacts grouped by their sequence state across this account */
  tally: SequenceTally;
  /** Distinct Apollo sequences this account's contacts sit in */
  sequenceIds: string[];
  /** Populated when the account is linked to a HubSpot company */
  hubspotId: string | null;
}

function readTally(raw: unknown): SequenceTally {
  const t = (raw || {}) as Record<string, unknown>;
  return {
    active: Number(t.active) || 0,
    finished: Number(t.finished) || 0,
    paused: Number(t.paused) || 0,
    bounced: Number(t.bounced) || 0,
    notSent: Number(t.not_sent) || 0,
  };
}

function toAccountDetail(a: Record<string, unknown>): ApolloAccountDetail {
  const seqIds = Array.isArray(a.contact_emailer_campaign_ids)
    ? (a.contact_emailer_campaign_ids as unknown[]).map(String)
    : [];
  return {
    id: String(a.id),
    name: String(a.name || ''),
    domain: a.domain ? String(a.domain) : a.primary_domain ? String(a.primary_domain) : null,
    ownerId: a.owner_id ? String(a.owner_id) : null,
    accountStageId: a.account_stage_id ? String(a.account_stage_id) : null,
    numContacts: Number(a.num_contacts) || 0,
    lastActivityDate: a.last_activity_date ? String(a.last_activity_date) : null,
    tally: readTally(a.contact_campaign_status_tally),
    sequenceIds: Array.from(new Set(seqIds)),
    hubspotId: a.hubspot_id ? String(a.hubspot_id) : null,
  };
}

export async function getAccountDetailsForLabel(
  labelId: string,
  maxPages = 20
): Promise<ApolloAccountDetail[]> {
  const accounts: ApolloAccountDetail[] = [];
  let page = 1;
  while (page <= maxPages) {
    const res = await apolloFetch('/accounts/search', {
      method: 'POST',
      body: { account_label_ids: [labelId], page, per_page: 100 },
    });
    if (!res.ok) break;
    const d = res.data as {
      accounts?: Record<string, unknown>[];
      pagination?: { page: number; total_pages: number };
    };
    for (const a of d.accounts || []) accounts.push(toAccountDetail(a));
    if (!d.pagination || d.pagination.page >= d.pagination.total_pages) break;
    page++;
  }
  return accounts;
}

// ---------------------------------------------------------------------------
// Contacts in a list of accounts — used to see which personas (job titles)
// were actually worked, not just which companies.

export interface ApolloContactDetail {
  id: string;
  accountId: string | null;
  name: string | null;
  title: string | null;
  ownerId: string | null;
  lastActivityDate: string | null;
  sequenceIds: string[];
}

export async function getContactsForAccounts(
  accountIds: string[],
  maxPages = 20
): Promise<ApolloContactDetail[]> {
  if (accountIds.length === 0) return [];
  const contacts: ApolloContactDetail[] = [];
  let page = 1;
  while (page <= maxPages) {
    const res = await apolloFetch('/contacts/search', {
      method: 'POST',
      body: { account_ids: accountIds, page, per_page: 100 },
    });
    if (!res.ok) break;
    const d = res.data as {
      contacts?: Record<string, unknown>[];
      pagination?: { page: number; total_pages: number };
    };
    for (const c of d.contacts || []) {
      const seqIds = Array.isArray(c.emailer_campaign_ids)
        ? (c.emailer_campaign_ids as unknown[]).map(String)
        : [];
      contacts.push({
        id: String(c.id),
        accountId: c.account_id ? String(c.account_id) : null,
        name: c.name ? String(c.name) : null,
        title: c.title ? String(c.title) : null,
        ownerId: c.owner_id ? String(c.owner_id) : null,
        lastActivityDate: c.last_activity_date ? String(c.last_activity_date) : null,
        sequenceIds: Array.from(new Set(seqIds)),
      });
    }
    if (!d.pagination || d.pagination.page >= d.pagination.total_pages) break;
    page++;
  }
  return contacts;
}

// ---------------------------------------------------------------------------
// Account creation — bulk create with append_label_names to drop accounts
// into a named Apollo list (creating the list if missing).
//
// Requires the API key to have accounts/create scope (or master key). A
// regular key returns 403 API_INACCESSIBLE, mirrored via needsPermission.

export interface AccountInput {
  name: string;
  domain: string;
}

export interface BulkCreateAccountsResult {
  success: boolean;
  /** Newly created accounts across all batches */
  createdCount: number;
  /** Existing accounts matched by dedupe (domain/org_id/name) across batches */
  existingCount: number;
  /** Number of 100-account batches successfully processed */
  batchesProcessed: number;
  error?: string;
  /** True when the failure is the key lacking accounts/create permission */
  needsPermission?: boolean;
}

export async function bulkCreateAccounts(
  accounts: AccountInput[],
  labelNames: string[]
): Promise<BulkCreateAccountsResult> {
  let createdCount = 0;
  let existingCount = 0;
  let batchesProcessed = 0;

  const BATCH_SIZE = 100;
  for (let i = 0; i < accounts.length; i += BATCH_SIZE) {
    const batch = accounts.slice(i, i + BATCH_SIZE);
    const res = await apolloFetch('/accounts/bulk_create', {
      method: 'POST',
      body: {
        accounts: batch.map((a) => ({ name: a.name, domain: a.domain })),
        append_label_names: labelNames,
        run_dedupe: true,
      },
    });

    if (!res.ok) {
      const needsPermission = res.status === 403;
      return {
        success: false,
        createdCount,
        existingCount,
        batchesProcessed,
        error: res.error,
        needsPermission,
      };
    }

    const data = res.data as {
      created_accounts?: unknown[];
      existing_accounts?: unknown[];
    };
    createdCount += Array.isArray(data.created_accounts) ? data.created_accounts.length : 0;
    existingCount += Array.isArray(data.existing_accounts) ? data.existing_accounts.length : 0;
    batchesProcessed++;
  }

  return {
    success: true,
    createdCount,
    existingCount,
    batchesProcessed,
  };
}

// ---------------------------------------------------------------------------
// Sequences (emailer campaigns)

export interface ApolloSequence {
  id: string;
  name: string;
  active: boolean;
  archived: boolean;
  createdAt: string;
}

export async function searchSequences(query?: string): Promise<ApolloSequence[]> {
  const res = await apolloFetch('/emailer_campaigns/search', {
    method: 'POST',
    body: { q_name: query || undefined, page: 1, per_page: 100 },
  });
  if (!res.ok) return [];
  const d = res.data as { emailer_campaigns?: Record<string, unknown>[] };
  return (d.emailer_campaigns || []).map((c) => ({
    id: String(c.id),
    name: String(c.name),
    active: !!c.active,
    archived: !!c.archived,
    createdAt: String(c.created_at || ''),
  }));
}

// ---------------------------------------------------------------------------
// Sequence creation — requires a master API key.

export interface SequenceEmailStep {
  /** Days to wait after the previous step */
  waitDays: number;
  subject: string;
  body: string; // HTML allowed
}

export interface CreateSequenceResult {
  success: boolean;
  sequenceId?: string;
  stepsCreated?: number;
  error?: string;
  /** True when the failure is the key lacking master-key permissions */
  needsMasterKey?: boolean;
}

export async function createSequenceWithSteps(
  name: string,
  steps: SequenceEmailStep[]
): Promise<CreateSequenceResult> {
  // 1. Create the (inactive) sequence shell
  const createRes = await apolloFetch('/emailer_campaigns', {
    method: 'POST',
    body: { name, active: false },
  });

  if (!createRes.ok) {
    const needsMasterKey = createRes.status === 403;
    return {
      success: false,
      error: createRes.error,
      needsMasterKey,
    };
  }

  const campaign = (createRes.data as { emailer_campaign?: { id?: string } })?.emailer_campaign;
  const sequenceId = campaign?.id;
  if (!sequenceId) {
    return { success: false, error: 'Apollo did not return a sequence id' };
  }

  // 2. Add each email step. Apollo creates a step, then the email content
  //    ("touch") is updated on the step's auto-created touch/template.
  let stepsCreated = 0;
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const stepRes = await apolloFetch('/emailer_steps', {
      method: 'POST',
      body: {
        emailer_campaign_id: sequenceId,
        position: i + 1,
        type: 'auto_email',
        wait_mode: 'day',
        wait_time: step.waitDays,
        exact_datetime: null,
        priority: 'high',
      },
    });
    if (!stepRes.ok) {
      return {
        success: false,
        sequenceId,
        stepsCreated,
        error: `Step ${i + 1} failed: ${stepRes.error}`,
      };
    }

    const stepData = stepRes.data as {
      emailer_step?: { id?: string };
      emailer_touch?: { id?: string };
      emailer_template?: { id?: string };
    };
    const touchId = stepData.emailer_touch?.id;
    const templateId = stepData.emailer_template?.id;
    const stepId = stepData.emailer_step?.id;

    if (touchId && templateId) {
      const touchRes = await apolloFetch(`/emailer_touches/${touchId}`, {
        method: 'PUT',
        body: {
          id: touchId,
          emailer_step_id: stepId,
          emailer_template: {
            id: templateId,
            subject: step.subject,
            body_html: step.body.replace(/\n/g, '<br/>'),
          },
        },
      });
      if (!touchRes.ok) {
        return {
          success: false,
          sequenceId,
          stepsCreated,
          error: `Step ${i + 1} content failed: ${touchRes.error}`,
        };
      }
    }
    stepsCreated++;
  }

  return { success: true, sequenceId, stepsCreated };
}
