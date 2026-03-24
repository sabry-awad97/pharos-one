use pharos_core::{Id, Result};
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

use crate::user::entities::role::{Entity as RoleEntity, Model as RoleModel};

pub struct RoleRepository {
    db: DatabaseConnection,
}

impl RoleRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn find_all(&self) -> Result<Vec<RoleModel>> {
        Ok(RoleEntity::find().all(&self.db).await?)
    }

    pub async fn find_by_name(&self, name: &str) -> Result<Option<RoleModel>> {
        use crate::user::entities::role::Column;
        Ok(RoleEntity::find()
            .filter(Column::Name.eq(name))
            .one(&self.db)
            .await?)
    }
}
