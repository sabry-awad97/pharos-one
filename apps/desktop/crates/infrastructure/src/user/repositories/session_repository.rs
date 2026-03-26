use pharos_core::{Id, Result};
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

use crate::user::entities::session::{Entity as SessionEntity, Model as SessionModel};

pub struct SessionRepository {
    db: DatabaseConnection,
}

impl SessionRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn find_by_token(&self, token: &str) -> Result<Option<SessionModel>> {
        use crate::user::entities::session::Column;
        Ok(SessionEntity::find()
            .filter(Column::Token.eq(token))
            .one(&self.db)
            .await?)
    }

    pub async fn find_active_by_user(&self, user_id: &Id) -> Result<Vec<SessionModel>> {
        use crate::user::entities::session::Column;
        Ok(SessionEntity::find()
            .filter(Column::UserId.eq(*user_id))
            .filter(Column::IsActive.eq(true))
            .all(&self.db)
            .await?)
    }
}
