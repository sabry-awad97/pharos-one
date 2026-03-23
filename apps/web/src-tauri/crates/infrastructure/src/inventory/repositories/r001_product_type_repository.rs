use super::Repository;
use crate::inventory::entities::e001_product_type::{self as entity, dto::*};
use pharos_core::{AppError, Id, Result};
use sea_orm::*;

pub struct ProductTypeRepository {
    db: DatabaseConnection,
}

impl ProductTypeRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    /// Find by code
    pub async fn find_by_code(&self, code: &str) -> Result<Option<ProductTypeDto>> {
        let model = entity::Entity::find()
            .filter(entity::Column::Code.eq(code))
            .one(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(model.map(|m| m.into()))
    }

    /// Find active product types
    pub async fn find_active(&self) -> Result<Vec<ProductTypeDto>> {
        let models = entity::Entity::find()
            .filter(entity::Column::IsActive.eq(true))
            .order_by_asc(entity::Column::DisplayOrder)
            .all(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(models.into_iter().map(|m| m.into()).collect())
    }

    /// Search by name or code
    pub async fn search(&self, query: &str) -> Result<Vec<ProductTypeDto>> {
        let pattern = format!("%{}%", query);
        let models = entity::Entity::find()
            .filter(
                Condition::any()
                    .add(entity::Column::Name.like(&pattern))
                    .add(entity::Column::Code.like(&pattern)),
            )
            .order_by_asc(entity::Column::DisplayOrder)
            .all(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(models.into_iter().map(|m| m.into()).collect())
    }
}

#[async_trait::async_trait]
impl Repository<ProductTypeDto, CreateProductTypeDto, UpdateProductTypeDto>
    for ProductTypeRepository
{
    async fn find_all(&self) -> Result<Vec<ProductTypeDto>> {
        let models = entity::Entity::find()
            .order_by_asc(entity::Column::DisplayOrder)
            .all(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(models.into_iter().map(|m| m.into()).collect())
    }

    async fn find_by_id(&self, id: &Id) -> Result<Option<ProductTypeDto>> {
        let model = entity::Entity::find_by_id(*id)
            .one(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(model.map(|m| m.into()))
    }

    async fn create(&self, dto: CreateProductTypeDto) -> Result<ProductTypeDto> {
        let active_model: entity::ActiveModel = dto.into();

        let result = active_model
            .insert(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(result.into())
    }

    async fn update(&self, id: &Id, dto: UpdateProductTypeDto) -> Result<ProductTypeDto> {
        let model = entity::Entity::find_by_id(*id)
            .one(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?
            .ok_or_else(|| AppError::NotFound(format!("Product type {} not found", id)))?;

        let active_model: entity::ActiveModel = model.into();
        let updated = dto.apply_to(active_model);

        let result = updated
            .update(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(result.into())
    }

    async fn delete(&self, id: &Id) -> Result<()> {
        // Soft delete by setting is_active = false
        let model = entity::Entity::find_by_id(*id)
            .one(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?
            .ok_or_else(|| AppError::NotFound(format!("Product type {} not found", id)))?;

        let mut active_model: entity::ActiveModel = model.into();
        active_model.is_active = Set(false);

        active_model
            .update(&self.db)
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
