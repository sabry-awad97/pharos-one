use sea_orm::DatabaseConnection;
pub use sea_orm_migration::prelude::*;

mod m20260324_000001_create_product_types;
mod m20260324_000002_create_manufacturers;
mod m20260324_000003_create_categories;
mod m20260324_000004_create_suppliers;
mod m20260324_000005_create_products;
mod m20260324_000006_create_inventory_items;
mod m20260324_000007_create_stock_transactions;
mod m20260324_000008_create_barcodes;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20260324_000001_create_product_types::Migration),
            Box::new(m20260324_000002_create_manufacturers::Migration),
            Box::new(m20260324_000003_create_categories::Migration),
            Box::new(m20260324_000004_create_suppliers::Migration),
            Box::new(m20260324_000005_create_products::Migration),
            Box::new(m20260324_000006_create_inventory_items::Migration),
            Box::new(m20260324_000007_create_stock_transactions::Migration),
            Box::new(m20260324_000008_create_barcodes::Migration),
        ]
    }
}

/// Run all pending migrations
pub async fn run_migrations(db: &DatabaseConnection) -> Result<(), DbErr> {
    Migrator::up(db, None).await
}
