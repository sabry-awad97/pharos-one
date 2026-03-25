# Professional Pharmacy Customer Management Workspace - PRD

⚠️ **Planning Document. Source of truth: GitHub issues (to be created)**

## Quick Links

- **GitHub Issue**: (pending creation)
- **Milestone**: v2.0
- **Module**: `module:customers`
- **Labels**: `type:epic`, `priority:high`, `layer:full-stack`, `hitl`

---

## 🎯 Overview

Transform the basic customer list into a comprehensive, professional pharmacy customer management workspace (studio) that goes beyond generic CRM to include pharmacy-specific features: medication adherence tracking, prescription history, health profiles, clinical documentation, and regulatory compliance (HIPAA).

**Business Value**: Positions the pharmacy as a clinical care provider, not just a dispensary. Enables pharmacist-led interventions, improves patient outcomes, supports Medicare Star Ratings, and creates new revenue streams through MTM (Medication Therapy Management) services.

**Design Philosophy**: Windows Fluent Design with professional healthcare aesthetics. Patient safety first - prominent visual warnings for allergies and drug interactions. Compact, efficient layouts for high-volume pharmacy workflows.

**Current State**: Basic customer list with mock data (name, tier, loyalty points, location). Toolbar with placeholder buttons.

**Target State**: Full-featured patient management system with clinical intelligence, engagement tools, and compliance features.

---

## 🎭 User Stories

### Core Patient Profile Management (Stories 1-8)

1. As a pharmacy technician, I want to view comprehensive patient demographics (name, DOB, address, contact info), so that I can verify patient identity during prescription pickup
2. As a pharmacist, I want to see patient allergies prominently displayed with visual warnings, so that I can prevent adverse drug reactions
3. As a pharmacy manager, I want to manage multiple phone numbers per patient with type labels (mobile/home/work), so that we can reach patients through their preferred contact method
4. As a pharmacy technician, I want to link family members under one household account, so that I can process family prescription pickups efficiently
5. As a pharmacist, I want to capture and store patient photo IDs, so that I can verify identity for controlled substance dispensing (DEA compliance)
6. As a pharmacy manager, I want to segment customers by tier (Platinum/Gold/Silver) with automated tier calculation, so that I can provide differentiated service levels
7. As a pharmacy technician, I want to search patients by name, phone, DOB, or address with fuzzy matching, so that I can quickly find the right patient even with typos
8. As a pharmacist, I want to store digital signatures for HIPAA consent forms, so that I can reduce paper waste and maintain compliance

### Prescription & Medication Intelligence (Stories 9-16)

9. As a pharmacist, I want to view a chronological prescription history timeline, so that I can understand the patient's medication journey
10. As a pharmacist, I want to see real-time drug interaction alerts when viewing a patient's medication list, so that I can prevent dangerous combinations
11. As a pharmacy manager, I want to track medication adherence scores (PDC/MPR) automatically, so that I can identify non-adherent patients for intervention
12. As a pharmacist, I want to receive alerts when patients are due for refills, so that I can proactively reach out and improve adherence
13. As a pharmacy technician, I want to see allergy contraindication flags with red banners, so that I can immediately stop dispensing if there's a conflict
14. As a pharmacist, I want to predict refill dates based on days supply, so that I can send timely reminders
15. As a pharmacy manager, I want to view aggregate adherence metrics across my patient population, so that I can report Medicare Star Ratings
16. As a pharmacist, I want to document reasons for overriding drug interaction alerts, so that I maintain an audit trail for liability protection

### Clinical & Health Management (Stories 17-24)

17. As a pharmacist, I want to track chronic conditions (diabetes, hypertension, asthma) with condition-specific metrics, so that I can monitor disease management
18. As a pharmacy technician, I want to record immunization administration with lot numbers and dates, so that I can generate immunization certificates
19. As a pharmacist, I want to document clinical consultations using SOAP note format, so that I can maintain professional clinical records
20. As a pharmacy technician, I want to store health screening results (BP, glucose, cholesterol) with trend visualization, so that patients can see their progress
21. As a pharmacist, I want to conduct and document MTM sessions with billable service codes, so that I can generate Medicare reimbursement claims
22. As a pharmacy manager, I want to identify high-risk patients (polypharmacy, multiple conditions, recent hospitalizations), so that I can prioritize pharmacist interventions
23. As a pharmacist, I want to schedule follow-up consultations directly from the patient profile, so that I can ensure continuity of care
24. As a pharmacy technician, I want to track immunization due dates with automated reminders, so that we can increase vaccination rates

### Financial & Loyalty Features (Stories 25-32)

25. As a pharmacy technician, I want to manage primary and secondary insurance cards with real-time eligibility verification, so that I can prevent claim rejections
26. As a pharmacy manager, I want to view complete payment history and outstanding balances, so that I can manage collections effectively
27. As a pharmacy technician, I want loyalty points to accrue automatically based on purchases, so that customers are rewarded without manual intervention
28. As a pharmacy manager, I want to track customer lifetime value and margin per customer, so that I can identify high-value patients for VIP services
29. As a pharmacy technician, I want to apply manufacturer coupons and discount cards automatically, so that patients get the best price without asking
30. As a pharmacy manager, I want to manage auto-refill and medication synchronization subscriptions, so that we can increase prescription volume and patient convenience
31. As a pharmacy technician, I want to see total savings per customer from discounts and coupons, so that I can communicate value during checkout
32. As a pharmacy manager, I want to track prior authorization status and history, so that I can follow up on pending approvals

### Proactive Engagement & Communication (Stories 33-40)

33. As a pharmacy manager, I want to send automated multi-channel reminders (SMS/email/app) for refills, so that I can reduce prescription abandonment
34. As a pharmacist, I want to send personalized health education content based on patient conditions, so that I can improve health literacy
35. As a pharmacy technician, I want HIPAA-compliant two-way messaging with patients, so that I can answer questions without phone tag
36. As a pharmacy manager, I want to track outreach campaign performance with conversion rates, so that I can optimize engagement strategies
37. As a pharmacist, I want to send care gap alerts for missing immunizations or overdue screenings, so that I can close gaps in care
38. As a pharmacy technician, I want patients to book appointments (consultations, immunizations, screenings) online, so that I can reduce phone call volume
39. As a pharmacy manager, I want to run targeted campaigns for flu shot drives or health screenings, so that I can increase service utilization
40. As a pharmacist, I want to see patient response history to outreach attempts, so that I can adjust my communication strategy

### Document Management & Compliance (Stories 41-48)

41. As a pharmacy technician, I want to store insurance card images with version control, so that I always have the current card on file
42. As a pharmacist, I want to collect e-signatures for controlled substance agreements, so that I can maintain DEA compliance digitally
43. As a pharmacy manager, I want automatic audit trails for all patient profile access, so that I can demonstrate HIPAA compliance during audits
44. As a pharmacy technician, I want to track prescription transfers in/out with originating pharmacy details, so that I can provide transfer history to patients
45. As a pharmacist, I want to manage prior authorization workflows with status tracking, so that I can follow up on pending approvals efficiently
46. As a pharmacy manager, I want role-based access control for sensitive data (financial, clinical notes), so that I can restrict access to authorized staff only
47. As a pharmacy technician, I want to see masked SSN and credit card numbers unless I have elevated permissions, so that we maintain data security
48. As a pharmacy manager, I want break-the-glass emergency access with mandatory reason logging, so that staff can access critical patient data in emergencies while maintaining audit trails

### AI-Powered Features (Stories 49-52)

49. As a pharmacy manager, I want predictive adherence scoring using ML models, so that I can proactively intervene before patients become non-adherent
50. As a pharmacist, I want AI-suggested intervention recommendations with optimal timing and channel, so that I can maximize outreach effectiveness
51. As a pharmacist, I want voice-to-text for clinical consultations with automatic SOAP note structuring, so that I can document efficiently without typing
52. As a pharmacy manager, I want automated risk flagging for concerning medication patterns, so that pharmacists can review high-risk cases

---

## 📐 Architecture Overview

### System Context

```
┌─────────────────────────────────────────────────────────────┐
│                  Customer Management Workspace               │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Patient    │  │ Prescription │  │   Clinical   │     │
│  │   Profile    │  │   History    │  │     Notes    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Adherence   │  │  Engagement  │  │  Financial   │     │
│  │   Tracking   │  │   Hub        │  │   Ledger     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Database   │    │  Notification │    │   Insurance  │
│   (Postgres) │    │   Service     │    │   Eligibility│
└──────────────┘    └──────────────┘    └──────────────┘
```

### Layers Involved

**Schema/Database** (packages/schema/src/customer/):

- Extend existing `customerSchema` with new fields
- Create new schemas: `prescriptionSchema`, `allergySchema`, `chronicConditionSchema`, `clinicalNoteSchema`, `immunizationSchema`, `insuranceCardSchema`, `adherenceMetricSchema`, `communicationLogSchema`
- Follow existing conventions: snake_case, nullable fields, idSchema, dateTimeSchema

**Domain/Service** (new: packages/services/src/customer/):

- Adherence calculation engine (PDC/MPR)
- Drug interaction checking service
- Risk stratification algorithm
- Refill prediction engine
- Communication orchestration service

**API/Backend** (new: apps/api/src/routes/customers/):

- RESTful endpoints for CRUD operations
- Real-time eligibility verification integration
- SMS/email service integration
- Document storage integration (S3 or local)

**UI/Component** (apps/web/src/features/modules/customers/):

- Refactor `CustomersWorkspace` from mock data to real DataTable
- Create modular components: `CustomerProfileView`, `PrescriptionTimeline`, `AdherenceScoreCard`, `ClinicalNotesPanel`, `EngagementHub`
- Leverage existing `DataTable` architecture for customer list
- Follow Windows Fluent Design patterns

**Integration Points**:

- DataTable ↔ Customer data (via React Query)
- Profile view ↔ Prescription service
- Adherence tracker ↔ Notification service
- Insurance manager ↔ Eligibility API
- Document storage ↔ S3/local filesystem

### Key Design Decisions

#### Decision 1: Modular Component Architecture

**Approach**: Break customer workspace into composable modules that can be independently developed and tested.

**Confidence Level**: 90%

**Key Assumptions**:

- Each module (Profile, Prescriptions, Clinical, Financial, Engagement) is a separate component
- Modules communicate through shared context (CustomerContext)
- Modules can be lazy-loaded for performance
- Each module follows deep module design (small interface, rich functionality)

**Would Change If**: Performance issues with context updates → use atomic state management (Jotai/Zustand)

**Module Structure**:

```
customers/
├── CustomersWorkspace.tsx          # Main container with DataTable
├── CustomerProfileView.tsx         # Detail view container
├── context/
│   └── CustomerContext.tsx         # Shared customer state
├── components/
│   ├── profile/
│   │   ├── ProfileHeader.tsx       # Demographics, photo, tier
│   │   ├── ContactInfo.tsx         # Phone, email, address
│   │   └── FamilyLinks.tsx         # Household connections
│   ├── prescriptions/
│   │   ├── PrescriptionTimeline.tsx
│   │   ├── DrugInteractionAlerts.tsx
│   │   └── RefillPredictions.tsx
│   ├── clinical/
│   │   ├── ChronicConditions.tsx
│   │   ├── ImmunizationRecords.tsx
│   │   ├── ClinicalNotes.tsx
│   │   └── HealthScreenings.tsx
│   ├── adherence/
│   │   ├── AdherenceScoreCard.tsx
│   │   ├── AdherenceTrends.tsx
│   │   └── InterventionLog.tsx
│   ├── financial/
│   │   ├── InsuranceCards.tsx
│   │   ├── PaymentHistory.tsx
│   │   └── LoyaltyPoints.tsx
│   └── engagement/
│       ├── CommunicationLog.tsx
│       ├── CampaignHistory.tsx
│       └── AppointmentScheduler.tsx
└── hooks/
    ├── useCustomerData.ts
    ├── useAdherenceMetrics.ts
    └── usePrescriptionHistory.ts
```

#### Decision 2: Schema Design - Extend Existing vs New Tables

**Approach**: Extend `customerSchema` for core fields, create separate tables for complex entities (prescriptions, allergies, clinical notes).

**Confidence Level**: 95%

**Key Assumptions**:

- Customer table remains the central entity
- One-to-many relationships for prescriptions, allergies, notes
- Many-to-many for chronic conditions (via junction table)
- Phone numbers already have `customer_id` foreign key (existing schema)
- Follow existing snake_case and nullable conventions

**Would Change If**: Performance issues with joins → denormalize frequently accessed data

**Schema Extensions**:

```typescript
// Extend existing customerSchema
export const customerSchema = z.object({
  // ... existing fields
  photo_url: z.string().nullable(),
  insurance_primary_id: idSchema.nullable(),
  insurance_secondary_id: idSchema.nullable(),
  preferred_contact_method: z.enum(["SMS", "EMAIL", "PHONE", "APP"]).nullable(),
  sms_consent: z.boolean(),
  email_consent: z.boolean(),
  hipaa_consent_date: dateTimeSchema.nullable(),
  hipaa_consent_signature_url: z.string().nullable(),
  tier: z.enum(["PLATINUM", "GOLD", "SILVER", "BRONZE"]),
  tier_updated_at: dateTimeSchema.nullable(),
  household_id: idSchema.nullable(),
  risk_score: z.number().int().nullable(), // 0-100
  last_adherence_check: dateTimeSchema.nullable(),
});

// New schemas
export const prescriptionSchema = z.object({
  id: idSchema,
  customer_id: idSchema,
  medication_name: z.string(),
  dosage: z.string(),
  quantity: z.number(),
  days_supply: z.number().int(),
  prescriber_name: z.string(),
  prescriber_npi: z.string().nullable(),
  fill_date: dateTimeSchema,
  refills_remaining: z.number().int(),
  next_refill_date: dateTimeSchema.nullable(),
  rx_number: z.string(),
  ndc_code: z.string().nullable(),
  is_controlled: z.boolean(),
  dea_schedule: z.enum(["II", "III", "IV", "V"]).nullable(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export const allergySchema = z.object({
  id: idSchema,
  customer_id: idSchema,
  allergen: z.string(),
  reaction: z.string(),
  severity: z.enum(["MILD", "MODERATE", "SEVERE", "LIFE_THREATENING"]),
  onset_date: dateTimeSchema.nullable(),
  verified_by: idSchema.nullable(), // staff_member_id
  verified_at: dateTimeSchema.nullable(),
  is_active: z.boolean(),
  notes: z.string().nullable(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export const chronicConditionSchema = z.object({
  id: idSchema,
  name: z.string(),
  icd10_code: z.string().nullable(),
  description: z.string().nullable(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export const customerChronicConditionSchema = z.object({
  id: idSchema,
  customer_id: idSchema,
  chronic_condition_id: idSchema,
  diagnosed_date: dateTimeSchema.nullable(),
  status: z.enum(["ACTIVE", "CONTROLLED", "RESOLVED"]),
  notes: z.string().nullable(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export const clinicalNoteSchema = z.object({
  id: idSchema,
  customer_id: idSchema,
  pharmacist_id: idSchema, // staff_member_id
  note_type: z.enum([
    "CONSULTATION",
    "MTM",
    "SCREENING",
    "INTERVENTION",
    "GENERAL",
  ]),
  subjective: z.string().nullable(), // SOAP format
  objective: z.string().nullable(),
  assessment: z.string().nullable(),
  plan: z.string().nullable(),
  billing_code: z.string().nullable(), // CPT code for MTM
  duration_minutes: z.number().int().nullable(),
  follow_up_date: dateTimeSchema.nullable(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export const immunizationSchema = z.object({
  id: idSchema,
  customer_id: idSchema,
  vaccine_name: z.string(),
  cvx_code: z.string().nullable(), // CDC vaccine code
  lot_number: z.string(),
  expiration_date: dateTimeSchema,
  administration_date: dateTimeSchema,
  administered_by: idSchema, // staff_member_id
  site: z.string().nullable(), // injection site
  route: z.string().nullable(), // IM, SubQ, etc.
  dose_number: z.number().int().nullable(),
  series_complete: z.boolean(),
  vis_date: dateTimeSchema.nullable(), // Vaccine Information Statement
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export const insuranceCardSchema = z.object({
  id: idSchema,
  customer_id: idSchema,
  type: z.enum(["PRIMARY", "SECONDARY"]),
  carrier_name: z.string(),
  policy_number: z.string(),
  group_number: z.string().nullable(),
  bin_number: z.string().nullable(),
  pcn_number: z.string().nullable(),
  cardholder_name: z.string(),
  relationship: z.enum(["SELF", "SPOUSE", "CHILD", "OTHER"]),
  effective_date: dateTimeSchema.nullable(),
  termination_date: dateTimeSchema.nullable(),
  card_image_front_url: z.string().nullable(),
  card_image_back_url: z.string().nullable(),
  is_active: z.boolean(),
  created_at: dateTimeSchema,
  updated_at: dateTimeSchema,
});

export const adherenceMetricSchema = z.object({
  id: idSchema,
  customer_id: idSchema,
  medication_name: z.string(),
  measurement_period_start: dateTimeSchema,
  measurement_period_end: dateTimeSchema,
  pdc_score: z.number(), // Proportion of Days Covered (0-1)
  mpr_score: z.number(), // Medication Possession Ratio (0-1+)
  expected_refills: z.number().int(),
  actual_refills: z.number().int(),
  days_covered: z.number().int(),
  days_in_period: z.number().int(),
  is_adherent: z.boolean(), // >= 0.8 threshold
  calculated_at: dateTimeSchema,
  created_at: dateTimeSchema,
});

export const communicationLogSchema = z.object({
  id: idSchema,
  customer_id: idSchema,
  channel: z.enum(["SMS", "EMAIL", "PHONE", "APP", "IN_PERSON"]),
  direction: z.enum(["OUTBOUND", "INBOUND"]),
  message_type: z.enum([
    "REFILL_REMINDER",
    "APPOINTMENT_REMINDER",
    "HEALTH_EDUCATION",
    "CARE_GAP",
    "GENERAL",
  ]),
  subject: z.string().nullable(),
  body: z.string(),
  sent_by: idSchema.nullable(), // staff_member_id for manual messages
  sent_at: dateTimeSchema,
  delivered_at: dateTimeSchema.nullable(),
  read_at: dateTimeSchema.nullable(),
  responded_at: dateTimeSchema.nullable(),
  response_body: z.string().nullable(),
  campaign_id: idSchema.nullable(),
  created_at: dateTimeSchema,
});
```

#### Decision 3: Adherence Calculation Engine

**Approach**: Server-side calculation with scheduled jobs, cached results in `adherence_metric` table.

**Confidence Level**: 85%

**Key Assumptions**:

- PDC (Proportion of Days Covered) is primary metric for Medicare Star Ratings
- Calculation runs nightly for all active patients
- Results cached for performance (recalculated on-demand if needed)
- Threshold of 0.8 (80%) defines adherence
- Calculation considers overlapping fills and early refills

**Would Change If**: Real-time adherence needed → calculate on-demand with caching

**PDC Calculation Algorithm**:

```typescript
/**
 * Calculate Proportion of Days Covered (PDC)
 * PDC = (Days Covered / Days in Period)
 *
 * Rules:
 * - Count each day only once (even if multiple fills overlap)
 * - Include days from fill date through days_supply
 * - Exclude days after measurement period end
 * - Adherent if PDC >= 0.8
 */
function calculatePDC(
  prescriptions: Prescription[],
  periodStart: Date,
  periodEnd: Date,
): number {
  const daysInPeriod = daysBetween(periodStart, periodEnd);
  const coveredDays = new Set<string>(); // ISO date strings

  for (const rx of prescriptions) {
    const fillDate = new Date(rx.fill_date);
    const endDate = addDays(fillDate, rx.days_supply);

    // Iterate each day in this fill's coverage
    for (let d = fillDate; d <= endDate && d <= periodEnd; d = addDays(d, 1)) {
      if (d >= periodStart) {
        coveredDays.add(d.toISOString().split("T")[0]);
      }
    }
  }

  return coveredDays.size / daysInPeriod;
}
```

**Scheduled Job**:

- Runs daily at 2 AM
- Calculates PDC for all active patients with prescriptions
- Stores results in `adherence_metric` table
- Flags non-adherent patients (PDC < 0.8) for pharmacist review
- Triggers automated outreach for patients below threshold

#### Decision 4: Drug Interaction Checking

**Approach**: Client-side checking using embedded drug interaction database, with option for external API integration.

**Confidence Level**: 70%

**Key Assumptions**:

- Drug interaction data is relatively static (updated monthly)
- Embedded database is sufficient for common interactions
- Severity levels: Critical (contraindicated), Major (requires monitoring), Moderate (caution), Minor (informational)
- Pharmacist can override with documented reason
- External API (e.g., First Databank, Lexicomp) can be integrated later

**Would Change If**: Interaction database too large → use external API only

**Alternative Approach**: Use external API (First Databank, Lexicomp) for all checks

- Pros: Always up-to-date, comprehensive coverage
- Cons: Requires internet, API costs, latency
- Confidence: 60%

**Interaction Check Flow**:

```typescript
interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: "CRITICAL" | "MAJOR" | "MODERATE" | "MINOR";
  description: string;
  clinicalEffects: string;
  management: string;
}

function checkInteractions(
  currentMedications: string[],
  newMedication?: string,
): DrugInteraction[] {
  const medsToCheck = newMedication
    ? [...currentMedications, newMedication]
    : currentMedications;

  const interactions: DrugInteraction[] = [];

  // Check all pairs
  for (let i = 0; i < medsToCheck.length; i++) {
    for (let j = i + 1; j < medsToCheck.length; j++) {
      const interaction = interactionDatabase.check(
        medsToCheck[i],
        medsToCheck[j],
      );
      if (interaction) {
        interactions.push(interaction);
      }
    }
  }

  // Sort by severity
  return interactions.sort(
    (a, b) => severityWeight[b.severity] - severityWeight[a.severity],
  );
}
```

#### Decision 5: Communication Hub Architecture

**Approach**: Event-driven architecture with message queue for outbound communications.

**Confidence Level**: 80%

**Key Assumptions**:

- SMS via Twilio or similar service
- Email via SendGrid or similar service
- Messages queued for batch processing
- Delivery status tracked asynchronously
- HIPAA-compliant messaging (encrypted, audit logged)
- Opt-in/opt-out managed per channel

**Would Change If**: High volume (>10k messages/day) → use dedicated messaging service (AWS SNS/SQS)

**Message Flow**:

```
Trigger (Refill Due) → Message Queue → Channel Router → SMS/Email Service → Delivery Tracking → Communication Log
```

**Message Queue Schema**:

```typescript
interface QueuedMessage {
  id: string;
  customerId: string;
  channel: 'SMS' | 'EMAIL' | 'APP';
  messageType: 'REFILL_REMINDER' | 'APPOINTMENT_REMINDER' | ...;
  subject?: string;
  body: string;
  scheduledFor: Date;
  priority: 'HIGH' | 'NORMAL' | 'LOW';
  retryCount: number;
  maxRetries: number;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';
}
```

#### Decision 6: Risk Stratification Algorithm

**Approach**: Rule-based scoring system with weighted factors, calculated on-demand.

**Confidence Level**: 75%

**Key Assumptions**:

- Risk score 0-100 (higher = higher risk)
- Factors: non-adherence (30%), polypharmacy (20%), chronic conditions (20%), recent hospitalizations (15%), age (10%), missed appointments (5%)
- Recalculated when relevant data changes
- Thresholds: High risk (70+), Medium risk (40-69), Low risk (0-39)

**Would Change If**: ML model available → use predictive scoring instead of rule-based

**Risk Calculation**:

```typescript
function calculateRiskScore(customer: Customer): number {
  let score = 0;

  // Non-adherence (30 points max)
  const avgAdherence = getAverageAdherence(customer.id);
  if (avgAdherence < 0.5) score += 30;
  else if (avgAdherence < 0.8) score += 20;
  else if (avgAdherence < 0.9) score += 10;

  // Polypharmacy (20 points max)
  const activeMeds = getActiveMedications(customer.id).length;
  if (activeMeds >= 10) score += 20;
  else if (activeMeds >= 5) score += 10;

  // Chronic conditions (20 points max)
  const conditions = getChronicConditions(customer.id).length;
  if (conditions >= 3) score += 20;
  else if (conditions >= 2) score += 10;

  // Age (10 points max)
  const age = calculateAge(customer.date_of_birth);
  if (age >= 75) score += 10;
  else if (age >= 65) score += 5;

  // Recent hospitalizations (15 points max)
  const hospitalizations = getRecentHospitalizations(customer.id, 90); // last 90 days
  score += Math.min(hospitalizations * 5, 15);

  // Missed appointments (5 points max)
  const missedAppts = getMissedAppointments(customer.id, 180); // last 6 months
  score += Math.min(missedAppts * 2, 5);

  return Math.min(score, 100);
}
```

#### Decision 7: UI Layout - Master-Detail Pattern

**Approach**: DataTable list view with slide-out detail panel (Windows Fluent Design).

**Confidence Level**: 90%

**Key Assumptions**:

- List view shows key info: name, tier, last visit, adherence score, risk indicator
- Click row opens detail panel from right side
- Detail panel has tabbed navigation: Profile, Prescriptions, Clinical, Financial, Engagement
- Panel can be expanded to full width or closed
- List remains visible for quick switching between patients

**Would Change If**: Mobile view needed → use full-screen detail view instead of slide-out

**Layout Structure**:

```
┌─────────────────────────────────────────────────────────────┐
│ Toolbar: [Add Customer] [Export] [Filter] [Search]         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Customer List (DataTable)        │  Detail Panel          │
│  ┌──────────────────────────┐    │  ┌──────────────────┐  │
│  │ Name    │ Tier │ Risk    │    │  │ [Profile] [Rx]   │  │
│  ├──────────────────────────┤    │  │ [Clinical] [$$]  │  │
│  │ Priya   │ Plat │ 🟢 Low  │◄───┼──┤                  │  │
│  │ Anjali  │ Gold │ 🟡 Med  │    │  │ Patient Details  │  │
│  │ Rajesh  │ Silv │ 🔴 High │    │  │ ...              │  │
│  └──────────────────────────┘    │  └──────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Windows Fluent Design Specifications**:

- Slide-out animation: 300ms ease-out
- Panel width: 480px (collapsed), 960px (expanded)
- Elevation: shadow-lg for panel
- Tab navigation: compact tabs with Microsoft blue active indicator
- Scrollable content within panel
- Close button (X) in top-right corner

---

## ✅ Acceptance Criteria

### Phase 1: Foundation - Customer List & Profile View

- [ ] Customer list displays real data from database (not mock data)
- [ ] DataTable supports sorting, filtering, pagination
- [ ] Search works across name, phone, email, address with fuzzy matching
- [ ] Click customer row opens detail panel with slide-out animation
- [ ] Detail panel shows basic profile: name, DOB, address, contact info
- [ ] Phone numbers display with type labels (mobile/home/work)
- [ ] Tier badge displays with correct color (Platinum/Gold/Silver)
- [ ] Risk indicator shows color-coded status (red/yellow/green)
- [ ] Panel can be closed and reopened without losing state
- [ ] All styling follows Windows Fluent Design compact mode

### Phase 2: Prescription History & Drug Interactions

- [ ] Prescription timeline displays chronologically with medication names, dosages, fill dates
- [ ] Drug interaction alerts display with severity levels (Critical/Major/Moderate/Minor)
- [ ] Critical interactions show red banner warning
- [ ] Pharmacist can override interaction alerts with documented reason
- [ ] Allergy contraindication flags display prominently
- [ ] Refill predictions show next refill date based on days supply
- [ ] Controlled substance prescriptions marked with DEA schedule
- [ ] Prescription search/filter works within patient's history

### Phase 3: Adherence Tracking & Interventions

- [ ] Adherence score card displays PDC/MPR metrics
- [ ] Adherence trends visualized over time (chart)
- [ ] Non-adherent patients flagged automatically (PDC < 0.8)
- [ ] Pharmacist can log intervention attempts with outcomes
- [ ] Automated refill reminders sent based on predicted refill dates
- [ ] Adherence calculation runs nightly for all active patients
- [ ] Aggregate adherence metrics available for reporting

### Phase 4: Clinical Documentation

- [ ] Chronic conditions tracked with status (Active/Controlled/Resolved)
- [ ] Immunization records display with lot numbers and dates
- [ ] Clinical notes use SOAP format (Subjective/Objective/Assessment/Plan)
- [ ] MTM sessions documented with billable CPT codes
- [ ] Health screening results stored with trend visualization
- [ ] Follow-up appointments scheduled from clinical notes
- [ ] All clinical documentation timestamped and attributed to pharmacist

### Phase 5: Financial & Loyalty

- [ ] Insurance cards stored with front/back images
- [ ] Real-time eligibility verification integrated
- [ ] Payment history displays with outstanding balances
- [ ] Loyalty points accrue automatically based on purchases
- [ ] Tier calculation runs automatically based on defined rules
- [ ] Discount and coupon application tracked per transaction
- [ ] Prior authorization workflow with status tracking

### Phase 6: Engagement & Communication

- [ ] Multi-channel messaging (SMS/email) with HIPAA compliance
- [ ] Automated reminder campaigns for refills, appointments, immunizations
- [ ] Two-way messaging with conversation threading
- [ ] Communication log displays all interactions chronologically
- [ ] Campaign performance metrics tracked (sent/delivered/responded)
- [ ] Appointment scheduling integrated with calendar
- [ ] Care gap alerts generated automatically

### Phase 7: Security & Compliance

- [ ] Role-based access control enforced for sensitive data
- [ ] Audit trail logs all profile access with user ID and timestamp
- [ ] Data masking applied for SSN, credit card numbers
- [ ] Break-the-glass access requires reason and logs to manager
- [ ] E-signature collection for HIPAA consent forms
- [ ] Document version control for insurance cards
- [ ] HIPAA consent status displayed prominently

---

## 🗺️ Implementation Phases

### Phase 0: Schema & Database Setup (Week 1)

**Goal**: Database foundation ready for all features

- [ ] Create migration scripts for all new tables
- [ ] Extend `customerSchema` with new fields
- [ ] Create indexes for performance (customer_id foreign keys, search fields)
- [ ] Seed development database with realistic test data
- [ ] Document schema relationships and constraints

**Estimated Effort**: 16-20 hours

**Blockers**: None

**Deliverable**: Database schema complete, migrations tested

### Phase 1: Customer List & Profile View (Week 2)

**Goal**: Replace mock data with real customer list and basic profile view

- [ ] Create API endpoints: GET /customers, GET /customers/:id
- [ ] Implement `useCustomerData` hook with React Query
- [ ] Refactor `CustomersWorkspace` to use DataTable with real data
- [ ] Add search functionality (fuzzy matching across fields)
- [ ] Create `CustomerProfileView` component with slide-out panel
- [ ] Implement `ProfileHeader` with photo, tier, risk indicator
- [ ] Implement `ContactInfo` component with phone numbers
- [ ] Add Windows Fluent Design styling throughout
- [ ] Write integration tests for list and profile views

**Estimated Effort**: 24-32 hours

**Blockers**: Phase 0 complete

**Deliverable**: Working customer list with searchable, filterable table and basic profile view

### Phase 2: Prescription History & Drug Interactions (Week 3)

**Goal**: Display prescription history with safety alerts

- [ ] Create API endpoints: GET /customers/:id/prescriptions
- [ ] Implement `PrescriptionTimeline` component
- [ ] Create drug interaction database (embedded or API integration)
- [ ] Implement `DrugInteractionAlerts` component with severity levels
- [ ] Add allergy contraindication checking
- [ ] Implement pharmacist override workflow with reason logging
- [ ] Create `RefillPredictions` component
- [ ] Add controlled substance indicators
- [ ] Write tests for interaction checking logic

**Estimated Effort**: 32-40 hours

**Blockers**: Phase 1 complete

**Deliverable**: Prescription timeline with drug interaction alerts and refill predictions

### Phase 3: Adherence Tracking (Week 4)

**Goal**: Calculate and display medication adherence metrics

- [ ] Implement PDC calculation algorithm
- [ ] Create scheduled job for nightly adherence calculations
- [ ] Create API endpoints: GET /customers/:id/adherence
- [ ] Implement `AdherenceScoreCard` component
- [ ] Create `AdherenceTrends` chart component
- [ ] Implement non-adherent patient flagging
- [ ] Create intervention logging UI
- [ ] Add automated refill reminder triggers
- [ ] Write tests for PDC calculation

**Estimated Effort**: 24-32 hours

**Blockers**: Phase 2 complete (needs prescription data)

**Deliverable**: Adherence tracking with automated alerts and intervention logging

### Phase 4: Clinical Documentation (Week 5)

**Goal**: Enable pharmacist clinical documentation

- [ ] Create API endpoints for clinical entities (conditions, immunizations, notes)
- [ ] Implement `ChronicConditions` component with status tracking
- [ ] Implement `ImmunizationRecords` component with certificate generation
- [ ] Create `ClinicalNotes` component with SOAP format
- [ ] Add MTM session documentation with billing codes
- [ ] Implement `HealthScreenings` component with trend charts
- [ ] Add follow-up appointment scheduling
- [ ] Write tests for clinical workflows

**Estimated Effort**: 32-40 hours

**Blockers**: Phase 1 complete

**Deliverable**: Complete clinical documentation system with SOAP notes and MTM billing

### Phase 5: Financial & Loyalty (Week 6)

**Goal**: Manage insurance, payments, and loyalty program

- [ ] Create API endpoints for insurance and financial data
- [ ] Implement `InsuranceCards` component with image upload
- [ ] Integrate real-time eligibility verification API
- [ ] Implement `PaymentHistory` component with ledger view
- [ ] Create `LoyaltyPoints` component with accrual rules
- [ ] Implement automated tier calculation
- [ ] Add discount/coupon tracking
- [ ] Create prior authorization workflow UI
- [ ] Write tests for financial calculations

**Estimated Effort**: 32-40 hours

**Blockers**: Phase 1 complete

**Deliverable**: Complete financial management with insurance verification and loyalty program

### Phase 6: Engagement & Communication (Week 7)

**Goal**: Enable proactive patient engagement

- [ ] Integrate SMS service (Twilio) and email service (SendGrid)
- [ ] Create message queue system for outbound communications
- [ ] Implement `CommunicationLog` component
- [ ] Create automated reminder campaigns (refills, appointments)
- [ ] Implement two-way messaging with HIPAA compliance
- [ ] Add `CampaignHistory` component with performance metrics
- [ ] Implement `AppointmentScheduler` component
- [ ] Create care gap alert system
- [ ] Write tests for messaging workflows

**Estimated Effort**: 40-48 hours

**Blockers**: Phase 3 complete (needs adherence data for triggers)

**Deliverable**: Multi-channel communication hub with automated campaigns and two-way messaging

### Phase 7: Security & Compliance (Week 8)

**Goal**: Ensure HIPAA compliance and data security

- [ ] Implement role-based access control (RBAC)
- [ ] Create audit logging system for all profile access
- [ ] Implement data masking for sensitive fields
- [ ] Add break-the-glass emergency access workflow
- [ ] Create e-signature collection system
- [ ] Implement document version control
- [ ] Add HIPAA consent tracking
- [ ] Conduct security audit and penetration testing
- [ ] Write tests for security controls

**Estimated Effort**: 24-32 hours

**Blockers**: All previous phases (security layer on top)

**Deliverable**: HIPAA-compliant system with comprehensive audit trails and access controls

### Phase 8: AI-Powered Features (Week 9-10)

**Goal**: Add predictive analytics and automation

- [ ] Implement predictive adherence scoring ML model
- [ ] Create AI-powered intervention recommendation engine
- [ ] Add voice-to-text for clinical notes
- [ ] Implement automated risk flagging
- [ ] Create dashboard for AI insights
- [ ] Write tests for AI features
- [ ] Monitor model performance and accuracy

**Estimated Effort**: 48-64 hours

**Blockers**: Phases 2-4 complete (needs historical data)

**Deliverable**: AI-powered predictive analytics and automation features

**Total Estimated Effort**: 272-368 hours (34-46 days for 1 developer, 7-9 weeks for team)

---

## 📊 Success Metrics

### User Adoption

- 90%+ of pharmacy staff use customer workspace daily within 2 weeks
- Average 20+ profile views per staff member per day
- 70%+ of pharmacists document clinical interventions

### Patient Outcomes

- 15% improvement in medication adherence rates (PDC scores)
- 25% reduction in prescription abandonment
- 30% increase in immunization administration
- 20% increase in MTM session completion

### Operational Efficiency

- 40% reduction in time to find patient information
- 50% reduction in phone calls for refill reminders
- 30% reduction in insurance claim rejections
- 25% increase in loyalty program enrollment

### Financial Impact

- $50k+ annual revenue from MTM billing
- 15% increase in prescription volume from auto-refill
- 20% increase in customer lifetime value
- 10% reduction in bad debt from improved collections

### Quality & Compliance

- Zero HIPAA violations or data breaches
- 100% audit trail coverage for profile access
- 95%+ accuracy in drug interaction alerts
- 90%+ patient satisfaction with communication

---

## 🧪 Testing Strategy

### Testing Philosophy

Test external behavior through public interfaces. Focus on user workflows and business logic, not implementation details.

### Test Coverage Goals

**Unit Tests** (30% of tests):

- Adherence calculation algorithm
- Risk stratification scoring
- Drug interaction checking logic
- Date/time utilities
- Data validation schemas

**Integration Tests** (50% of tests):

- Customer list with search/filter
- Profile view with all tabs
- Prescription timeline with interactions
- Clinical note creation workflow
- Communication sending workflow
- Insurance verification flow

**End-to-End Tests** (20% of tests):

- Complete patient onboarding flow
- Pharmacist intervention workflow
- MTM session documentation and billing
- Automated reminder campaign
- Emergency break-the-glass access

### Prior Art - Good Patterns

✓ **DataTable integration tests**: Test through user interactions (click, type, verify results)
✓ **Component composition**: Test parent components that compose children
✓ **React Query integration**: Test with real query client, not mocked
✓ **Form workflows**: Test complete submission flow, not individual field changes

### Prior Art - Anti-Patterns

✗ **Mocking internal collaborators**: Don't mock hooks or context providers
✗ **Testing implementation details**: Don't test state variables or private methods
✗ **Snapshot tests for UI**: Too brittle, prefer behavioral assertions
✗ **Testing library internals**: Don't test React Query cache directly

### Test Examples

**Good Integration Test**:

```typescript
test("pharmacist can document MTM session with billing code", async () => {
  const user = userEvent.setup();
  render(<CustomerProfileView customerId="123" />);

  // Navigate to clinical tab
  await user.click(screen.getByRole("tab", { name: /clinical/i }));

  // Open new note dialog
  await user.click(screen.getByRole("button", { name: /new note/i }));

  // Select MTM note type
  await user.selectOptions(screen.getByLabelText(/note type/i), "MTM");

  // Fill SOAP format
  await user.type(screen.getByLabelText(/subjective/i), "Patient reports difficulty remembering medications");
  await user.type(screen.getByLabelText(/objective/i), "Current medications: 8 active prescriptions");
  await user.type(screen.getByLabelText(/assessment/i), "Polypharmacy with adherence concerns");
  await user.type(screen.getByLabelText(/plan/i), "Recommend medication synchronization");

  // Add billing code
  await user.type(screen.getByLabelText(/billing code/i), "99605");

  // Save note
  await user.click(screen.getByRole("button", { name: /save/i }));

  // Verify note appears in list
  expect(await screen.findByText(/MTM Session/i)).toBeInTheDocument();
  expect(screen.getByText(/99605/i)).toBeInTheDocument();
});
```

**Good Unit Test**:

```typescript
test("calculatePDC returns correct proportion for overlapping fills", () => {
  const prescriptions = [
    { fill_date: "2024-01-01", days_supply: 30 },
    { fill_date: "2024-01-25", days_supply: 30 }, // 6 days overlap
  ];

  const pdc = calculatePDC(
    prescriptions,
    new Date("2024-01-01"),
    new Date("2024-01-31"),
  );

  // 30 days covered (not 60, due to overlap)
  expect(pdc).toBeCloseTo(30 / 31, 2);
});
```

---

## 🚫 Out of Scope

### Explicitly NOT Included

- Mobile app (desktop only for now)
- Patient portal (pharmacy staff view only)
- E-prescribing integration (EPCS)
- Inventory management integration (separate module)
- Point-of-sale integration (separate module)
- Multi-location synchronization (single pharmacy for now)
- Telemedicine/video consultations
- Lab result integration
- Prescription delivery tracking
- Medication packaging/blister pack management
- Compounding documentation
- Veterinary prescriptions
- International patient support
- Multi-language support (English only)
- Offline mode
- Print prescription labels
- Barcode scanning for patient lookup

### Future Enhancements (Not in This Epic)

- Patient mobile app for self-service
- Integration with EHR systems (Epic, Cerner)
- E-prescribing (EPCS) integration
- Multi-location support with data synchronization
- Advanced analytics dashboard for managers
- Predictive inventory management based on patient needs
- Telemedicine consultation integration
- Lab result integration and tracking
- Medication delivery tracking and logistics
- Automated prior authorization submission
- Clinical decision support system (CDSS)
- Population health management tools
- Value-based care reporting
- Social determinants of health tracking

---

## 📝 Further Notes

### Assumptions

- Single pharmacy location (no multi-location support)
- Desktop application (no mobile optimization)
- English language only
- US pharmacy regulations (DEA, HIPAA, Medicare)
- Staff users only (no patient self-service)
- Internet connectivity available (no offline mode)
- Modern browser (Chrome, Edge, Firefox latest versions)
- Existing authentication system in place
- Existing role/permission system can be extended
- Database is PostgreSQL (based on existing schema patterns)

### Constraints

- MUST comply with HIPAA privacy and security rules
- MUST comply with DEA regulations for controlled substances
- MUST support Medicare Star Ratings reporting requirements
- MUST use Windows Fluent Design system for UI consistency
- MUST follow existing schema conventions (snake_case, nullable)
- MUST integrate with existing DataTable architecture
- MUST maintain performance with 10,000+ customer records
- MUST support role-based access control
- MUST provide complete audit trails
- MUST encrypt PHI (Protected Health Information) at rest and in transit

### Risks & Mitigations

**Risk**: HIPAA compliance violations due to improper data handling

- Mitigation: Security audit by HIPAA compliance expert
- Mitigation: Comprehensive audit logging
- Mitigation: Encryption for all PHI
- Mitigation: Regular security training for development team

**Risk**: Drug interaction database accuracy and completeness

- Mitigation: Use reputable third-party database (First Databank, Lexicomp)
- Mitigation: Regular updates to interaction data
- Mitigation: Pharmacist override capability with documentation
- Mitigation: Disclaimer that system is decision support, not replacement for clinical judgment

**Risk**: Performance degradation with large datasets

- Mitigation: Database indexing strategy
- Mitigation: Pagination and lazy loading
- Mitigation: Caching for frequently accessed data
- Mitigation: Performance testing with realistic data volumes

**Risk**: Integration complexity with external services (SMS, email, eligibility)

- Mitigation: Abstract integrations behind service interfaces
- Mitigation: Graceful degradation if services unavailable
- Mitigation: Comprehensive error handling and logging
- Mitigation: Fallback to manual processes if automation fails

**Risk**: User adoption resistance from pharmacy staff

- Mitigation: Involve pharmacists in design process
- Mitigation: Comprehensive training program
- Mitigation: Gradual rollout with pilot users
- Mitigation: Gather feedback and iterate quickly

**Risk**: Adherence calculation accuracy

- Mitigation: Validate algorithm against industry standards
- Mitigation: Compare results with manual calculations
- Mitigation: Allow manual override with documentation
- Mitigation: Regular audits of calculated metrics

**Risk**: Communication opt-out compliance (TCPA, CAN-SPAM)

- Mitigation: Explicit opt-in for SMS and email
- Mitigation: Easy opt-out mechanism in every message
- Mitigation: Respect opt-out immediately
- Mitigation: Audit trail for consent management

### Technical Debt

- Current customer workspace uses mock data (addressed in Phase 1)
- No existing prescription data model (addressed in Phase 0)
- No communication infrastructure (addressed in Phase 6)
- No document storage system (needs S3 or local filesystem setup)
- No scheduled job infrastructure (needs cron or similar)
- Drug interaction database not yet selected (decision needed)
- SMS/email service providers not yet selected (decision needed)

### Dependencies

**Internal**:

- Existing authentication and session management
- Existing role and permission system
- Existing DataTable component library
- Existing Windows Fluent Design theme
- Database migration system
- API framework (assuming Express or similar)

**External**:

- SMS service (Twilio, AWS SNS, or similar)
- Email service (SendGrid, AWS SES, or similar)
- Insurance eligibility verification API (Availity, Change Healthcare, or similar)
- Drug interaction database (First Databank, Lexicomp, or similar)
- Document storage (AWS S3, Azure Blob, or local filesystem)
- Scheduled job system (node-cron, Bull, or similar)

### Regulatory Considerations

**HIPAA Compliance**:

- All PHI must be encrypted at rest (AES-256) and in transit (TLS 1.2+)
- Access controls must be role-based with least privilege principle
- Audit logs must capture all PHI access with user ID, timestamp, action
- Business Associate Agreements (BAA) required for all third-party services
- Breach notification procedures must be documented
- Regular risk assessments required

**DEA Compliance**:

- Controlled substance prescriptions must be tracked separately
- Photo ID verification required for controlled substance pickup
- Audit trail for all controlled substance dispensing
- Secure storage of controlled substance records

**Medicare Star Ratings**:

- PDC calculation must follow CMS methodology
- Measurement period: typically calendar year
- Medication classes: diabetes, hypertension, cholesterol
- Reporting requirements for Part D plans

**TCPA/CAN-SPAM Compliance**:

- Explicit opt-in required for SMS marketing
- Opt-out mechanism in every message
- Respect opt-out within 10 business days
- Identify sender in all messages

### Related Work

- Existing inventory management module (potential integration point)
- Existing POS module (potential integration point)
- Existing user/staff management system (extends for clinical roles)
- Existing DataTable component library (foundation for customer list)

---

## 🔗 Related Issues

(To be created via `/prd-to-issues` skill)

- Schema & database setup
- Customer list with DataTable integration
- Customer profile view with slide-out panel
- Prescription history timeline
- Drug interaction checking system
- Medication adherence tracking
- Clinical documentation (SOAP notes, MTM)
- Immunization records management
- Financial management (insurance, payments, loyalty)
- Communication hub (SMS, email, campaigns)
- Security & compliance (RBAC, audit logs, encryption)
- AI-powered features (predictive adherence, risk scoring)

---

## ✅ Verification Checklist

- [x] Problem statement reflects pharmacy-specific needs
- [x] User stories comprehensive and specific (52 stories across all personas)
- [x] Implementation decisions include confidence levels and alternatives
- [x] Assumptions and constraints documented
- [x] Scope clearly bounded (out of scope section)
- [x] Testing requirements specific and actionable
- [x] Good/bad patterns identified from codebase
- [x] Architecture decisions documented with rationale
- [x] Deep module design principles applied
- [x] Regulatory compliance requirements addressed (HIPAA, DEA, Medicare)
- [x] Security considerations documented
- [x] Performance considerations addressed
- [x] Integration points identified
- [x] Risk mitigation strategies defined
- [x] Success metrics measurable and realistic
- [x] Implementation phases logical and achievable
- [x] Follows UNDERSTAND → ANALYZE → STRATEGIZE → EXECUTE

---

**Priority**: High
**Estimated Timeline**: 7-9 weeks (272-368 hours)
**Complexity**: High
**Classification**: `hitl` (requires human interaction for architectural decisions, security review, regulatory compliance validation)

---

_This is a planning document. Source of truth will be GitHub issues created via `/prd-to-issues` skill._
