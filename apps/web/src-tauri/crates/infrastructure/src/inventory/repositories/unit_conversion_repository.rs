use pharos_core::{Id, Result};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

use crate::inventory::entities::unit_conversion::{
    Entity as UnitConversionEntity, Model as UnitConversionModel,
};

pub struct UnitConversionRepository {
    db: DatabaseConnection,
}

impl UnitConversionRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn find_all(&self) -> Result<Vec<UnitConversionModel>> {
        Ok(UnitConversionEntity::find().all(&self.db).await?)
    }

    pub async fn find_by_id(&self, id: &Id) -> Result<Option<UnitConversionModel>> {
        Ok(UnitConversionEntity::find_by_id(*id).one(&self.db).await?)
    }

    pub async fn find_by_from_unit(&self, from_unit_id: &Id) -> Result<Vec<UnitConversionModel>> {
        use crate::inventory::entities::unit_conversion::Column;
        Ok(UnitConversionEntity::find()
            .filter(Column::FromUnitId.eq(*from_unit_id))
            .filter(Column::IsEnabled.eq(true))
            .all(&self.db)
            .await?)
    }
}
