use pharos_core::{DateTime, Id};
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Discount type enum
#[derive(Debug, Clone, PartialEq, Eq, EnumIter, DeriveActiveEnum, Serialize, Deserialize)]
#[sea_orm(rs_type = "String", db_type = "String(StringLen::None)")]
pub enum DiscountType {
    #[sea_orm(string_value = "PERCENT")]
    Percent,
    #[sea_orm(string_value = "FIXED")]
    Fixed,
}

/// Completed sale transaction
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "sale_transactions")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Id,

    pub branch_id: Id,

    #[sea_orm(unique)]
    pub receipt_number: String,

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
    pub total_discount: f64,
    pub tax_amount: f64,
    pub total: f64,
    pub item_count: i32,
    pub change_amount: f64,

    #[sea_orm(column_type = "Text", nullable)]
    pub notes: Option<String>,

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
        belongs_to = "super::register::Entity",
        from = "Column::RegisterId",
        to = "super::register::Column::Id"
    )]
    Register,
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
