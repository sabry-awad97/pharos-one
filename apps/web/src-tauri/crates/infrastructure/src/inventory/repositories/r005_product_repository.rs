use super::Repository;
use crate::inventory::entities::e005_product::{self as entity, dto::*};
use pharos_core::{AppError, Id, Result};
use sea_orm::*;

pub struct ProductRepository {
    db: DatabaseConnection,
}

impl ProductRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    /// Find by SKU
    pub async fn find_by_sku(&self, sku: &str) -> Result<Option<ProductDto>> {
        let model = entity::Entity::find()
            .filter(entity::Column::Sku.eq(sku))
            .one(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(model.map(|m| m.into()))
    }

    /// Find active products
    pub async fn find_active(&self) -> Result<Vec<ProductDto>> {
        let models = entity::Entity::find()
            .filter(entity::Column::IsActive.eq(true))
            .order_by_asc(entity::Column::Name)
            .all(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(models.into_iter().map(|m| m.into()).collect())
    }

    /// Search products by name, SKU, or generic name
    pub async fn search(&self, query: &str) -> Result<Vec<ProductDto>> {
        let pattern = format!("%{}%", query);
        let models = entity::Entity::find()
            .filter(
                Condition::any()
                    .add(entity::Column::Name.like(&pattern))
                    .add(entity::Column::Sku.like(&pattern))
                    .add(entity::Column::GenericName.like(&pattern)),
            )
            .order_by_asc(entity::Column::Name)
            .all(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(models.into_iter().map(|m| m.into()).collect())
    }

    /// Find products by filters
    pub async fn find_by_filters(&self, filters: ProductFilters) -> Result<Vec<ProductDto>> {
        let mut query = entity::Entity::find();

        if let Some(search) = filters.search {
            let pattern = format!("%{}%", search);
            query = query.filter(
                Condition::any()
                    .add(entity::Column::Name.like(&pattern))
                    .add(entity::Column::Sku.like(&pattern))
                    .add(entity::Column::GenericName.like(&pattern)),
            );
        }

        if let Some(manufacturer_id) = filters.manufacturer_id {
            query = query.filter(entity::Column::ManufacturerId.eq(manufacturer_id));
        }

        if let Some(product_type_id) = filters.product_type_id {
            query = query.filter(entity::Column::ProductTypeId.eq(product_type_id));
        }

        if let Some(category_id) = filters.category_id {
            query = query.filter(entity::Column::CategoryId.eq(category_id));
        }

        if let Some(is_active) = filters.is_active {
            query = query.filter(entity::Column::IsActive.eq(is_active));
        }

        if let Some(requires_prescription) = filters.requires_prescription {
            query = query.filter(entity::Column::RequiresPrescription.eq(requires_prescription));
        }

        if let Some(controlled_substance) = filters.controlled_substance {
            query = query.filter(entity::Column::ControlledSubstance.eq(controlled_substance));
        }

        let models = query
            .order_by_asc(entity::Column::Name)
            .all(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(models.into_iter().map(|m| m.into()).collect())
    }
}

#[async_trait::async_trait]
impl Repository<ProductDto, CreateProductDto, UpdateProductDto> for ProductRepository {
    async fn find_all(&self) -> Result<Vec<ProductDto>> {
        let models = entity::Entity::find()
            .order_by_asc(entity::Column::Name)
            .all(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(models.into_iter().map(|m| m.into()).collect())
    }

    async fn find_by_id(&self, id: &Id) -> Result<Option<ProductDto>> {
        let model = entity::Entity::find_by_id(*id)
            .one(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(model.map(|m| m.into()))
    }

    async fn create(&self, dto: CreateProductDto) -> Result<ProductDto> {
        let active_model: entity::ActiveModel = dto.into();

        let result = active_model
            .insert(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(result.into())
    }

    async fn update(&self, id: &Id, dto: UpdateProductDto) -> Result<ProductDto> {
        let model = entity::Entity::find_by_id(*id)
            .one(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?
            .ok_or_else(|| AppError::NotFound(format!("Product {} not found", id)))?;

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
            .ok_or_else(|| AppError::NotFound(format!("Product {} not found", id)))?;

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
