use super::Repository;
use crate::inventory::entities::e007_stock_transaction::{self as entity, dto::*};
use pharos_core::{AppError, Id, Result};
use sea_orm::*;

pub struct StockTransactionRepository {
    db: DatabaseConnection,
}

impl StockTransactionRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    /// Find transactions by inventory item ID
    pub async fn find_by_inventory_item(
        &self,
        inventory_item_id: &Id,
    ) -> Result<Vec<StockTransactionDto>> {
        let models = entity::Entity::find()
            .filter(entity::Column::InventoryItemId.eq(*inventory_item_id))
            .order_by_desc(entity::Column::Timestamp)
            .all(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(models.into_iter().map(|m| m.into()).collect())
    }

    /// Find transactions by type
    pub async fn find_by_type(&self, transaction_type: &str) -> Result<Vec<StockTransactionDto>> {
        let models = entity::Entity::find()
            .filter(entity::Column::TransactionType.eq(transaction_type))
            .order_by_desc(entity::Column::Timestamp)
            .all(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(models.into_iter().map(|m| m.into()).collect())
    }

    /// Find transactions by user ID
    pub async fn find_by_user(&self, user_id: &Id) -> Result<Vec<StockTransactionDto>> {
        let models = entity::Entity::find()
            .filter(entity::Column::UserId.eq(*user_id))
            .order_by_desc(entity::Column::Timestamp)
            .all(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(models.into_iter().map(|m| m.into()).collect())
    }

    /// Find transactions by filters
    pub async fn find_by_filters(
        &self,
        filters: StockTransactionFilters,
    ) -> Result<Vec<StockTransactionDto>> {
        let mut query = entity::Entity::find();

        if let Some(inventory_item_id) = filters.inventory_item_id {
            query = query.filter(entity::Column::InventoryItemId.eq(inventory_item_id));
        }

        if let Some(transaction_type) = filters.transaction_type {
            query = query.filter(entity::Column::TransactionType.eq(transaction_type));
        }

        if let Some(user_id) = filters.user_id {
            query = query.filter(entity::Column::UserId.eq(user_id));
        }

        // TODO: Add timestamp filtering when we have proper date parsing
        // if let Some(timestamp_after) = filters.timestamp_after { ... }
        // if let Some(timestamp_before) = filters.timestamp_before { ... }

        let models = query
            .order_by_desc(entity::Column::Timestamp)
            .all(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(models.into_iter().map(|m| m.into()).collect())
    }
}

// Stock transactions don't have an UpdateDto since they're immutable
pub struct UpdateStockTransactionDto;

impl UpdateStockTransactionDto {
    pub fn apply_to(self, active_model: entity::ActiveModel) -> entity::ActiveModel {
        // Transactions are immutable - no updates allowed
        active_model
    }
}

#[async_trait::async_trait]
impl Repository<StockTransactionDto, CreateStockTransactionDto, UpdateStockTransactionDto>
    for StockTransactionRepository
{
    async fn find_all(&self) -> Result<Vec<StockTransactionDto>> {
        let models = entity::Entity::find()
            .order_by_desc(entity::Column::Timestamp)
            .all(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(models.into_iter().map(|m| m.into()).collect())
    }

    async fn find_by_id(&self, id: &Id) -> Result<Option<StockTransactionDto>> {
        let model = entity::Entity::find_by_id(*id)
            .one(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(model.map(|m| m.into()))
    }

    async fn create(&self, dto: CreateStockTransactionDto) -> Result<StockTransactionDto> {
        let active_model: entity::ActiveModel = dto.into();

        let result = active_model
            .insert(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(result.into())
    }

    async fn update(
        &self,
        _id: &Id,
        _dto: UpdateStockTransactionDto,
    ) -> Result<StockTransactionDto> {
        // Stock transactions are immutable - cannot be updated
        Err(AppError::Validation(
            "Stock transactions cannot be updated (audit trail)".to_string(),
        ))
    }

    async fn delete(&self, _id: &Id) -> Result<()> {
        // Stock transactions should not be deleted (audit trail)
        Err(AppError::Validation(
            "Stock transactions cannot be deleted (audit trail)".to_string(),
        ))
    }

    async fn count(&self) -> Result<u64> {
        entity::Entity::find()
            .count(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))
    }
}
