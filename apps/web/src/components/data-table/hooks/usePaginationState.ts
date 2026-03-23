import { createParser, useQueryStates } from "nuqs";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 25;
const MIN_PAGE = 1;
const MIN_PAGE_SIZE = 1;

// Custom parser for page that clamps to minimum value
const parsePageNumber = createParser({
  parse: (value) => {
    const num = parseInt(value, 10);
    return isNaN(num) || num < MIN_PAGE ? DEFAULT_PAGE : num;
  },
  serialize: (value) => String(value),
});

// Custom parser for page size that clamps to minimum value
const parsePageSizeNumber = createParser({
  parse: (value) => {
    const num = parseInt(value, 10);
    return isNaN(num) || num < MIN_PAGE_SIZE ? DEFAULT_PAGE_SIZE : num;
  },
  serialize: (value) => String(value),
});

/**
 * Custom hook for managing pagination state in URL query parameters
 * Syncs pagination state with URL for persistence across page refreshes
 *
 * @returns Tuple of [state, setState] where:
 *   - state: { page: number, pageSize: number }
 *   - setState: Function to update pagination state
 */
export function usePaginationState() {
  return useQueryStates(
    {
      page: parsePageNumber.withDefault(DEFAULT_PAGE).withOptions({
        clearOnDefault: true,
      }),
      pageSize: parsePageSizeNumber.withDefault(DEFAULT_PAGE_SIZE).withOptions({
        clearOnDefault: true,
      }),
    },
    {
      history: "push",
    },
  );
}
