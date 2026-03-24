use pharos_core::{Id, Result};
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set};

use crate::inventory::entities::unit::{ActiveModel, Entity as UnitEntity, Model as UnitModel};

pub struct UnitRepository {
    db: DatabaseConnection,
}

impl UnitRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn find_all(&self) -> Result<Vec<UnitModel>> {
        Ok(UnitEntity::find().all(&self.db).await?)
    }

    pub async fn find_by_id(&self, id: &Id) -> Result<Option<UnitModel>> {
        Ok(UnitEntity::find_by_id(*id).one(&self.db).await?)
    }

    pub async fn find_by_name(&self, name: &str) -> Result<Option<UnitModel>> {
        use crate::inventory::entities::unit::Column;
        Ok(UnitEntity::find()
            .filter(Column::Name.eq(name))
            .one(&self.db)
            .await?)
    }

    pub async fn find_by_abbreviation(&self, abbreviation: &str) -> Result<Option<UnitModel>> {
        use crate::inventory::entities::unit::Column;
        Ok(UnitEntity::find()
            .filter(Column::Abbreviation.eq(abbreviation))
            .one(&self.db)
            .await?)
    }

    pub async fn create(&self, model: UnitModel) -> Result<UnitModel> {
        let active_model = ActiveModel {
            id: Set(model.id),
            name: Set(model.name),
            abbreviation: Set(model.abbreviation),
            description: Set(model.description),
            created_at: Set(model.created_at),
            updated_at: Set(model.updated_at),
        };
        Ok(active_model.insert(&self.db).await?)
    }

    pub async fn update(&self, model: UnitModel) -> Result<UnitModel> {
        let active_model = ActiveModel {
            id: Set(model.id),
            name: Set(model.name),
            abbreviation: Set(model.abbreviation),
            description: Set(model.description),
            created_at: Set(model.created_at),
            updated_at: Set(model.updated_at),
        };
        Ok(active_model.update(&self.db).await?)
    }

    pub async fn delete(&self, id: &Id) -> Result<()> {
        UnitEntity::delete_by_id(*id).exec(&self.db).await?;
        Ok(())
    }
}
