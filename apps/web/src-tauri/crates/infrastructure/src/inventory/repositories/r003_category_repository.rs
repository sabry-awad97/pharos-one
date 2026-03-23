use super::Repository;
use crate::inventory::entities::e003_category::{self as entity, dto::*};
use pharos_core::{AppError, Id, Result};
use sea_orm::*;

pub struct CategoryRepository {
    db: DatabaseConnection,
}

impl CategoryRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    /// Find root categories (no parent)
    pub async fn find_roots(&self) -> Result<Vec<CategoryDto>> {
        let models = entity::Entity::find()
            .filter(entity::Column::ParentCategoryId.is_null())
            .order_by_asc(entity::Column::Name)
            .all(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(models.into_iter().map(|m| m.into()).collect())
    }

    /// Find children of a category
    pub async fn find_children(&self, parent_id: &Id) -> Result<Vec<CategoryDto>> {
        let models = entity::Entity::find()
            .filter(entity::Column::ParentCategoryId.eq(*parent_id))
            .order_by_asc(entity::Column::Name)
            .all(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(models.into_iter().map(|m| m.into()).collect())
    }

    /// Search by name
    pub async fn search(&self, query: &str) -> Result<Vec<CategoryDto>> {
        let pattern = format!("%{}%", query);
        let models = entity::Entity::find()
            .filter(entity::Column::Name.like(&pattern))
            .order_by_asc(entity::Column::Name)
            .all(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(models.into_iter().map(|m| m.into()).collect())
    }
}

#[async_trait::async_trait]
impl Repository<CategoryDto, CreateCategoryDto, UpdateCategoryDto> for CategoryRepository {
    async fn find_all(&self) -> Result<Vec<CategoryDto>> {
        let models = entity::Entity::find()
            .order_by_asc(entity::Column::Name)
            .all(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(models.into_iter().map(|m| m.into()).collect())
    }

    async fn find_by_id(&self, id: &Id) -> Result<Option<CategoryDto>> {
        let model = entity::Entity::find_by_id(*id)
            .one(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(model.map(|m| m.into()))
    }

    async fn create(&self, dto: CreateCategoryDto) -> Result<CategoryDto> {
        let active_model: entity::ActiveModel = dto.into();

        let result = active_model
            .insert(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(result.into())
    }

    async fn update(&self, id: &Id, dto: UpdateCategoryDto) -> Result<CategoryDto> {
        let model = entity::Entity::find_by_id(*id)
            .one(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?
            .ok_or_else(|| AppError::NotFound(format!("Category {} not found", id)))?;

        let active_model: entity::ActiveModel = model.into();
        let updated = dto.apply_to(active_model);

        let result = updated
            .update(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(result.into())
    }

    async fn delete(&self, id: &Id) -> Result<()> {
        entity::Entity::delete_by_id(*id)
            .exec(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(())
    }

    async fn count(&self) -> Result<u64> {
        entity::Entity::find()
            .count(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))
    }
}
