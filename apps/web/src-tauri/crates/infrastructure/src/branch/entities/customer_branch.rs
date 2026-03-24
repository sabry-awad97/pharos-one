use pharos_core::{DateTime, Id};
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Customer-Branch relationship (tracks preferred branch and branch-specific data)
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "customer_branches")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Id,

    pub customer_id: Id,
    pub branch_id: Id,
    pub is_primary: bool,

    #[sea_orm(nullable)]
    pub last_visit: Option<DateTime>,

    pub visit_count: i32,
    pub total_purchases: f64,
    pub loyalty_points: i32,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "crate::customer::entities::customer::Entity",
        from = "Column::CustomerId",
        to = "crate::customer::entities::customer::Column::Id",
        on_delete = "Cascade"
    )]
    Customer,

    #[sea_orm(
        belongs_to = "super::branch::Entity",
        from = "Column::BranchId",
        to = "super::branch::Column::Id",
        on_delete = "Cascade"
    )]
    Branch,
}

#[async_trait::async_trait]
impl ActiveModelBehavior for ActiveModel {
    fn new() -> Self {
        Self {
            id: sea_orm::ActiveValue::Set(Id::new()),
            is_primary: sea_orm::ActiveValue::Set(false),
            visit_count: sea_orm::ActiveValue::Set(0),
            total_purchases: sea_orm::ActiveValue::Set(0.0),
            loyalty_points: sea_orm::ActiveValue::Set(0),
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
