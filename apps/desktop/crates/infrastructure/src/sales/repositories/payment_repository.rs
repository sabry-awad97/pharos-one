use pharos_core::{Id, Result};
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

use crate::sales::entities::payment::{Entity as PaymentEntity, Model as PaymentModel};

pub struct PaymentRepository {
    db: DatabaseConnection,
}

impl PaymentRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn find_by_sale_transaction(
        &self,
        sale_transaction_id: &Id,
    ) -> Result<Vec<PaymentModel>> {
        use crate::sales::entities::payment::Column;
        Ok(PaymentEntity::find()
            .filter(Column::SaleTransactionId.eq(*sale_transaction_id))
            .all(&self.db)
            .await?)
    }

    pub async fn find_by_held_transaction(
        &self,
        held_transaction_id: &Id,
    ) -> Result<Vec<PaymentModel>> {
        use crate::sales::entities::payment::Column;
        Ok(PaymentEntity::find()
            .filter(Column::HeldTransactionId.eq(*held_transaction_id))
            .all(&self.db)
            .await?)
    }
}
