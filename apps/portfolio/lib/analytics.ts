/**
 * Analytics Setup
 * Tracks user interactions and page views
 */

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

/**
 * Track page view
 */
export const trackPageView = (path: string, title: string) => {
  if (typeof window === 'undefined') return;

  // Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
    });
  }

  // Plausible Analytics (if configured)
  if (typeof plausible !== 'undefined') {
    plausible('pageview');
  }
};

/**
 * Track custom event
 */
export const trackEvent = (event: AnalyticsEvent) => {
  if (typeof window === 'undefined') return;

  // Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', event.name, event.properties);
  }

  // Plausible Analytics
  if (typeof plausible !== 'undefined') {
    plausible(event.name, { props: event.properties });
  }
};

/**
 * Track button click
 */
export const trackButtonClick = (buttonName: string, location?: string) => {
  trackEvent({
    name: 'button_click',
    properties: {
      button_name: buttonName,
      location: location || 'unknown',
    },
  });
};

/**
 * Track link click
 */
export const trackLinkClick = (linkName: string, url: string) => {
  trackEvent({
    name: 'link_click',
    properties: {
      link_name: linkName,
      link_url: url,
    },
  });
};

/**
 * Track form submission
 */
export const trackFormSubmission = (formName: string, success: boolean) => {
  trackEvent({
    name: 'form_submission',
    properties: {
      form_name: formName,
      success: success,
    },
  });
};

/**
 * Track error
 */
export const trackError = (errorName: string, errorMessage: string) => {
  trackEvent({
    name: 'error',
    properties: {
      error_name: errorName,
      error_message: errorMessage,
    },
  });
};

/**
 * Track user engagement
 */
export const trackEngagement = (engagementType: string, duration?: number) => {
  trackEvent({
    name: 'engagement',
    properties: {
      engagement_type: engagementType,
      duration_ms: duration,
    },
  });
};

/**
 * Track scroll depth
 */
export const trackScrollDepth = (depth: number) => {
  trackEvent({
    name: 'scroll_depth',
    properties: {
      scroll_percentage: depth,
    },
  });
};

/**
 * Track video view
 */
export const trackVideoView = (videoName: string, duration: number) => {
  trackEvent({
    name: 'video_view',
    properties: {
      video_name: videoName,
      duration_seconds: duration,
    },
  });
};

/**
 * Track download
 */
export const trackDownload = (fileName: string, fileType: string) => {
  trackEvent({
    name: 'file_download',
    properties: {
      file_name: fileName,
      file_type: fileType,
    },
  });
};

declare global {
  function gtag(
    command: string,
    action: string,
    properties?: Record<string, any>
  ): void;

  function plausible(
    eventName: string,
    options?: { props?: Record<string, any> }
  ): void;
}
