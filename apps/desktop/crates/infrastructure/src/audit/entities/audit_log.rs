use pharos_core::{DateTime, Id};
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Audit log entity for tracking all critical actions
/// Immutable - no UPDATE or DELETE operations allowed
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "audit_logs")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Id,

    #[sea_orm(nullable)]
    pub user_id: Option<Id>,

    #[sea_orm(nullable)]
    pub username: Option<String>,

    #[sea_orm(nullable)]
    pub branch_id: Option<Id>,

    pub action: String,
    pub resource: String,

    #[sea_orm(nullable)]
    pub resource_id: Option<String>,

    #[sea_orm(column_type = "Text", nullable)]
    pub details: Option<String>,

    #[sea_orm(nullable)]
    pub ip_address: Option<String>,

    #[sea_orm(column_type = "Text", nullable)]
    pub user_agent: Option<String>,

    pub success: bool,

    #[sea_orm(column_type = "Text", nullable)]
    pub error_message: Option<String>,

    pub timestamp: DateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "crate::user::entities::user::Entity",
        from = "Column::UserId",
        to = "crate::user::entities::user::Column::Id"
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
            success: sea_orm::ActiveValue::Set(true),
            timestamp: sea_orm::ActiveValue::Set(DateTime::now()),
            ..Default::default()
        }
    }
}
