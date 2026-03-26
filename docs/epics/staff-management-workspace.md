# Professional Staff Management Workspace - PRD (Part 1: Overview & User Stories)

⚠️ **Planning Document. Source of truth: GitHub issues (to be created)**

## Quick Links

- **GitHub Issue**: (pending creation)
- **Milestone**: v2.0
- **Module**: `module:staff`
- **Labels**: `type:epic`, `priority:high`, `layer:full-stack`, `hitl`

---

## 🎯 Overview

Transform the comprehensive Staff Management Studio mockup into a fully functional, production-ready module with complete Tauri backend integration. This epic covers migrating all features from the mockup including staff profiles, credential tracking, attendance management, leave requests, and performance analytics.

**Business Value**: Enables pharmacy operations to manage their most critical asset - their professional staff. Ensures regulatory compliance (license tracking, credential expiry), optimizes workforce scheduling, tracks attendance and overtime, and provides data-driven insights for performance management.

**Design Philosophy**: Windows Fluent Design with professional healthcare aesthetics. Compliance-first approach with prominent visual warnings for expired credentials. Efficient layouts optimized for pharmacy manager workflows.

**Current State**: Comprehensive mockup (`apps/web/src/mockups/staff-management/StaffManagementStudio.tsx`) with 5,261 lines implementing all UI components, mock data, and interactions. No backend integration.

**Target State**: Fully functional staff management system with:

- Complete Tauri backend (Rust) with SeaORM entities and repositories
- TypeScript schema definitions in `packages/schema`
- Real-time data synchronization
- Automated compliance alerts
- Attendance tracking with clock-in/out
- Leave management workflow
- Performance analytics and reporting

---

## 🎭 User Stories

### Core Staff Profile Management (Stories 1-10)

1. As a pharmacy manager, I want to view a comprehensive staff directory with search and filters, so that I can quickly find and access staff information
2. As a pharmacy manager, I want to add new staff members with complete profile information (name, role, email, phone, branch), so that I can onboard employees efficiently
3. As a pharmacy manager, I want to edit staff profiles including role changes and contact updates, so that I can keep employee records current
4. As a pharmacy manager, I want to assign staff to specific branches, so that I can manage multi-location operations
5. As a pharmacy manager, I want to view staff avatars with initials-based fallbacks, so that I can quickly identify team members visually
6. As a pharmacy manager, I want to see staff duty status (On Duty/Off Duty/On Break) in real-time, so that I know who's currently working
7. As a pharmacy manager, I want to track staff competencies (Immunizations, Compounding, MTM, Counseling), so that I can assign tasks based on skills
8. As a pharmacy manager, I want to view staff compliance scores at a glance, so that I can identify compliance risks quickly
9. As a pharmacy manager, I want to filter staff by role (Pharmacist/Technician/Manager), so that I can view specific team segments
10. As a pharmacy manager, I want to toggle between list and grid views, so that I can choose my preferred visualization

### Credential & Compliance Management (Stories 11-20)

11. As a pharmacy manager, I want to track multiple credentials per staff member (Pharmacist License, DEA Registration, CPR Certification), so that I maintain complete compliance records
12. As a pharmacy manager, I want to see credential expiry status with color-coded indicators (valid/expiring/critical/expired), so that I can prioritize renewal actions
13. As a pharmacy manager, I want to receive visual alerts for credentials expiring within 90 days, so that I can proactively manage renewals
14. As a pharmacy manager, I want to see critical alerts for credentials expiring within 30 days, so that I can prevent compliance violations
15. As a pharmacy manager, I want to view expired credentials with clear visual warnings, so that I can immediately address compliance gaps
16. As a pharmacy manager, I want to upload credential documents (license scans, certificates), so that I maintain digital records
17. As a pharmacy manager, I want to track credential numbers with partial masking (last 4 digits visible), so that I balance security with usability
18. As a pharmacy manager, I want to see days remaining until credential expiry, so that I can plan renewal timelines
19. As a pharmacy manager, I want to filter credentials by status (valid/expiring/critical/expired), so that I can focus on urgent renewals
20. As a pharmacy manager, I want to export credential reports, so that I can provide compliance documentation to regulators

### Attendance Tracking - Live View (Stories 21-30)

21. As a pharmacy manager, I want to see who's currently on duty in real-time, so that I can manage shift coverage
22. As a pharmacy manager, I want to view staff organized by duty status (On Duty/On Break/Off Duty), so that I can quickly assess workforce availability
23. As a pharmacy manager, I want to see clock-in times for active staff, so that I can track shift start times
24. As a pharmacy manager, I want to view hours worked today for each staff member, so that I can monitor daily productivity
25. As a pharmacy manager, I want to see total hours clocked across all staff, so that I can track labor costs
26. As a pharmacy manager, I want to view overtime hours accumulated today, so that I can manage OT expenses
27. As a pharmacy manager, I want to see present vs absent counts, so that I can assess staffing levels at a glance
28. As a pharmacy manager, I want to click on staff to view detailed attendance records, so that I can investigate attendance patterns
29. As a pharmacy manager, I want to see break time tracking, so that I can ensure compliance with labor laws
30. As a pharmacy manager, I want to view a live activity feed of clock-in/out events, so that I can monitor workforce movements in real-time

### Attendance Tracking - Shift Schedule (Stories 31-40)

31. As a pharmacy manager, I want to define shift templates (Morning/Evening/Night), so that I can standardize scheduling
32. As a pharmacy manager, I want to view scheduled vs actual attendance, so that I can identify variances
33. As a pharmacy manager, I want to see late arrivals flagged with warnings, so that I can address punctuality issues
34. As a pharmacy manager, I want to track early departures, so that I can ensure full shift coverage
35. As a pharmacy manager, I want to view absence reasons (sick leave, day off), so that I understand staffing gaps
36. As a pharmacy manager, I want to see auto-closed shifts (forgot to clock out), so that I can correct attendance records
37. As a pharmacy manager, I want to compare today vs yesterday attendance, so that I can identify trends
38. As a pharmacy manager, I want to view break time deductions from worked hours, so that I calculate accurate payroll
39. As a pharmacy manager, I want to see overtime hours per shift, so that I can manage OT at the shift level
40. As a pharmacy manager, I want to view variance alerts (late/early/absent), so that I can take corrective action

### Leave Management (Stories 41-50)

41. As a staff member, I want to submit leave requests (Sick/Vacation/Personal/Emergency), so that I can request time off formally
42. As a staff member, I want to specify leave dates and duration, so that my manager knows exactly when I'll be absent
43. As a staff member, I want to provide a reason for my leave request, so that my manager understands the context
44. As a pharmacy manager, I want to see pending leave requests with approval/rejection buttons, so that I can process requests efficiently
45. As a pharmacy manager, I want to view leave request history with status (pending/approved/rejected), so that I can track leave patterns
46. As a pharmacy manager, I want to see leave balance per staff member, so that I can ensure fair leave allocation
47. As a pharmacy manager, I want to filter leave requests by status, so that I can focus on pending approvals
48. As a pharmacy manager, I want to view leave requests by staff member, so that I can see individual leave history
49. As a pharmacy manager, I want to see leave balance warnings when staff have low remaining days, so that I can plan coverage
50. As a pharmacy manager, I want to approve/reject leave requests with one click, so that I can process requests quickly

### Performance Analytics (Stories 51-60)

51. As a pharmacy manager, I want to view attendance rate trends (daily/weekly), so that I can identify attendance patterns
52. As a pharmacy manager, I want to see punctuality scores per staff member, so that I can recognize reliable employees
53. As a pharmacy manager, I want to view overtime hours by staff, so that I can manage OT costs and workload distribution
54. As a pharmacy manager, I want to see total hours worked per day, so that I can track labor utilization
55. As a pharmacy manager, I want to view late arrival and early departure counts, so that I can identify attendance issues
56. As a pharmacy manager, I want to see a punctuality leaderboard, so that I can gamify attendance and recognize top performers
57. As a pharmacy manager, I want to export payroll data (hours worked, OT hours), so that I can integrate with payroll systems
58. As a pharmacy manager, I want to view attendance KPIs (attendance rate, OT hours, late count), so that I can monitor workforce metrics
59. As a pharmacy manager, I want to see attendance trends over time, so that I can identify seasonal patterns
60. As a pharmacy manager, I want to view performance metrics per staff member, so that I can conduct data-driven performance reviews

### Detail Panel & Navigation (Stories 61-70)

61. As a pharmacy manager, I want to click on a staff member to open a detail panel, so that I can view comprehensive information
62. As a pharmacy manager, I want the detail panel to slide in from the right, so that I maintain context with the staff list
63. As a pharmacy manager, I want to see tabbed navigation in the detail panel (Profile/Credentials/Attendance/Metrics), so that I can access different information categories
64. As a pharmacy manager, I want to close the detail panel with an X button, so that I can return to the staff list
65. As a pharmacy manager, I want to view staff profile information in the detail panel (name, role, contact, branch), so that I can see basic details
66. As a pharmacy manager, I want to see credential details in the detail panel, so that I can review compliance status
67. As a pharmacy manager, I want to view attendance history in the detail panel, so that I can see individual attendance patterns
68. As a pharmacy manager, I want to see performance metrics in the detail panel, so that I can review individual performance
69. As a pharmacy manager, I want to perform quick actions from the detail panel (clock in/out, submit leave), so that I can manage staff efficiently
70. As a pharmacy manager, I want to edit staff information from the detail panel, so that I can update records without leaving the view

### Audit Trail & Compliance (Stories 71-75)

71. As a pharmacy manager, I want to view an audit trail of all staff profile changes, so that I can track who made what changes
72. As a pharmacy manager, I want to see credential update history, so that I can verify renewal activities
73. As a pharmacy manager, I want to track attendance adjustments with reasons, so that I maintain accurate records
74. As a pharmacy manager, I want to see who approved/rejected leave requests, so that I can maintain accountability
75. As a pharmacy manager, I want to export audit logs, so that I can provide compliance documentation

---

## 📐 Architecture Overview (Part 2: Technical Design)

### System Context

```
┌─────────────────────────────────────────────────────────────────┐
│              Staff Management Workspace (Frontend)               │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Overview   │  │    Staff     │  │ Credentials  │         │
│  │  Dashboard   │  │  Directory   │  │   Tracker    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Attendance  │  │    Leave     │  │   Metrics    │         │
│  │   Tracking   │  │  Management  │  │  Analytics   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└────────────┬─────────────────────────────────────────────────┘
             │ Tauri IPC (invoke)
             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Tauri Backend (Rust)                          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              tauri-commands/staff                         │  │
│  │  - StaffOperation enum                                    │  │
│  │  - StaffResponse enum                                     │  │
│  │  - staff() command handler                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         infrastructure/staff (Repositories)               │  │
│  │  - StaffMemberRepository (extends existing)               │  │
│  │  - CredentialRepository                                   │  │
│  │  - AttendanceRecordRepository                             │  │
│  │  - LeaveRequestRepository                                 │  │
│  │  - ShiftTemplateRepository                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         infrastructure/staff (Entities - SeaORM)          │  │
│  │  - StaffMember (extend existing)                          │  │
│  │  - Credential                                             │  │
│  │  - AttendanceRecord                                       │  │
│  │  - LeaveRequest                                           │  │
│  │  - ShiftTemplate                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│                           ▼                                      │
│                    PostgreSQL Database                           │
└─────────────────────────────────────────────────────────────────┘
```

### Layers Involved

**Schema/Database** (`packages/schema/src/staff/`):

- Extend existing `staffMemberSchema` with new fields
- Create new schemas: `credentialSchema`, `attendanceRecordSchema`, `leaveRequestSchema`, `shiftTemplateSchema`, `competencySchema`
- Follow existing conventions: snake_case, nullable fields, idSchema, dateTimeSchema

**Infrastructure/Entities** (`apps/desktop/crates/infrastructure/src/staff/entities/`):

- Extend `staff_member.rs` with new fields (phone, photo_url, competencies)
- Create new entities: `credential.rs`, `attendance_record.rs`, `leave_request.rs`, `shift_template.rs`
- Follow SeaORM patterns: DeriveEntityModel, Relations, ActiveModelBehavior

**Infrastructure/Repositories** (`apps/desktop/crates/infrastructure/src/staff/repositories/`):

- Extend `staff_member_repository.rs` with new queries
- Create new repositories: `credential_repository.rs`, `attendance_record_repository.rs`, `leave_request_repository.rs`, `shift_template_repository.rs`
- Follow existing patterns: find_all, find_by_id, create, update, delete

**Tauri Commands** (`apps/desktop/crates/tauri-commands/src/staff/`):

- Create new module: `staff/mod.rs`, `staff/operations.rs`
- Define `StaffOperation` enum with all operations
- Define `StaffResponse` enum with all response types
- Implement `staff()` command handler

**UI/Component** (`apps/web/src/features/modules/staff/`):

- Migrate mockup from `mockups/staff-management/` to `features/modules/staff/`
- Replace mock data with Tauri invoke calls
- Implement React Query hooks for data fetching
- Follow Windows Fluent Design patterns

**Integration Points**:

- Frontend ↔ Tauri IPC (invoke "staff" command)
- Tauri Commands ↔ Repositories (database operations)
- Repositories ↔ SeaORM Entities (ORM mapping)
- SeaORM ↔ PostgreSQL (database queries)

---

## 🗄️ Database Schema Design

### Design Principles

Following the existing SCHEMA_DESIGN.md principles:

- Third Normal Form (3NF) compliance
- UUID v7 primary keys (time-ordered)
- Foreign key constraints for referential integrity
- Indexed columns for frequently filtered fields
- Timestamps (created_at, updated_at) on all tables
- Soft deletes (is_active flags)

### Entity Relationship Diagram

```
┌─────────────────┐
│ staff_members   │ (Extend existing table)
│  (Core Profile) │
└────────┬────────┘
         │ 1:N
         ├──────────────────────────────────┐
         │                                   │
         │ 1:N                               │ 1:N
┌────────▼────────┐                 ┌───────▼────────┐
│  credentials    │                 │ competencies   │
│ (License, DEA)  │                 │ (Skills)       │
└─────────────────┘                 └────────────────┘
         │
         │ 1:N
┌────────▼────────────┐
│ attendance_records  │
│ (Clock in/out)      │
└─────────────────────┘
         │
         │ 1:N
┌────────▼────────────┐
│  leave_requests     │
│ (Vacation, Sick)    │
└─────────────────────┘

┌─────────────────┐
│ shift_templates │ (Master data)
└─────────────────┘
```

### Table Definitions

#### 1. staff_members (Extend Existing)

**Purpose**: Core staff profile information
**Changes**: Add new fields to existing table

```sql
-- Existing fields (from staff_member.rs):
-- id, employee_id, first_name, last_name, email, position,
-- department, branch_id, hire_date, is_active, created_at, updated_at

-- NEW FIELDS TO ADD:
ALTER TABLE staff_members ADD COLUMN phone VARCHAR(50);
ALTER TABLE staff_members ADD COLUMN photo_url TEXT;
ALTER TABLE staff_members ADD COLUMN duty_status VARCHAR(20) DEFAULT 'Off Duty';
  -- Enum: 'On Duty', 'Off Duty', 'On Break'
ALTER TABLE staff_members ADD COLUMN clocked_in_at TIMESTAMPTZ;
ALTER TABLE staff_members ADD COLUMN compliance_score INTEGER DEFAULT 100;
  -- 0-100 score based on credential status
ALTER TABLE staff_members ADD COLUMN last_active TIMESTAMPTZ;
ALTER TABLE staff_members ADD COLUMN punctuality_score INTEGER DEFAULT 100;
  -- 0-100 score based on attendance history

-- Indexes
CREATE INDEX idx_staff_duty_status ON staff_members(duty_status);
CREATE INDEX idx_staff_branch ON staff_members(branch_id);
CREATE INDEX idx_staff_active ON staff_members(is_active);
```

#### 2. credentials (New Table)

**Purpose**: Track professional licenses, certifications, and credentials
**3NF**: ✅ All attributes depend only on id

```sql
CREATE TABLE credentials (
    id UUID PRIMARY KEY,
    staff_member_id UUID NOT NULL REFERENCES staff_members(id) ON DELETE CASCADE,

    -- Credential details
    credential_type VARCHAR(100) NOT NULL,
      -- e.g., "Pharmacist License", "DEA Registration", "CPR Certification"
    credential_number VARCHAR(100) NOT NULL,
    issuing_authority VARCHAR(200),

    -- Dates
    issue_date DATE,
    expiry_date DATE NOT NULL,

    -- Status (computed from expiry_date)
    status VARCHAR(20) NOT NULL DEFAULT 'valid',
      -- Enum: 'valid', 'expiring', 'critical', 'expired'
      -- valid: >90 days, expiring: 30-90 days, critical: <30 days, expired: past expiry
    days_until_expiry INTEGER,
      -- Computed field, updated daily

    -- Document storage
    document_url TEXT,
      -- Path to uploaded credential document

    -- Verification
    verified_by UUID REFERENCES staff_members(id),
    verified_at TIMESTAMPTZ,

    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT uk_credential UNIQUE (staff_member_id, credential_type, credential_number)
);

-- Indexes
CREATE INDEX idx_credentials_staff ON credentials(staff_member_id);
CREATE INDEX idx_credentials_expiry ON credentials(expiry_date);
CREATE INDEX idx_credentials_status ON credentials(status);
CREATE INDEX idx_credentials_type ON credentials(credential_type);
```

#### 3. competencies (New Table)

**Purpose**: Track staff skills and competencies
**3NF**: ✅ Many-to-many relationship via junction table

```sql
CREATE TABLE competencies (
    id UUID PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
      -- e.g., "Immunizations", "Compounding", "MTM", "Counseling"
    description TEXT,
    category VARCHAR(50),
      -- e.g., "Clinical", "Technical", "Administrative"
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE staff_competencies (
    id UUID PRIMARY KEY,
    staff_member_id UUID NOT NULL REFERENCES staff_members(id) ON DELETE CASCADE,
    competency_id UUID NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
    proficiency_level VARCHAR(20) DEFAULT 'Competent',
      -- Enum: 'Beginner', 'Competent', 'Proficient', 'Expert'
    acquired_date DATE,
    last_assessed_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT uk_staff_competency UNIQUE (staff_member_id, competency_id)
);

-- Indexes
CREATE INDEX idx_staff_competencies_staff ON staff_competencies(staff_member_id);
CREATE INDEX idx_staff_competencies_competency ON staff_competencies(competency_id);
```

#### 4. shift_templates (New Table)

**Purpose**: Define standard shift patterns
**3NF**: ✅ Master data, no transitive dependencies

```sql
CREATE TABLE shift_templates (
    id UUID PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
      -- e.g., "Morning", "Evening", "Night"
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_hours DECIMAL(4,2) NOT NULL,
      -- Computed: end_time - start_time
    color VARCHAR(7),
      -- Hex color for UI display
    icon VARCHAR(50),
      -- Icon identifier for UI
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

-- Indexes
CREATE INDEX idx_shift_templates_active ON shift_templates(is_active);
```

#### 5. attendance_records (New Table)

**Purpose**: Track clock-in/out events and attendance
**3NF**: ✅ Immutable audit trail, append-only

```sql
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY,
    staff_member_id UUID NOT NULL REFERENCES staff_members(id) ON DELETE CASCADE,
    shift_template_id UUID REFERENCES shift_templates(id),

    -- Date
    attendance_date DATE NOT NULL,

    -- Scheduled times
    scheduled_start TIME,
    scheduled_end TIME,

    -- Actual times
    actual_clock_in TIMESTAMPTZ,
    actual_clock_out TIMESTAMPTZ,

    -- Break tracking
    break_start TIMESTAMPTZ,
    break_end TIMESTAMPTZ,
    break_duration_minutes INTEGER DEFAULT 0,

    -- Calculated fields
    hours_worked DECIMAL(4,2) DEFAULT 0,
      -- Computed: (actual_clock_out - actual_clock_in) - break_duration
    overtime_hours DECIMAL(4,2) DEFAULT 0,
      -- Computed: max(0, hours_worked - scheduled_hours)

    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'present',
      -- Enum: 'present', 'late', 'early_departure', 'absent', 'auto_closed'

    -- Variance tracking
    late_minutes INTEGER DEFAULT 0,
      -- Computed: actual_clock_in - scheduled_start (if positive)
    early_departure_minutes INTEGER DEFAULT 0,
      -- Computed: scheduled_end - actual_clock_out (if positive)

    -- Location tracking (optional)
    clock_in_location_lat DECIMAL(10,8),
    clock_in_location_lng DECIMAL(11,8),
    clock_out_location_lat DECIMAL(10,8),
    clock_out_location_lng DECIMAL(11,8),

    notes TEXT,
    adjusted_by UUID REFERENCES staff_members(id),
      -- Manager who adjusted the record
    adjusted_at TIMESTAMPTZ,
    adjustment_reason TEXT,

    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT uk_attendance UNIQUE (staff_member_id, attendance_date)
);

-- Indexes
CREATE INDEX idx_attendance_staff ON attendance_records(staff_member_id);
CREATE INDEX idx_attendance_date ON attendance_records(attendance_date);
CREATE INDEX idx_attendance_status ON attendance_records(status);
CREATE INDEX idx_attendance_shift ON attendance_records(shift_template_id);
```

#### 6. leave_requests (New Table)

**Purpose**: Manage leave/time-off requests
**3NF**: ✅ All attributes depend only on id

```sql
CREATE TABLE leave_requests (
    id UUID PRIMARY KEY,
    staff_member_id UUID NOT NULL REFERENCES staff_members(id) ON DELETE CASCADE,

    -- Leave details
    leave_type VARCHAR(50) NOT NULL,
      -- Enum: 'Sick Leave', 'Vacation', 'Personal', 'Emergency', 'Bereavement'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_count INTEGER NOT NULL,
      -- Computed: business days between start_date and end_date

    reason TEXT NOT NULL,

    -- Approval workflow
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
      -- Enum: 'pending', 'approved', 'rejected'
    approved_by UUID REFERENCES staff_members(id),
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,

    -- Document attachment (e.g., medical certificate)
    document_url TEXT,

    submitted_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

-- Indexes
CREATE INDEX idx_leave_staff ON leave_requests(staff_member_id);
CREATE INDEX idx_leave_status ON leave_requests(status);
CREATE INDEX idx_leave_dates ON leave_requests(start_date, end_date);
CREATE INDEX idx_leave_type ON leave_requests(leave_type);
```

#### 7. leave_balances (New Table)

**Purpose**: Track leave balance per staff member
**3NF**: ✅ Denormalized for performance, updated via triggers

```sql
CREATE TABLE leave_balances (
    id UUID PRIMARY KEY,
    staff_member_id UUID NOT NULL REFERENCES staff_members(id) ON DELETE CASCADE,

    -- Balance tracking
    leave_type VARCHAR(50) NOT NULL,
      -- e.g., 'Vacation', 'Sick Leave'
    total_days INTEGER NOT NULL,
      -- Annual allocation
    used_days INTEGER NOT NULL DEFAULT 0,
      -- Days used this year
    remaining_days INTEGER NOT NULL,
      -- Computed: total_days - used_days

    -- Period
    year INTEGER NOT NULL,

    last_updated TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT uk_leave_balance UNIQUE (staff_member_id, leave_type, year)
);

-- Indexes
CREATE INDEX idx_leave_balance_staff ON leave_balances(staff_member_id);
CREATE INDEX idx_leave_balance_year ON leave_balances(year);
```

---

## 🔧 Implementation Decisions (Part 3: Technical Approach)

### Decision 1: Extend Existing Staff Infrastructure vs Create New Module

**Approach**: Extend existing `staff_member` entity and repositories, create new related entities

**Confidence Level**: 95%

**Key Assumptions**:

- Existing `staff_members` table has core fields (id, employee_id, first_name, last_name, email, position, department, branch_id, hire_date)
- Existing `StaffMemberRepository` has basic CRUD operations
- New fields can be added via migration without breaking existing functionality
- Related entities (credentials, attendance) are separate tables with foreign keys

**Would Change If**: Existing staff_member structure is incompatible → create new staff module from scratch

**Rationale**:

- ✓ Leverages existing infrastructure (user/staff_member entities and repositories)
- ✓ Maintains consistency with existing codebase patterns
- ✓ Avoids duplication of core staff profile logic
- ✓ Follows DRY principle

**Implementation Path**:

1. Add new fields to `staff_members` table via migration
2. Update `StaffMemberModel` in `infrastructure/src/user/entities/staff_member.rs`
3. Extend `StaffMemberRepository` with new query methods
4. Create new entities: `Credential`, `AttendanceRecord`, `LeaveRequest`, `ShiftTemplate`
5. Create new repositories for each entity
6. Create new Tauri command module: `tauri-commands/src/staff/`

---

### Decision 2: Tauri Command Structure - Unified vs Separate Commands

**Approach**: Create unified `staff()` command with operation enum (following existing inventory pattern)

**Confidence Level**: 95%

**Key Assumptions**:

- Frontend makes single IPC call per operation
- Backend routes to appropriate repository based on operation type
- Response type is determined by operation
- Follows existing pattern in `tauri-commands/src/inventory/operations.rs`

**Would Change If**: Performance issues with large payloads → split into separate commands per entity

**Command Structure**:

```rust
// tauri-commands/src/staff/operations.rs

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", content = "payload")]
pub enum StaffOperation {
    // Staff Member Operations
    GetAllStaffMembers,
    GetStaffMemberById(Id),
    GetStaffMembersByBranch(Id),
    GetActiveStaffMembers,
    CreateStaffMember(CreateStaffMemberPayload),
    UpdateStaffMember(UpdateStaffMemberPayload),
    UpdateDutyStatus { id: Id, status: String },
    ClockIn { id: Id, location: Option<(f64, f64)> },
    ClockOut { id: Id, location: Option<(f64, f64)> },
    StartBreak(Id),
    EndBreak(Id),

    // Credential Operations
    GetCredentialsByStaff(Id),
    GetExpiringCredentials { days_threshold: i32 },
    GetExpiredCredentials,
    CreateCredential(CreateCredentialPayload),
    UpdateCredential(UpdateCredentialPayload),
    DeleteCredential(Id),

    // Competency Operations
    GetCompetenciesByStaff(Id),
    GetAllCompetencies,
    AddCompetencyToStaff { staff_id: Id, competency_id: Id },
    RemoveCompetencyFromStaff { staff_id: Id, competency_id: Id },

    // Attendance Operations
    GetAttendanceByStaff { staff_id: Id, start_date: Date, end_date: Date },
    GetAttendanceByDate(Date),
    GetAttendanceByDateRange { start_date: Date, end_date: Date },
    CreateAttendanceRecord(CreateAttendancePayload),
    UpdateAttendanceRecord(UpdateAttendancePayload),
    AdjustAttendance { id: Id, reason: String, adjusted_by: Id },

    // Leave Request Operations
    GetLeaveRequestsByStaff(Id),
    GetPendingLeaveRequests,
    GetLeaveRequestsByStatus(String),
    CreateLeaveRequest(CreateLeaveRequestPayload),
    ApproveLeaveRequest { id: Id, approved_by: Id },
    RejectLeaveRequest { id: Id, rejected_by: Id, reason: String },

    // Leave Balance Operations
    GetLeaveBalanceByStaff { staff_id: Id, year: i32 },
    UpdateLeaveBalance(UpdateLeaveBalancePayload),

    // Shift Template Operations
    GetAllShiftTemplates,
    GetActiveShiftTemplates,
    CreateShiftTemplate(CreateShiftTemplatePayload),

    // Analytics Operations
    GetAttendanceMetrics { branch_id: Option<Id>, start_date: Date, end_date: Date },
    GetPunctualityScores { branch_id: Option<Id> },
    GetOvertimeReport { branch_id: Option<Id>, start_date: Date, end_date: Date },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum StaffResponse {
    StaffMembers(Vec<StaffMemberModel>),
    StaffMember(Option<StaffMemberModel>),
    Credentials(Vec<CredentialModel>),
    Credential(Option<CredentialModel>),
    Competencies(Vec<CompetencyModel>),
    StaffCompetencies(Vec<StaffCompetencyModel>),
    AttendanceRecords(Vec<AttendanceRecordModel>),
    AttendanceRecord(Option<AttendanceRecordModel>),
    LeaveRequests(Vec<LeaveRequestModel>),
    LeaveRequest(Option<LeaveRequestModel>),
    LeaveBalances(Vec<LeaveBalanceModel>),
    LeaveBalance(Option<LeaveBalanceModel>),
    ShiftTemplates(Vec<ShiftTemplateModel>),
    AttendanceMetrics(AttendanceMetricsPayload),
    PunctualityScores(Vec<PunctualityScorePayload>),
    OvertimeReport(OvertimeReportPayload),
    Success { message: String },
}

#[tauri::command]
pub async fn staff(
    container: State<'_, ServiceContainer>,
    operation: StaffOperation,
) -> Result<StaffResponse> {
    // Route to appropriate repository based on operation
    // Return typed response
}
```

**Rationale**:

- ✓ Follows existing inventory command pattern
- ✓ Single entry point for all staff operations
- ✓ Type-safe operation dispatch
- ✓ Easy to extend with new operations
- ✓ Consistent error handling

---

### Decision 3: Credential Status Calculation - Real-time vs Cached

**Approach**: Cached status with daily background job update

**Confidence Level**: 85%

**Key Assumptions**:

- Credential status doesn't need real-time accuracy (daily updates sufficient)
- Background job runs at 2 AM daily
- Status computed from expiry_date: >90 days = valid, 30-90 = expiring, <30 = critical, past = expired
- Frontend displays cached status for performance

**Would Change If**: Real-time status required → compute on-demand in repository queries

**Status Calculation Logic**:

```rust
// infrastructure/src/staff/services/credential_service.rs

pub fn calculate_credential_status(expiry_date: &Date) -> (String, i32) {
    let today = Date::today();
    let days_until_expiry = (expiry_date - today).num_days();

    let status = if days_until_expiry < 0 {
        "expired"
    } else if days_until_expiry < 30 {
        "critical"
    } else if days_until_expiry < 90 {
        "expiring"
    } else {
        "valid"
    };

    (status.to_string(), days_until_expiry as i32)
}

// Background job (runs daily at 2 AM)
pub async fn update_all_credential_statuses(db: &DatabaseConnection) -> Result<()> {
    let credentials = CredentialRepository::new(db.clone()).find_all().await?;

    for credential in credentials {
        let (status, days_until_expiry) = calculate_credential_status(&credential.expiry_date);

        // Update credential status
        CredentialRepository::new(db.clone())
            .update_status(credential.id, status, days_until_expiry)
            .await?;
    }

    Ok(())
}
```

**Rationale**:

- ✓ Performance: No computation on every query
- ✓ Consistency: All credentials updated at same time
- ✓ Simplicity: Status stored in database, easy to filter
- ✗ Slight delay: Status updated once daily (acceptable for compliance tracking)

---

### Decision 4: Attendance Clock-In/Out - Optimistic vs Pessimistic Locking

**Approach**: Optimistic locking with unique constraint on (staff_member_id, attendance_date)

**Confidence Level**: 90%

**Key Assumptions**:

- Staff member can only have one attendance record per day
- Clock-in/out operations are infrequent (not high-concurrency)
- Database unique constraint prevents duplicate records
- Frontend handles constraint violation gracefully

**Would Change If**: High concurrency issues → use pessimistic locking with SELECT FOR UPDATE

**Clock-In Flow**:

```rust
// infrastructure/src/staff/repositories/attendance_record_repository.rs

pub async fn clock_in(
    &self,
    staff_member_id: &Id,
    scheduled_start: Option<Time>,
    scheduled_end: Option<Time>,
    shift_template_id: Option<Id>,
    location: Option<(f64, f64)>,
) -> Result<AttendanceRecordModel> {
    let today = Date::today();

    // Check if already clocked in today
    if let Some(existing) = self.find_by_staff_and_date(staff_member_id, &today).await? {
        if existing.actual_clock_in.is_some() {
            return Err(AppError::Validation("Already clocked in today".to_string()));
        }
    }

    // Create or update attendance record
    let record = AttendanceRecordModel {
        id: Id::new(),
        staff_member_id: *staff_member_id,
        shift_template_id,
        attendance_date: today,
        scheduled_start,
        scheduled_end,
        actual_clock_in: Some(DateTime::now()),
        actual_clock_out: None,
        clock_in_location_lat: location.map(|(lat, _)| lat),
        clock_in_location_lng: location.map(|(_, lng)| lng),
        status: "present".to_string(),
        // ... other fields
    };

    self.create(record).await
}
```

**Rationale**:

- ✓ Simple implementation
- ✓ Database enforces uniqueness
- ✓ No deadlock risk
- ✓ Sufficient for typical pharmacy operations (5-20 staff)

---

### Decision 5: Leave Balance Tracking - Event Sourcing vs Snapshot

**Approach**: Snapshot with computed balance (denormalized)

**Confidence Level**: 85%

**Key Assumptions**:

- Leave balance updated when leave request is approved
- Balance recalculated annually (reset on Jan 1)
- Snapshot stored in `leave_balances` table for performance
- Audit trail maintained in `leave_requests` table

**Would Change If**: Complex leave accrual rules → use event sourcing with accrual events

**Balance Update Logic**:

```rust
// infrastructure/src/staff/services/leave_service.rs

pub async fn approve_leave_request(
    &self,
    leave_request_id: &Id,
    approved_by: &Id,
) -> Result<()> {
    let leave_request = self.leave_request_repo.find_by_id(leave_request_id).await?
        .ok_or(AppError::NotFound("Leave request not found".to_string()))?;

    // Update leave request status
    self.leave_request_repo.approve(leave_request_id, approved_by).await?;

    // Update leave balance
    let balance = self.leave_balance_repo
        .find_by_staff_and_type(
            &leave_request.staff_member_id,
            &leave_request.leave_type,
            &Date::today().year(),
        )
        .await?
        .ok_or(AppError::NotFound("Leave balance not found".to_string()))?;

    let new_used_days = balance.used_days + leave_request.days_count;
    let new_remaining_days = balance.total_days - new_used_days;

    self.leave_balance_repo.update_balance(
        balance.id,
        new_used_days,
        new_remaining_days,
    ).await?;

    Ok(())
}
```

**Rationale**:

- ✓ Fast queries: Balance pre-computed
- ✓ Simple logic: Addition/subtraction only
- ✓ Audit trail: Leave requests maintain history
- ✗ Potential inconsistency: Balance could drift (mitigated by annual reset)

---

### Decision 6: Frontend State Management - React Query vs Zustand

**Approach**: React Query for server state, local useState for UI state

**Confidence Level**: 95%

**Key Assumptions**:

- Server state (staff data, attendance, credentials) managed by React Query
- UI state (selected staff, panel open/closed, filters) managed by useState
- React Query handles caching, refetching, optimistic updates
- No need for global state management (Zustand/Redux)

**Would Change If**: Complex cross-component state → add Zustand for global UI state

**React Query Hook Pattern**:

```typescript
// apps/web/src/features/modules/staff/hooks/useStaffMembers.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/core";
import type { StaffMember } from "@pharos/schema";

export function useStaffMembers(branchId?: string) {
  return useQuery({
    queryKey: ["staff", "members", branchId],
    queryFn: async () => {
      const operation = branchId
        ? { type: "GetStaffMembersByBranch", payload: branchId }
        : { type: "GetAllStaffMembers" };

      const response = await invoke<StaffMember[]>("staff", { operation });
      return response;
    },
  });
}

export function useUpdateDutyStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const operation = {
        type: "UpdateDutyStatus",
        payload: { id, status },
      };

      await invoke("staff", { operation });
    },
    onSuccess: () => {
      // Invalidate staff queries to refetch
      queryClient.invalidateQueries({ queryKey: ["staff", "members"] });
    },
  });
}
```

**Rationale**:

- ✓ React Query handles caching, refetching, loading states
- ✓ Optimistic updates for better UX
- ✓ Automatic background refetching
- ✓ No boilerplate for global state
- ✓ Follows existing patterns in codebase

---

### Decision 7: Attendance Analytics - Pre-computed vs On-Demand

**Approach**: On-demand computation with query optimization

**Confidence Level**: 75%

**Key Assumptions**:

- Analytics queries are infrequent (dashboard views, reports)
- Database can handle aggregation queries efficiently
- Date range filters limit query scope
- Indexes on attendance_date and staff_member_id optimize queries

**Would Change If**: Performance issues with large datasets → pre-compute daily/weekly aggregates

**Analytics Query Pattern**:

```rust
// infrastructure/src/staff/repositories/attendance_record_repository.rs

pub async fn get_attendance_metrics(
    &self,
    branch_id: Option<&Id>,
    start_date: &Date,
    end_date: &Date,
) -> Result<AttendanceMetrics> {
    // Query with joins and aggregations
    let query = AttendanceRecordEntity::find()
        .filter(Column::AttendanceDate.between(*start_date, *end_date));

    // Filter by branch if provided
    let query = if let Some(branch_id) = branch_id {
        query.inner_join(StaffMemberEntity)
            .filter(staff_member::Column::BranchId.eq(*branch_id))
    } else {
        query
    };

    let records = query.all(&self.db).await?;

    // Compute metrics
    let total_records = records.len();
    let present_count = records.iter().filter(|r| r.status == "present").count();
    let late_count = records.iter().filter(|r| r.status == "late").count();
    let total_hours: f64 = records.iter().map(|r| r.hours_worked).sum();
    let total_ot: f64 = records.iter().map(|r| r.overtime_hours).sum();

    Ok(AttendanceMetrics {
        attendance_rate: (present_count as f64 / total_records as f64) * 100.0,
        total_hours_worked: total_hours,
        total_overtime_hours: total_ot,
        late_arrivals: late_count,
        // ... other metrics
    })
}
```

**Alternative Approach** (if performance issues):

- Pre-compute daily aggregates in `attendance_metrics` table
- Background job runs nightly
- Dashboard queries read from aggregates table
- Confidence: 60%

**Rationale**:

- ✓ Simpler implementation (no background jobs)
- ✓ Always up-to-date (no stale data)
- ✓ Flexible queries (any date range)
- ✗ Slower for large datasets (mitigated by date range filters)

---

## ✅ Acceptance Criteria (Part 4: Success Metrics)

### Phase 0: Foundation - Schema & Infrastructure

- [ ] Database migration created for new tables (credentials, attendance_records, leave_requests, shift_templates, competencies, staff_competencies, leave_balances)
- [ ] Database migration created for extending staff_members table with new fields
- [ ] All SeaORM entities created with proper relations
- [ ] All repositories created with CRUD operations
- [ ] Tauri command module created with StaffOperation and StaffResponse enums
- [ ] TypeScript schemas created in packages/schema/src/staff/
- [ ] All schemas follow snake_case convention
- [ ] Foreign key constraints properly defined
- [ ] Indexes created on frequently queried columns
- [ ] Migration can be applied and rolled back successfully

### Phase 1: Core Staff Management

- [ ] Staff directory displays real data from database (not mock data)
- [ ] Staff list supports sorting by name, role, compliance score
- [ ] Staff list supports filtering by role, duty status, branch
- [ ] Search works across name, email, employee_id with fuzzy matching
- [ ] Click staff row opens detail panel with slide-out animation
- [ ] Detail panel shows complete profile: name, role, email, phone, branch, hire date
- [ ] Avatar displays with initials-based fallback
- [ ] Duty status badge displays correctly (On Duty/Off Duty/On Break)
- [ ] List/Grid view toggle works
- [ ] Add new staff member form validates required fields
- [ ] Edit staff member updates database and refreshes UI
- [ ] Soft delete (is_active = false) works for staff members

### Phase 2: Credential Management

- [ ] Credentials tab displays all credentials for selected staff
- [ ] Credential status calculated correctly (valid/expiring/critical/expired)
- [ ] Color-coded status indicators display (green/yellow/red/gray)
- [ ] Days until expiry calculated and displayed
- [ ] Filter credentials by status works
- [ ] Add new credential form validates required fields (type, number, expiry date)
- [ ] Upload credential document stores file and saves URL
- [ ] Credential expiry alerts show in overview dashboard
- [ ] Export credentials report generates CSV
- [ ] Background job updates credential status daily
- [ ] Expired credentials show prominent warning banner

### Phase 3: Attendance Tracking - Live View

- [ ] Live view shows current duty status for all staff
- [ ] Staff organized by duty status (On Duty/On Break/Off Duty)
- [ ] Clock-in button creates attendance record with timestamp
- [ ] Clock-out button updates attendance record and calculates hours worked
- [ ] Start break button updates duty status and records break start time
- [ ] End break button calculates break duration
- [ ] Hours worked calculated correctly (clock_out - clock_in - break_duration)
- [ ] Overtime hours calculated when hours_worked > scheduled_hours
- [ ] Live activity feed shows recent clock-in/out events
- [ ] KPI cards display: present count, absent count, total hours, OT hours
- [ ] Geolocation captured on clock-in/out (if enabled)
- [ ] Cannot clock in twice on same day (unique constraint enforced)

### Phase 4: Attendance Tracking - Shift Schedule

- [ ] Shift templates display (Morning/Evening/Night)
- [ ] Scheduled vs actual attendance comparison shows variances
- [ ] Late arrivals flagged when actual_clock_in > scheduled_start + 10 min
- [ ] Early departures flagged when actual_clock_out < scheduled_end - 15 min
- [ ] Absence status shows for staff who didn't clock in
- [ ] Auto-closed status shows for shifts without clock-out
- [ ] Today/Yesterday toggle switches date view
- [ ] Attendance table shows: staff, scheduled times, actual times, break, hours, status
- [ ] Variance alerts display with reasons (late/early/absent)
- [ ] Click staff row in attendance table opens detail panel

### Phase 5: Leave Management

- [ ] Leave request form validates required fields (type, dates, reason)
- [ ] Leave request calculates business days between start and end dates
- [ ] Submit leave request creates record with pending status
- [ ] Pending leave requests show in approval queue
- [ ] Approve button updates status and leave balance
- [ ] Reject button updates status with rejection reason
- [ ] Leave balance displays correctly (total, used, remaining)
- [ ] Leave balance updates when request approved
- [ ] Leave history shows all requests with status
- [ ] Filter leave requests by status (pending/approved/rejected)
- [ ] Leave balance warning shows when remaining < 5 days
- [ ] Upload medical certificate for sick leave works

### Phase 6: Performance Analytics

- [ ] Attendance rate chart displays daily/weekly trends
- [ ] Punctuality leaderboard ranks staff by on-time percentage
- [ ] Overtime report shows OT hours by staff
- [ ] Total hours per day chart displays correctly
- [ ] Late arrivals and early departures count displays
- [ ] KPI cards show: attendance rate, total OT, late count, early departure count
- [ ] Export payroll CSV includes: staff, date, hours worked, OT hours
- [ ] Date range filter works for all analytics
- [ ] Branch filter works for multi-branch operations
- [ ] Charts update when filters change

### Phase 7: Detail Panel & Navigation

- [ ] Click staff row opens detail panel from right side
- [ ] Detail panel has tabbed navigation (Profile/Credentials/Attendance/Metrics)
- [ ] Profile tab shows complete staff information
- [ ] Credentials tab shows all credentials with status
- [ ] Attendance tab shows attendance history
- [ ] Metrics tab shows performance metrics
- [ ] Close button (X) closes detail panel
- [ ] Quick actions work from detail panel (clock in/out, submit leave)
- [ ] Edit button opens edit form in detail panel
- [ ] Detail panel maintains scroll position when switching tabs

### Phase 8: Competencies & Skills

- [ ] Competencies display as tags in staff profile
- [ ] Add competency to staff works
- [ ] Remove competency from staff works
- [ ] Filter staff by competency works
- [ ] Competency proficiency level displays (Beginner/Competent/Proficient/Expert)
- [ ] Master competency list displays all available competencies
- [ ] Create new competency adds to master list

### Phase 9: Audit Trail

- [ ] Audit log records all staff profile changes
- [ ] Audit log records credential updates
- [ ] Audit log records attendance adjustments with reasons
- [ ] Audit log records leave request approvals/rejections
- [ ] Audit log shows: timestamp, user, action, entity, changes
- [ ] Export audit log generates CSV
- [ ] Filter audit log by date range, user, action type

### Phase 10: Error Handling & Edge Cases

- [ ] Duplicate employee_id shows validation error
- [ ] Duplicate email shows validation error
- [ ] Invalid date ranges show validation error
- [ ] Clock-in without clock-out shows warning
- [ ] Expired credentials show blocking warning
- [ ] Network errors show user-friendly message
- [ ] Loading states display during data fetching
- [ ] Empty states display when no data
- [ ] Optimistic updates rollback on error
- [ ] Form validation prevents invalid submissions

---

## 🗺️ Implementation Phases

### Phase 0: Foundation & Schema (Week 1)

**Goal**: Set up database schema, entities, and repositories

- [ ] #issue - Create database migration for new tables
- [ ] #issue - Create database migration for extending staff_members table
- [ ] #issue - Create SeaORM entities (Credential, AttendanceRecord, LeaveRequest, ShiftTemplate, Competency, StaffCompetency, LeaveBalance)
- [ ] #issue - Create repositories for all entities
- [ ] #issue - Create TypeScript schemas in packages/schema/src/staff/
- [ ] #issue - Update staff_member entity with new fields
- [ ] #issue - Extend StaffMemberRepository with new query methods
- [ ] #issue - Write unit tests for repositories

**Deliverables**: Database schema, SeaORM entities, repositories, TypeScript schemas

---

### Phase 1: Tauri Commands & Backend Integration (Week 2)

**Goal**: Create Tauri command layer for frontend-backend communication

- [ ] #issue - Create tauri-commands/src/staff/ module
- [ ] #issue - Define StaffOperation enum with all operations
- [ ] #issue - Define StaffResponse enum with all response types
- [ ] #issue - Implement staff() command handler
- [ ] #issue - Add staff command to Tauri app builder
- [ ] #issue - Write integration tests for Tauri commands
- [ ] #issue - Test all operations via Tauri invoke

**Deliverables**: Tauri command module, operation/response enums, command handler

---

### Phase 2: Core Staff Management UI (Week 3)

**Goal**: Migrate mockup to functional component with real data

- [ ] #issue - Create apps/web/src/features/modules/staff/ directory structure
- [ ] #issue - Migrate StaffManagementStudio.tsx from mockups to features
- [ ] #issue - Create React Query hooks (useStaffMembers, useUpdateStaffMember)
- [ ] #issue - Replace mock data with Tauri invoke calls
- [ ] #issue - Implement staff directory with search and filters
- [ ] #issue - Implement list/grid view toggle
- [ ] #issue - Implement detail panel with slide-out animation
- [ ] #issue - Implement add/edit staff forms
- [ ] #issue - Test CRUD operations end-to-end

**Deliverables**: Functional staff directory, detail panel, CRUD operations

---

### Phase 3: Credential Management (Week 4)

**Goal**: Implement credential tracking and compliance alerts

- [ ] #issue - Create credential management UI components
- [ ] #issue - Implement credential list with status indicators
- [ ] #issue - Implement add/edit credential forms
- [ ] #issue - Implement credential document upload
- [ ] #issue - Create React Query hooks (useCredentials, useUpdateCredential)
- [ ] #issue - Implement credential expiry alerts in overview dashboard
- [ ] #issue - Implement filter by credential status
- [ ] #issue - Implement export credentials report
- [ ] #issue - Create background job for credential status updates
- [ ] #issue - Test credential lifecycle end-to-end

**Deliverables**: Credential management UI, document upload, expiry alerts, background job

---

### Phase 4: Attendance Tracking - Live View (Week 5)

**Goal**: Implement real-time attendance tracking with clock-in/out

- [ ] #issue - Create attendance live view UI components
- [ ] #issue - Implement clock-in/out buttons with Tauri commands
- [ ] #issue - Implement break start/end tracking
- [ ] #issue - Create React Query hooks (useAttendance, useClockIn, useClockOut)
- [ ] #issue - Implement duty status updates
- [ ] #issue - Implement live activity feed
- [ ] #issue - Implement KPI cards (present, absent, hours, OT)
- [ ] #issue - Implement geolocation capture (optional)
- [ ] #issue - Test clock-in/out flow end-to-end

**Deliverables**: Live attendance view, clock-in/out functionality, activity feed

---

### Phase 5: Attendance Tracking - Shift Schedule (Week 6)

**Goal**: Implement shift scheduling and variance tracking

- [ ] #issue - Create shift schedule UI components
- [ ] #issue - Implement shift template management
- [ ] #issue - Implement scheduled vs actual comparison
- [ ] #issue - Implement late/early/absent detection
- [ ] #issue - Create React Query hooks (useShiftTemplates, useAttendanceByDate)
- [ ] #issue - Implement variance alerts
- [ ] #issue - Implement today/yesterday toggle
- [ ] #issue - Implement attendance adjustment workflow
- [ ] #issue - Test shift schedule end-to-end

**Deliverables**: Shift schedule view, variance tracking, adjustment workflow

---

### Phase 6: Leave Management (Week 7)

**Goal**: Implement leave request workflow and balance tracking

- [ ] #issue - Create leave management UI components
- [ ] #issue - Implement leave request form
- [ ] #issue - Implement leave approval/rejection workflow
- [ ] #issue - Create React Query hooks (useLeaveRequests, useApproveLeave)
- [ ] #issue - Implement leave balance display
- [ ] #issue - Implement leave balance updates on approval
- [ ] #issue - Implement filter by leave status
- [ ] #issue - Implement medical certificate upload
- [ ] #issue - Test leave request lifecycle end-to-end

**Deliverables**: Leave request form, approval workflow, balance tracking

---

### Phase 7: Performance Analytics (Week 8)

**Goal**: Implement analytics dashboard with charts and reports

- [ ] #issue - Create analytics UI components
- [ ] #issue - Implement attendance rate chart
- [ ] #issue - Implement punctuality leaderboard
- [ ] #issue - Implement overtime report
- [ ] #issue - Create React Query hooks (useAttendanceMetrics, usePunctualityScores)
- [ ] #issue - Implement KPI cards
- [ ] #issue - Implement date range and branch filters
- [ ] #issue - Implement export payroll CSV
- [ ] #issue - Test analytics queries and charts

**Deliverables**: Analytics dashboard, charts, reports, export functionality

---

### Phase 8: Competencies & Audit Trail (Week 9)

**Goal**: Implement competency tracking and audit logging

- [ ] #issue - Create competency management UI
- [ ] #issue - Implement add/remove competency to staff
- [ ] #issue - Implement filter staff by competency
- [ ] #issue - Create React Query hooks (useCompetencies, useStaffCompetencies)
- [ ] #issue - Implement audit trail UI
- [ ] #issue - Implement audit log filtering
- [ ] #issue - Implement export audit log
- [ ] #issue - Test competency and audit features

**Deliverables**: Competency management, audit trail viewer

---

### Phase 9: Polish & Testing (Week 10)

**Goal**: Bug fixes, performance optimization, comprehensive testing

- [ ] #issue - Fix all known bugs
- [ ] #issue - Optimize database queries with indexes
- [ ] #issue - Implement loading states and error handling
- [ ] #issue - Implement empty states
- [ ] #issue - Add form validation
- [ ] #issue - Write end-to-end tests
- [ ] #issue - Performance testing with large datasets
- [ ] #issue - Accessibility audit
- [ ] #issue - Documentation updates

**Deliverables**: Production-ready staff management module

---

## 📊 Success Metrics

**Functional Completeness**:

- 100% of mockup features implemented with real data
- All CRUD operations working end-to-end
- All analytics and reports generating correctly

**Performance**:

- Staff directory loads in <500ms
- Clock-in/out operations complete in <200ms
- Analytics queries complete in <2s
- No UI blocking during data fetching

**Data Integrity**:

- No duplicate attendance records (unique constraint enforced)
- Leave balance always accurate (updated on approval)
- Credential status updated daily (background job)
- Audit trail captures all changes

**User Experience**:

- Smooth animations (detail panel slide-in)
- Optimistic updates for instant feedback
- Clear error messages
- Loading states for all async operations
- Empty states for no data scenarios

---

## 🔗 Related Issues

- Existing staff_member infrastructure (user module)
- Existing branch infrastructure (for multi-branch support)
- Future: Integration with payroll systems
- Future: Mobile app for staff self-service

---

## 📝 Notes

### Assumptions

- PostgreSQL database is already set up
- SeaORM is the ORM of choice
- Tauri is the IPC layer
- React Query is used for server state management
- Windows Fluent Design is the UI design system
- Single-branch operations initially, multi-branch support via branch_id foreign key

### Constraints

- Must maintain backward compatibility with existing staff_member entity
- Must follow existing codebase patterns (SeaORM, Tauri commands, React Query)
- Must use snake_case for all database fields
- Must use UUID v7 for primary keys
- Must include created_at and updated_at timestamps on all tables

### Out of Scope

- **Payroll Integration**: Export CSV only, no direct integration with payroll systems
- **Biometric Clock-In**: No fingerprint or facial recognition (future enhancement)
- **Shift Swap Marketplace**: No peer-to-peer shift trading (future enhancement)
- **Attendance Gamification**: No badges, streaks, or rewards (future enhancement)
- **Predictive Analytics**: No ML-based predictions (future enhancement)
- **Mobile App**: Web-only initially, mobile app is future work
- **Real-time Notifications**: No push notifications for expiring credentials (future enhancement)
- **Advanced Scheduling**: No drag-and-drop shift scheduling (future enhancement)
- **Time Clock Hardware**: No integration with physical time clock devices
- **Facial Recognition**: No photo capture on clock-in (future enhancement)

---

**Estimated Timeline**: 10 weeks (2.5 months)
**Priority**: High (critical for pharmacy operations)
**Complexity**: High (full-stack feature with multiple entities and complex business logic)

---

## 🎯 Next Steps

1. **Review & Approval**: Get stakeholder approval on PRD
2. **Create GitHub Issues**: Break down phases into individual issues
3. **Assign to Milestone**: Add to v2.0 milestone
4. **Start Phase 0**: Begin with database schema and infrastructure
5. **Weekly Check-ins**: Review progress and adjust timeline as needed

---

_This PRD will be converted to GitHub issues. Local file will be deleted after issues are created._
