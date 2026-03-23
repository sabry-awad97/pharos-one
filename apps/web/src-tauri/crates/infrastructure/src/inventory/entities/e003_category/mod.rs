pub mod dto;
pub mod mapper;

use pharos_core::{DateTime, Id};
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Category entity - Product categorization
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "categories")]
pub struct Model {
    /// Primary key
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Id,

    /// Category name - VARCHAR(200) (unique)
    #[sea_orm(column_type = "String(StringLen::N(200))", unique)]
    pub name: String,

    /// Category description - TEXT (nullable)
    #[sea_orm(column_type = "Text", nullable)]
    pub description: Option<String>,

    /// Parent category ID for hierarchical categories (nullable)
    #[sea_orm(nullable)]
    pub parent_category_id: Option<Id>,

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
    /// One-to-many: Category has many products
    #[sea_orm(has_many = "crate::inventory::entities::e005_product::Entity")]
    Products,

    /// Self-referential: Category can have parent category
    #[sea_orm(
        belongs_to = "Entity",
        from = "Column::ParentCategoryId",
        to = "Column::Id"
    )]
    ParentCategory,
}

impl Related<crate::inventory::entities::e005_product::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Products.def()
    }
}

#[async_trait::async_trait]
impl ActiveModelBehavior for ActiveModel {
    fn new() -> Self {
        Self {
            id: sea_orm::ActiveValue::Set(Id::new()),
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
