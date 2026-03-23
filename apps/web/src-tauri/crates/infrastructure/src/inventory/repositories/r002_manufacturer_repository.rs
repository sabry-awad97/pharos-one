use super::Repository;
use crate::inventory::entities::e002_manufacturer::{self as entity, dto::*};
use pharos_core::{AppError, Id, Result};
use sea_orm::*;

pub struct ManufacturerRepository {
    db: DatabaseConnection,
}

impl ManufacturerRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    /// Find active manufacturers
    pub async fn find_active(&self) -> Result<Vec<ManufacturerDto>> {
        let models = entity::Entity::find()
            .filter(entity::Column::IsActive.eq(true))
            .order_by_asc(entity::Column::Name)
            .all(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(models.into_iter().map(|m| m.into()).collect())
    }

    /// Search by name, short_name, or country
    pub async fn search(&self, filters: &ManufacturerFilters) -> Result<Vec<ManufacturerDto>> {
        let mut query = entity::Entity::find();

        if let Some(search) = &filters.search {
            let pattern = format!("%{}%", search);
            query = query.filter(
                Condition::any()
                    .add(entity::Column::Name.like(&pattern))
                    .add(entity::Column::ShortName.like(&pattern)),
            );
        }

        if let Some(country) = &filters.country {
            query = query.filter(entity::Column::Country.eq(country));
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
impl Repository<ManufacturerDto, CreateManufacturerDto, UpdateManufacturerDto>
    for ManufacturerRepository
{
    async fn find_all(&self) -> Result<Vec<ManufacturerDto>> {
        let models = entity::Entity::find()
            .order_by_asc(entity::Column::Name)
            .all(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(models.into_iter().map(|m| m.into()).collect())
    }

    async fn find_by_id(&self, id: &Id) -> Result<Option<ManufacturerDto>> {
        let model = entity::Entity::find_by_id(*id)
            .one(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(model.map(|m| m.into()))
    }

    async fn create(&self, dto: CreateManufacturerDto) -> Result<ManufacturerDto> {
        let active_model: entity::ActiveModel = dto.into();

        let result = active_model
            .insert(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(result.into())
    }

    async fn update(&self, id: &Id, dto: UpdateManufacturerDto) -> Result<ManufacturerDto> {
        let model = entity::Entity::find_by_id(*id)
            .one(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?
            .ok_or_else(|| AppError::NotFound(format!("Manufacturer {} not found", id)))?;

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
            .ok_or_else(|| AppError::NotFound(format!("Manufacturer {} not found", id)))?;

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
