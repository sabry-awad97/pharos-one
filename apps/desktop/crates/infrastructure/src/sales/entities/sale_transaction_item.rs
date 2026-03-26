use pharos_core::{DateTime, Id};
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

use super::sale_transaction::DiscountType;

/// Priority enum
#[derive(Debug, Clone, PartialEq, Eq, EnumIter, DeriveActiveEnum, Serialize, Deserialize)]
#[sea_orm(rs_type = "String", db_type = "String(StringLen::None)")]
pub enum Priority {
    #[sea_orm(string_value = "HIGH")]
    High,
    #[sea_orm(string_value = "MEDIUM")]
    Medium,
    #[sea_orm(string_value = "LOW")]
    Low,
}

/// Sale transaction line item
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "sale_transaction_items")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Id,

    pub sale_transaction_id: Id,
    pub product_id: Id,

    #[sea_orm(nullable)]
    pub batch_id: Option<Id>,

    pub quantity: i32,
    pub unit_price: f64,

    #[sea_orm(nullable)]
    pub discount_type: Option<DiscountType>,

    #[sea_orm(nullable)]
    pub discount_value: Option<f64>,

    pub line_total: f64,

    #[sea_orm(nullable)]
    pub priority: Option<Priority>,

    pub created_at: DateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::sale_transaction::Entity",
        from = "Column::SaleTransactionId",
        to = "super::sale_transaction::Column::Id",
        on_delete = "Cascade"
    )]
    SaleTransaction,

    #[sea_orm(
        belongs_to = "crate::inventory::entities::product::Entity",
        from = "Column::ProductId",
        to = "crate::inventory::entities::product::Column::Id"
    )]
    Product,

    #[sea_orm(
        belongs_to = "crate::inventory::entities::product_batch::Entity",
        from = "Column::BatchId",
        to = "crate::inventory::entities::product_batch::Column::Id"
    )]
    Batch,
}

#[async_trait::async_trait]
impl ActiveModelBehavior for ActiveModel {
    fn new() -> Self {
        Self {
            id: sea_orm::ActiveValue::Set(Id::new()),
            created_at: sea_orm::ActiveValue::Set(DateTime::now()),
            ..Default::default()
        }
    }
}
