use pharos_core::{Id, Result};
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set};

use crate::inventory::entities::branch_inventory::{
    ActiveModel, Entity as BranchInventoryEntity, Model as BranchInventoryModel,
};

pub struct BranchInventoryRepository {
    db: DatabaseConnection,
}

impl BranchInventoryRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn find_all(&self) -> Result<Vec<BranchInventoryModel>> {
        Ok(BranchInventoryEntity::find().all(&self.db).await?)
    }

    pub async fn find_by_id(&self, id: &Id) -> Result<Option<BranchInventoryModel>> {
        Ok(BranchInventoryEntity::find_by_id(*id).one(&self.db).await?)
    }

    pub async fn find_by_branch(&self, branch_id: &Id) -> Result<Vec<BranchInventoryModel>> {
        use crate::inventory::entities::branch_inventory::Column;
        Ok(BranchInventoryEntity::find()
            .filter(Column::BranchId.eq(*branch_id))
            .filter(Column::IsActive.eq(true))
            .all(&self.db)
            .await?)
    }

    pub async fn find_by_product(&self, product_id: &Id) -> Result<Vec<BranchInventoryModel>> {
        use crate::inventory::entities::branch_inventory::Column;
        Ok(BranchInventoryEntity::find()
            .filter(Column::ProductId.eq(*product_id))
            .filter(Column::IsActive.eq(true))
            .all(&self.db)
            .await?)
    }

    pub async fn find_by_branch_and_product(
        &self,
        branch_id: &Id,
        product_id: &Id,
    ) -> Result<Option<BranchInventoryModel>> {
        use crate::inventory::entities::branch_inventory::Column;
        Ok(BranchInventoryEntity::find()
            .filter(Column::BranchId.eq(*branch_id))
            .filter(Column::ProductId.eq(*product_id))
            .one(&self.db)
            .await?)
    }

    pub async fn find_low_stock(&self, branch_id: &Id) -> Result<Vec<BranchInventoryModel>> {
        use crate::inventory::entities::branch_inventory::Column;
        use sea_orm::sea_query::Expr;

        Ok(BranchInventoryEntity::find()
            .filter(Column::BranchId.eq(*branch_id))
            .filter(Column::IsActive.eq(true))
            .filter(Expr::col(Column::Stock).lte(Expr::col(Column::MinStock)))
            .all(&self.db)
            .await?)
    }

    pub async fn create(&self, model: BranchInventoryModel) -> Result<BranchInventoryModel> {
        let active_model = ActiveModel {
            id: Set(model.id),
            branch_id: Set(model.branch_id),
            product_id: Set(model.product_id),
            stock: Set(model.stock),
            min_stock: Set(model.min_stock),
            max_stock: Set(model.max_stock),
            is_active: Set(model.is_active),
            created_at: Set(model.created_at),
            updated_at: Set(model.updated_at),
        };
        Ok(active_model.insert(&self.db).await?)
    }

    pub async fn update(&self, model: BranchInventoryModel) -> Result<BranchInventoryModel> {
        let active_model = ActiveModel {
            id: Set(model.id),
            branch_id: Set(model.branch_id),
            product_id: Set(model.product_id),
            stock: Set(model.stock),
            min_stock: Set(model.min_stock),
            max_stock: Set(model.max_stock),
            is_active: Set(model.is_active),
            created_at: Set(model.created_at),
            updated_at: Set(model.updated_at),
        };
        Ok(active_model.update(&self.db).await?)
    }

    pub async fn delete(&self, id: &Id) -> Result<()> {
        BranchInventoryEntity::delete_by_id(*id)
            .exec(&self.db)
            .await?;
        Ok(())
    }
}
