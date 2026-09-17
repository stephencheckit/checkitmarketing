import GtmMap from '../(marketing)/gtm-map/GtmMap';

/**
 * Unauthenticated preview of the GTM map for review without a portal login.
 * The canonical page is /gtm-map inside the portal.
 */
export const metadata = {
  title: 'GTM map preview',
  robots: { index: false, follow: false },
};

export default function GtmMapPreviewPage() {
  return <GtmMap />;
}
