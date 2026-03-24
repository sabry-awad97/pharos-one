use pharos_core::{DateTime, Id};
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Product/medication master data (shared across branches)
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "products")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Id,

    pub name: String,

    #[sea_orm(unique)]
    pub sku: String,

    #[sea_orm(unique)]
    pub barcode: String,

    pub category_id: Id,

    #[sea_orm(nullable)]
    pub company_id: Option<Id>,

    #[sea_orm(nullable)]
    pub location_id: Option<Id>,

    pub price: f64,

    #[sea_orm(column_type = "Text", nullable)]
    pub notes: Option<String>,

    pub is_active: bool,

    pub created_at: DateTime,
    pub updated_at: DateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::category::Entity",
        from = "Column::CategoryId",
        to = "super::category::Column::Id"
    )]
    Category,

    #[sea_orm(
        belongs_to = "super::company::Entity",
        from = "Column::CompanyId",
        to = "super::company::Column::Id"
    )]
    Company,

    #[sea_orm(
        belongs_to = "super::location::Entity",
        from = "Column::LocationId",
        to = "super::location::Column::Id"
    )]
    Location,

    #[sea_orm(has_one = "super::product_unit_config::Entity")]
    UnitConfig,

    #[sea_orm(has_many = "super::branch_inventory::Entity")]
    BranchInventory,

    #[sea_orm(has_many = "super::product_batch::Entity")]
    Batches,
}

impl Related<super::category::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Category.def()
    }
}

impl Related<super::company::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Company.def()
    }
}

impl Related<super::location::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Location.def()
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
