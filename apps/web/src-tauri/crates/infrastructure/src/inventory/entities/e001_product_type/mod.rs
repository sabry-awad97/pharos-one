pub mod dto;
pub mod mapper;

use pharos_core::{DateTime, Id};
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

/// Product Type entity - User-defined product classifications
///
/// Allows users to define their own product types instead of hardcoding them.
/// Examples: Drug, Medical Device, Milk, Cosmetics, Supplements, Equipment, etc.
///
/// Each type can have specific attributes and validation rules.
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "product_types")]
pub struct Model {
    /// Primary key
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Id,

    /// Type name - VARCHAR(100) (unique)
    /// Examples: "Drug", "Medical Device", "Milk", "Cosmetics"
    #[sea_orm(column_type = "String(StringLen::N(100))", unique)]
    pub name: String,

    /// Type code/slug for programmatic use - VARCHAR(50) (unique)
    /// Examples: "drug", "medical_device", "milk", "cosmetics"
    #[sea_orm(column_type = "String(StringLen::N(50))", unique)]
    pub code: String,

    /// Type description - TEXT (nullable)
    #[sea_orm(column_type = "Text", nullable)]
    pub description: Option<String>,

    /// Requires prescription - BOOLEAN
    /// Default requirement for products of this type
    pub requires_prescription: bool,

    /// Requires batch tracking - BOOLEAN
    /// Whether products of this type need batch/lot tracking
    pub requires_batch_tracking: bool,

    /// Requires expiry date - BOOLEAN
    /// Whether products of this type must have expiry dates
    pub requires_expiry_date: bool,

    /// Requires temperature control - BOOLEAN
    /// Whether products of this type need temperature monitoring
    pub requires_temperature_control: bool,

    /// Regulatory category - VARCHAR(100) (nullable)
    /// Examples: "OTC", "Prescription", "Controlled Substance", "Medical Device Class I/II/III"
    #[sea_orm(column_type = "String(StringLen::N(100))", nullable)]
    pub regulatory_category: Option<String>,

    /// Display order for UI sorting - INT
    pub display_order: i32,

    /// Type is active - BOOLEAN
    pub is_active: bool,

    /// Record creation timestamp
    pub created_at: DateTime,

    /// Last update timestamp
    pub updated_at: DateTime,

    /// User who created this record (nullable)
    #[sea_orm(nullable)]
    pub created_by: Option<Id>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    /// One-to-many: Product type has many products
    #[sea_orm(has_many = "crate::inventory::entities::e005_product::Entity")]
    Products,
}

impl Related<crate::inventory::entities::e005_product::Entity> for Entity {
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
            requires_prescription: sea_orm::ActiveValue::Set(false),
            requires_batch_tracking: sea_orm::ActiveValue::Set(true),
            requires_expiry_date: sea_orm::ActiveValue::Set(true),
            requires_temperature_control: sea_orm::ActiveValue::Set(false),
            display_order: sea_orm::ActiveValue::Set(0),
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
