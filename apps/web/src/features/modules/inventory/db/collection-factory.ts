/**
 * Collection factory for TanStack DB
 * Creates collections in eager (pre-loaded) or on-demand (lazy) modes
 *
 * This pattern allows flexible data loading strategies:
 * - Eager: Load all data upfront (good for small datasets)
 * - On-demand: Generate data as needed (good for large datasets)
 */

/**
 * Collection loading mode
 */
export enum CollectionMode {
  /** Pre-load all data into memory */
  EAGER = "eager",
  /** Generate data on-demand as requested */
  ON_DEMAND = "on-demand",
}

/**
 * Configuration for creating a collection
 */
export interface CollectionConfig<TData> {
  /** Collection name (must be unique) */
  name: string;
  /** Loading mode */
  mode: CollectionMode;
  /** Initial data (for eager mode) */
  initialData?: TData[];
  /** Generator function (for on-demand mode) */
  generator?: (id: number) => TData;
}

/**
 * Collection interface
 */
export interface Collection<TData> {
  /** Collection name */
  name: string;
  /** Loading mode */
  mode: CollectionMode;
  /** Get all data (eager mode) or cached data (on-demand mode) */
  getData: () => TData[];
  /** Get item by ID (generates if needed in on-demand mode) */
  getById: (id: number) => TData | undefined;
  /** Add item to collection */
  add: (item: TData) => void;
  /** Clear all data */
  clear: () => void;
}

/**
 * Create a collection with specified configuration
 *
 * @param config - Collection configuration
 * @returns Collection instance
 *
 * @example
 * ```ts
 * // Eager mode - pre-load data
 * const categories = createCollection({
 *   name: "categories",
 *   mode: CollectionMode.EAGER,
 *   initialData: [
 *     { id: 1, name: "Category 1" },
 *     { id: 2, name: "Category 2" },
 *   ],
 * });
 *
 * // On-demand mode - generate as needed
 * const products = createCollection({
 *   name: "products",
 *   mode: CollectionMode.ON_DEMAND,
 *   generator: (id) => generateProduct(id),
 * });
 * ```
 */
export function createCollection<TData extends { id: number }>(
  config: CollectionConfig<TData>,
): Collection<TData> {
  const { name, mode, initialData = [], generator } = config;

  // Internal data store
  let data: Map<number, TData> = new Map();

  // Initialize with data if eager mode
  if (mode === CollectionMode.EAGER && initialData.length > 0) {
    initialData.forEach((item) => {
      data.set(item.id, item);
    });
  }

  return {
    name,
    mode,

    getData() {
      return Array.from(data.values());
    },

    getById(id: number) {
      // Check if already in cache
      if (data.has(id)) {
        return data.get(id);
      }

      // Generate if on-demand mode and generator exists
      if (mode === CollectionMode.ON_DEMAND && generator) {
        const item = generator(id);
        data.set(id, item);
        return item;
      }

      return undefined;
    },

    add(item: TData) {
      data.set(item.id, item);
    },

    clear() {
      data.clear();
    },
  };
}

/**
 * Create multiple collections from a dataset
 *
 * @param dataset - Dataset with multiple entity types
 * @param mode - Loading mode for all collections
 * @returns Map of collection name to collection instance
 *
 * @example
 * ```ts
 * const dataset = generateTestDataset(DatasetSize.SMALL);
 * const collections = createCollectionsFromDataset(dataset, CollectionMode.EAGER);
 *
 * const categories = collections.get("categories");
 * const products = collections.get("products");
 * ```
 */
export function createCollectionsFromDataset<
  TDataset extends Record<string, Array<{ id: number }>>,
>(dataset: TDataset, mode: CollectionMode): Map<string, Collection<unknown>> {
  const collections = new Map<string, Collection<unknown>>();

  for (const [name, data] of Object.entries(dataset)) {
    const collection = createCollection({
      name,
      mode,
      initialData: data,
    });
    collections.set(name, collection);
  }

  return collections;
}
