# AdTowns — Current Codebase Analysis

> **Last updated:** 2026-05-11  
> **Repo:** `sirkalashh/Ad_Towns`  
> **Domain:** https://adtowns.com

---

## 1. Project Overview

AdTowns is a **local marketplace platform for India** — a "pixel grid" concept where businesses buy pixel-sized ad slots organized by city and category. The project has two main parts:

| Part | Tech Stack | Location |
|------|-----------|----------|
| **Backend API** | .NET 8, EF Core, SQL Server, MailKit, FluentValidation, RazorLight | `AdTownsBackend.net/AdTowns/` |
| **Frontend** | React 19, Vite 8, TailwindCSS 4, Framer Motion, Shadcn/Radix UI | `react-landing/` |

---

## 2. Backend Architecture

### 2.1 Tech Stack
- **Framework:** ASP.NET Core 8 (Minimal hosting via `Program.cs`)
- **ORM:** Entity Framework Core → SQL Server (`MSSQLSERVER01`)
- **Email:** MailKit + Brevo (Sendinblue) SMTP relay
- **Templating:** RazorLight (`.cshtml` email templates)
- **Validation:** FluentValidation
- **Serialization:** System.Text.Json (camelCase, UTC DateTime converter)

### 2.2 File Structure
```
AdTownsBackend.net/AdTowns/
├── Program.cs                          # App entry — DI, CORS, rate limiting, middleware pipeline
├── appsettings.json                    # DB connection string, email settings, frontend URL
├── Controllers/
│   └── RegisterController.cs           # Single endpoint: POST /api/register
├── Models/
│   ├── Registration.cs                 # EF entity (Id, ReferenceId, Name, Business, Phone, Email, City, Type, Message, TermsAccepted, IpAddress, UserAgent, SubmittedAt, EmailSentToAdmin, EmailSentToUser, EmailSentAt)
│   └── RegistrationType.cs             # Enum: Vendor, Buyer, Referrer
├── Dtos/
│   └── RegisterRequestDto.cs           # Incoming payload: Name, Business?, Phone, Email, City, Type, Message?, TermsAccepted
├── Data/
│   ├── AppDbContext.cs                 # Single DbSet<Registration>, auto-lowercases emails on save
│   └── Configurations/
│       └── RegistrationConfiguration.cs # EF fluent config — unique indexes on Email, Phone, ReferenceId; check constraints on Type & TermsAccepted
├── Services/
│   ├── RegistrationService.cs          # Core business logic: duplicate checks, reference ID generation, DB save, email queue enqueue
│   └── Email/
│       ├── IEmailSender.cs             # Interface: SendAdminNotificationAsync, SendUserThankYouAsync
│       ├── MailKitEmailSender.cs        # Sends HTML emails via MailKit/SMTP; renders Razor templates; includes RegistrationEmailModel record
│       └── EmailSettings.cs            # POCO: SmtpHost, SmtpPort, SmtpUser, SmtpPass, FromEmail, FromName, AdminEmail, AllowInvalidCertificates
├── Infrastructure/
│   ├── ReferenceIdGenerator.cs         # Generates unique IDs like "AT-X3K9P2" (prefix AT- + 6 random alphanumeric chars)
│   └── EmailQueue/
│       ├── IEmailQueue.cs              # Interface: EnqueueAsync / DequeueAsync
│       └── ChannelEmailQueue.cs        # In-memory unbounded channel (System.Threading.Channels), singleton
├── HostedServices/
│   └── EmailSenderHostedService.cs     # BackgroundService: dequeues registration IDs, sends admin + user emails, updates DB flags
├── Middleware/
│   └── ExceptionHandlingMiddleware.cs  # Catches DuplicateEntryException → 409 JSON, all others → 500 JSON
├── Exceptions/
│   └── DuplicateEntryException.cs      # Custom exception with Field property
├── Validation/
│   └── RegisterRequestValidator.cs     # FluentValidation rules (name letters only, 10-digit phone, valid email, city required, type in [vendor/buyer/referrer], terms = true)
└── EmailTemplates/
    ├── AdminNotification.cshtml        # HTML email to admin on new registration
    ├── UserThanks_vendor.cshtml        # Thank-you email for vendors
    ├── UserThanks_buyer.cshtml         # Thank-you email for buyers
    └── UserThanks_referrer.cshtml      # Thank-you email for referrers
```

### 2.3 API Endpoint

**`POST /api/register`** — The only endpoint in the entire backend.

| Aspect | Details |
|--------|---------|
| Rate Limit | 5 requests per 15 minutes per IP (`RegistrationRateLimiter`) |
| Validation | FluentValidation → 400 with field-level errors |
| Duplicate Check | Pre-save query + SQL unique index catch → 409 `DUPLICATE_ENTRY` |
| On Success | 201 Created with `{ success, message, data: { referenceId, name, email, city, type, submittedAt } }` |
| Side Effect | Enqueues registration ID to in-memory channel → background service sends 2 emails (admin notification + user thank-you) |

### 2.4 CORS Configuration
- **Development:** Any `localhost` origin allowed
- **Production:** Only `https://adtowns.com`

### 2.5 Email Flow
```
Registration saved to DB
    ↓
ChannelEmailQueue.EnqueueAsync(registrationId)
    ↓
EmailSenderHostedService (BackgroundService) dequeues
    ↓
├── SendAdminNotificationAsync → AdminNotification.cshtml → admin email
└── SendUserThankYouAsync → UserThanks_{type}.cshtml → user email
    ↓
Updates Registration: EmailSentToAdmin, EmailSentToUser, EmailSentAt
```

---

## 3. Frontend Architecture

### 3.1 Tech Stack
- **React 19** + **Vite 8** (dev server + build)
- **TailwindCSS 4** (via `@tailwindcss/vite` plugin)
- **Framer Motion 12** (animations, scroll effects)
- **Shadcn/Radix UI** (full component library in `src/pixels/components/ui/`)
- **React Router DOM 7** (client-side routing)
- **React Helmet Async** (SEO meta tags)
- **Sonner** (toast notifications)
- **Axios** (installed but NOT used — `fetch` is used instead via `src/api/http.ts`)
- **Zod + React Hook Form** (installed but NOT used in the registration form — manual validation is used)

### 3.2 File Structure
```
react-landing/
├── .env                                # VITE_API_BASEURL=https://adtowns.com, VITE_PIXELS_API_URL (unused)
├── index.html                          # Entry HTML with Google Fonts (Outfit + Bricolage Grotesque), robots meta
├── vite.config.js                      # React + Tailwind plugins, @ alias → ./src
├── package.json                        # All dependencies
├── src/
│   ├── main.jsx                        # Entry: StrictMode → HelmetProvider → BrowserRouter → App
│   ├── App.jsx                         # Route split: /pixels/* → pixel pages, everything else → landing
│   ├── index.css                       # ~41KB master CSS: Tailwind imports, custom properties, all component styles
│   ├── api/
│   │   ├── http.ts                     # Generic fetch wrapper with JSON + error handling (400/409 pass-through)
│   │   └── registration.ts            # TypeScript types + register() function → POST /api/register
│   ├── components/                     # Shared landing page components
│   │   ├── Button.jsx                  # Reusable button (primary/secondary variants)
│   │   ├── Layout.jsx                  # Basic wrapper (not actively used)
│   │   ├── LegalModal.jsx             # Terms & Conditions / Privacy Policy modal with full legal text
│   │   ├── SEO.jsx                     # React Helmet meta tags (title, description, OG, Twitter cards)
│   │   ├── StarField.jsx              # Animated star particles background (CSS + JS)
│   │   └── Ticker.jsx                 # Top scrolling announcement bar ("Pre-launching across India")
│   ├── pages/
│   │   ├── Home.jsx                    # Landing page: Hero (sticky) + Fomo + About + Features + Prizes + Cities + Promise
│   │   └── Register.jsx               # Registration page wrapper → Signup section
│   ├── sections/                       # Landing page sections
│   │   ├── Navbar.jsx                  # Sticky nav with scroll links, animated CTA button
│   │   ├── Hero.jsx                    # Hero with stats counter, iOS-style sticky CTA bar
│   │   ├── Fomo.jsx                    # Dark urgency section (48h, 1st, 0%, Win cards)
│   │   ├── About.jsx                   # "Who is AdTowns for" — 3 liquid glass cards (Vendors, Buyers, Referrers)
│   │   ├── Features.jsx               # Scroll-animated "How it works" (6 steps) + 9 category grid + floor pricing table
│   │   ├── Prizes.jsx                 # Grand prize competition section (Flat, Car, Bike) + countdown timer + other prizes
│   │   ├── Cities.jsx                 # City selector (29 cities shown + "71 more")
│   │   ├── Promise.jsx                # "The AdTowns Promise" — 0% commission, comparison table vs competitors
│   │   ├── Signup.jsx                 # Full registration form with client-side validation → API call → success screen with pixel CTA
│   │   └── Footer.jsx                 # Logo, Instagram + Facebook social links with hover animations
│   └── pixels/                         # Pixel grid sub-application (merged from separate AdTownPixels project)
│       ├── pages/
│       │   ├── PixelsHome.jsx          # Pixel grid landing — city card for Indore, features, stats
│       │   ├── PixelsCityPage.jsx      # Category-tabbed pixel grid viewer (10×10 grid per category)
│       │   └── BuyPixels.jsx           # Vendor pixel purchase flow — plan selection + seat-booking grid
│       ├── components/
│       │   ├── PixelGrid.jsx           # 10-column grid renderer with row-based floor labels
│       │   ├── PixelCard.jsx           # Individual pixel card with vendor info popup
│       │   ├── AdPreviewCard.jsx       # Tooltip preview when hovering pixel seats
│       │   ├── AdSlider.jsx            # Carousel for banner ads between grid rows
│       │   ├── DealBottomDrawer.jsx    # Mobile bottom sheet for deal details
│       │   ├── DealCardPopup.jsx       # Desktop popup for deal details
│       │   ├── TickerSlider.jsx        # Pixel-specific scrolling ticker
│       │   └── ui/                     # ~40 Shadcn/Radix UI components (accordion, dialog, drawer, tabs, etc.)
│       ├── lib/
│       │   ├── mockData.jsx            # ALL pixel data is hardcoded mock (categories, city, vendors, pricing, ads)
│       │   └── utils.js               # cn() helper (clsx + tailwind-merge)
│       └── hooks/
│           └── use-toast.js            # Toast hook (Radix toast, not Sonner)
```

### 3.3 Routing

```
App.jsx decides layout based on pathname:

/pixels/*  →  No Navbar/Footer/Ticker, renders pixel pages directly
/*         →  Landing layout: Ticker → Navbar → Routes → Footer

Routes:
  /                     → Home (landing page)
  /register             → Register (signup form)
  /pixels               → PixelsHome (pixel grid landing)
  /pixels/buy           → BuyPixels (vendor purchase flow)
  /pixels/city/:citySlug → PixelsCityPage (category grid for a city)
```

### 3.4 Landing Page Flow (User Journey)
```
User lands on /
    ↓
Ticker bar ("Pre-launching across India · Registrations open")
    ↓
Hero section (stats: 100 cities, 9 categories, 180K+ shops, ₹0 commission)
    ↓
Fomo section (urgency: 48h, first-mover, 0% commission, win prizes)
    ↓
About section (3 liquid-glass cards: Vendors, Buyers, Referrers)
    ↓
Features section (6-step scroll animation: Register → Claim → Go Live → Track → Specials → Win)
    ↓
Categories grid (9 categories: Food, Fashion, Medical, Spa, Gym, Events, Startups, Talents, Misc)
    ↓
Floor pricing table (Ground/1st Floor ₹1,499.88/yr Premium, 2nd+ ₹999.88/yr, Startups ₹499.88-999.88/yr)
    ↓
Prizes section (Grand: Flat, Car, Bike + 12 other prize types + countdown timer)
    ↓
Cities section (29 cities displayed, "71 more" button)
    ↓
Promise section (0% commission, comparison table vs Nearbuy/Google Ads/Instagram)
    ↓
Footer (logo, Instagram + Facebook links, back-to-top)
```

### 3.5 Registration Flow (Frontend → Backend)
```
User clicks "Register Interest" (any CTA)
    ↓
Navigates to /register → Signup.jsx renders form
    ↓
Form fields:
  - Name (letters + spaces only, hard-filtered on input)
  - Business name (optional)
  - Phone (10-digit)
  - Email
  - City (dropdown: Indore, Mumbai, Delhi, Bengaluru, Other)
  - Type (dropdown: vendor, buyer, referrer)
  - Message (optional, max 1000 chars)
  - Terms checkbox
    ↓
Client-side validation on blur + on submit
    ↓
POST /api/register (via src/api/registration.ts → src/api/http.ts → fetch)
    ↓
Response handling:
  ├── Success (201) → Show success screen with Reference ID (e.g. "AT-X3K9P2")
  │                    → CTA button: vendors → /pixels/buy, others → /pixels
  ├── Validation Error (400) → Map server errors to form fields
  ├── Duplicate (409) → Show error on email/phone field + banner
  └── Network Error → Show connection error banner
```

### 3.6 Pixel Grid System (Frontend Only — All Mock Data)

The pixel grid is **entirely frontend-driven with hardcoded mock data**. There is NO backend API for pixels.

**Grid Structure per Category:**
- **10 rows × 10 columns = 100 pixels per category**
- **Floor 1 (Elite):** Rows 1-3 → 30 slots
- **Floor 2 (Premium):** Rows 4-6 → 30 slots
- **Floor 3 (Standard):** Rows 7-10 → 40 slots

**9 Categories × 100 pixels = 900 total pixels per city (mock says 1800)**

**Pricing (incl. GST, per year):**

| Tier | Fashion/Food/Medical/Spa/Gym/Events | Startups/Talents/Misc |
|------|-------------------------------------|----------------------|
| Elite | ₹1,999.88 | ₹1,499.88 |
| Premium | ₹1,499.88 | ₹999.88 |
| Standard | ₹999.88 | ₹499.88 |

**Mock vendors:** ~3-5 template vendors per category with business names, deals, ratings, WhatsApp numbers. Only ~8 pixels per category are "taken" in mock data.

**BuyPixels flow (vendor purchase — UI only, no actual payment):**
```
Vendor arrives at /pixels/buy
    ↓
Step 1: Select category + choose plan (Standard/Premium/Elite pricing cards)
    ↓
Step 2: Movie-theater-style seat picker (10×10 grid)
  - Green/available pixels are clickable
  - Gray/taken pixels are disabled
  - Selected pixel highlights in turmeric/gold
    ↓
Sticky bottom bar shows: Floor, Column, Pixel Type, Price
    ↓
"Confirm & Pay ↗" button → Toast notification only (no real payment integration)
```

---

## 4. Design System

### 4.1 Color Palette (from CSS custom properties)
| Token | Value | Usage |
|-------|-------|-------|
| `--coral` | `#EF9F27` (gold-orange) | Primary CTA, accents |
| `--coralDark` | `#993C1D` | Hover states |
| `--gold` | `#EF9F27` | Stats, highlights |
| `--navy` | `#0c0c14` | Dark sections |
| `--bg` | `#FAFAF8` | Page background |
| `--text` | `#555` | Body text |
| `--turmeric` | warm amber | Pixel purchase theme |

### 4.2 Typography
- **Heading font:** Bricolage Grotesque (Google Fonts)
- **Body font:** Outfit (Google Fonts)
- Both loaded via `index.html` `<link>` tags

### 4.3 Animation Patterns
- **Framer Motion:** Scroll-linked transforms, AnimatePresence page transitions, spring physics
- **iOS-style effects:** Card stack parallax on Home, sticky CTA bar, liquid glass cards
- **Scroll-driven features:** Hero shrinks on scroll, "How it works" steps animate on scroll progress
- **Micro-interactions:** Hover tilts, scale animations, category card lifts on mobile scroll

---

## 5. Environment & Deployment

### 5.1 Frontend
- **Dev:** `npm run dev` → Vite dev server
- **Prod:** `npm run build` → `dist/` directory (static files)
- **API Base URL:** `VITE_API_BASEURL=https://adtowns.com` (env variable)
- **Domain:** adtowns.com

### 5.2 Backend
- **Runtime:** .NET 8
- **Database:** SQL Server (local: `localhost\MSSQLSERVER01`, DB: `AdTowns`)
- **Email:** Brevo SMTP relay (`smtp-relay.brevo.com:587`)
- **Admin email:** `Kalashtiwari85@gmail.com`
- **Swagger:** Enabled at `/swagger`

---

## 6. What's Connected vs What's Not

### ✅ Connected (Working End-to-End)
- Registration form → `POST /api/register` → SQL Server → Email queue → Admin + User emails
- Client-side validation mirrors server-side validation
- Duplicate email/phone detection (client + server + DB constraint)

### ❌ Not Connected (Frontend-Only / Mock)
- **Entire pixel grid system** — all data is hardcoded in `mockData.jsx`
- **Pixel purchase flow** — no payment gateway, no backend API
- **City data** — only Indore is mocked, no real city API
- **Vendor dashboard** — not built
- **Analytics** — mock view counts and WhatsApp taps
- **AI shop descriptions** — mentioned in marketing copy but not implemented
- **WhatsApp direct connect** — mock numbers only
- **Prize competition system** — countdown timer is fake (starts at 47 days, counts down from page load)

### 📦 Installed But Unused
- `axios` — fetch is used instead
- `zod` + `react-hook-form` — manual form validation in Signup.jsx
- `recharts` — no charts anywhere
- `react-resizable-panels` — not used
- `next-themes` — not used (no dark mode toggle)
- Several Radix UI components (calendar, command, menubar, etc.) — installed as part of Shadcn bundle but not referenced

---

## 7. Database Schema (Single Table)

```sql
Registrations
├── Id                  GUID (PK, NEWSEQUENTIALID)
├── ReferenceId         NVARCHAR(9) UNIQUE NOT NULL     -- "AT-XXXXXX"
├── Name                NVARCHAR(100) NOT NULL
├── Business            NVARCHAR(200) NULL
├── Phone               NVARCHAR(15) UNIQUE NOT NULL
├── Email               NVARCHAR(150) UNIQUE NOT NULL   -- auto-lowercased
├── City                NVARCHAR(100) NOT NULL
├── Type                NVARCHAR(MAX) NOT NULL           -- stored as string: "Vendor"/"Buyer"/"Referrer"
├── Message             NVARCHAR(1000) NULL
├── TermsAccepted       BIT NOT NULL                    -- CHECK: must be 1
├── IpAddress           VARCHAR(50) NULL
├── UserAgent           NVARCHAR(MAX) NULL
├── SubmittedAt         DATETIME2 NOT NULL (DEFAULT GETUTCDATE)
├── EmailSentToAdmin    BIT NOT NULL (DEFAULT 0)
├── EmailSentToUser     BIT NOT NULL (DEFAULT 0)
└── EmailSentAt         DATETIME2 NULL

Indexes:
  - IX_Registrations_ReferenceId (UNIQUE)
  - IX_Registrations_Email (UNIQUE)
  - IX_Registrations_Phone (UNIQUE)
  - IX_Registrations_SubmittedAt (DESCENDING)
  - IX_Registrations_City_Type (COMPOSITE)

Constraints:
  - CK_Registration_TermsAccepted: [TermsAccepted] = 1
  - CK_Registration_Type: [Type] IN ('Vendor', 'Buyer', 'Referrer')
```

---

## 8. Summary

AdTowns is currently a **pre-launch landing page with a working registration backend**. The registration flow (form → API → database → email notifications) is fully functional. The pixel grid / marketplace portion is a **frontend-only prototype** using hardcoded mock data — there is no backend API, no payment integration, no real vendor data, and no user authentication. The project is in a "collect interest registrations" phase before building out the actual marketplace functionality.
