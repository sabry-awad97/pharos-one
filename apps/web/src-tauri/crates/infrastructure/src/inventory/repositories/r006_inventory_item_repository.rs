use super::Repository;
use crate::inventory::entities::e006_inventory_item::{self as entity, dto::*};
use pharos_core::{AppError, Id, Result};
use sea_orm::*;

pub struct InventoryItemRepository {
    db: DatabaseConnection,
}

impl InventoryItemRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    /// Find inventory items by product ID
    pub async fn find_by_product(&self, product_id: &Id) -> Result<Vec<InventoryItemDto>> {
        let models = entity::Entity::find()
            .filter(entity::Column::ProductId.eq(*product_id))
            .order_by_desc(entity::Column::ReceivedDate)
            .all(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(models.into_iter().map(|m| m.into()).collect())
    }

    /// Find inventory items by batch number
    pub async fn find_by_batch(&self, batch_number: &str) -> Result<Vec<InventoryItemDto>> {
        let models = entity::Entity::find()
            .filter(entity::Column::BatchNumber.eq(batch_number))
            .all(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(models.into_iter().map(|m| m.into()).collect())
    }

    /// Find inventory items by status
    pub async fn find_by_status(&self, status: &str) -> Result<Vec<InventoryItemDto>> {
        let models = entity::Entity::find()
            .filter(entity::Column::Status.eq(status))
            .order_by_asc(entity::Column::ExpiryDate)
            .all(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(models.into_iter().map(|m| m.into()).collect())
    }

    /// Find inventory items by filters
    pub async fn find_by_filters(
        &self,
        filters: InventoryItemFilters,
    ) -> Result<Vec<InventoryItemDto>> {
        let mut query = entity::Entity::find();

        if let Some(product_id) = filters.product_id {
            query = query.filter(entity::Column::ProductId.eq(product_id));
        }

        if let Some(supplier_id) = filters.supplier_id {
            query = query.filter(entity::Column::SupplierId.eq(supplier_id));
        }

        if let Some(batch_number) = filters.batch_number {
            query = query.filter(entity::Column::BatchNumber.contains(&batch_number));
        }

        if let Some(status) = filters.status {
            query = query.filter(entity::Column::Status.eq(status));
        }

        // TODO: Add date filtering when we have proper date parsing
        // if let Some(expiry_before) = filters.expiry_before { ... }
        // if let Some(expiry_after) = filters.expiry_after { ... }

        let models = query
            .order_by_asc(entity::Column::ExpiryDate)
            .all(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(models.into_iter().map(|m| m.into()).collect())
    }
}

#[async_trait::async_trait]
impl Repository<InventoryItemDto, CreateInventoryItemDto, UpdateInventoryItemDto>
    for InventoryItemRepository
{
    async fn find_all(&self) -> Result<Vec<InventoryItemDto>> {
        let models = entity::Entity::find()
            .order_by_desc(entity::Column::ReceivedDate)
            .all(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(models.into_iter().map(|m| m.into()).collect())
    }

    async fn find_by_id(&self, id: &Id) -> Result<Option<InventoryItemDto>> {
        let model = entity::Entity::find_by_id(*id)
            .one(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(model.map(|m| m.into()))
    }

    async fn create(&self, dto: CreateInventoryItemDto) -> Result<InventoryItemDto> {
        let active_model: entity::ActiveModel = dto.into();

        let result = active_model
            .insert(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(result.into())
    }

    async fn update(&self, id: &Id, dto: UpdateInventoryItemDto) -> Result<InventoryItemDto> {
        let model = entity::Entity::find_by_id(*id)
            .one(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?
            .ok_or_else(|| AppError::NotFound(format!("Inventory item {} not found", id)))?;

        let active_model: entity::ActiveModel = model.into();
        let updated = dto.apply_to(active_model);

        let result = updated
            .update(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(result.into())
    }

    async fn delete(&self, id: &Id) -> Result<()> {
        // For inventory items, we might want to set status to "deleted" instead of hard delete
        let model = entity::Entity::find_by_id(*id)
            .one(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?
            .ok_or_else(|| AppError::NotFound(format!("Inventory item {} not found", id)))?;

        let mut active_model: entity::ActiveModel = model.into();
        active_model.status = Set("deleted".to_string());

        active_model
            .update(&self.db)
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
