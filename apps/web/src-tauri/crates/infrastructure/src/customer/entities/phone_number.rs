use pharos_core::{DateTime, Id};
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Phone type enum
#[derive(Debug, Clone, PartialEq, Eq, EnumIter, DeriveActiveEnum, Serialize, Deserialize)]
#[sea_orm(rs_type = "String", db_type = "String(StringLen::None)")]
pub enum PhoneType {
    #[sea_orm(string_value = "MOBILE")]
    Mobile,
    #[sea_orm(string_value = "HOME")]
    Home,
    #[sea_orm(string_value = "WORK")]
    Work,
    #[sea_orm(string_value = "FAX")]
    Fax,
    #[sea_orm(string_value = "OTHER")]
    Other,
}

/// Phone number model for storing contact information
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "phone_numbers")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Id,

    pub number: String,
    pub r#type: PhoneType,
    pub is_primary: bool,
    pub is_active: bool,

    #[sea_orm(column_type = "Text", nullable)]
    pub notes: Option<String>,

    #[sea_orm(nullable)]
    pub staff_member_id: Option<Id>,

    #[sea_orm(nullable)]
    pub customer_id: Option<Id>,

    pub created_at: DateTime,
    pub updated_at: DateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "crate::user::entities::staff_member::Entity",
        from = "Column::StaffMemberId",
        to = "crate::user::entities::staff_member::Column::Id",
        on_delete = "Cascade"
    )]
    StaffMember,

    #[sea_orm(
        belongs_to = "super::customer::Entity",
        from = "Column::CustomerId",
        to = "super::customer::Column::Id",
        on_delete = "Cascade"
    )]
    Customer,
}

#[async_trait::async_trait]
impl ActiveModelBehavior for ActiveModel {
    fn new() -> Self {
        Self {
            id: sea_orm::ActiveValue::Set(Id::new()),
            r#type: sea_orm::ActiveValue::Set(PhoneType::Mobile),
            is_primary: sea_orm::ActiveValue::Set(false),
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
