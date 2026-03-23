use pharos_core::{DateTime, Id};
use serde::{Deserialize, Serialize};

/// Data Transfer Object for Manufacturer
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct ManufacturerDto {
    pub id: Id,
    pub name: String,
    pub short_name: Option<String>,
    pub country: Option<String>,
    pub phone: Option<String>,
    pub email: Option<String>,
    pub website: Option<String>,
    pub notes: Option<String>,
    pub is_active: bool,
    pub created_at: DateTime,
    pub updated_at: DateTime,
    pub created_by: Option<Id>,
}

/// Create request for new manufacturer
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct CreateManufacturerDto {
    pub name: String,
    pub short_name: Option<String>,
    pub country: Option<String>,
    pub phone: Option<String>,
    pub email: Option<String>,
    pub website: Option<String>,
    pub notes: Option<String>,
    pub created_by: Option<Id>,
}

/// Update request for existing manufacturer
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct UpdateManufacturerDto {
    pub name: Option<String>,
    pub short_name: Option<String>,
    pub country: Option<String>,
    pub phone: Option<String>,
    pub email: Option<String>,
    pub website: Option<String>,
    pub notes: Option<String>,
    pub is_active: Option<bool>,
}

/// Query filters for manufacturers
#[derive(Clone, Debug, Default, PartialEq, Eq, Serialize, Deserialize)]
pub struct ManufacturerFilters {
    pub search: Option<String>,  // Search in name, short_name
    pub country: Option<String>, // Filter by country
    pub is_active: Option<bool>, // Filter by active status
}
