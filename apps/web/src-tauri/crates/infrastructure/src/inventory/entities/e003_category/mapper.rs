use super::{dto::*, Model};
use pharos_core::{DateTime, Id};
use sea_orm::ActiveValue::Set;

/// Convert database model to DTO
impl From<Model> for CategoryDto {
    fn from(model: Model) -> Self {
        Self {
            id: model.id,
            name: model.name,
            description: model.description,
            parent_category_id: model.parent_category_id,
            created_at: model.created_at,
            updated_at: model.updated_at,
            created_by: model.created_by,
        }
    }
}

/// Convert create DTO to active model
impl From<CreateCategoryDto> for super::ActiveModel {
    fn from(dto: CreateCategoryDto) -> Self {
        Self {
            id: Set(Id::new()),
            name: Set(dto.name),
            description: Set(dto.description),
            parent_category_id: Set(dto.parent_category_id),
            created_at: Set(DateTime::now()),
            updated_at: Set(DateTime::now()),
            created_by: Set(dto.created_by),
        }
    }
}

/// Apply update DTO to active model
impl UpdateCategoryDto {
    pub fn apply_to(self, mut active_model: super::ActiveModel) -> super::ActiveModel {
        if let Some(name) = self.name {
            active_model.name = Set(name);
        }
        if let Some(description) = self.description {
            active_model.description = Set(Some(description));
        }
        if let Some(parent_category_id) = self.parent_category_id {
            active_model.parent_category_id = Set(Some(parent_category_id));
        }
        active_model.updated_at = Set(DateTime::now());
        active_model
    }
}
