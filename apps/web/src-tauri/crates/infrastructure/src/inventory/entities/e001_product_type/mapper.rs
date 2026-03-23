use super::{dto::*, Model};
use pharos_core::DateTime;

/// Convert database model to DTO
impl From<Model> for ProductTypeDto {
    fn from(model: Model) -> Self {
        Self {
            id: model.id,
            name: model.name,
            code: model.code,
            description: model.description,
            requires_prescription: model.requires_prescription,
            requires_batch_tracking: model.requires_batch_tracking,
            requires_expiry_date: model.requires_expiry_date,
            requires_temperature_control: model.requires_temperature_control,
            regulatory_category: model.regulatory_category,
            display_order: model.display_order,
            is_active: model.is_active,
            created_at: model.created_at,
            updated_at: model.updated_at,
            created_by: model.created_by,
        }
    }
}

/// Convert create DTO to active model
impl From<CreateProductTypeDto> for super::ActiveModel {
    fn from(dto: CreateProductTypeDto) -> Self {
        use pharos_core::Id;
        use sea_orm::ActiveValue::Set;

        Self {
            id: Set(Id::new()),
            name: Set(dto.name),
            code: Set(dto.code),
            description: Set(dto.description),
            requires_prescription: Set(dto.requires_prescription.unwrap_or(false)),
            requires_batch_tracking: Set(dto.requires_batch_tracking.unwrap_or(true)),
            requires_expiry_date: Set(dto.requires_expiry_date.unwrap_or(true)),
            requires_temperature_control: Set(dto.requires_temperature_control.unwrap_or(false)),
            regulatory_category: Set(dto.regulatory_category),
            display_order: Set(dto.display_order.unwrap_or(0)),
            is_active: Set(true),
            created_at: Set(DateTime::now()),
            updated_at: Set(DateTime::now()),
            created_by: Set(dto.created_by),
        }
    }
}

/// Apply update DTO to active model
impl UpdateProductTypeDto {
    pub fn apply_to(self, mut active_model: super::ActiveModel) -> super::ActiveModel {
        use sea_orm::ActiveValue::Set;

        if let Some(name) = self.name {
            active_model.name = Set(name);
        }
        if let Some(code) = self.code {
            active_model.code = Set(code);
        }
        if let Some(description) = self.description {
            active_model.description = Set(Some(description));
        }
        if let Some(requires_prescription) = self.requires_prescription {
            active_model.requires_prescription = Set(requires_prescription);
        }
        if let Some(requires_batch_tracking) = self.requires_batch_tracking {
            active_model.requires_batch_tracking = Set(requires_batch_tracking);
        }
        if let Some(requires_expiry_date) = self.requires_expiry_date {
            active_model.requires_expiry_date = Set(requires_expiry_date);
        }
        if let Some(requires_temperature_control) = self.requires_temperature_control {
            active_model.requires_temperature_control = Set(requires_temperature_control);
        }
        if let Some(regulatory_category) = self.regulatory_category {
            active_model.regulatory_category = Set(Some(regulatory_category));
        }
        if let Some(display_order) = self.display_order {
            active_model.display_order = Set(display_order);
        }
        if let Some(is_active) = self.is_active {
            active_model.is_active = Set(is_active);
        }

        active_model.updated_at = Set(DateTime::now());
        active_model
    }
}
