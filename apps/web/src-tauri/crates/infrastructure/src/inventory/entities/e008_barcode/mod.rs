pub mod dto;
pub mod mapper;

use pharos_core::{DateTime, Id};
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Barcode entity - represents multiple barcodes per inventory item
/// Supports different barcode types (EAN13, UPC, internal codes, etc.)
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "barcodes")]
pub struct Model {
    /// Primary key
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Id,

    /// Foreign key to inventory_items
    pub inventory_item_id: Id,

    /// Barcode value - VARCHAR(100) (unique across all items)
    #[sea_orm(column_type = "String(StringLen::N(100))", unique)]
    pub barcode: String,

    /// Barcode type (e.g., "EAN13", "UPC", "INTERNAL", "SUPPLIER") - VARCHAR(50) (nullable)
    #[sea_orm(column_type = "String(StringLen::N(50))", nullable)]
    pub barcode_type: Option<String>,

    /// Whether this is the primary/default barcode for display - BOOLEAN
    pub is_primary: bool,

    /// Description/notes about this barcode (e.g., "100-pack", "Supplier A") - TEXT (nullable)
    #[sea_orm(column_type = "Text", nullable)]
    pub description: Option<String>,

    /// Record creation timestamp
    pub created_at: DateTime,

    /// User who created this barcode (nullable)
    #[sea_orm(nullable)]
    pub created_by: Option<Id>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    /// Many-to-one: Barcode belongs to one inventory item
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
            is_primary: sea_orm::ActiveValue::Set(false),
            created_at: sea_orm::ActiveValue::Set(DateTime::now()),
            ..Default::default()
        }
    }
}
