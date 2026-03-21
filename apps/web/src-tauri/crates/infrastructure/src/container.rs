use derive_getters::Getters;
use pharos_application::inventory::InventoryService;
use sea_orm::DatabaseConnection;
use std::sync::Arc;
use typed_builder::TypedBuilder;

use crate::inventory::SeaOrmInventoryRepository;

/// Service container holding all application services
#[derive(Clone, TypedBuilder, Getters)]
pub struct ServiceContainer {
    #[builder(setter(into))]
    inventory_service: Arc<InventoryService<SeaOrmInventoryRepository>>,
}

impl ServiceContainer {
    /// Create a new service container from a database connection
    pub fn from_db(db: DatabaseConnection) -> Self {
        let inventory_repo = SeaOrmInventoryRepository::new(db);
        let inventory_service = Arc::new(InventoryService::new(inventory_repo));

        Self::builder().inventory_service(inventory_service).build()
    }
}
