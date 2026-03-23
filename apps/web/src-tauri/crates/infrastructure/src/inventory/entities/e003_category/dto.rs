use pharos_core::{DateTime, Id};
use serde::{Deserialize, Serialize};

/// Data Transfer Object for Category
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct CategoryDto {
    pub id: Id,
    pub name: String,
    pub description: Option<String>,
    pub parent_category_id: Option<Id>,
    pub created_at: DateTime,
    pub updated_at: DateTime,
    pub created_by: Option<Id>,
}

/// Create request for new category
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct CreateCategoryDto {
    pub name: String,
    pub description: Option<String>,
    pub parent_category_id: Option<Id>,
    pub created_by: Option<Id>,
}

/// Update request for existing category
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct UpdateCategoryDto {
    pub name: Option<String>,
    pub description: Option<String>,
    pub parent_category_id: Option<Id>,
}
