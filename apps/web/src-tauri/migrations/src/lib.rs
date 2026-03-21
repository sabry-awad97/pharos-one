use sea_orm::DatabaseConnection;
pub use sea_orm_migration::prelude::*;

mod m20240101_create_medicines;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![Box::new(m20240101_create_medicines::Migration)]
    }
}

/// Run all pending migrations
pub async fn run_migrations(db: &DatabaseConnection) -> Result<(), DbErr> {
    Migrator::up(db, None).await
}
