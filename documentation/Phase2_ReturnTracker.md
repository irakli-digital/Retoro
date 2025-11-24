# Return Tracker - Phase 2 Release (Web Application)

> **Note:** This document describes Phase 2 features for the **web-based Return Tracker application**. All features are implemented as web technologies and can be accessed via browsers or wrapped in WebView for mobile app distribution.

## Product Vision & Overview (Return Tracker Specific)
Phase 2 focuses on enhancing the Return Tracker web application by significantly reducing user effort through automation and expanding its capabilities. The goal is to make the return tracking process as seamless and intuitive as possible, building on the core value established in the MVP.

## Core Features and Functionality - Return Deadline Tracker (Phase 2 Scope)

**Goal:** Reduce user effort further and enrich the content, based on MVP feedback.

**Key capabilities in Phase 2:**

*   **Email Integration for Returns:**
    *   Introduce the ability to connect an email account (initially Gmail) to the web application via OAuth.
    *   Use automated workflows (e.g., via n8n, Zapier, or custom backend service) to scan for new order confirmations.
    *   Automatically create pending return entries when a purchase email is detected, notifying the user via web notification and email (e.g., "We found a new purchase from Macy's. It's due for return by Apr 5 – added to your tracker.").
    *   Focus on ensuring security and user permission (explicit opt-in, read-only Gmail API scopes, secure token storage).
    *   Web-based OAuth flow for email account connection.

*   **Broader Retailer Coverage:**
    *   Expand the return policy database to include more stores (aim for 100+).
    *   Possibly allow users to add custom entries for stores not in the database (with manual deadline input).

*   **Return Workflow Improvements:**
    *   Add quality-of-life features such as a "Mark as Shipped" toggle (with date) and a field to save tracking numbers in the web interface.
    *   Consider integration with postal APIs (USPS, FedEx, UPS APIs) to track delivery of returns to retailers, allowing the web app to estimate refund dates or inform users about package delivery status via dashboard updates and notifications.
    *   Add return label printing functionality (if retailer provides API access).

*   **Easy Input of Purchases (Email Import):**
    *   This feature, previously noted as "Future feature" in Core Features, becomes a primary focus in Phase 2. The app will parse order confirmation emails to auto-create purchase entries, extracting details like retailer name, order date, items, and order number.

## Feature Roadmap and Phased Release Plan - Phase 2: Enhanced Automation & Convenience

**Goal:** Reduce user effort further and enrich the content, based on MVP feedback.

**Return Tracker (Phase 2 Scope - Web Application):**
*   **Email Integration for Returns:** Users can connect their email (e.g., Gmail) via OAuth to automatically scan for order confirmations and auto-create return entries in the web app.
*   **Broader Retailer Coverage:** Expand the return policy database to over 100 stores in PostgreSQL.
*   **Return Workflow Improvements:** Implement "Mark as Shipped" functionality, tracking number storage, and potential postal API integration for return delivery tracking.
*   **Enhanced Web Features:** Improved dashboard with filters, sorting, bulk actions, and export functionality.
*   **Better Mobile Experience:** Optimize responsive design for mobile browsers and prepare for WebView wrapping.

**Monetization in Phase 2:**
*   Explore adding premium subscription features around this point. For example, a premium tier (e.g., $5/month) that unlocks unlimited automatic email scanning for returns (while free users might have manual limitations or limited email connections).
*   Implement subscription management via Stripe or similar payment processor integrated into the web application.
*   Add premium badge/indicators in the web UI.

**Metrics to watch:**
*   Retention (do users continue logging in beyond the initial use?).
*   Number of return entries per user (indicating trust and reliance on the app).
*   Use these metrics to adjust priorities.
