# GitHub Configuration

This directory contains GitHub-specific configuration files for issue management and workflows.

## Issue Templates

Located in `ISSUE_TEMPLATE/`:

- **feature.md** - Vertical slice feature implementation
- **epic.md** - High-level feature epic or PRD
- **bug.md** - Bug reports

### Creating Issues

```bash
# Create a feature issue
gh issue create --template feature.md

# Create an epic
gh issue create --template epic.md

# Create a bug report
gh issue create --template bug.md
```

## Labels

Labels are defined in `labels.yml` and organized by category:

- **Type**: feature, bug, epic, refactor, docs, test, chore
- **Priority**: critical, high, medium, low
- **Status**: ready, in-progress, blocked, review, done
- **Classification**: afk (Away From Keyboard), hitl (Human In The Loop)
- **Layer**: schema, service, ui, test
- **Module**: inventory, pos, dashboard, customers

### Applying Labels

```bash
# Sync labels from config file
gh label sync --file .github/labels.yml

# Add labels to an issue
gh issue edit 123 --add-label "type:feature,priority:high,status:ready"
```

## Workflow: Epic to Implementation

### 1. Create Epic

```bash
# Create epic issue
gh issue create --template epic.md --title "[Epic] Context Menu Actions"
```

### 2. Break Down into Vertical Slices

Use the `/prd-to-issues` skill to break the epic into independently-deliverable vertical slices:

```bash
# In Kiro chat
/prd-to-issues <epic-issue-number>
```

This will:

- Analyze the epic and codebase patterns
- Create vertical slices that cut through all layers (schema, service, UI, tests)
- Generate GitHub issues in dependency order
- Apply appropriate labels and link to parent epic

### 3. Implement Slices

Each slice is a complete, demoable feature:

```bash
# Pick up a ready issue
gh issue list --label "status:ready,afk"

# Mark as in progress
gh issue edit 123 --add-label "status:in-progress"

# After implementation
gh issue close 123 --comment "Implemented in PR #456"
```

### 4. Track Progress

```bash
# View epic progress
gh issue view <epic-number>

# List all issues for an epic
gh issue list --search "in:title [Epic]"
```

## Vertical Slice Principles

Each feature issue should be:

- **Vertical**: Cuts through all layers (schema → service → UI → tests)
- **Thin**: Minimal scope but complete end-to-end path
- **Demoable**: Shows working functionality
- **Independent**: Can be implemented without waiting for other issues

### Good Example

```
Title: "Add user login with email/password"
Layers:
- Schema: users table with email/password_hash
- Service: POST /auth/login endpoint
- UI: Login form component
- Tests: E2E login flow test
```

### Bad Example (Horizontal Slice)

```
Title: "Create all database schemas"
Problem: Only touches one layer, not demoable, blocks all other work
```

## AFK vs HITL Classification

**AFK (Away From Keyboard)**:

- Can be implemented without human interaction
- Clear requirements and patterns
- Low architectural risk
- Preferred whenever possible

**HITL (Human In The Loop)**:

- Requires design review or architectural decisions
- Novel patterns or high-risk changes
- Multiple valid approaches exist

## Related Documentation

- [Epic Planning](../docs/epics/README.md) - How to plan and break down epics
- [Context Menu Actions Epic](../docs/epics/context-menu-actions.md) - Example epic document
