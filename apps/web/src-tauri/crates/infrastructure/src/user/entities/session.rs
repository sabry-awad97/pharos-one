use pharos_core::{DateTime, Id};
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Session entity for tracking active user sessions
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "sessions")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Id,

    pub user_id: Id,
    pub branch_id: Id,

    #[sea_orm(unique)]
    pub token: String,

    #[sea_orm(nullable)]
    pub device_id: Option<String>,

    #[sea_orm(nullable)]
    pub device_name: Option<String>,

    #[sea_orm(nullable)]
    pub ip_address: Option<String>,

    #[sea_orm(column_type = "Text", nullable)]
    pub user_agent: Option<String>,

    pub expires_at: DateTime,
    pub last_activity_at: DateTime,
    pub is_active: bool,
    pub created_at: DateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::user::Entity",
        from = "Column::UserId",
        to = "super::user::Column::Id",
        on_delete = "Cascade"
    )]
    User,

    #[sea_orm(
        belongs_to = "crate::branch::entities::branch::Entity",
        from = "Column::BranchId",
        to = "crate::branch::entities::branch::Column::Id"
    )]
    Branch,
}

#[async_trait::async_trait]
impl ActiveModelBehavior for ActiveModel {
    fn new() -> Self {
        Self {
            id: sea_orm::ActiveValue::Set(Id::new()),
            last_activity_at: sea_orm::ActiveValue::Set(DateTime::now()),
            is_active: sea_orm::ActiveValue::Set(true),
            created_at: sea_orm::ActiveValue::Set(DateTime::now()),
            ..Default::default()
        }
    }
}
