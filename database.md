DATABASE.md — Complete Database Documentation
Markdown

# Ad Towns — Database Documentation

> **Database Name:** AdTowns
> **Engine:** SQL Server 2022
> **Status:** Production-ready, fully seeded
> **Last Updated:** 2026-05-11

---

## Table of Contents

1. [Overview](#overview)
2. [Connection Information](#connection-information)
3. [Entity Relationship Overview](#entity-relationship-overview)
4. [Complete Table Schemas](#complete-table-schemas)
5. [Stored Procedures](#stored-procedures)
6. [Triggers](#triggers)
7. [Pre-Seeded Data](#pre-seeded-data)
8. [Pricing Strategy](#pricing-strategy)
9. [Critical Constraints](#critical-constraints)
10. [Index Strategy](#index-strategy)
11. [Transaction Requirements](#transaction-requirements)

---

## Overview

The AdTowns database is a fully relational SQL Server schema supporting:

- **Hyperlocal pixel-based advertising marketplace**
- **Multi-tenant seller management** (one account, multiple cities)
- **Atomic pixel locking** for concurrent purchase prevention
- **Time-windowed daily offers** (8AM-8AM IST cycle)
- **Immutable audit logging** with cryptographic chain
- **Real-time analytics** via pre-aggregated daily stats
- **GST-compliant invoicing** (CGST/SGST/IGST split logic)
- **Points-based loyalty** with referral rewards

### Quick Stats

| Asset | Count |
|---|---|
| Total Tables | 29 |
| Stored Procedures | 8 |
| Triggers | 6 |
| Indexes | 109+ |
| Foreign Keys | 50+ |
| Check Constraints | 40+ |
| Pre-seeded Cities | 60 |
| Pre-seeded Categories | 15 |
| Pre-seeded Pixels | 27,000 |
| Pre-seeded Floor Configs | 2,700 |

---

## Connection Information
Server: localhost\MSSQLSERVER01 (development)
Database: AdTowns
Auth: SQL Authentication or Windows Authentication
Trust: TrustServerCertificate=True (development)

text


### EF Core Connection String Template

```csharp
"DefaultConnection": "Server=localhost\\MSSQLSERVER01;Database=AdTowns;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
Entity Relationship Overview
text

┌─────────────────────────────────────────────────────────────────────┐
│                        CORE RELATIONSHIPS                           │
└─────────────────────────────────────────────────────────────────────┘

Cities (60) ──── 1:N ──── CityCategories ──── N:1 ──── Categories (15)
   │                                                          │
   │ 1:N                                                      │ 1:N
   ▼                                                          ▼
FloorConfigurations ◄──────── 1:N (per city/category) ──────►Floors (logical)
   │
   │ Defines pricing for...
   ▼
Pixels (27,000) ◄────── 1:1 (CurrentShopId) ──────► Shops
   │                                                  │
   │ 1:N (Impressions)                               │ 1:N
   ▼                                                  ▼
Impressions ─────────────────────────────────────► Ads
                                                     │
                                                     │ 1:N (Offers per shop)
                                                     ▼
                                                  Offers (8AM cycle)

Sellers (auth) ──── 1:N ──── Shops ──── 1:N ──── Transactions ──── 1:1 ──── Invoices
     │                                                                          │
     │ 1:N                                                                      │
     ├──► PointLedger (referral rewards)                                       │
     ├──► ReferralLinks (who referred whom)                                    │
     ├──► KycRecords (GST + Identity)                                          │
     └──► Notifications (in-app alerts)                                         │
                                                                                │
Admins ──── 1:N ──── AuditLogs (immutable, hash-chained)                       │
                                                                                │
Buyers (anonymous) ──── 1:N ──── Reports                                        │
Circular FK (Important!)
Two tables reference each other and must be created in sequence:

SQL

Pixels.CurrentShopId  → Shops.ShopId   (added AFTER both tables exist)
Transactions.InvoiceId → Invoices.InvoiceId  (added AFTER both tables exist)
This is handled in the database creation script and reflected in EF entities.

Complete Table Schemas
1. Cities
Stores all Indian cities where AdTowns operates.

SQL

CREATE TABLE dbo.Cities (
    CityId      INT IDENTITY(1,1)  PRIMARY KEY,
    CityName    NVARCHAR(100)      NOT NULL UNIQUE,
    StateCode   NVARCHAR(10)       NOT NULL,
    StateName   NVARCHAR(100)      NOT NULL,
    IsMetro     BIT                NOT NULL DEFAULT 0,
    IsTop10     BIT                NOT NULL DEFAULT 0,
    IsActive    BIT                NOT NULL DEFAULT 1,
    SortOrder   INT                NOT NULL DEFAULT 999,
    Latitude    DECIMAL(10,8)      NULL,
    Longitude   DECIMAL(11,8)      NULL,
    CreatedAt   DATETIME2          NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt   DATETIME2          NOT NULL DEFAULT GETUTCDATE()
);
Indexes: IX_Cities_IsActive, IX_Cities_IsTop10, IX_Cities_IsMetro

Seeded Data:

10 Top Metros: Mumbai, Delhi, Bangalore, Hyderabad, Ahmedabad, Chennai, Kolkata, Surat, Pune, Jaipur
50 Other Metros: Lucknow, Kanpur, Nagpur, Indore, Thane, Bhopal, etc.
2. Categories
Business categories available for ad placements.

SQL

CREATE TABLE dbo.Categories (
    CategoryId      INT IDENTITY(1,1)  PRIMARY KEY,
    CategoryName    NVARCHAR(100)      NOT NULL,
    IconEmoji       NVARCHAR(10)       NULL,
    IconUrl         NVARCHAR(500)      NULL,
    IsGlobal        BIT                NOT NULL DEFAULT 1,
    SortOrder       INT                NOT NULL DEFAULT 999,
    IsActive        BIT                NOT NULL DEFAULT 1,
    CreatedAt       DATETIME2          NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt       DATETIME2          NOT NULL DEFAULT GETUTCDATE()
);
Seeded Categories (15):

Food & Restaurants 🍕
Health & Medical 💊
Fashion & Clothing 👗
Electronics & Tech 💻
Home & Furniture 🏠
Beauty & Salons 💅
Education & Coaching 📚
Travel & Transport ✈
Sports & Fitness 🏋
Entertainment & Events 🎭
Jewellery & Accessories 💍
Real Estate 🏢
Automobiles 🚗
Groceries & Supermarket 🛒
Pets & Animals 🐾
3. CityCategories
Junction table — defines which categories are available in which cities.

SQL

CREATE TABLE dbo.CityCategories (
    CityCategoryId  INT IDENTITY(1,1)  PRIMARY KEY,
    CityId          INT                NOT NULL FK → Cities,
    CategoryId      INT                NOT NULL FK → Categories,
    IsActive        BIT                NOT NULL DEFAULT 1,
    SortOrder       INT                NOT NULL DEFAULT 999,
    CreatedAt       DATETIME2          NOT NULL DEFAULT GETUTCDATE(),
    UNIQUE (CityId, CategoryId)
);
Seeded: 900 rows (60 cities × 15 categories — all active)

4. Sellers
Business owners who buy pixel ad spaces.

SQL

CREATE TABLE dbo.Sellers (
    SellerId                INT IDENTITY(1,1)  PRIMARY KEY,
    PhoneNumber             NVARCHAR(15)       NOT NULL UNIQUE,
    PhoneVerified           BIT                NOT NULL DEFAULT 0,
    BusinessName            NVARCHAR(200)      NOT NULL,
    OwnerName               NVARCHAR(200)      NOT NULL,
    Email                   NVARCHAR(256)      NULL,
    PrimaryCity             NVARCHAR(100)      NULL,
    PrimaryCategory         NVARCHAR(100)      NULL,

    -- Authentication
    PasswordHash            NVARCHAR(500)      NULL,
    RefreshToken            NVARCHAR(500)      NULL,
    RefreshTokenExpiry      DATETIME2          NULL,
    LastLoginAt             DATETIME2          NULL,

    -- Status
    IsActive                BIT                NOT NULL DEFAULT 1,
    IsBanned                BIT                NOT NULL DEFAULT 0,
    BanReason               NVARCHAR(500)      NULL,
    BanExpiresAt            DATETIME2          NULL,
    TimeoutUntil            DATETIME2          NULL,

    -- Verification
    IsGstVerified           BIT                NOT NULL DEFAULT 0,
    IsIdentityVerified      BIT                NOT NULL DEFAULT 0,
    IsVerifiedBadge         BIT                NOT NULL DEFAULT 0,

    -- GST Info
    Gstin                   NVARCHAR(20)       NULL,
    GstBusinessName         NVARCHAR(300)      NULL,
    GstState                NVARCHAR(100)      NULL,

    -- Loyalty
    PointsBalance           INT                NOT NULL DEFAULT 0,
    ReferralCode            NVARCHAR(50)       NOT NULL UNIQUE,
    ReferredBySellerId      INT                NULL FK → Sellers (self),

    CreatedAt               DATETIME2          NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt               DATETIME2          NOT NULL DEFAULT GETUTCDATE(),

    CHECK (PointsBalance >= 0)
);
Auto-Update: UpdatedAt is updated by trigger trg_Sellers_UpdatedAt.

5. Admins
Backend admin users with role-based access.

SQL

CREATE TABLE dbo.Admins (
    AdminId             INT IDENTITY(1,1)  PRIMARY KEY,
    Email               NVARCHAR(256)      NOT NULL UNIQUE,
    PasswordHash        NVARCHAR(500)      NOT NULL,
    FullName            NVARCHAR(200)      NOT NULL,
    Role                NVARCHAR(30)       NOT NULL DEFAULT 'Admin',
    IsActive            BIT                NOT NULL DEFAULT 1,
    RefreshToken        NVARCHAR(500)      NULL,
    RefreshTokenExpiry  DATETIME2          NULL,
    TwoFactorSecret     NVARCHAR(100)      NULL,
    LastLoginAt         DATETIME2          NULL,
    LastLoginIp         NVARCHAR(50)       NULL,
    CreatedAt           DATETIME2          NOT NULL DEFAULT GETUTCDATE(),

    CHECK (Role IN ('SuperAdmin', 'Admin', 'Moderator'))
);
Seeded: 1 SuperAdmin (superadmin@adtowns.com — placeholder hash, MUST be replaced)

6. OtpRequests
OTP codes for phone verification (login, registration).

SQL

CREATE TABLE dbo.OtpRequests (
    OtpRequestId    INT IDENTITY(1,1)  PRIMARY KEY,
    PhoneNumber     NVARCHAR(15)       NOT NULL,
    OtpCode         NVARCHAR(10)       NOT NULL,  -- hashed
    Purpose         NVARCHAR(30)       NOT NULL,
    IsUsed          BIT                NOT NULL DEFAULT 0,
    AttemptCount    INT                NOT NULL DEFAULT 0,
    ExpiresAt       DATETIME2          NOT NULL,
    CreatedAt       DATETIME2          NOT NULL DEFAULT GETUTCDATE(),

    CHECK (Purpose IN ('Login', 'Register', 'PhoneChange', 'AdminAction')),
    CHECK (AttemptCount >= 0 AND AttemptCount <= 10)
);
7. FloorConfigurations
Defines floor structure and pricing per city + category.

SQL

CREATE TABLE dbo.FloorConfigurations (
    FloorConfigId       INT IDENTITY(1,1)  PRIMARY KEY,
    CityId              INT                NOT NULL FK → Cities,
    CategoryId          INT                NOT NULL FK → Categories,
    FloorNumber         INT                NOT NULL,  -- 1, 2, 3
    FloorName           NVARCHAR(50)       NOT NULL,  -- Platinum/Gold/Silver
    PixelsPerRow        INT                NOT NULL DEFAULT 10,
    TotalRows           INT                NOT NULL DEFAULT 1,
    BasePriceMonthly    DECIMAL(10,2)      NOT NULL,
    IsActive            BIT                NOT NULL DEFAULT 1,
    CreatedAt           DATETIME2          NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt           DATETIME2          NOT NULL DEFAULT GETUTCDATE(),

    UNIQUE (CityId, CategoryId, FloorNumber),
    CHECK (FloorNumber >= 1),
    CHECK (PixelsPerRow >= 1 AND PixelsPerRow <= 50)
);
Seeded: 2,700 rows (60 cities × 15 categories × 3 floors)

8. PricingRules
Discount rules based on duration (1, 3, 6, 12 months).

SQL

CREATE TABLE dbo.PricingRules (
    PricingRuleId   INT IDENTITY(1,1)  PRIMARY KEY,
    CityId          INT                NULL FK → Cities,      -- NULL = global
    CategoryId      INT                NULL FK → Categories,  -- NULL = global
    FloorNumber     INT                NOT NULL,
    DurationMonths  INT                NOT NULL,
    DiscountPercent DECIMAL(5,2)       NOT NULL DEFAULT 0,
    OverridePrice   DECIMAL(10,2)      NULL,
    GstPercent      DECIMAL(5,2)       NOT NULL DEFAULT 18.00,
    IsActive        BIT                NOT NULL DEFAULT 1,
    EffectiveFrom   DATETIME2          NOT NULL DEFAULT GETUTCDATE(),
    EffectiveTo     DATETIME2          NULL,

    CHECK (DurationMonths IN (1, 3, 6, 12))
);
Seeded Discounts:

1 month: 0% discount
3 months: 5% discount
6 months: 10% discount
12 months: 15% discount
9. Frames
Decorative frames for ad creatives (festival, weather, standard).

SQL

CREATE TABLE dbo.Frames (
    FrameId         INT IDENTITY(1,1)  PRIMARY KEY,
    FrameName       NVARCHAR(100)      NOT NULL,
    FrameType       NVARCHAR(20)       NOT NULL,
    ImageUrl        NVARCHAR(500)      NOT NULL,
    ThumbnailUrl    NVARCHAR(500)      NOT NULL,
    IsFree          BIT                NOT NULL DEFAULT 1,
    Price           DECIMAL(10,2)      NOT NULL DEFAULT 0,
    FestivalTag     NVARCHAR(50)       NULL,
    WeatherTag      NVARCHAR(50)       NULL,
    IsActive        BIT                NOT NULL DEFAULT 1,
    SortOrder       INT                NOT NULL DEFAULT 999,
    CreatedAt       DATETIME2          NOT NULL DEFAULT GETUTCDATE(),

    CHECK (FrameType IN ('Standard', 'Festival', 'Weather', 'Seasonal'))
);
Seeded: 13 frames (4 standard, 6 festival: Diwali/Holi/Christmas/NewYear/Eid/Pongal, 3 weather)

10. Pixels
Individual ad slots (the heart of the marketplace).

SQL

CREATE TABLE dbo.Pixels (
    PixelId             INT IDENTITY(1,1)  PRIMARY KEY,
    CityId              INT                NOT NULL FK → Cities,
    CategoryId          INT                NOT NULL FK → Categories,
    FloorNumber         INT                NOT NULL,
    RowLabel            NVARCHAR(5)        NOT NULL,
    Position            INT                NOT NULL,

    Status              NVARCHAR(20)       NOT NULL DEFAULT 'Available',
    LockedBySellerId    INT                NULL FK → Sellers,
    LockExpiresAt       DATETIME2          NULL,
    CurrentShopId       INT                NULL FK → Shops,    -- Circular FK

    IsGhost             BIT                NOT NULL DEFAULT 0,
    GhostImageUrl       NVARCHAR(500)      NULL,
    GhostRedirectUrl    NVARCHAR(500)      NULL,
    IsBiddable          BIT                NOT NULL DEFAULT 0,

    CreatedAt           DATETIME2          NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt           DATETIME2          NOT NULL DEFAULT GETUTCDATE(),

    UNIQUE (CityId, CategoryId, FloorNumber, RowLabel, Position),
    CHECK (Status IN ('Available', 'Locked', 'Sold', 'Ghost', 'Inactive')),
    CHECK (Position >= 1)
);
Status Lifecycle:

text

Available → Locked → Sold → (Available again on shop expiry)
                ↓
              (Lock expired)
                ↓
             Available
Seeded: 27,000 pixels (60 cities × 15 categories × 3 floors × 10 positions, all Status='Available')

11. Shops
Active rented pixel ad spaces (one shop = one paid pixel).

SQL

CREATE TABLE dbo.Shops (
    ShopId              INT IDENTITY(1,1)  PRIMARY KEY,
    SellerId            INT                NOT NULL FK → Sellers,
    PixelId             INT                NOT NULL FK → Pixels,

    -- Denormalized for query performance
    CityId              INT                NOT NULL FK → Cities,
    CategoryId          INT                NOT NULL FK → Categories,
    FloorNumber         INT                NOT NULL,
    RowLabel            NVARCHAR(5)        NOT NULL,
    Position            INT                NOT NULL,

    StartDate           DATETIME2          NOT NULL,
    EndDate             DATETIME2          NOT NULL,
    DurationMonths      INT                NOT NULL,

    Status              NVARCHAR(20)       NOT NULL DEFAULT 'Active',

    -- Admin actions
    DeactivatedAt       DATETIME2          NULL,
    DeactivatedBy       INT                NULL FK → Admins,
    DeactivationReason  NVARCHAR(500)      NULL,
    DeletedAt           DATETIME2          NULL,
    DeletedBy           INT                NULL FK → Admins,
    RefundAmount        DECIMAL(10,2)      NULL,

    CreatedAt           DATETIME2          NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt           DATETIME2          NOT NULL DEFAULT GETUTCDATE(),

    CHECK (Status IN ('Active', 'Expired', 'Suspended', 'Deleted')),
    CHECK (EndDate > StartDate),
    CHECK (DurationMonths IN (1, 3, 6, 12))
);
12. Ads
The actual creative content shown in a pixel.

SQL

CREATE TABLE dbo.Ads (
    AdId                INT IDENTITY(1,1)  PRIMARY KEY,
    ShopId              INT                NOT NULL FK → Shops,
    SellerId            INT                NOT NULL FK → Sellers,

    ImageUrl            NVARCHAR(500)      NULL,
    ImageThumbnailUrl   NVARCHAR(500)      NULL,
    FrameId             INT                NULL FK → Frames,

    BusinessName        NVARCHAR(200)      NOT NULL,
    Headline            NVARCHAR(60)       NULL,
    Description         NVARCHAR(100)      NULL,

    CtaType             NVARCHAR(20)       NOT NULL DEFAULT 'WhatsApp',
    WhatsAppNumber      NVARCHAR(15)       NULL,
    WebsiteUrl          NVARCHAR(500)      NULL,

    Status              NVARCHAR(20)       NOT NULL DEFAULT 'Draft',
    IsLive              BIT                NOT NULL DEFAULT 0,
    PublishedAt         DATETIME2          NULL,
    IsAiGenerated       BIT                NOT NULL DEFAULT 0,

    CreatedAt           DATETIME2          NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt           DATETIME2          NOT NULL DEFAULT GETUTCDATE(),

    CHECK (CtaType IN ('WhatsApp', 'Website', 'Both')),
    CHECK (Status IN ('Draft', 'Live', 'Paused', 'Archived'))
);
13. Cards
Premium larger ad units appearing between pixel floors.

SQL

CREATE TABLE dbo.Cards (
    CardId              INT IDENTITY(1,1)  PRIMARY KEY,
    CityId              INT                NOT NULL FK → Cities,
    CategoryId          INT                NOT NULL FK → Categories,
    AfterFloorNumber    INT                NOT NULL,  -- 1, 2, 3 (after which floor)
    Position            INT                NOT NULL DEFAULT 1,
    Status              NVARCHAR(20)       NOT NULL DEFAULT 'Available',
    CurrentShopId       INT                NULL FK → Shops,
    SellerId            INT                NULL FK → Sellers,
    BasePriceMonthly    DECIMAL(10,2)      NOT NULL,
    StartDate           DATETIME2          NULL,
    EndDate             DATETIME2          NULL,
    IsActive            BIT                NOT NULL DEFAULT 1,
    CreatedAt           DATETIME2          NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt           DATETIME2          NOT NULL DEFAULT GETUTCDATE(),

    UNIQUE (CityId, CategoryId, AfterFloorNumber, Position),
    CHECK (Status IN ('Available', 'Sold', 'Inactive'))
);
14. Offers
24-hour limited-time offers (8AM IST → next 8AM IST).

SQL

CREATE TABLE dbo.Offers (
    OfferId             INT IDENTITY(1,1)  PRIMARY KEY,
    ShopId              INT                NOT NULL FK → Shops,
    SellerId            INT                NOT NULL FK → Sellers,

    OfferHeadline       NVARCHAR(60)       NOT NULL,
    OfferDetails        NVARCHAR(100)      NULL,
    CtaType             NVARCHAR(20)       NOT NULL DEFAULT 'WhatsApp',
    CtaLink             NVARCHAR(500)      NULL,
    WhatsAppNumber      NVARCHAR(15)       NULL,

    HasLimit            BIT                NOT NULL DEFAULT 0,
    RedemptionLimit     INT                NULL,
    RedemptionsUsed     INT                NOT NULL DEFAULT 0,

    OfferDate           DATE               NOT NULL,
    StartsAt            DATETIME2          NOT NULL,  -- 8AM IST UTC
    ExpiresAt           DATETIME2          NOT NULL,  -- next 8AM IST UTC

    Status              NVARCHAR(20)       NOT NULL DEFAULT 'Scheduled',
    IsActive            BIT                NOT NULL DEFAULT 0,
    ActivatedAt         DATETIME2          NULL,
    EndedAt             DATETIME2          NULL,
    EndedBy             NVARCHAR(20)       NULL,

    CreatedAt           DATETIME2          NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt           DATETIME2          NOT NULL DEFAULT GETUTCDATE(),

    CHECK (CtaType IN ('WhatsApp', 'Website')),
    CHECK (Status IN ('Scheduled', 'Active', 'Paused', 'Ended', 'Expired', 'LimitReached')),
    CHECK (ExpiresAt > StartsAt),
    CHECK (RedemptionsUsed >= 0),
    CHECK (EndedBy IN ('Seller', 'System', 'Limit', 'Admin') OR EndedBy IS NULL)
);
8AM IST Window:

IST = UTC+5:30
Use TimeZoneInfo "India Standard Time" in C#
Always store in UTC, convert for display
15. Transactions
All payment records (Razorpay-backed).

SQL

CREATE TABLE dbo.Transactions (
    TransactionId       INT IDENTITY(1,1)  PRIMARY KEY,
    SellerId            INT                NOT NULL FK → Sellers,
    ShopId              INT                NULL FK → Shops,

    -- Razorpay
    RazorpayOrderId     NVARCHAR(100)      NULL,
    RazorpayPaymentId   NVARCHAR(100)      NULL,
    RazorpaySignature   NVARCHAR(500)      NULL,

    -- Amounts
    BaseAmount          DECIMAL(10,2)      NOT NULL,
    DiscountAmount      DECIMAL(10,2)      NOT NULL DEFAULT 0,
    PointsRedeemedAmt   DECIMAL(10,2)      NOT NULL DEFAULT 0,
    PointsRedeemed      INT                NOT NULL DEFAULT 0,
    TaxableAmount       DECIMAL(10,2)      NOT NULL,
    GstAmount           DECIMAL(10,2)      NOT NULL,
    TotalAmount         DECIMAL(10,2)      NOT NULL,

    TransactionType     NVARCHAR(30)       NOT NULL,
    Status              NVARCHAR(20)       NOT NULL DEFAULT 'Pending',

    FailureReason       NVARCHAR(500)      NULL,
    RefundAmount        DECIMAL(10,2)      NULL,
    RefundedAt          DATETIME2          NULL,
    RefundReason        NVARCHAR(500)      NULL,

    SellerGstin         NVARCHAR(20)       NULL,
    InvoiceId           INT                NULL FK → Invoices,  -- Circular FK

    CreatedAt           DATETIME2          NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt           DATETIME2          NOT NULL DEFAULT GETUTCDATE(),

    CHECK (TransactionType IN ('NewPixel', 'Renewal', 'Upgrade', 'Card', 'BidWin', 'FramePurchase')),
    CHECK (Status IN ('Pending', 'Success', 'Failed', 'Refunded', 'PartialRefund'))
);
16. Invoices
GST-compliant invoices with PDF generation.

SQL

CREATE TABLE dbo.Invoices (
    InvoiceId       INT IDENTITY(1,1)  PRIMARY KEY,
    InvoiceNumber   NVARCHAR(50)       NOT NULL UNIQUE,  -- INV-2025-000001
    TransactionId   INT                NOT NULL FK → Transactions,
    SellerId        INT                NOT NULL FK → Sellers,

    InvoiceDate     DATE               NOT NULL,
    Description     NVARCHAR(500)      NOT NULL,

    BaseAmount      DECIMAL(10,2)      NOT NULL,
    DiscountAmount  DECIMAL(10,2)      NOT NULL DEFAULT 0,
    TaxableAmount   DECIMAL(10,2)      NOT NULL,
    CgstAmount      DECIMAL(10,2)      NOT NULL DEFAULT 0,
    SgstAmount      DECIMAL(10,2)      NOT NULL DEFAULT 0,
    IgstAmount      DECIMAL(10,2)      NOT NULL DEFAULT 0,
    TotalAmount     DECIMAL(10,2)      NOT NULL,

    BuyerGstin      NVARCHAR(20)       NULL,
    BuyerGstName    NVARCHAR(300)      NULL,
    BuyerState      NVARCHAR(100)      NULL,

    PdfUrl          NVARCHAR(500)      NULL,

    CreatedAt       DATETIME2          NOT NULL DEFAULT GETUTCDATE()
);
GST Logic:

Same state as Maharashtra → CgstAmount + SgstAmount (each = GstAmount/2)
Different state → IgstAmount (full)
Both seller's GSTIN and state are snapshotted at invoice time
17. Impressions
Every buyer interaction with a pixel.

SQL

CREATE TABLE dbo.Impressions (
    ImpressionId    BIGINT IDENTITY(1,1)  NOT NULL,
    ShopId          INT                   NOT NULL FK → Shops,
    PixelId         INT                   NOT NULL FK → Pixels,
    SellerId        INT                   NOT NULL FK → Sellers,
    OfferId         INT                   NULL FK → Offers,

    BuyerPhone      NVARCHAR(15)          NULL,
    BuyerIpHash     NVARCHAR(100)         NULL,
    CityDetected    NVARCHAR(100)         NULL,
    DeviceType      NVARCHAR(20)          NULL,

    ImpressionType  NVARCHAR(20)          NOT NULL,
    OccurredAt      DATETIME2             NOT NULL DEFAULT GETUTCDATE(),

    PRIMARY KEY CLUSTERED (ImpressionId, OccurredAt),
    CHECK (ImpressionType IN ('View', 'Hover', 'WhatsAppClick', 'WebsiteClick', 'OfferClick')),
    CHECK (DeviceType IN ('Mobile', 'Desktop', 'Tablet') OR DeviceType IS NULL)
);
Note: Composite primary key (ImpressionId + OccurredAt) supports future date partitioning.

18. DailyStats
Pre-aggregated daily metrics per shop (for fast dashboard loads).

SQL

CREATE TABLE dbo.DailyStats (
    DailyStatId             INT IDENTITY(1,1)  PRIMARY KEY,
    ShopId                  INT                NOT NULL FK → Shops,
    SellerId                INT                NOT NULL FK → Sellers,
    StatDate                DATE               NOT NULL,

    TotalViews              INT                NOT NULL DEFAULT 0,
    TotalHovers             INT                NOT NULL DEFAULT 0,
    TotalWhatsAppClicks     INT                NOT NULL DEFAULT 0,
    TotalWebsiteClicks      INT                NOT NULL DEFAULT 0,
    TotalOfferClicks        INT                NOT NULL DEFAULT 0,
    UniqueVisitors          INT                NOT NULL DEFAULT 0,

    CreatedAt               DATETIME2          NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt               DATETIME2          NOT NULL DEFAULT GETUTCDATE(),

    UNIQUE (ShopId, StatDate)
);
Updated by: sp_AggregateDailyStats (runs hourly).

19. ReferralLinks
Tracks who referred whom.

SQL

CREATE TABLE dbo.ReferralLinks (
    ReferralLinkId      INT IDENTITY(1,1)  PRIMARY KEY,
    ReferrerSellerId    INT                NOT NULL FK → Sellers,
    RefereeSellerId     INT                NOT NULL UNIQUE FK → Sellers,
    ReferralCode        NVARCHAR(50)       NOT NULL,
    ReferrerIsSeller    BIT                NOT NULL DEFAULT 1,
    PointsAwarded       INT                NOT NULL DEFAULT 0,
    AwardedAt           DATETIME2          NULL,
    CreatedAt           DATETIME2          NOT NULL DEFAULT GETUTCDATE(),

    CHECK (ReferrerSellerId <> RefereeSellerId)
);
Points Logic:

Seller refers another Seller → 50 points
Non-seller refers a Seller → 25 points
20. PointLedger
Append-only points transaction log.

SQL

CREATE TABLE dbo.PointLedger (
    LedgerId        INT IDENTITY(1,1)  PRIMARY KEY,
    SellerId        INT                NOT NULL FK → Sellers,
    PointsChange    INT                NOT NULL,
    BalanceAfter    INT                NOT NULL CHECK (>= 0),
    TransactionType NVARCHAR(50)       NOT NULL,
    ReferenceId     INT                NULL,
    ReferenceType   NVARCHAR(50)       NULL,
    Description     NVARCHAR(300)      NOT NULL,
    CreatedAt       DATETIME2          NOT NULL DEFAULT GETUTCDATE(),

    CHECK (TransactionType IN ('Referral', 'Welcome', 'Redemption', 'Expiry', 'Bonus', 'Adjustment'))
);
21. BidSessions
Auctions for premium pixels.

SQL

CREATE TABLE dbo.BidSessions (
    BidSessionId        INT IDENTITY(1,1)  PRIMARY KEY,
    PixelId             INT                NOT NULL FK → Pixels,
    CityId              INT                NOT NULL FK → Cities,
    CategoryId          INT                NOT NULL FK → Categories,
    FloorNumber         INT                NOT NULL,
    StartTime           DATETIME2          NOT NULL,
    EndTime             DATETIME2          NOT NULL,
    MinimumBid          DECIMAL(10,2)      NOT NULL,
    BidIncrement        DECIMAL(10,2)      NOT NULL DEFAULT 100,
    WinnerSellerId      INT                NULL FK → Sellers,
    WinningBidAmount    DECIMAL(10,2)      NULL,
    Status              NVARCHAR(20)       NOT NULL DEFAULT 'Active',
    CreatedAt           DATETIME2          NOT NULL DEFAULT GETUTCDATE(),

    CHECK (Status IN ('Active', 'Ended', 'Cancelled')),
    CHECK (EndTime > StartTime),
    CHECK (MinimumBid > 0 AND BidIncrement > 0)
);
22. BidRecords
Individual bid placements.

SQL

CREATE TABLE dbo.BidRecords (
    BidRecordId     INT IDENTITY(1,1)  PRIMARY KEY,
    BidSessionId    INT                NOT NULL FK → BidSessions,
    SellerId        INT                NOT NULL FK → Sellers,
    BidAmount       DECIMAL(10,2)      NOT NULL CHECK (> 0),
    IsWinning       BIT                NOT NULL DEFAULT 0,
    IsWithdrawn     BIT                NOT NULL DEFAULT 0,
    BidPlacedAt     DATETIME2          NOT NULL DEFAULT GETUTCDATE()
);
23. KycRecords
GST and Identity verification records.

SQL

CREATE TABLE dbo.KycRecords (
    KycRecordId     INT IDENTITY(1,1)  PRIMARY KEY,
    SellerId        INT                NOT NULL FK → Sellers,
    KycType         NVARCHAR(20)       NOT NULL,
    DocumentType    NVARCHAR(50)       NULL,
    DocumentUrl     NVARCHAR(500)      NULL,
    DocumentNumber  NVARCHAR(50)       NULL,
    Gstin           NVARCHAR(20)       NULL,
    GstApiResponse  NVARCHAR(MAX)      NULL,
    Status          NVARCHAR(20)       NOT NULL DEFAULT 'Pending',
    ReviewedBy      INT                NULL FK → Admins,
    ReviewedAt      DATETIME2          NULL,
    RejectionReason NVARCHAR(500)      NULL,
    ExpiresAt       DATETIME2          NULL,
    CreatedAt       DATETIME2          NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt       DATETIME2          NOT NULL DEFAULT GETUTCDATE(),

    CHECK (KycType IN ('GST', 'Identity')),
    CHECK (Status IN ('Pending', 'Approved', 'Rejected', 'Expired'))
);
24. Buyers
Anonymous buyer profiles (phone-based).

SQL

CREATE TABLE dbo.Buyers (
    BuyerId             INT IDENTITY(1,1)  PRIMARY KEY,
    PhoneNumber         NVARCHAR(15)       NULL,
    PhoneVerified       BIT                NOT NULL DEFAULT 0,
    DeviceFingerprint   NVARCHAR(200)      NULL,
    CityId              INT                NULL FK → Cities,
    LastSeenAt          DATETIME2          NOT NULL DEFAULT GETUTCDATE(),
    TotalVisits         INT                NOT NULL DEFAULT 1 CHECK (>= 1),
    OptedInWhatsApp     BIT                NOT NULL DEFAULT 0,
    OptedInAt           DATETIME2          NULL,
    CreatedAt           DATETIME2          NOT NULL DEFAULT GETUTCDATE()
);
25. Reports
Buyer-submitted reports against ads.

SQL

CREATE TABLE dbo.Reports (
    ReportId        INT IDENTITY(1,1)  PRIMARY KEY,
    ShopId          INT                NOT NULL FK → Shops,
    PixelId         INT                NOT NULL FK → Pixels,
    ReporterPhone   NVARCHAR(15)       NULL,
    ReporterIpHash  NVARCHAR(100)      NULL,
    ReportReason    NVARCHAR(50)       NOT NULL,
    ReportDetails   NVARCHAR(500)      NULL,
    Status          NVARCHAR(20)       NOT NULL DEFAULT 'Open',
    ResolvedBy      INT                NULL FK → Admins,
    ResolvedAt      DATETIME2          NULL,
    ResolutionNote  NVARCHAR(500)      NULL,
    CreatedAt       DATETIME2          NOT NULL DEFAULT GETUTCDATE(),

    CHECK (Status IN ('Open', 'InReview', 'Resolved', 'Dismissed')),
    CHECK (ReportReason IN ('MisleadingAd', 'FakeOffer', 'WrongContact',
                            'InappropriateContent', 'ScamBusiness', 'Other'))
);
26. AuditLogs (IMMUTABLE)
Append-only log with cryptographic chain.

SQL

CREATE TABLE dbo.AuditLogs (
    AuditLogId      BIGINT IDENTITY(1,1)  PRIMARY KEY,
    ActorType       NVARCHAR(20)          NOT NULL,
    ActorId         INT                   NULL,
    ActorIp         NVARCHAR(50)          NULL,
    ImpersonatingId INT                   NULL,
    Action          NVARCHAR(100)         NOT NULL,
    EntityType      NVARCHAR(50)          NOT NULL,
    EntityId        NVARCHAR(50)          NULL,
    OldValues       NVARCHAR(MAX)         NULL,
    NewValues       NVARCHAR(MAX)         NULL,
    AdditionalData  NVARCHAR(MAX)         NULL,
    LogHash         NVARCHAR(100)         NOT NULL,  -- SHA-256
    PreviousLogHash NVARCHAR(100)         NULL,
    OccurredAt      DATETIME2             NOT NULL DEFAULT GETUTCDATE(),

    CHECK (ActorType IN ('Admin', 'Seller', 'System'))
);
Hash Chain:

text

LogHash = SHA256(ActorId | Action | EntityType | EntityId | OccurredAt | NewValues | PreviousLogHash)
IMPORTANT: A trigger blocks UPDATE and DELETE on this table (see Triggers section).

27. TrafficSnapshots
30-second snapshots of live user traffic.

SQL

CREATE TABLE dbo.TrafficSnapshots (
    SnapshotId      BIGINT IDENTITY(1,1)  PRIMARY KEY,
    SnapshotTime    DATETIME2             NOT NULL DEFAULT GETUTCDATE(),
    ActiveUsers     INT                   NOT NULL DEFAULT 0 CHECK (>= 0),
    CityBreakdown   NVARCHAR(MAX)         NULL,  -- JSON
    PageBreakdown   NVARCHAR(MAX)         NULL   -- JSON
);
28. HourlyTrafficStats
Aggregated hourly traffic for heatmaps.

SQL

CREATE TABLE dbo.HourlyTrafficStats (
    StatId          INT IDENTITY(1,1)  PRIMARY KEY,
    StatDate        DATE               NOT NULL,
    HourOfDay       INT                NOT NULL CHECK (>= 0 AND <= 23),
    AverageUsers    INT                NOT NULL DEFAULT 0 CHECK (>= 0),
    PeakUsers       INT                NOT NULL DEFAULT 0 CHECK (>= 0),
    CityId          INT                NULL FK → Cities,

    UNIQUE (StatDate, HourOfDay, CityId)
);
29. Notifications
In-app notifications for sellers.

SQL

CREATE TABLE dbo.Notifications (
    NotificationId      INT IDENTITY(1,1)  PRIMARY KEY,
    SellerId            INT                NOT NULL FK → Sellers,
    Title               NVARCHAR(200)      NOT NULL,
    Body                NVARCHAR(500)      NOT NULL,
    NotificationType    NVARCHAR(50)       NOT NULL,
    ReferenceId         INT                NULL,
    ReferenceType       NVARCHAR(50)       NULL,
    IsRead              BIT                NOT NULL DEFAULT 0,
    ReadAt              DATETIME2          NULL,
    CreatedAt           DATETIME2          NOT NULL DEFAULT GETUTCDATE(),

    CHECK (NotificationType IN ('Impression', 'Expiry', 'Points', 'Offer', 'System', 'Bid', 'KYC'))
);
Legacy: Registrations
DO NOT TOUCH. Pre-launch lead capture table — feeds /api/register endpoint.

SQL

CREATE TABLE dbo.Registrations (
    Id                  UNIQUEIDENTIFIER  PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
    ReferenceId         NVARCHAR(9)       NOT NULL UNIQUE,  -- AT-XXXXXX
    Name                NVARCHAR(100)     NOT NULL,
    Business            NVARCHAR(200)     NULL,
    Phone               NVARCHAR(15)      NOT NULL UNIQUE,
    Email               NVARCHAR(150)     NOT NULL UNIQUE,  -- lowercased
    City                NVARCHAR(100)     NOT NULL,
    Type                NVARCHAR(MAX)     NOT NULL,         -- Vendor/Buyer/Referrer
    Message             NVARCHAR(1000)    NULL,
    TermsAccepted       BIT               NOT NULL CHECK (= 1),
    IpAddress           VARCHAR(50)       NULL,
    UserAgent           NVARCHAR(MAX)     NULL,
    SubmittedAt         DATETIME2         NOT NULL DEFAULT GETUTCDATE(),
    EmailSentToAdmin    BIT               NOT NULL DEFAULT 0,
    EmailSentToUser     BIT               NOT NULL DEFAULT 0,
    EmailSentAt         DATETIME2         NULL
);
Stored Procedures
sp_CompletePixelPurchase
Atomically completes a pixel purchase after Razorpay verification.

SQL

EXEC dbo.sp_CompletePixelPurchase
    @TransactionId      = 1001,
    @RazorpayPaymentId  = 'pay_xxx',
    @RazorpaySignature  = 'sig_xxx',
    @PixelId            = 5,
    @SellerId           = 42,
    @DurationMonths     = 1,
    @StartDate          = '2026-05-12 00:00:00',
    @PointsRedeemed     = 0
Returns: { ShopId INT, Result NVARCHAR }

Steps performed atomically:

Marks transaction as 'Success'
Creates Shop record
Updates Pixel to 'Sold'
Creates draft Ad
Deducts points if redeemed
Links shop to transaction
sp_GetRevenueReport
Admin analytics — revenue grouped by day/month/year.

SQL

EXEC dbo.sp_GetRevenueReport
    @CityId     = NULL,        -- optional filter
    @StateCode  = NULL,        -- optional filter
    @CategoryId = NULL,        -- optional filter
    @FromDate   = '2026-01-01',
    @ToDate     = '2026-12-31',
    @GroupBy    = 'day'        -- 'day' | 'month' | 'year'
Returns: { Period, CityName, StateName, CategoryName, TransactionCount, BaseRevenue, GstCollected, TotalRevenue, AvgTransactionValue, UniqueSellers }

sp_AggregateDailyStats
Hourly job that aggregates impressions into DailyStats (UPSERT).

SQL

EXEC dbo.sp_AggregateDailyStats @TargetDate = '2026-05-12'
-- @TargetDate is optional, defaults to today UTC
sp_ExpireShops
Daily nightly job to expire shops past their EndDate.

SQL

EXEC dbo.sp_ExpireShops
Actions:

Marks Shop.Status = 'Expired'
Frees Pixel.Status = 'Available'
Archives associated Ads (IsLive = 0)
sp_ExpireOffers
Per-minute job to expire offers past ExpiresAt.

SQL

EXEC dbo.sp_ExpireOffers
sp_ReleaseExpiredLocks
Per-2-minute job to release stale pixel locks (Redis fallback).

SQL

EXEC dbo.sp_ReleaseExpiredLocks
sp_GetSellerDashboard
Optimized seller home page payload.

SQL

EXEC dbo.sp_GetSellerDashboard @SellerId = 42
Returns 2 result sets:

All active shops with today/yesterday stats, ad info, active offer info
Summary totals (today views, today WhatsApp, points balance, unread notifications)
sp_GetPixelGrid
Optimized buyer grid payload.

SQL

EXEC dbo.sp_GetPixelGrid @CityId = 1, @CategoryId = 1
Returns 2 result sets:

All pixels with ad data, seller verification, active offer, floor info
All cards for the same city/category
Triggers
trg_AuditLogs_PreventModification
Purpose: Enforce immutability of audit log.

SQL

CREATE TRIGGER trg_AuditLogs_PreventModification
ON dbo.AuditLogs
AFTER UPDATE, DELETE
AS
BEGIN
    ROLLBACK TRANSACTION;
    RAISERROR('AuditLogs are immutable. UPDATE and DELETE are not allowed.', 16, 1);
END;
trg_Sellers_UpdatedAt
trg_Shops_UpdatedAt
trg_Pixels_UpdatedAt
trg_Ads_UpdatedAt
trg_Offers_UpdatedAt
Purpose: Auto-update UpdatedAt timestamp on row modification.

SQL

CREATE TRIGGER trg_Sellers_UpdatedAt
ON dbo.Sellers
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.Sellers
    SET UpdatedAt = GETUTCDATE()
    WHERE SellerId IN (SELECT SellerId FROM inserted);
END;
Pre-Seeded Data
Categories (15)
ID	Name	Icon
1	Food & Restaurants	🍕
2	Health & Medical	💊
3	Fashion & Clothing	👗
4	Electronics & Tech	💻
5	Home & Furniture	🏠
6	Beauty & Salons	💅
7	Education & Coaching	📚
8	Travel & Transport	✈
9	Sports & Fitness	🏋
10	Entertainment & Events	🎭
11	Jewellery & Accessories	💍
12	Real Estate	🏢
13	Automobiles	🚗
14	Groceries & Supermarket	🛒
15	Pets & Animals	🐾
Cities (60)
Top 10: Mumbai, Delhi, Bangalore, Hyderabad, Ahmedabad, Chennai, Kolkata, Surat, Pune, Jaipur

Other 50 Metros: Lucknow, Kanpur, Nagpur, Indore, Thane, Bhopal, Visakhapatnam, Patna, Vadodara, Ghaziabad, Ludhiana, Agra, Nashik, Faridabad, Meerut, Rajkot, Varanasi, Srinagar, Aurangabad, Dhanbad, Amritsar, Allahabad, Ranchi, Howrah, Coimbatore, Jabalpur, Gwalior, Vijayawada, Jodhpur, Madurai, Raipur, Kota, Chandigarh, Guwahati, Solapur, Hubli, Tiruchirappalli, Bareilly, Mysore, Tiruppur, Gurgaon, Aligarh, Jalandhar, Noida, Bhubaneswar, Kochi, Dehradun, Mangalore, Navi Mumbai, Thiruvananthapuram

Pixel Inventory
text

Total Pixels:           27,000
  ├── Per City:            450
  ├── Per Category:         30
  └── Per Floor:            10

By City Tier:
  ├── Top 10:            4,500 pixels
  └── Other Metros:     22,500 pixels

All status: 'Available' (ready to sell)
Frame Templates (13)
4 Standard frames (2 free, 2 paid)
6 Festival frames (Diwali, Holi, Christmas, NewYear, Eid, Pongal)
3 Weather frames (Summer, Monsoon, Winter)
Default SuperAdmin
Email: superadmin@adtowns.com
Password: PLACEHOLDER — MUST BE REPLACED with bcrypt hash before production
Pricing Strategy
Tier-Based Floor Pricing (per month, INR)
Tier	Cities	Floor 1 (Platinum)	Floor 2 (Gold)	Floor 3 (Silver)
Tier 1	Top 10 Metros	₹2,500	₹1,500	₹800
Tier 2	Other 50 Metros	₹1,500	₹900	₹500
Duration Discounts (Global)
Duration	Discount
1 month	0%
3 months	5%
6 months	10%
12 months	15%
GST
Standard rate: 18%
Same state (Maharashtra): 9% CGST + 9% SGST
Different state: 18% IGST
Total Revenue Potential
If all 27,000 pixels sold at base price (1 month):

text

Tier 1: 4,500 × avg ₹1,600 = ₹72,00,000
Tier 2: 22,500 × avg ₹967  = ₹2,17,57,500
─────────────────────────────────────────
TOTAL POTENTIAL:            ₹2,89,57,500/month
                            (~₹2.89 Crore)
Critical Constraints
Status Enums (CHECK Constraints)
Table	Column	Allowed Values
Pixels	Status	Available, Locked, Sold, Ghost, Inactive
Shops	Status	Active, Expired, Suspended, Deleted
Ads	Status	Draft, Live, Paused, Archived
Ads	CtaType	WhatsApp, Website, Both
Offers	Status	Scheduled, Active, Paused, Ended, Expired, LimitReached
Offers	CtaType	WhatsApp, Website
Offers	EndedBy	Seller, System, Limit, Admin (or NULL)
Transactions	Type	NewPixel, Renewal, Upgrade, Card, BidWin, FramePurchase
Transactions	Status	Pending, Success, Failed, Refunded, PartialRefund
OtpRequests	Purpose	Login, Register, PhoneChange, AdminAction
KycRecords	KycType	GST, Identity
KycRecords	Status	Pending, Approved, Rejected, Expired
Reports	Status	Open, InReview, Resolved, Dismissed
Reports	ReportReason	MisleadingAd, FakeOffer, WrongContact, InappropriateContent, ScamBusiness, Other
Notifications	Type	Impression, Expiry, Points, Offer, System, Bid, KYC
Admins	Role	SuperAdmin, Admin, Moderator
AuditLogs	ActorType	Admin, Seller, System
Cards	Status	Available, Sold, Inactive
BidSessions	Status	Active, Ended, Cancelled
Frames	FrameType	Standard, Festival, Weather, Seasonal
PointLedger	TransactionType	Referral, Welcome, Redemption, Expiry, Bonus, Adjustment
Numeric Constraints
Constraint	Rule
Sellers.PointsBalance	>= 0
Pixels.Position	>= 1
FloorConfigurations.FloorNumber	>= 1
FloorConfigurations.PixelsPerRow	1-50
FloorConfigurations.BasePriceMonthly	>= 0
PricingRules.DurationMonths	IN (1, 3, 6, 12)
PricingRules.DiscountPercent	0-100
PricingRules.GstPercent	0-30
Shops.DurationMonths	IN (1, 3, 6, 12)
Shops.EndDate	> StartDate
Offers.ExpiresAt	> StartsAt
Offers.RedemptionsUsed	>= 0
Transactions.All amounts	>= 0
Invoices.All amounts	>= 0
BidSessions.MinimumBid	> 0
BidSessions.BidIncrement	> 0
BidSessions.EndTime	> StartTime
BidRecords.BidAmount	> 0
Buyers.TotalVisits	>= 1
HourlyTrafficStats.HourOfDay	0-23
Relational Constraints
Constraint	Rule
ReferralLinks	ReferrerSellerId ≠ RefereeSellerId (no self-refer)
ReferralLinks	UNIQUE (RefereeSellerId) — each seller referred only once
Pixels	UNIQUE (CityId, CategoryId, FloorNumber, RowLabel, Position)
FloorConfigurations	UNIQUE (CityId, CategoryId, FloorNumber)
CityCategories	UNIQUE (CityId, CategoryId)
Cards	UNIQUE (CityId, CategoryId, AfterFloorNumber, Position)
DailyStats	UNIQUE (ShopId, StatDate)
HourlyTrafficStats	UNIQUE (StatDate, HourOfDay, CityId)
Invoices	UNIQUE (InvoiceNumber)
Sellers	UNIQUE (PhoneNumber, ReferralCode)
Admins	UNIQUE (Email)
Index Strategy
Cluster Index (Primary Keys)
All tables have clustered primary keys on IDENTITY columns.

Exception: Impressions has composite PK on (ImpressionId, OccurredAt) for partition support.

Performance Indexes
Pixels (most queried table):

SQL

IX_Pixels_CityCategory     (CityId, CategoryId, FloorNumber, Status)
IX_Pixels_Status           (Status)
IX_Pixels_CurrentShop      (CurrentShopId)
IX_Pixels_LockExpiry       (LockExpiresAt) WHERE LockExpiresAt IS NOT NULL
Shops:

SQL

IX_Shops_Seller            (SellerId, Status)
IX_Shops_Pixel             (PixelId, Status)
IX_Shops_Status            (Status, EndDate)
IX_Shops_EndDate           (EndDate) WHERE Status = 'Active'  -- expiry job
IX_Shops_CityCategory      (CityId, CategoryId, Status)
Impressions (high-write table):

SQL

IX_Impressions_Shop_Date   (ShopId, OccurredAt DESC)
IX_Impressions_Seller_Date (SellerId, OccurredAt DESC)
IX_Impressions_Type        (ImpressionType, OccurredAt DESC)
IX_Impressions_Pixel       (PixelId, OccurredAt DESC)
Offers:

SQL

IX_Offers_ShopId       (ShopId, IsActive)
IX_Offers_Active       (IsActive, ExpiresAt)         -- expiry job
IX_Offers_OfferDate    (OfferDate, Status)
IX_Offers_Seller       (SellerId, OfferDate)
Transactions:

SQL

IX_Transactions_Seller     (SellerId, CreatedAt DESC)
IX_Transactions_Razorpay   (RazorpayOrderId) WHERE NOT NULL
IX_Transactions_Status     (Status, CreatedAt DESC)
IX_Transactions_Shop       (ShopId)
AuditLogs (read-heavy for compliance):

SQL

IX_AuditLogs_Actor   (ActorType, ActorId, OccurredAt DESC)
IX_AuditLogs_Entity  (EntityType, EntityId, OccurredAt DESC)
IX_AuditLogs_Date    (OccurredAt DESC)
Transaction Requirements
The following operations MUST be wrapped in a transaction:

1. Pixel Purchase (Critical)
text

BEGIN TRANSACTION
  → Update Transaction status to Success
  → Insert Shop record
  → Update Pixel status to Sold
  → Insert draft Ad record
  → Deduct points from Sellers (if redeemed)
  → Insert PointLedger entry (if redeemed)
  → Link Shop to Transaction
COMMIT TRANSACTION
Use: sp_CompletePixelPurchase (already implemented)

2. Floor Upgrade
text

BEGIN TRANSACTION
  → Calculate pro-rata refund
  → Insert new Transaction
  → Update old Shop to 'Expired'
  → Insert new Shop on different floor
  → Update Pixel to point to new Shop
  → Generate new Invoice
COMMIT TRANSACTION
3. Shop Deletion (Admin)
text

BEGIN TRANSACTION
  → Update Shop status to 'Deleted'
  → Update Pixel status to 'Available'
  → Update Pixel.CurrentShopId to NULL
  → Insert refund Transaction record
  → Insert AuditLog entry
COMMIT TRANSACTION
4. Bid Win Settlement
text

BEGIN TRANSACTION
  → Mark BidSession as 'Ended'
  → Mark winning BidRecord as IsWinning
  → Mark all other BidRecords as IsWinning=0
  → Create Razorpay order for winner
  → Send notifications to all bidders
COMMIT TRANSACTION
5. Referral Points Award
text

BEGIN TRANSACTION
  → Update Sellers.PointsBalance += amount
  → Insert PointLedger entry
  → Update ReferralLinks.AwardedAt
  → Insert Notification for referrer
COMMIT TRANSACTION
6. KYC Approval
text

BEGIN TRANSACTION
  → Update KycRecords.Status to 'Approved'
  → Update Sellers.IsGstVerified or IsIdentityVerified
  → If both verified, set Sellers.IsVerifiedBadge = 1
  → Insert AuditLog entry
  → Insert Notification for seller
COMMIT TRANSACTION
Best Practices for EF Core Mapping
1. Use Fluent API (Not Data Annotations)
csharp

public class SellerConfiguration : IEntityTypeConfiguration<Seller>
{
    public void Configure(EntityTypeBuilder<Seller> builder)
    {
        builder.ToTable("Sellers", "dbo");
        builder.HasKey(s => s.SellerId);

        builder.Property(s => s.SellerId)
               .HasColumnName("SellerId")
               .UseIdentityColumn();

        builder.Property(s => s.PhoneNumber)
               .HasColumnName("PhoneNumber")
               .HasMaxLength(15)
               .IsRequired();

        builder.HasIndex(s => s.PhoneNumber)
               .IsUnique()
               .HasDatabaseName("UQ_Sellers_Phone");

        builder.Property(s => s.PointsBalance)
               .HasColumnName("PointsBalance")
               .HasDefaultValue(0);

        builder.HasOne(s => s.ReferredBySeller)
               .WithMany()
               .HasForeignKey(s => s.ReferredBySellerId)
               .OnDelete(DeleteBehavior.NoAction);

        // Match exact CHECK constraint from DB
        builder.ToTable(t => t.HasCheckConstraint(
            "CK_Sellers_Points",
            "[PointsBalance] >= 0"));
    }
}
2. Disable EF Migrations Globally
In Program.cs:

csharp

// Do NOT call dbContext.Database.Migrate() or EnsureCreated()
// The schema is managed externally
3. Use FromSqlRaw for Stored Procedures
csharp

public async Task<List<DashboardDto>> GetSellerDashboardAsync(int sellerId)
{
    return await _context.Set<DashboardDto>()
        .FromSqlRaw("EXEC dbo.sp_GetSellerDashboard @SellerId = {0}", sellerId)
        .ToListAsync();
}
4. Always Use Transactions for Multi-Table Writes
csharp

await using var transaction = await _context.Database.BeginTransactionAsync();
try
{
    // ... multiple SaveChangesAsync calls
    await transaction.CommitAsync();
}
catch
{
    await transaction.RollbackAsync();
    throw;
}
5. Respect the Circular FK Order
When inserting:

Insert Shop first (Pixel.CurrentShopId is NULL)
Then update Pixel.CurrentShopId to the new ShopId
When deleting:

Update Pixel.CurrentShopId to NULL first
Then mark Shop as Deleted
Quick Reference: Common Queries
Get available pixels for a city + category + floor
SQL

SELECT * FROM dbo.Pixels
WHERE CityId = @CityId
  AND CategoryId = @CategoryId
  AND FloorNumber = @FloorNumber
  AND Status = 'Available'
ORDER BY RowLabel, Position;
Get a seller's revenue this month
SQL

SELECT SUM(TotalAmount) AS MonthlyRevenue
FROM dbo.Transactions
WHERE SellerId = @SellerId
  AND Status = 'Success'
  AND CreatedAt >= DATEFROMPARTS(YEAR(GETUTCDATE()), MONTH(GETUTCDATE()), 1);
Get today's active offers in Mumbai
SQL

SELECT o.*, s.CityId, s.CategoryId
FROM dbo.Offers o
INNER JOIN dbo.Shops s ON o.ShopId = s.ShopId
WHERE s.CityId = (SELECT CityId FROM dbo.Cities WHERE CityName = 'Mumbai')
  AND o.IsActive = 1
  AND o.ExpiresAt > GETUTCDATE();
Get city fill percentage
SQL

SELECT
    c.CityName,
    COUNT(*) AS TotalPixels,
    SUM(CASE WHEN p.Status = 'Sold' THEN 1 ELSE 0 END) AS SoldPixels,
    CAST(SUM(CASE WHEN p.Status = 'Sold' THEN 1.0 ELSE 0 END) / COUNT(*) * 100 AS DECIMAL(5,2)) AS FillPercent
FROM dbo.Pixels p
INNER JOIN dbo.Cities c ON p.CityId = c.CityId
GROUP BY c.CityName
ORDER BY FillPercent DESC;
Document Version
Version	Date	Changes
1.0	2026-05-11	Initial version with all 29 tables, 8 SPs, 6 triggers
Contact
For database changes or schema questions:

Lead Developer: Kalash Tiwari
Repo: github.com/sirkalashh/Ad_Towns
Database script: database-creation.sql
