use super::{dto::*, Model};
use pharos_core::DateTime;
use sea_orm::ActiveValue::Set;

/// Convert database model to DTO
impl From<Model> for StockTransactionDto {
    fn from(model: Model) -> Self {
        Self {
            id: model.id,
            inventory_item_id: model.inventory_item_id,
            transaction_type: model.transaction_type,
            quantity: model.quantity,
            order_id: model.order_id,
            user_id: model.user_id,
            reason: model.reason,
            timestamp: model.timestamp,
            created_at: model.created_at,
            created_by: model.created_by,
        }
    }
}

/// Convert create DTO to active model
impl From<CreateStockTransactionDto> for super::ActiveModel {
    fn from(dto: CreateStockTransactionDto) -> Self {
        use pharos_core::Id;

        Self {
            id: Set(Id::new()),
            inventory_item_id: Set(dto.inventory_item_id),
            transaction_type: Set(dto.transaction_type),
            quantity: Set(dto.quantity),
            order_id: Set(dto.order_id),
            user_id: Set(dto.user_id),
            reason: Set(dto.reason),
            timestamp: Set(DateTime::now()),
            created_at: Set(DateTime::now()),
            created_by: Set(dto.created_by),
        }
    }
}
