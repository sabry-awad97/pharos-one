pub mod dto;
pub mod mapper;

use pharos_core::{DateTime, Id};
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Stock Transaction entity - Audit trail of inventory movements
///
/// Tracks all changes to inventory item quantities:
/// - Purchases (receiving stock)
/// - Sales (dispensing to customers)
/// - Adjustments (corrections, damage, expiry)
/// - Transfers (between locations)
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "stock_transactions")]
pub struct Model {
    /// Primary key
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Id,

    /// Inventory item ID - Foreign key
    pub inventory_item_id: Id,

    /// Transaction type: purchase, sale, adjustment, transfer, return, damage, expiry
    #[sea_orm(column_type = "String(StringLen::N(50))")]
    pub transaction_type: String,

    /// Quantity change (positive = add, negative = remove)
    pub quantity: i32,

    /// Order ID if related to sale/purchase (nullable)
    #[sea_orm(nullable)]
    pub order_id: Option<Id>,

    /// User who performed the transaction
    pub user_id: Id,

    /// Reason/notes for the transaction - TEXT (nullable)
    #[sea_orm(column_type = "Text", nullable)]
    pub reason: Option<String>,

    /// Transaction timestamp
    pub timestamp: DateTime,

    /// Record creation timestamp
    pub created_at: DateTime,

    /// User who created this record (nullable)
    #[sea_orm(nullable)]
    pub created_by: Option<Id>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    /// Many-to-one: Transaction belongs to an inventory item
    #[sea_orm(
        belongs_to = "crate::inventory::entities::e006_inventory_item::Entity",
        from = "Column::InventoryItemId",
        to = "crate::inventory::entities::e006_inventory_item::Column::Id"
    )]
    InventoryItem,
}

impl Related<crate::inventory::entities::e006_inventory_item::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::InventoryItem.def()
    }
}

#[async_trait::async_trait]
impl ActiveModelBehavior for ActiveModel {
    fn new() -> Self {
        Self {
            id: sea_orm::ActiveValue::Set(Id::new()),
            timestamp: sea_orm::ActiveValue::Set(DateTime::now()),
            created_at: sea_orm::ActiveValue::Set(DateTime::now()),
            ..Default::default()
        }
    }
}
