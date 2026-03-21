use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Medicines::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Medicines::Id)
                            .uuid()
                            .not_null()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Medicines::Name).string().not_null())
                    .col(ColumnDef::new(Medicines::GenericName).string().not_null())
                    .col(ColumnDef::new(Medicines::UnitPrice).double().not_null())
                    .col(ColumnDef::new(Medicines::Quantity).integer().not_null())
                    .col(
                        ColumnDef::new(Medicines::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(
                        ColumnDef::new(Medicines::UpdatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .to_owned(),
            )
            .await?;

        // Create index on name for search
        manager
            .create_index(
                Index::create()
                    .name("idx_medicines_name")
                    .table(Medicines::Table)
                    .col(Medicines::Name)
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Medicines::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Medicines {
    Table,
    Id,
    Name,
    GenericName,
    UnitPrice,
    Quantity,
    CreatedAt,
    UpdatedAt,
}
