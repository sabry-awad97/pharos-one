use pharos_core::{DateTime, Id};
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// User role enum (deprecated, use Role entity instead)
#[derive(Debug, Clone, PartialEq, Eq, EnumIter, DeriveActiveEnum, Serialize, Deserialize)]
#[sea_orm(rs_type = "String", db_type = "String(StringLen::None)")]
pub enum UserRole {
    #[sea_orm(string_value = "ADMIN")]
    Admin,
    #[sea_orm(string_value = "MANAGER")]
    Manager,
    #[sea_orm(string_value = "PHARMACIST")]
    Pharmacist,
    #[sea_orm(string_value = "CASHIER")]
    Cashier,
}

/// User account for desktop app authentication
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "users")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Id,

    #[sea_orm(unique)]
    pub username: String,

    pub password_hash: String,

    #[sea_orm(nullable)]
    pub pin: Option<String>,

    pub staff_id: Id,
    pub role_id: Id,
    pub role: UserRole,
    pub failed_login_attempts: i32,

    #[sea_orm(nullable)]
    pub locked_until: Option<DateTime>,

    pub must_change_password: bool,

    #[sea_orm(nullable)]
    pub last_login_ip: Option<String>,

    pub is_active: bool,

    #[sea_orm(nullable)]
    pub last_login: Option<DateTime>,

    pub created_at: DateTime,
    pub updated_at: DateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::staff_member::Entity",
        from = "Column::StaffId",
        to = "super::staff_member::Column::Id",
        on_delete = "Cascade"
    )]
    Staff,

    #[sea_orm(
        belongs_to = "super::role::Entity",
        from = "Column::RoleId",
        to = "super::role::Column::Id"
    )]
    UserRole,
}

#[async_trait::async_trait]
impl ActiveModelBehavior for ActiveModel {
    fn new() -> Self {
        Self {
            id: sea_orm::ActiveValue::Set(Id::new()),
            role: sea_orm::ActiveValue::Set(UserRole::Cashier),
            failed_login_attempts: sea_orm::ActiveValue::Set(0),
            must_change_password: sea_orm::ActiveValue::Set(false),
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
