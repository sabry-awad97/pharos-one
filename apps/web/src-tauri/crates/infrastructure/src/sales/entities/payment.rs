use pharos_core::{DateTime, Id};
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Payment method enum
#[derive(Debug, Clone, PartialEq, Eq, EnumIter, DeriveActiveEnum, Serialize, Deserialize)]
#[sea_orm(rs_type = "String", db_type = "String(StringLen::None)")]
pub enum PaymentMethod {
    #[sea_orm(string_value = "CASH")]
    Cash,
    #[sea_orm(string_value = "CARD")]
    Card,
    #[sea_orm(string_value = "INSURANCE")]
    Insurance,
    #[sea_orm(string_value = "DIGITAL")]
    Digital,
}

/// Payment method and amount
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "payments")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Id,

    #[sea_orm(nullable)]
    pub held_transaction_id: Option<Id>,

    #[sea_orm(nullable)]
    pub sale_transaction_id: Option<Id>,

    pub method: PaymentMethod,
    pub amount: f64,

    #[sea_orm(nullable)]
    pub reference: Option<String>,

    pub created_at: DateTime,
    pub updated_at: DateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "crate::transactions::entities::held_transaction::Entity",
        from = "Column::HeldTransactionId",
        to = "crate::transactions::entities::held_transaction::Column::Id",
        on_delete = "Cascade"
    )]
    HeldTransaction,

    #[sea_orm(
        belongs_to = "super::sale_transaction::Entity",
        from = "Column::SaleTransactionId",
        to = "super::sale_transaction::Column::Id",
        on_delete = "Cascade"
    )]
    SaleTransaction,
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
