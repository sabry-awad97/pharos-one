---
name: Epic/PRD
about: Cloud-Connected SaaS Platform for PharOS One
title: "[Epic] Cloud-Connected SaaS Platform - Auto-Update, Subscriptions & Feature Flags"
labels: "type:epic, priority:high, hitl, layer:service, layer:ui, layer:schema"
assignees: ""
---

# Cloud-Connected SaaS Platform for PharOS One

**Product Requirements Document (PRD)**

**Version**: 2.0 (Complete)  
**Date**: 2026-03-28  
**Status**: ✅ Ready for Implementation  
**Timeline**: 16-18 weeks (Phases 0-5)  
**Priority**: High (enables SaaS business model)

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Overview & Business Value](#overview--business-value)
3. [Key Architectural Decisions](#key-architectural-decisions)
4. [User Stories](#user-stories)
5. [Architecture Overview](#architecture-overview)
6. [Egyptian Payment Methods](#egyptian-payment-methods)
7. [Implementation Phases](#implementation-phases)
8. [Future Phases](#future-phases)
9. [Success Metrics](#success-metrics)
10. [Cost & Revenue Projections](#cost--revenue-projections)
11. [Acceptance Criteria](#acceptance-criteria)
12. [Technical Specifications](#technical-specifications)
13. [Security & Compliance](#security--compliance)
14. [Risks & Mitigation](#risks--mitigation)
15. [Notes & Assumptions](#notes--assumptions)

---

## 🎯 Executive Summary

Transform PharOS One from a standalone desktop application into a cloud-connected SaaS platform with auto-updates, subscription management, and remote feature control.

### What We're Building

A comprehensive cloud-connected SaaS platform with five core features:

1. **Auto-Update System** - Seamless updates via GitHub releases + Cloudflare proxy
2. **Cloud Authentication** - Supabase auth for pharmacy owners (subscription management only)
3. **Subscription Management** - Dual payment system (Stripe + Egyptian payment methods)
4. **Feature Flags** - Remote feature control via Cloudflare KV + Supabase
5. **Admin Panel** - Web application for manual payment approvals

### Current State vs Target State

**Current State**: Desktop-only pharmacy management system with local PostgreSQL and local user authentication for pharmacy staff.

**Target State**: Hybrid architecture where:

- **Pharmacy staff** continue using local authentication (existing system - NO CHANGES)
- **Pharmacy owner** creates ONE cloud account (Supabase) to manage subscription
- **All pharmacy data** stays local (offline-first architecture)
- **Cloud services** provide: updates, licensing, feature flags, payment processing

### Business Value

- Enable SaaS business model with recurring revenue (400-1500 EGP/month per pharmacy)
- Distribute updates seamlessly to all users without manual intervention
- Control feature access based on subscription tier
- Support Egyptian market with local payment methods (Vodafone Cash, Instapay, etc.)
- Reduce support burden with automatic updates
- Prepare foundation for future multi-branch operations

### Key Numbers

- **Timeline**: 16-18 weeks (4-4.5 months)
- **Target Market**: Egyptian pharmacies
- **Pricing**: 400-1500 EGP/month ($8-30 USD)
- **Expected Adoption**: 80-90% will use manual payment methods
- **Infrastructure Cost**: $0-50/month (scales with users)
- **Team Size**: 1-2 developers

---

## 🎯 Overview & Business Value

### Problem Statement

PharOS One currently operates as a standalone desktop application with no cloud connectivity. This creates several challenges:

1. **Update Distribution**: Manual updates require users to download and install new versions
2. **No Recurring Revenue**: One-time purchase model limits business growth
3. **Feature Control**: Cannot enable/disable features remotely
4. **License Management**: No way to enforce subscription requirements
5. **Market Limitations**: Cannot serve Egyptian market without local payment methods

### Solution Overview

Build a cloud-connected SaaS platform that maintains the offline-first philosophy while adding cloud capabilities for updates, licensing, and payments.

**Core Principles**:

- ✅ **Offline-First**: App works for 7 days without internet
- ✅ **No Breaking Changes**: Existing staff authentication remains unchanged
- ✅ **Dual Authentication**: Separate local (staff) and cloud (owner) auth systems
- ✅ **Dual Payment**: Automated (Stripe) + Manual (Egyptian methods)
- ✅ **Privacy-Focused**: All pharmacy data stays local

### Target Users

1. **Pharmacy Owners** (Primary)
   - Create ONE cloud account per pharmacy
   - Manage subscription and billing
   - Activate devices (1-5+ based on plan)
   - View license status and features

2. **Pharmacy Staff** (Secondary)
   - Continue using local authentication (NO CHANGES)
   - Benefit from automatic updates
   - Use features based on pharmacy's subscription
   - No cloud account needed

3. **Developers/Admins** (Internal)
   - Publish updates to different channels
   - Control feature rollout via flags
   - Manage manual payment approvals
   - Monitor adoption metrics

---

## 🔑 Key Architectural Decisions

### Decision 1: Dual Authentication Model ✅ CONFIRMED

**The Architecture**:

Two completely separate authentication systems that never interact:

**1. Local Authentication (Existing - NO CHANGES)**

- **Who**: Pharmacy staff (cashiers, pharmacists, managers)
- **Purpose**: Daily app usage and operations
- **Storage**: Local PostgreSQL (existing `users`, `sessions`, `roles` tables)
- **Login Method**: Username/password (existing UI)
- **Cloud Account**: Not needed - staff never interact with cloud services

**2. Cloud Authentication (New - Owner Only)**

- **Who**: ONE pharmacy owner per pharmacy
- **Purpose**: Subscription management ONLY
- **Storage**: Supabase (`cloud_owners` table)
- **Login Method**: Email/password or OAuth (Google, Microsoft)
- **UI Location**: Settings panel, completely separate from staff login

**Why This Design?**

✅ **Staff don't need email addresses** - Simple username/password works  
✅ **Simpler onboarding** - Staff can start working immediately  
✅ **Better privacy** - Staff data stays completely local  
✅ **Clear separation** - Billing is separate from daily operations  
✅ **Matches business model** - Owner pays, staff use the app  
✅ **No confusion** - Two distinct systems with different purposes

**Confidence**: 100% - This is the correct approach

---

### Decision 2: Dual Payment System ✅ CONFIRMED

**The Challenge**: Most Egyptian pharmacy owners don't have credit cards or cannot use Stripe.

**The Solution**: Offer two payment paths:

**Path A: Automated Payment (Stripe)**

- Credit cards, international payments
- Instant activation
- No manual work required
- Expected adoption: 10-20% in Egypt

**Path B: Manual Payment (Egyptian Methods)**

- Vodafone Cash ⭐ (most popular)
- Etisalat Cash
- Instapay
- Bank Transfer
- Fawry
- Owner pays → calls admin → admin approves → license activated
- Expected adoption: 80-90% in Egypt

**Why Both?**

✅ **Market Reality**: Credit card penetration is low in Egypt  
✅ **User Preference**: Egyptians prefer mobile wallets and bank transfers  
✅ **Lower Fees**: Manual methods cost 0-2% vs Stripe's 3%  
✅ **Higher Adoption**: Reach 80-90% of potential customers  
✅ **Flexibility**: Let users choose their preferred method

**Confidence**: 95% - Essential for Egyptian market success

---

### Decision 3: One License per Pharmacy ✅ CONFIRMED

**The Model**:

- Owner creates ONE Supabase account (their email)
- License is linked to pharmacy, not individual users
- All devices in pharmacy share the same license
- Device limits based on plan (1, 3, or 5+ devices)

**Why This Design?**

✅ **Simpler billing** - One subscription per pharmacy  
✅ **Matches business model** - Pharmacy pays, not individual staff  
✅ **Easier management** - Owner controls all devices  
✅ **Clear pricing** - Device limits are easy to understand

**Confidence**: 95%

---

### Decision 4: Offline-First License Validation ✅ CONFIRMED

**The Approach**:

- Cache license status locally with 7-day grace period
- Validate online every 24 hours when connected
- App works fully offline during grace period
- Background validation doesn't block UI

**Why This Design?**

✅ **Business Continuity**: Pharmacy must work during internet outages  
✅ **User Experience**: No interruptions during normal operations  
✅ **Realistic**: Internet in Egypt can be unreliable  
✅ **Balanced**: 7 days is enough for temporary outages, not abuse

**Confidence**: 100% - Non-negotiable requirement

---

### Decision 5: Hybrid Cloudflare + Supabase ✅ CONFIRMED

**The Architecture**:

- **Cloudflare Workers**: Updater proxy, feature flags, license checks (fast, global edge)
- **Supabase**: Owner accounts, subscriptions, Stripe integration (easy auth, database)

**Why Both?**

✅ **Speed**: Cloudflare edge network for fast global delivery  
✅ **Convenience**: Supabase for easy auth and database management  
✅ **Cost**: Both have generous free tiers  
✅ **Reliability**: Industry-proven services  
✅ **Best of Both**: Speed where needed, convenience where it matters

**Confidence**: 90%

---

### Decision 6: GitHub Releases for Distribution ✅ CONFIRMED

**The Approach**:

- Public releases repository (separate from private source code)
- Cloudflare Worker proxies GitHub API (hides token, adds caching)
- Signed binaries for security

**Why GitHub?**

✅ **Free**: No hosting costs for binaries  
✅ **Reliable**: Industry-standard, 99.9% uptime  
✅ **Familiar**: Developers already know GitHub  
✅ **Secure**: Built-in release management and signing

**Confidence**: 95%

---

### Decision 7: Subscription Plans (Egyptian Market) ✅ CONFIRMED

| Plan         | Price (EGP/month) | Devices | Target Audience    |
| ------------ | ----------------- | ------- | ------------------ |
| Free         | 0                 | 1       | Trial/basic POS    |
| Starter      | 400               | 1       | Small pharmacy     |
| Professional | 700 ⭐            | 3       | Main tier (target) |
| Multi-Branch | 1500              | 5+      | Pharmacy chains    |

**Additional Pricing**:

- Monthly billing (default)
- Quarterly: 10% discount
- Annual: 20-25% discount
- Setup fee: 1000 EGP (one-time)

**Why This Pricing?**

✅ **Market Research**: Aligned with Egyptian pharmacy budgets  
✅ **Clear Value Ladder**: Easy upgrade path  
✅ **Professional Focus**: 700 EGP is the sweet spot  
✅ **Competitive**: Comparable to other pharmacy software

**Confidence**: 85% - May adjust based on market feedback

---

### Decision 8: No Multi-Branch Sync in Phase 1-5 ✅ CONFIRMED

**The Decision**: Defer multi-branch sync to Phase 7 (future)

**Why Defer?**

✅ **Complexity**: Sync engine is a major undertaking (8-12 weeks)  
✅ **Premature**: Only 10-20% of pharmacies need this initially  
✅ **Focus**: Better to nail single-pharmacy experience first  
✅ **Build When Needed**: Wait for 5+ customers requesting it

**What We Build Instead**: Each pharmacy operates independently with its own local database

**Confidence**: 100% - Correct prioritization

---

## 🎭 User Stories

### Pharmacy Owner (ONE Cloud Account per Pharmacy)

**Account Management**

**As a** pharmacy owner  
**I want** to create ONE cloud account with my email  
**So that** I can manage my pharmacy's subscription and license

---

**As a** pharmacy owner  
**I want** to choose between credit card (Stripe) or manual payment (Vodafone Cash, etc.)  
**So that** I can pay using my preferred method

---

**As a** pharmacy owner  
**I want** to subscribe to a monthly or yearly plan (400-1500 EGP/month)  
**So that** I can unlock premium features for my pharmacy

---

**As a** pharmacy owner  
**I want** to activate my subscription on my pharmacy's devices  
**So that** all my staff can use premium features

---

**Device Management**

**As a** pharmacy owner  
**I want** to add multiple devices to my subscription (based on plan)  
**So that** I can use the app on multiple computers in my pharmacy

---

**As a** pharmacy owner  
**I want** to see which devices are activated  
**So that** I can manage my device limit

---

**Subscription Management**

**As a** pharmacy owner  
**I want** to manage my subscription (upgrade, downgrade, cancel)  
**So that** I have control over my costs

---

**As a** pharmacy owner  
**I want** to see my license status and expiry date in the app  
**So that** I know when to renew

---

**As a** pharmacy owner  
**I want** to receive email notifications before my subscription expires  
**So that** I don't lose access unexpectedly

---

### Pharmacy Staff (Local Users - No Cloud Account Needed)

**Authentication**

**As a** pharmacy staff member (cashier, pharmacist)  
**I want** to log in with my local username/password (existing system)  
**So that** I can use the app without needing a cloud account

---

**Updates**

**As a** pharmacy staff member  
**I want** the app to update automatically in the background  
**So that** I always have the latest features and bug fixes

---

**As a** pharmacy staff member  
**I want** to be notified when an update is available  
**So that** I can choose when to restart and apply it

---

**Offline Support**

**As a** pharmacy staff member  
**I want** the app to work offline even if the subscription check fails  
**So that** I can continue serving customers during internet outages

---

**Feature Access**

**As a** pharmacy staff member  
**I want** to see which features are available in my current plan  
**So that** I know what I can use

---

**As a** pharmacy staff member  
**I want** premium features to be clearly marked  
**So that** I know which features require the owner to upgrade

---

### Developer/Admin

**Update Management**

**As a** developer  
**I want** to publish updates to different channels (stable, beta, dev)  
**So that** I can test new features before releasing to all users

---

**As a** developer  
**I want** to see update adoption metrics  
**So that** I know how many users are on each version

---

**Feature Control**

**As a** developer  
**I want** to control feature rollout via feature flags  
**So that** I can enable features gradually or for specific users

---

**License Management**

**As a** developer  
**I want** to revoke licenses for non-paying users  
**So that** I can enforce subscription requirements

---

**As a** developer  
**I want** to grant trial periods (14 days) or promotional access  
**So that** I can onboard new users and run marketing campaigns

---

**Payment Management**

**As an** admin  
**I want** to view pending manual payment requests  
**So that** I can approve them after verifying payment

---

**As an** admin  
**I want** to approve/reject payment requests with notes  
**So that** I can manage manual payments efficiently

---

**As an** admin  
**I want** to configure payment methods (account numbers, instructions)  
**So that** users know where to send payments

---

## 📐 Architecture Overview

### High-Level System Design

```
┌─────────────────────────────────────────────────────────────┐
│                    Tauri Desktop App                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Local Auth   │  │ Local Data   │  │ UI Layer     │     │
│  │ (Staff)      │  │ (PostgreSQL) │  │ (React)      │     │
│  │ EXISTING ✅  │  │ EXISTING ✅  │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │             │
│  ┌──────┴──────────────────┴──────────────────┴──────┐    │
│  │         Cloud Services Integration Layer          │    │
│  │  - Updater Client (NEW)                           │    │
│  │  - Supabase Client (Owner Account Only - NEW)     │    │
│  │  - License Validator (NEW)                        │    │
│  │  - Feature Flag Client (NEW)                      │    │
│  └───────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Cloud Infrastructure                       │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ Cloudflare       │  │ Supabase         │               │
│  │ Workers          │  │                  │               │
│  │                  │  │ - Auth           │               │
│  │ - Updater Proxy  │  │   (Owner Only)   │               │
│  │ - Feature Flags  │  │ - Subscriptions  │               │
│  │ - License Check  │  │ - Licenses       │               │
│  │                  │  │ - Edge Functions │               │
│  └────────┬─────────┘  └────────┬─────────┘               │
│           │                     │                          │
│           ↓                     ↓                          │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ GitHub Releases  │  │ Stripe           │               │
│  │ (Binaries)       │  │ (Payments)       │               │
│  └──────────────────┘  └──────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

### Authentication Flow (CRITICAL CLARIFICATION)

```
┌─────────────────────────────────────────────────────────┐
│                  TWO SEPARATE AUTH SYSTEMS              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. LOCAL AUTH (Existing - NO CHANGES)                 │
│     ┌─────────────────────────────────────┐           │
│     │ Pharmacy Staff Login                │           │
│     │ - Cashier: username/password        │           │
│     │ - Pharmacist: username/password     │           │
│     │ - Manager: username/password        │           │
│     │                                     │           │
│     │ Stored in: Local PostgreSQL        │           │
│     │ Purpose: Daily app usage           │           │
│     └─────────────────────────────────────┘           │
│                                                         │
│  2. CLOUD AUTH (New - Owner Only)                      │
│     ┌─────────────────────────────────────┐           │
│     │ Pharmacy Owner Account              │           │
│     │ - ONE account per pharmacy          │           │
│     │ - Email/password (Supabase)         │           │
│     │ - Optional: Google/Microsoft OAuth  │           │
│     │                                     │           │
│     │ Stored in: Supabase                │           │
│     │ Purpose: Subscription management    │           │
│     └─────────────────────────────────────┘           │
│                                                         │
│  ⚠️ IMPORTANT: These systems are INDEPENDENT          │
│     - Staff never see cloud auth                       │
│     - Owner uses cloud auth ONLY for billing          │
│     - License is linked to pharmacy, not users        │
└─────────────────────────────────────────────────────────┘
```

### Layers Involved

**Schema/Database**:

- **Supabase** (new): `cloud_owners`, `subscriptions`, `licenses`, `feature_flags`, `payment_requests`, `payment_methods`
- **Local PostgreSQL** (existing): `users`, `sessions`, `roles` (staff auth - NO CHANGES)
- **Local PostgreSQL** (new): `license_cache`, `feature_flag_cache` (offline support)

**Domain/Service**:

- `UpdaterService` - Check and apply updates
- `CloudOwnerAuthService` - Supabase authentication (owner only)
- `SubscriptionService` - Stripe integration and license validation
- `PaymentRequestService` - Manual payment workflow
- `FeatureFlagService` - Remote feature control
- `LicenseCacheService` - Offline license validation
- **NO CHANGES** to existing `UserService`, `SessionService` (staff auth)

**UI/Component**:

- `UpdateNotification` - Update available dialog
- `OwnerAccountDialog` - Sign in/sign up for owner (NEW)
- `SubscriptionPanel` - Manage subscription, view plan (owner only)
- `PaymentMethodSelector` - Choose Stripe or manual payment
- `ManualPaymentInstructions` - Show payment details and reference code
- `PaymentStatusChecker` - Poll for manual payment approval
- `FeatureGate` - Wrapper component for premium features
- `LicenseStatus` - Display license info in settings
- **NO CHANGES** to existing login screen (staff login)

**Integration**:

- Tauri updater plugin
- Supabase JS client (owner auth only)
- Stripe Checkout (via Supabase Edge Functions)
- Cloudflare Workers API

---

## 💳 Egyptian Payment Methods

### Problem Statement

**Challenge**: Not all Egyptian pharmacy owners have credit cards or can use Stripe.

**Market Reality**:

- Credit card penetration is low in Egypt
- Most people use mobile wallets (Vodafone Cash, Etisalat Cash)
- Bank transfers and Instapay are popular
- Stripe adoption is limited (10-20% of potential customers)

**Solution**: Offer multiple payment methods with manual approval workflow.

### Dual Payment System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Pharmacy Owner                         │
│                                                         │
│  Chooses Payment Method:                               │
│  ┌─────────────┐  ┌─────────────────────────────┐    │
│  │   Stripe    │  │   Manual Payment            │    │
│  │  (Credit    │  │  - Vodafone Cash ⭐         │    │
│  │   Card)     │  │  - Etisalat Cash            │    │
│  │             │  │  - Instapay                 │    │
│  │  Automatic  │  │  - Bank Transfer            │    │
│  │  Instant ✅ │  │  - Fawry                    │    │
│  └──────┬──────┘  │                             │    │
│         │         │  Manual Approval Required   │    │
│         │         └──────────┬──────────────────┘    │
└─────────┼────────────────────┼──────────────────────┘
          │                    │
          ↓                    ↓
┌─────────────────┐  ┌─────────────────────────────┐
│ Stripe Webhook  │  │  Payment Request Created    │
│ → Auto Activate │  │  → Notification to Admin    │
└─────────────────┘  └──────────┬──────────────────┘
                                │
                                ↓
                     ┌─────────────────────────────┐
                     │     Admin Panel (Web)       │
                     │                             │
                     │  1. View pending requests   │
                     │  2. Owner calls admin       │
                     │  3. Verify payment received │
                     │  4. Approve manually        │
                     │  5. License activated ✅    │
                     └─────────────────────────────┘
```

### Payment Methods Overview

| Method            | Popularity           | Transaction Fee | Settlement Time | Adoption (Egypt) |
| ----------------- | -------------------- | --------------- | --------------- | ---------------- |
| **Vodafone Cash** | ⭐⭐⭐⭐⭐ Very High | ~1-2%           | Instant         | 40-50%           |
| **Etisalat Cash** | ⭐⭐⭐⭐ High        | ~1-2%           | Instant         | 20-30%           |
| **Instapay**      | ⭐⭐⭐⭐⭐ Very High | Free            | Instant         | 20-30%           |
| **Bank Transfer** | ⭐⭐⭐ Medium        | Free            | 1-2 days        | 10-15%           |
| **Fawry**         | ⭐⭐⭐⭐ High        | ~2-3%           | Instant         | 10-15%           |
| **Stripe**        | ⭐⭐ Low (Egypt)     | ~3%             | Instant         | 10-20%           |

**Recommendation**: Support all methods! Each pharmacy owner has preferences.

### User Flow: Manual Payment

**Step 1: Owner Chooses Manual Payment**

In Desktop App:

```
┌─────────────────────────────────────┐
│  Choose Payment Method              │
├─────────────────────────────────────┤
│  ○ Credit Card (Stripe)             │
│  ● Manual Payment                   │
│                                     │
│  Select Method:                     │
│  ☑ Vodafone Cash                    │
│  ☐ Etisalat Cash                    │
│  ☐ Instapay                         │
│  ☐ Bank Transfer                    │
│  ☐ Fawry                            │
│                                     │
│  [Continue]                         │
└─────────────────────────────────────┘
```

**Step 2: Payment Instructions Shown**

```
┌─────────────────────────────────────┐
│  Payment Instructions               │
├─────────────────────────────────────┤
│  Method: Vodafone Cash              │
│                                     │
│  Send payment to:                   │
│  📱 01234567890                     │
│                                     │
│  Amount: 700 EGP                    │
│  Reference: PH-12345                │
│                                     │
│  After payment:                     │
│  1. Call us: 01234567890            │
│  2. Provide reference: PH-12345     │
│  3. We'll activate within 1 hour    │
│                                     │
│  [I've Made Payment]                │
└─────────────────────────────────────┘
```

**Step 3: Payment Request Created**

Stored in Supabase `payment_requests` table with:

- Unique reference code (PH-12345)
- Owner info (name, phone, email)
- Payment method and amount
- Status: pending
- Expires in 24 hours

**Step 4: Admin Notification**

Admin receives:

- Email notification with request details
- SMS notification (optional)
- Admin panel shows pending request

**Step 5: Owner Calls Admin**

Owner: "Hi, I just sent 700 EGP via Vodafone Cash, reference PH-12345"

Admin:

1. Checks Vodafone Cash account
2. Verifies payment received
3. Opens admin panel
4. Approves request

**Step 6: Manual Approval (Admin Panel)**

```
┌─────────────────────────────────────────────────────────┐
│  Pending Payment Requests                               │
├─────────────────────────────────────────────────────────┤
│  Reference: PH-12345                                    │
│  Pharmacy: Al Shifa Pharmacy                            │
│  Owner: Ahmed Mohamed (01234567890)                     │
│  Method: Vodafone Cash                                  │
│  Amount: 700 EGP                                        │
│  Plan: Professional (3 devices)                         │
│  Requested: 2026-03-28 10:30 AM                         │
│                                                         │
│  ✅ Payment Verified                                    │
│  📝 Notes: [Received via Vodafone Cash]                │
│                                                         │
│  [Approve & Activate]  [Reject]                         │
└─────────────────────────────────────────────────────────┘
```

**Step 7: License Activated**

When admin clicks "Approve":

1. License created in database
2. Owner receives email: "Your subscription is now active!"
3. Desktop app checks license → activated ✅
4. Owner can now use premium features

### Database Schema

```sql
-- Payment requests table
CREATE TABLE payment_requests (
  id TEXT PRIMARY KEY,
  owner_id TEXT REFERENCES cloud_owners(id),
  pharmacy_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  payment_method TEXT NOT NULL, -- 'stripe', 'vodafone_cash', 'etisalat_cash', etc.
  amount_egp DECIMAL(10,2) NOT NULL,
  plan TEXT NOT NULL, -- 'starter', 'professional', 'multi_branch'
  reference_code TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL, -- 'pending', 'approved', 'rejected', 'expired'
  payment_proof_url TEXT, -- Optional: screenshot upload
  admin_notes TEXT,
  approved_by TEXT,
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP -- Auto-expire after 24 hours
);

-- Payment methods configuration
CREATE TABLE payment_methods (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL, -- 'Vodafone Cash', 'Etisalat Cash', etc.
  type TEXT NOT NULL, -- 'mobile_wallet', 'bank_transfer', 'instapay'
  enabled BOOLEAN DEFAULT true,
  account_number TEXT, -- Admin's Vodafone Cash number, bank account, etc.
  instructions TEXT, -- Payment instructions for users
  display_order INTEGER
);

-- Audit log for manual approvals
CREATE TABLE payment_approvals_log (
  id TEXT PRIMARY KEY,
  payment_request_id TEXT REFERENCES payment_requests(id),
  admin_user TEXT NOT NULL,
  action TEXT NOT NULL, -- 'approved', 'rejected'
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Admin Panel (Separate Web App)

**Purpose**: Manage manual payment approvals

**Tech Stack**:

- **Frontend**: React (reuse components from desktop app)
- **Backend**: Supabase (same database)
- **Auth**: Supabase Auth (admin login)
- **Hosting**: Vercel/Netlify (free tier)
- **URL**: `admin.pharos.com` or `admin.pharos-one.com`

**Features**:

1. **Dashboard**: Pending requests count, today's revenue, approval stats
2. **Requests List**: Filter by status, payment method, date
3. **Request Details**: View all info, approve/reject with notes
4. **Payment Methods**: Configure admin's account numbers and instructions
5. **Reports**: Daily/monthly revenue, payment method breakdown
6. **Notifications**: Email/SMS when new request arrives
7. **Audit Log**: Track all approvals/rejections for accounting

**Admin Panel Structure**:

```
admin-panel/
├── src/
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── PendingRequests.tsx
│   │   ├── ApprovedRequests.tsx
│   │   ├── PaymentMethods.tsx
│   │   └── Reports.tsx
│   ├── components/
│   │   ├── RequestCard.tsx
│   │   ├── ApprovalDialog.tsx
│   │   └── PaymentMethodForm.tsx
│   └── lib/
│       ├── supabase.ts
│       └── notifications.ts
└── package.json
```

### Security & Fraud Prevention

**Measures to Prevent Abuse**:

1. **Reference Code Verification**
   - Unique code per request (PH-12345)
   - Owner must provide code when calling
   - Code expires after 24 hours

2. **Phone Verification**
   - Owner must call from registered phone number
   - Or provide verification code sent to their phone

3. **Payment Proof** (optional)
   - Owner can upload screenshot of payment
   - Helps admin verify faster

4. **Expiry Time**
   - Payment requests expire after 24 hours
   - Prevents old requests from being reused

5. **Audit Log**
   - Every approval/rejection logged
   - Track who approved what and when

6. **Rate Limiting**
   - Max 3 pending requests per owner
   - Prevents spam

### Notification System

**When Payment Request Created**:

Email to Admin:

```
Subject: New Payment Request - PH-12345

Pharmacy: Al Shifa Pharmacy
Owner: Ahmed Mohamed
Phone: 01234567890
Method: Vodafone Cash
Amount: 700 EGP
Plan: Professional

View in Admin Panel:
https://admin.pharos.com/requests/PH-12345
```

SMS to Admin (optional):

```
New payment: 700 EGP via Vodafone Cash
Ref: PH-12345
Phone: 01234567890
```

**When Payment Approved**:

Email to Owner:

```
Subject: Subscription Activated! 🎉

Your Professional plan is now active!

Plan: Professional (700 EGP/month)
Devices: 3
Valid until: 2026-04-28

You can now use all premium features.

Questions? Call us: 01234567890
```

### Comparison: Stripe vs Manual

| Aspect                | Stripe      | Manual Payment  |
| --------------------- | ----------- | --------------- |
| **Setup Time**        | 1 hour      | 30 minutes      |
| **Activation**        | Instant     | 1-24 hours      |
| **Admin Work**        | None        | Manual approval |
| **Transaction Fee**   | ~3%         | 0-2%            |
| **User Preference**   | Low (Egypt) | High (Egypt)    |
| **Fraud Risk**        | Low         | Medium          |
| **Scalability**       | High        | Medium          |
| **Expected Adoption** | 10-20%      | 80-90%          |

**Recommendation**: Offer both! Let users choose their preferred method.

### Implementation Timeline

**Phase 3A: Manual Payment Support** (+1 week to Phase 3)

- Add payment method selector in desktop app
- Create manual payment instructions UI
- Implement reference code generation
- Add payment status polling (check every 30 seconds)
- Create Supabase Edge Functions for payment requests
- Set up email notifications

**Phase 3B: Admin Panel** (2-3 weeks, can be parallel with Phase 4)

- Create new React app for admin panel
- Implement admin authentication (Supabase)
- Build dashboard with pending requests
- Create approval/rejection workflow
- Add payment methods configuration
- Implement reports and analytics
- Deploy to Vercel/Netlify

**Total Additional Time**: +3-4 weeks to Phase 3

---

## 🗺️ Implementation Phases

### Phase 0: Foundation & Infrastructure (Week 1-2)

**Goal**: Set up cloud services and development workflow

**Tasks**:

- [ ] #TBD - Create public GitHub releases repository
- [ ] #TBD - Set up Cloudflare Workers account and deploy updater proxy
- [ ] #TBD - Set up Supabase project and configure auth (owner accounts only)
- [ ] #TBD - Create Stripe account and configure products/prices (EGP currency)
- [ ] #TBD - Design Supabase database schema (owners, subscriptions, licenses, flags, payment_requests)
- [ ] #TBD - Set up CI/CD for automated releases with signing
- [ ] #TBD - Create development environment variables and secrets management
- [ ] #TBD - Document dual auth architecture for team

**Deliverables**:

- GitHub releases repo ready
- Cloudflare Workers deployed
- Supabase project configured
- Stripe account set up
- Database schema designed
- CI/CD pipeline working

**Estimated Time**: 1-2 weeks  
**Blockers**: None  
**Risk**: Low - mostly configuration  
**Cost**: $0 (free tiers)

---

### Phase 1: Auto-Update System (Week 3-5)

**Goal**: Enable automatic updates via GitHub releases

**Backend (Rust)**:

- [ ] #TBD - Add `tauri-plugin-updater` dependency
- [ ] #TBD - Configure updater in `tauri.conf.json`
- [ ] #TBD - Generate signing keys for update verification
- [ ] #TBD - Create Tauri command to check for updates manually
- [ ] #TBD - Implement update channel selection (stable/beta/dev)

**Cloudflare Worker**:

- [ ] #TBD - Create updater proxy worker
- [ ] #TBD - Implement GitHub API integration with token auth
- [ ] #TBD - Add caching layer (5-minute cache)
- [ ] #TBD - Support channel-based release filtering
- [ ] #TBD - Map GitHub assets to Tauri updater format

**Frontend (React)**:

- [ ] #TBD - Create `UpdateNotification` component
- [ ] #TBD - Add "Check for Updates" button in settings
- [ ] #TBD - Show update progress and release notes
- [ ] #TBD - Handle update errors gracefully

**Testing**:

- [ ] #TBD - Test update flow from v0.1.0 to v0.2.0
- [ ] #TBD - Test update cancellation
- [ ] #TBD - Test offline behavior (no update check)
- [ ] #TBD - Test signature verification failure
- [ ] #TBD - Test rollback on failed update

**Deliverables**:

- Working auto-update system
- Update notifications in UI
- Signed releases on GitHub
- Cloudflare proxy serving updates

**Estimated Time**: 2-3 weeks  
**Blockers**: Phase 0 complete  
**Risk**: Medium - Tauri updater can be tricky

---

### Phase 2: Cloud Authentication (Owner Only) (Week 6-8)

**Goal**: Enable pharmacy owners to create cloud accounts for subscription management

**Supabase Setup**:

- [ ] #TBD - Create `cloud_owners` table (separate from local users)
- [ ] #TBD - Configure email auth with verification
- [ ] #TBD - Set up OAuth providers (Google, Microsoft)
- [ ] #TBD - Create RLS policies for data security
- [ ] #TBD - Set up email templates (verification, password reset)

**Backend (Rust)**:

- [ ] #TBD - Create `CloudOwnerAuthService` for Supabase integration
- [ ] #TBD - Add Tauri commands: `owner_sign_in`, `owner_sign_up`, `owner_sign_out`
- [ ] #TBD - Implement secure token storage (OS keychain)
- [ ] #TBD - Add device fingerprinting for license validation
- [ ] #TBD - Create local cache table for owner session

**Frontend (React)**:

- [ ] #TBD - Install `@supabase/supabase-js` client
- [ ] #TBD - Create `OwnerAccountDialog` component (sign in/sign up)
- [ ] #TBD - Add "Owner Account" section in settings (separate from staff login)
- [ ] #TBD - Show owner info (email, plan, devices)
- [ ] #TBD - Implement OAuth flow (open browser, handle callback)
- [ ] #TBD - Add clear UI separation: "Staff Login" vs "Owner Account"

**Testing**:

- [ ] #TBD - Test email sign up with verification
- [ ] #TBD - Test password reset flow
- [ ] #TBD - Test OAuth sign in (Google, Microsoft)
- [ ] #TBD - Test token refresh and expiry
- [ ] #TBD - Test offline behavior (cached session)
- [ ] #TBD - Verify staff login still works independently

**Deliverables**:

- Owner can create cloud account
- Email verification working
- OAuth sign-in functional
- Clear UI separation from staff login

**Estimated Time**: 2-3 weeks  
**Blockers**: Phase 0 complete  
**Risk**: Low - Supabase auth is well-documented

---

### Phase 3: Subscription Management (Week 9-12)

**Goal**: Enable paid subscriptions with license validation

#### Phase 3A: Stripe + Manual Payment Support (Week 9-11)

**Supabase Schema**:

- [ ] #TBD - Create `subscriptions` table (owner_id, plan, status, stripe_id)
- [ ] #TBD - Create `licenses` table (owner_id, device_id, activated_at, expires_at)
- [ ] #TBD - Create `subscription_plans` table (name, features, price_egp, device_limit)
- [ ] #TBD - Create `payment_requests` table (for manual payments)
- [ ] #TBD - Create `payment_methods` table (configuration)
- [ ] #TBD - Create `payment_approvals_log` table (audit trail)

**Supabase Edge Functions**:

- [ ] #TBD - Create `create-checkout-session` function (Stripe Checkout, EGP)
- [ ] #TBD - Create `stripe-webhook` function (handle payment events)
- [ ] #TBD - Create `validate-license` function (check subscription status)
- [ ] #TBD - Create `activate-device` function (register device with license)
- [ ] #TBD - Create `create-payment-request` function (manual payments)
- [ ] #TBD - Create `approve-payment-request` function (admin approval)

**Backend (Rust)**:

- [ ] #TBD - Create `SubscriptionService` for license validation
- [ ] #TBD - Create `PaymentRequestService` for manual payments
- [ ] #TBD - Add Tauri commands: `get_subscription`, `create_checkout`, `validate_license`
- [ ] #TBD - Add Tauri commands: `create_payment_request`, `check_payment_status`
- [ ] #TBD - Implement local license cache with 7-day grace period
- [ ] #TBD - Add background task to validate license every 24 hours
- [ ] #TBD - Create device fingerprint generator (OS + hardware info)

**Frontend (React)**:

- [ ] #TBD - Create `SubscriptionPanel` component
- [ ] #TBD - Create `PaymentMethodSelector` component
- [ ] #TBD - Create `ManualPaymentInstructions` component
- [ ] #TBD - Create `PaymentStatusChecker` component (polling)
- [ ] #TBD - Show current plan, features, and device count
- [ ] #TBD - Add "Upgrade Plan" button (opens Stripe Checkout or manual flow)
- [ ] #TBD - Show license status (active, expired, grace period)
- [ ] #TBD - Add "Manage Subscription" link (Stripe portal)
- [ ] #TBD - Display pricing in EGP (400, 700, 1500 EGP/month)

**Stripe Configuration**:

- [ ] #TBD - Create products: Free, Starter, Professional, Multi-Branch
- [ ] #TBD - Create prices: Monthly and yearly for each plan (EGP)
- [ ] #TBD - Configure webhook endpoint
- [ ] #TBD - Set up customer portal for self-service

**Notification Setup**:

- [ ] #TBD - Set up email notifications (SendGrid or Supabase)
- [ ] #TBD - Create email templates (payment request, approval, expiry)
- [ ] #TBD - Optional: Set up SMS notifications

**Testing**:

- [ ] #TBD - Test Stripe subscription creation (test mode)
- [ ] #TBD - Test manual payment request creation
- [ ] #TBD - Test payment status polling
- [ ] #TBD - Test license activation on new device
- [ ] #TBD - Test device limit enforcement
- [ ] #TBD - Test subscription expiry and grace period
- [ ] #TBD - Test offline license validation (cached)
- [ ] #TBD - Test subscription upgrade/downgrade
- [ ] #TBD - Test subscription cancellation

**Deliverables**:

- Working Stripe subscription system
- Manual payment request workflow
- License validation with offline support
- Device activation and limits

**Estimated Time**: 3 weeks  
**Blockers**: Phase 2 complete (need owner auth)  
**Risk**: High - Payment integration is complex

#### Phase 3B: Admin Panel (Week 11-13, parallel with Phase 4)

**Setup**:

- [ ] #TBD - Create new React app for admin panel
- [ ] #TBD - Set up Supabase client (same project)
- [ ] #TBD - Implement admin authentication (Supabase)
- [ ] #TBD - Configure Vercel/Netlify deployment
- [ ] #TBD - Set up custom domain (admin.pharos.com)

**Features**:

- [ ] #TBD - Build dashboard (pending requests, revenue, stats)
- [ ] #TBD - Create pending requests list with filters
- [ ] #TBD - Implement request details view
- [ ] #TBD - Create approval/rejection workflow with notes
- [ ] #TBD - Add payment methods configuration page
- [ ] #TBD - Implement reports and analytics
- [ ] #TBD - Add audit log viewer

**Testing**:

- [ ] #TBD - Test admin login and authentication
- [ ] #TBD - Test approval workflow end-to-end
- [ ] #TBD - Test payment methods configuration
- [ ] #TBD - Test notifications (email/SMS)
- [ ] #TBD - Test reports and analytics

**Deliverables**:

- Deployed admin panel
- Working approval workflow
- Payment methods configuration
- Reports and analytics

**Estimated Time**: 2-3 weeks (can be parallel with Phase 4)  
**Blockers**: Phase 3A complete  
**Risk**: Low - Standard CRUD app

---

### Phase 4: Feature Flags System (Week 13-15)

**Goal**: Control feature access remotely based on plan

**Cloudflare KV**:

- [ ] #TBD - Create KV namespace for global feature flags
- [ ] #TBD - Create Cloudflare Worker to serve flags
- [ ] #TBD - Implement flag resolution (global → plan)
- [ ] #TBD - Add caching headers (5-minute cache)

**Supabase Schema**:

- [ ] #TBD - Create `feature_flags` table (flag_key, enabled, description)
- [ ] #TBD - Create `plan_features` table (plan_id, feature_key, enabled)

**Backend (Rust)**:

- [ ] #TBD - Create `FeatureFlagService` for flag evaluation
- [ ] #TBD - Add Tauri command: `get_feature_flags`, `is_feature_enabled`
- [ ] #TBD - Implement local flag cache (refresh every 6 hours)
- [ ] #TBD - Add flag evaluation logic (plan-based)

**Frontend (React)**:

- [ ] #TBD - Create `FeatureGate` component (hide/disable features)
- [ ] #TBD - Create `useFeatureFlag` hook
- [ ] #TBD - Add feature flag context provider
- [ ] #TBD - Mark premium features in UI (badge, tooltip)
- [ ] #TBD - Show "Upgrade to unlock" message for disabled features

**Testing**:

- [ ] #TBD - Test global flag enable/disable
- [ ] #TBD - Test plan-based feature access
- [ ] #TBD - Test offline flag evaluation (cached)
- [ ] #TBD - Test flag refresh on app restart
- [ ] #TBD - Test UI behavior for disabled features

**Deliverables**:

- Working feature flag system
- Plan-based feature control
- UI components for feature gating

**Estimated Time**: 2-3 weeks  
**Blockers**: Phase 3 complete (need subscription plans)  
**Risk**: Medium - Flag resolution logic can be complex

---

### Phase 5: Polish & Production Readiness (Week 16-18)

**Goal**: Prepare for production launch

**Error Handling & Logging**:

- [ ] #TBD - Add comprehensive error handling across all services
- [ ] #TBD - Implement structured logging (Sentry or similar)
- [ ] #TBD - Add error reporting for cloud service failures
- [ ] #TBD - Create fallback mechanisms for offline scenarios

**Analytics & Monitoring**:

- [ ] #TBD - Implement analytics (update adoption, feature usage)
- [ ] #TBD - Set up Cloudflare Analytics for Workers
- [ ] #TBD - Add Supabase monitoring and alerts
- [ ] #TBD - Create dashboard for key metrics

**Documentation**:

- [ ] #TBD - Write user documentation (how to subscribe, activate devices)
- [ ] #TBD - Create owner onboarding flow (first-time setup wizard)
- [ ] #TBD - Document admin panel usage
- [ ] #TBD - Create troubleshooting guide

**Security & Performance**:

- [ ] #TBD - Perform security audit (token storage, API keys)
- [ ] #TBD - Load testing (Cloudflare Workers, Supabase)
- [ ] #TBD - Optimize database queries and indexes
- [ ] #TBD - Review and tighten RLS policies

**Marketing & Launch**:

- [ ] #TBD - Prepare marketing materials (pricing page, feature comparison)
- [ ] #TBD - Create demo video for owners
- [ ] #TBD - Set up support channels (email, phone)
- [ ] #TBD - Plan launch announcement

**Deliverables**:

- Production-ready SaaS platform
- Complete documentation
- Monitoring and alerting
- Launch materials

**Estimated Time**: 2-3 weeks  
**Blockers**: Phases 1-4 complete  
**Risk**: Low - mostly polish and documentation

---

**Total Timeline**: 16-18 weeks (4-4.5 months) for Phases 0-5

---

## 🔮 Future Phases (Post-Launch)

### Phase 6: Cloud Backup (Optional - 3-4 weeks)

**Goal**: Enable pharmacy owners to backup their data to cloud

**When to Build**: When customers request it (not before)

**Features**:

- Nightly automatic backup to Supabase Storage
- Manual backup on demand
- Restore from backup
- Encrypted backups (pharmacy data is sensitive)
- Backup history and versioning

**Architecture**:

```
Local PostgreSQL → Backup Service → Supabase Storage
```

**Why Defer?**:

- Not critical for Phase 1 (local backups work fine)
- Adds cloud storage costs
- Build only when customers ask for it

**Estimated Cost**: +$10-30/month for storage  
**Estimated Time**: 3-4 weeks  
**Risk**: Low - straightforward implementation

---

### Phase 7: Multi-Branch Sync (Major Epic - 8-12 weeks)

**Goal**: Enable pharmacy chains to sync data across multiple branches

**When to Build**: When you have 5+ customers with multiple branches

**Features**:

- Real-time or interval-based sync between branches
- Conflict resolution (last-write-wins or manual)
- Central dashboard for chain owners
- Stock transfer between branches
- Consolidated reporting across branches
- Branch-specific permissions

**Architecture**:

```
Branch A (Local DB) ←→ Supabase (Central) ←→ Branch B (Local DB)
```

**Key Challenges**:

- Conflict resolution (two branches edit same product)
- Data ownership (which branch owns what data)
- Network reliability (handle offline branches)
- Performance (sync large datasets efficiently)
- Security (branch isolation)

**Why Defer?**:

- Complex feature, needs careful design
- Only 10-20% of pharmacies need this
- Build when you have paying customers requesting it
- Requires stable single-pharmacy experience first

**Estimated Cost**: +$50-100/month for sync infrastructure  
**Estimated Time**: 8-12 weeks  
**Risk**: High - complex distributed system

---

### Phase 8: Analytics Dashboard (4-6 weeks)

**Goal**: Provide pharmacy owners with business insights

**When to Build**: After Phase 5 (polish), when you have data

**Features**:

- Revenue trends (daily, weekly, monthly)
- Top-selling products
- Inventory turnover
- Customer analytics
- Expiry alerts and reports
- Comparison across branches (if multi-branch)
- Predictive insights

**Architecture**:

```
Local Data → Analytics Service → Dashboard UI
```

**Why Build This?**:

- High-value feature for Professional/Multi-Branch plans
- Can be premium add-on (+100-200 EGP/month)
- Differentiator from competitors
- Requires good data foundation first

**Estimated Cost**: +$10-20/month for analytics processing  
**Estimated Time**: 4-6 weeks  
**Risk**: Medium - requires data modeling

---

### Phase 9: Mobile App (Major Epic - 12-16 weeks)

**Goal**: Enable pharmacy owners to monitor business from mobile

**When to Build**: When you have 100+ paying customers

**Features**:

- View sales and inventory (read-only)
- Receive notifications (low stock, expiry alerts)
- Approve orders or stock transfers
- View reports and analytics
- Same cloud account as desktop (Supabase)
- Push notifications

**Architecture**:

```
Mobile App (React Native) → Supabase → Desktop App Data
```

**Why Defer?**:

- Significant development effort
- Requires stable backend first
- Build when desktop app is proven
- Mobile-first not critical for pharmacy operations

**Estimated Cost**: +$20-50/month for mobile backend  
**Estimated Time**: 12-16 weeks  
**Risk**: High - new platform, different UX

---

### Phase 10: API for Third-Party Integrations (6-8 weeks)

**Goal**: Enable integrations with accounting software, suppliers, etc.

**When to Build**: When customers request specific integrations

**Features**:

- REST API for external systems
- Webhook support for real-time events
- API key management
- Rate limiting and security
- Documentation and SDKs
- Common integrations (accounting, suppliers)

**Architecture**:

```
Third-Party App → API Gateway → Supabase → Desktop App
```

**Why Defer?**:

- Enterprise feature (Multi-Branch plan)
- Requires mature product first
- Build based on customer demand
- Integration partners need to be identified

**Estimated Cost**: +$20-40/month for API infrastructure  
**Estimated Time**: 6-8 weeks  
**Risk**: Medium - security and rate limiting complexity

---

### Phase 11: White-Label Solution (Major Epic - 16-20 weeks)

**Goal**: Enable partners to resell PharOS with their branding

**When to Build**: When you have 500+ customers and partnership requests

**Features**:

- Custom branding (logo, colors, name)
- Partner dashboard for managing customers
- Revenue sharing model
- Multi-tenant architecture
- Partner-specific feature flags
- Partner billing and reporting

**Why Defer?**:

- Significant architectural changes
- Only viable at scale
- Build when you have proven business model
- Requires mature product and operations

**Estimated Cost**: +$100-200/month for multi-tenant infrastructure  
**Estimated Time**: 16-20 weeks  
**Risk**: Very High - major architectural changes

---

### Phase 12: AI-Powered Features (8-12 weeks)

**Goal**: Add intelligent features using AI/ML

**When to Build**: After Phase 8 (analytics) when you have data

**Features**:

- Demand forecasting (predict stock needs)
- Smart reordering (auto-generate purchase orders)
- Price optimization (suggest optimal pricing)
- Fraud detection (unusual transactions)
- Customer insights (buying patterns)
- Chatbot for customer support

**Architecture**:

```
Historical Data → ML Model → Predictions → UI
```

**Why Defer?**:

- Requires significant historical data
- High-value differentiator
- Build when you have data and resources
- AI/ML expertise needed

**Estimated Cost**: +$50-100/month for AI/ML services  
**Estimated Time**: 8-12 weeks  
**Risk**: High - requires ML expertise and data

---

## 📊 Success Metrics

### Technical Metrics

- **Update Adoption**: 80% of users on latest version within 7 days
- **License Validation**: <100ms response time for cached validation
- **Uptime**: 99.9% availability for cloud services
- **Error Rate**: <0.1% failed update installations
- **Offline Support**: App works for 7 days without internet
- **API Response Time**: <200ms for 95th percentile

### Business Metrics (Egyptian Market)

- **Conversion Rate**: 20% of trial users convert to paid
- **Churn Rate**: <5% monthly churn
- **Average Revenue Per Pharmacy**: 700 EGP/month (Professional tier)
- **Device Activation**: Average 2 devices per paid pharmacy
- **Feature Adoption**: 60% of paid users use premium features
- **Payment Method Split**: 80-90% manual, 10-20% Stripe

### User Experience Metrics

- **Update Time**: <2 minutes from notification to restart
- **Sign-up Time**: <3 minutes from start to verified account
- **Checkout Time**: <2 minutes from click to payment confirmation
- **Manual Payment Approval**: <2 hours average approval time
- **Support Tickets**: <10% of users need help with subscription

### Growth Targets (12 Months)

- **Month 1-3**: 10-20 pharmacies (validation phase)
- **Month 4-6**: 50-100 pharmacies (growth phase)
- **Month 7-9**: 200-300 pharmacies (scaling phase)
- **Month 10-12**: 500+ pharmacies (established phase)

### Revenue Targets (12 Months)

- **Month 1-3**: 7,000-14,000 EGP/month ($140-280 USD)
- **Month 4-6**: 35,000-70,000 EGP/month ($700-1,400 USD)
- **Month 7-9**: 140,000-210,000 EGP/month ($2,800-4,200 USD)
- **Month 10-12**: 350,000+ EGP/month ($7,000+ USD)

---

## 💵 Cost & Revenue Projections

### Infrastructure Costs by Scale

**10 Pharmacies (Month 1-3)**:

- Cloudflare Workers: $0 (free tier)
- Supabase: $0-25 (free or starter)
- Stripe: Transaction fees only (~3%)
- GitHub: $0 (public releases)
- Email/SMS: $0-5
- **Total**: ~$0-30/month

**100 Pharmacies (Month 6-9)**:

- Cloudflare Workers: $5/month
- Supabase: $25/month (Pro plan)
- Stripe: Transaction fees (~3%)
- Email/SMS: $10-20
- **Total**: ~$40-50/month

**1,000 Pharmacies (Month 12+)**:

- Cloudflare Workers: $10-20/month
- Supabase: $25-100/month (Pro or Team)
- Stripe: Transaction fees (~3%)
- Email/SMS: $30-50
- **Total**: ~$65-170/month

### Revenue Projections

**10 Pharmacies**:

- Average: 700 EGP/month per pharmacy
- Total: 7,000 EGP/month (~$140 USD)
- Infrastructure: $0-30/month
- **Profit**: ~$110-140/month

**100 Pharmacies**:

- Average: 700 EGP/month per pharmacy
- Total: 70,000 EGP/month (~$1,400 USD)
- Infrastructure: $40-50/month
- **Profit**: ~$1,350-1,360/month

**1,000 Pharmacies**:

- Average: 700 EGP/month per pharmacy
- Total: 700,000 EGP/month (~$14,000 USD)
- Infrastructure: $65-170/month
- **Profit**: ~$13,830-13,935/month

### Future Phases Additional Costs

- **Phase 6** (Cloud Backup): +$10-30/month
- **Phase 7** (Multi-Branch Sync): +$50-100/month
- **Phase 8** (Analytics): +$10-20/month
- **Phase 9** (Mobile App): +$20-50/month
- **Phase 10** (API): +$20-40/month
- **Phase 11** (White-Label): +$100-200/month
- **Phase 12** (AI Features): +$50-100/month

### Break-Even Analysis

**Fixed Costs** (Development):

- 16-18 weeks × 1-2 developers
- Assume $2,000-4,000/month per developer
- Total: $16,000-32,000 (one-time)

**Break-Even**:

- At 700 EGP/month average: ~23-46 pharmacies
- Expected timeline: Month 4-6
- After break-even: Pure profit minus infrastructure

---

## ✅ Acceptance Criteria

### System-Wide

- [ ] App works offline with cached license (7-day grace period)
- [ ] All cloud services degrade gracefully when offline
- [ ] Existing local staff auth remains unchanged (NO breaking changes)
- [ ] Staff can log in and work without cloud account
- [ ] Owner can manage subscription without affecting staff workflow
- [ ] Updates are signed and verified before installation
- [ ] License validation happens in background, doesn't block UI
- [ ] All sensitive data encrypted in transit and at rest

### Updater System

- [ ] App checks for updates on startup and every 6 hours
- [ ] User can manually check for updates from settings
- [ ] Update notification shows version, release notes, and download size
- [ ] User can choose to install now or later
- [ ] App restarts automatically after update (with user confirmation)
- [ ] Failed updates don't break the app (rollback mechanism)
- [ ] Supports stable, beta, and dev channels
- [ ] Update signatures verified before installation

### Cloud Authentication (Owner Only)

- [ ] Owner can sign up with email/password (Supabase)
- [ ] Email verification required before accessing subscription
- [ ] Password reset via email
- [ ] OAuth support (Google, Microsoft) for easier sign-in
- [ ] Cloud account is completely separate from local staff users
- [ ] Owner account UI is in settings, not main login screen
- [ ] Staff never see or interact with cloud auth
- [ ] Tokens stored securely in OS keychain

### Subscription Management

- [ ] Stripe Checkout integration for payments (EGP currency)
- [ ] Manual payment methods supported (Vodafone Cash, Etisalat Cash, Instapay, Bank Transfer, Fawry)
- [ ] Support monthly and yearly billing
- [ ] Automatic renewal with email reminders (3 days before expiry)
- [ ] Owner can upgrade, downgrade, or cancel anytime
- [ ] Prorated billing for plan changes
- [ ] Trial period (14 days) for new users
- [ ] License key generated after successful payment
- [ ] License validation on app startup and every 24 hours
- [ ] Device activation with fingerprinting
- [ ] Max device limit enforced based on plan

### Manual Payment System

- [ ] Owner can choose manual payment method
- [ ] Payment instructions shown with unique reference code
- [ ] Payment request created in database
- [ ] Admin receives email/SMS notification
- [ ] Admin can approve/reject in admin panel
- [ ] License activated automatically after approval
- [ ] Owner receives confirmation email
- [ ] Payment requests expire after 24 hours
- [ ] Audit log tracks all approvals/rejections

### Admin Panel

- [ ] Admin can log in securely
- [ ] Dashboard shows pending requests and stats
- [ ] Admin can view request details
- [ ] Admin can approve/reject with notes
- [ ] Admin can configure payment methods
- [ ] Reports show revenue and payment method breakdown
- [ ] Audit log visible for all actions

### Feature Flags

- [ ] Features can be enabled/disabled remotely
- [ ] Flags can target specific plans (Free, Starter, Pro, Multi-Branch)
- [ ] Flags cached locally for offline access
- [ ] UI components respect feature flags (hide/disable premium features)
- [ ] Premium features show "Upgrade to unlock" message
- [ ] Flags update on app restart (not real-time)

---

## 🛠️ Technical Specifications

### Tech Stack

**Desktop App (Existing)**:

- Tauri v2.10.3
- React 19
- TypeScript
- TanStack Router, Query, Form
- Local PostgreSQL
- Tailwind CSS + shadcn/ui

**Cloud Services (New)**:

- **Cloudflare Workers**: Updater proxy, feature flags, license checks
- **Cloudflare KV**: Feature flag storage
- **Supabase**: Owner auth, database, edge functions
- **Stripe**: Payment processing (credit cards)
- **GitHub**: Binary distribution (releases)
- **SendGrid/Supabase**: Email notifications

**Admin Panel (New)**:

- React 19
- TypeScript
- Supabase client
- Tailwind CSS + shadcn/ui
- Vercel/Netlify hosting

### Database Schema (Supabase)

```sql
-- Cloud owner accounts (separate from local staff users)
CREATE TABLE cloud_owners (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  pharmacy_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Subscription plans
CREATE TABLE subscription_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL, -- 'free', 'starter', 'professional', 'multi_branch'
  display_name TEXT NOT NULL,
  price_egp_monthly DECIMAL(10,2) NOT NULL,
  price_egp_yearly DECIMAL(10,2),
  device_limit INTEGER NOT NULL,
  features JSONB NOT NULL,
  display_order INTEGER
);

-- Subscriptions
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id TEXT REFERENCES cloud_owners(id) ON DELETE CASCADE,
  plan_id TEXT REFERENCES subscription_plans(id),
  status TEXT NOT NULL, -- 'active', 'past_due', 'canceled', 'trialing'
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT false,
  trial_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Licenses (device activations)
CREATE TABLE licenses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id TEXT REFERENCES cloud_owners(id) ON DELETE CASCADE,
  subscription_id TEXT REFERENCES subscriptions(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL, -- Device fingerprint
  device_name TEXT,
  activated_at TIMESTAMP DEFAULT NOW(),
  last_validated_at TIMESTAMP,
  expires_at TIMESTAMP,
  status TEXT NOT NULL, -- 'active', 'expired', 'revoked'
  UNIQUE(owner_id, device_id)
);

-- Feature flags (global)
CREATE TABLE feature_flags (
  id TEXT PRIMARY KEY,
  flag_key TEXT UNIQUE NOT NULL,
  enabled BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Plan features (plan-specific overrides)
CREATE TABLE plan_features (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id TEXT REFERENCES subscription_plans(id) ON DELETE CASCADE,
  feature_key TEXT NOT NULL,
  enabled BOOLEAN NOT NULL,
  UNIQUE(plan_id, feature_key)
);

-- Payment requests (manual payments)
CREATE TABLE payment_requests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id TEXT REFERENCES cloud_owners(id) ON DELETE CASCADE,
  pharmacy_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  payment_method TEXT NOT NULL, -- 'vodafone_cash', 'etisalat_cash', etc.
  amount_egp DECIMAL(10,2) NOT NULL,
  plan_id TEXT REFERENCES subscription_plans(id),
  reference_code TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL, -- 'pending', 'approved', 'rejected', 'expired'
  payment_proof_url TEXT,
  admin_notes TEXT,
  approved_by TEXT,
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- Payment methods configuration
CREATE TABLE payment_methods (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'mobile_wallet', 'bank_transfer', 'instapay'
  enabled BOOLEAN DEFAULT true,
  account_number TEXT,
  instructions TEXT,
  display_order INTEGER
);

-- Payment approvals audit log
CREATE TABLE payment_approvals_log (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_request_id TEXT REFERENCES payment_requests(id) ON DELETE CASCADE,
  admin_user TEXT NOT NULL,
  action TEXT NOT NULL, -- 'approved', 'rejected'
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_subscriptions_owner ON subscriptions(owner_id);
CREATE INDEX idx_licenses_owner ON licenses(owner_id);
CREATE INDEX idx_licenses_device ON licenses(device_id);
CREATE INDEX idx_payment_requests_status ON payment_requests(status);
CREATE INDEX idx_payment_requests_owner ON payment_requests(owner_id);
```

### Local Database Schema (PostgreSQL)

```sql
-- License cache (for offline validation)
CREATE TABLE license_cache (
  id SERIAL PRIMARY KEY,
  owner_email TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  device_id TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  last_validated_at TIMESTAMP NOT NULL,
  grace_period_ends_at TIMESTAMP NOT NULL,
  cached_at TIMESTAMP DEFAULT NOW()
);

-- Feature flag cache (for offline access)
CREATE TABLE feature_flag_cache (
  id SERIAL PRIMARY KEY,
  flag_key TEXT UNIQUE NOT NULL,
  enabled BOOLEAN NOT NULL,
  cached_at TIMESTAMP DEFAULT NOW()
);

-- Owner session cache (for offline access)
CREATE TABLE owner_session_cache (
  id SERIAL PRIMARY KEY,
  owner_email TEXT UNIQUE NOT NULL,
  access_token TEXT NOT NULL, -- Encrypted
  refresh_token TEXT NOT NULL, -- Encrypted
  expires_at TIMESTAMP NOT NULL,
  cached_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints

**Cloudflare Workers**:

- `GET /api/updater/check` - Check for updates
- `GET /api/updater/download/:version` - Download update
- `GET /api/feature-flags` - Get feature flags
- `POST /api/license/validate` - Validate license

**Supabase Edge Functions**:

- `POST /functions/v1/create-checkout-session` - Create Stripe checkout
- `POST /functions/v1/stripe-webhook` - Handle Stripe webhooks
- `POST /functions/v1/validate-license` - Validate license server-side
- `POST /functions/v1/activate-device` - Activate device
- `POST /functions/v1/create-payment-request` - Create manual payment request
- `POST /functions/v1/approve-payment-request` - Approve payment (admin)

### Security Considerations

**Token Storage**:

- Use OS keychain (Windows Credential Manager, macOS Keychain)
- Never store tokens in plain text
- Encrypt sensitive data at rest

**API Keys**:

- Never commit to Git
- Use environment variables
- Rotate keys regularly

**Signing Keys**:

- Store private keys securely (not in repository)
- Use separate keys for dev/staging/production
- Implement key rotation strategy

**Stripe Webhooks**:

- Verify webhook signatures
- Use webhook secrets
- Implement idempotency

**License Validation**:

- Always validate server-side
- Don't trust client-side checks
- Implement rate limiting

**Feature Flags**:

- Cache locally but validate server-side for premium features
- Implement flag audit log
- Use feature flag versioning

**Owner Account**:

- Separate from staff auth completely
- No cross-contamination of data
- Implement proper RLS policies

**Payment Security**:

- Never store payment info locally
- Use Stripe tokens only
- Implement PCI compliance for manual payments
- Encrypt payment proof uploads

### Performance Considerations

**Update System**:

- Cache GitHub API responses (5 minutes)
- Use CDN for binary distribution
- Implement delta updates (future)

**License Validation**:

- Cache locally with 7-day grace period
- Background validation every 24 hours
- <100ms response time for cached checks

**Feature Flags**:

- Cache locally, refresh every 6 hours
- Use edge network for fast delivery
- Implement flag evaluation caching

**Database**:

- Proper indexes on frequently queried columns
- Connection pooling
- Query optimization

**Admin Panel**:

- Pagination for large lists
- Lazy loading for reports
- Caching for dashboard stats

---

## 🔒 Security & Compliance

### Data Privacy

**Local Data** (stays on device):

- All pharmacy data (products, sales, customers, inventory)
- Staff user accounts and sessions
- Business operations and reports
- Sensitive pharmacy information

**Cloud Data** (Supabase):

- Owner email and account info only
- Subscription and license status
- Payment requests (no payment details)
- Feature flag configuration

**Data Encryption**:

- TLS 1.3 for all network communication
- Encrypted tokens in OS keychain
- Encrypted backups (Phase 6)
- No plain text sensitive data

### Authentication Security

**Local Auth** (staff):

- Bcrypt password hashing
- Session management
- No changes to existing security

**Cloud Auth** (owner):

- Supabase Auth (industry standard)
- Email verification required
- OAuth 2.0 for Google/Microsoft
- JWT tokens with expiry

### Payment Security

**Stripe**:

- PCI DSS compliant
- No payment info stored locally
- Stripe tokens only
- Webhook signature verification

**Manual Payments**:

- No payment details stored
- Reference codes only
- Audit log for all approvals
- Admin authentication required

### Compliance

**GDPR** (if applicable):

- User data deletion on request
- Data export functionality
- Privacy policy and terms
- Consent management

**Egyptian Regulations**:

- Comply with local payment regulations
- Tax compliance for subscriptions
- Business registration requirements

---

## ⚠️ Risks & Mitigation

### Technical Risks

**1. Tauri Updater Complexity**

- **Risk**: Updater plugin can be tricky, especially on Windows
- **Impact**: High - core feature
- **Probability**: Medium
- **Mitigation**:
  - Thorough testing on all platforms
  - Rollback mechanism
  - Staged rollout (beta → stable)
  - Comprehensive error handling

**2. License Validation Abuse**

- **Risk**: Users might try to bypass license checks
- **Impact**: High - revenue loss
- **Probability**: Medium
- **Mitigation**:
  - Device fingerprinting
  - Server-side validation
  - Grace period limits (7 days)
  - Regular validation checks

**3. Stripe Webhook Reliability**

- **Risk**: Webhooks can fail or be delayed
- **Impact**: High - payment not processed
- **Probability**: Low
- **Mitigation**:
  - Retry logic with exponential backoff
  - Manual sync button for owners
  - Webhook verification
  - Monitoring and alerts

**4. Feature Flag Conflicts**

- **Risk**: Complex flag resolution can cause bugs
- **Impact**: Medium - features not working
- **Probability**: Medium
- **Mitigation**:
  - Clear precedence rules (global → plan)
  - Comprehensive testing
  - Flag audit log
  - Gradual rollout

**5. Offline Grace Period Abuse**

- **Risk**: Users might abuse 7-day grace period
- **Impact**: Medium - revenue loss
- **Probability**: Low
- **Mitigation**:
  - Track last validation time
  - Require online check after grace period
  - Device fingerprinting
  - Monitoring for abuse patterns

**6. Dual Auth Confusion**

- **Risk**: Users might confuse staff login with owner account
- **Impact**: Low - support burden
- **Probability**: Medium
- **Mitigation**:
  - Clear UI separation
  - Comprehensive documentation
  - Onboarding wizard
  - In-app help

### Business Risks

**1. Low Stripe Adoption in Egypt**

- **Risk**: Most users can't use Stripe
- **Impact**: High - revenue loss
- **Probability**: High
- **Mitigation**: ✅ Dual payment system with manual methods

**2. Manual Payment Scaling**

- **Risk**: Manual approvals don't scale well
- **Impact**: Medium - admin burden
- **Probability**: High
- **Mitigation**:
  - Admin panel for efficiency
  - Automated notifications
  - Future: API integration with payment providers
  - Hire support staff when needed

**3. Market Pricing Sensitivity**

- **Risk**: Pricing might be too high for Egyptian market
- **Impact**: High - low adoption
- **Probability**: Medium
- **Mitigation**:
  - Market research and validation
  - Flexible pricing (monthly/yearly)
  - Trial period (14 days)
  - Adjust based on feedback

**4. Competition**

- **Risk**: Competitors might offer similar features
- **Impact**: Medium - market share
- **Probability**: Medium
- **Mitigation**:
  - Focus on user experience
  - Egyptian market specialization
  - Continuous innovation
  - Strong customer relationships

### Operational Risks

**1. Infrastructure Costs**

- **Risk**: Costs might exceed projections
- **Impact**: Medium - profitability
- **Probability**: Low
- **Mitigation**:
  - Use free tiers initially
  - Monitor usage closely
  - Optimize queries and caching
  - Scale gradually

**2. Support Burden**

- **Risk**: High support volume for subscriptions
- **Impact**: Medium - time and cost
- **Probability**: Medium
- **Mitigation**:
  - Comprehensive documentation
  - In-app help and tutorials
  - FAQ and knowledge base
  - Automated email responses

**3. Payment Fraud**

- **Risk**: Fraudulent payment requests
- **Impact**: Medium - revenue loss
- **Probability**: Low
- **Mitigation**:
  - Reference code verification
  - Phone verification
  - Payment proof upload
  - Audit log and monitoring

---

## 📝 Notes & Assumptions

### Assumptions

1. **Pharmacy owners have email addresses** - Required for cloud accounts
2. **Internet connectivity** - At least once per week for license validation
3. **Payment methods** - Owners can use Stripe or manual payment methods
4. **Device limits** - Most pharmacies need 1-3 devices
5. **Update frequency** - Monthly releases with critical patches as needed
6. **Pricing acceptance** - 400-1500 EGP/month is acceptable for Egyptian market
7. **Staff don't need cloud accounts** - Only owner manages subscription
8. **Manual payment adoption** - 80-90% of users will use manual methods
9. **Admin availability** - Admin can approve payments within 1-24 hours

### Constraints

1. **Offline-first** - App must work during internet outages (7-day grace period)
2. **No breaking changes** - Existing local staff auth must remain functional
3. **Security** - Payment info never stored locally, only Stripe tokens
4. **Performance** - License validation must not slow down app startup
5. **Cost** - Cloud services must stay within budget (<$50/month initially)
6. **Simplicity** - Owner account UI must be simple and separate from staff workflow
7. **Egyptian market** - Must support local payment methods
8. **Scalability** - Architecture must support 1,000+ pharmacies

### Out of Scope (Phase 1-5)

**Explicitly NOT included in this epic**:

- Multi-branch cloud sync (Phase 7 - separate epic)
- Cloud backup and restore (Phase 6 - optional)
- Mobile app development (Phase 9 - separate epic)
- Analytics dashboard (Phase 8 - separate epic)
- API for third-party integrations (Phase 10 - future)
- White-label solution (Phase 11 - future)
- AI-powered features (Phase 12 - future)
- Custom branding per pharmacy (future)
- Multi-currency support (future)
- Localization/internationalization (future)
- Real-time features (not needed)
- Social features (not needed)

### Dependencies

**External Services**:

- Cloudflare Workers (free tier)
- Supabase (free or starter tier)
- Stripe (transaction fees only)
- GitHub (free for public repos)
- SendGrid or Supabase (email notifications)

**Internal Dependencies**:

- Stable local auth system (already implemented ✅)
- Local PostgreSQL database (already implemented ✅)
- Tauri v2 desktop app (already implemented ✅)

### Future Enhancements (See Future Phases Above)

- Phase 6: Cloud backup (optional)
- Phase 7: Multi-branch sync (major epic)
- Phase 8: Analytics dashboard
- Phase 9: Mobile app
- Phase 10: API for integrations
- Phase 11: White-label solution
- Phase 12: AI-powered features

---

**END OF DOCUMENT**
