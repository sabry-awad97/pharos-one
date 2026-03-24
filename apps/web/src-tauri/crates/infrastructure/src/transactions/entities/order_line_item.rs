use pharos_core::{DateTime, Id};
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

use crate::sales::entities::{DiscountType, Priority};

/// Order line item (line item in held transaction)
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "order_line_items")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Id,

    pub held_transaction_id: Id,
    pub product_id: Id,
    pub unit_id: Id,

    #[sea_orm(nullable)]
    pub batch_id: Option<Id>,

    pub quantity: i32,
    pub unit_quantity: i32,
    pub unit_price: f64,

    #[sea_orm(nullable)]
    pub purchase_price: Option<f64>,

    #[sea_orm(nullable)]
    pub base_purchase_price: Option<f64>,

    #[sea_orm(nullable)]
    pub discount_type: Option<DiscountType>,

    #[sea_orm(nullable)]
    pub discount_value: Option<f64>,

    #[sea_orm(nullable)]
    pub priority: Option<Priority>,

    #[sea_orm(column_type = "Text", nullable)]
    pub notes: Option<String>,

    // Denormalized fields
    pub name: String,
    pub sku: String,
    pub price: f64,
    pub unit_name: String,
    pub base_stock: i32,

    #[sea_orm(nullable)]
    pub location_code: Option<String>,

    #[sea_orm(nullable)]
    pub company_name: Option<String>,

    #[sea_orm(nullable)]
    pub batch_number: Option<String>,

    #[sea_orm(nullable)]
    pub expiry_date: Option<String>,

    pub created_at: DateTime,
    pub updated_at: DateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::held_transaction::Entity",
        from = "Column::HeldTransactionId",
        to = "super::held_transaction::Column::Id",
        on_delete = "Cascade"
    )]
    HeldTransaction,

    #[sea_orm(
        belongs_to = "crate::inventory::entities::product::Entity",
        from = "Column::ProductId",
        to = "crate::inventory::entities::product::Column::Id"
    )]
    Product,

    #[sea_orm(
        belongs_to = "crate::inventory::entities::unit::Entity",
        from = "Column::UnitId",
        to = "crate::inventory::entities::unit::Column::Id"
    )]
    Unit,

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
