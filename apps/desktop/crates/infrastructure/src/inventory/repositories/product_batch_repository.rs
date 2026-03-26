use pharos_core::{DateTime, Id, Result};
use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, QueryOrder, Set,
};

use crate::inventory::entities::product_batch::{
    ActiveModel, Entity as ProductBatchEntity, Model as ProductBatchModel,
};

pub struct ProductBatchRepository {
    db: DatabaseConnection,
}

impl ProductBatchRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn find_all(&self) -> Result<Vec<ProductBatchModel>> {
        Ok(ProductBatchEntity::find().all(&self.db).await?)
    }

    pub async fn find_by_id(&self, id: &Id) -> Result<Option<ProductBatchModel>> {
        Ok(ProductBatchEntity::find_by_id(*id).one(&self.db).await?)
    }

    pub async fn find_by_product(&self, product_id: &Id) -> Result<Vec<ProductBatchModel>> {
        use crate::inventory::entities::product_batch::Column;
        Ok(ProductBatchEntity::find()
            .filter(Column::ProductId.eq(*product_id))
            .filter(Column::IsActive.eq(true))
            .order_by_asc(Column::ExpiryDate)
            .all(&self.db)
            .await?)
    }

    pub async fn find_by_branch(&self, branch_id: &Id) -> Result<Vec<ProductBatchModel>> {
        use crate::inventory::entities::product_batch::Column;
        Ok(ProductBatchEntity::find()
            .filter(Column::BranchId.eq(*branch_id))
            .filter(Column::IsActive.eq(true))
            .all(&self.db)
            .await?)
    }

    pub async fn find_expiring_soon(
        &self,
        before_date: DateTime,
    ) -> Result<Vec<ProductBatchModel>> {
        use crate::inventory::entities::product_batch::Column;
        Ok(ProductBatchEntity::find()
            .filter(Column::ExpiryDate.lte(before_date))
            .filter(Column::IsActive.eq(true))
            .order_by_asc(Column::ExpiryDate)
            .all(&self.db)
            .await?)
    }

    pub async fn find_by_batch_number(
        &self,
        product_id: &Id,
        batch_number: &str,
    ) -> Result<Option<ProductBatchModel>> {
        use crate::inventory::entities::product_batch::Column;
        Ok(ProductBatchEntity::find()
            .filter(Column::ProductId.eq(*product_id))
            .filter(Column::BatchNumber.eq(batch_number))
            .one(&self.db)
            .await?)
    }

    pub async fn create(&self, model: ProductBatchModel) -> Result<ProductBatchModel> {
        let active_model = ActiveModel {
            id: Set(model.id),
            product_id: Set(model.product_id),
            batch_number: Set(model.batch_number),
            expiry_date: Set(model.expiry_date),
            purchase_price: Set(model.purchase_price),
            supplier: Set(model.supplier),
            branch_id: Set(model.branch_id),
            quantity: Set(model.quantity),
            received_date: Set(model.received_date),
            is_active: Set(model.is_active),
            created_at: Set(model.created_at),
            updated_at: Set(model.updated_at),
        };
        Ok(active_model.insert(&self.db).await?)
    }

    pub async fn update(&self, model: ProductBatchModel) -> Result<ProductBatchModel> {
        let active_model = ActiveModel {
            id: Set(model.id),
            product_id: Set(model.product_id),
            batch_number: Set(model.batch_number),
            expiry_date: Set(model.expiry_date),
            purchase_price: Set(model.purchase_price),
            supplier: Set(model.supplier),
            branch_id: Set(model.branch_id),
            quantity: Set(model.quantity),
            received_date: Set(model.received_date),
            is_active: Set(model.is_active),
            created_at: Set(model.created_at),
            updated_at: Set(model.updated_at),
        };
        Ok(active_model.update(&self.db).await?)
    }

    pub async fn delete(&self, id: &Id) -> Result<()> {
        ProductBatchEntity::delete_by_id(*id).exec(&self.db).await?;
        Ok(())
    }
}
