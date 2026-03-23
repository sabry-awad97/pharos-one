use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Barcodes::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(Barcodes::Id).uuid().not_null().primary_key())
                    .col(ColumnDef::new(Barcodes::InventoryItemId).uuid().not_null())
                    .col(
                        ColumnDef::new(Barcodes::Barcode)
                            .string()
                            .not_null()
                            .unique_key(),
                    )
                    .col(ColumnDef::new(Barcodes::BarcodeType).string())
                    .col(
                        ColumnDef::new(Barcodes::IsPrimary)
                            .boolean()
                            .not_null()
                            .default(false),
                    )
                    .col(ColumnDef::new(Barcodes::Description).text())
                    .col(
                        ColumnDef::new(Barcodes::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(ColumnDef::new(Barcodes::CreatedBy).uuid())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_barcodes_inventory_item")
                            .from(Barcodes::Table, Barcodes::InventoryItemId)
                            .to(InventoryItems::Table, InventoryItems::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        // Create indexes
        manager
            .create_index(
                Index::create()
                    .name("idx_barcodes_inventory_item")
                    .table(Barcodes::Table)
                    .col(Barcodes::InventoryItemId)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_barcodes_barcode")
                    .table(Barcodes::Table)
                    .col(Barcodes::Barcode)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_barcodes_primary")
                    .table(Barcodes::Table)
                    .col(Barcodes::IsPrimary)
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Barcodes::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Barcodes {
    Table,
    Id,
    InventoryItemId,
    Barcode,
    BarcodeType,
    IsPrimary,
    Description,
    CreatedAt,
    CreatedBy,
}

#[derive(DeriveIden)]
enum InventoryItems {
    Table,
    Id,
}
