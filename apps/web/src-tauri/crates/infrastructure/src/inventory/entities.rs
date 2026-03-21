use pharos_core::{DateTime, Id};
use sea_orm::entity::prelude::*;

/// SeaORM entity - database representation
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "medicines")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: Id,
    pub name: String,
    pub generic_name: String,
    pub unit_price: f64,
    pub quantity: i32,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
