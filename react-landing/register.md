# AdTowns — Register Interest Form: Full System Documentation

## Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Form Fields & Validation](#2-form-fields--validation)
3. [Mongoose Model](#3-mongoose-model)
4. [Express API Route](#4-express-api-route)
5. [Email Service (SendGrid)](#5-email-service-sendgrid)
6. [React Form Integration](#6-react-form-integration)
7. [Package Dependencies](#7-package-dependencies)
8. [Setup Instructions](#8-setup-instructions)
9. [Database Query Reference](#9-database-query-reference)
10. [API Response Contracts](#10-api-response-contracts)
11. [Security Controls](#11-security-controls)

---

## 1. Architecture Overview

```
Browser (React)
     │
     │  POST /api/register (JSON)
     ▼
Express Server  (port 5000)
     │
     ├── Rate Limiter (5 req / 15 min / IP)
     ├── express-validator (input sanitization)
     │
     ├── Mongoose → MongoDB (localhost:27017/adtowns)
     │        Collection: registrations
     │        Pre-save: generate referenceId (AT-XXXXXX)
     │
     └── SendGrid (async, after response sent)
              ├── Admin Email  → kalashtiwari85@gmail.com
              └── User Email   → registrant's email
```

### File Structure

```
server/
├── server.js                  # Express entry point
├── package.json
├── .env.example               # Template — copy to .env
├── .gitignore
├── models/
│   └── Registration.js        # Mongoose schema + pre-save hook
├── routes/
│   └── register.js            # POST /api/register
├── services/
│   └── email.js               # SendGrid HTML email templates
└── db-queries.js              # MongoDB shell reference

react-landing/src/sections/
└── Signup.jsx                 # Form component (now connected)
```

---

## 2. Form Fields & Validation

| Field    | Type      | Required | Validation (Client + Server)                         |
|:---------|:----------|:--------:|:-----------------------------------------------------|
| name     | text      | ✅       | Min 3 chars, letters & spaces only                   |
| business | text      | ❌       | Optional, max 200 chars                              |
| phone    | tel       | ✅       | Exactly 10 digits, unique in DB                      |
| email    | email     | ✅       | Valid email format, lowercase, unique in DB           |
| city     | select    | ✅       | Must select a value                                  |
| type     | select    | ✅       | Enum: `vendor` / `buyer` / `referrer`                |
| message  | textarea  | ❌       | Optional, max 1000 chars                             |
| terms    | checkbox  | ✅       | Must be `true`                                       |

### Validation Strategy
- **Client-side**: Real-time feedback via `validateField()` on blur/change
- **Server-side**: `express-validator` re-validates all fields (defense in depth)
- **Database level**: Mongoose schema validators + unique indexes

---

## 3. Mongoose Model

**File:** `server/models/Registration.js`

### Schema Fields

```js
{
  referenceId:       String,   // Auto-generated: AT-XXXXXX, unique
  name:              String,   // Required, trimmed
  business:          String,   // Optional, default ''
  phone:             String,   // Required, 10 digits, unique
  email:             String,   // Required, lowercase, unique
  city:              String,   // Required
  type:              String,   // Enum: vendor/buyer/referrer
  message:           String,   // Optional, max 1000 chars
  terms:             Boolean,  // Required: must be true

  // Audit fields
  ipAddress:         String,   // Captured server-side
  userAgent:         String,   // Captured server-side
  submittedAt:       Date,     // Default: now

  // Email delivery status
  emailSentToAdmin:  Boolean,  // Default: false
  emailSentToUser:   Boolean,  // Default: false
  emailSentAt:       Date,     // Null until emails sent

  // Mongoose timestamps
  createdAt:         Date,     // Auto
  updatedAt:         Date,     // Auto
}
```

### Indexes
- `email` — unique
- `phone` — unique
- `referenceId` — unique
- `submittedAt: -1` — for sorting queries
- `{ city: 1, type: 1 }` — for compound analytics queries

### Pre-save Hook
Generates a unique `AT-XXXXXX` reference ID before every new document is saved. Retries up to 10 times to guarantee uniqueness collision-free.

---

## 4. Express API Route

**File:** `server/routes/register.js`  
**Endpoint:** `POST /api/register`

### Request Body
```json
{
  "name": "Kalash Tiwari",
  "business": "TechZone",
  "phone": "9876543210",
  "email": "kalash@example.com",
  "city": "Indore",
  "type": "vendor",
  "message": "I want to open a tech shop",
  "terms": true
}
```

### Processing Flow
```
1. Rate limit check (5 req / 15 min / IP)
2. express-validator sanitize & validate
3. new Registration({ ...fields, ipAddress, userAgent })
4. registration.save()          → MongoDB
5. setImmediate(sendEmails)     → async, non-blocking
6. res.status(201).json(...)    → immediate response
7. DB updated: emailSentToAdmin/User/At
```

---

## 5. Email Service (SendGrid)

**File:** `server/services/email.js`

### Admin Notification Email
- **To:** `kalashtiwari85@gmail.com`
- **Subject:** `New Registration - AT-XXXXXX | Name (City)`
- **Content:** Full HTML table with all 11 registration details

### User Thank-You Email
- **To:** Registrant's email
- **Subject:** `Welcome to AdTowns, [FirstName]! Your registration is confirmed 🎉`
- **Content:**
  - AdTowns branded header (teal `#0d9488`)
  - Reference ID card (prominently displayed)
  - Personalized message based on registration type
  - "What's next" 4-step section
  - Registration summary table
  - Professional footer

### Email Failure Handling
- Emails are sent **after** the API response is returned (non-blocking)
- Individual try/catch for admin and user emails separately
- Failures are **logged** but do NOT break the registration
- `emailSentToAdmin` / `emailSentToUser` flags track delivery in MongoDB

---

## 6. React Form Integration

**File:** `react-landing/src/sections/Signup.jsx`

### State Added
```js
const [referenceId, setReferenceId] = useState('');   // Real ID from server
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitError, setSubmitError] = useState('');
```

### HTTP Response Handling

| Status | Code | Action |
|:-------|:-----|:-------|
| 201 | success | Show success screen with real `referenceId` |
| 400 | VALIDATION_ERROR | Map server errors to form fields |
| 409 | DUPLICATE_ENTRY | Show error on `email` or `phone` field |
| 429 | (rate limit) | Show banner: "Too many submissions…" |
| 500 | SERVER_ERROR | Show generic error banner |
| Network fail | — | Show connectivity error banner |

### Loading State
The submit button shows a spinning SVG loader and "Sending your registration..." text, and is disabled while `isSubmitting` is true.

---

## 7. Package Dependencies

### Backend (install in `server/`)
```bash
npm install express mongoose @sendgrid/mail cors helmet morgan dotenv express-rate-limit express-validator
npm install --save-dev nodemon
```

### Individual packages
| Package | Version | Purpose |
|:--------|:--------|:--------|
| express | ^4.19 | HTTP server |
| mongoose | ^8.4 | MongoDB ODM |
| @sendgrid/mail | ^8.1 | Email sending |
| cors | ^2.8 | CORS headers |
| helmet | ^7.1 | Security headers |
| morgan | ^1.10 | Request logging |
| dotenv | ^16.4 | Environment variables |
| express-rate-limit | ^7.3 | IP-based rate limiting |
| express-validator | ^7.1 | Input sanitization & validation |
| nodemon | ^3.1 | Dev auto-restart |

---

## 8. Setup Instructions

### Step 1: Install MongoDB locally
Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

Start MongoDB (Windows):
```powershell
# Start MongoDB service
net start MongoDB

# Or run manually
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
```

Verify connection:
```bash
mongosh
> show dbs
```

### Step 2: Get SendGrid API Key
1. Go to [app.sendgrid.com](https://app.sendgrid.com)
2. Create an account (free tier = 100 emails/day)
3. **Settings → API Keys → Create API Key**
4. Choose "Full Access" or restrict to "Mail Send"
5. Copy the key immediately (shown only once)

### Step 3: Verify Sender Email in SendGrid
> ⚠️ You must verify `noreply@adtowns.com` before emails will send.

1. **Settings → Sender Authentication**
2. **Single Sender Verification** (quickest option)
3. Add `noreply@adtowns.com` — SendGrid will send a verification email
4. Click the link in the email to verify
5. Alternatively, use **Domain Authentication** for full domain `adtowns.com`

### Step 4: Configure Environment
```bash
cd server
cp .env.example .env
```

Edit `.env`:
```env
MONGO_URI=mongodb://localhost:27017/adtowns
PORT=5000
SENDGRID_API_KEY=SG.your_real_key_here
ADMIN_EMAIL=kalashtiwari85@gmail.com
FROM_EMAIL=noreply@adtowns.com
FROM_NAME=AdTowns Team
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Step 5: Install & Run
```bash
# Terminal 1 — Backend
cd server
npm install
npm run dev

# Terminal 2 — Frontend
cd react-landing
npm run dev
```

### Step 6: Test the Integration
```bash
# Quick API health check
curl http://localhost:5000/api/health

# Test registration (use curl or Postman)
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "9876543210",
    "email": "test@example.com",
    "city": "Indore",
    "type": "vendor",
    "terms": true
  }'
```

Expected success response:
```json
{
  "success": true,
  "message": "Registration successful! Check your email for confirmation.",
  "data": {
    "referenceId": "AT-X7B2K9",
    "name": "Test User",
    "email": "test@example.com",
    "city": "Indore",
    "type": "vendor",
    "submittedAt": "2026-05-01T07:00:00.000Z"
  }
}
```

---

## 9. Database Query Reference

See [`server/db-queries.js`](./db-queries.js) for all queries. Key ones:

```js
// View all registrations
db.registrations.find({}).sort({ submittedAt: -1 }).pretty()

// Check email delivery
db.registrations.find({},
  { referenceId:1, email:1, emailSentToAdmin:1, emailSentToUser:1 }
)

// Failed emails
db.registrations.find({
  $or: [{ emailSentToAdmin: false }, { emailSentToUser: false }]
})

// Find by date range (last 7 days)
db.registrations.find({
  submittedAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) }
})

// Breakdown by city
db.registrations.aggregate([
  { $group: { _id: "$city", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])
```

---

## 10. API Response Contracts

### POST /api/register

#### 201 Created — Success
```json
{
  "success": true,
  "message": "Registration successful! Check your email for confirmation.",
  "data": {
    "referenceId": "AT-X7B2K9",
    "name": "Kalash Tiwari",
    "email": "kalash@example.com",
    "city": "Indore",
    "type": "vendor",
    "submittedAt": "2026-05-01T07:00:00.000Z"
  }
}
```

#### 400 Bad Request — Validation Error
```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Please correct the highlighted fields.",
  "errors": {
    "phone": "Enter a valid 10-digit mobile number.",
    "email": "Enter a valid email address."
  }
}
```

#### 409 Conflict — Duplicate Entry
```json
{
  "success": false,
  "code": "DUPLICATE_ENTRY",
  "message": "This email address is already registered.",
  "field": "email"
}
```

#### 429 Too Many Requests — Rate Limited
```json
{
  "success": false,
  "code": "RATE_LIMITED",
  "message": "Too many submissions from this IP. Please try again in 15 minutes."
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "code": "SERVER_ERROR",
  "message": "Something went wrong on our end. Please try again shortly."
}
```

---

## 11. Security Controls

| Control | Implementation |
|:--------|:---------------|
| Rate Limiting | 5 req / 15 min / IP via `express-rate-limit` |
| Input Sanitization | `express-validator` trims/escapes all inputs |
| Helmet | HTTP security headers (XSS, CSP, HSTS etc.) |
| CORS | Whitelist: `localhost:5173`, `adtowns.com` only |
| Body Size Limit | `10kb` max request body |
| IP Logging | All registrations log IP for abuse tracking |
| Name Restriction | Hard-block: numbers/symbols stripped client-side |
| Unique Indexes | DB-level uniqueness enforcement on email + phone |
| Double Validation | Client → Server → Database (3 layers) |
| No PII in Logs | Logs show referenceId/email, not passwords |

---

*Last Updated: 2026-05-01*  
*Maintained by: AdTowns Engineering*
