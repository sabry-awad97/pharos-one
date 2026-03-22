# Epics & Roadmaps

This directory contains high-level epic documents and feature roadmaps that guide implementation.

## Purpose

Epic documents serve as:

- **Planning artifacts** for breaking down large features into vertical slices
- **Reference documentation** for understanding feature scope and architecture
- **Roadmaps** showing implementation phases and dependencies

## Structure

Each epic document should include:

- Overview and goals
- User stories addressed
- Architecture approach
- Implementation phases (with refactoring first)
- Success metrics
- Related GitHub issues

## Relationship to GitHub Issues

⚠️ **Important**: Epic documents are planning artifacts, not the source of truth.

- **Source of truth**: GitHub issues and milestones
- **Epic documents**: Reference GitHub issues (#123), never local file paths
- **Workflow**: Epic → GitHub issues → Implementation → Close issues → Archive epic

## Creating Issues from Epics

Use the `/prd-to-issues` skill to break down epics into vertical slices:

```bash
# 1. Create epic as GitHub issue using template
gh issue create --template epic.md --title "[Epic] Context Menu Actions"

# 2. Break down into vertical slices
/prd-to-issues <epic-issue-number>

# 3. Reference epic document for detailed planning
# But always link to GitHub issues in issue descriptions
```

## Active Epics

- [Context Menu Actions](./context-menu-actions.md) - Extensible action system for inventory table

## Archived Epics

Move completed epics to `docs/epics/archive/` after all issues are closed.
