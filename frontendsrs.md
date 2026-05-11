Software Requirements Specification (SRS)
Ad Towns — Frontend
Version 1.0 Kalash Tiwari
TABLE OF CONTENTS
Introduction & Purpose
System Overview & Architecture
User Roles & Access Levels
Module-wise Frontend SRS
4.1 Landing Page
4.2 Buyer Flow
4.3 Buying Pixel Flow
4.4 Buying Cards Flow
4.5 Today's Offer
4.6 Seller Admin
4.7 Website Admin
Complete Decision Flow Diagrams
Component Library & UI Standards
State Management Strategy
Real-Time & Integration Requirements
Edge Cases & Error States
Open Questions Log

1. INTRODUCTION & PURPOSE
1.1 Purpose
This document defines the complete frontend Software Requirements Specification for Ad Towns — a hyperlocal digital advertising marketplace where local businesses (Sellers) purchase pixel/card-based ad spaces visible to Buyers browsing their city's category pages.

1.2 Scope
This SRS covers all frontend screens, user flows, component behaviors, decision logic, real-time interactions, and integration touch-points for the Ad Towns web application.

1.3 Technology Assumptions
Concern	Assumed Stack
Frontend Framework	React.js / Next.js
Real-Time	SignalR (WebSocket)
Payment	Razorpay
AI Features	OpenAI API (or equivalent)
Maps / Location	Google Maps / IP Geolocation
Auth	OTP-based (Phone Number)
2. SYSTEM OVERVIEW & ARCHITECTURE
2.1 High-Level User Ecosystem
text


┌─────────────────────────────────────────────────────────────┐
│                        AD TOWNS.COM                         │
│                                                             │
│   ┌──────────┐    ┌──────────────┐    ┌──────────────────┐  │
│   │  BUYER   │    │SELLER ADMIN  │    │  WEBSITE ADMIN   │  │
│   │(Public)  │    │(seller.      │    │(admin.adtowns    │  │
│   │          │    │adtowns.com)  │    │.com)             │  │
│   └──────────┘    └──────────────┘    └──────────────────┘  │
│        │                 │                      │            │
│        ▼                 ▼                      ▼            │
│   ┌─────────────────────────────────────────────────────┐   │
│   │              SHARED BACKEND API                     │   │
│   │         + SignalR Real-Time Hub                     │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘


2.2 Domain Strategy
Domain	User
adtowns.com	Buyer (public access)
seller.adtowns.com	Seller Admin (authenticated)
admin.adtowns.com	Website Admin (highly restricted)
2.3 Core Concept Glossary
Term	Definition
Pixel	Smallest purchasable ad unit in a grid layout
Card	Larger premium ad unit, displayed after each floor
Floor	A row/tier of pixels (like rows in a movie theater)
Ghost Pixel	Placeholder pixel filled by admin to avoid empty grid look
Today's Offer	24-hour limited flash deal tied to a pixel
Impression	A tracked hover/click on a pixel/card
Fill %	Percentage of pixels sold in a city/category








3. USER ROLES & ACCESS LEVELS
┌─────────────────────────────────────────────────────────────────┐
│                        ROLE MATRIX                              │
├──────────────────┬──────────────────────────────────────────────┤
│ BUYER            │ • No login required (phone captured on entry) │
│                  │ • Browse, hover pixels, click CTA             │
│                  │ • View Today's Offers                         │
├──────────────────┼──────────────────────────────────────────────┤
│ SELLER           │ • Phone OTP login                             │
│                  │ • Purchase pixels/cards                       │
│                  │ • Manage ads, offers, billing                 │
│                  │ • View own dashboard metrics                  │
├──────────────────┼──────────────────────────────────────────────┤
│ WEBSITE ADMIN    │ • Restricted domain login                     │
│                  │ • Full platform control                       │
│                  │ • SignalR live updates                        │
│                  │ • Impersonate sellers                         │
└──────────────────┴──────────────────────────────────────────────┘

4. MODULE-WISE FRONTEND SRS
4.1 LANDING PAGE MODULE
Tasks: ADT_001 to ADT_005
4.1.1 Hero Section (ADT_002)
Screen Description:
Full-viewport landing section that communicates the core value proposition of Ad Towns.

UI Components Required:



┌─────────────────────────────────────────────────────────┐
│  [NAVBAR]  Logo | How It Works | Pricing | Login        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   HEADLINE: "Own Your City's Digital Billboard"         │
│   SUBHEADLINE: "Buy a pixel. Show your deal.            │
│                 Get customers today."                   │
│                                                         │
│   [CTA: Book Your Pixel →]   [Watch Demo]              │
│                                                         │
│   ANIMATED PIXEL GRID — live example of how it looks   │
│   (showing dummy ads in pixel format)                   │
│                                                         │
│   SOCIAL PROOF: "X sellers live | Y cities | Z views"  │
│                                                         │
└─────────────────────────────────────────────────────────┘
Behavior Specs:

Animated pixel grid should cycle through mock seller ads
Live counters (sellers, cities, views) fetched from API
CTA scrolls to registration section OR redirects to seller.adtowns.com/register
Sticky navbar on scroll
4.1.2 About Us Page (ADT_001)
Sections Required:

Mission Statement — Why Ad Towns exists
How It Works — 3-step visual flow:
text

[Buy a Pixel] → [Upload Your Ad] → [Get Customers]
Team Section — Cards with photo, name, role
Vision / Numbers — Cities targeted, sellers onboarded goal
4.1.3 Registration Page (ADT_003)
Flow:



Landing Page CTA Click
        │
        ▼
┌───────────────────────────┐
│  SELLER REGISTRATION PAGE │
│                           │
│  Business Name: [______]  │
│  Owner Name:   [______]   │
│  Phone No:     [______]   │
│  City:         [______]   │
│  Category:     [______]   │
│                           │
│  [Send OTP]               │
└───────────────────────────┘
        │
        ▼
┌───────────────────────────┐
│  OTP VERIFICATION         │
│  Enter 6-digit OTP: [___] │
│  [Verify & Continue]      │
│  Resend OTP (30s timer)   │
└───────────────────────────┘
        │
        ▼
Redirect → Buying Pixel Flow (ADT_006+)
Validation Rules:

Phone: 10-digit Indian mobile number
Business name: Required, max 60 chars
City: Dropdown with search (53 metro + searchable rest)
Category: Filtered based on city selection
4.1.4 Prizes Section (ADT_004)
Purpose: Show sellers what they gain by advertising on Ad Towns.

Components:

Icon + benefit cards (Views, Reach, Leads, ROI)
Comparison table: Ad Towns vs Traditional Advertising
Testimonial carousel (seller quotes)
4.1.5 ETC Section (ADT_005) — Client Review
Status: Currently in Client Review. This is a catch-all section for:

FAQ Accordion
Contact / Support Form
Footer with links
4.2 BUYER FLOW MODULE
Tasks: ADT_042 to ADT_048
4.2.1 Entry & Location Detection (ADT_042)
Flow:

Buyer visits adtowns.com
          │
          ▼
  ┌───────────────────────────────────┐
  │  AUTO LOCATION DETECTION          │
  │  "We detected you're in [City]"   │
  │  ✓ Yes, show me ads in [City]     │
  │  ✗ Change City [Dropdown Search]  │
  └───────────────────────────────────┘
          │
          ▼
  ┌───────────────────────────────────┐
  │  PHONE NUMBER CAPTURE MODAL       │
  │  "Get exclusive deals on WhatsApp"│
  │  Phone: [__________]              │
  │  [Get Deals]  [Skip for now]      │
  └───────────────────────────────────┘
          │
          ▼
       Main Grid Page (City Selected)
Behavior Notes:

Use IP Geolocation API first; fallback to browser navigator.geolocation
Phone number stored for Seller impression notifications
"Skip" allowed — phone prompt reappears after 3 visits
City selection persists in localStorage
4.2.2 Main Buyer UI — Category & Pixel Grid (ADT_043, ADT_045, ADT_046)
Screen Layout:



┌──────────────────────────────────────────────────────────────┐
│  NAVBAR: AdTowns Logo | [City: Mumbai ▼] | Categories | 🔔  │
├──────────────────────────────────────────────────────────────┤
│  CATEGORY TABS (horizontal scroll)                           │
│  [🍕Food] [💊Health] [👗Fashion] [🏠Home] [💻Tech] [+More] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  TODAY'S DEALS BANNER (scrolling ticker)                     │
│  🔥 24 Deals Live | ⏰ Closes in 04:32:11                    │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  FLOOR 1 (PREMIUM — TOP ROW)                                │
│  ┌──┬──┬──┬──┬──┬──┬──┬──┬──┬──┐                           │
│  │AD│AD│AD│AD│AD│░░│AD│AD│░░│AD│  ← ░░ = Ghost/Empty       │
│  └──┴──┴──┴──┴──┴──┴──┴──┴──┴──┘                           │
│                                                              │
│  ╔══════════════════════════════════╗                        │
│  ║    [CARD AD — PREMIUM BANNER]   ║  ← Card after Floor 1  │
│  ╚══════════════════════════════════╝                        │
│                                                              │
│  FLOOR 2 (STANDARD)                                          │
│  ┌──┬──┬──┬──┬──┬──┬──┬──┬──┬──┐                           │
│  │AD│░░│AD│AD│AD│AD│░░│AD│AD│AD│                           │
│  └──┴──┴──┴──┴──┴──┴──┴──┴──┴──┘                           │
│                                                              │
│  ... More floors below (scroll) ...                          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
Floor System Rules:

Floor 1 = Most expensive (like front-row seats)
Price decreases per floor going down
Cards appear after each floor — larger, more premium
Empty pixels filled with Ghost Pixels (admin-managed)
4.2.3 Pixel Hover / Click Interaction (ADT_047, ADT_048)
Hover State (Desktop):



┌─────────────────────────────────────┐
│  [Seller's Image — cropped square]  │
│─────────────────────────────────────│
│  🏪 Business Name                   │
│  📣 Headline (max 60 words)         │
│  📝 Description (max 100 words)     │
│─────────────────────────────────────│
│  [💬 WhatsApp]  [🔗 Visit Website]  │
│─────────────────────────────────────│
│  ⏰ Today's Offer ends in: 02:14:33 │
│     "20% off on all items today!"   │
└─────────────────────────────────────┘
Click State (Mobile — no hover):

Tap on pixel opens a Bottom Sheet Modal with same content
Impression Tracking:



Buyer hovers/clicks pixel
          │
          ▼
Frontend fires impression event to backend
          │
          ├─→ Seller Dashboard updated (live counter +1)
          │
          └─→ If CTA clicked → Seller gets WhatsApp notification:
                "A buyer in [City] just clicked your ad! 
                 They may need follow-up."
4.2.4 Today's Offer Timer (ADT_044)
Components:

Global banner at top: "Today's Deals close in HH:MM:SS"
Per-pixel offer timer shown on hover card
Timer is server-synced (not client-side only) to prevent drift
At 00:00:00 → offer badge disappears, CTA removes offer text
4.3 BUYING PIXEL FLOW MODULE
Tasks: ADT_006 to ADT_009






4.3.1 Complete Purchase Flow
┌─────────────────────────────────────────────────────────────┐
│                  PIXEL PURCHASE FLOW                        │
└─────────────────────────────────────────────────────────────┘

STEP 1: SUCCESS REGISTRATION (ADT_006)
─────────────────────────────────────
After OTP Verified →
┌─────────────────────────────────┐
│  🎉 Welcome to Ad Towns!        │
│  Your account is ready.         │
│                                 │
│  Now let's get you your         │
│  perfect ad spot.               │
│                                 │
│  [Let's Pick My Pixel →]        │
└─────────────────────────────────┘

        │
        ▼

STEP 2: FLOOR SELECTION (ADT_007)
──────────────────────────────────
┌──────────────────────────────────────────────────────┐
│  SELECT YOUR FLOOR                                   │
│  (Like choosing your seat in a movie theater)        │
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │  🥇 FLOOR 1 — PLATINUM                       │    │
│  │  "Top of the page. Maximum visibility."      │    │
│  │  Price: ₹X,XXX/month per pixel               │    │
│  │  Availability: 7 pixels left                 │    │
│  │  [SELECT THIS FLOOR]                         │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │  🥈 FLOOR 2 — GOLD                           │    │
│  │  "Great reach at better value."              │    │
│  │  Price: ₹X,XXX/month per pixel               │    │
│  │  Availability: 14 pixels left                │    │
│  │  [SELECT THIS FLOOR]                         │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │  🥉 FLOOR 3 — SILVER                         │    │
│  │  "Budget-friendly, still powerful."          │    │
│  │  Price: ₹X,XXX/month per pixel               │    │
│  │  Availability: 31 pixels left                │    │
│  │  [SELECT THIS FLOOR]                         │    │
│  └──────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘

        │
        ▼

STEP 3: PIXEL SELECTION (ADT_009)
──────────────────────────────────
┌──────────────────────────────────────────────────────┐
│  PICK YOUR SPOT — Floor 1 (Platinum)                 │
│  City: Mumbai | Category: Food                       │
│                                                      │
│  LIVE GRID (Real-time availability)                  │
│  🟢 = Available  🔴 = Taken  🟡 = In Cart (others)  │
│                                                      │
│  ┌──┬──┬──┬──┬──┬──┬──┬──┬──┬──┐                   │
│  │🔴│🔴│🟢│🟢│🔴│🔴│🟢│🔴│🟢│🟡│  Row A           │
│  └──┴──┴──┴──┴──┴──┴──┴──┴──┴──┘                   │
│                                                      │
│  You selected: Row A, Position 3                     │
│  [Confirm Selection]                                 │
│                                                      │
│  ⚠️ Hold time: 5 minutes (then released if unpaid)  │
└──────────────────────────────────────────────────────┘
Concurrent Booking Prevention (ADT_009):



Seller clicks pixel
        │
        ▼
Frontend → API: "Lock pixel [ID] for seller [ID]"
        │
        ├── SUCCESS → Pixel turns YELLOW for others (🟡 In Cart)
        │             5-minute lock timer starts
        │             Seller proceeds to checkout
        │
        └── FAILURE → "Sorry! This pixel was just taken."
                      Show next available pixels highlighted
4.3.2 Cart & Checkout (ADT_008)
text

STEP 4: CART & CHECKOUT
─────────────────────────

┌──────────────────────────────────────────────────────┐
│  YOUR CART                                           │
│  ────────────────────────────────────────────────   │
│  Pixel: Floor 1, Row A, Position 3                  │
│  City: Mumbai | Category: Food                      │
│  Duration: [1 Month ▼] [3 Months] [6 Months]       │
│                                                      │
│  ────────────────────────────────────────────────   │
│  Base Price:              ₹ 2,000                   │
│  Duration Multiplier:     × 1                       │
│  Subtotal:                ₹ 2,000                   │
│  GST (18%):               ₹   360                   │
│  ────────────────────────────────────────────────   │
│  TOTAL:                   ₹ 2,360                   │
│                                                      │
│  GSTIN (optional): [____________________]           │
│  ✓ Add GSTIN for B2B invoice                        │
│                                                      │
│  [← Change Pixel]    [Pay ₹2,360 →]                │
└──────────────────────────────────────────────────────┘

        │
        ▼
RAZORPAY PAYMENT GATEWAY
        │
        ├── SUCCESS →
        │   ┌─────────────────────────────────────┐
        │   │  ✅ Payment Successful!              │
        │   │  Your pixel is now LIVE!             │
        │   │  Invoice sent to your email/WhatsApp │
        │   │                                      │
        │   │  [Set Up Your Ad Now →]              │
        │   └─────────────────────────────────────┘
        │
        └── FAILURE →
            ┌─────────────────────────────────────┐
            │  ❌ Payment Failed                  │
            │  Your pixel is held for 5 more mins │
            │  [Retry Payment]  [Change Method]   │
            └─────────────────────────────────────┘
4.4 BUYING CARDS FLOW MODULE
Task: ADT_010
4.4.1 Cards Introduction Flow


CARDS ONBOARDING (shown to new seller OR in Seller Admin)
────────────────────────────────────────────────────────

┌──────────────────────────────────────────────────────┐
│  🌟 UPGRADE TO A CARD AD                             │
│                                                      │
│  [Visual showing card placement after floor 1]       │
│                                                      │
│  Cards are BIGGER. Cards are BOLDER.                 │
│  Cards appear between floors — impossible to miss.   │
│                                                      │
│  CARD BENEFITS:                                      │
│  ✓ 5x larger than a pixel                           │
│  ✓ Full business name + logo visible without hover  │
│  ✓ Premium placement guaranteed                     │
│  ✓ Priority in Today's Offer section                │
│                                                      │
│  Card Price: ₹X,XXX/month                           │
│                                                      │
│  [Book a Card →]   [Continue with Pixel]            │
└──────────────────────────────────────────────────────┘
Decision Flow:



Seller clicks "Book a Card"
        │
        ▼
Select City → Select Category → Select Floor Gap
(After Floor 1 / After Floor 2 / etc.)
        │
        ▼
Availability Check (only 1-2 cards per floor gap)
        │
        ├── Available → Proceed to Cart & Checkout (same as ADT_008)
        │
        └── Not Available → "Join Waitlist / Bid" (links to ADT_022)
4.5 TODAY'S OFFER MODULE
Tasks: ADT_011, ADT_012
4.5.1 Today's Offer — Seller Creates Offer (ADT_011)
In Seller Admin → Today's Offer Section:

┌──────────────────────────────────────────────────────┐
│  TODAY'S OFFER SETUP                                 │
│  Active Window: 8:00 AM → 8:00 AM (24 hours)        │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │  OFFER HEADLINE:  [____________________]  60ch │  │
│  │  OFFER DETAILS:   [____________________] 100ch │  │
│  │  CTA TYPE:        ○ WhatsApp  ○ Website Link   │  │
│  │  CTA LINK:        [____________________]       │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  OFFER ACTIVE?  [Toggle ON/OFF]                      │
│                                                      │
│  ⚠️ Once activated, offer runs until 8:00 AM        │
│     You can modify the link anytime.                 │
│     You can remove/restore the offer anytime.        │
│                                                      │
│  [Save & Activate Offer]                            │
└──────────────────────────────────────────────────────┘
Offer State Machine:



         CREATE OFFER
              │
              ▼
         [INACTIVE] ←──────────────────────────┐
              │                                │
         Toggle ON                          Toggle OFF
              │                                │
              ▼                                │
          [ACTIVE] ─── Seller Removes ────────►│
              │                                │
         8AM reached                           │
              │                                │
              ▼                                │
        [AUTO EXPIRED] ── Next Day 8AM ──────►[READY TO RENEW]
4.5.2 Offer Discontinue / Limit Closed (ADT_012)
Scenarios & Frontend Handling:

Scenario	UI Action	Pixel Display
Seller toggles offer OFF	Offer removed immediately	Pixel shows normally, no offer badge
Offer limit exhausted	Seller marks "Offer Ended"	"Offer Closed" badge shown briefly, then removed
Seller edits WhatsApp link	Editable inline, saved instantly	Updated immediately on live site
Timer hits 8:00 AM	Auto-expiry	Offer badge disappears, timer resets for next day

4.6 SELLER ADMIN MODULE
Tasks: ADT_013 to ADT_025
4.6.1 Seller Admin — Overall Dashboard Layout (ADT_014)


┌──────────────────────────────────────────────────────────────┐
│  SELLER ADMIN — seller.adtowns.com                          │
├──────────┬───────────────────────────────────────────────────┤
│          │                                                    │
│  NAV     │   MAIN CONTENT AREA                               │
│          │                                                    │
│ 🏠 Home  │                                                    │
│ 📊 Dashboard                                                  │
│ 🖼️ My Ads │                                                    │
│ 🔥 Today's Offer                                              │
│ 🏪 My Pixels                                                  │
│ 💳 Billing │                                                  │
│ 📈 Growth │                                                    │
│ 🎁 Refer  │                                                    │
│ ⭐ Points │                                                    │
│ 🏆 Bidding│                                                    │
│ ✅ KYC   │                                                    │
│ ⚙️ Settings                                                   │
│          │                                                    │
└──────────┴───────────────────────────────────────────────────┘
4.6.2 Dashboard Metrics (ADT_014)


┌──────────────────────────────────────────────────────────────┐
│  GOOD MORNING, [SELLER NAME]! 👋                             │
├────────────┬───────────────┬──────────────┬──────────────────┤
│ 👁️ VIEWS   │ 💬 WHATSAPP   │ 🟢 LIVE ADS  │ ⏰ AD CLOSES IN  │
│  1,243     │  Impressions  │    3         │  14h 23m         │
│  Today     │    87 Today   │              │                  │
├────────────┴───────────────┴──────────────┴──────────────────┤
│  LIVE AD PREVIEW                                             │
│  [Thumbnail of current ad]  Floor 1 | Mumbai | Food         │
│  Status: 🟢 Active | Expires: May 30, 2025                  │
├──────────────────────────────────────────────────────────────┤
│  TODAY'S OFFER STATUS                                        │
│  🔥 Offer Active | "20% off all items" | Ends in 4h 12m     │
│  [Edit Offer]                                               │
└──────────────────────────────────────────────────────────────┘
4.6.3 Ad Creation / Editor (ADT_013, ADT_016)
Ad Setup Flow:



STEP 1: CHOOSE FRAME
─────────────────────
┌──────────────────────────────────────────────────────┐
│  CHOOSE YOUR AD FRAME                                │
│                                                      │
│  [PAID FRAMES]  [FESTIVAL FRAMES] [WEATHER FRAMES]  │
│                                                      │
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐            │
│  │🎨1 │  │🎨2 │  │🎨3 │  │🎨4 │  │🎨5 │            │
│  │FREE│  │₹99 │  │FREE│  │₹149│  │FREE│            │
│  └────┘  └────┘  └────┘  └────┘  └────┘            │
│                                                      │
│  Festival: [Diwali] [Holi] [Christmas] [New Year]   │
│  Weather:  [☀️ Summer] [🌧️ Monsoon] [❄️ Winter]     │
└──────────────────────────────────────────────────────┘

STEP 2: UPLOAD IMAGE
──────────────────────
┌──────────────────────────────────────────────────────┐
│  UPLOAD YOUR BUSINESS IMAGE                          │
│                                                      │
│  ┌─────────────────────┐  ┌─────────────────────┐   │
│  │                     │  │  PREVIEW (Live)     │   │
│  │   DRAG & DROP       │  │                     │   │
│  │   or Click to       │  │  [Your Image        │   │
│  │   Upload            │  │   Cropped to        │   │
│  │                     │  │   Pixel Ratio]      │   │
│  │  Auto-crop to       │  │                     │   │
│  │  pixel aspect ratio │  │  [Frame Overlay]    │   │
│  └─────────────────────┘  └─────────────────────┘   │
│                                                      │
│  Recommended: Square image, min 200×200px           │
└──────────────────────────────────────────────────────┘

STEP 3: WRITE COPY
────────────────────
┌──────────────────────────────────────────────────────┐
│  AD COPY                                             │
│                                                      │
│  Headline: [_______________________________] 60 ch  │
│  Description: [____________________________] 100 ch │
│                                                      │
│  🤖 [Generate with AI] ← ADT_017                    │
│                                                      │
│  LIVE PREVIEW:                                       │
│  ┌────────────────────────────────────┐              │
│  │  [Image]  Business Name            │              │
│  │           Headline here            │              │
│  │           Description text here   │              │
│  │           [WhatsApp] [Website]     │              │
│  └────────────────────────────────────┘              │
└──────────────────────────────────────────────────────┘

STEP 4: CONFIRM & GO LIVE
───────────────────────────
│ [← Back]  [Save Draft]  [Go Live 🚀] │
4.6.4 AI Deal Optimizer (ADT_017)
UI Flow:



Seller clicks [Generate with AI]
        │
        ▼
┌─────────────────────────────────────────────┐
│  AI AD WRITER                               │
│                                             │
│  Tell us about your business:               │
│  Type: [Restaurant ▼]                       │
│  Specialty: [Italian Pizza]                 │
│  Best Offer: [Buy 1 Get 1 Free]             │
│  Target: [Families, Couples]                │
│                                             │
│  [✨ Generate My Ad Copy]                   │
└─────────────────────────────────────────────┘
        │
        ▼ (Loading: 2-3 seconds)
┌─────────────────────────────────────────────┐
│  YOUR AI-GENERATED COPY:                    │
│                                             │
│  Headline: "Mumbai's Best BOGO Pizza Deal!" │
│  Description: "Craving authentic Italian?  │
│   Grab our Buy 1 Get 1 Free offer today.   │
│   Perfect for families & date nights."     │
│                                             │
│  [Use This] [Regenerate] [Edit Manually]   │
└─────────────────────────────────────────────┘
4.6.5 Referral System (ADT_018)
Points Logic:

Referral Type	Points Awarded
Seller refers → another Seller signs up	50 points
Non-Seller refers → Seller signs up	25 points
UI:



┌──────────────────────────────────────────────────────┐
│  REFER & EARN                                        │
│                                                      │
│  Your Referral Code: [ADT-KALASH-001] [Copy]        │
│  Your Referral Link: [adtowns.com/ref/...] [Share]  │
│                                                      │
│  Share via: [📱 WhatsApp] [📧 Email] [🔗 Copy Link] │
│                                                      │
│  YOUR REFERRALS                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │ Name          Type        Points  Date       │    │
│  │ Ravi Foods    Seller→S    +50     May 12     │    │
│  │ Priya Sharma  Non→Seller  +25     May 10     │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  Total Points Earned: 75                            │
│  [Go to Points & Redeem →]                          │
└──────────────────────────────────────────────────────┘
4.6.6 Points & Redemption (ADT_023)
UI:



┌──────────────────────────────────────────────────────┐
│  MY POINTS                                           │
│  Balance: 175 Points = ₹175 value                   │
│                                                      │
│  REDEEM OPTIONS:                                     │
│  ○ Apply to next renewal   [Apply]                  │
│  ○ Apply to pixel upgrade  [Apply]                  │
│  ○ Apply to card purchase  [Apply]                  │
│                                                      │
│  POINTS HISTORY                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │ +50  Referred Ravi Foods          May 12       │  │
│  │ +25  Referred Priya (non-seller)  May 10       │  │
│  │ -100 Redeemed on pixel renewal    May 08       │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
Q-6 Resolution: Points can be redeemed only on Ad Towns purchases, not as cash.

4.6.7 Floor Upgrade (ADT_019)


┌──────────────────────────────────────────────────────┐
│  UPGRADE YOUR FLOOR                                  │
│                                                      │
│  Current: Floor 3 (Silver) — ₹1,000/month           │
│                                                      │
│  Upgrade to Floor 2 (Gold)?                         │
│  Floor 2 Price: ₹1,800/month                        │
│  You pay difference: ₹800 (pro-rated for 18 days)  │
│  Calculated amount: ₹480                            │
│                                                      │
│  [Pay ₹480 & Upgrade Now]                           │
│                                                      │
│  Upgrade to Floor 1 (Platinum)?                     │
│  You pay difference: ₹1,300 (pro-rated for 18 days)│
│  Calculated amount: ₹780                            │
│                                                      │
│  [Pay ₹780 & Upgrade Now]                           │
└──────────────────────────────────────────────────────┘
Pro-rata Calculation Formula:



Upgrade Cost = (New Price - Old Price) × (Remaining Days / Total Days in Plan)
4.6.8 Multi-City Business Management (ADT_020)
text

┌──────────────────────────────────────────────────────┐
│  MY LOCATIONS                                        │
│                                                      │
│  [+ Add New City Location]                          │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  📍 Mumbai — Food — Floor 1, Pos 3           │   │
│  │  Status: 🟢 Live | Expires: May 30           │   │
│  │  Views: 1,243 | WhatsApp: 87                 │   │
│  │  [Manage Ad] [Today's Offer] [Stats]         │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  📍 Pune — Food — Floor 2, Pos 7             │   │
│  │  Status: 🟢 Live | Expires: Jun 15           │   │
│  │  Views: 543 | WhatsApp: 31                   │   │
│  │  [Manage Ad] [Today's Offer] [Stats]         │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  COMBINED STATS                                      │
│  Total Views: 1,786 | Total WhatsApp Clicks: 118    │
└──────────────────────────────────────────────────────┘
4.6.9 Billing & Invoice Vault (ADT_021)


┌──────────────────────────────────────────────────────┐
│  BILLING & INVOICES                                  │
│                                                      │
│  MY GSTIN: [____________________] [Save & Verify]   │
│  GST Status: ✅ Verified                             │
│                                                      │
│  INVOICES                            [Filter ▼]     │
│  ┌────────────────────────────────────────────────┐  │
│  │ #INV-001 | May 12 | ₹2,360 | Mumbai-Food      │  │
│  │ Status: PAID  [📄 Download PDF] [📧 Email]    │  │
│  ├────────────────────────────────────────────────┤  │
│  │ #INV-002 | Apr 10 | ₹1,180 | Pune-Food        │  │
│  │ Status: PAID  [📄 Download PDF] [📧 Email]    │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  Total Spent This Year: ₹3,540                      │
└──────────────────────────────────────────────────────┘
Invoice PDF Must Contain:

Ad Towns GST details
Seller's GSTIN (if provided)
Item: "Pixel Ad Space — [City] [Category] [Floor] [Position]"
Duration, base price, GST breakup, total
4.6.10 Bidding Section (ADT_022)


┌──────────────────────────────────────────────────────┐
│  PIXEL BIDDING — HIGH DEMAND SPOTS                   │
│                                                      │
│  These pixels are in high demand.                   │
│  Bid to secure your spot!                           │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  Floor 1, Row A, Pos 1 — GOLD SPOT 🏆        │   │
│  │  City: Mumbai | Category: Food               │   │
│  │  Current Highest Bid: ₹4,500/month           │   │
│  │  Your Bid: [________] ₹/month               │   │
│  │  Bid End: 23:45:12                           │   │
│  │  [Place Bid]                                 │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  MY ACTIVE BIDS                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │ Spot: Floor 1, A-3 | My Bid: ₹3,200          │  │
│  │ Status: 🟡 Outbid (₹3,500 is leading)        │  │
│  │ [Increase Bid] [Withdraw]                    │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
4.6.11 FOMO Creator / Growth Section (ADT_024)


┌──────────────────────────────────────────────────────┐
│  YOUR AD PERFORMANCE vs TOP SELLERS 📊               │
│                                                      │
│  YOUR PIXEL (Floor 3, Pos 7)                        │
│  Views today: 43 | WhatsApp: 3                      │
│  ▓▓▓░░░░░░░░░░░░░░ 15% of top performer             │
│                                                      │
│  TOP FLOOR 1 PIXEL (same category)                  │
│  Views today: 287 | WhatsApp: 24                    │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%                             │
│                                                      │
│  💡 Upgrade to Floor 1 to get 6x more visibility!   │
│  [Upgrade Now →]  [Dismiss]                         │
│                                                      │
│  INSIGHT: Peak traffic in your category: 6PM - 9PM │
│  Your ad is live ✓ — You're ready!                  │
└──────────────────────────────────────────────────────┘
4.6.12 KYC Verification (ADT_025)


STEP 1: CHOOSE VERIFICATION TYPE
──────────────────────────────────
┌──────────────────────────────────────────────────────┐
│  GET VERIFIED ✅                                      │
│  "Trusted by AdTowns.com" badge on your ad          │
│                                                      │
│  [GST Verification]  [Identity Verification]        │
└──────────────────────────────────────────────────────┘

STEP 2a: GST VERIFICATION
───────────────────────────
Enter GSTIN → Auto-fetch from GST API → Show business details → Confirm

STEP 2b: IDENTITY VERIFICATION
────────────────────────────────
Upload Aadhaar/PAN → AI face match (optional) → Manual Review (24h)

STEP 3: VERIFIED STATE
────────────────────────
┌──────────────────────────────────────────────────────┐
│  ✅ VERIFIED SELLER                                   │
│  Your badge is now live on all your ads!             │
│                                                      │
│  [Your ad shows] ✅ Trusted by AdTowns.com           │
└──────────────────────────────────────────────────────┘
4.7 WEBSITE ADMIN MODULE
Tasks: ADT_026 to ADT_041
4.7.1 Admin Login (ADT_026)
Domain: admin.adtowns.com
        │
        ▼
┌──────────────────────────────────────┐
│  ADTOWNS ADMIN PORTAL               │
│                                      │
│  Email: [____________________]       │
│  Password: [____________________]   │
│  2FA Code: [______]                 │
│                                      │
│  [Login Securely]                   │
│                                      │
│  ⚠️ Unauthorized access is logged   │
└──────────────────────────────────────┘
        │
        ▼
SignalR connection established
        │
        ▼
Admin Dashboard (real-time)
4.7.2 Admin Dashboard — City Workspace (ADT_027)


┌──────────────────────────────────────────────────────────────┐
│  ADMIN DASHBOARD                           🔴 LIVE           │
├──────────────────────────────────────────────────────────────┤
│  🔍 Search City: [_______________________]                   │
├──────────────────────────────────────────────────────────────┤
│  TOP 10 CITIES                                               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │ MUMBAI  │ │  DELHI  │ │BANGALORE│ │ CHENNAI │ ...        │
│  │ 87% Full│ │ 73% Full│ │ 91% Full│ │ 54% Full│           │
│  │ ₹2.3L   │ │ ₹1.8L   │ │ ₹2.7L   │ │ ₹0.9L   │           │
│  │[Manage] │ │[Manage] │ │[Manage] │ │[Manage] │           │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
├──────────────────────────────────────────────────────────────┤
│  53 METRO CITIES (scrollable grid)                           │
│  [Hyderabad] [Pune] [Ahmedabad] [Kolkata] [Surat] ...       │
├──────────────────────────────────────────────────────────────┤
│  OTHER CITIES 🔍 Search: [___________]                       │
└──────────────────────────────────────────────────────────────┘
4.7.3 Traffic Analyser (ADT_028)


┌──────────────────────────────────────────────────────┐
│  LIVE TRAFFIC 🔴                                     │
│  Currently on AdTowns.com: 1,247 users              │
│  ● Mumbai: 432  ● Delhi: 287  ● Bangalore: 198...   │
│                                                      │
│  HOURLY TRAFFIC HEATMAP (last 7 days avg)           │
│                                                      │
│  12AM ░░░░░░░░░░░░░░░░░░░  Low                      │
│  6AM  ░░░░░░░░░████████░░  Medium                   │
│  12PM ████████████████████  PEAK                    │
│  6PM  ████████████████████  PEAK                    │
│  10PM ░░░░░░░████████░░░░░  Medium                  │
│                                                      │
│  PEAK HOURS: 12PM-2PM, 6PM-9PM                      │
│  Best time for seller to activate offers ↑           │
└──────────────────────────────────────────────────────┘
4.7.4 Reports Section (ADT_029)


┌──────────────────────────────────────────────────────┐
│  REPORTS DASHBOARD                                   │
│                                                      │
│  🔔 New Reports: 3                                   │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │ Reporter: +91-98765-XXXXX                      │  │
│  │ Reported Shop: Ravi Foods, Mumbai, Floor 1     │  │
│  │ Reason: "Misleading ad"                        │  │
│  │ Time: May 12, 3:45 PM                          │  │
│  │                                                │  │
│  │ [📱 WhatsApp Reporter]                         │  │
│  │ [🤖 Send AI Message] ← pre-drafted response   │  │
│  │ [🚩 Flag Shop] [✅ Dismiss] [❌ Ban Shop]      │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
AI Message Flow:



Admin clicks [Send AI Message]
        │
        ▼
AI drafts:
"Hi! We received your report about [Shop Name]. 
Our team is reviewing this. Expected response: 24h.
Thank you for keeping AdTowns safe!"
        │
        ▼
Admin edits if needed → [Send via WhatsApp API]
4.7.5 Revenue Charts (ADT_030, ADT_031)


┌──────────────────────────────────────────────────────────────┐
│  REVENUE ANALYTICS                                           │
│                                                              │
│  FILTERS:                                                    │
│  [City ▼] [State ▼] [Category ▼] [Day|Month|Year] [📅Range] │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                                                        │  │
│  │   ₹                                                   │  │
│  │   │    ████                                           │  │
│  │   │    ████  ████                                     │  │
│  │   │    ████  ████  ████                               │  │
│  │   └────────────────────── Time                        │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  TODAY'S REVENUE                   CITY FILL STATUS          │
│  Total: ₹47,230                    Mumbai: ██████░░ 78%     │
│  ┌─────────────────┐               Bangalore: ████████ 91%  │
│  │ Mumbai: ₹12,400 │               Delhi: ████░░░░ 55%      │
│  │ Delhi:  ₹8,200  │               [FASTEST FILLING: BLR 🔥]│
│  │ BLR:   ₹14,300  │                                        │
│  └─────────────────┘                                        │
└──────────────────────────────────────────────────────────────┘
4.7.6 Immutable Audit Log (ADT_032)


┌──────────────────────────────────────────────────────┐
│  AUDIT LOG (Read-Only)                               │
│                                                      │
│  🔒 All actions are permanently recorded            │
│                                                      │
│  [Filter: Action Type ▼] [Admin ▼] [Date Range 📅] │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │ May 12, 14:32 | Admin: Kalash                  │  │
│  │ Action: Deactivated Shop "Ravi Foods" Mumbai   │  │
│  │ Reason: Report violation                       │  │
│  │ IP: 192.168.X.X | Hash: a3f9d2...             │  │
│  ├────────────────────────────────────────────────┤  │
│  │ May 12, 13:15 | Admin: Kalash                  │  │
│  │ Action: Price updated — Mumbai Food Floor 1    │  │
│  │ Old: ₹2,000 → New: ₹2,500                     │  │
│  │ IP: 192.168.X.X | Hash: b7e2c1...             │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
4.7.7 Category & Pricing Management (ADT_033, ADT_034)
Category Management:



┌──────────────────────────────────────────────────────┐
│  CATEGORY MANAGEMENT                                 │
│                                                      │
│  Mode: ○ Same for all cities  ● City-specific       │
│                                                      │
│  City: [Mumbai ▼]                                   │
│                                                      │
│  ACTIVE CATEGORIES                                   │
│  [Food 🍕 ×] [Health 💊 ×] [Fashion 👗 ×]          │
│  [Tech 💻 ×] [Home 🏠 ×]                            │
│                                                      │
│  [+ Add Category]                                   │
│  [Apply to All Cities]                              │
└──────────────────────────────────────────────────────┘
Pricing Setup:



┌──────────────────────────────────────────────────────┐
│  PRICING SETUP                                       │
│                                                      │
│  City: [Mumbai ▼]  Category: [Food ▼]               │
│                                                      │
│  FLOOR PRICING                                       │
│  Floor 1 (Platinum): ₹ [2,500] /month               │
│  Floor 2 (Gold):     ₹ [1,500] /month               │
│  Floor 3 (Silver):   ₹ [  800] /month               │
│                                                      │
│  CARD PRICING                                        │
│  Card after Floor 1: ₹ [5,000] /month               │
│  Card after Floor 2: ₹ [3,000] /month               │
│                                                      │
│  GST: 18% (auto-applied)                            │
│                                                      │
│  [Save Pricing] [Copy to Another City]              │
└──────────────────────────────────────────────────────┘
4.7.8 Shop Management (ADT_035 to ADT_039)
Master Shop List (ADT_035):



┌──────────────────────────────────────────────────────────────┐
│  MASTER SHOP LIST                                            │
│                                                              │
│  SEARCH: [City... Category... Seller Name... Floor... Pos..]│
│                                                              │
│  Total Shops: 2,847  |  Active: 2,103  |  Flagged: 12      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Shop Name   │ City   │ Cat  │ Floor│ Status │ Actions│   │
│  ├─────────────┼────────┼──────┼──────┼────────┼────────┤   │
│  │ Ravi Foods  │ Mumbai │ Food │  1   │ 🟢Live │ [View] │   │
│  │ Style Hub   │ Delhi  │ Fash │  2   │ 🟡Flag │ [View] │   │
│  │ Tech Point  │ BLR    │ Tech │  1   │ 🔴Off  │ [View] │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
Shop Detail Page (ADT_036):



┌──────────────────────────────────────────────────────┐
│  SHOP: RAVI FOODS                                    │
│                                                      │
│  Owner: Ravi Sharma | +91-98765-XXXXX               │
│  City: Mumbai | Category: Food                      │
│  Floor: 1 | Position: Row A, Pos 3                  │
│  Status: 🟢 Active                                   │
│  Expires: May 30, 2025                              │
│                                                      │
│  ACTIONS:                                            │
│  [🔇 Deactivate] [🚩 Flag to Moderate]             │
│  [🗑️ Delete Shop] [⏳ Extend Validity]              │
│  [📊 View Stats] [💬 Contact Seller]               │
└──────────────────────────────────────────────────────┘
Delete Shop Flow (ADT_038):



Admin clicks [Delete Shop]
        │
        ▼
CONFIRMATION MODAL:
"This will:
 ✓ Remove the shop permanently
 ✓ Free up pixel position
 ✓ Create refund record for ₹1,240 (pro-rata)
 ✓ Notify seller via SMS/WhatsApp

Type shop name to confirm: [_________]
[Cancel]  [Confirm Delete]"
        │
        ▼
→ Pixel position freed (available for new buyer)
→ Refund record created in billing
→ Seller WhatsApp: "Your ad on AdTowns has been removed.
   Refund of ₹1,240 initiated."
Extend Validity (ADT_039):



Admin clicks [Extend Validity]
        │
        ▼
┌─────────────────────────────────────┐
│  EXTEND SHOP VALIDITY               │
│  Current Expiry: May 30, 2025       │
│                                     │
│  Add: ○ 1 Month  ○ 3 Months        │
│       ○ 6 Months ○ 12 Months       │
│                                     │
│  New Expiry: Jun 30, 2025           │
│  Invoice Amount: ₹2,360            │
│                                     │
│  [Confirm Extension]               │
└─────────────────────────────────────┘
4.7.9 Ghost Pixel Populator (ADT_037)


┌──────────────────────────────────────────────────────┐
│  GHOST PIXEL MANAGER                                 │
│                                                      │
│  City: [Mumbai ▼] | Category: [Food ▼]              │
│                                                      │
│  CURRENT GRID (Floor 1):                            │
│  🟢=Paid  ░░=Ghost  ⬜=Empty                         │
│  ┌──┬──┬──┬──┬──┬──┬──┬──┬──┬──┐                   │
│  │🟢│🟢│░░│🟢│⬜│🟢│░░│🟢│🟢│⬜│                   │
│  └──┴──┴──┴──┴──┴──┴──┴──┴──┴──┘                   │
│                                                      │
│  Empty pixels: 2 (positions A5, A10)                │
│                                                      │
│  GHOST CONTENT:                                      │
│  Image: [Upload generic placeholder]                │
│  Text: "Your Ad Here | Book Now"                    │
│  CTA: Links to registration page                    │
│                                                      │
│  [Apply Ghost to Empty Pixels]                      │
│  [Remove All Ghosts]                                │
└──────────────────────────────────────────────────────┘
4.7.10 Seller Management (ADT_040, ADT_041)
Master Seller List (ADT_040):



┌──────────────────────────────────────────────────────┐
│  ALL SELLERS                               [+ Filter]│
│                                                      │
│  SEARCH: [Name / Phone / City / GSTIN...]           │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │ Seller     │ Phone  │ Cities│ Status │ Verified│  │
│  ├────────────┼────────┼───────┼────────┼─────────┤  │
│  │ Ravi Foods │ 9876.. │ 2     │ 🟢     │ ✅ GST  │  │
│  │ Style Hub  │ 8765.. │ 1     │ 🔴 Ban │ ❌      │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ON CLICK → SELLER DETAIL:                          │
│  [✅ Toggle Verified Badge]                         │
│  [⏸️ Timeout Seller (1/7/30 days)]                  │
│  [🚫 Permanent Ban]                                 │
│  [📊 Payment History]                               │
│  [📋 Past Ads]                                      │
│  [👤 Impersonate →] (ADT_041)                       │
└──────────────────────────────────────────────────────┘
Impersonate Seller Flow (ADT_041):



Admin clicks [Impersonate]
        │
        ▼
CONFIRMATION:
"You are about to view AdTowns as Ravi Foods.
All actions will be logged.
This session expires in 30 minutes."
[Confirm Impersonate]
        │
        ▼
Opens seller.adtowns.com in impersonation mode
        │
Banner at top: "⚠️ ADMIN MODE: Viewing as Ravi Foods | [Exit]"
        │
        ▼
All actions auto-logged to Audit Log (ADT_032)
5. COMPLETE DECISION FLOW DIAGRAMS
5.1 Master User Journey Map
text

                    ┌─────────────────┐
                    │  adtowns.com    │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
        ┌──────────┐                 ┌──────────────┐
        │  BUYER   │                 │ SELLER/NEW   │
        │ (Browse) │                 │ (Register)   │
        └────┬─────┘                 └──────┬───────┘
             │                              │
             ▼                              ▼
    ┌─────────────────┐           ┌──────────────────┐
    │ Location Detect │           │  OTP Verify       │
    │ Phone Capture   │           │  Account Created  │
    └───────┬─────────┘           └────────┬─────────┘
            │                              │
            ▼                              ▼
    ┌─────────────────┐           ┌──────────────────┐
    │ Category Select │           │  Floor Selection  │
    │ Pixel Grid View │           │  Pixel Selection  │
    └───────┬─────────┘           └────────┬─────────┘
            │                              │
            ▼                              ▼
    ┌─────────────────┐           ┌──────────────────┐
    │ Hover Pixel     │           │  Cart & Payment   │
    │ See Ad + CTA    │           │  Razorpay         │
    └───────┬─────────┘           └────────┬─────────┘
            │                              │
            ▼                              ▼
    ┌─────────────────┐           ┌──────────────────┐
    │ WhatsApp / Link │           │  Seller Admin     │
    │ (Impression ✓)  │           │  Setup Ad         │
    └─────────────────┘           └──────────────────┘
5.2 Pixel Purchase Decision Tree


Seller wants to buy pixel
           │
           ▼
    Registered? ──No──► Registration Flow
           │
          Yes
           ▼
    Select City & Category
           │
           ▼
    Select Floor (1/2/3)
           │
           ▼
    View Grid (real-time)
           │
           ▼
    Pixel Available? ──No──► Show alternatives OR Join Bidding
           │
          Yes
           ▼
    Click Pixel → Lock attempt
           │
    Lock success? ──No──► "Just taken" → Refresh grid
           │
          Yes
           ▼
    5-min lock timer starts
           │
           ▼
    Select Duration (1/3/6/12 months)
           │
           ▼
    View Price Breakdown + GST
           │
           ▼
    Add GSTIN? (Optional)
           │
           ▼
    Proceed to Razorpay
           │
    Payment success? ──No──► Retry (pixel held 5 more mins)
           │
          Yes
           ▼
    Pixel CONFIRMED ✓
    → Setup Ad Flow Begins
6. COMPONENT LIBRARY & UI STANDARDS
6.1 Core Components
Component	Usage	Behavior
<PixelGrid />	Buyer view, Seller selection	Real-time color updates via SignalR
<PixelCard />	Hover/click popup	Lazy-loaded, positioned smart
<FloorSelector />	Buying flow Step 2	Shows pricing, availability count
<OfferTimer />	Buyer page, Seller dashboard	Server-synced countdown
<AdEditor />	Seller admin	Live preview, AI integration
<RevenueChart />	Admin dashboard	Recharts/D3, filterable
<ImpersonationBanner />	Admin impersonate	Sticky top, cannot be dismissed
<AuditLogTable />	Admin	Read-only, paginated
6.2 Color System
Element	Color	Meaning
Available Pixel	#22C55E (Green)	Ready to buy
Taken Pixel	#EF4444 (Red)	Sold
In Cart (others)	#F59E0B (Amber)	Temporarily held
Ghost Pixel	#94A3B8 (Gray)	Placeholder
Premium Floor 1	#EAB308 (Gold)	Highest tier
Floor 2	#C0C0C0 (Silver)	Mid tier
Floor 3	#CD7F32 (Bronze)	Budget tier
6.3 Responsive Breakpoints
Breakpoint	Layout Change
Mobile < 768px	Pixel tap = bottom sheet modal
Tablet 768-1024px	Sidebar collapsed, grid narrower
Desktop > 1024px	Full sidebar, hover tooltips
7. STATE MANAGEMENT STRATEGY
7.1 Global State (Redux / Zustand)


GlobalState {
  user: {
    role: 'buyer' | 'seller' | 'admin',
    phone: string,
    sellerId: string | null,
    isImpersonating: boolean,
    impersonatingId: string | null
  },
  city: {
    selected: string,
    autoDetected: boolean
  },
  pixel: {
    lockedPixelId: string | null,
    lockExpiresAt: Date | null
  },
  realtime: {
    signalRConnection: HubConnection | null,
    isConnected: boolean
  }
}
7.2 Real-Time Events (SignalR)
Event Name	Trigger	Frontend Action
PixelLocked	Someone locks a pixel	Turn pixel Yellow (🟡)
PixelReleased	Lock expired / purchase failed	Turn pixel Green (🟢)
PixelSold	Purchase confirmed	Turn pixel Red (🔴)
NewImpression	Buyer clicks/hovers	Seller dashboard counter +1
NewReport	Buyer submits report	Admin gets notification badge
TrafficUpdate	Every 30 seconds	Update live user count
OfferExpired	8:00 AM trigger	Remove offer badges globally
8. REAL-TIME & INTEGRATION REQUIREMENTS
8.1 Razorpay Integration Points
Payment initiation on Cart Checkout
Webhook handling for payment success/failure
Auto-generate invoice on success
Support: Cards, UPI, NetBanking, Wallets
8.2 WhatsApp Integration
Seller receives impression notification
Admin sends moderation messages
Buyer receives deal notifications (optional opt-in)
Use: WhatsApp Business API / Twilio
8.3 AI Integration (ADT_017)
Endpoint: POST /api/ai/generate-ad-copy
Input: business type, specialty, offer, target audience
Output: headline (60 chars), description (100 chars)
Model: GPT-4o or equivalent
8.4 GST Verification API
Endpoint: GST Search API (government/third party)
Input: GSTIN string
Output: Business name, address, status (Active/Cancelled)
9. EDGE CASES & ERROR STATES
Scenario	Frontend Behavior
Two sellers click same pixel simultaneously	First one locks; second gets "pixel just taken" toast
Payment fails after pixel lock	Lock extended 5 minutes; retry offered
Seller's ad expires while buyer is viewing	Pixel turns ghost on next refresh; no broken UI
Admin deletes shop while seller is logged in	Seller session shows "Your shop has been removed" screen
Offer timer hits 0 mid-session	Offer badge removed live via SignalR
SignalR disconnects	Show "Reconnecting..." banner; grid polling fallback every 10s
AI generation fails	Show "AI unavailable, write manually" fallback
GST API down	Allow manual GSTIN entry, mark as "Pending Verification"
User blocks location	Prompt city selection manually
Image upload wrong ratio	Auto-crop preview + warning shown
10. OPEN QUESTIONS LOG
Q#	Task	Question	Impact
Q-1	ADT_007	How many floors will there be per city per category? Is it fixed or configurable by admin?	Grid layout, pricing tiers
A-1   fixed
Q-2	ADT_011	Can a seller modify the offer type (WhatsApp ↔ Link) mid-offer or only at creation?	Offer edit UI complexity
A-2   modify 5 times a day .
Q-3	ADT_011	Is the 8AM-8AM cycle based on seller's local time or IST uniform?	Timer sync logic  
A-3   ist
Q-4	ADT_012	When seller marks "offer limit closed" — does the pixel remain live without the offer, or does it show special state?	Pixel state machine
A-4   Pixel will be marked closed until he uploads other add.

Q-5	ADT_009	What is the maximum hold time for a locked pixel (currently assumed 5 minutes)?	Checkout UX urgency
A-5  5 MIN
Q-6	ADT_023	Are points redeemable as cash refund or only as Ad Towns credit?	Points redemption UI
A-6  NO THE POINTES WILL ONLY WE SHOWN in the dashboard 
Q-7	ADT_037	Who provides ghost pixel creative content — admin uploads or auto-generated "Book This Spot" template?	Ghost populator UI
A-7   no the admin will be able to allow some sellers to upload ad without payment .

Q-8	ADT_022	Is bidding time-bound (auction ends at X time) or open-ended?	Bidding timer component
A-8  bidding start and end timeing will be configurable by admin.


Q-9	ADT_041	Can impersonating admin make actual purchases/changes or is it read-only?	Legal / audit risk
A-9  read only 

Q-10	ADT_020	For multi-city seller, is billing consolidated into one invoice or separate per city?	Billing complexity
A-10  seperate per city .

DOCUMENT SUMMARY
Module	Tasks Covered	Screens	Key Complexity
Landing Page	ADT_001–005	5	Client review pending
Buyer Flow	ADT_042–048	6	Real-time impressions, timer
Buying Pixel	ADT_006–009	4	Concurrent lock, Razorpay
Buying Cards	ADT_010	2	Waitlist/bidding integration
Today's Offer	ADT_011–012	3	State machine, 8AM cycle
Seller Admin	ADT_013–025	15+	AI, KYC, multi-city, FOMO
Website Admin	ADT_026–041	14+	SignalR, impersonation, audit
TOTAL	48 Tasks	49+ Screens
