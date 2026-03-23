use super::{dto::*, Model};
use pharos_core::DateTime;
use sea_orm::ActiveValue::Set;

/// Convert database model to DTO
impl From<Model> for InventoryItemDto {
    fn from(model: Model) -> Self {
        Self {
            id: model.id,
            product_id: model.product_id,
            batch_number: model.batch_number,
            expiry_date: model.expiry_date.to_string(),
            supplier_id: model.supplier_id,
            purchase_order_id: model.purchase_order_id,
            received_date: model.received_date.to_string(),
            cost_per_unit: model.cost_per_unit.to_string(),
            quantity_received: model.quantity_received,
            quantity_remaining: model.quantity_remaining,
            location_id: model.location_id,
            status: model.status,
            notes: model.notes,
            created_at: model.created_at,
            updated_at: model.updated_at,
            created_by: model.created_by,
        }
    }
}

/// Convert create DTO to active model
impl From<CreateInventoryItemDto> for super::ActiveModel {
    fn from(dto: CreateInventoryItemDto) -> Self {
        use chrono::NaiveDate;
        use pharos_core::Id;
        use sea_orm::prelude::Decimal;
        use std::str::FromStr;

        Self {
            id: Set(Id::new()),
            product_id: Set(dto.product_id),
            batch_number: Set(dto.batch_number),
            expiry_date: Set(NaiveDate::from_str(&dto.expiry_date).unwrap_or_default()),
            supplier_id: Set(dto.supplier_id),
            purchase_order_id: Set(dto.purchase_order_id),
            received_date: Set(NaiveDate::from_str(&dto.received_date).unwrap_or_default()),
            cost_per_unit: Set(Decimal::from_str(&dto.cost_per_unit).unwrap_or_default()),
            quantity_received: Set(dto.quantity_received),
            quantity_remaining: Set(dto.quantity_received), // Initially same as received
            location_id: Set(dto.location_id),
            status: Set("available".to_string()),
            notes: Set(dto.notes),
            created_at: Set(DateTime::now()),
            updated_at: Set(DateTime::now()),
            created_by: Set(dto.created_by),
        }
    }
}

/// Apply update DTO to active model
impl UpdateInventoryItemDto {
    pub fn apply_to(self, mut active_model: super::ActiveModel) -> super::ActiveModel {
        if let Some(quantity_remaining) = self.quantity_remaining {
            active_model.quantity_remaining = Set(quantity_remaining);
        }
        if let Some(location_id) = self.location_id {
            active_model.location_id = Set(Some(location_id));
        }
        if let Some(status) = self.status {
            active_model.status = Set(status);
        }
        if let Some(notes) = self.notes {
            active_model.notes = Set(Some(notes));
        }

        active_model.updated_at = Set(DateTime::now());
        active_model
    }
}
