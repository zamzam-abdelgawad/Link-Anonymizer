
export interface AnonymizeResult {
    url: string;
    removedData: string[];
  }
  
  // Expand shortened URLs for specific platforms
  export async function expandShortenedUrl(url: string): Promise<string> {
    if (url.includes("vt.tiktok.com") || url.includes("on.soundcloud.com")) {
      try {
        const response = await fetch(url, {
          method: 'HEAD',
          redirect: 'follow'
        });
        
        if (response.url && response.url !== url) {
          return response.url;
        }
      } catch (error) {
        console.error("Error expanding shortened URL:", error);
      }
    }
    return url;
  }
  
  // TikTok URL anonymizer
  export function anonymizeTikTokUrl(url: URL, expandedFromShortUrl: boolean): AnonymizeResult {
    let newUrl = "";
    const removedData: string[] = [];
  
    if (url.hostname.includes("vt.tiktok.com") && !expandedFromShortUrl) {
      newUrl = `https://vt.tiktok.com${url.pathname}`;
      if (url.search) removedData.push("tracking parameters");
    } else {
      // Clean the pathname and preserve the complete path structure
      const cleanPath = url.pathname.split('?')[0];
      const pathParts = cleanPath.split('/').filter(part => part.length > 0);
      
      // Handle different TikTok URL formats
      if (pathParts.length >= 3 && pathParts[1] === 'video') {
        // Format: /@username/video/123456789
        newUrl = `https://www.tiktok.com/@${pathParts[0].replace('@', '')}/video/${pathParts[2]}`;
      } else if (pathParts.length >= 3 && pathParts[1] === 'photo') {
        // Format: /@username/photo/123456789
        newUrl = `https://www.tiktok.com/@${pathParts[0].replace('@', '')}/photo/${pathParts[2]}`;
      } else if (pathParts.length >= 1 && pathParts[0].startsWith('@')) {
        // Format: /@username or /@username/something
        newUrl = `https://www.tiktok.com${cleanPath}`;
      } else {
        // Fallback for other formats
        newUrl = `https://www.tiktok.com${cleanPath}`;
      }
      
      if (url.search) {
        const params = new URLSearchParams(url.search);
        if (params.has('_r')) removedData.push("referrer ID");
        if (params.has('_d')) removedData.push("device info");
        if (params.has('_t')) removedData.push("timestamp");
        if (params.has('_s')) removedData.push("session ID");
        if (params.has('u_code')) removedData.push("user code");
        if (params.has('share_app_id')) removedData.push("share app ID");
        if (params.has('share_link_id')) removedData.push("share link ID");
        if (params.has('is_from_webapp')) removedData.push("webapp indicator");
        if (params.has('sender_device')) removedData.push("sender device");
        if (params.has('sender_web_id')) removedData.push("sender web ID");
        if (url.search && removedData.length === 0) removedData.push("tracking parameters");
      }
    }
  
    return { url: newUrl, removedData };
  }
  
  // SoundCloud URL anonymizer
  export function anonymizeSoundCloudUrl(url: URL, expandedFromShortUrl: boolean): AnonymizeResult {
    let newUrl = "";
    const removedData: string[] = [];
  
    if (url.hostname.includes("on.soundcloud.com") && !expandedFromShortUrl) {
      newUrl = `https://on.soundcloud.com${url.pathname}`;
      if (url.search) removedData.push("tracking parameters");
    } else {
      const pathParts = url.pathname.split('/');
      if (pathParts.length >= 3) {
        newUrl = `https://soundcloud.com${pathParts.slice(0, 3).join('/')}`;
      } else {
        newUrl = `https://soundcloud.com${url.pathname}`;
      }
      
      if (url.search) {
        const params = new URLSearchParams(url.search);
        if (params.has('ref')) removedData.push("referrer info");
        if (params.has('utm_source')) removedData.push("marketing source");
        if (params.has('utm_medium')) removedData.push("marketing medium");
        if (params.has('utm_campaign')) removedData.push("campaign ID");
        if (params.has('si')) removedData.push("session ID");
        if (url.search && removedData.length === 0) removedData.push("tracking parameters");
      }
    }
  
    return { url: newUrl, removedData };
  }
  
  // Facebook URL anonymizer
  export function anonymizeFacebookUrl(url: URL): AnonymizeResult {
    const newUrl = `https://www.facebook.com${url.pathname.split('?')[0]}`;
    const removedData: string[] = [];
    
    if (url.search) {
      const params = new URLSearchParams(url.search);
      if (params.has('fbclid')) removedData.push("Facebook click ID");
      if (params.has('__tn__')) removedData.push("tracking code");
      if (params.has('__xts__')) removedData.push("extra tracking data");
      if (params.has('ref')) removedData.push("referrer info");
      if (url.search && removedData.length === 0) removedData.push("tracking parameters");
    }
  
    return { url: newUrl, removedData };
  }
  // Instagram URL anonymizer
  export function anonymizeInstagramUrl(url: URL): AnonymizeResult {
    const newUrl = `https://instagram.com${url.pathname}`;
    const removedData: string[] = [];
    
    if (url.search) {
      const params = new URLSearchParams(url.search);
      if (params.has('igshid')) removedData.push("Instagram share ID");
      if (params.has('utm_source')) removedData.push("traffic source");
      if (params.has('utm_medium')) removedData.push("marketing medium");
      if (params.has('utm_campaign')) removedData.push("campaign ID");
      if (url.search && removedData.length === 0) removedData.push("tracking parameters");
    }
  
    return { url: newUrl, removedData };
  }
  
  // YouTube URL anonymizer
  export function anonymizeYouTubeUrl(url: URL): AnonymizeResult {
    let newUrl = "";
    const removedData: string[] = [];
  
    if (url.hostname.includes("youtu.be")) {
      newUrl = `https://youtu.be${url.pathname}`;
    } else {
      const videoId = new URLSearchParams(url.search).get("v");
      if (videoId) {
        newUrl = `https://www.youtube.com/watch?v=${videoId}`;
      } else {
        newUrl = `https://www.youtube.com${url.pathname}`;
      }
    }
    
    if (url.search) {
      const params = new URLSearchParams(url.search);
      if (params.has('si')) removedData.push("session info");
      if (params.has('feature')) removedData.push("feature tag");
      if (params.has('ab_channel')) removedData.push("channel info");
      if (url.search && removedData.length === 0) removedData.push("tracking parameters");
    }
  
    return { url: newUrl, removedData };
  }
  
  // Twitter/X URL anonymizer
  export function anonymizeTwitterUrl(url: URL): AnonymizeResult {
    const hostname = url.hostname.includes("x.com") ? "x.com" : "twitter.com";
    const newUrl = `https://${hostname}${url.pathname}`;
    const removedData: string[] = [];
    
    if (url.search) {
      const params = new URLSearchParams(url.search);
      if (params.has('s')) removedData.push("source info");
      if (params.has('t')) removedData.push("tracking ID");
      if (url.search && removedData.length === 0) removedData.push("tracking parameters");
    }
  
    return { url: newUrl, removedData };
  }
  
  // Clubhouse URL anonymizer
  export function anonymizeClubhouseUrl(url: URL): AnonymizeResult {
    const newUrl = `https://www.clubhouse.com${url.pathname}`;
    const removedData: string[] = [];
    
    if (url.search) {
      const params = new URLSearchParams(url.search);
      if (params.has('utm_source')) removedData.push("traffic source");
      if (params.has('utm_medium')) removedData.push("marketing medium");
      if (params.has('utm_campaign')) removedData.push("campaign ID");
      if (params.has('ch_id')) removedData.push("Clubhouse ID");
      if (url.search && removedData.length === 0) removedData.push("tracking parameters");
    }
  
    return { url: newUrl, removedData };
  }
  
  // Generic URL anonymizer for other platforms
  export function anonymizeGenericUrl(url: URL): AnonymizeResult {
    const newUrl = `${url.protocol}//${url.hostname}${url.pathname}`;
    const removedData: string[] = [];
    
    if (url.search) {
      const params = new URLSearchParams(url.search);
      const commonTrackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid', 'ref'];
      let hasTracking = false;
      
      commonTrackingParams.forEach(param => {
        if (params.has(param)) {
          hasTracking = true;
          switch(param) {
            case 'utm_source': removedData.push("traffic source"); break;
            case 'utm_medium': removedData.push("marketing medium"); break;
            case 'utm_campaign': removedData.push("campaign ID"); break;
            case 'fbclid': removedData.push("Facebook click ID"); break;
            case 'gclid': removedData.push("Google click ID"); break;
            default: removedData.push(param);
          }
        }
      });
      
      if (url.search && !hasTracking) removedData.push("URL parameters");
    }
  
    return { url: newUrl, removedData };
  }
  
  // Main anonymizer function that routes to appropriate platform handler
  export async function anonymizeUrl(inputUrl: string): Promise<AnonymizeResult> {
    // Expand shortened URLs first
    const linkToProcess = await expandShortenedUrl(inputUrl);
    const expandedFromShortUrl = linkToProcess !== inputUrl;
    
    const url = new URL(linkToProcess);
  
    // Route to appropriate platform handler
    if (url.hostname.includes("tiktok.com")) {
      return anonymizeTikTokUrl(url, expandedFromShortUrl);
    } else if (url.hostname.includes("soundcloud.com")) {
      return anonymizeSoundCloudUrl(url, expandedFromShortUrl);
    } else if (url.hostname.includes("facebook.com") || url.hostname.includes("fb.com")) {
      return anonymizeFacebookUrl(url);
    } else if (url.hostname.includes("instagram.com")) {
      return anonymizeInstagramUrl(url);
    } else if (url.hostname.includes("youtube.com") || url.hostname.includes("youtu.be")) {
      return anonymizeYouTubeUrl(url);
    } else if (url.hostname.includes("twitter.com") || url.hostname.includes("x.com")) {
      return anonymizeTwitterUrl(url);
    } else if (url.hostname.includes("clubhouse.com")) {
      return anonymizeClubhouseUrl(url);
    } else {
      return anonymizeGenericUrl(url);
    }
  }