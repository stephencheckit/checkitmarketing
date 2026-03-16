const BUFFER_API = 'https://api.buffer.com';
const BUFFER_ORG_ID = process.env.BUFFER_ORG_ID || '68372580975e538c43fa1951';

function getToken() {
  const token = process.env.BUFFER_API_TOKEN;
  if (!token) throw new Error('BUFFER_API_TOKEN not configured');
  return token;
}

async function bufferGQL<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(BUFFER_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Buffer API error ${res.status}: ${text}`);
  }

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(`Buffer GraphQL error: ${json.errors[0].message}`);
  }
  return json.data as T;
}

export interface BufferChannel {
  id: string;
  name: string;
  service: string;
  avatar?: string;
}

export interface BufferPost {
  id: string;
  text: string;
  status: string;
  createdAt: string;
  dueAt: string | null;
  sentAt: string | null;
  channelId: string;
}

const CHANNELS_QUERY = `
  query GetChannels {
    account {
      organizations {
        id
        channels {
          id
          name
          service
        }
      }
    }
  }
`;

const POSTS_QUERY = `
  query GetPosts($orgId: OrganizationId!, $status: [PostStatus!], $sortDir: SortDirection!) {
    posts(
      input: {
        organizationId: $orgId
        sort: [{ field: dueAt, direction: $sortDir }, { field: createdAt, direction: $sortDir }]
        filter: { status: $status }
      }
    ) {
      edges {
        node {
          id
          text
          status
          createdAt
          dueAt
          sentAt
          channelId
        }
      }
    }
  }
`;

export async function getBufferChannels(): Promise<BufferChannel[]> {
  const data = await bufferGQL<{
    account: { organizations: Array<{ id: string; channels: BufferChannel[] }> };
  }>(CHANNELS_QUERY);

  const org = data.account.organizations.find((o) => o.id === BUFFER_ORG_ID);
  return org?.channels || [];
}

export async function getBufferPosts(status: 'sent' | 'draft' | 'scheduled', limit = 10): Promise<BufferPost[]> {
  const sortDir = status === 'sent' ? 'desc' : 'asc';

  const data = await bufferGQL<{
    posts: { edges: Array<{ node: BufferPost }> };
  }>(POSTS_QUERY, { orgId: BUFFER_ORG_ID, status: [status], sortDir });

  return (data.posts?.edges || []).map((e) => e.node).slice(0, limit);
}

export async function getAllBufferData(pendingCount = 5, sentCount = 5) {
  const [channels, pending, sent] = await Promise.all([
    getBufferChannels(),
    getBufferPosts('scheduled', pendingCount).catch(() => [] as BufferPost[]),
    getBufferPosts('sent', sentCount).catch(() => [] as BufferPost[]),
  ]);

  const channelMap = new Map(channels.map((c) => [c.id, c]));

  return { channels, channelMap: Object.fromEntries(channelMap), pending, sent };
}
