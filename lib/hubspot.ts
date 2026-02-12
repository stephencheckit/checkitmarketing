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
