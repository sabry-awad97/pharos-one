use pharos_core::{Id, Result};
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

use crate::transactions::entities::held_transaction::{
    Entity as HeldTransactionEntity, Model as HeldTransactionModel, TransactionStatus,
};

pub struct HeldTransactionRepository {
    db: DatabaseConnection,
}

impl HeldTransactionRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn find_by_branch(&self, branch_id: &Id) -> Result<Vec<HeldTransactionModel>> {
        use crate::transactions::entities::held_transaction::Column;
        Ok(HeldTransactionEntity::find()
            .filter(Column::BranchId.eq(*branch_id))
            .filter(Column::Status.eq(TransactionStatus::Held))
            .all(&self.db)
            .await?)
    }

    pub async fn find_by_hold_number(
        &self,
        hold_number: &str,
    ) -> Result<Option<HeldTransactionModel>> {
        use crate::transactions::entities::held_transaction::Column;
        Ok(HeldTransactionEntity::find()
            .filter(Column::HoldNumber.eq(hold_number))
            .one(&self.db)
            .await?)
    }
}
