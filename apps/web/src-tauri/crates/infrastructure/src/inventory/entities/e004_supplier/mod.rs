pub mod dto;
pub mod mapper;

use pharos_core::{DateTime, Id};
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Supplier entity - Vendors who supply inventory items
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "suppliers")]
pub struct Model {
    /// Primary key
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Id,

    /// Supplier name - VARCHAR(200) (unique)
    #[sea_orm(column_type = "String(StringLen::N(200))", unique)]
    pub name: String,

    /// Contact person name - VARCHAR(100) (nullable)
    #[sea_orm(column_type = "String(StringLen::N(100))", nullable)]
    pub contact_person: Option<String>,

    /// Contact email - VARCHAR(100) (nullable)
    #[sea_orm(column_type = "String(StringLen::N(100))", nullable)]
    pub email: Option<String>,

    /// Contact phone - VARCHAR(50) (nullable)
    #[sea_orm(column_type = "String(StringLen::N(50))", nullable)]
    pub phone: Option<String>,

    /// Address - TEXT (nullable)
    #[sea_orm(column_type = "Text", nullable)]
    pub address: Option<String>,

    /// Supplier is active - BOOLEAN
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
    /// One-to-many: Supplier has many inventory items
    #[sea_orm(has_many = "crate::inventory::entities::e006_inventory_item::Entity")]
    InventoryItems,
}

impl Related<crate::inventory::entities::e006_inventory_item::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::InventoryItems.def()
    }
}

#[async_trait::async_trait]
impl ActiveModelBehavior for ActiveModel {
    fn new() -> Self {
        Self {
            id: sea_orm::ActiveValue::Set(Id::new()),
            is_active: sea_orm::ActiveValue::Set(true),
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
