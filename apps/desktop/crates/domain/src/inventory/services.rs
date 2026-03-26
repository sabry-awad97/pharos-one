use super::entities::Medicine;
use pharos_core::{AppError, Result};

/// Domain service - business rules
pub struct InventoryService;

impl InventoryService {
    pub fn new() -> Self {
        Self
    }

    pub fn validate_medicine(&self, medicine: &Medicine) -> Result<()> {
        if medicine.name().is_empty() {
            return Err(AppError::Validation("Medicine name required".to_string()));
        }

        if *medicine.unit_price() < 0.0 {
            return Err(AppError::Validation("Price cannot be negative".to_string()));
        }

        if *medicine.quantity() < 0 {
            return Err(AppError::Validation(
                "Quantity cannot be negative".to_string(),
            ));
        }

        Ok(())
    }
}
