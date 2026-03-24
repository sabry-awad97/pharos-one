use pharos_core::{DateTime, Id, Result};
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, QueryOrder};

use crate::sales::entities::sale_transaction::{
    Entity as SaleTransactionEntity, Model as SaleTransactionModel,
};

pub struct SaleTransactionRepository {
    db: DatabaseConnection,
}

impl SaleTransactionRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn find_by_branch(&self, branch_id: &Id) -> Result<Vec<SaleTransactionModel>> {
        use crate::sales::entities::sale_transaction::Column;
        Ok(SaleTransactionEntity::find()
            .filter(Column::BranchId.eq(*branch_id))
            .order_by_desc(Column::CreatedAt)
            .all(&self.db)
            .await?)
    }

    pub async fn find_by_receipt_number(
        &self,
        receipt_number: &str,
    ) -> Result<Option<SaleTransactionModel>> {
        use crate::sales::entities::sale_transaction::Column;
        Ok(SaleTransactionEntity::find()
            .filter(Column::ReceiptNumber.eq(receipt_number))
            .one(&self.db)
            .await?)
    }

    pub async fn find_by_date_range(
        &self,
        branch_id: &Id,
        start: DateTime,
        end: DateTime,
    ) -> Result<Vec<SaleTransactionModel>> {
        use crate::sales::entities::sale_transaction::Column;
        Ok(SaleTransactionEntity::find()
            .filter(Column::BranchId.eq(*branch_id))
            .filter(Column::CreatedAt.gte(start))
            .filter(Column::CreatedAt.lte(end))
            .order_by_desc(Column::CreatedAt)
            .all(&self.db)
            .await?)
    }
}
