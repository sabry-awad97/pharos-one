use derive_getters::Getters;
use sea_orm::DatabaseConnection;
use std::sync::Arc;
use typed_builder::TypedBuilder;

use crate::inventory::repositories::{
    BarcodeRepository, CategoryRepository, InventoryItemRepository, ManufacturerRepository,
    ProductRepository, ProductTypeRepository, StockTransactionRepository, SupplierRepository,
};

/// Service container holding all repository instances
#[derive(Clone, TypedBuilder, Getters)]
pub struct ServiceContainer {
    // Product Type Repository
    #[builder(setter(into))]
    product_type_repository: Arc<ProductTypeRepository>,

    // Manufacturer Repository
    #[builder(setter(into))]
    manufacturer_repository: Arc<ManufacturerRepository>,

    // Category Repository
    #[builder(setter(into))]
    category_repository: Arc<CategoryRepository>,

    // Supplier Repository
    #[builder(setter(into))]
    supplier_repository: Arc<SupplierRepository>,

    // Product Repository
    #[builder(setter(into))]
    product_repository: Arc<ProductRepository>,

    // Inventory Item Repository
    #[builder(setter(into))]
    inventory_item_repository: Arc<InventoryItemRepository>,

    // Stock Transaction Repository
    #[builder(setter(into))]
    stock_transaction_repository: Arc<StockTransactionRepository>,

    // Barcode Repository
    #[builder(setter(into))]
    barcode_repository: Arc<BarcodeRepository>,
}

impl ServiceContainer {
    /// Create a new service container from a database connection
    pub fn from_db(db: DatabaseConnection) -> Self {
        // Initialize all repositories with the database connection
        let product_type_repository = Arc::new(ProductTypeRepository::new(db.clone()));
        let manufacturer_repository = Arc::new(ManufacturerRepository::new(db.clone()));
        let category_repository = Arc::new(CategoryRepository::new(db.clone()));
        let supplier_repository = Arc::new(SupplierRepository::new(db.clone()));
        let product_repository = Arc::new(ProductRepository::new(db.clone()));
        let inventory_item_repository = Arc::new(InventoryItemRepository::new(db.clone()));
        let stock_transaction_repository = Arc::new(StockTransactionRepository::new(db.clone()));
        let barcode_repository = Arc::new(BarcodeRepository::new(db));

        Self::builder()
            .product_type_repository(product_type_repository)
            .manufacturer_repository(manufacturer_repository)
            .category_repository(category_repository)
            .supplier_repository(supplier_repository)
            .product_repository(product_repository)
            .inventory_item_repository(inventory_item_repository)
            .stock_transaction_repository(stock_transaction_repository)
            .barcode_repository(barcode_repository)
            .build()
    }
}
