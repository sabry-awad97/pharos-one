use pharos_core::{Id, Result};
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set};

use crate::inventory::entities::product_unit_config::{
    ActiveModel, Entity as ProductUnitConfigEntity, Model as ProductUnitConfigModel,
};

pub struct ProductUnitConfigRepository {
    db: DatabaseConnection,
}

impl ProductUnitConfigRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn find_by_product(&self, product_id: &Id) -> Result<Option<ProductUnitConfigModel>> {
        use crate::inventory::entities::product_unit_config::Column;
        Ok(ProductUnitConfigEntity::find()
            .filter(Column::ProductId.eq(*product_id))
            .one(&self.db)
            .await?)
    }

    pub async fn create(&self, model: ProductUnitConfigModel) -> Result<ProductUnitConfigModel> {
        let active_model = ActiveModel {
            id: Set(model.id),
            product_id: Set(model.product_id),
            base_unit_id: Set(model.base_unit_id),
            created_at: Set(model.created_at),
            updated_at: Set(model.updated_at),
        };
        Ok(active_model.insert(&self.db).await?)
    }
}
