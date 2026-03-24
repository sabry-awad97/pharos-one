use pharos_core::{DateTime, Id};
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Pharmaceutical manufacturer/company
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "companies")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Id,

    #[sea_orm(unique)]
    pub name: String,

    #[sea_orm(unique, nullable)]
    pub code: Option<String>,

    #[sea_orm(nullable)]
    pub country: Option<String>,

    #[sea_orm(nullable)]
    pub website: Option<String>,

    #[sea_orm(nullable)]
    pub email: Option<String>,

    #[sea_orm(nullable)]
    pub phone: Option<String>,

    #[sea_orm(column_type = "Text", nullable)]
    pub description: Option<String>,

    pub is_active: bool,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::product::Entity")]
    Products,
}

impl Related<super::product::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Products.def()
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
