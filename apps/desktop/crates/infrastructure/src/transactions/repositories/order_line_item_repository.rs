use pharos_core::{Id, Result};
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

use crate::transactions::entities::order_line_item::{
    Entity as OrderLineItemEntity, Model as OrderLineItemModel,
};

pub struct OrderLineItemRepository {
    db: DatabaseConnection,
}

impl OrderLineItemRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn find_by_held_transaction(
        &self,
        held_transaction_id: &Id,
    ) -> Result<Vec<OrderLineItemModel>> {
        use crate::transactions::entities::order_line_item::Column;
        Ok(OrderLineItemEntity::find()
            .filter(Column::HeldTransactionId.eq(*held_transaction_id))
            .all(&self.db)
            .await?)
    }
}
