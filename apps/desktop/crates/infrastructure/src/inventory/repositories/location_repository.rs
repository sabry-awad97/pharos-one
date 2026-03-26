use pharos_core::{Id, Result};
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set};

use crate::inventory::entities::location::{
    ActiveModel, Entity as LocationEntity, LocationType, Model as LocationModel,
};

pub struct LocationRepository {
    db: DatabaseConnection,
}

impl LocationRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn find_all(&self) -> Result<Vec<LocationModel>> {
        Ok(LocationEntity::find().all(&self.db).await?)
    }

    pub async fn find_by_id(&self, id: &Id) -> Result<Option<LocationModel>> {
        Ok(LocationEntity::find_by_id(*id).one(&self.db).await?)
    }

    pub async fn find_by_branch(&self, branch_id: &Id) -> Result<Vec<LocationModel>> {
        use crate::inventory::entities::location::Column;
        Ok(LocationEntity::find()
            .filter(Column::BranchId.eq(*branch_id))
            .all(&self.db)
            .await?)
    }

    pub async fn find_by_branch_and_code(
        &self,
        branch_id: &Id,
        code: &str,
    ) -> Result<Option<LocationModel>> {
        use crate::inventory::entities::location::Column;
        Ok(LocationEntity::find()
            .filter(Column::BranchId.eq(*branch_id))
            .filter(Column::Code.eq(code))
            .one(&self.db)
            .await?)
    }

    pub async fn find_by_type(&self, location_type: LocationType) -> Result<Vec<LocationModel>> {
        use crate::inventory::entities::location::Column;
        Ok(LocationEntity::find()
            .filter(Column::Type.eq(location_type))
            .all(&self.db)
            .await?)
    }

    pub async fn find_active_by_branch(&self, branch_id: &Id) -> Result<Vec<LocationModel>> {
        use crate::inventory::entities::location::Column;
        Ok(LocationEntity::find()
            .filter(Column::BranchId.eq(*branch_id))
            .filter(Column::IsActive.eq(true))
            .all(&self.db)
            .await?)
    }

    pub async fn create(&self, model: LocationModel) -> Result<LocationModel> {
        let active_model = ActiveModel {
            id: Set(model.id),
            branch_id: Set(model.branch_id),
            code: Set(model.code),
            name: Set(model.name),
            r#type: Set(model.r#type),
            zone: Set(model.zone),
            description: Set(model.description),
            is_active: Set(model.is_active),
            created_at: Set(model.created_at),
            updated_at: Set(model.updated_at),
        };
        Ok(active_model.insert(&self.db).await?)
    }

    pub async fn update(&self, model: LocationModel) -> Result<LocationModel> {
        let active_model = ActiveModel {
            id: Set(model.id),
            branch_id: Set(model.branch_id),
            code: Set(model.code),
            name: Set(model.name),
            r#type: Set(model.r#type),
            zone: Set(model.zone),
            description: Set(model.description),
            is_active: Set(model.is_active),
            created_at: Set(model.created_at),
            updated_at: Set(model.updated_at),
        };
        Ok(active_model.update(&self.db).await?)
    }

    pub async fn delete(&self, id: &Id) -> Result<()> {
        LocationEntity::delete_by_id(*id).exec(&self.db).await?;
        Ok(())
    }
}
