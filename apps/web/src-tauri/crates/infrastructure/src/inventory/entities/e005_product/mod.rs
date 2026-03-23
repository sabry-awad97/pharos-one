pub mod dto;
pub mod mapper;

use pharos_core::{DateTime, Id};
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Product entity - Master catalog (what you CAN sell)
///
/// Represents the product definition/template without physical stock.
/// Think of this as the "blueprint" or "SKU master data".
///
/// Example: "Amoxicillin 500mg Capsules" as a product definition
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "products")]
pub struct Model {
    /// Primary key
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Id,

    /// Product name - VARCHAR(200)
    #[sea_orm(column_type = "String(StringLen::N(200))")]
    pub name: String,

    /// SKU (Stock Keeping Unit) - VARCHAR(100) (unique)
    #[sea_orm(column_type = "String(StringLen::N(100))", unique)]
    pub sku: String,

    /// Generic/scientific name - VARCHAR(200) (nullable)
    #[sea_orm(column_type = "String(StringLen::N(200))", nullable)]
    pub generic_name: Option<String>,

    /// Manufacturer ID - Foreign key
    #[sea_orm(nullable)]
    pub manufacturer_id: Option<Id>,

    /// Product Type ID - Foreign key (drug, medical device, milk, cosmetics, etc.)
    pub product_type_id: Id,

    /// Category ID - Foreign key
    pub category_id: Id,

    /// Product description - TEXT (nullable)
    #[sea_orm(column_type = "Text", nullable)]
    pub description: Option<String>,

    /// Base/standard selling price - DECIMAL(10,2)
    #[sea_orm(column_type = "Decimal(Some((10, 2)))")]
    pub base_price: Decimal,

    /// Unit of measure (e.g., "box", "bottle", "strip") - VARCHAR(50)
    #[sea_orm(column_type = "String(StringLen::N(50))")]
    pub unit_of_measure: String,

    /// Reorder level threshold - INT
    pub reorder_level: i32,

    /// Requires prescription - BOOLEAN
    pub requires_prescription: bool,

    /// Controlled substance - BOOLEAN
    pub controlled_substance: bool,

    /// Product is active/available - BOOLEAN
    pub is_active: bool,

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
    /// One-to-many: Product has many inventory items (physical stock)
    #[sea_orm(has_many = "crate::inventory::entities::e006_inventory_item::Entity")]
    InventoryItems,

    /// Many-to-one: Product belongs to product type
    #[sea_orm(
        belongs_to = "crate::inventory::entities::e001_product_type::Entity",
        from = "Column::ProductTypeId",
        to = "crate::inventory::entities::e001_product_type::Column::Id"
    )]
    ProductType,

    /// Many-to-one: Product belongs to manufacturer
    #[sea_orm(
        belongs_to = "crate::inventory::entities::e002_manufacturer::Entity",
        from = "Column::ManufacturerId",
        to = "crate::inventory::entities::e002_manufacturer::Column::Id"
    )]
    Manufacturer,

    /// Many-to-one: Product belongs to category
    #[sea_orm(
        belongs_to = "crate::inventory::entities::e003_category::Entity",
        from = "Column::CategoryId",
        to = "crate::inventory::entities::e003_category::Column::Id"
    )]
    Category,
}

impl Related<crate::inventory::entities::e006_inventory_item::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::InventoryItems.def()
    }
}

impl Related<crate::inventory::entities::e001_product_type::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::ProductType.def()
    }
}

impl Related<crate::inventory::entities::e002_manufacturer::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Manufacturer.def()
    }
}

impl Related<crate::inventory::entities::e003_category::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Category.def()
    }
}

#[async_trait::async_trait]
impl ActiveModelBehavior for ActiveModel {
    fn new() -> Self {
        Self {
            id: sea_orm::ActiveValue::Set(Id::new()),
            is_active: sea_orm::ActiveValue::Set(true),
            requires_prescription: sea_orm::ActiveValue::Set(false),
            controlled_substance: sea_orm::ActiveValue::Set(false),
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
