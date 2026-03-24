use sea_orm::DatabaseConnection;
use std::sync::Arc;

/// Service container holding all repository instances
/// Repositories will be added as needed
#[derive(Clone)]
pub struct ServiceContainer {
    db: Arc<DatabaseConnection>,
}

impl ServiceContainer {
    /// Create a new service container from a database connection
    pub fn from_db(db: DatabaseConnection) -> Self {
        Self { db: Arc::new(db) }
    }

    /// Get database connection
    pub fn db(&self) -> &DatabaseConnection {
        &self.db
    }
}
