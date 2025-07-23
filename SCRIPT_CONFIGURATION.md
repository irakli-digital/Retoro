# 🔧 Script Configuration System

This project includes a robust system for managing third-party scripts like Google Tag Manager, Analytics, and other tracking codes.

## 📁 Files Structure

```
config/
└── scripts.config.ts     # Main configuration file

components/
└── ScriptInjector.tsx    # Script injection component

app/
└── layout.tsx           # Scripts are injected here

.env.local.example       # Environment variables template
```

## 🚀 Quick Setup

### 1. Configure Environment Variables

Copy the environment template:
```bash
cp .env.local.example .env.local
```

Add your tracking IDs:
```env
# Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Facebook Pixel
NEXT_PUBLIC_FB_PIXEL_ID=123456789012345

# Hotjar
NEXT_PUBLIC_HOTJAR_ID=1234567
```

### 2. Scripts Auto-Load

Scripts automatically load based on:
- ✅ **Environment**: Only in production by default
- ✅ **Availability**: Only if environment variables are set
- ✅ **Strategy**: Optimized loading order

## 📋 Available Scripts

### Pre-configured Scripts:

| Script | Environment Variable | Loading Strategy |
|--------|---------------------|------------------|
| Google Tag Manager | `NEXT_PUBLIC_GTM_ID` | After Interactive |
| Google Analytics 4 | `NEXT_PUBLIC_GA_ID` | After Interactive |
| Facebook Pixel | `NEXT_PUBLIC_FB_PIXEL_ID` | After Interactive |
| Hotjar | `NEXT_PUBLIC_HOTJAR_ID` | After Interactive |

### Loading Strategies:

- **`beforeInteractive`**: Critical scripts that block rendering
- **`afterInteractive`**: Scripts that load after page is interactive
- **`lazyOnload`**: Scripts that load when browser is idle
- **`worker`**: Scripts that run in web workers

## 🔧 Adding New Scripts

### Method 1: Quick Addition (Environment-based)

1. **Add environment variable** to `.env.local`:
```env
NEXT_PUBLIC_YOUR_SCRIPT_ID=your-tracking-id
```

2. **Add script config** in `config/scripts.config.ts`:
```typescript
{
  id: 'your-script',
  name: 'Your Analytics Service',
  enabled: isProduction && !!process.env.NEXT_PUBLIC_YOUR_SCRIPT_ID,
  strategy: 'afterInteractive',
  content: `
    // Your script code here
    (function() {
      // Use ${process.env.NEXT_PUBLIC_YOUR_SCRIPT_ID} for the ID
    })();
  `
}
```

### Method 2: Direct Configuration

Edit `config/scripts.config.ts` and add:

```typescript
{
  id: 'custom-script',
  name: 'Custom Script',
  enabled: true, // or conditional logic
  strategy: 'afterInteractive',
  content: `
    console.log('Custom script loaded');
    // Your script code here
  `
}
```

### Method 3: External Script

```typescript
{
  id: 'external-script',
  name: 'External Script',
  enabled: true,
  strategy: 'lazyOnload',
  src: 'https://example.com/script.js',
  async: true
}
```

## 🎯 Best Practices

### 1. Environment Management
- **Development**: Scripts disabled by default
- **Production**: Scripts enabled only with environment variables
- **Staging**: Use separate tracking IDs

### 2. Loading Optimization
```typescript
// Critical scripts (block rendering)
strategy: 'beforeInteractive'

// Most tracking scripts
strategy: 'afterInteractive' 

// Non-critical scripts
strategy: 'lazyOnload'
```

### 3. Privacy Compliance
```typescript
// GDPR-compliant loading
{
  id: 'analytics',
  enabled: isProduction && userConsent && !!process.env.NEXT_PUBLIC_GA_ID,
  // ... rest of config
}
```

### 4. Error Handling
```typescript
// Built-in error handling
onScriptError: (scriptId, error) => {
  console.error(`Script ${scriptId} failed:`, error);
  // Report to error tracking
}
```

## 🔍 Advanced Configuration

### Conditional Loading
```typescript
{
  id: 'ab-testing',
  enabled: isProduction && userIsInExperiment,
  strategy: 'afterInteractive',
  content: '// A/B testing code'
}
```

### Data Attributes
```typescript
{
  id: 'script-with-attributes',
  src: 'https://example.com/script.js',
  dataAttributes: {
    'data-site-id': 'your-site-id',
    'data-domain': 'your-domain.com'
  }
}
```

### Custom Loading Logic
```typescript
{
  id: 'complex-script',
  enabled: isProduction,
  strategy: 'afterInteractive',
  onLoad: () => {
    // Custom initialization
    if (window.YourScript) {
      window.YourScript.init({
        apiKey: process.env.NEXT_PUBLIC_API_KEY
      });
    }
  }
}
```

## 🚨 Security Considerations

### 1. Environment Variables
- Use `NEXT_PUBLIC_` prefix for client-side variables
- Never expose sensitive keys in client code
- Use server-side APIs for sensitive operations

### 2. Content Security Policy
```typescript
// Add to next.config.js if using CSP
{
  source: '/(.*)',
  headers: [
    {
      key: 'Content-Security-Policy',
      value: "script-src 'self' 'unsafe-inline' *.googletagmanager.com *.google-analytics.com"
    }
  ]
}
```

### 3. Script Validation
```typescript
// Validate script content before injection
const validateScript = (content: string) => {
  if (content.includes('eval(') || content.includes('Function(')) {
    throw new Error('Unsafe script content detected');
  }
};
```

## 🐛 Debugging

### Check Script Loading
```javascript
// In browser console
console.log('GTM loaded:', typeof window.gtag !== 'undefined');
console.log('GA loaded:', typeof window.dataLayer !== 'undefined');
console.log('FB Pixel loaded:', typeof window.fbq !== 'undefined');
```

### Script Load Events
The ScriptInjector logs script loading:
```
✅ Script loaded: google-tag-manager
✅ Script loaded: google-analytics
❌ Script error: facebook-pixel
```

### Environment Check
```javascript
// Check environment variables in browser
console.log('GTM ID:', process.env.NEXT_PUBLIC_GTM_ID);
```

## 📊 Common Use Cases

### E-commerce Tracking
```typescript
{
  id: 'ecommerce-tracking',
  enabled: isProduction,
  strategy: 'afterInteractive',
  content: `
    // Enhanced ecommerce tracking
    gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
      custom_map: {
        custom_parameter: 'dimension1'
      }
    });
  `
}
```

### User Behavior Analytics
```typescript
{
  id: 'user-behavior',
  enabled: isProduction && !!process.env.NEXT_PUBLIC_HOTJAR_ID,
  strategy: 'lazyOnload',
  content: '// Hotjar or similar service'
}
```

### A/B Testing
```typescript
{
  id: 'ab-testing',
  enabled: isProduction && experimentEnabled,
  strategy: 'beforeInteractive', // Load early for no flash
  content: '// A/B testing platform code'
}
```

This system provides maximum flexibility while maintaining performance and security best practices! 🚀