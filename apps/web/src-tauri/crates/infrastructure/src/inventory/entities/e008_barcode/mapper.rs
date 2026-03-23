use super::dto::{BarcodeDto, CreateBarcodeDto, UpdateBarcodeDto};
use super::Model;
use sea_orm::ActiveValue;

impl From<Model> for BarcodeDto {
    fn from(model: Model) -> Self {
        Self {
            id: model.id,
            inventory_item_id: model.inventory_item_id,
            barcode: model.barcode,
            barcode_type: model.barcode_type,
            is_primary: model.is_primary,
            description: model.description,
            created_at: model.created_at,
            created_by: model.created_by,
        }
    }
}

impl From<CreateBarcodeDto> for super::ActiveModel {
    fn from(dto: CreateBarcodeDto) -> Self {
        Self {
            inventory_item_id: ActiveValue::Set(dto.inventory_item_id),
            barcode: ActiveValue::Set(dto.barcode),
            barcode_type: ActiveValue::Set(dto.barcode_type),
            is_primary: ActiveValue::Set(dto.is_primary),
            description: ActiveValue::Set(dto.description),
            created_by: ActiveValue::Set(dto.created_by),
            ..Default::default()
        }
    }
}

impl UpdateBarcodeDto {
    pub fn apply_to_model(self, model: &mut super::ActiveModel) {
        if let Some(barcode) = self.barcode {
            model.barcode = ActiveValue::Set(barcode);
        }
        if let Some(barcode_type) = self.barcode_type {
            model.barcode_type = ActiveValue::Set(Some(barcode_type));
        }
        if let Some(is_primary) = self.is_primary {
            model.is_primary = ActiveValue::Set(is_primary);
        }
        if let Some(description) = self.description {
            model.description = ActiveValue::Set(Some(description));
        }
    }
}
