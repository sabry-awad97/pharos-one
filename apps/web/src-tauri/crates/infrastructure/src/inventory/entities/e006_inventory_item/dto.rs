use pharos_core::{DateTime, Id};
use serde::{Deserialize, Serialize};

/// Data Transfer Object for Inventory Item
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct InventoryItemDto {
    pub id: Id,
    pub product_id: Id,
    pub batch_number: String,
    pub expiry_date: String, // Date as ISO string
    pub supplier_id: Id,
    pub purchase_order_id: Option<Id>,
    pub received_date: String, // Date as ISO string
    pub cost_per_unit: String, // Decimal as string
    pub quantity_received: i32,
    pub quantity_remaining: i32,
    pub location_id: Option<Id>,
    pub status: String,
    pub notes: Option<String>,
    pub created_at: DateTime,
    pub updated_at: DateTime,
    pub created_by: Option<Id>,
}

/// Create request for new inventory item
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct CreateInventoryItemDto {
    pub product_id: Id,
    pub batch_number: String,
    pub expiry_date: String,
    pub supplier_id: Id,
    pub purchase_order_id: Option<Id>,
    pub received_date: String,
    pub cost_per_unit: String,
    pub quantity_received: i32,
    pub location_id: Option<Id>,
    pub notes: Option<String>,
    pub created_by: Option<Id>,
}

/// Update request for existing inventory item
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct UpdateInventoryItemDto {
    pub quantity_remaining: Option<i32>,
    pub location_id: Option<Id>,
    pub status: Option<String>,
    pub notes: Option<String>,
}

/// Query filters for inventory items
#[derive(Clone, Debug, Default, PartialEq, Serialize, Deserialize)]
pub struct InventoryItemFilters {
    pub product_id: Option<Id>,
    pub supplier_id: Option<Id>,
    pub batch_number: Option<String>,
    pub status: Option<String>,
    pub expiry_before: Option<String>, // Date as ISO string
    pub expiry_after: Option<String>,  // Date as ISO string
}
