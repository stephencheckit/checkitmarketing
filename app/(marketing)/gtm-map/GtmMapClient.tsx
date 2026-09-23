'use client';

import dynamic from 'next/dynamic';

export interface GtmMapProps {
  offsetNav?: boolean;
  liveApollo?: boolean;
}

/**
 * ReactFlow sizes its viewport from the measured container, which has no
 * dimensions during server rendering, so the markup it emits on the server
 * never matches the client and React reports a hydration error (first noticed
 * at <Controls>). Marking GtmMap 'use client' is not enough — Next still
 * prerenders client components — so the map is loaded client-only.
 *
 * `ssr: false` cannot be passed to next/dynamic from a Server Component, hence
 * this thin client wrapper between the pages and the map.
 */
const GtmMap = dynamic(() => import('./GtmMap'), {
  ssr: false,
  loading: () => <div className="h-screen w-full bg-background" />,
});

export default function GtmMapClient(props: GtmMapProps) {
  return <GtmMap {...props} />;
}
