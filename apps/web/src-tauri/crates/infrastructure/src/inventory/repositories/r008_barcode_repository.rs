use super::Repository;
use crate::inventory::entities::e008_barcode::{self as entity, dto::*};
use pharos_core::{AppError, Id, Result};
use sea_orm::{prelude::Expr, *};

pub struct BarcodeRepository {
    db: DatabaseConnection,
}

impl BarcodeRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    /// Find by barcode value
    pub async fn find_by_barcode(&self, barcode: &str) -> Result<Option<BarcodeDto>> {
        let model = entity::Entity::find()
            .filter(entity::Column::Barcode.eq(barcode))
            .one(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(model.map(|m| m.into()))
    }

    /// Find all barcodes for an inventory item
    pub async fn find_by_inventory_item(&self, inventory_item_id: &Id) -> Result<Vec<BarcodeDto>> {
        let models = entity::Entity::find()
            .filter(entity::Column::InventoryItemId.eq(*inventory_item_id))
            .order_by_desc(entity::Column::IsPrimary)
            .order_by_asc(entity::Column::CreatedAt)
            .all(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(models.into_iter().map(|m| m.into()).collect())
    }

    /// Find primary barcode for an inventory item
    pub async fn find_primary_by_inventory_item(
        &self,
        inventory_item_id: &Id,
    ) -> Result<Option<BarcodeDto>> {
        let model = entity::Entity::find()
            .filter(entity::Column::InventoryItemId.eq(*inventory_item_id))
            .filter(entity::Column::IsPrimary.eq(true))
            .one(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(model.map(|m| m.into()))
    }

    /// Find barcodes by type
    pub async fn find_by_type(&self, barcode_type: &str) -> Result<Vec<BarcodeDto>> {
        let models = entity::Entity::find()
            .filter(entity::Column::BarcodeType.eq(barcode_type))
            .all(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(models.into_iter().map(|m| m.into()).collect())
    }

    /// Set a barcode as primary (and unset others for the same inventory item)
    pub async fn set_primary(&self, id: &Id) -> Result<BarcodeDto> {
        // Get the barcode to set as primary
        let barcode = entity::Entity::find_by_id(*id)
            .one(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?
            .ok_or_else(|| AppError::NotFound(format!("Barcode {} not found", id)))?;

        // Unset all other primary barcodes for this inventory item
        entity::Entity::update_many()
            .col_expr(entity::Column::IsPrimary, Expr::value(false))
            .filter(entity::Column::InventoryItemId.eq(barcode.inventory_item_id))
            .exec(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        // Set this barcode as primary
        let mut active_model: entity::ActiveModel = barcode.into();
        active_model.is_primary = Set(true);

        let result = active_model
            .update(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(result.into())
    }
}

#[async_trait::async_trait]
impl Repository<BarcodeDto, CreateBarcodeDto, UpdateBarcodeDto> for BarcodeRepository {
    async fn find_all(&self) -> Result<Vec<BarcodeDto>> {
        let models = entity::Entity::find()
            .order_by_asc(entity::Column::CreatedAt)
            .all(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(models.into_iter().map(|m| m.into()).collect())
    }

    async fn find_by_id(&self, id: &Id) -> Result<Option<BarcodeDto>> {
        let model = entity::Entity::find_by_id(*id)
            .one(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(model.map(|m| m.into()))
    }

    async fn create(&self, dto: CreateBarcodeDto) -> Result<BarcodeDto> {
        let active_model: entity::ActiveModel = dto.into();

        let result = active_model
            .insert(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(result.into())
    }

    async fn update(&self, id: &Id, dto: UpdateBarcodeDto) -> Result<BarcodeDto> {
        let model = entity::Entity::find_by_id(*id)
            .one(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?
            .ok_or_else(|| AppError::NotFound(format!("Barcode {} not found", id)))?;

        let mut active_model: entity::ActiveModel = model.into();
        dto.apply_to_model(&mut active_model);

        let result = active_model
            .update(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(result.into())
    }

    async fn delete(&self, id: &Id) -> Result<()> {
        entity::Entity::delete_by_id(*id)
            .exec(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(())
    }

    async fn count(&self) -> Result<u64> {
        entity::Entity::find()
            .count(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))
    }
}
