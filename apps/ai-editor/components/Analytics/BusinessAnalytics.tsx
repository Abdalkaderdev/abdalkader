import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface BusinessAnalyticsProps {
  pageName: string;
  userId?: string;
}

export default function BusinessAnalytics({ pageName, userId }: BusinessAnalyticsProps) {
  const router = useRouter();

  useEffect(() => {
    // Track page views for business analytics
    const trackPageView = () => {
      // Google Analytics 4 event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'page_view', {
          page_title: pageName,
          page_location: window.location.href,
          page_path: router.asPath,
          user_id: userId,
          custom_parameters: {
            business_page: true,
            ai_lab_section: pageName.toLowerCase(),
            region: 'MENA',
            service_type: 'AI_Consulting'
          }
        });
      }

      // Custom business metrics
      if (typeof window !== 'undefined') {
        // Track time on page
        const startTime = Date.now();
        
        const handleBeforeUnload = () => {
          const timeOnPage = Date.now() - startTime;
          
          // Send custom event for business metrics
          if ((window as any).gtag) {
            (window as any).gtag('event', 'time_on_page', {
              page_name: pageName,
              time_on_page: timeOnPage,
              user_id: userId
            });
          }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      }
    };

    trackPageView();
  }, [pageName, router.asPath, userId]);

  // Track business-specific interactions
  const trackBusinessEvent = (eventName: string, parameters: Record<string, any> = {}) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, {
        page_name: pageName,
        user_id: userId,
        ...parameters
      });
    }
  };

  // Track lead generation events
  const trackLeadGeneration = (source: string, type: string) => {
    trackBusinessEvent('lead_generation', {
      lead_source: source,
      lead_type: type,
      business_page: pageName
    });
  };

  // Track experiment interactions
  const trackExperimentInteraction = (experimentName: string, action: string) => {
    trackBusinessEvent('experiment_interaction', {
      experiment_name: experimentName,
      action: action,
      business_page: pageName
    });
  };

  // Track business inquiry
  const trackBusinessInquiry = (inquiryType: string, companySize?: string) => {
    trackBusinessEvent('business_inquiry', {
      inquiry_type: inquiryType,
      company_size: companySize,
      business_page: pageName
    });
  };

  // Expose tracking functions globally for use in other components
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).trackBusinessEvent = trackBusinessEvent;
      (window as any).trackLeadGeneration = trackLeadGeneration;
      (window as any).trackExperimentInteraction = trackExperimentInteraction;
      (window as any).trackBusinessInquiry = trackBusinessInquiry;
    }
  }, []);

  return null; // This component doesn't render anything
}

// Hook for easy tracking in components
export function useBusinessTracking(pageName: string, userId?: string) {
  const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
    if (typeof window !== 'undefined' && (window as any).trackBusinessEvent) {
      (window as any).trackBusinessEvent(eventName, {
        page_name: pageName,
        user_id: userId,
        ...parameters
      });
    }
  };

  const trackLead = (source: string, type: string) => {
    if (typeof window !== 'undefined' && (window as any).trackLeadGeneration) {
      (window as any).trackLeadGeneration(source, type);
    }
  };

  const trackExperiment = (experimentName: string, action: string) => {
    if (typeof window !== 'undefined' && (window as any).trackExperimentInteraction) {
      (window as any).trackExperimentInteraction(experimentName, action);
    }
  };

  const trackInquiry = (inquiryType: string, companySize?: string) => {
    if (typeof window !== 'undefined' && (window as any).trackBusinessInquiry) {
      (window as any).trackBusinessInquiry(inquiryType, companySize);
    }
  };

  return {
    trackEvent,
    trackLead,
    trackExperiment,
    trackInquiry
  };
}