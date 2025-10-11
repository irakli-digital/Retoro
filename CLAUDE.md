# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start the development server at http://localhost:3000
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for code issues
- `npm run optimize-images` - Optimize images using the custom script

### Package Management
This project uses npm as the package manager. Always use `npm` instead of `pnpm` or `yarn`.

## Architecture

### Tech Stack
- **Framework**: Next.js 14.2.16 with App Router
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui components (Radix UI primitives + Tailwind)
- **Theme**: Dark mode by default with next-themes for theme management
- **Forms**: react-hook-form with zod validation
- **Icons**: lucide-react
- **Animations**: Framer Motion for page transitions and interactions
- **Database**: Neon PostgreSQL (serverless)

### Project Structure
- `/app` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with theme provider, dark mode enforced, script injection
  - `page.tsx` - Landing page (client-side component with Framer Motion)
  - `/blog` - Blog system with dynamic routes and database-backed content
  - `/privacy`, `/terms`, `/refund-policy` - Legal pages
  - `/faq` - FAQ page with search functionality
  - `/mypen-ultra` - Product-specific landing page
- `/components` - React components
  - `/ui` - shadcn/ui components (auto-generated, don't modify directly)
  - `header.tsx`, `footer.tsx` - Shared layout components
  - `announcement-banner.tsx` - Conditional announcement banner
  - `theme-provider.tsx` - Next-themes wrapper
  - `ScriptInjector.tsx` - Third-party script management system
  - `OptimizedImage.tsx` - Custom image optimization wrapper
- `/lib` - Utility functions and database queries
  - `utils.ts` - Contains `cn()` helper for className merging
  - `db.ts` - Neon PostgreSQL connection
  - `queries.ts` - Database queries for blog posts
  - `cache-utils.ts` - Caching utilities
  - `types.ts` - Shared TypeScript types
- `/config` - Configuration files
  - `scripts.config.ts` - Third-party scripts configuration (GTM, GA4, Facebook Pixel, Hotjar)
- `/hooks` - Custom React hooks
- `/styles` - Global CSS (imported in app/globals.css)
- `/public` - Static assets including optimized images
- `/scripts` - Build and utility scripts

### Key Patterns

1. **Path Aliases**: Use `@/` prefix for imports (maps to project root)
2. **Component Styling**: Use `cn()` from `@/lib/utils` to merge Tailwind classes
3. **Client Components**: Mark with `"use client"` directive when using browser APIs or interactivity
4. **Theme**: Application is set to dark mode only, enforced in layout.tsx
5. **Animations**: Framer Motion is used extensively for hero sections, staggered children, and hover effects
6. **Script Management**: All third-party scripts are centrally managed in `config/scripts.config.ts` and injected via `ScriptInjector.tsx` with different loading strategies (beforeInteractive, afterInteractive, lazyOnload)
7. **Database Queries**: Blog posts are stored in Neon PostgreSQL and fetched with ISR (Incremental Static Regeneration) using `revalidate: 60`

### Important Configuration

- TypeScript paths are configured with `@/*` alias
- shadcn/ui configuration in `components.json`
- Tailwind configuration includes animation utilities
- Next.js configuration includes:
  - ESLint and TypeScript error ignoring during builds
  - Image optimization for WebP and AVIF formats
  - Redirect from `/chat` to `/`
  - SVG support with security restrictions
- Environment variables are used for:
  - Database connection (`DATABASE_URL`)
  - Analytics IDs (`NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_FB_PIXEL_ID`, `NEXT_PUBLIC_HOTJAR_ID`)

### Language and Market

- **Primary Language**: Georgian (ka)
- **Target Market**: Georgia (Mypen.ge)
- All user-facing content is in Georgian
- Date formatting uses Georgian locale (`ka` from date-fns)
- Application language is set to `lang="ka"` in root layout

### Blog System

- Blog posts are stored in a Neon PostgreSQL database
- Posts support bilingual content (Georgian and English)
- Features include: featured images, excerpts, published/draft status, featured posts
- ISR is used with 60-second revalidation for fresh content without full rebuilds
- Dynamic routes: `/blog` (list) and `/blog/[slug]` (individual post)

### Third-Party Integrations

Scripts are managed through a centralized configuration system:
- Google Tag Manager and Google Analytics 4
- Facebook Pixel (cross-domain tracking with chat.mypen.ge)
- Hotjar for user behavior analytics
- Scripts load with appropriate strategies to optimize performance
