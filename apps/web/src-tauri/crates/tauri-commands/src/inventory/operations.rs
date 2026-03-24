use pharos_core::{Id, Result};
use pharos_infrastructure::inventory::entities::*;
use pharos_infrastructure::inventory::repositories::*;
use pharos_infrastructure::ServiceContainer;
use serde::{Deserialize, Serialize};
use tauri::State;

/// Unified inventory operations enum
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", content = "payload")]
pub enum InventoryOperation {
    // Category Operations
    GetAllCategories,
    GetCategoryById(Id),
    GetActiveCategories,

    // Company Operations
    GetAllCompanies,
    GetCompanyById(Id),
    GetActiveCompanies,

    // Product Operations
    GetAllProducts,
    GetProductById(Id),
    GetProductBySku(String),
    GetProductByBarcode(String),
    GetActiveProducts,

    // Product Batch Operations
    GetAllProductBatches,
    GetProductBatchById(Id),
    GetProductBatchesByProduct(Id),

    // Unit Operations
    GetAllUnits,
    GetUnitById(Id),

    // Location Operations
    GetAllLocations,
    GetLocationById(Id),
    GetLocationsByBranch(Id),

    // Branch Inventory Operations
    GetBranchInventoryByBranch(Id),
    GetBranchInventoryByProduct(Id),
    GetLowStockItems(Id),
}

/// Unified inventory response enum
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum InventoryResponse {
    // Category Responses
    Categories(Vec<CategoryModel>),
    Category(Option<CategoryModel>),

    // Company Responses
    Companies(Vec<CompanyModel>),
    Company(Option<CompanyModel>),

    // Product Responses
    Products(Vec<ProductModel>),
    Product(Option<ProductModel>),

    // Product Batch Responses
    ProductBatches(Vec<ProductBatchModel>),
    ProductBatch(Option<ProductBatchModel>),

    // Unit Responses
    Units(Vec<UnitModel>),
    Unit(Option<UnitModel>),

    // Location Responses
    Locations(Vec<LocationModel>),
    Location(Option<LocationModel>),

    // Branch Inventory Responses
    BranchInventory(Vec<BranchInventoryModel>),
    BranchInventoryItem(Option<BranchInventoryModel>),
}

/// Unified inventory command - single entry point for all inventory operations
#[tauri::command]
pub async fn inventory(
    container: State<'_, ServiceContainer>,
    operation: InventoryOperation,
) -> Result<InventoryResponse> {
    tracing::info!("Inventory command called with operation: {:?}", operation);

    let db = container.db();

    let response = match operation {
        // Category Operations
        InventoryOperation::GetAllCategories => {
            let repo = CategoryRepository::new(db.clone());
            let result = repo.find_all().await?;
            InventoryResponse::Categories(result)
        }
        InventoryOperation::GetCategoryById(id) => {
            let repo = CategoryRepository::new(db.clone());
            let result = repo.find_by_id(&id).await?;
            InventoryResponse::Category(result)
        }
        InventoryOperation::GetActiveCategories => {
            let repo = CategoryRepository::new(db.clone());
            let result = repo.find_active().await?;
            InventoryResponse::Categories(result)
        }

        // Company Operations
        InventoryOperation::GetAllCompanies => {
            let repo = CompanyRepository::new(db.clone());
            let result = repo.find_all().await?;
            InventoryResponse::Companies(result)
        }
        InventoryOperation::GetCompanyById(id) => {
            let repo = CompanyRepository::new(db.clone());
            let result = repo.find_by_id(&id).await?;
            InventoryResponse::Company(result)
        }
        InventoryOperation::GetActiveCompanies => {
            let repo = CompanyRepository::new(db.clone());
            let result = repo.find_active().await?;
            InventoryResponse::Companies(result)
        }

        // Product Operations
        InventoryOperation::GetAllProducts => {
            let repo = ProductRepository::new(db.clone());
            let result = repo.find_all().await?;
            InventoryResponse::Products(result)
        }
        InventoryOperation::GetProductById(id) => {
            let repo = ProductRepository::new(db.clone());
            let result = repo.find_by_id(&id).await?;
            InventoryResponse::Product(result)
        }
        InventoryOperation::GetProductBySku(sku) => {
            let repo = ProductRepository::new(db.clone());
            let result = repo.find_by_sku(&sku).await?;
            InventoryResponse::Product(result)
        }
        InventoryOperation::GetProductByBarcode(barcode) => {
            let repo = ProductRepository::new(db.clone());
            let result = repo.find_by_barcode(&barcode).await?;
            InventoryResponse::Product(result)
        }
        InventoryOperation::GetActiveProducts => {
            let repo = ProductRepository::new(db.clone());
            let result = repo.find_active().await?;
            InventoryResponse::Products(result)
        }

        // Product Batch Operations
        InventoryOperation::GetAllProductBatches => {
            let repo = ProductBatchRepository::new(db.clone());
            let result = repo.find_all().await?;
            InventoryResponse::ProductBatches(result)
        }
        InventoryOperation::GetProductBatchById(id) => {
            let repo = ProductBatchRepository::new(db.clone());
            let result = repo.find_by_id(&id).await?;
            InventoryResponse::ProductBatch(result)
        }
        InventoryOperation::GetProductBatchesByProduct(product_id) => {
            let repo = ProductBatchRepository::new(db.clone());
            let result = repo.find_by_product(&product_id).await?;
            InventoryResponse::ProductBatches(result)
        }

        // Unit Operations
        InventoryOperation::GetAllUnits => {
            let repo = UnitRepository::new(db.clone());
            let result = repo.find_all().await?;
            InventoryResponse::Units(result)
        }
        InventoryOperation::GetUnitById(id) => {
            let repo = UnitRepository::new(db.clone());
            let result = repo.find_by_id(&id).await?;
            InventoryResponse::Unit(result)
        }

        // Location Operations
        InventoryOperation::GetAllLocations => {
            let repo = LocationRepository::new(db.clone());
            let result = repo.find_all().await?;
            InventoryResponse::Locations(result)
        }
        InventoryOperation::GetLocationById(id) => {
            let repo = LocationRepository::new(db.clone());
            let result = repo.find_by_id(&id).await?;
            InventoryResponse::Location(result)
        }
        InventoryOperation::GetLocationsByBranch(branch_id) => {
            let repo = LocationRepository::new(db.clone());
            let result = repo.find_by_branch(&branch_id).await?;
            InventoryResponse::Locations(result)
        }

        // Branch Inventory Operations
        InventoryOperation::GetBranchInventoryByBranch(branch_id) => {
            let repo = BranchInventoryRepository::new(db.clone());
            let result = repo.find_by_branch(&branch_id).await?;
            InventoryResponse::BranchInventory(result)
        }
        InventoryOperation::GetBranchInventoryByProduct(product_id) => {
            let repo = BranchInventoryRepository::new(db.clone());
            let result = repo.find_by_product(&product_id).await?;
            InventoryResponse::BranchInventory(result)
        }
        InventoryOperation::GetLowStockItems(branch_id) => {
            let repo = BranchInventoryRepository::new(db.clone());
            let result = repo.find_low_stock(&branch_id).await?;
            InventoryResponse::BranchInventory(result)
        }
    };

    tracing::info!("Inventory operation successful");
    Ok(response)
}
