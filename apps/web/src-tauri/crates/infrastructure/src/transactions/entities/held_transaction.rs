use pharos_core::{DateTime, Id};
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

use crate::sales::entities::DiscountType;

/// Transaction status enum
#[derive(Debug, Clone, PartialEq, Eq, EnumIter, DeriveActiveEnum, Serialize, Deserialize)]
#[sea_orm(rs_type = "String", db_type = "String(StringLen::None)")]
pub enum TransactionStatus {
    #[sea_orm(string_value = "HELD")]
    Held,
    #[sea_orm(string_value = "RESUMED")]
    Resumed,
    #[sea_orm(string_value = "EXPIRED")]
    Expired,
    #[sea_orm(string_value = "COMPLETED")]
    Completed,
    #[sea_orm(string_value = "CANCELLED")]
    Cancelled,
}

/// Held transaction (suspended for later completion)
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "held_transactions")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Id,

    pub branch_id: Id,

    #[sea_orm(unique)]
    pub hold_number: String,

    #[sea_orm(nullable)]
    pub customer_id: Option<Id>,

    pub cashier_id: Id,
    pub register_id: Id,
    pub tax_rate: f64,

    #[sea_orm(nullable)]
    pub additional_discount_type: Option<DiscountType>,

    #[sea_orm(nullable)]
    pub additional_discount_value: Option<f64>,

    pub subtotal: f64,
    pub total: f64,
    pub item_count: i32,
    pub status: TransactionStatus,

    #[sea_orm(nullable)]
    pub resumed_at: Option<DateTime>,

    #[sea_orm(nullable)]
    pub resumed_by: Option<Id>,

    pub expires_at: DateTime,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "crate::branch::entities::branch::Entity",
        from = "Column::BranchId",
        to = "crate::branch::entities::branch::Column::Id"
    )]
    Branch,

    #[sea_orm(
        belongs_to = "crate::customer::entities::customer::Entity",
        from = "Column::CustomerId",
        to = "crate::customer::entities::customer::Column::Id"
    )]
    Customer,

    #[sea_orm(
        belongs_to = "crate::user::entities::staff_member::Entity",
        from = "Column::CashierId",
        to = "crate::user::entities::staff_member::Column::Id"
    )]
    Cashier,

    #[sea_orm(
        belongs_to = "crate::sales::entities::register::Entity",
        from = "Column::RegisterId",
        to = "crate::sales::entities::register::Column::Id"
    )]
    Register,
}

#[async_trait::async_trait]
impl ActiveModelBehavior for ActiveModel {
    fn new() -> Self {
        Self {
            id: sea_orm::ActiveValue::Set(Id::new()),
            tax_rate: sea_orm::ActiveValue::Set(0.0),
            status: sea_orm::ActiveValue::Set(TransactionStatus::Held),
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
