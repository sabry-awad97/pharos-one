use pharos_core::{Id, Result};
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

use crate::user::entities::user::{Entity as UserEntity, Model as UserModel};

pub struct UserRepository {
    db: DatabaseConnection,
}

impl UserRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn find_by_id(&self, id: &Id) -> Result<Option<UserModel>> {
        Ok(UserEntity::find_by_id(*id).one(&self.db).await?)
    }

    pub async fn find_by_username(&self, username: &str) -> Result<Option<UserModel>> {
        use crate::user::entities::user::Column;
        Ok(UserEntity::find()
            .filter(Column::Username.eq(username))
            .one(&self.db)
            .await?)
    }

    pub async fn find_active(&self) -> Result<Vec<UserModel>> {
        use crate::user::entities::user::Column;
        Ok(UserEntity::find()
            .filter(Column::IsActive.eq(true))
            .all(&self.db)
            .await?)
    }
}
