use super::entities as db;
use pharos_domain::Medicine;
use sea_orm::ActiveValue::Set;

/// Convert SeaORM model to domain model
impl From<db::Model> for Medicine {
    fn from(model: db::Model) -> Self {
        Self::builder()
            .id(model.id)
            .name(model.name)
            .generic_name(model.generic_name)
            .unit_price(model.unit_price)
            .quantity(model.quantity)
            .created_at(model.created_at)
            .updated_at(model.updated_at)
            .build()
    }
}

/// Convert domain model to SeaORM active model
impl From<Medicine> for db::ActiveModel {
    fn from(medicine: Medicine) -> Self {
        Self {
            id: Set(*medicine.id()),
            name: Set(medicine.name().clone()),
            generic_name: Set(medicine.generic_name().clone()),
            unit_price: Set(*medicine.unit_price()),
            quantity: Set(*medicine.quantity()),
            created_at: Set(*medicine.created_at()),
            updated_at: Set(*medicine.updated_at()),
        }
    }
}
