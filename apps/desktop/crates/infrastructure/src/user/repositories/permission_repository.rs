use pharos_core::Result;
use sea_orm::{ActiveModelTrait, DatabaseConnection, EntityTrait};

use crate::user::entities::permission::{Entity as PermissionEntity, Model as PermissionModel};

pub struct PermissionRepository {
    db: DatabaseConnection,
}

impl PermissionRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn find_all(&self) -> Result<Vec<PermissionModel>> {
        Ok(PermissionEntity::find().all(&self.db).await?)
    }
}
