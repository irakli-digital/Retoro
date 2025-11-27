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
- **Authentication**: Custom session-based auth with NextAuth.js support
- **API Integrations**: n8n workflows for invoice processing

### Project Structure
- `/app` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with theme provider, session provider, dark mode, and toast notifications
  - `page.tsx` - Main dashboard showing return items and deadlines
  - `/add` - Add purchase page with invoice upload or manual entry
  - `/items/[id]` - Individual item view with edit capability
  - `/history` - View returned items history
  - `/settings` - User settings (currency preferences)
  - `/api` - API routes for backend functionality
    - `/auth` - Authentication endpoints (Google OAuth, magic links, sessions)
    - `/return-items` - CRUD operations for return items
    - `/retailers` - Retailer policy management
    - `/upload` - Invoice upload and processing
    - `/currency` - Currency conversion
    - `/n8n` - Webhook endpoints for n8n workflows
  - `/blog` - Blog system (optional content)
  - `/faq` - FAQ page
  - `/privacy`, `/terms`, `/refund-policy` - Legal pages
- `/components` - React components
  - `/ui` - shadcn/ui components (auto-generated, don't modify directly)
  - `app-header.tsx` - Header with back navigation for app pages
  - `app-tab-bar.tsx` - iOS-style bottom tab navigation (mobile)
  - `dashboard-items-list.tsx` - Main list component for return items
  - `currency-display.tsx` - Multi-currency display component
  - `currency-total.tsx` - Total value calculator with currency conversion
  - `empty-state-card.tsx` - Empty state UI for no items
  - `registration-modal.tsx` - User registration modal
  - `registration-banner.tsx` - Banner prompting registration
  - `return-item-actions.tsx` - Action buttons for items (mark returned, delete)
  - `onboarding-tooltip.tsx` - User onboarding experience
  - `contextual-onboarding.tsx` - Context-aware onboarding guidance
  - `google-auth-button.tsx` - Google OAuth login button
  - `theme-provider.tsx` - Next-themes wrapper
  - `session-provider.tsx` - Client-side session context
  - `ScriptInjector.tsx` - Third-party script management system
  - `OptimizedImage.tsx` - Custom image optimization wrapper
- `/lib` - Utility functions and database queries
  - `utils.ts` - Contains `cn()` helper for className merging
  - `db.ts` - Neon PostgreSQL connection
  - `queries.ts` - Database queries for all tables (users, return_items, retailers, sessions, etc.)
  - `types.ts` - Shared TypeScript types
  - `currency.ts` - Currency conversion and formatting utilities
  - `return-logic.ts` - Business logic for return deadline calculations
  - `auth-client.ts` - Client-side auth utilities
  - `auth-server.ts` - Server-side auth utilities
  - `auth-utils.ts` - Shared auth utilities
- `/config` - Configuration files
  - `scripts.config.ts` - Third-party scripts configuration
- `/hooks` - Custom React hooks
- `/styles` - Global CSS (imported in app/globals.css)
- `/public` - Static assets including optimized images
- `/scripts` - Build and utility scripts
- `/n8n-flows` - n8n workflow JSON exports for invoice processing
- `/documentation` - Project documentation

### Key Patterns

1. **Path Aliases**: Use `@/` prefix for imports (maps to project root)
2. **Component Styling**: Use `cn()` from `@/lib/utils` to merge Tailwind classes
3. **Client Components**: Mark with `"use client"` directive when using browser APIs or interactivity
4. **Theme**: Application is set to dark mode only, enforced in layout.tsx
5. **Animations**: Framer Motion is used for page transitions and interactions
6. **iOS Design Language**: Components use iOS-style rounded corners (`.ios-rounded` class = 16px border-radius)
7. **Mobile-First**: Bottom tab bar for mobile navigation, responsive design throughout
8. **Session Management**: Custom session-based auth with cookies, supports both authenticated and anonymous users
9. **Multi-Currency**: All prices stored with original currency and USD equivalent for comparisons
10. **Database Queries**: Use ISR with `revalidate: 60` for frequently accessed data

### Important Configuration

- TypeScript paths are configured with `@/*` alias mapping to project root
- shadcn/ui configuration in `components.json` (using lucide icons)
- Tailwind configuration includes:
  - iOS-style border radius utilities
  - Safe area spacing for mobile devices
  - Shopify-inspired color palette
  - Custom animations
- Next.js configuration includes:
  - ESLint and TypeScript error ignoring during builds (set to true for faster builds)
  - Image optimization for WebP and AVIF formats
  - Redirect from `/chat` to `/`
  - SVG support with security restrictions
- Environment variables (see `.env.local.example`):
  - `DATABASE_URL` - Neon PostgreSQL connection string
  - `NEXTAUTH_SECRET` - NextAuth.js secret
  - `NEXTAUTH_URL` - Base URL for auth callbacks
  - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - Google OAuth credentials
  - `N8N_WEBHOOK_URL` - n8n webhook endpoint for invoice processing
  - `EXCHANGE_RATE_API_KEY` - Currency conversion API key

### Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - User accounts (email, password hash, email verification)
- `sessions` - Active user sessions with expiration
- `magic_link_tokens` - Passwordless login tokens
- `return_items` - Purchased items with return deadlines
- `retailer_policies` - Store return policies (return window, free returns, etc.)
- `posts` - Blog posts (bilingual support)
- `faqs` - FAQ entries (bilingual support)

Key relationships:
- `return_items.user_id` → `users.id` (or anonymous session ID)
- `return_items.retailer_id` → `retailer_policies.id`
- `sessions.user_id` → `users.id`

### Authentication System

- **Session-based**: Custom implementation using secure cookies
- **Anonymous Support**: Users can use the app without registration
- **Registration Migration**: Anonymous data migrates to user account upon registration
- **OAuth**: Google OAuth integration for easy sign-up/login
- **Magic Links**: Passwordless email login option (planned)
- **Session Storage**: Sessions stored in database with expiration
- **Client-side**: Uses React Context (`SessionProvider`) for session state

### Return Tracking Logic

1. **Purchase Entry**: Users add purchases with retailer and date
2. **Deadline Calculation**: Return deadline = purchase_date + retailer.return_window_days
3. **Notifications**: Items approaching deadline are highlighted
4. **Status Tracking**: Mark items as returned or delete them
5. **Multi-Currency**: Prices stored in original currency + USD for totals
6. **Invoice Upload**: Upload invoices (image/PDF) for automatic extraction via n8n

### n8n Integration

- Invoice processing workflow extracts purchase data from uploaded documents
- Webhook endpoint: `/api/n8n/webhook`
- Validates invoices before processing
- Automatically creates return items from invoice data
- Configuration files stored in `/n8n-flows` directory

### UI/UX Notes

- **iOS-Inspired Design**: Rounded corners, bottom tab bar, native-feeling interactions
- **Dark Mode Only**: Application enforces dark theme
- **Toast Notifications**: Using `sonner` for user feedback
- **Onboarding**: Contextual tooltips guide new users
- **Responsive**: Mobile-first design with desktop support
- **Accessibility**: Semantic HTML, ARIA labels where needed
