# View Menu Implementation - DEVELOPMENT NOTES

⚠️ **Temporary development file. Source of truth: GitHub issue #61**

## Quick Links

- **GitHub Issue**: #61
- **Milestone**: v1.1 - UI Enhancements

## Architecture Deep Dive

### Deep Module: use-view-state Hook

Following the proven pattern from `use-sidebar-state.ts`, the view state hook encapsulates all view-related preferences:

**Small Interface** (what callers see):

```typescript
interface UseViewStateReturn {
  // Visibility toggles
  sidebarVisible: boolean;
  statusBarVisible: boolean;
  toolbarVisible: boolean;
  toggleSidebar: () => void;
  toggleStatusBar: () => void;
  toggleToolbar: () => void;

  // Zoom controls
  zoomLevel: number; // 50-200
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;

  // Density mode
  density: "compact" | "comfortable" | "spacious";
  setDensity: (mode: DensityMode) => void;

  // Focus mode
  focusMode: boolean;
  toggleFocusMode: () => void;
  exitFocusMode: () => void;
}
```

**Deep Implementation** (what it hides):

- localStorage persistence with error handling
- Zoom level validation and clamping (50-200)
- Zoom step calculation (predefined levels)
- Focus mode orchestration (affects multiple visibility states)
- State synchronization across components
- Initial state hydration from localStorage
- Keyboard shortcut registration (via separate hook)

**Why This is Deep**:

- Interface has ~15 methods, but hides complex localStorage logic, validation, and orchestration
- Callers don't need to know about storage keys, validation rules, or state synchronization
- Can change storage strategy (IndexedDB, server sync) without affecting callers
- Testable at boundary: set state, verify state, check localStorage

### Zoom Implementation Strategy

**Approach**: CSS Transform on Root Container

```typescript
// In use-view-state.ts
const ZOOM_LEVELS = [50, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200];

function zoomIn() {
  const currentIndex = ZOOM_LEVELS.indexOf(zoomLevel);
  if (currentIndex < ZOOM_LEVELS.length - 1) {
    setZoomLevel(ZOOM_LEVELS[currentIndex + 1]);
  }
}

// In root component
<div style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}>
  <Outlet />
</div>
```

**Why Transform Over font-size**:

- Scales everything proportionally (images, borders, spacing)
- No layout reflow (better performance)
- Matches browser zoom behavior
- Works with fixed positioning (with portal strategy if needed)

**Potential Issues**:

- Fixed position elements may need adjustment
- Modals/dropdowns may need portal strategy
- Sub-pixel rendering at some zoom levels

**Mitigation**:

- Test with all overlay components (modals, dropdowns, tooltips)
- Use portal for overlays if transform breaks positioning
- Round zoom levels to avoid sub-pixel issues

### Density Implementation Strategy

**Approach**: CSS Custom Properties + Data Attributes

```css
/* In globals.css */
[data-density="compact"] {
  --density-row-height: 32px;
  --density-padding: 8px;
  --density-gap: 4px;
}

[data-density="comfortable"] {
  --density-row-height: 40px;
  --density-padding: 12px;
  --density-gap: 8px;
}

[data-density="spacious"] {
  --density-row-height: 48px;
  --density-padding: 16px;
  --density-gap: 12px;
}

/* DataTable uses these variables */
.data-table-row {
  height: var(--density-row-height);
  padding: var(--density-padding);
  gap: var(--density-gap);
}
```

**Why Custom Properties**:

- Clean separation between density logic and component styles
- Easy to add new density levels
- No component prop drilling
- CSS-only solution (no JS calculations)

**Integration Points**:

- Apply `data-density` attribute to table containers
- DataTable component reads density from parent context
- All tables automatically respect density setting

### Focus Mode Orchestration

**Approach**: Boolean Flag + Component Checks

```typescript
// In use-view-state.ts
function toggleFocusMode() {
  setFocusMode(prev => !prev);
  // When entering focus mode, hide panels
  if (!focusMode) {
    setSidebarVisible(false);
    setStatusBarVisible(false);
    setToolbarVisible(false);
  }
}

// In components
{!focusMode && <Sidebar />}
{!focusMode && <StatusBar />}
{!focusMode && <Toolbar />}
<MenuBar visible={!focusMode || altKeyPressed} />
```

**Why Not Separate Component**:

- Focus mode is a state, not a component
- Affects multiple existing components
- Simpler to implement as orchestrated state
- Easier to test (just check visibility states)

**Keyboard Shortcuts**:

- F11: Toggle focus mode
- Esc: Exit focus mode (if in focus mode)
- Alt: Show menu bar temporarily (even in focus mode)

## Implementation Checklist

### Phase 0: Foundation ✓

- [ ] Create `use-view-state.ts` with localStorage pattern
- [ ] Add `ViewState` types to `types.ts`
- [ ] Add density CSS custom properties to `globals.css`
- [ ] Add zoom transform utilities to `globals.css`

### Phase 1: Core UI Toggles

- [ ] Implement sidebar visibility in view state
- [ ] Implement status bar visibility in view state
- [ ] Implement toolbar visibility in view state
- [ ] Create `ViewMenu.tsx` component
- [ ] Add toggle menu items with icons
- [ ] Integrate ViewMenu into MenuBar
- [ ] Update Sidebar to respect visibility state
- [ ] Update StatusBar to respect visibility state
- [ ] Update Toolbar to respect visibility state
- [ ] Write tests for visibility toggles
- [ ] Test keyboard shortcuts (Ctrl+B for sidebar)

### Phase 2: Zoom Controls

- [ ] Implement zoom state with predefined levels
- [ ] Add zoomIn/zoomOut/resetZoom functions
- [ ] Apply transform to root container
- [ ] Add zoom menu items to ViewMenu
- [ ] Implement Ctrl++ keyboard shortcut
- [ ] Implement Ctrl+- keyboard shortcut
- [ ] Implement Ctrl+0 keyboard shortcut
- [ ] Test zoom with modals and overlays
- [ ] Test zoom at min/max bounds
- [ ] Write tests for zoom functionality

### Phase 3: Theme & Density

- [ ] Add theme menu items (Light/Dark/Auto)
- [ ] Integrate with useTheme hook
- [ ] Show current theme selection
- [ ] Implement density state
- [ ] Add density menu items
- [ ] Apply density attribute to table containers
- [ ] Update DataTable to use density variables
- [ ] Test theme switching persistence
- [ ] Test density changes on tables
- [ ] Write tests for theme and density

### Phase 4: Focus Mode

- [ ] Implement focus mode state
- [ ] Add toggleFocusMode function
- [ ] Implement F11 keyboard shortcut
- [ ] Implement Esc to exit focus mode
- [ ] Implement Alt to show menu bar
- [ ] Add focus mode menu item
- [ ] Test focus mode with modals
- [ ] Test keyboard shortcuts
- [ ] Write tests for focus mode

### Phase 5: Polish & Documentation

- [ ] Comprehensive tests for use-view-state
- [ ] Comprehensive tests for ViewMenu
- [ ] Update ARCHITECTURE.md
- [ ] Add keyboard shortcut documentation
- [ ] Accessibility audit
- [ ] Performance testing
- [ ] Cross-browser testing
- [ ] Update README with view controls

## Testing Strategy

### Hook Tests (use-view-state.test.ts)

```typescript
describe("useViewState", () => {
  it("initializes with default values", () => {
    const { result } = renderHook(() => useViewState());
    expect(result.current.sidebarVisible).toBe(true);
    expect(result.current.zoomLevel).toBe(100);
    expect(result.current.density).toBe("compact");
  });

  it("persists sidebar visibility to localStorage", () => {
    const { result } = renderHook(() => useViewState());
    act(() => result.current.toggleSidebar());
    expect(localStorage.getItem("pharmos-sidebar-visible")).toBe("false");
  });

  it("zooms in through predefined levels", () => {
    const { result } = renderHook(() => useViewState());
    act(() => result.current.zoomIn());
    expect(result.current.zoomLevel).toBe(110);
    act(() => result.current.zoomIn());
    expect(result.current.zoomLevel).toBe(125);
  });

  it("clamps zoom at maximum level", () => {
    const { result } = renderHook(() => useViewState());
    // Zoom to max
    for (let i = 0; i < 20; i++) {
      act(() => result.current.zoomIn());
    }
    expect(result.current.zoomLevel).toBe(200);
  });

  it("enters focus mode and hides panels", () => {
    const { result } = renderHook(() => useViewState());
    act(() => result.current.toggleFocusMode());
    expect(result.current.focusMode).toBe(true);
    expect(result.current.sidebarVisible).toBe(false);
    expect(result.current.statusBarVisible).toBe(false);
  });
});
```

### Component Tests (ViewMenu.test.tsx)

```typescript
describe('ViewMenu', () => {
  it('renders all menu items', () => {
    render(<ViewMenu onClose={jest.fn()} />);
    expect(screen.getByText('Toggle Sidebar')).toBeInTheDocument();
    expect(screen.getByText('Zoom In')).toBeInTheDocument();
    expect(screen.getByText('Theme')).toBeInTheDocument();
  });

  it('calls toggle callback when sidebar item clicked', async () => {
    const onToggleSidebar = jest.fn();
    const user = userEvent.setup();
    render(<ViewMenu onToggleSidebar={onToggleSidebar} />);
    await user.click(screen.getByText('Toggle Sidebar'));
    expect(onToggleSidebar).toHaveBeenCalled();
  });

  it('shows keyboard shortcuts', () => {
    render(<ViewMenu onClose={jest.fn()} />);
    expect(screen.getByText('Ctrl+B')).toBeInTheDocument();
    expect(screen.getByText('Ctrl++')).toBeInTheDocument();
    expect(screen.getByText('F11')).toBeInTheDocument();
  });
});
```

## Progress Tracking

- [ ] Phase 0: Foundation (2-3 hours)
- [ ] Phase 1: Core UI Toggles (4-5 hours)
- [ ] Phase 2: Zoom Controls (3-4 hours)
- [ ] Phase 3: Theme & Density (4-5 hours)
- [ ] Phase 4: Focus Mode (3-4 hours)
- [ ] Phase 5: Polish & Documentation (2-3 hours)

**Total Estimated**: 18-24 hours

---

_DELETE THIS FILE after development is complete. Source of truth is GitHub issue #61._
