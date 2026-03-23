use super::Repository;
use crate::inventory::entities::e004_supplier::{self as entity, dto::*};
use pharos_core::{AppError, Id, Result};
use sea_orm::*;

pub struct SupplierRepository {
    db: DatabaseConnection,
}

impl SupplierRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    /// Find active suppliers
    pub async fn find_active(&self) -> Result<Vec<SupplierDto>> {
        let models = entity::Entity::find()
            .filter(entity::Column::IsActive.eq(true))
            .order_by_asc(entity::Column::Name)
            .all(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(models.into_iter().map(|m| m.into()).collect())
    }

    /// Search suppliers
    pub async fn search(&self, filters: &SupplierFilters) -> Result<Vec<SupplierDto>> {
        let mut query = entity::Entity::find();

        if let Some(search) = &filters.search {
            let pattern = format!("%{}%", search);
            query = query.filter(
                Condition::any()
                    .add(entity::Column::Name.like(&pattern))
                    .add(entity::Column::ContactPerson.like(&pattern)),
            );
        }

        if let Some(is_active) = filters.is_active {
            query = query.filter(entity::Column::IsActive.eq(is_active));
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
impl Repository<SupplierDto, CreateSupplierDto, UpdateSupplierDto> for SupplierRepository {
    async fn find_all(&self) -> Result<Vec<SupplierDto>> {
        let models = entity::Entity::find()
            .order_by_asc(entity::Column::Name)
            .all(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(models.into_iter().map(|m| m.into()).collect())
    }

    async fn find_by_id(&self, id: &Id) -> Result<Option<SupplierDto>> {
        let model = entity::Entity::find_by_id(*id)
            .one(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(model.map(|m| m.into()))
    }

    async fn create(&self, dto: CreateSupplierDto) -> Result<SupplierDto> {
        let active_model: entity::ActiveModel = dto.into();

        let result = active_model
            .insert(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(result.into())
    }

    async fn update(&self, id: &Id, dto: UpdateSupplierDto) -> Result<SupplierDto> {
        let model = entity::Entity::find_by_id(*id)
            .one(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?
            .ok_or_else(|| AppError::NotFound(format!("Supplier {} not found", id)))?;

        let active_model: entity::ActiveModel = model.into();
        let updated = dto.apply_to(active_model);

        let result = updated
            .update(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(result.into())
    }

    async fn delete(&self, id: &Id) -> Result<()> {
        let model = entity::Entity::find_by_id(*id)
            .one(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?
            .ok_or_else(|| AppError::NotFound(format!("Supplier {} not found", id)))?;

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
