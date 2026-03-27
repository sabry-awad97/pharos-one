# PRD: Production-Ready Tab System

**Status:** Draft
**Date:** 2026-03-27
**Project:** Pharos One — Pharmacy Desktop App

---

## Problem Statement

The workspace tab system currently operates in demo mode: four hardcoded tabs (Dashboard, POS, Inventory, Reports) are injected at app startup via a static array passed to `WorkspaceShell`. This creates three compounding problems for a real multi-user pharmacy environment:

1. **No user isolation.** A single global `pharmos-tab-order` localStorage key means every user who logs into the same device shares and corrupts each other's tab state. The sidebar state has the same problem via `pharmos-sidebar-state`.
2. **No empty state.** Zero tabs is not a handled state. The app has no onboarding path, no template picker, and no recovery UI if all tabs are closed.
3. **No dynamic tab creation.** Tabs cannot be created from sidebar navigation. The only way tabs exist is through the hardcoded initial array, which is never meant to ship.

Pharmacy staff (pharmacists, cashiers, managers) share a single Windows workstation and switch between users throughout the shift. The current design makes that workflow impossible without state contamination between users.

---

## Solution

Transform the tab system from demo-mode initialization to a user-driven, per-user-isolated, persistent system delivered in four sequential phases that each ship independently and can be verified before the next begins:

- **Phase 1:** Remove hardcoded mock tabs. Add empty state UI. App starts with zero tabs.
- **Phase 2:** Scope all tab and sidebar localStorage keys per user. No contamination between users on the same device.
- **Phase 3:** Add a lightweight user profile system (user picker, no backend auth required) with a user switcher in the title bar.
- **Phase 4:** Add a workspace template picker shown on first launch and when all tabs are closed, providing role-based starting configurations.

The Tab Factory abstraction and route-driven tab creation are explicitly deferred until there are multiple tab creation entry points that justify the centralization.

---

## Codebase Verification

The following was verified by reading actual source files before writing this PRD.

**Confirmed current state:**

- Mock tabs live in `routes/_app/home/route.tsx` as a static `INITIAL_TABS` array passed directly to `WorkspaceShell`. This is the sole source of mock tabs.
- `tabs-store` uses a single global key `pharmos-tab-order` for localStorage — not user-scoped.
- `sidebar-state-store` uses a single global key `pharmos-sidebar-state` via Zustand `persist` middleware — not user-scoped.
- No `features/auth/` directory exists anywhere in the codebase. No user profile system exists.
- No empty state component exists. Zero-tabs is an unhandled UI state.
- A `useLocalStorage` hook exists and can be reused for user preference storage.
- The canonical `Tab` type in `features/workspace/types.ts` uses `module: string` (not `moduleId`).

**Patterns to follow (verified from codebase):**

- Stores use Zustand + Immer. New stores must follow this pattern.
- `sidebar-state-store` uses Zod schemas for localStorage deserialization validation. Any new persisted store must do the same.
- Store tests reset state in `beforeEach` via `useStore.setState({...})` — not via spies or mocks of internals.
- The existing `persist` middleware in `sidebar-state-store` handles custom Set-to-array serialization — this is the reference implementation for any new persisted stores.

**Patterns to avoid:**

- Do not gate mock tab removal behind an environment variable. Delete the mock data entirely.
- Do not add new `initializeTabs` call sites. The existing one in `WorkspaceShell` is removed in Phase 1.
- Do not reference local file paths in any GitHub issue created from this PRD.

---

## User Stories

### Phase 1 — Remove Mock Tabs & Empty State

1. As a developer, I want the app to start with zero tabs so that mock data does not appear in any non-development context.
2. As a pharmacy staff member, I want to see a clear empty state with actionable CTAs when no tabs are open, so I know how to get started.
3. As a pharmacy staff member, I want to open a module from the sidebar and have it appear as a new tab, so I can navigate without relying on pre-loaded tabs.
4. As a pharmacy staff member, I want the empty state to offer a "Choose Template" shortcut, so I can quickly reach the template picker if I want role-based defaults.
5. As a developer, I want the `initializeTabs` action and `WorkspaceShell` prop removed after Phase 1, so there is no re-entry point for mock initialization.

### Phase 2 — User-Scoped localStorage Keys

6. As a pharmacist, I want my open tabs to be completely separate from the cashier's tabs, so switching users on the same device does not show me someone else's workspace.
7. As a cashier, I want my sidebar collapse state and width to be saved independently from other users, so my compact layout preference persists across shifts.
8. As a developer, I want all store persistence keys to include the current user ID, so isolation is enforced at the storage layer without runtime filtering.
9. As a developer, I want the tab order persistence key to follow the same user-scoped naming convention as the sidebar state key, so storage is consistent and predictable.
10. As a pharmacy manager, I want my pinned tab configuration to survive a page refresh or app restart, so my workflow is not disrupted by routine restarts.

### Phase 3 — User Profile System

11. As a pharmacy admin, I want to create named user profiles (Ahmed, Sara, Khaled) with a role (pharmacist, cashier, manager) without needing a backend login system, so the app is usable before full auth is built.
12. As a pharmacy staff member, I want a user switcher in the title bar showing the current user's name and role, so I always know who is logged in.
13. As a pharmacy staff member, I want switching users to immediately clear the current user's in-memory state and load the new user's persisted state, so there is no bleed between sessions.
14. As a pharmacy admin, I want user profiles to be stored in localStorage so the device remembers all configured users between power cycles.
15. As a developer, I want the user switch operation to save the outgoing user's state before clearing it, so no tab or preference data is lost during a switch.
16. As a pharmacy staff member, I want to see all available users in the switcher dropdown, so I can select my profile in one click without typing.
17. As a pharmacy admin, I want to add and remove user profiles from a management screen accessible from the switcher, so the user list stays current as staff changes.

### Phase 4 — Workspace Template Picker

18. As a new pharmacy staff member opening the app for the first time, I want a template picker modal to appear automatically, so I get a role-appropriate starting workspace without manual configuration.
19. As a pharmacist, I want a "Pharmacist" template that opens Prescriptions, Inventory, and Reports tabs, so my typical workflow is ready immediately.
20. As a cashier, I want a "Cashier" template that opens POS and Customer Lookup tabs, so I can start processing sales without extra navigation.
21. As a manager, I want a "Manager" template that opens Dashboard, Inventory, Reports, and Analytics tabs, so I have oversight tools at a glance.
22. As any staff member, I want a "Custom" option in the template picker that starts with zero tabs, so I can build my own workspace without being forced into a preset.
23. As a returning staff member, I want the template picker to be skippable with a "Don't show again" checkbox, so it does not interrupt my daily login after the first use.
24. As a pharmacy staff member, I want the template picker to reappear if I close all my tabs and the workspace becomes empty again, so I always have a way back to a useful starting point.
25. As a developer, I want template definitions to live in a constants file separate from the picker component, so templates can be modified without touching UI code.

---

## Implementation Decisions

### Decision 1: Mock Tab Removal Strategy

**Decision:** Delete the `INITIAL_TABS` array and the `initializeTabs` call in `WorkspaceShell` entirely. Do not gate behind an environment variable.

**Approach:** Remove the static tab array from the home route. Remove the `initialTabs` prop from `WorkspaceShell`. Remove the `initializeTabs` action from the tabs store entirely — it has no purpose once mock data is gone. Add an empty state component rendered when `tabs.length === 0`.

**Confidence Level:** 98%

**Key Assumptions:**

- No other call site uses `initializeTabs` (verified: only `WorkspaceShell` and tests reference it).
- Sidebar clicks already wire up to `addTab` — verified that `addTab` exists in the store with the correct signature.

**Would Change If:** A legitimate use case for seeded initial tabs emerges (e.g., deep link that must open a specific tab on cold start). In that case, restore a scoped initializer — but only then.

**Alternative:** None warranted at 98% confidence.

---

### Decision 2: localStorage Key Scoping Strategy

**Decision:** Change both `pharmos-tab-order` and `pharmos-sidebar-state` to include the current user ID: `pharmos-tab-order-{userId}` and `pharmos-sidebar-state-{userId}`.

**Approach:** The tabs store currently uses direct `localStorage.getItem/setItem` calls with a hardcoded key constant. Change that constant to a function that takes `userId`. The sidebar store uses Zustand `persist` middleware with a `name` option — change that `name` to a computed value that includes `userId`. Both stores need to re-initialize when the user changes.

**Confidence Level:** 95%

**Key Assumptions:**

- A `currentUserId` value is available at store initialization time (provided by Phase 3's user profile store).
- localStorage quota is not a concern for the number of users per device (typically 2-5 pharmacy staff).
- Zustand `persist` middleware supports dynamic storage keys by re-creating the store or reinitializing on user switch.

**Would Change If:** Zustand `persist` does not support runtime key changes cleanly — in that case, switch both stores to manual `localStorage` calls with the key-as-function pattern already used by the tabs store.

**Alternative (if confidence drops below 80%):** Namespace all state under a single key as a nested object keyed by userId (e.g., `{ userId1: {...}, userId2: {...} }`). This avoids dynamic key issues but complicates garbage collection.

---

### Decision 3: User Profile System Architecture

**Decision:** Build a standalone Zustand store (`useUserProfileStore`) with Zod-validated localStorage persistence. No backend. No authentication. A simple profile list with a `currentUserId` pointer.

**Approach:**

- Store shape: `{ users: UserProfile[], currentUserId: string | null }`
- `UserProfile`: `{ id: string, name: string, role: 'pharmacist' | 'cashier' | 'manager' | 'admin' }`
- Persist to `pharmos-user-profiles` (global, not per-user — this is the registry)
- Expose `switchUser(userId)` action that: (1) saves current user state, (2) updates `currentUserId`, (3) triggers re-initialization of tab and sidebar stores with new user's data
- User switcher component lives in the title bar area, reads from this store

**Confidence Level:** 90%

**Key Assumptions:**

- React context is not needed — Zustand store subscription is sufficient for the user switcher to stay in sync.
- The `switchUser` action can coordinate store resets synchronously without a loading state (fast localStorage reads).
- Role is stored but not enforced at the UI level in this phase — it is metadata only.

**Would Change If:** User switch needs to show a loading state (e.g., if state hydration becomes async). In that case, add a `isSwitching: boolean` flag to the store.

**Alternative:** React Context provider wrapping the app. Rejected — adds component tree coupling and makes the current user harder to access from store actions.

---

### Decision 4: User Switch State Cleanup

**Decision:** On `switchUser`, save outgoing user state to localStorage, reset both tab store and sidebar store to empty, then rehydrate from the new user's localStorage keys.

**Approach:**

1. Persist current tabs and sidebar state under outgoing user's scoped keys
2. Reset `useTabsStore` state to `{ tabs: [], activeTabId: null, splitView: {...defaults} }`
3. Reset `useSidebarStateStore` state to `{ workspaces: {} }`
4. Read new user's keys from localStorage and hydrate both stores
5. If new user has no saved state, show empty state / template picker

**Confidence Level:** 88%

**Key Assumptions:**

- No async operations are in-flight during user switch (acceptable — desktop app, single user active at a time).
- Rehydration from localStorage is synchronous (true for the current store implementations).

**Would Change If:** Split view is active during a switch — need to also reset split view state. Include `splitView` reset in the cleanup sequence.

---

### Decision 5: Workspace Template System

**Decision:** Static constants file defines template presets. A modal component renders them. Selection calls `addTab` in a loop. First-launch detection uses a boolean in user preferences.

**Approach:**

- Template constants: array of `{ id, label, icon, tabs: Array<Omit<Tab, 'id'>> }`
- Picker modal: 2×2 grid of template cards, "Don't show again" checkbox, Skip and Continue buttons
- First-launch detection: `showTemplatePickerOnStartup: boolean` field in user preferences, defaults to `true`
- When all tabs are closed: check this preference and show picker if `true`
- Template selection: iterate tabs array, call `addTab` for each

**Confidence Level:** 87%

**Key Assumptions:**

- The four role templates (Pharmacist, Cashier, Manager, Custom) cover the immediate use cases.
- Module IDs referenced in templates (`prescriptions`, `inventory`, `pos`, etc.) are stable — they must match the sidebar's module registry.
- "Don't show again" is per-user, stored in user preferences alongside `currentUserId`.

**Would Change If:** Module IDs are not yet stable across the codebase. In that case, use only the currently confirmed modules (dashboard, pos, inventory, reports) and defer the others.

**Alternative (if confidence drops below 80%):** Skip the modal entirely and just show the empty state with large CTA buttons for each role. Less discoverable but zero new component complexity.

---

## Modules to Build or Modify

### New Modules

**EmptyWorkspaceState component**

- Rendered when `tabs.length === 0`
- Shows a centered illustration, "No tabs open" message, and two CTAs: "Open Dashboard" and "Choose Template"
- Simple, no state of its own — just calls `addTab` or opens the template picker

**useUserProfileStore (Zustand store)**

- Manages user list and current user
- Persists to `pharmos-user-profiles` with Zod validation
- Exposes `switchUser`, `addUser`, `removeUser`, `updateUser`
- Deep module: encapsulates all user identity concerns

**UserSwitcher component**

- Compact dropdown in the title bar (max 32px height)
- Shows current user avatar initials + name
- Dropdown lists all users with role badge, checkmark on current
- "Manage Users" option navigates to user management screen

**WorkspaceTemplatePicker component**

- Modal overlay with 2��2 template card grid
- Each card shows role icon, name, and bullet list of tabs that will be created
- "Don't show again" checkbox + Skip + Continue buttons
- Stateless except for controlled open/close — parent decides when to show it

**workspace-templates constants**

- Static array of template definitions
- Each template: id, display name, icon, description, tab configurations
- No logic — pure data

### Modified Modules

**tabs-store**

- Remove `initializeTabs` action and its localStorage ordering logic
- Change `TAB_ORDER_KEY` from a string constant to a function `(userId: string) => string`
- Add `resetForUser(userId)` action: clears state and rehydrates from user-scoped key

**sidebar-state-store**

- Change persist `name` option to be user-scoped
- Add `resetForUser(userId)` action: clears workspaces and rehydrates from user-scoped key

**WorkspaceShell**

- Remove `initialTabs` prop
- Render `EmptyWorkspaceState` when `tabs.length === 0`
- Conditionally render `WorkspaceTemplatePicker` based on user preference

**Home route**

- Remove `INITIAL_TABS` constant
- Remove `initialTabs` prop pass-through to `WorkspaceShell`

---

## Testing Decisions

**Testing Philosophy:** Test observable store behavior and component output, not implementation details. Never test that a private function was called — test what the user or consuming component sees.

### Modules to Test

**useUserProfileStore**

- Why: Core to user isolation. Bugs here cause state leakage between users, which is the primary risk of this epic.
- What to test: `addUser` creates a user with a generated id; `switchUser` updates `currentUserId`; `removeUser` removes the user and falls back `currentUserId` to null; persistence round-trips correctly through the Zod schema.
- Pattern: Follow `sidebar-state-store.test.ts` — reset store state in `beforeEach`, test actions via store's public interface.

**tabs-store (extended)**

- Why: `resetForUser` is a new high-risk action — if it fails to clear state, contamination occurs.
- What to test: After `resetForUser(userId)`, `tabs` is empty and `activeTabId` is null; calling `resetForUser` with a userId that has saved state rehydrates that state from localStorage.
- Pattern: Follow existing `tabs-store.test.tsx` — use the localStorage mock from `test/setup.ts`.

**EmptyWorkspaceState component**

- Why: Verifies the zero-tabs path is rendered and CTAs are present — this is the first user-visible change.
- What to test: Renders when passed zero tabs; "Open Dashboard" button calls `addTab` with dashboard module; "Choose Template" button triggers template picker open.
- Pattern: Follow `SidebarContainer.test.tsx` for component-level testing style.

**WorkspaceTemplatePicker component**

- Why: Template selection is user-facing and maps directly to `addTab` calls — a bug here means wrong tabs are created.
- What to test: Renders all four template cards; selecting a template and clicking Continue calls `addTab` the correct number of times with the correct module IDs; "Don't show again" checkbox updates user preference; Skip closes the modal without adding tabs.

**Test Patterns (verified from codebase):**

- GOOD: Reset store state via `useStore.setState({...})` in `beforeEach`. This matches existing `tabs-store.test.tsx` and `tab-drag-drop.test.tsx`.
- GOOD: Use the localStorage mock from `test/setup.ts` — it is already wired globally for all tests.
- GOOD: Use Zod schema parse in tests to verify localStorage round-trip shape — matches `sidebar-state-store.test.ts` pattern.
- BAD: Do not spy on `localStorage.setItem` to assert persistence — test the read-back instead.
- BAD: Do not test `initializeTabs` — that action is being removed in Phase 1.
- BAD: Do not mock `useTabsStore` or `useUserProfileStore` inside component tests — render with the real store and seed its state.

---

## Out of Scope

The following are explicitly excluded from this epic:

- **Backend authentication.** User profiles are local, device-side only. No login flow, no passwords, no session tokens.
- **Cloud sync.** Tab state stays in localStorage. No cross-device synchronization.
- **Tab Factory pattern.** Centralizing tab creation logic is deferred until there are 3+ distinct tab creation entry points.
- **Route-driven tab creation.** Navigating to `/inventory` will not auto-create a tab. TanStack Router integration for tabs is a separate epic.
- **Tab groups.** Grouping, collapsing, or color-coding groups of tabs is out of scope.
- **Tab history / restore closed tab.** Ctrl+Shift+T behavior is out of scope.
- **Compact density preference.** The 32px height variant and auto-collapse sidebar are out of scope for this epic — they belong in a UX polish epic.
- **Context-aware label shortening.** Abbreviating tab labels in compact mode is out of scope.
- **Analytics / telemetry on tab actions.** No event tracking is added in this epic.
- **Role-based access control.** The `role` field on `UserProfile` is stored but not enforced. No UI is gated by role.
- **Mock data environment flag.** Do not add `VITE_USE_MOCK_DATA`. Delete mocks entirely.

---

## Further Notes

### Sequencing Rationale

Phase 1 must ship before Phase 2. You cannot scope keys by user if the user system does not exist yet — but you also cannot build the user system while mock tabs are masking the empty state. Phase 1 creates the visible gap that Phase 2 fills.

Phase 3 (user profiles) must ship before Phase 2 key scoping goes live in production. The scoped keys are useless without a `userId` to scope them to. In development, a hardcoded dev user ID is acceptable as a placeholder.

Phase 4 (templates) is the only phase that can be developed in parallel with Phase 3, since it only depends on `addTab` existing and the empty state being visible.

### Risk Register

| Risk                                                                                             | Likelihood | Impact | Mitigation                                                                                 |
| ------------------------------------------------------------------------------------------------ | ---------- | ------ | ------------------------------------------------------------------------------------------ |
| Zustand `persist` middleware does not support runtime key changes cleanly                        | Medium     | Medium | Switch sidebar store to manual localStorage calls (same pattern as tabs store)             |
| User switch leaves in-flight store subscription orphans causing memory leaks                     | Low        | Medium | Unsubscribe from stores in `switchUser` before resetting                                   |
| Template module IDs do not match sidebar module registry                                         | Medium     | Low    | Only use the four confirmed modules (dashboard, pos, inventory, reports) in Phase 4        |
| localStorage corruption after key migration (old global keys co-exist with new user-scoped keys) | Low        | Low    | Write a one-time migration function that reads old keys and moves them to `userId=default` |

### localStorage Key Registry (final state after all phases)

| Key                              | Scope    | Owner Store                                 | Content                           |
| -------------------------------- | -------- | ------------------------------------------- | --------------------------------- |
| `pharmos-user-profiles`          | Global   | useUserProfileStore                         | User list + currentUserId         |
| `pharmos-tab-order-{userId}`     | Per user | useTabsStore                                | Ordered tab ID array              |
| `pharmos-sidebar-state-{userId}` | Per user | useSidebarStateStore                        | Workspace sidebar configs         |
| `pharmos-prefs-{userId}`         | Per user | useUserProfileStore or separate prefs store | showTemplatePickerOnStartup, etc. |

### Success Criteria (per phase)

**Phase 1 done when:**

- App loads with zero tabs and no console errors
- EmptyWorkspaceState renders with both CTAs visible
- Closing all tabs shows EmptyWorkspaceState
- No reference to `INITIAL_TABS` or `initializeTabs` remains in non-test code

**Phase 2 done when:**

- Two different userIds produce two separate localStorage entries for tabs and sidebar
- Changing one user's tabs does not affect the other user's stored state

**Phase 3 done when:**

- User switcher renders in title bar with current user name
- Switching user clears tabs and loads the new user's saved tabs
- User preferences persist across app restarts

**Phase 4 done when:**

- Template picker appears on first launch for a new user
- Selecting Pharmacist template creates exactly the configured tabs
- "Don't show again" suppresses the picker on subsequent launches
- Template picker reappears when all tabs are closed (if preference allows)
