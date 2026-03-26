use pharos_core::{DateTime, Id};
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Customer information (shared across branches)
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "customers")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Id,

    pub name: String,

    #[sea_orm(unique)]
    pub email: String,

    #[sea_orm(nullable)]
    pub date_of_birth: Option<DateTime>,

    #[sea_orm(nullable)]
    pub address: Option<String>,

    #[sea_orm(nullable)]
    pub city: Option<String>,

    #[sea_orm(nullable)]
    pub state: Option<String>,

    #[sea_orm(nullable)]
    pub postal_code: Option<String>,

    #[sea_orm(column_type = "Text", nullable)]
    pub notes: Option<String>,

    #[sea_orm(nullable)]
    pub last_visit: Option<DateTime>,

    pub total_purchases: f64,
    pub loyalty_points: i32,
    pub is_active: bool,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

#[async_trait::async_trait]
impl ActiveModelBehavior for ActiveModel {
    fn new() -> Self {
        Self {
            id: sea_orm::ActiveValue::Set(Id::new()),
            total_purchases: sea_orm::ActiveValue::Set(0.0),
            loyalty_points: sea_orm::ActiveValue::Set(0),
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
