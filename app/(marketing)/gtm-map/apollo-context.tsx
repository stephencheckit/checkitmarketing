'use client';

import { createContext, useContext } from 'react';
import { EMPTY_SNAPSHOT, groupListsByMarket, type ApolloSnapshot } from '@/lib/apollo-lists';

// The map's nodes are rendered by React Flow, so they can't be passed props
// directly — Apollo data reaches them through context, keyed by segment id.

const ApolloContext = createContext<ApolloSnapshot>(EMPTY_SNAPSHOT);

export const ApolloProvider = ApolloContext.Provider;

export function useApolloSnapshot() {
  return useContext(ApolloContext);
}

export function useSegmentLists(segmentId: string) {
  const snapshot = useApolloSnapshot();
  const bySegment = groupListsByMarket(snapshot.lists);
  // Segment node ids are `seg-<marketId>`, so strip the prefix to look up.
  const marketId = segmentId.replace(/^seg-/, '');
  return {
    status: snapshot.status,
    lists: bySegment[marketId] ?? [],
  };
}
