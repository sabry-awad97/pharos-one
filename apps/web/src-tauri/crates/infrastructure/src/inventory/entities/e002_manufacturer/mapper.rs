use super::{dto::*, Model};
use pharos_core::DateTime;

/// Convert database model to DTO
impl From<Model> for ManufacturerDto {
    fn from(model: Model) -> Self {
        Self {
            id: model.id,
            name: model.name,
            short_name: model.short_name,
            country: model.country,
            phone: model.phone,
            email: model.email,
            website: model.website,
            notes: model.notes,
            is_active: model.is_active,
            created_at: model.created_at,
            updated_at: model.updated_at,
            created_by: model.created_by,
        }
    }
}

/// Convert create DTO to active model
impl From<CreateManufacturerDto> for super::ActiveModel {
    fn from(dto: CreateManufacturerDto) -> Self {
        use pharos_core::Id;
        use sea_orm::ActiveValue::Set;

        Self {
            id: Set(Id::new()),
            name: Set(dto.name),
            short_name: Set(dto.short_name),
            country: Set(dto.country),
            phone: Set(dto.phone),
            email: Set(dto.email),
            website: Set(dto.website),
            notes: Set(dto.notes),
            is_active: Set(true),
            created_at: Set(DateTime::now()),
            updated_at: Set(DateTime::now()),
            created_by: Set(dto.created_by),
        }
    }
}

/// Apply update DTO to active model
impl UpdateManufacturerDto {
    pub fn apply_to(self, mut active_model: super::ActiveModel) -> super::ActiveModel {
        use sea_orm::ActiveValue::Set;

        if let Some(name) = self.name {
            active_model.name = Set(name);
        }
        if let Some(short_name) = self.short_name {
            active_model.short_name = Set(Some(short_name));
        }
        if let Some(country) = self.country {
            active_model.country = Set(Some(country));
        }
        if let Some(phone) = self.phone {
            active_model.phone = Set(Some(phone));
        }
        if let Some(email) = self.email {
            active_model.email = Set(Some(email));
        }
        if let Some(website) = self.website {
            active_model.website = Set(Some(website));
        }
        if let Some(notes) = self.notes {
            active_model.notes = Set(Some(notes));
        }
        if let Some(is_active) = self.is_active {
            active_model.is_active = Set(is_active);
        }

        active_model.updated_at = Set(DateTime::now());
        active_model
    }
}
