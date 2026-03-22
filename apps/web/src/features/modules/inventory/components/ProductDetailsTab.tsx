/**
 * ProductDetailsTab Component
 * Displays comprehensive product information in the Details tab
 *
 * ARCHITECTURE: Read-only display component
 * - Uses useProduct hook for data fetching
 * - Displays all ProductStockSummary fields
 * - Uses CSS variables from globals.css (W constants)
 * - Handles loading, error, and empty states
 *
 * USAGE:
 * ```typescript
 * <ProductDetailsTab productId={1} />
 * ```
 */

import { useProduct } from "../hooks/use-products";

/**
 * Props for ProductDetailsTab component
 */
export interface ProductDetailsTabProps {
  /**
   * Product ID to fetch details for
   */
  productId: number;
}

/**
 * Details tab showing full product information
 *
 * Features:
 * - Displays all ProductStockSummary fields in compact layout
 * - Matches table font sizes and spacing
 * - Uses CSS variables for theming
 * - Accessible with semantic HTML
 *
 * @example
 * ```typescript
 * <ProductDetailsTab productId={1} />
 * ```
 */
export function ProductDetailsTab({ productId }: ProductDetailsTabProps) {
  const { data: product, isLoading, isError, error } = useProduct(productId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-[11px] text-muted-foreground">
        Loading product details...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full text-[11px] text-destructive">
        Error: {error?.message}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-full text-[11px] text-muted-foreground">
        Product not found
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-3 custom-scrollbar">
      <div className="space-y-3">
        {/* Basic Info Section */}
        <section>
          <h3 className="text-[10px] font-semibold uppercase tracking-wide mb-1.5 text-primary">
            Basic Information
          </h3>
          <div className="p-2.5 rounded-[4px] border border-border bg-card">
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
              <span className="text-[10px] text-muted-foreground">
                Product Name
              </span>
              <p className="text-xs font-medium text-foreground">
                {product.name}
              </p>

              <span className="text-[10px] text-muted-foreground">SKU</span>
              <p className="text-[11px] font-mono text-foreground">
                {product.sku}
              </p>

              {product.genericName && (
                <>
                  <span className="text-[10px] text-muted-foreground">
                    Generic Name
                  </span>
                  <p className="text-[11px] text-foreground">
                    {product.genericName}
                  </p>
                </>
              )}

              {product.manufacturer && (
                <>
                  <span className="text-[10px] text-muted-foreground">
                    Manufacturer
                  </span>
                  <p className="text-[11px] text-foreground">
                    {product.manufacturer}
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Classification Section */}
        <section>
          <h3 className="text-[10px] font-semibold uppercase tracking-wide mb-1.5 text-primary">
            Classification
          </h3>
          <div className="p-2.5 rounded-[4px] border border-border bg-card">
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
              <span className="text-[10px] text-muted-foreground">
                Category
              </span>
              <p className="text-[11px] text-foreground">
                {product.category.name}
              </p>

              {(product.requiresPrescription ||
                product.controlledSubstance) && (
                <>
                  <span className="text-[10px] text-muted-foreground">
                    Flags
                  </span>
                  <div className="flex gap-1.5 flex-wrap">
                    {product.requiresPrescription && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-[3px] bg-yellow-50 text-yellow-800 border border-yellow-200">
                        Requires Prescription
                      </span>
                    )}
                    {product.controlledSubstance && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-[3px] bg-red-50 text-red-800 border border-red-200">
                        Controlled Substance
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Supplier Section */}
        {product.defaultSupplier && (
          <section>
            <h3 className="text-[10px] font-semibold uppercase tracking-wide mb-1.5 text-primary">
              Supplier
            </h3>
            <div className="p-2.5 rounded-[4px] border border-border bg-card">
              <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                <span className="text-[10px] text-muted-foreground">
                  Default Supplier
                </span>
                <p className="text-xs font-medium text-foreground">
                  {product.defaultSupplier.name}
                </p>

                {product.defaultSupplier.contactPerson && (
                  <>
                    <span className="text-[10px] text-muted-foreground">
                      Contact Person
                    </span>
                    <p className="text-[11px] text-foreground">
                      {product.defaultSupplier.contactPerson}
                    </p>
                  </>
                )}

                {product.defaultSupplier.email && (
                  <>
                    <span className="text-[10px] text-muted-foreground">
                      Email
                    </span>
                    <p className="text-[11px] text-foreground">
                      {product.defaultSupplier.email}
                    </p>
                  </>
                )}

                {product.defaultSupplier.phone && (
                  <>
                    <span className="text-[10px] text-muted-foreground">
                      Phone
                    </span>
                    <p className="text-[11px] text-foreground">
                      {product.defaultSupplier.phone}
                    </p>
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Pricing Section */}
        <section>
          <h3 className="text-[10px] font-semibold uppercase tracking-wide mb-1.5 text-primary">
            Pricing
          </h3>
          <div className="p-2.5 rounded-[4px] border border-border bg-card">
            <div>
              <span className="text-[10px] text-muted-foreground">
                Base Price
              </span>
              <p className="text-xs font-semibold mt-0.5 text-foreground">
                ₹{product.basePrice.toFixed(2)}
              </p>
            </div>
          </div>
        </section>

        {/* Stock Section */}
        <section>
          <h3 className="text-[10px] font-semibold uppercase tracking-wide mb-1.5 text-primary">
            Stock Levels
          </h3>
          <div className="p-2.5 rounded-[4px] border border-border bg-card">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-muted-foreground">
                  Available
                </span>
                <p
                  className={`text-xs font-semibold mt-0.5 ${
                    product.availableQuantity === 0
                      ? "text-red-700"
                      : product.availableQuantity < product.reorderLevel
                        ? "text-yellow-700"
                        : "text-green-700"
                  }`}
                >
                  {product.availableQuantity}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground">Total</span>
                <p className="text-xs font-semibold mt-0.5 text-foreground">
                  {product.totalQuantity}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground">
                  Reserved
                </span>
                <p className="text-xs font-semibold mt-0.5 text-foreground">
                  {product.reservedQuantity}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground">
                  Reorder Level
                </span>
                <p className="text-xs font-semibold mt-0.5 text-foreground">
                  {product.reorderLevel}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Status Section */}
        <section>
          <h3 className="text-[10px] font-semibold uppercase tracking-wide mb-1.5 text-primary">
            Status
          </h3>
          <div className="p-2.5 rounded-[4px] border border-border bg-card">
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
              {product.nearestExpiry && (
                <>
                  <span className="text-[10px] text-muted-foreground">
                    Nearest Expiry
                  </span>
                  <p
                    className={`text-[11px] ${
                      product.stockStatus === "expiring"
                        ? "text-orange-700"
                        : "text-foreground"
                    }`}
                  >
                    {product.nearestExpiry}
                  </p>
                </>
              )}

              <span className="text-[10px] text-muted-foreground">
                Batch Count
              </span>
              <p className="text-[11px] text-foreground">
                {product.batchCount}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
