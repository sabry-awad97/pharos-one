# Inventory Database Schema Design (3NF)

## Design Principles

### Third Normal Form (3NF) Requirements

1. **1NF**: All attributes contain atomic values (no repeating groups)
2. **2NF**: No partial dependencies (all non-key attributes depend on the entire primary key)
3. **3NF**: No transitive dependencies (non-key attributes don't depend on other non-key attributes)

### TanStack DB Optimization

- Denormalize computed/aggregated fields for query performance
- Use foreign keys for joins (TanStack DB supports efficient joins)
- Index frequently filtered columns
- Keep transaction tables separate for audit trail
- Use UUID v7 for time-ordered IDs

## Entity Relationship Diagram

```
┌─────────────────┐
│  product_types  │ (Master data: Drug, Medical Device, Milk, Cosmetics)
└────────┬────────┘
         │ 1:N
         │
┌────────▼────────┐       ┌──────────────┐
│    products     │◄──────┤ manufacturers│ (Master data)
│  (Master SKU)   │ N:1   └──────────────┘
└────────┬────────┘
         │ 1:N           ┌──────────────┐
         │               │  categories  │ (Master data, hierarchical)
         │          N:1  └──────────────┘
         │◄──────────────┘
         │
         │ 1:N
┌────────▼────────────┐
│  inventory_items    │  (Physical stock with batch tracking)
│  (What you HAVE)    │
└────────┬────────────┘
         │ N:1         ┌──────────────┐
         │◄────────────┤  suppliers   │ (Master data)
         │             └──────────────┘
         │
         │ 1:N
┌────────▼────────────┐
│ stock_transactions  │  (Audit trail)
└─────────────────────┘
```

## Tables

### 1. product_types (Master Data)

**Purpose**: User-defined product classifications
**3NF**: ✅ No transitive dependencies

```sql
CREATE TABLE product_types (
    id UUID PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,

    -- Type-specific requirements (atomic attributes)
    requires_prescription BOOLEAN NOT NULL DEFAULT false,
    requires_batch_tracking BOOLEAN NOT NULL DEFAULT true,
    requires_expiry_date BOOLEAN NOT NULL DEFAULT true,
    requires_temperature_control BOOLEAN NOT NULL DEFAULT false,

    regulatory_category VARCHAR(100),
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,

    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_product_types_code ON product_types(code);
CREATE INDEX idx_product_types_active ON product_types(is_active);
```

### 2. manufacturers (Master Data)

**Purpose**: Pharmaceutical/product manufacturers
**3NF**: ✅ No transitive dependencies

```sql
CREATE TABLE manufacturers (
    id UUID PRIMARY KEY,
    name VARCHAR(200) UNIQUE NOT NULL,
    short_name VARCHAR(50),
    country VARCHAR(100),

    -- Contact information (atomic attributes)
    phone VARCHAR(50),
    email VARCHAR(100),
    website VARCHAR(200),

    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,

    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_manufacturers_name ON manufacturers(name);
CREATE INDEX idx_manufacturers_active ON manufacturers(is_active);
CREATE INDEX idx_manufacturers_country ON manufacturers(country);
```

### 3. categories (Master Data, Hierarchical)

**Purpose**: Product categorization
**3NF**: ✅ Self-referential FK, no transitive dependencies

```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY,
    name VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    parent_category_id UUID REFERENCES categories(id),

    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_categories_parent ON categories(parent_category_id);
```

### 4. products (Master Catalog)

**Purpose**: Product definitions (what you CAN sell)
**3NF**: ✅ All FKs, no computed fields, no transitive dependencies

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY,

    -- Product identification
    name VARCHAR(200) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    generic_name VARCHAR(200),

    -- Foreign keys (normalized)
    product_type_id UUID NOT NULL REFERENCES product_types(id),
    manufacturer_id UUID REFERENCES manufacturers(id),
    category_id UUID NOT NULL REFERENCES categories(id),

    description TEXT,

    -- Pricing and inventory
    base_price DECIMAL(10,2) NOT NULL,
    unit_of_measure VARCHAR(50) NOT NULL,
    reorder_level INTEGER NOT NULL DEFAULT 0,

    -- Regulatory flags (atomic attributes)
    requires_prescription BOOLEAN NOT NULL DEFAULT false,
    controlled_substance BOOLEAN NOT NULL DEFAULT false,

    is_active BOOLEAN NOT NULL DEFAULT true,

    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

-- Indexes for TanStack DB filtering
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_type ON products(product_type_id);
CREATE INDEX idx_products_manufacturer ON products(manufacturer_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_prescription ON products(requires_prescription);
```

### 5. suppliers (Master Data)

**Purpose**: Vendors who supply inventory
**3NF**: ✅ No transitive dependencies

```sql
CREATE TABLE suppliers (
    id UUID PRIMARY KEY,
    name VARCHAR(200) UNIQUE NOT NULL,

    -- Contact information (atomic attributes)
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(50),
    address TEXT,

    is_active BOOLEAN NOT NULL DEFAULT true,

    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_suppliers_name ON suppliers(name);
CREATE INDEX idx_suppliers_active ON suppliers(is_active);
```

### 6. inventory_items (Physical Stock)

**Purpose**: Actual physical items with batch tracking
**3NF**: ✅ All FKs, no computed fields except quantity_remaining

**Note**: `quantity_remaining` is technically a computed field (sum of transactions),
but we denormalize it for performance. It's updated via triggers/application logic.

```sql
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY,

    -- Foreign keys (normalized)
    product_id UUID NOT NULL REFERENCES products(id),
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    purchase_order_id UUID, -- Future: REFERENCES purchase_orders(id)
    location_id UUID,       -- Future: REFERENCES locations(id)

    -- Batch tracking (atomic attributes)
    batch_number VARCHAR(100) NOT NULL,
    expiry_date DATE NOT NULL,
    received_date DATE NOT NULL,

    -- Quantity tracking (denormalized for performance)
    cost_per_unit DECIMAL(10,2) NOT NULL,
    quantity_received INTEGER NOT NULL,
    quantity_remaining INTEGER NOT NULL, -- Denormalized, updated by transactions

    -- Status enum: available, reserved, quarantine, expired, recalled
    status VARCHAR(50) NOT NULL DEFAULT 'available',

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,

    -- Composite unique constraint for batch tracking
    CONSTRAINT uk_inventory_batch UNIQUE (product_id, batch_number, supplier_id)
);

-- Indexes for TanStack DB filtering
CREATE INDEX idx_inventory_product ON inventory_items(product_id);
CREATE INDEX idx_inventory_supplier ON inventory_items(supplier_id);
CREATE INDEX idx_inventory_batch ON inventory_items(batch_number);
CREATE INDEX idx_inventory_expiry ON inventory_items(expiry_date);
CREATE INDEX idx_inventory_status ON inventory_items(status);
CREATE INDEX idx_inventory_location ON inventory_items(location_id);
```

### 7. stock_transactions (Audit Trail)

**Purpose**: Immutable audit trail of all stock movements
**3NF**: ✅ No transitive dependencies, append-only

```sql
CREATE TABLE stock_transactions (
    id UUID PRIMARY KEY,

    -- Foreign keys (normalized)
    inventory_item_id UUID NOT NULL REFERENCES inventory_items(id),
    user_id UUID NOT NULL, -- Future: REFERENCES users(id)
    order_id UUID,         -- Future: REFERENCES orders(id)

    -- Transaction details (atomic attributes)
    transaction_type VARCHAR(50) NOT NULL, -- purchase, sale, adjustment, transfer, return, damage, expiry
    quantity INTEGER NOT NULL, -- Positive = add, Negative = remove
    reason TEXT,

    -- Timestamp (immutable)
    timestamp TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);

-- Indexes for TanStack DB filtering
CREATE INDEX idx_transactions_item ON stock_transactions(inventory_item_id);
CREATE INDEX idx_transactions_type ON stock_transactions(transaction_type);
CREATE INDEX idx_transactions_timestamp ON stock_transactions(timestamp);
CREATE INDEX idx_transactions_user ON stock_transactions(user_id);
```

## 3NF Verification

### ✅ product_types

- PK: id
- All attributes depend only on id
- No transitive dependencies

### ✅ manufacturers

- PK: id
- All attributes depend only on id
- No transitive dependencies

### ✅ categories

- PK: id
- All attributes depend only on id
- parent_category_id is a FK, not a transitive dependency

### ✅ products

- PK: id
- All non-key attributes depend only on id
- FKs (product_type_id, manufacturer_id, category_id) are direct dependencies
- No transitive dependencies (e.g., manufacturer_country is NOT stored here)

### ✅ suppliers

- PK: id
- All attributes depend only on id
- No transitive dependencies

### ✅ inventory_items

- PK: id
- All non-key attributes depend only on id
- FKs (product_id, supplier_id) are direct dependencies
- quantity_remaining is denormalized for performance (acceptable trade-off)

### ✅ stock_transactions

- PK: id
- All attributes depend only on id
- Immutable audit trail (append-only)

## TanStack DB Query Patterns

### Efficient Joins

```typescript
// Product with type, manufacturer, category
q.from({ product: products })
  .join({ type: productTypes }, eq(product.productTypeId, type.id))
  .join(
    { manufacturer: manufacturers },
    eq(product.manufacturerId, manufacturer.id),
  )
  .join({ category: categories }, eq(product.categoryId, category.id));

// Inventory with product details
q.from({ item: inventoryItems })
  .join({ product: products }, eq(item.productId, product.id))
  .join({ supplier: suppliers }, eq(item.supplierId, supplier.id));

// Transactions with inventory and product
q.from({ tx: stockTransactions })
  .join({ item: inventoryItems }, eq(tx.inventoryItemId, item.id))
  .join({ product: products }, eq(item.productId, product.id));
```

### Predicate Push-Down Filters

```typescript
// Filter by product type
.where(({ product, type }) => eq(type.code, 'drug'))

// Filter by expiry date range
.where(({ item }) => and(
  gte(item.expiryDate, startDate),
  lte(item.expiryDate, endDate)
))

// Filter by status
.where(({ item }) => eq(item.status, 'available'))
```

## Best Practices Applied

1. ✅ **3NF Compliance**: No transitive dependencies
2. ✅ **UUID v7 Primary Keys**: Time-ordered, globally unique
3. ✅ **Foreign Key Constraints**: Referential integrity
4. ✅ **Indexed Columns**: All FK columns and frequently filtered columns
5. ✅ **Immutable Audit Trail**: stock_transactions is append-only
6. ✅ **Denormalization for Performance**: quantity_remaining (acceptable trade-off)
7. ✅ **Atomic Attributes**: No repeating groups or multi-valued attributes
8. ✅ **Consistent Naming**: snake_case, descriptive names
9. ✅ **Timestamps**: created_at, updated_at on all tables
10. ✅ **Soft Deletes**: is_active flags instead of hard deletes

## Migration Strategy

1. Create master data tables first (product_types, manufacturers, categories, suppliers)
2. Create products table (depends on master data)
3. Create inventory_items table (depends on products, suppliers)
4. Create stock_transactions table (depends on inventory_items)
5. Seed default product types
6. Create indexes
7. Add triggers for quantity_remaining updates (optional)
