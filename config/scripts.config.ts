/**
 * Third-Party Scripts Configuration
 * 
 * Add your tracking codes, analytics, and other third-party scripts here.
 * Scripts will be automatically injected into the document head.
 * 
 * Best Practices:
 * 1. Use environment variables for sensitive IDs
 * 2. Set appropriate loading strategies
 * 3. Consider GDPR/privacy compliance
 * 4. Test scripts in development before production
 */

export interface ScriptConfig {
  id: string;
  name: string;
  enabled: boolean;
  strategy?: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload' | 'worker';
  content?: string;
  src?: string;
  async?: boolean;
  defer?: boolean;
  onLoad?: () => void;
  dataAttributes?: Record<string, string>;
}

// Environment-based configuration
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

export const scriptsConfig: ScriptConfig[] = [
  // Google Tag Manager
  {
    id: 'google-tag-manager',
    name: 'Google Tag Manager',
    enabled: !!process.env.NEXT_PUBLIC_GTM_ID,
    strategy: 'afterInteractive',
    content: `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
    `
  },

  // Google Analytics 4
  {
    id: 'google-analytics',
    name: 'Google Analytics 4',
    enabled: isProduction && !!process.env.NEXT_PUBLIC_GA_ID,
    strategy: 'afterInteractive',
    src: `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`,
    async: true,
  },
  {
    id: 'google-analytics-config',
    name: 'Google Analytics 4 Config',
    enabled: isProduction && !!process.env.NEXT_PUBLIC_GA_ID,
    strategy: 'afterInteractive',
    content: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
    `
  },

  // Facebook Pixel
  {
    id: 'facebook-pixel',
    name: 'Facebook Pixel',
    enabled: isProduction && !!process.env.NEXT_PUBLIC_FB_PIXEL_ID,
    strategy: 'afterInteractive',
    content: `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
      fbq('track', 'PageView');
    `
  },

  // Hotjar
  {
    id: 'hotjar',
    name: 'Hotjar',
    enabled: isProduction && !!process.env.NEXT_PUBLIC_HOTJAR_ID,
    strategy: 'afterInteractive',
    content: `
      (function(h,o,t,j,a,r){
          h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
          h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_ID},hjsv:6};
          a=o.getElementsByTagName('head')[0];
          r=o.createElement('script');r.async=1;
          r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
          a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    `
  },

  // Custom Script Example
  {
    id: 'custom-script',
    name: 'Custom Analytics Script',
    enabled: false, // Enable when needed
    strategy: 'lazyOnload',
    content: `
      // Your custom script here
      console.log('Custom script loaded');
    `
  },

  // Add more scripts as needed...
];

// Helper function to get enabled scripts
export const getEnabledScripts = (): ScriptConfig[] => {
  return scriptsConfig.filter(script => script.enabled);
};

// Helper function to get scripts by strategy
export const getScriptsByStrategy = (strategy: ScriptConfig['strategy']): ScriptConfig[] => {
  return getEnabledScripts().filter(script => script.strategy === strategy);
};