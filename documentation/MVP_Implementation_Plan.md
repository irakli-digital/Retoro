# Return Tracker - MVP Implementation Plan (Web Application)

> **Note:** This implementation plan has been adapted for a **web-based application** architecture. All references to native iOS/Android development have been replaced with web technologies (Next.js, React, TypeScript, PostgreSQL). The application will be designed with responsive principles and PWA capabilities, preparing it for future WebView wrapping for app stores.

This document outlines the step-by-step plan to build the **Return Tracker MVP** as a web-based application using Next.js, React, TypeScript, and PostgreSQL.

## Prerequisite: Project Setup & Cleanup
**Goal:** Prepare the codebase for the new application logic.
1.  **Review & Clean Existing Components:**
    *   The existing Retoro project includes authentication components and landing pages.
    *   **Action:** Keep the Auth flow (Sign In, Sign Up, Welcome) - adapt existing auth or integrate new auth system.
    *   **Action:** Create new dashboard page (`app/dashboard/page.tsx`) for Return Tracking.
    *   **Action:** Set up navigation structure (header/navbar with "Returns" and "Profile" sections).
    *   **Action:** Configure PWA manifest for installable web app experience.

## Phase 1: Data Modeling & Database Schema
**Goal:** Define the core data structures for tracking purchases and return policies in PostgreSQL.
1.  **Create `ReturnItem` Database Table & TypeScript Interface:**
    *   **Database:** Create `return_items` table in PostgreSQL
    *   **File:** `lib/types.ts` - Add `ReturnItem` interface
    *   **File:** `schema.sql` - Add table definition
    *   **Properties:**
        *   `id`: UUID (PRIMARY KEY)
        *   `retailer_id`: VARCHAR (references retailers table)
        *   `name`: VARCHAR (e.g., "Black Dress")
        *   `price`: DECIMAL(10, 2)
        *   `purchase_date`: TIMESTAMP
        *   `return_deadline`: TIMESTAMP (Calculated)
        *   `is_returned`: BOOLEAN DEFAULT false
        *   `returned_date`: TIMESTAMP (nullable)
        *   `user_id`: UUID (to link to the logged-in user, FOREIGN KEY)
        *   `created_at`: TIMESTAMP DEFAULT NOW()
        *   `updated_at`: TIMESTAMP DEFAULT NOW()
2.  **Create `RetailerPolicy` Database Table & TypeScript Interface:**
    *   **Database:** Create `retailer_policies` table in PostgreSQL
    *   **File:** `lib/types.ts` - Add `RetailerPolicy` interface
    *   **File:** `schema.sql` - Add table definition
    *   **Properties:**
        *   `id`: VARCHAR PRIMARY KEY (e.g., "zara", "nordstrom")
        *   `name`: VARCHAR
        *   `return_window_days`: INTEGER (e.g., 30, 45)
        *   `policy_description`: TEXT
        *   `website_url`: VARCHAR
        *   `has_free_returns`: BOOLEAN DEFAULT false
        *   `created_at`: TIMESTAMP DEFAULT NOW()
    *   **Action:** Seed database with ~50 initial stores (Zara, Nordstrom, ASOS, Macy's, Target, etc.) via SQL script or migration.

## Phase 2: Core Logic & Services
**Goal:** Implement the business logic for deadline calculation and notifications.
1.  **Deadline Calculation Service:**
    *   **File:** `lib/return-logic.ts`
    *   **Function:** `calculateDeadline(purchaseDate: Date, policy: RetailerPolicy): Date`
    *   **Implementation:** Server-side utility function that calculates return deadline based on purchase date and retailer policy.
2.  **Notification Service:**
    *   **File:** `lib/notifications.ts` (server-side) and `hooks/use-web-notifications.ts` (client-side)
    *   **Responsibility:** 
        *   Request browser notification permission (client-side)
        *   Schedule email notifications via API route (server-side)
        *   Use Web Push API for browser notifications
    *   **Triggers:**
        *   7 days before `returnDeadline`
        *   2 days before `returnDeadline`
        *   On `returnDeadline`
    *   **Implementation:** 
        *   Server-side cron job or scheduled function to check upcoming deadlines
        *   Send email notifications via email service (e.g., Resend, SendGrid)
        *   Client-side Web Push API for browser notifications
3.  **Database Queries Service:**
    *   **File:** `lib/queries.ts` - Add return item queries
    *   **Action:** Add methods:
        *   `addReturnItem(item: ReturnItem): Promise<ReturnItem>`
        *   `getReturnItemsByUserId(userId: string): Promise<ReturnItem[]>`
        *   `updateReturnStatus(itemId: string, isReturned: boolean): Promise<void>`
        *   `getRetailerPolicy(retailerId: string): Promise<RetailerPolicy | null>`
        *   `getAllRetailerPolicies(): Promise<RetailerPolicy[]>`

## Phase 3: User Interface Implementation
**Goal:** Build the user-facing web pages and components.
1.  **Dashboard Page:**
    *   **File:** `app/dashboard/page.tsx` (Server Component)
    *   **UI:** A responsive list/grid of active `ReturnItem`s.
    *   **Visuals:** Show item name, retailer, and a prominent **Countdown** (e.g., "5 days left").
    *   **Color Coding:** Green (>7 days), Orange (<7 days), Red (<2 days).
    *   **Components:** 
        *   `components/return-item-card.tsx` - Card component for each return item
        *   `components/countdown-timer.tsx` - Countdown display component
    *   **Features:** Filter by status, sort by deadline, search functionality
2.  **Add Purchase Page/Modal:**
    *   **File:** `app/dashboard/add/page.tsx` or `components/add-return-modal.tsx`
    *   **UI:** Form with:
        *   Retailer Select/Dropdown (from `RetailerPolicy` list, searchable)
        *   Item Name Input
        *   Price Input (with currency formatting)
        *   Purchase Date Picker (using date-fns or react-day-picker)
    *   **Action:** On save, calculate deadline via API route, save to PostgreSQL, and schedule notification.
    *   **API Route:** `app/api/return-items/route.ts` - POST endpoint
3.  **Return Details Page:**
    *   **File:** `app/dashboard/[id]/page.tsx` (Dynamic route)
    *   **UI:** Display full details, policy info, retailer return portal link, and "Mark as Returned" button.
    *   **Features:** Edit item, view history, delete item

## Phase 4: Integration & Wiring
**Goal:** Connect the pages with the data and services.
1.  **Navigation:**
    *   Update the main app layout to include navigation header with "Dashboard", "Profile", "Settings" links.
    *   Add a "+" button/floating action button in Dashboard to navigate to Add Purchase page or open modal.
    *   Use Next.js App Router navigation (`Link` components, `useRouter` hook).
2.  **API Routes:**
    *   **File:** `app/api/return-items/route.ts` - CRUD operations for return items
    *   **File:** `app/api/return-items/[id]/route.ts` - Individual item operations
    *   **File:** `app/api/retailers/route.ts` - Get retailer policies
    *   **File:** `app/api/notifications/route.ts` - Notification preferences and scheduling
3.  **Wiring:**
    *   Ensure Add Purchase form calls API route which uses `ReturnLogic` and schedules notifications.
    *   Ensure Dashboard page fetches data server-side and displays real-time updates (can use SWR or React Query for client-side updates).
    *   Set up Server Actions for form submissions (Next.js 14 feature).

## Phase 5: Testing & PWA Setup
1.  **Unit Tests:** 
    *   Verify deadline calculation logic (`lib/return-logic.test.ts`).
    *   Test database queries (`lib/queries.test.ts`).
2.  **Manual Tests:**
    *   Add an item via web form, verify the deadline calculation.
    *   Verify browser notification permission prompt.
    *   Check if the item appears in the Dashboard.
    *   Mark as returned and check if status updates.
    *   Test responsive design on mobile, tablet, desktop.
    *   Test email notification delivery.
3.  **PWA Configuration:**
    *   Create `public/manifest.json` for installable web app.
    *   Add service worker for offline functionality (optional for MVP).
    *   Configure app icons for various device sizes.
    *   Test "Add to Home Screen" functionality on mobile devices.
4.  **WebView Preparation (Future):**
    *   Document API endpoints and authentication flow for future WebView wrapper.
    *   Ensure responsive design works well in mobile WebView containers.
    *   Test deep linking capabilities for notifications.

## Execution Strategy
We will start by setting up the Database Schema (Phase 1) and seeding the Retailer Policy Database, as these are dependencies for the UI and Logic.

## Technology Stack Summary
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon serverless)
- **UI Library:** React + shadcn/ui components
- **Styling:** Tailwind CSS
- **Notifications:** Web Push API + Email (Resend/SendGrid)
- **Authentication:** TBD (can integrate with existing auth or add new)
- **Deployment:** Vercel (aligned with existing Retoro project)

## Future: Mobile App Wrapper
After MVP launch, the web application can be wrapped in a WebView for iOS and Android app store distribution:
- **iOS:** Use WKWebView in a native Swift wrapper
- **Android:** Use WebView in a native Kotlin wrapper
- **Benefits:** Single codebase, faster development, easier maintenance
- **Considerations:** Ensure responsive design, test WebView performance, handle deep linking
