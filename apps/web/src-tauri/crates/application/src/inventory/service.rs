use super::operations::{InventoryOperations, InventoryResponse};
use pharos_core::{Id, Result};
use pharos_domain::{InventoryService as DomainService, Medicine};

pub struct InventoryService<R>
where
    R: InventoryRepository,
{
    repository: R,
    domain_service: DomainService,
}

impl<R> InventoryService<R>
where
    R: InventoryRepository,
{
    pub fn new(repository: R) -> Self {
        Self {
            repository,
            domain_service: DomainService::new(),
        }
    }

    pub async fn execute(&self, operation: InventoryOperations) -> Result<InventoryResponse> {
        match operation {
            InventoryOperations::GetAll => self.get_all().await,
            InventoryOperations::GetById { id } => self.get_by_id(&id).await,
            InventoryOperations::Create {
                name,
                generic_name,
                unit_price,
                quantity,
            } => self.create(name, generic_name, unit_price, quantity).await,
            InventoryOperations::UpdateStock {
                id,
                quantity_change,
            } => self.update_stock(&id, quantity_change).await,
        }
    }

    async fn get_all(&self) -> Result<InventoryResponse> {
        let medicines = self.repository.find_all().await?;
        Ok(InventoryResponse::Medicines(medicines))
    }

    async fn get_by_id(&self, id: &Id) -> Result<InventoryResponse> {
        let medicine = self.repository.find_by_id(id).await?;
        Ok(InventoryResponse::Medicine(medicine))
    }

    async fn create(
        &self,
        name: String,
        generic_name: String,
        unit_price: f64,
        quantity: i32,
    ) -> Result<InventoryResponse> {
        let now = pharos_core::DateTime::now();
        let medicine = Medicine::builder()
            .id(Id::new())
            .name(name)
            .generic_name(generic_name)
            .unit_price(unit_price)
            .quantity(quantity)
            .created_at(now)
            .updated_at(now)
            .build();

        self.domain_service.validate_medicine(&medicine)?;
        let created = self.repository.create(medicine).await?;

        Ok(InventoryResponse::Medicine(Some(created)))
    }

    async fn update_stock(&self, id: &Id, quantity_change: i32) -> Result<InventoryResponse> {
        let medicine = self
            .repository
            .find_by_id(id)
            .await?
            .ok_or_else(|| pharos_core::AppError::NotFound("Medicine not found".to_string()))?;

        let updated_medicine = Medicine::builder()
            .id(*medicine.id())
            .name(medicine.name().clone())
            .generic_name(medicine.generic_name().clone())
            .unit_price(*medicine.unit_price())
            .quantity(medicine.quantity() + quantity_change)
            .created_at(*medicine.created_at())
            .updated_at(pharos_core::DateTime::now())
            .build();

        let updated = self.repository.update(updated_medicine).await?;

        Ok(InventoryResponse::Medicine(Some(updated)))
    }
}

#[async_trait::async_trait]
pub trait InventoryRepository: Send + Sync {
    async fn find_all(&self) -> Result<Vec<Medicine>>;
    async fn find_by_id(&self, id: &Id) -> Result<Option<Medicine>>;
    async fn create(&self, medicine: Medicine) -> Result<Medicine>;
    async fn update(&self, medicine: Medicine) -> Result<Medicine>;
}
