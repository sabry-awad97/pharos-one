use pharos_core::{Id, Result};
use pharos_infrastructure::inventory::entities::*;
use pharos_infrastructure::inventory::repositories::Repository;
use pharos_infrastructure::ServiceContainer;
use serde::{Deserialize, Serialize};
use tauri::State;

/// Unified inventory operations enum
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", content = "payload")]
pub enum InventoryOperation {
    // Product Type Operations
    GetAllProductTypes,
    GetProductTypeById(Id),
    GetActiveProductTypes,
    CreateProductType(CreateProductTypeDto),
    UpdateProductType { id: Id, dto: UpdateProductTypeDto },
    DeleteProductType(Id),

    // Manufacturer Operations
    GetAllManufacturers,
    GetManufacturerById(Id),
    GetActiveManufacturers,
    CreateManufacturer(CreateManufacturerDto),
    UpdateManufacturer { id: Id, dto: UpdateManufacturerDto },
    DeleteManufacturer(Id),

    // Category Operations
    GetAllCategories,
    GetCategoryById(Id),
    GetRootCategories,
    CreateCategory(CreateCategoryDto),
    UpdateCategory { id: Id, dto: UpdateCategoryDto },
    DeleteCategory(Id),

    // Supplier Operations
    GetAllSuppliers,
    GetSupplierById(Id),
    GetActiveSuppliers,
    CreateSupplier(CreateSupplierDto),
    UpdateSupplier { id: Id, dto: UpdateSupplierDto },
    DeleteSupplier(Id),

    // Product Operations
    GetAllProducts,
    GetProductById(Id),
    GetProductBySku(String),
    GetActiveProducts,
    SearchProducts(String),
    CreateProduct(CreateProductDto),
    UpdateProduct { id: Id, dto: UpdateProductDto },
    DeleteProduct(Id),

    // Inventory Item Operations
    GetAllInventoryItems,
    GetInventoryItemById(Id),
    GetInventoryItemsByProduct(Id),
    GetInventoryItemsByBatch(String),
    GetInventoryItemsByStatus(String),
    CreateInventoryItem(CreateInventoryItemDto),
    UpdateInventoryItem { id: Id, dto: UpdateInventoryItemDto },
    DeleteInventoryItem(Id),

    // Stock Transaction Operations
    GetAllStockTransactions,
    GetStockTransactionById(Id),
    GetStockTransactionsByInventoryItem(Id),
    GetStockTransactionsByType(String),
    CreateStockTransaction(CreateStockTransactionDto),
}

/// Unified inventory response enum
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum InventoryResponse {
    // Product Type Responses
    ProductTypes(Vec<ProductTypeDto>),
    ProductType(Option<ProductTypeDto>),
    ProductTypeCreated(ProductTypeDto),

    // Manufacturer Responses
    Manufacturers(Vec<ManufacturerDto>),
    Manufacturer(Option<ManufacturerDto>),
    ManufacturerCreated(ManufacturerDto),

    // Category Responses
    Categories(Vec<CategoryDto>),
    Category(Option<CategoryDto>),
    CategoryCreated(CategoryDto),

    // Supplier Responses
    Suppliers(Vec<SupplierDto>),
    Supplier(Option<SupplierDto>),
    SupplierCreated(SupplierDto),

    // Product Responses
    Products(Vec<ProductDto>),
    Product(Option<ProductDto>),
    ProductCreated(ProductDto),

    // Inventory Item Responses
    InventoryItems(Vec<InventoryItemDto>),
    InventoryItem(Option<InventoryItemDto>),
    InventoryItemCreated(InventoryItemDto),

    // Stock Transaction Responses
    StockTransactions(Vec<StockTransactionDto>),
    StockTransaction(Option<StockTransactionDto>),
    StockTransactionCreated(StockTransactionDto),

    // Generic Responses
    Deleted(Id),
}

/// Unified inventory command - single entry point for all inventory operations
#[tauri::command]
pub async fn inventory(
    container: State<'_, ServiceContainer>,
    operation: InventoryOperation,
) -> Result<InventoryResponse> {
    tracing::info!("Inventory command called with operation: {:?}", operation);

    let response = match operation {
        // Product Type Operations
        InventoryOperation::GetAllProductTypes => {
            let result = container.product_type_repository().find_all().await?;
            InventoryResponse::ProductTypes(result)
        }
        InventoryOperation::GetProductTypeById(id) => {
            let result = container.product_type_repository().find_by_id(&id).await?;
            InventoryResponse::ProductType(result)
        }
        InventoryOperation::GetActiveProductTypes => {
            let result = container.product_type_repository().find_active().await?;
            InventoryResponse::ProductTypes(result)
        }
        InventoryOperation::CreateProductType(dto) => {
            let result = container.product_type_repository().create(dto).await?;
            InventoryResponse::ProductTypeCreated(result)
        }
        InventoryOperation::UpdateProductType { id, dto } => {
            let result = container.product_type_repository().update(&id, dto).await?;
            InventoryResponse::ProductTypeCreated(result)
        }
        InventoryOperation::DeleteProductType(id) => {
            container.product_type_repository().delete(&id).await?;
            InventoryResponse::Deleted(id)
        }

        // Manufacturer Operations
        InventoryOperation::GetAllManufacturers => {
            let result = container.manufacturer_repository().find_all().await?;
            InventoryResponse::Manufacturers(result)
        }
        InventoryOperation::GetManufacturerById(id) => {
            let result = container.manufacturer_repository().find_by_id(&id).await?;
            InventoryResponse::Manufacturer(result)
        }
        InventoryOperation::GetActiveManufacturers => {
            let result = container.manufacturer_repository().find_active().await?;
            InventoryResponse::Manufacturers(result)
        }
        InventoryOperation::CreateManufacturer(dto) => {
            let result = container.manufacturer_repository().create(dto).await?;
            InventoryResponse::ManufacturerCreated(result)
        }
        InventoryOperation::UpdateManufacturer { id, dto } => {
            let result = container.manufacturer_repository().update(&id, dto).await?;
            InventoryResponse::ManufacturerCreated(result)
        }
        InventoryOperation::DeleteManufacturer(id) => {
            container.manufacturer_repository().delete(&id).await?;
            InventoryResponse::Deleted(id)
        }

        // Category Operations
        InventoryOperation::GetAllCategories => {
            let result = container.category_repository().find_all().await?;
            InventoryResponse::Categories(result)
        }
        InventoryOperation::GetCategoryById(id) => {
            let result = container.category_repository().find_by_id(&id).await?;
            InventoryResponse::Category(result)
        }
        InventoryOperation::GetRootCategories => {
            let result = container.category_repository().find_roots().await?;
            InventoryResponse::Categories(result)
        }
        InventoryOperation::CreateCategory(dto) => {
            let result = container.category_repository().create(dto).await?;
            InventoryResponse::CategoryCreated(result)
        }
        InventoryOperation::UpdateCategory { id, dto } => {
            let result = container.category_repository().update(&id, dto).await?;
            InventoryResponse::CategoryCreated(result)
        }
        InventoryOperation::DeleteCategory(id) => {
            container.category_repository().delete(&id).await?;
            InventoryResponse::Deleted(id)
        }

        // Supplier Operations
        InventoryOperation::GetAllSuppliers => {
            let result = container.supplier_repository().find_all().await?;
            InventoryResponse::Suppliers(result)
        }
        InventoryOperation::GetSupplierById(id) => {
            let result = container.supplier_repository().find_by_id(&id).await?;
            InventoryResponse::Supplier(result)
        }
        InventoryOperation::GetActiveSuppliers => {
            let result = container.supplier_repository().find_active().await?;
            InventoryResponse::Suppliers(result)
        }
        InventoryOperation::CreateSupplier(dto) => {
            let result = container.supplier_repository().create(dto).await?;
            InventoryResponse::SupplierCreated(result)
        }
        InventoryOperation::UpdateSupplier { id, dto } => {
            let result = container.supplier_repository().update(&id, dto).await?;
            InventoryResponse::SupplierCreated(result)
        }
        InventoryOperation::DeleteSupplier(id) => {
            container.supplier_repository().delete(&id).await?;
            InventoryResponse::Deleted(id)
        }

        // Product Operations
        InventoryOperation::GetAllProducts => {
            let result = container.product_repository().find_all().await?;
            InventoryResponse::Products(result)
        }
        InventoryOperation::GetProductById(id) => {
            let result = container.product_repository().find_by_id(&id).await?;
            InventoryResponse::Product(result)
        }
        InventoryOperation::GetProductBySku(sku) => {
            let result = container.product_repository().find_by_sku(&sku).await?;
            InventoryResponse::Product(result)
        }
        InventoryOperation::GetActiveProducts => {
            let result = container.product_repository().find_active().await?;
            InventoryResponse::Products(result)
        }
        InventoryOperation::SearchProducts(query) => {
            let result = container.product_repository().search(&query).await?;
            InventoryResponse::Products(result)
        }
        InventoryOperation::CreateProduct(dto) => {
            let result = container.product_repository().create(dto).await?;
            InventoryResponse::ProductCreated(result)
        }
        InventoryOperation::UpdateProduct { id, dto } => {
            let result = container.product_repository().update(&id, dto).await?;
            InventoryResponse::ProductCreated(result)
        }
        InventoryOperation::DeleteProduct(id) => {
            container.product_repository().delete(&id).await?;
            InventoryResponse::Deleted(id)
        }

        // Inventory Item Operations
        InventoryOperation::GetAllInventoryItems => {
            let result = container.inventory_item_repository().find_all().await?;
            InventoryResponse::InventoryItems(result)
        }
        InventoryOperation::GetInventoryItemById(id) => {
            let result = container
                .inventory_item_repository()
                .find_by_id(&id)
                .await?;
            InventoryResponse::InventoryItem(result)
        }
        InventoryOperation::GetInventoryItemsByProduct(product_id) => {
            let result = container
                .inventory_item_repository()
                .find_by_product(&product_id)
                .await?;
            InventoryResponse::InventoryItems(result)
        }
        InventoryOperation::GetInventoryItemsByBatch(batch_number) => {
            let result = container
                .inventory_item_repository()
                .find_by_batch(&batch_number)
                .await?;
            InventoryResponse::InventoryItems(result)
        }
        InventoryOperation::GetInventoryItemsByStatus(status) => {
            let result = container
                .inventory_item_repository()
                .find_by_status(&status)
                .await?;
            InventoryResponse::InventoryItems(result)
        }
        InventoryOperation::CreateInventoryItem(dto) => {
            let result = container.inventory_item_repository().create(dto).await?;
            InventoryResponse::InventoryItemCreated(result)
        }
        InventoryOperation::UpdateInventoryItem { id, dto } => {
            let result = container
                .inventory_item_repository()
                .update(&id, dto)
                .await?;
            InventoryResponse::InventoryItemCreated(result)
        }
        InventoryOperation::DeleteInventoryItem(id) => {
            container.inventory_item_repository().delete(&id).await?;
            InventoryResponse::Deleted(id)
        }

        // Stock Transaction Operations
        InventoryOperation::GetAllStockTransactions => {
            let result = container.stock_transaction_repository().find_all().await?;
            InventoryResponse::StockTransactions(result)
        }
        InventoryOperation::GetStockTransactionById(id) => {
            let result = container
                .stock_transaction_repository()
                .find_by_id(&id)
                .await?;
            InventoryResponse::StockTransaction(result)
        }
        InventoryOperation::GetStockTransactionsByInventoryItem(inventory_item_id) => {
            let result = container
                .stock_transaction_repository()
                .find_by_inventory_item(&inventory_item_id)
                .await?;
            InventoryResponse::StockTransactions(result)
        }
        InventoryOperation::GetStockTransactionsByType(transaction_type) => {
            let result = container
                .stock_transaction_repository()
                .find_by_type(&transaction_type)
                .await?;
            InventoryResponse::StockTransactions(result)
        }
        InventoryOperation::CreateStockTransaction(dto) => {
            let result = container.stock_transaction_repository().create(dto).await?;
            InventoryResponse::StockTransactionCreated(result)
        }
    };

    tracing::info!("Inventory operation successful");
    Ok(response)
}
