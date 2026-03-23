use pharos_core::{DateTime, Id};
use serde::{Deserialize, Serialize};

/// Barcode DTO for API responses
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct BarcodeDto {
    pub id: Id,
    pub inventory_item_id: Id,
    pub barcode: String,
    pub barcode_type: Option<String>,
    pub is_primary: bool,
    pub description: Option<String>,
    pub created_at: DateTime,
    pub created_by: Option<Id>,
}

/// Create barcode DTO for API requests
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateBarcodeDto {
    pub inventory_item_id: Id,
    pub barcode: String,
    pub barcode_type: Option<String>,
    pub is_primary: bool,
    pub description: Option<String>,
    pub created_by: Option<Id>,
}

/// Update barcode DTO for API requests
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateBarcodeDto {
    pub barcode: Option<String>,
    pub barcode_type: Option<String>,
    pub is_primary: Option<bool>,
    pub description: Option<String>,
}
