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
