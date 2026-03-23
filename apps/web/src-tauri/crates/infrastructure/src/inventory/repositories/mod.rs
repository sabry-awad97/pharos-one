// Repositories in dependency order (matching entities)
pub mod r001_product_type_repository;
pub mod r002_manufacturer_repository;
pub mod r003_category_repository;
pub mod r004_supplier_repository;
pub mod r005_product_repository;
pub mod r006_inventory_item_repository;
pub mod r007_stock_transaction_repository;
pub mod r008_barcode_repository;

pub use r001_product_type_repository::ProductTypeRepository;
pub use r002_manufacturer_repository::ManufacturerRepository;
pub use r003_category_repository::CategoryRepository;
pub use r004_supplier_repository::SupplierRepository;
pub use r005_product_repository::ProductRepository;
pub use r006_inventory_item_repository::InventoryItemRepository;
pub use r007_stock_transaction_repository::StockTransactionRepository;
pub use r008_barcode_repository::BarcodeRepository;

use pharos_core::{Id, Result};

/// Base repository trait for common CRUD operations
#[async_trait::async_trait]
pub trait Repository<T, CreateDto, UpdateDto> {
    /// Find all records
    async fn find_all(&self) -> Result<Vec<T>>;

    /// Find record by ID
    async fn find_by_id(&self, id: &Id) -> Result<Option<T>>;

    /// Create new record
    async fn create(&self, dto: CreateDto) -> Result<T>;

    /// Update existing record
    async fn update(&self, id: &Id, dto: UpdateDto) -> Result<T>;

    /// Delete record by ID (soft delete if applicable)
    async fn delete(&self, id: &Id) -> Result<()>;

    /// Count total records
    async fn count(&self) -> Result<u64>;
}
