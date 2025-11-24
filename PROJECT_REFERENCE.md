# Retoro Project Reference

## Project Overview

**Retoro** (also branded as **Mypen.ge**) is a Next.js-based SaaS landing page for a Georgian AI writing assistant platform. The project serves as a marketing website that showcases features, pricing, blog content, and FAQs for the Mypen.ge AI chat platform.

### Key Characteristics
- **Language**: Primary language is Georgian (ka), with bilingual support (English/Georgian)
- **Purpose**: Marketing landing page for AI chat platform (chat.mypen.ge)
- **Framework**: Next.js 14.2.16 with App Router
- **Database**: Neon PostgreSQL (serverless)
- **Deployment**: Vercel (auto-synced from v0.dev)

---

## Tech Stack

### Core Framework
- **Next.js**: 14.2.16 (App Router)
- **React**: 18.x
- **TypeScript**: 5.x

### Styling & UI
- **Tailwind CSS**: 3.4.17
- **shadcn/ui**: Component library (Radix UI primitives)
- **Framer Motion**: Animations
- **next-themes**: Dark mode support
- **Lucide React**: Icons

### Database & Data
- **@neondatabase/serverless**: Serverless PostgreSQL client
- **Neon PostgreSQL**: Database hosting
- **Next.js Cache**: `unstable_cache` for data caching

### Analytics & Tracking
- **Google Tag Manager** (GTM)
- **Google Analytics 4** (GA4)
- **Facebook Pixel**
- **Hotjar**

### Image Optimization
- **Sharp**: Image processing
- **imagemin**: Image optimization utilities
- **Next.js Image**: Built-in optimization

### Development Tools
- **ESLint**: Code linting (disabled during builds)
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixes

---

## Project Structure

```
Retoro/
├── app/                          # Next.js App Router pages
│   ├── blog/                     # Blog section
│   │   ├── [slug]/               # Dynamic blog post pages
│   │   └── page.tsx              # Blog listing page
│   ├── faq/                      # FAQ section
│   │   ├── faq-search.tsx        # FAQ search component
│   │   └── page.tsx              # FAQ listing page
│   ├── mypen-ultra/              # Mypen Ultra product page
│   ├── privacy/                  # Privacy policy page
│   ├── refund-policy/            # Refund policy page
│   ├── terms/                    # Terms of service page
│   ├── test-navigation/          # Test navigation page
│   ├── layout.tsx                 # Root layout (metadata, scripts)
│   ├── page.tsx                  # Homepage/landing page
│   └── globals.css               # Global styles
│
├── components/                    # React components
│   ├── ui/                       # shadcn/ui components (50+ components)
│   ├── header.tsx                # Site header/navigation
│   ├── footer.tsx                # Site footer
│   ├── ScriptInjector.tsx        # Third-party script loader
│   ├── theme-provider.tsx        # Dark mode provider
│   ├── OptimizedImage.tsx        # Image optimization wrapper
│   └── announcement-banner.tsx  # Announcement banner (commented)
│
├── lib/                          # Utility libraries
│   ├── db.ts                     # Database connection (Neon)
│   ├── queries.ts                # Database queries (blog, FAQ)
│   ├── types.ts                  # TypeScript type definitions
│   ├── cache-utils.ts            # Cache revalidation utilities
│   └── utils.ts                  # General utilities (cn, etc.)
│
├── config/                       # Configuration files
│   └── scripts.config.ts         # Third-party scripts configuration
│
├── hooks/                        # Custom React hooks
│   ├── use-mobile.tsx            # Mobile detection hook
│   └── use-toast.ts              # Toast notification hook
│
├── scripts/                      # Node.js utility scripts
│   └── optimize-images.js        # Image optimization script
│
├── public/                       # Static assets
│   └── images/                   # Image assets
│       ├── blog/                 # Blog images (raw & optimized)
│       └── [various logos, icons]
│
├── styles/                        # Additional styles
│   └── globals.css               # Global CSS (duplicate?)
│
├── schema.sql                    # Database schema
├── .env.local                    # Environment variables
├── next.config.mjs               # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

---

## Database Schema

### Posts Table (Blog)
```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,           -- English title
  title_ka VARCHAR(255) NOT NULL,        -- Georgian title
  slug VARCHAR(255) UNIQUE NOT NULL,     -- URL slug
  content TEXT NOT NULL,                 -- English HTML content
  content_ka TEXT NOT NULL,              -- Georgian HTML content
  excerpt TEXT,                          -- English excerpt
  excerpt_ka TEXT,                       -- Georgian excerpt
  author VARCHAR(100),                  -- Author name
  published_at TIMESTAMP DEFAULT NOW(),  -- Publication date
  updated_at TIMESTAMP DEFAULT NOW(),    -- Last update
  published BOOLEAN DEFAULT false,        -- Visibility flag
  featured_image VARCHAR(500)            -- Featured image URL
);
```

**Indexes:**
- `idx_posts_slug` on `slug`
- `idx_posts_published` on `(published, published_at DESC)`

### FAQs Table
```sql
CREATE TABLE faqs (
  id SERIAL PRIMARY KEY,
  question VARCHAR(500) NOT NULL,        -- English question
  question_ka VARCHAR(500) NOT NULL,     -- Georgian question
  answer TEXT NOT NULL,                  -- English answer
  answer_ka TEXT NOT NULL,               -- Georgian answer
  category VARCHAR(100),                 -- Category (English)
  category_ka VARCHAR(100),              -- Category (Georgian)
  sort_order INTEGER DEFAULT 0,          -- Display order
  published BOOLEAN DEFAULT true,        -- Visibility flag
  created_at TIMESTAMP DEFAULT NOW(),    -- Creation date
  updated_at TIMESTAMP DEFAULT NOW()     -- Last update
);
```

**Indexes:**
- `idx_faqs_published` on `(published, sort_order ASC)`
- `idx_faqs_category` on `(category, sort_order ASC)`

---

## Key Features

### 1. Bilingual Content Support
- All content supports both English and Georgian (`_ka` suffix)
- Database fields have dual language columns
- UI displays Georgian as primary language

### 2. Blog System
- Server-side rendered blog posts
- Dynamic routes: `/blog/[slug]`
- Featured images support
- Excerpts for previews
- Cached queries with 60-second revalidation
- SEO-optimized with metadata

### 3. FAQ System
- Categorized FAQs
- Search functionality
- Sort order support
- Bilingual Q&A pairs

### 4. Landing Page Sections
- **Hero**: Main CTA and value proposition
- **Features**: Why choose MyPen (6 features)
- **Use Cases**: 8 use case cards
- **How It Works**: 3-step process
- **Testimonials**: User reviews (6 testimonials)
- **Pricing**: 3 tiers (LIGHT/Pro/ULTRA)
- **FAQ**: Accordion-style FAQs

### 5. Analytics & Tracking
- Google Tag Manager (GTM)
- Google Analytics 4 (production only)
- Facebook Pixel (cross-domain tracking)
- Hotjar (production only)
- Custom analytics support

### 6. Script Injection System
- Centralized script configuration (`config/scripts.config.ts`)
- Multiple loading strategies:
  - `beforeInteractive`: Critical scripts
  - `afterInteractive`: Standard scripts
  - `lazyOnload`: Non-critical scripts
- Environment-based enablement

### 7. Image Optimization
- WebP/AVIF format support
- Image optimization script (`scripts/optimize-images.js`)
- Next.js Image component with optimization
- Separate raw/optimized image directories

### 8. Dark Mode
- System preference detection
- Manual toggle in header
- Consistent theming across components
- Default: dark mode

---

## Configuration Files

### Environment Variables (.env.local)
```bash
# Database
DATABASE_URL=postgresql://...  # Neon PostgreSQL connection string

# Analytics
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=123456789012345
NEXT_PUBLIC_HOTJAR_ID=1234567
NEXT_PUBLIC_CUSTOM_ANALYTICS_ID=your-custom-id

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://retoro.app
```

### Next.js Config (next.config.mjs)
- **ESLint**: Disabled during builds
- **TypeScript**: Errors ignored during builds
- **Redirects**: `/chat` → `/`
- **Images**: WebP/AVIF formats, 1-year cache, SVG support
- **Device sizes**: [640, 750, 828, 1080, 1200, 1920, 2048]
- **Image sizes**: [16, 32, 48, 64, 96, 128, 256, 384, 400, 600, 800, 1200]

### Tailwind Config
- **Dark mode**: Class-based
- **Content**: All TS/TSX files
- **Theme**: shadcn/ui color system
- **Plugins**: `tailwindcss-animate`, `@tailwindcss/typography`

---

## Database Queries & Caching

### Query Functions (`lib/queries.ts`)

**Blog Queries:**
- `getPublishedPosts(limit?)`: Get all published posts (cached, 60s)
- `getPostBySlug(slug)`: Get single post by slug (cached, 60s)
- `getAllPostSlugs()`: Get all post slugs for static generation
- `getFeaturedPosts(limit)`: Get posts with featured images

**FAQ Queries:**
- `getPublishedFAQs(category?)`: Get published FAQs (cached, 60s)
- `getFAQCategories()`: Get distinct FAQ categories (cached, 60s)

**Caching Strategy:**
- Uses `unstable_cache` from Next.js
- Cache tags: `['blog-posts']`, `['faqs']`
- Revalidation: 60 seconds
- Can be manually revalidated via `revalidateTag()` or `revalidatePath()`

### Cache Utilities (`lib/cache-utils.ts`)
- `revalidateBlog()`: Revalidate blog listing and all posts
- `revalidateBlogPost(slug)`: Revalidate specific post and listing

---

## Pages & Routes

### Homepage (`/`)
- **File**: `app/page.tsx`
- **Type**: Client component (framer-motion animations)
- **Sections**: Hero, Features, Use Cases, How It Works, Testimonials, Pricing, FAQ
- **CTAs**: Multiple CTAs linking to `https://chat.mypen.ge`

### Blog Listing (`/blog`)
- **File**: `app/blog/page.tsx`
- **Type**: Server component
- **Revalidation**: 60 seconds
- **Features**: Grid layout, featured images, date formatting (Georgian locale)

### Blog Post (`/blog/[slug]`)
- **File**: `app/blog/[slug]/page.tsx`
- **Type**: Server component
- **Features**: Dynamic routing, full post content, SEO metadata

### FAQ Page (`/faq`)
- **File**: `app/faq/page.tsx`
- **Type**: Server component
- **Features**: Search functionality, categorized display
- **Component**: `FAQSearch` for client-side search

### Other Pages
- `/mypen-ultra`: Product-specific page
- `/privacy`: Privacy policy
- `/refund-policy`: Refund policy
- `/terms`: Terms of service
- `/test-navigation`: Testing page

---

## Components Architecture

### Layout Components
- **Header** (`components/header.tsx`): Navigation, theme toggle, mobile menu
- **Footer** (`components/footer.tsx`): Site footer
- **LayoutWrapper**: Wrapper component (if exists)

### UI Components (`components/ui/`)
50+ shadcn/ui components including:
- Forms: `button`, `input`, `textarea`, `select`, `checkbox`, `radio-group`
- Layout: `card`, `accordion`, `tabs`, `dialog`, `sheet`, `drawer`
- Feedback: `toast`, `alert`, `alert-dialog`
- Navigation: `navigation-menu`, `breadcrumb`, `pagination`
- Data Display: `table`, `badge`, `avatar`, `skeleton`
- And more...

### Feature Components
- **ScriptInjector**: Manages third-party script loading
- **ThemeProvider**: Dark mode context provider
- **OptimizedImage**: Image optimization wrapper
- **AnnouncementBanner**: Site-wide announcements (commented out)

---

## Scripts & Utilities

### NPM Scripts
```json
{
  "dev": "next dev",                    # Development server
  "build": "next build",                 # Production build
  "start": "next start",                 # Production server
  "lint": "next lint",                   # Lint code
  "optimize-images": "node scripts/optimize-images.js"  # Optimize images
}
```

### Utility Scripts (Node.js)
- `add-blog-post.js`: Add blog post to database
- `add-blog-post-tokens.js`: Add blog post with token counting
- `add-faq.js`: Add FAQ to database
- `add-homepage-faqs.js`: Add FAQs to homepage
- `check-faqs.js`: Check FAQ data
- `check-featured.js`: Check featured posts
- `check-posts.js`: Check blog posts
- `refresh-blog-cache.js`: Refresh blog cache
- `setup-db.js`: Database setup
- `test-query.js`: Test database queries
- `update-featured-image.js`: Update featured images

---

## Development Workflow

### Setup
1. Clone repository
2. Install dependencies: `npm install`
3. Create `.env.local` with database URL
4. Run database schema: `schema.sql` in Neon console
5. Start dev server: `npm run dev`

### Adding Blog Posts
- Direct SQL insertion into `posts` table
- Or use utility scripts: `add-blog-post.js`
- Cache auto-revalidates every 60 seconds
- Manual revalidation: Use `revalidateBlog()` or `revalidateBlogPost()`

### Adding FAQs
- Direct SQL insertion into `faqs` table
- Or use utility scripts: `add-faq.js`
- Cache auto-revalidates every 60 seconds

### Image Optimization
- Place raw images in `public/images/blog/raw/`
- Run: `npm run optimize-images`
- Optimized images saved to `public/images/blog/optimized/`

### Analytics Setup
1. Add IDs to `.env.local`
2. Scripts auto-inject based on `config/scripts.config.ts`
3. GTM loads `afterInteractive`
4. GA4 loads only in production
5. Facebook Pixel loads in all environments when configured

---

## Important Notes

### Build Configuration
- **ESLint errors**: Ignored during builds (`ignoreDuringBuilds: true`)
- **TypeScript errors**: Ignored during builds (`ignoreBuildErrors: true`)
- ⚠️ **Not recommended for production** - should fix errors instead

### Database
- Uses Neon serverless PostgreSQL
- Connection via `@neondatabase/serverless`
- No connection pooling needed (serverless handles it)

### Caching Strategy
- Blog/FAQ queries cached for 60 seconds
- Uses Next.js `unstable_cache` API
- Cache tags allow selective revalidation
- Pages revalidate every 60 seconds (`revalidate = 60`)

### External Links
- All CTAs link to `https://chat.mypen.ge` (main app)
- No authentication on this site (marketing only)
- Cross-domain tracking configured for Facebook Pixel

### Language Support
- Primary: Georgian (ka)
- Secondary: English
- Date formatting uses `date-fns/locale/ka`
- All user-facing content in Georgian

### Performance
- Server-side rendering for SEO
- Image optimization (WebP/AVIF)
- Script lazy loading
- Cache-first data fetching
- Static asset optimization

---

## Deployment

### Vercel Integration
- Auto-synced from v0.dev
- Repository: `iraklis-projects-e7cfc354/v0-saas-landing-page`
- v0.dev project: `eOwlhw25H3T`

### Environment Variables
- Must be set in Vercel dashboard
- Same variables as `.env.local`
- Production-specific: GA4, Hotjar only load in production

### Build Process
1. Vercel detects push to repository
2. Runs `npm run build`
3. Deploys static assets + serverless functions
4. CDN distribution

---

## File Naming Conventions

- **Components**: kebab-case (`header.tsx`, `faq-search.tsx`)
- **Pages**: Next.js App Router conventions (`page.tsx`, `layout.tsx`)
- **Utilities**: kebab-case (`cache-utils.ts`, `scripts.config.ts`)
- **Types**: kebab-case (`types.ts`)
- **Config**: kebab-case (`next.config.mjs`, `tailwind.config.js`)

---

## Type Definitions

### BlogPost (`lib/types.ts`)
```typescript
interface BlogPost {
  id: number;
  title: string;
  title_ka: string;
  slug: string;
  content: string;
  content_ka: string;
  excerpt: string | null;
  excerpt_ka: string | null;
  author: string | null;
  published_at: string | Date;
  updated_at: string | Date;
  published: boolean;
  featured_image: string | null;
}
```

### FAQ (`lib/types.ts`)
```typescript
interface FAQ {
  id: number;
  question: string;
  question_ka: string;
  answer: string;
  answer_ka: string;
  category: string | null;
  category_ka: string | null;
  sort_order: number;
  published: boolean;
  created_at: string | Date;
  updated_at: string | Date;
}
```

---

## Common Tasks

### Add New Blog Post
1. Insert into `posts` table via SQL or script
2. Cache auto-revalidates in 60 seconds
3. Or manually call `revalidateBlog()`

### Add New FAQ
1. Insert into `faqs` table via SQL or script
2. Set `sort_order` for display order
3. Cache auto-revalidates in 60 seconds

### Update Scripts
1. Edit `config/scripts.config.ts`
2. Add environment variable if needed
3. Set `enabled: true` and appropriate `strategy`
4. Scripts auto-inject on next build

### Optimize Images
1. Add images to `public/images/blog/raw/`
2. Run `npm run optimize-images`
3. Use optimized images in blog posts

### Change Theme Colors
1. Edit `tailwind.config.js` color definitions
2. Or edit CSS variables in `app/globals.css`
3. shadcn/ui uses CSS variables for theming

---

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` in `.env.local`
- Check Neon database is active
- Ensure SSL mode is enabled (`?sslmode=require`)

### Cache Not Updating
- Wait 60 seconds for auto-revalidation
- Or manually call `revalidateTag('blog-posts')` or `revalidatePath('/blog')`

### Scripts Not Loading
- Check environment variables are set
- Verify `enabled: true` in `scripts.config.ts`
- Check browser console for errors
- Ensure correct loading strategy

### Build Errors
- Currently ignored (see Important Notes)
- Should fix TypeScript/ESLint errors for production
- Check `next.config.mjs` for ignored rules

---

## Related Documentation

- `BLOG_SETUP.md`: Blog setup guide
- `faq_setup.md`: FAQ setup guide
- `SCRIPT_CONFIGURATION.md`: Script configuration guide
- `IMAGE_OPTIMIZATION.md`: Image optimization guide
- `FACEBOOK_CROSS_DOMAIN_TRACKING.md`: Cross-domain tracking setup
- `SETUP_COMPLETE.md`: Setup completion checklist

---

## Last Updated
Generated: 2025-01-XX
Next.js Version: 14.2.16
Node Version: Check `package.json` engines

