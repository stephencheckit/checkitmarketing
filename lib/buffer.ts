const BUFFER_API_BASE = 'https://api.bufferapp.com/1';

function getToken() {
  const token = process.env.BUFFER_API_TOKEN;
  if (!token) throw new Error('BUFFER_API_TOKEN not configured');
  return token;
}

async function bufferFetch(path: string, params?: Record<string, string>) {
  const url = new URL(`${BUFFER_API_BASE}${path}`);
  url.searchParams.set('access_token', getToken());
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, v);
    }
  }

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Buffer API error ${res.status}: ${text}`);
  }
  return res.json();
}

export interface BufferProfile {
  id: string;
  service: string;
  service_username: string;
  formatted_username: string;
  avatar: string;
  statistics?: { followers?: number };
}

export interface BufferUpdate {
  id: string;
  created_at: number;
  day: string;
  due_at: number;
  due_time: string;
  profile_id: string;
  profile_service: string;
  sent_at?: number;
  status: string;
  text: string;
  text_formatted: string;
  media?: {
    link?: string;
    picture?: string;
    thumbnail?: string;
    title?: string;
    description?: string;
  };
  statistics?: {
    reach?: number;
    clicks?: number;
    retweets?: number;
    favorites?: number;
    mentions?: number;
  };
}

export async function getBufferProfiles(): Promise<BufferProfile[]> {
  return bufferFetch('/profiles.json');
}

export async function getPendingUpdates(profileId: string, count = 10): Promise<{ total: number; updates: BufferUpdate[] }> {
  return bufferFetch(`/profiles/${profileId}/updates/pending.json`, {
    count: String(count),
    utc: 'true',
  });
}

export async function getSentUpdates(profileId: string, count = 10): Promise<{ total: number; updates: BufferUpdate[] }> {
  return bufferFetch(`/profiles/${profileId}/updates/sent.json`, {
    count: String(count),
    utc: 'true',
  });
}

export async function getAllBufferPosts(pendingCount = 5, sentCount = 5) {
  const profiles = await getBufferProfiles();

  type ProfileResult = {
    profile: BufferProfile;
    pending: BufferUpdate[];
    sent: BufferUpdate[];
    pendingTotal: number;
    sentTotal: number;
  };

  const results = await Promise.allSettled(
    profiles.map(async (profile): Promise<ProfileResult> => {
      const [pending, sent] = await Promise.all([
        getPendingUpdates(profile.id, pendingCount),
        getSentUpdates(profile.id, sentCount),
      ]);
      return {
        profile,
        pending: pending.updates || [],
        sent: sent.updates || [],
        pendingTotal: pending.total || 0,
        sentTotal: sent.total || 0,
      };
    })
  );

  return results
    .filter((r): r is PromiseFulfilledResult<ProfileResult> => r.status === 'fulfilled')
    .map((r) => r.value);
}
