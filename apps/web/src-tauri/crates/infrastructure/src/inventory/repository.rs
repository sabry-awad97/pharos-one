use super::entities::{self as db, Entity as MedicineEntity};
use pharos_application::inventory::InventoryRepository;
use pharos_core::{AppError, Id, Result};
use pharos_domain::Medicine;
use sea_orm::*;

pub struct SeaOrmInventoryRepository {
    db: DatabaseConnection,
}

impl SeaOrmInventoryRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }
}

#[async_trait::async_trait]
impl InventoryRepository for SeaOrmInventoryRepository {
    async fn find_all(&self) -> Result<Vec<Medicine>> {
        let models = MedicineEntity::find()
            .all(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(models.into_iter().map(|m| m.into()).collect())
    }

    async fn find_by_id(&self, id: &Id) -> Result<Option<Medicine>> {
        let model = MedicineEntity::find_by_id(id.into_uuid())
            .one(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(model.map(|m| m.into()))
    }

    async fn create(&self, medicine: Medicine) -> Result<Medicine> {
        let active_model: db::ActiveModel = medicine.into();

        let result = active_model
            .insert(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(result.into())
    }

    async fn update(&self, medicine: Medicine) -> Result<Medicine> {
        let active_model: db::ActiveModel = medicine.into();

        let result = active_model
            .update(&self.db)
            .await
            .map_err(|e| AppError::Database(e.to_string()))?;

        Ok(result.into())
    }
}
