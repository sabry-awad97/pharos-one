use super::{dto::*, Model};
use pharos_core::DateTime;
use sea_orm::ActiveValue::Set;

/// Convert database model to DTO
impl From<Model> for ProductDto {
    fn from(model: Model) -> Self {
        Self {
            id: model.id,
            name: model.name,
            sku: model.sku,
            generic_name: model.generic_name,
            manufacturer_id: model.manufacturer_id,
            product_type_id: model.product_type_id,
            category_id: model.category_id,
            description: model.description,
            base_price: model.base_price.to_string(),
            unit_of_measure: model.unit_of_measure,
            reorder_level: model.reorder_level,
            requires_prescription: model.requires_prescription,
            controlled_substance: model.controlled_substance,
            is_active: model.is_active,
            created_at: model.created_at,
            updated_at: model.updated_at,
            created_by: model.created_by,
        }
    }
}

/// Convert create DTO to active model
impl From<CreateProductDto> for super::ActiveModel {
    fn from(dto: CreateProductDto) -> Self {
        use pharos_core::Id;
        use sea_orm::prelude::Decimal;
        use std::str::FromStr;

        Self {
            id: Set(Id::new()),
            name: Set(dto.name),
            sku: Set(dto.sku),
            generic_name: Set(dto.generic_name),
            manufacturer_id: Set(dto.manufacturer_id),
            product_type_id: Set(dto.product_type_id),
            category_id: Set(dto.category_id),
            description: Set(dto.description),
            base_price: Set(Decimal::from_str(&dto.base_price).unwrap_or_default()),
            unit_of_measure: Set(dto.unit_of_measure),
            reorder_level: Set(dto.reorder_level.unwrap_or(0)),
            requires_prescription: Set(dto.requires_prescription.unwrap_or(false)),
            controlled_substance: Set(dto.controlled_substance.unwrap_or(false)),
            is_active: Set(true),
            created_at: Set(DateTime::now()),
            updated_at: Set(DateTime::now()),
            created_by: Set(dto.created_by),
        }
    }
}

/// Apply update DTO to active model
impl UpdateProductDto {
    pub fn apply_to(self, mut active_model: super::ActiveModel) -> super::ActiveModel {
        use sea_orm::prelude::Decimal;
        use std::str::FromStr;

        if let Some(name) = self.name {
            active_model.name = Set(name);
        }
        if let Some(sku) = self.sku {
            active_model.sku = Set(sku);
        }
        if let Some(generic_name) = self.generic_name {
            active_model.generic_name = Set(Some(generic_name));
        }
        if let Some(manufacturer_id) = self.manufacturer_id {
            active_model.manufacturer_id = Set(Some(manufacturer_id));
        }
        if let Some(product_type_id) = self.product_type_id {
            active_model.product_type_id = Set(product_type_id);
        }
        if let Some(category_id) = self.category_id {
            active_model.category_id = Set(category_id);
        }
        if let Some(description) = self.description {
            active_model.description = Set(Some(description));
        }
        if let Some(base_price) = self.base_price {
            if let Ok(price) = Decimal::from_str(&base_price) {
                active_model.base_price = Set(price);
            }
        }
        if let Some(unit_of_measure) = self.unit_of_measure {
            active_model.unit_of_measure = Set(unit_of_measure);
        }
        if let Some(reorder_level) = self.reorder_level {
            active_model.reorder_level = Set(reorder_level);
        }
        if let Some(requires_prescription) = self.requires_prescription {
            active_model.requires_prescription = Set(requires_prescription);
        }
        if let Some(controlled_substance) = self.controlled_substance {
            active_model.controlled_substance = Set(controlled_substance);
        }
        if let Some(is_active) = self.is_active {
            active_model.is_active = Set(is_active);
        }

        active_model.updated_at = Set(DateTime::now());
        active_model
    }
}
