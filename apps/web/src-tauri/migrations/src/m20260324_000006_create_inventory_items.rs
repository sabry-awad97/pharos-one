use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(InventoryItems::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(InventoryItems::Id)
                            .uuid()
                            .not_null()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(InventoryItems::ProductId).uuid().not_null())
                    .col(ColumnDef::new(InventoryItems::SupplierId).uuid().not_null())
                    .col(ColumnDef::new(InventoryItems::PurchaseOrderId).uuid())
                    .col(ColumnDef::new(InventoryItems::LocationId).uuid())
                    .col(
                        ColumnDef::new(InventoryItems::BatchNumber)
                            .string()
                            .not_null(),
                    )
                    .col(ColumnDef::new(InventoryItems::ExpiryDate).date().not_null())
                    .col(
                        ColumnDef::new(InventoryItems::ReceivedDate)
                            .date()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(InventoryItems::CostPerUnit)
                            .decimal_len(10, 2)
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(InventoryItems::QuantityReceived)
                            .integer()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(InventoryItems::QuantityRemaining)
                            .integer()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(InventoryItems::Status)
                            .string()
                            .not_null()
                            .default("available"),
                    )
                    .col(ColumnDef::new(InventoryItems::Notes).text())
                    .col(
                        ColumnDef::new(InventoryItems::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(
                        ColumnDef::new(InventoryItems::UpdatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(ColumnDef::new(InventoryItems::CreatedBy).uuid())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_inventory_items_product")
                            .from(InventoryItems::Table, InventoryItems::ProductId)
                            .to(Products::Table, Products::Id)
                            .on_delete(ForeignKeyAction::Restrict)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_inventory_items_supplier")
                            .from(InventoryItems::Table, InventoryItems::SupplierId)
                            .to(Suppliers::Table, Suppliers::Id)
                            .on_delete(ForeignKeyAction::Restrict)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        // Create composite unique constraint
        manager
            .create_index(
                Index::create()
                    .name("uk_inventory_batch")
                    .table(InventoryItems::Table)
                    .col(InventoryItems::ProductId)
                    .col(InventoryItems::BatchNumber)
                    .col(InventoryItems::SupplierId)
                    .unique()
                    .to_owned(),
            )
            .await?;

        // Create indexes
        manager
            .create_index(
                Index::create()
                    .name("idx_inventory_product")
                    .table(InventoryItems::Table)
                    .col(InventoryItems::ProductId)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_inventory_supplier")
                    .table(InventoryItems::Table)
                    .col(InventoryItems::SupplierId)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_inventory_batch")
                    .table(InventoryItems::Table)
                    .col(InventoryItems::BatchNumber)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_inventory_expiry")
                    .table(InventoryItems::Table)
                    .col(InventoryItems::ExpiryDate)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_inventory_status")
                    .table(InventoryItems::Table)
                    .col(InventoryItems::Status)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_inventory_location")
                    .table(InventoryItems::Table)
                    .col(InventoryItems::LocationId)
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(InventoryItems::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum InventoryItems {
    Table,
    Id,
    ProductId,
    SupplierId,
    PurchaseOrderId,
    LocationId,
    BatchNumber,
    ExpiryDate,
    ReceivedDate,
    CostPerUnit,
    QuantityReceived,
    QuantityRemaining,
    Status,
    Notes,
    CreatedAt,
    UpdatedAt,
    CreatedBy,
}

#[derive(DeriveIden)]
enum Products {
    Table,
    Id,
}

#[derive(DeriveIden)]
enum Suppliers {
    Table,
    Id,
}
