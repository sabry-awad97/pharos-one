use pharos_core::{DateTime, Id};
use serde::{Deserialize, Serialize};

/// Data Transfer Object for Product Type
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct ProductTypeDto {
    pub id: Id,
    pub name: String,
    pub code: String,
    pub description: Option<String>,
    pub requires_prescription: bool,
    pub requires_batch_tracking: bool,
    pub requires_expiry_date: bool,
    pub requires_temperature_control: bool,
    pub regulatory_category: Option<String>,
    pub display_order: i32,
    pub is_active: bool,
    pub created_at: DateTime,
    pub updated_at: DateTime,
    pub created_by: Option<Id>,
}

/// Create request for new product type
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct CreateProductTypeDto {
    pub name: String,
    pub code: String,
    pub description: Option<String>,
    pub requires_prescription: Option<bool>,
    pub requires_batch_tracking: Option<bool>,
    pub requires_expiry_date: Option<bool>,
    pub requires_temperature_control: Option<bool>,
    pub regulatory_category: Option<String>,
    pub display_order: Option<i32>,
    pub created_by: Option<Id>,
}

/// Update request for existing product type
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct UpdateProductTypeDto {
    pub name: Option<String>,
    pub code: Option<String>,
    pub description: Option<String>,
    pub requires_prescription: Option<bool>,
    pub requires_batch_tracking: Option<bool>,
    pub requires_expiry_date: Option<bool>,
    pub requires_temperature_control: Option<bool>,
    pub regulatory_category: Option<String>,
    pub display_order: Option<i32>,
    pub is_active: Option<bool>,
}

/// Query filters for product types
#[derive(Clone, Debug, Default, PartialEq, Eq, Serialize, Deserialize)]
pub struct ProductTypeFilters {
    pub search: Option<String>,              // Search in name, code
    pub is_active: Option<bool>,             // Filter by active status
    pub requires_prescription: Option<bool>, // Filter by prescription requirement
}

/// Seed data for common product types
pub fn get_default_product_types() -> Vec<CreateProductTypeDto> {
    vec![
        CreateProductTypeDto {
            name: "Drug".to_string(),
            code: "drug".to_string(),
            description: Some("Pharmaceutical drugs and medications".to_string()),
            requires_prescription: Some(true),
            requires_batch_tracking: Some(true),
            requires_expiry_date: Some(true),
            requires_temperature_control: Some(false),
            regulatory_category: Some("Prescription".to_string()),
            display_order: Some(1),
            created_by: None,
        },
        CreateProductTypeDto {
            name: "Medical Device".to_string(),
            code: "medical_device".to_string(),
            description: Some("Medical equipment and devices".to_string()),
            requires_prescription: Some(false),
            requires_batch_tracking: Some(true),
            requires_expiry_date: Some(false),
            requires_temperature_control: Some(false),
            regulatory_category: Some("Medical Device".to_string()),
            display_order: Some(2),
            created_by: None,
        },
        CreateProductTypeDto {
            name: "Milk & Dairy".to_string(),
            code: "milk_dairy".to_string(),
            description: Some("Milk and dairy products".to_string()),
            requires_prescription: Some(false),
            requires_batch_tracking: Some(true),
            requires_expiry_date: Some(true),
            requires_temperature_control: Some(true),
            regulatory_category: Some("Food".to_string()),
            display_order: Some(3),
            created_by: None,
        },
        CreateProductTypeDto {
            name: "Cosmetics".to_string(),
            code: "cosmetics".to_string(),
            description: Some("Cosmetic and personal care products".to_string()),
            requires_prescription: Some(false),
            requires_batch_tracking: Some(true),
            requires_expiry_date: Some(true),
            requires_temperature_control: Some(false),
            regulatory_category: Some("Cosmetic".to_string()),
            display_order: Some(4),
            created_by: None,
        },
        CreateProductTypeDto {
            name: "Supplement".to_string(),
            code: "supplement".to_string(),
            description: Some("Dietary supplements and vitamins".to_string()),
            requires_prescription: Some(false),
            requires_batch_tracking: Some(true),
            requires_expiry_date: Some(true),
            requires_temperature_control: Some(false),
            regulatory_category: Some("Supplement".to_string()),
            display_order: Some(5),
            created_by: None,
        },
    ]
}
