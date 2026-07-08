// HubSpot CRM integration — push PPC leads as contacts

const HUBSPOT_API = 'https://api.hubapi.com';

function getToken(): string | null {
  return process.env.HUBSPOT_ACCESS_TOKEN || null;
}

interface HubSpotContactData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone?: string;
  jobTitle?: string;
  source: string;       // e.g. "capterra", "linkedin", "google"
  listing: string;      // e.g. "iot", "iot-analytics", "nhs-pharmacy"
  categoryName: string;
  pageUrl: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
}

/**
 * Create or update a contact in HubSpot CRM.
 * Searches for existing contact first, then creates or updates accordingly.
 * Also creates a timeline Note so the submission is visible on the contact record.
 */
export async function syncContactToHubSpot(data: HubSpotContactData): Promise<{ success: boolean; contactId?: string; error?: string }> {
  const token = getToken();
  if (!token) {
    console.warn('HUBSPOT_ACCESS_TOKEN not configured. Skipping HubSpot sync.');
    return { success: false, error: 'No token configured' };
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  // Attribution note body
  const sourceLabel = data.source === 'linkedin' ? 'LinkedIn' : data.source === 'capterra' ? 'Capterra' : data.source === 'google' ? 'Google Ads' : data.source;
  const noteBody = [
    `PPC Lead Submission — ${sourceLabel}`,
    `Category: ${data.categoryName}`,
    `Listing: ${data.listing}`,
    `Page: ${data.pageUrl}`,
    data.utmCampaign ? `Campaign: ${data.utmCampaign}` : '',
    data.utmSource ? `UTM Source: ${data.utmSource}` : '',
    data.utmMedium ? `UTM Medium: ${data.utmMedium}` : '',
    `Submitted: ${new Date().toISOString()}`,
  ].filter(Boolean).join('\n');

  try {
    // Step 1: Check if contact already exists
    const existingId = await findContactByEmail(token, data.email);

    let contactId: string;

    if (existingId) {
      // Step 2a: Update existing contact (skip lifecyclestage — HubSpot won't allow backwards moves)
      const updateProps: Record<string, string> = {
        hs_lead_status: 'NEW',
        message: noteBody,
      };
      // Only update name/company if contact doesn't already have them
      if (data.phone) updateProps.phone = data.phone;
      if (data.jobTitle) updateProps.jobtitle = data.jobTitle;
      if (data.company) updateProps.company = data.company;

      const updateRes = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts/${existingId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ properties: updateProps }),
      });

      if (!updateRes.ok) {
        const errText = await updateRes.text();
        console.error(`HubSpot: Failed to update contact ${existingId}:`, errText);
        return { success: false, error: `Update failed: ${updateRes.status}` };
      }

      console.log(`HubSpot: Updated existing contact ${existingId} for ${data.email}`);
      contactId = existingId;
    } else {
      // Step 2b: Create new contact
      const createProps: Record<string, string> = {
        firstname: data.firstName,
        lastname: data.lastName,
        email: data.email,
        company: data.company,
        lifecyclestage: 'lead',
        hs_lead_status: 'NEW',
        message: noteBody,
      };

      if (data.phone) createProps.phone = data.phone;
      if (data.jobTitle) createProps.jobtitle = data.jobTitle;
      if (data.utmSource) createProps.utm_source = data.utmSource;
      if (data.utmMedium) createProps.utm_medium = data.utmMedium;
      if (data.utmCampaign) createProps.utm_campaign = data.utmCampaign;
      if (data.utmContent) createProps.utm_content = data.utmContent;
      if (data.utmTerm) createProps.utm_term = data.utmTerm;

      const createRes = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ properties: createProps }),
      });

      if (!createRes.ok) {
        const errText = await createRes.text();
        console.error(`HubSpot: Failed to create contact:`, errText);
        return { success: false, error: `Create failed: ${createRes.status}` };
      }

      const created = await createRes.json();
      console.log(`HubSpot: Created contact ${created.id} for ${data.email}`);
      contactId = created.id;
    }

    // Step 3: Create a Note so the submission shows up in the contact timeline
    await createNote(token, contactId, noteBody);

    return { success: true, contactId };
  } catch (err) {
    console.error('HubSpot sync error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/** Create a Note on a contact so the PPC submission appears in their timeline */
async function createNote(token: string, contactId: string, body: string): Promise<void> {
  try {
    // Create the note
    const noteRes = await fetch(`${HUBSPOT_API}/crm/v3/objects/notes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          hs_timestamp: new Date().toISOString(),
          hs_note_body: body,
        },
        associations: [{
          to: { id: contactId },
          types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }],
        }],
      }),
    });

    if (noteRes.ok) {
      console.log(`HubSpot: Created note on contact ${contactId}`);
    } else {
      const errText = await noteRes.text();
      console.error(`HubSpot: Failed to create note on ${contactId}:`, errText);
    }
  } catch (err) {
    console.error('HubSpot: Note creation error:', err);
  }
}

// ---------------------------------------------------------------------------
// Read APIs — pull data FROM HubSpot for the internal dashboard
// ---------------------------------------------------------------------------

export interface HubSpotContactRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone: string;
  jobTitle: string;
  lifecycleStage: string;
  leadStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface HubSpotDealRecord {
  id: string;
  name: string;
  amount: string;
  stage: string;        // human-readable label when resolvable
  pipeline: string;
  ownerName: string;
  closeDate: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch the most recently modified contacts from HubSpot.
 * Returns an empty list (not an error) when no token is configured.
 */
export async function fetchContacts(limit = 50): Promise<{ success: boolean; contacts: HubSpotContactRecord[]; error?: string }> {
  const token = getToken();
  if (!token) return { success: false, contacts: [], error: 'No token configured' };

  const props = ['firstname', 'lastname', 'email', 'company', 'phone', 'jobtitle', 'lifecyclestage', 'hs_lead_status'];
  const url = `${HUBSPOT_API}/crm/v3/objects/contacts?limit=${Math.min(limit, 100)}&sorts=lastmodifieddate&properties=${props.join(',')}`;

  try {
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error('HubSpot: Failed to fetch contacts:', errText);
      return { success: false, contacts: [], error: `Fetch failed: ${res.status}` };
    }
    const data = await res.json();
    const contacts: HubSpotContactRecord[] = (data.results || []).map((r: { id: string; properties: Record<string, string>; createdAt: string; updatedAt: string }) => ({
      id: r.id,
      firstName: r.properties.firstname || '',
      lastName: r.properties.lastname || '',
      email: r.properties.email || '',
      company: r.properties.company || '',
      phone: r.properties.phone || '',
      jobTitle: r.properties.jobtitle || '',
      lifecycleStage: r.properties.lifecyclestage || '',
      leadStatus: r.properties.hs_lead_status || '',
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
    return { success: true, contacts };
  } catch (err) {
    console.error('HubSpot: fetchContacts error:', err);
    return { success: false, contacts: [], error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Fetch the most recently modified deals from HubSpot, with stage and owner
 * names resolved to human-readable labels.
 */
export async function fetchDeals(limit = 50): Promise<{ success: boolean; deals: HubSpotDealRecord[]; error?: string }> {
  const token = getToken();
  if (!token) return { success: false, deals: [], error: 'No token configured' };

  const props = ['dealname', 'amount', 'dealstage', 'pipeline', 'closedate', 'hubspot_owner_id'];
  const url = `${HUBSPOT_API}/crm/v3/objects/deals?limit=${Math.min(limit, 100)}&sorts=hs_lastmodifieddate&properties=${props.join(',')}`;

  try {
    const [dealsRes, stageMap, ownerMap] = await Promise.all([
      fetch(url, { headers: { 'Authorization': `Bearer ${token}` } }),
      getDealStageMap(token),
      getOwnerMap(token),
    ]);

    if (!dealsRes.ok) {
      const errText = await dealsRes.text();
      console.error('HubSpot: Failed to fetch deals:', errText);
      return { success: false, deals: [], error: `Fetch failed: ${dealsRes.status}` };
    }

    const data = await dealsRes.json();
    const deals: HubSpotDealRecord[] = (data.results || []).map((r: { id: string; properties: Record<string, string>; createdAt: string; updatedAt: string }) => {
      const stageId = r.properties.dealstage || '';
      const ownerId = r.properties.hubspot_owner_id || '';
      return {
        id: r.id,
        name: r.properties.dealname || '',
        amount: r.properties.amount || '',
        stage: stageMap[stageId] || stageId,
        pipeline: r.properties.pipeline || '',
        ownerName: ownerMap[ownerId] || '',
        closeDate: r.properties.closedate || '',
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      };
    });
    return { success: true, deals };
  } catch (err) {
    console.error('HubSpot: fetchDeals error:', err);
    return { success: false, deals: [], error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/** Map deal stage internal IDs -> readable labels across all deal pipelines */
async function getDealStageMap(token: string): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${HUBSPOT_API}/crm/v3/pipelines/deals`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) return {};
    const data = await res.json();
    const map: Record<string, string> = {};
    for (const pipeline of data.results || []) {
      for (const stage of pipeline.stages || []) {
        map[stage.id] = stage.label;
      }
    }
    return map;
  } catch {
    return {};
  }
}

/** Map owner IDs -> "First Last" / email */
async function getOwnerMap(token: string): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${HUBSPOT_API}/crm/v3/owners?limit=100`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) return {};
    const data = await res.json();
    const map: Record<string, string> = {};
    for (const owner of data.results || []) {
      const name = [owner.firstName, owner.lastName].filter(Boolean).join(' ').trim();
      map[String(owner.id)] = name || owner.email || '';
    }
    return map;
  } catch {
    return {};
  }
}

/** Search for a contact by email and return their ID */
async function findContactByEmail(token: string, email: string): Promise<string | null> {
  try {
    const res = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filterGroups: [{
          filters: [{
            propertyName: 'email',
            operator: 'EQ',
            value: email,
          }],
        }],
        limit: 1,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].id;
      }
    }
    return null;
  } catch {
    return null;
  }
}
