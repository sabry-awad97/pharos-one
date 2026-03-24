use pharos_core::{Id, Result};
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set};

use crate::inventory::entities::product::{
    ActiveModel, Entity as ProductEntity, Model as ProductModel,
};

pub struct ProductRepository {
    db: DatabaseConnection,
}

impl ProductRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn find_all(&self) -> Result<Vec<ProductModel>> {
        Ok(ProductEntity::find().all(&self.db).await?)
    }

    pub async fn find_by_id(&self, id: &Id) -> Result<Option<ProductModel>> {
        Ok(ProductEntity::find_by_id(*id).one(&self.db).await?)
    }

    pub async fn find_by_sku(&self, sku: &str) -> Result<Option<ProductModel>> {
        use crate::inventory::entities::product::Column;
        Ok(ProductEntity::find()
            .filter(Column::Sku.eq(sku))
            .one(&self.db)
            .await?)
    }

    pub async fn find_by_barcode(&self, barcode: &str) -> Result<Option<ProductModel>> {
        use crate::inventory::entities::product::Column;
        Ok(ProductEntity::find()
            .filter(Column::Barcode.eq(barcode))
            .one(&self.db)
            .await?)
    }

    pub async fn find_by_category(&self, category_id: &Id) -> Result<Vec<ProductModel>> {
        use crate::inventory::entities::product::Column;
        Ok(ProductEntity::find()
            .filter(Column::CategoryId.eq(*category_id))
            .all(&self.db)
            .await?)
    }

    pub async fn find_active(&self) -> Result<Vec<ProductModel>> {
        use crate::inventory::entities::product::Column;
        Ok(ProductEntity::find()
            .filter(Column::IsActive.eq(true))
            .all(&self.db)
            .await?)
    }

    pub async fn create(&self, model: ProductModel) -> Result<ProductModel> {
        let active_model = ActiveModel {
            id: Set(model.id),
            name: Set(model.name),
            sku: Set(model.sku),
            barcode: Set(model.barcode),
            category_id: Set(model.category_id),
            company_id: Set(model.company_id),
            location_id: Set(model.location_id),
            price: Set(model.price),
            notes: Set(model.notes),
            is_active: Set(model.is_active),
            created_at: Set(model.created_at),
            updated_at: Set(model.updated_at),
        };
        Ok(active_model.insert(&self.db).await?)
    }

    pub async fn update(&self, model: ProductModel) -> Result<ProductModel> {
        let active_model = ActiveModel {
            id: Set(model.id),
            name: Set(model.name),
            sku: Set(model.sku),
            barcode: Set(model.barcode),
            category_id: Set(model.category_id),
            company_id: Set(model.company_id),
            location_id: Set(model.location_id),
            price: Set(model.price),
            notes: Set(model.notes),
            is_active: Set(model.is_active),
            created_at: Set(model.created_at),
            updated_at: Set(model.updated_at),
        };
        Ok(active_model.update(&self.db).await?)
    }

    pub async fn delete(&self, id: &Id) -> Result<()> {
        ProductEntity::delete_by_id(*id).exec(&self.db).await?;
        Ok(())
    }
}
