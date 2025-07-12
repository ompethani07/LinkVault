export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Track link clicks with Google account info
export const trackLinkClick = (linkId: string, googleAccountInfo?: any) => {
  window.gtag('event', 'link_click', {
    event_category: 'engagement',
    event_label: linkId,
    custom_parameters: {
      google_account: googleAccountInfo?.email || 'anonymous',
      google_id: googleAccountInfo?.id || null,
      timestamp: new Date().toISOString(),
    }
  });
};
