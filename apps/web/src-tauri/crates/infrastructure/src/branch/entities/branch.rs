use pharos_core::{DateTime, Id};
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Branch/Store entity for multi-location support
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "branches")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Id,

    #[sea_orm(unique)]
    pub code: String,

    pub name: String,

    #[sea_orm(nullable)]
    pub address: Option<String>,

    #[sea_orm(nullable)]
    pub city: Option<String>,

    #[sea_orm(nullable)]
    pub state: Option<String>,

    #[sea_orm(nullable)]
    pub country: Option<String>,

    #[sea_orm(nullable)]
    pub postal_code: Option<String>,

    #[sea_orm(nullable)]
    pub phone: Option<String>,

    #[sea_orm(nullable)]
    pub email: Option<String>,

    pub tax_rate: f64,
    pub is_active: bool,
    pub is_headquarters: bool,
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
            tax_rate: sea_orm::ActiveValue::Set(0.0),
            is_active: sea_orm::ActiveValue::Set(true),
            is_headquarters: sea_orm::ActiveValue::Set(false),
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
