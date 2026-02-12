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
 * Tries to create first. If the email already exists (409),
 * searches for the existing contact and updates it.
 */
export async function syncContactToHubSpot(data: HubSpotContactData): Promise<{ success: boolean; contactId?: string; error?: string }> {
  const token = getToken();
  if (!token) {
    console.warn('HUBSPOT_ACCESS_TOKEN not configured. Skipping HubSpot sync.');
    return { success: false, error: 'No token configured' };
  }

  const properties: Record<string, string> = {
    firstname: data.firstName,
    lastname: data.lastName,
    email: data.email,
    company: data.company,
    lifecyclestage: 'lead',
    hs_lead_status: 'NEW',
  };

  if (data.phone) properties.phone = data.phone;
  if (data.jobTitle) properties.jobtitle = data.jobTitle;

  // UTM fields (standard HubSpot marketing properties)
  if (data.utmSource) properties.utm_source = data.utmSource;
  if (data.utmMedium) properties.utm_medium = data.utmMedium;
  if (data.utmCampaign) properties.utm_campaign = data.utmCampaign;
  if (data.utmContent) properties.utm_content = data.utmContent;
  if (data.utmTerm) properties.utm_term = data.utmTerm;

  // Attribution in the message/notes field
  const attribution = [
    `PPC Lead — ${data.source} / ${data.listing}`,
    `Category: ${data.categoryName}`,
    `Page: ${data.pageUrl}`,
    data.utmCampaign ? `Campaign: ${data.utmCampaign}` : '',
  ].filter(Boolean).join('\n');
  properties.message = attribution;

  try {
    // Try to create the contact
    const createRes = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ properties }),
    });

    if (createRes.ok) {
      const created = await createRes.json();
      console.log(`HubSpot: Created contact ${created.id} for ${data.email}`);
      return { success: true, contactId: created.id };
    }

    // If contact already exists (409 Conflict), update instead
    if (createRes.status === 409) {
      const existingId = await findContactByEmail(token, data.email);
      if (existingId) {
        // Don't overwrite lifecyclestage on existing contacts (HubSpot restriction)
        delete properties.lifecyclestage;

        const updateRes = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts/${existingId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ properties }),
        });

        if (updateRes.ok) {
          console.log(`HubSpot: Updated existing contact ${existingId} for ${data.email}`);
          return { success: true, contactId: existingId };
        }

        const updateErr = await updateRes.text();
        console.error(`HubSpot: Failed to update contact ${existingId}:`, updateErr);
        return { success: false, error: `Update failed: ${updateRes.status}` };
      }
    }

    const errBody = await createRes.text();
    console.error(`HubSpot: Failed to create contact:`, errBody);
    return { success: false, error: `Create failed: ${createRes.status}` };
  } catch (err) {
    console.error('HubSpot sync error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
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
