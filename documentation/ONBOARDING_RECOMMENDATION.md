# Onboarding Recommendation for Webview App Store Launch

## Executive Summary

**Recommendation: Skip upfront slideshow. Use contextual, progressive onboarding instead.**

---

## Why NOT a Slideshow?

### 1. **Webview Context**
- Users expect native app feel
- Slideshows feel "webby" and break immersion
- App Store reviewers prefer native-feeling experiences

### 2. **User Behavior**
- **80% of users skip slideshows** (industry data)
- Users want to start using immediately
- Slideshows delay time-to-value

### 3. **Your Current Strategy**
- You already follow "Try-First" approach (from `ONBOARDING_USER_JOURNEY.md`)
- This aligns perfectly with contextual onboarding
- Slideshow would contradict this strategy

---

## Recommended Approach: Contextual Onboarding

### Phase 1: Empty State (First Visit)
**When:** User lands on dashboard with 0 items

**What to Show:**
- Welcome card with 3-step guide
- Visual indicators (numbered steps)
- Clear CTA: "Add Your First Purchase"
- Dismissible but helpful

**Implementation:** ✅ Created `ContextualOnboarding` component

---

### Phase 2: First Action Hints
**When:** User adds first item

**What to Show:**
- Tooltip near "+" button: "Add more purchases"
- Highlight key features as they use them
- Non-intrusive, dismissible

**Implementation:** ✅ Created `OnboardingTooltip` component

---

### Phase 3: Progressive Disclosure
**When:** User explores features

**What to Show:**
- Contextual hints when relevant:
  - First time viewing item details → "Tap to edit"
  - First time adding price → "Select currency"
  - First time uploading invoice → "We'll extract details automatically"
- Only show once per feature
- Store in localStorage

---

### Phase 4: Optional Help Center
**When:** User needs help anytime

**What to Show:**
- "?" icon in header (always accessible)
- Quick tips modal
- FAQ section
- Video tutorials (optional)

---

## Implementation Plan

### ✅ Already Implemented:
1. Registration banners (after 1-2 items)
2. Empty state messaging
3. Try-first flow

### 🚧 To Add:
1. **Contextual onboarding component** (created above)
2. **Tooltip system** (created above)
3. **Feature-specific hints**:
   - First invoice upload
   - First currency selection
   - First retailer search
4. **Help center** (optional)

---

## Best Practices for Webview Apps

### 1. **Native Feel**
- Use iOS/Android design patterns
- Match platform conventions
- Avoid web-specific patterns (slideshows, modals)

### 2. **Progressive Enhancement**
- Start simple, add complexity gradually
- Show features when relevant
- Don't overwhelm upfront

### 3. **Respect User Intent**
- If user navigates directly to `/add`, don't interrupt
- If user has items, skip empty state guide
- If user dismisses, remember preference

### 4. **Performance**
- Lightweight (no heavy animations)
- Fast to load
- Doesn't block main functionality

---

## Alternative: Optional "Take Tour" Button

If you want slideshow functionality:

**Placement:** Settings page or Help menu

**Flow:**
1. User clicks "Take Tour" (optional)
2. Shows interactive slideshow
3. Can skip anytime
4. Only shows if user explicitly requests

**Pros:**
- Available when needed
- Doesn't interrupt flow
- Best of both worlds

**Cons:**
- Extra development time
- Low usage (most won't click)

---

## Metrics to Track

### Onboarding Success:
- **Time to first action:** < 30 seconds
- **First item added:** % of users
- **Tooltip completion:** % who read hints
- **Feature discovery:** % who use each feature

### User Satisfaction:
- **Onboarding NPS:** Survey after first session
- **Confusion points:** Where users get stuck
- **Feature usage:** Which features are discovered

---

## Recommended Next Steps

### Immediate (MVP):
1. ✅ Add contextual onboarding component
2. ✅ Add tooltip system
3. Add feature-specific hints (invoice upload, currency selection)
4. Test with real users

### Phase 2 (Post-Launch):
1. Add optional "Take Tour" in settings
2. Add help center
3. A/B test different onboarding approaches
4. Iterate based on data

---

## Conclusion

**Skip the slideshow. Use contextual onboarding instead.**

This approach:
- ✅ Feels native
- ✅ Respects user intent
- ✅ Reduces friction
- ✅ Aligns with your "Try-First" strategy
- ✅ Better for App Store approval
- ✅ Higher conversion rates

The components above provide a foundation for contextual onboarding that you can customize based on user feedback.

