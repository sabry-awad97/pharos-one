use pharos_core::{DateTime, Id};
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Conversion between units (e.g., 1 strip = 10 tablets)
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "unit_conversions")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Id,

    pub from_unit_id: Id,
    pub to_unit_id: Id,
    pub factor: f64,
    pub is_default: bool,
    pub is_enabled: bool,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::unit::Entity",
        from = "Column::FromUnitId",
        to = "super::unit::Column::Id",
        on_delete = "Cascade"
    )]
    FromUnit,

    #[sea_orm(
        belongs_to = "super::unit::Entity",
        from = "Column::ToUnitId",
        to = "super::unit::Column::Id",
        on_delete = "Cascade"
    )]
    ToUnit,
}

#[async_trait::async_trait]
impl ActiveModelBehavior for ActiveModel {
    fn new() -> Self {
        Self {
            id: sea_orm::ActiveValue::Set(Id::new()),
            factor: sea_orm::ActiveValue::Set(1.0),
            is_default: sea_orm::ActiveValue::Set(false),
            is_enabled: sea_orm::ActiveValue::Set(true),
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
