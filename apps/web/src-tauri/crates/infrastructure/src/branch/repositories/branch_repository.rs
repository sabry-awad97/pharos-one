use pharos_core::{Id, Result};
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set};

use crate::branch::entities::branch::{ActiveModel, Entity as BranchEntity, Model as BranchModel};

pub struct BranchRepository {
    db: DatabaseConnection,
}

impl BranchRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn find_all(&self) -> Result<Vec<BranchModel>> {
        Ok(BranchEntity::find().all(&self.db).await?)
    }

    pub async fn find_by_id(&self, id: &Id) -> Result<Option<BranchModel>> {
        Ok(BranchEntity::find_by_id(*id).one(&self.db).await?)
    }

    pub async fn find_by_code(&self, code: &str) -> Result<Option<BranchModel>> {
        use crate::branch::entities::branch::Column;
        Ok(BranchEntity::find()
            .filter(Column::Code.eq(code))
            .one(&self.db)
            .await?)
    }

    pub async fn find_active(&self) -> Result<Vec<BranchModel>> {
        use crate::branch::entities::branch::Column;
        Ok(BranchEntity::find()
            .filter(Column::IsActive.eq(true))
            .all(&self.db)
            .await?)
    }

    pub async fn find_headquarters(&self) -> Result<Option<BranchModel>> {
        use crate::branch::entities::branch::Column;
        Ok(BranchEntity::find()
            .filter(Column::IsHeadquarters.eq(true))
            .one(&self.db)
            .await?)
    }
}
