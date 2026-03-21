# Testing Setup

This project uses Vitest with React Testing Library for unit and component testing.

## Running Tests

```bash
# Watch mode (runs tests on file changes)
bun test

# UI mode (interactive test runner)
bun test:ui

# Single run (CI/CD)
bun test:run

# With coverage report
bun test:coverage
```

## Configuration

- **Test Runner**: Vitest 4.x
- **Environment**: happy-dom (lightweight DOM implementation)
- **Testing Library**: @testing-library/react
- **Setup File**: `src/test/setup.ts` (imports jest-dom matchers)

## Writing Tests

Place test files next to the code they test with `.test.tsx` or `.test.ts` extension:

```
src/
  components/
    Button.tsx
    Button.test.tsx
```

Example test:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("should render with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
});
```

## Coverage

Coverage reports are generated in `coverage/` directory with HTML, JSON, and text formats.
