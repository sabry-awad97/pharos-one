pub mod dto;
pub mod mapper;

use pharos_core::{DateTime, Id};
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Inventory Item entity - Physical stock (what you HAVE)
///
/// Represents actual physical items in stock with batch/lot tracking.
/// Each inventory item is an instance of a Product with specific:
/// - Batch/lot number
/// - Expiry date
/// - Purchase details
/// - Location
/// - Quantity tracking
///
/// Example: "100 units of Amoxicillin 500mg, Batch #ABC123, expires 2025-12-31"
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "inventory_items")]
pub struct Model {
    /// Primary key
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Id,

    /// Product ID - Foreign key to products table
    pub product_id: Id,

    /// Batch/Lot number from supplier - VARCHAR(100)
    #[sea_orm(column_type = "String(StringLen::N(100))")]
    pub batch_number: String,

    /// Expiry date - DATE
    #[sea_orm(column_type = "Date")]
    pub expiry_date: Date,

    /// Supplier ID - Foreign key
    pub supplier_id: Id,

    /// Purchase order ID - Foreign key (nullable)
    #[sea_orm(nullable)]
    pub purchase_order_id: Option<Id>,

    /// Date received - DATE
    #[sea_orm(column_type = "Date")]
    pub received_date: Date,

    /// Cost per unit at purchase - DECIMAL(10,2)
    #[sea_orm(column_type = "Decimal(Some((10, 2)))")]
    pub cost_per_unit: Decimal,

    /// Quantity received initially - INT
    pub quantity_received: i32,

    /// Current quantity remaining - INT
    pub quantity_remaining: i32,

    /// Storage location ID - Foreign key (nullable)
    #[sea_orm(nullable)]
    pub location_id: Option<Id>,

    /// Status: available, reserved, quarantine, expired, recalled
    #[sea_orm(column_type = "String(StringLen::N(50))")]
    pub status: String,

    /// Additional notes - TEXT (nullable)
    #[sea_orm(column_type = "Text", nullable)]
    pub notes: Option<String>,

    /// Record creation timestamp
    pub created_at: DateTime,

    /// Last update timestamp
    pub updated_at: DateTime,

    /// User who created this record (nullable)
    #[sea_orm(nullable)]
    pub created_by: Option<Id>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    /// Many-to-one: Inventory item belongs to a product
    #[sea_orm(
        belongs_to = "crate::inventory::entities::e005_product::Entity",
        from = "Column::ProductId",
        to = "crate::inventory::entities::e005_product::Column::Id"
    )]
    Product,

    /// Many-to-one: Inventory item belongs to a supplier
    #[sea_orm(
        belongs_to = "crate::inventory::entities::e004_supplier::Entity",
        from = "Column::SupplierId",
        to = "crate::inventory::entities::e004_supplier::Column::Id"
    )]
    Supplier,

    /// One-to-many: Inventory item has many transactions
    #[sea_orm(has_many = "crate::inventory::entities::e007_stock_transaction::Entity")]
    StockTransactions,
}

impl Related<crate::inventory::entities::e005_product::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Product.def()
    }
}

impl Related<crate::inventory::entities::e004_supplier::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Supplier.def()
    }
}

impl Related<crate::inventory::entities::e007_stock_transaction::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::StockTransactions.def()
    }
}

#[async_trait::async_trait]
impl ActiveModelBehavior for ActiveModel {
    fn new() -> Self {
        Self {
            id: sea_orm::ActiveValue::Set(Id::new()),
            status: sea_orm::ActiveValue::Set("available".to_string()),
            created_at: sea_orm::ActiveValue::Set(DateTime::now()),
            updated_at: sea_orm::ActiveValue::Set(DateTime::now()),
            ..Default::default()
        }
    }

    async fn before_save<C>(mut self, _db: &C, insert: bool) -> Result<Self, DbErr>
    where
        C: ConnectionTrait,
    {
        if !insert {
            self.updated_at = sea_orm::ActiveValue::Set(DateTime::now());
        }
        Ok(self)
    }
}
