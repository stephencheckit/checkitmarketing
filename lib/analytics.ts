declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || '';

export function isGAEnabled() {
  return !!GA_MEASUREMENT_ID;
}

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}

export function trackPpcConversion(data: {
  source: string;
  listing: string;
  categoryName: string;
  company: string;
  value?: number;
}) {
  trackEvent('generate_lead', {
    event_category: 'ppc',
    event_label: `${data.source}/${data.listing}`,
    source: data.source,
    listing: data.listing,
    category_name: data.categoryName,
    company: data.company,
    value: data.value ?? 1.0,
    currency: 'USD',
  });
}
