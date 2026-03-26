use pharos_core::{DateTime, Id};
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Specific batch/lot of a product (can be branch-specific or shared)
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "product_batches")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Id,

    pub product_id: Id,
    pub batch_number: String,
    pub expiry_date: DateTime,
    pub purchase_price: f64,

    #[sea_orm(nullable)]
    pub supplier: Option<String>,

    #[sea_orm(nullable)]
    pub branch_id: Option<Id>,

    pub quantity: i32,
    pub received_date: DateTime,
    pub is_active: bool,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::product::Entity",
        from = "Column::ProductId",
        to = "super::product::Column::Id",
        on_delete = "Cascade"
    )]
    Product,

    #[sea_orm(
        belongs_to = "crate::branch::entities::branch::Entity",
        from = "Column::BranchId",
        to = "crate::branch::entities::branch::Column::Id",
        on_delete = "SetNull"
    )]
    Branch,
}

impl Related<super::product::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Product.def()
    }
}

#[async_trait::async_trait]
impl ActiveModelBehavior for ActiveModel {
    fn new() -> Self {
        Self {
            id: sea_orm::ActiveValue::Set(Id::new()),
            quantity: sea_orm::ActiveValue::Set(0),
            received_date: sea_orm::ActiveValue::Set(DateTime::now()),
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
