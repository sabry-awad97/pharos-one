use pharos_core::{DateTime, Id, Result};
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, QueryOrder};

use crate::audit::entities::audit_log::{Entity as AuditLogEntity, Model as AuditLogModel};

pub struct AuditLogRepository {
    db: DatabaseConnection,
}

impl AuditLogRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn find_by_user(&self, user_id: &Id) -> Result<Vec<AuditLogModel>> {
        use crate::audit::entities::audit_log::Column;
        Ok(AuditLogEntity::find()
            .filter(Column::UserId.eq(*user_id))
            .order_by_desc(Column::Timestamp)
            .all(&self.db)
            .await?)
    }

    pub async fn find_by_resource(
        &self,
        resource: &str,
        resource_id: &str,
    ) -> Result<Vec<AuditLogModel>> {
        use crate::audit::entities::audit_log::Column;
        Ok(AuditLogEntity::find()
            .filter(Column::Resource.eq(resource))
            .filter(Column::ResourceId.eq(resource_id))
            .order_by_desc(Column::Timestamp)
            .all(&self.db)
            .await?)
    }

    pub async fn find_by_date_range(
        &self,
        start: DateTime,
        end: DateTime,
    ) -> Result<Vec<AuditLogModel>> {
        use crate::audit::entities::audit_log::Column;
        Ok(AuditLogEntity::find()
            .filter(Column::Timestamp.gte(start))
            .filter(Column::Timestamp.lte(end))
            .order_by_desc(Column::Timestamp)
            .all(&self.db)
            .await?)
    }
}
