use pharos_core::{Id, Result};
use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, QueryOrder, Set,
};

use crate::inventory::entities::category::{
    ActiveModel, Entity as CategoryEntity, Model as CategoryModel,
};

pub struct CategoryRepository {
    db: DatabaseConnection,
}

impl CategoryRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn find_all(&self) -> Result<Vec<CategoryModel>> {
        use crate::inventory::entities::category::Column;
        Ok(CategoryEntity::find()
            .order_by_asc(Column::SortOrder)
            .all(&self.db)
            .await?)
    }

    pub async fn find_by_id(&self, id: &Id) -> Result<Option<CategoryModel>> {
        Ok(CategoryEntity::find_by_id(*id).one(&self.db).await?)
    }

    pub async fn find_by_name(&self, name: &str) -> Result<Option<CategoryModel>> {
        use crate::inventory::entities::category::Column;
        Ok(CategoryEntity::find()
            .filter(Column::Name.eq(name))
            .one(&self.db)
            .await?)
    }

    pub async fn find_active(&self) -> Result<Vec<CategoryModel>> {
        use crate::inventory::entities::category::Column;
        Ok(CategoryEntity::find()
            .filter(Column::IsActive.eq(true))
            .order_by_asc(Column::SortOrder)
            .all(&self.db)
            .await?)
    }

    pub async fn create(&self, model: CategoryModel) -> Result<CategoryModel> {
        let active_model = ActiveModel {
            id: Set(model.id),
            name: Set(model.name),
            icon: Set(model.icon),
            description: Set(model.description),
            is_active: Set(model.is_active),
            sort_order: Set(model.sort_order),
            created_at: Set(model.created_at),
            updated_at: Set(model.updated_at),
        };
        Ok(active_model.insert(&self.db).await?)
    }

    pub async fn update(&self, model: CategoryModel) -> Result<CategoryModel> {
        let active_model = ActiveModel {
            id: Set(model.id),
            name: Set(model.name),
            icon: Set(model.icon),
            description: Set(model.description),
            is_active: Set(model.is_active),
            sort_order: Set(model.sort_order),
            created_at: Set(model.created_at),
            updated_at: Set(model.updated_at),
        };
        Ok(active_model.update(&self.db).await?)
    }

    pub async fn delete(&self, id: &Id) -> Result<()> {
        CategoryEntity::delete_by_id(*id).exec(&self.db).await?;
        Ok(())
    }
}
