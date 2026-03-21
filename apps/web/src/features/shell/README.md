# Shell Components

Application shell chrome components for PharmOS, including title bar, menu bar, and status bar.

## Components

### TitleBar

Displays app branding, quick action buttons, and window controls.

```tsx
import { TitleBar } from "@/features/shell";
import { Save, RotateCcw, RefreshCw } from "lucide-react";

<TitleBar
  appName="PharmOS"
  quickActions={[
    {
      icon: Save,
      label: "Save",
      tooltip: "Save (Ctrl+S)",
      onClick: () => console.log("Save"),
    },
  ]}
  onMinimize={() => console.log("Minimize")}
  onMaximize={() => console.log("Maximize")}
  onClose={() => console.log("Close")}
/>;
```

**Props:**

- `appName?: string` - Application name (default: "PharmOS")
- `quickActions?: QuickAction[]` - Quick action buttons
- `onMinimize?: () => void` - Minimize button handler
- `onMaximize?: () => void` - Maximize button handler
- `onClose?: () => void` - Close button handler

### MenuBar

Navigation menu with File/Edit/View/Workspace/Tools/Help items.

```tsx
import { MenuBar, useMenuState } from "@/features/shell";

function MyComponent() {
  const { activeMenu, toggleMenu } = useMenuState();

  return (
    <MenuBar
      activeMenu={activeMenu}
      onMenuClick={toggleMenu}
      branchInfo="Main Branch"
      userInfo="Cashier: Dr. Ravi K."
      shiftInfo="Shift 2 · 14:35"
    />
  );
}
```

**Props:**

- `activeMenu: MenuType | null` - Currently active menu
- `onMenuClick: (menu: MenuType) => void` - Menu click handler
- `branchInfo?: string` - Branch information
- `userInfo?: string` - User information
- `shiftInfo?: string` - Shift information

### StatusBar

Displays tab statistics and keyboard shortcuts hint.

```tsx
import { StatusBar } from "@/features/shell";

<StatusBar
  statistics={{
    totalTabs: 6,
    pinnedTabs: 2,
    unsavedTabs: 1,
  }}
  keyboardShortcuts="Ctrl+T New · Ctrl+W Close · Ctrl+Tab Switch"
/>;
```

**Props:**

- `statistics?: TabStatistics` - Tab statistics to display
- `keyboardShortcuts?: string` - Keyboard shortcuts hint

### AppLayout

Complete application shell integrating all components.

```tsx
import { AppLayout } from "@/components/app-layout";

<AppLayout
  appName="PharmOS"
  statistics={{ totalTabs: 6, pinnedTabs: 2, unsavedTabs: 1 }}
  branchInfo="Main Branch"
  userInfo="Cashier: Dr. Ravi K."
  shiftInfo="Shift 2 · 14:35"
>
  {/* Your page content */}
</AppLayout>;
```

## Hooks

### useMenuState

Coordinates menu state to ensure only one menu is open at a time.

```tsx
import { useMenuState } from "@/features/shell";

function MyComponent() {
  const { activeMenu, openMenu, closeMenu, toggleMenu, isMenuOpen } =
    useMenuState();

  return (
    <button onClick={() => toggleMenu("file")}>
      File {isMenuOpen("file") && "✓"}
    </button>
  );
}
```

**Returns:**

- `activeMenu: MenuType | null` - Currently active menu
- `openMenu: (menu: MenuType) => void` - Open a specific menu
- `closeMenu: () => void` - Close all menus
- `toggleMenu: (menu: MenuType) => void` - Toggle a specific menu
- `isMenuOpen: (menu: MenuType) => boolean` - Check if a menu is open

## Types

### MenuType

```tsx
type MenuType = "file" | "edit" | "view" | "workspace" | "tools" | "help";
```

### QuickAction

```tsx
interface QuickAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  tooltip?: string;
}
```

### TabStatistics

```tsx
interface TabStatistics {
  totalTabs: number;
  pinnedTabs: number;
  unsavedTabs: number;
}
```

## Design Patterns

### Composability

All components follow the shadcn/ui composable pattern:

```tsx
// Instead of monolithic component
<TitleBar title="App" hasMinimize hasMaximize />

// We use composable sub-components
<TitleBar>
  <QuickActionButton icon={Save} onClick={...} />
  <WindowControl icon={Minus} onClick={...} />
</TitleBar>
```

### Theme Variables

All components use theme variables for colors:

```tsx
// ✅ CORRECT: Using theme variables
className = "bg-primary text-primary-foreground";

// ❌ WRONG: Hardcoded colors
className = "bg-blue-600 text-white";
```

### Flex-Based Layout

AppLayout uses professional flex-based height management:

```tsx
<div className="flex flex-col h-screen">
  <TitleBar className="flex-none" />
  <MenuBar className="flex-none" />
  <main className="flex-1 min-h-0 overflow-auto">{children}</main>
  <StatusBar className="flex-none" />
</div>
```

## Demo

Visit `/shell-demo` to see an interactive demonstration of all shell components.

## File Structure

```
apps/web/src/features/shell/
├── types.ts                    # Type definitions
├── index.ts                    # Barrel exports
├── README.md                   # This file
├── hooks/
│   └── use-menu-state.ts      # Menu coordination hook
└── components/
    ├── index.ts               # Component exports
    ├── TitleBar.tsx           # Title bar component
    ├── MenuBar.tsx            # Menu bar component
    └── StatusBar.tsx          # Status bar component
```

## Integration

The shell components are independent and can be used individually or together via AppLayout:

```tsx
// Individual components
import { TitleBar, MenuBar, StatusBar } from "@/features/shell";

// Complete layout
import { AppLayout } from "@/components/app-layout";
```

## Accessibility

All components include:

- Keyboard navigation support
- Focus states with ring-ring variable
- Semantic HTML structure
- ARIA labels where appropriate
- Proper button types

## Browser Support

Components use modern CSS features:

- CSS Grid and Flexbox
- CSS Variables (for theming)
- oklch() color space (with fallbacks)

Tested on:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
