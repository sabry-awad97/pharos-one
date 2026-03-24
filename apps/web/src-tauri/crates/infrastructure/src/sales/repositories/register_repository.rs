use pharos_core::{Id, Result};
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

use crate::sales::entities::register::{Entity as RegisterEntity, Model as RegisterModel};

pub struct RegisterRepository {
    db: DatabaseConnection,
}

impl RegisterRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn find_by_branch(&self, branch_id: &Id) -> Result<Vec<RegisterModel>> {
        use crate::sales::entities::register::Column;
        Ok(RegisterEntity::find()
            .filter(Column::BranchId.eq(*branch_id))
            .filter(Column::IsActive.eq(true))
            .all(&self.db)
            .await?)
    }

    pub async fn find_by_code(&self, code: &str) -> Result<Option<RegisterModel>> {
        use crate::sales::entities::register::Column;
        Ok(RegisterEntity::find()
            .filter(Column::Code.eq(code))
            .one(&self.db)
            .await?)
    }
}
