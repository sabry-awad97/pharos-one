use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(StockTransactions::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(StockTransactions::Id)
                            .uuid()
                            .not_null()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(StockTransactions::InventoryItemId)
                            .uuid()
                            .not_null(),
                    )
                    .col(ColumnDef::new(StockTransactions::UserId).uuid().not_null())
                    .col(ColumnDef::new(StockTransactions::OrderId).uuid())
                    .col(
                        ColumnDef::new(StockTransactions::TransactionType)
                            .string()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(StockTransactions::Quantity)
                            .integer()
                            .not_null(),
                    )
                    .col(ColumnDef::new(StockTransactions::Reason).text())
                    .col(
                        ColumnDef::new(StockTransactions::Timestamp)
                            .timestamp_with_time_zone()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(StockTransactions::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(ColumnDef::new(StockTransactions::CreatedBy).uuid())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_stock_transactions_inventory_item")
                            .from(StockTransactions::Table, StockTransactions::InventoryItemId)
                            .to(InventoryItems::Table, InventoryItems::Id)
                            .on_delete(ForeignKeyAction::Restrict)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        // Create indexes
        manager
            .create_index(
                Index::create()
                    .name("idx_transactions_item")
                    .table(StockTransactions::Table)
                    .col(StockTransactions::InventoryItemId)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_transactions_type")
                    .table(StockTransactions::Table)
                    .col(StockTransactions::TransactionType)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_transactions_timestamp")
                    .table(StockTransactions::Table)
                    .col(StockTransactions::Timestamp)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_transactions_user")
                    .table(StockTransactions::Table)
                    .col(StockTransactions::UserId)
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(StockTransactions::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum StockTransactions {
    Table,
    Id,
    InventoryItemId,
    UserId,
    OrderId,
    TransactionType,
    Quantity,
    Reason,
    Timestamp,
    CreatedAt,
    CreatedBy,
}

#[derive(DeriveIden)]
enum InventoryItems {
    Table,
    Id,
}
