use pharos_core::{DateTime, Id};
use serde::{Deserialize, Serialize};

/// Data Transfer Object for Product
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct ProductDto {
    pub id: Id,
    pub name: String,
    pub sku: String,
    pub generic_name: Option<String>,
    pub manufacturer_id: Option<Id>,
    pub product_type_id: Id,
    pub category_id: Id,
    pub description: Option<String>,
    pub base_price: String, // Decimal as string for JSON
    pub unit_of_measure: String,
    pub reorder_level: i32,
    pub requires_prescription: bool,
    pub controlled_substance: bool,
    pub is_active: bool,
    pub created_at: DateTime,
    pub updated_at: DateTime,
    pub created_by: Option<Id>,
}

/// Create request for new product
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct CreateProductDto {
    pub name: String,
    pub sku: String,
    pub generic_name: Option<String>,
    pub manufacturer_id: Option<Id>,
    pub product_type_id: Id,
    pub category_id: Id,
    pub description: Option<String>,
    pub base_price: String, // Decimal as string
    pub unit_of_measure: String,
    pub reorder_level: Option<i32>,
    pub requires_prescription: Option<bool>,
    pub controlled_substance: Option<bool>,
    pub created_by: Option<Id>,
}

/// Update request for existing product
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct UpdateProductDto {
    pub name: Option<String>,
    pub sku: Option<String>,
    pub generic_name: Option<String>,
    pub manufacturer_id: Option<Id>,
    pub product_type_id: Option<Id>,
    pub category_id: Option<Id>,
    pub description: Option<String>,
    pub base_price: Option<String>,
    pub unit_of_measure: Option<String>,
    pub reorder_level: Option<i32>,
    pub requires_prescription: Option<bool>,
    pub controlled_substance: Option<bool>,
    pub is_active: Option<bool>,
}

/// Query filters for products
#[derive(Clone, Debug, Default, PartialEq, Serialize, Deserialize)]
pub struct ProductFilters {
    pub search: Option<String>,      // Search in name, SKU, generic_name
    pub manufacturer_id: Option<Id>, // Filter by manufacturer
    pub product_type_id: Option<Id>, // Filter by product type
    pub category_id: Option<Id>,     // Filter by category
    pub is_active: Option<bool>,     // Filter by active status
    pub requires_prescription: Option<bool>, // Filter by prescription requirement
    pub controlled_substance: Option<bool>, // Filter by controlled substance
}
