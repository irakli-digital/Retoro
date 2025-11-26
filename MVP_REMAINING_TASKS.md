# MVP Remaining Tasks

## ✅ Completed Features

### Phase 1: Data Modeling & Database Schema
- ✅ Database schema created (`return_items`, `retailer_policies`)
- ✅ TypeScript types defined
- ✅ Database seeded with 10 retailers
- ✅ Dummy data inserted (9 return items)

### Phase 2: Core Logic & Services
- ✅ Deadline calculation service (`lib/return-logic.ts`)
- ✅ Database queries service (`lib/queries.ts`)
- ❌ **Notification service** - NOT IMPLEMENTED

### Phase 3: User Interface
- ✅ Dashboard page (homepage with active returns)
- ✅ Add Purchase page (`/add`)
- ✅ History page (`/history`)
- ✅ Settings page (`/settings`)
- ❌ **Return Details Page** - NOT IMPLEMENTED (`/items/[id]`)

### Phase 4: Integration & Wiring
- ✅ Navigation (iOS tab bar)
- ✅ API route: `POST /api/return-items` (add item)
- ✅ API route: `GET /api/retailers` (get retailers)
- ❌ **API route: `/api/return-items/[id]`** - NOT IMPLEMENTED (GET, PUT, DELETE)
- ❌ **API route: `/api/notifications`** - NOT IMPLEMENTED

### Phase 5: Testing & PWA
- ❌ **PWA manifest.json** - NOT IMPLEMENTED
- ❌ **Unit tests** - NOT IMPLEMENTED (optional for MVP)

## ❌ Missing Features (MVP Requirements)

### 1. Return Details Page (HIGH PRIORITY)
**File:** `app/items/[id]/page.tsx` or `app/dashboard/[id]/page.tsx`

**Features needed:**
- Display full item details
- Show retailer policy information
- "Mark as Returned" button
- "Mark as Kept" button
- Edit item functionality
- Delete item functionality
- Link to retailer return portal

**Status:** Dashboard links to `/items/${item.id}` but page doesn't exist

---

### 2. Individual Item API Routes (HIGH PRIORITY)
**File:** `app/api/return-items/[id]/route.ts`

**Endpoints needed:**
- `GET /api/return-items/[id]` - Get single item
- `PUT /api/return-items/[id]` - Update item (edit)
- `DELETE /api/return-items/[id]` - Delete item
- `PATCH /api/return-items/[id]` - Mark as returned/kept

**Status:** Database queries exist (`updateReturnStatus`, `deleteReturnItem`) but no API routes

---

### 3. Notification System (MEDIUM PRIORITY - MVP Requirement)
**Files needed:**
- `lib/notifications.ts` - Server-side notification logic
- `hooks/use-web-notifications.ts` - Client-side Web Push API
- `app/api/notifications/route.ts` - Notification preferences API
- Scheduled job/cron for checking deadlines

**Features:**
- Web Push API integration
- Email notifications (via Resend/SendGrid)
- Notification scheduling:
  - 7 days before deadline
  - 2 days before deadline
  - On deadline date
- Notification preferences in Settings

**Status:** Not implemented

---

### 4. Mark as Returned Functionality (HIGH PRIORITY)
**Current status:** 
- Database query exists (`updateReturnStatus`)
- No UI to mark items as returned
- No API endpoint to call

**Needed:**
- Button/action in Return Details page
- API endpoint to update status
- Update dashboard to hide returned items (already filters active items)

---

### 5. PWA Configuration (MEDIUM PRIORITY)
**File:** `public/manifest.json`

**Features:**
- App name, description, icons
- Theme colors
- Display mode (standalone)
- Start URL
- Icons for various sizes (192x192, 512x512, etc.)

**Status:** Not implemented

---

### 6. Edit Item Functionality (MEDIUM PRIORITY)
**Current status:**
- No edit functionality
- No edit page/modal

**Needed:**
- Edit form (similar to Add Purchase)
- API endpoint (PUT `/api/return-items/[id]`)
- UI to trigger edit mode

---

### 7. Delete Item Functionality (MEDIUM PRIORITY)
**Current status:**
- Database query exists (`deleteReturnItem`)
- No UI to delete items
- No API endpoint

**Needed:**
- Delete button in Return Details page
- Confirmation dialog
- API endpoint (DELETE `/api/return-items/[id]`)

---

### 8. Search & Filter (LOW PRIORITY - Nice to have)
**Current status:**
- Dashboard shows all active items
- History has tabs (All/Returned/Kept)

**Could add:**
- Search by item name or retailer
- Filter by retailer
- Sort options (deadline, price, date)

---

### 9. Authentication (HIGH PRIORITY - Currently using placeholder)
**Current status:**
- Using `demo-user-123` as placeholder user ID
- No authentication system

**Needed:**
- User authentication (sign up, sign in)
- User sessions
- Replace placeholder with actual user ID

---

## Priority Summary

### Must Have for MVP:
1. ✅ **Return Details Page** - Users need to view and manage individual items
2. ✅ **Mark as Returned functionality** - Core MVP feature
3. ✅ **Individual Item API routes** - Required for details page
4. ✅ **Authentication** - Replace placeholder user ID

### Should Have for MVP:
5. ✅ **Notification System** - Listed as MVP requirement but can be simplified
6. ✅ **PWA Manifest** - Makes app installable

### Nice to Have:
7. ✅ **Edit Item** - Can be added later
8. ✅ **Delete Item** - Can be added later
9. ✅ **Search & Filter** - Enhancement

---

## Next Steps Recommendation

**Immediate (Complete MVP):**
1. Create Return Details page (`/items/[id]`)
2. Create API routes for individual items
3. Add "Mark as Returned" functionality
4. Add basic authentication or at least user session management

**Short-term (Polish MVP):**
5. Implement notification system (can start with Web Push only)
6. Create PWA manifest
7. Add edit/delete functionality

**Future Enhancements:**
8. Search and filtering
9. Email notifications
10. Advanced analytics

