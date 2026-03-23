// Entities in dependency order (like migrations)
// e001 = no dependencies, e002 = depends on e001, etc.

pub mod e001_product_type;
pub mod e002_manufacturer;
pub mod e003_category;
pub mod e004_supplier;
pub mod e005_product;
pub mod e006_inventory_item;
pub mod e007_stock_transaction;
pub mod e008_barcode;

// Re-export for convenience
pub use e001_product_type::{
    dto::{CreateProductTypeDto, ProductTypeDto, ProductTypeFilters, UpdateProductTypeDto},
    Entity as ProductTypeEntity, Model as ProductTypeModel,
};

pub use e002_manufacturer::{
    dto::{CreateManufacturerDto, ManufacturerDto, ManufacturerFilters, UpdateManufacturerDto},
    Entity as ManufacturerEntity, Model as ManufacturerModel,
};

pub use e003_category::{
    dto::{CategoryDto, CreateCategoryDto, UpdateCategoryDto},
    Entity as CategoryEntity, Model as CategoryModel,
};

pub use e004_supplier::{
    dto::{CreateSupplierDto, SupplierDto, SupplierFilters, UpdateSupplierDto},
    Entity as SupplierEntity, Model as SupplierModel,
};

pub use e005_product::{
    dto::{CreateProductDto, ProductDto, ProductFilters, UpdateProductDto},
    Entity as ProductEntity, Model as ProductModel,
};

pub use e006_inventory_item::{
    dto::{CreateInventoryItemDto, InventoryItemDto, InventoryItemFilters, UpdateInventoryItemDto},
    Entity as InventoryItemEntity, Model as InventoryItemModel,
};

pub use e007_stock_transaction::{
    dto::{CreateStockTransactionDto, StockTransactionDto, StockTransactionFilters},
    Entity as StockTransactionEntity, Model as StockTransactionModel,
};

pub use e008_barcode::{
    dto::{BarcodeDto, CreateBarcodeDto, UpdateBarcodeDto},
    Entity as BarcodeEntity, Model as BarcodeModel,
};
