use super::{dto::*, Model};
use pharos_core::{DateTime, Id};
use sea_orm::ActiveValue::Set;

/// Convert database model to DTO
impl From<Model> for SupplierDto {
    fn from(model: Model) -> Self {
        Self {
            id: model.id,
            name: model.name,
            contact_person: model.contact_person,
            email: model.email,
            phone: model.phone,
            address: model.address,
            is_active: model.is_active,
            created_at: model.created_at,
            updated_at: model.updated_at,
            created_by: model.created_by,
        }
    }
}

/// Convert create DTO to active model
impl From<CreateSupplierDto> for super::ActiveModel {
    fn from(dto: CreateSupplierDto) -> Self {
        Self {
            id: Set(Id::new()),
            name: Set(dto.name),
            contact_person: Set(dto.contact_person),
            email: Set(dto.email),
            phone: Set(dto.phone),
            address: Set(dto.address),
            is_active: Set(true),
            created_at: Set(DateTime::now()),
            updated_at: Set(DateTime::now()),
            created_by: Set(dto.created_by),
        }
    }
}

/// Apply update DTO to active model
impl UpdateSupplierDto {
    pub fn apply_to(self, mut active_model: super::ActiveModel) -> super::ActiveModel {
        if let Some(name) = self.name {
            active_model.name = Set(name);
        }
        if let Some(contact_person) = self.contact_person {
            active_model.contact_person = Set(Some(contact_person));
        }
        if let Some(email) = self.email {
            active_model.email = Set(Some(email));
        }
        if let Some(phone) = self.phone {
            active_model.phone = Set(Some(phone));
        }
        if let Some(address) = self.address {
            active_model.address = Set(Some(address));
        }
        if let Some(is_active) = self.is_active {
            active_model.is_active = Set(is_active);
        }
        active_model.updated_at = Set(DateTime::now());
        active_model
    }
}
