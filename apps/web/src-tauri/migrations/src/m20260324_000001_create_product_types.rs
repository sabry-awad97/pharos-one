use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(ProductTypes::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(ProductTypes::Id)
                            .uuid()
                            .not_null()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(ProductTypes::Name).string().not_null())
                    .col(
                        ColumnDef::new(ProductTypes::Code)
                            .string()
                            .not_null()
                            .unique_key(),
                    )
                    .col(ColumnDef::new(ProductTypes::Description).string())
                    .col(
                        ColumnDef::new(ProductTypes::RequiresPrescription)
                            .boolean()
                            .not_null()
                            .default(false),
                    )
                    .col(
                        ColumnDef::new(ProductTypes::RequiresBatchTracking)
                            .boolean()
                            .not_null()
                            .default(true),
                    )
                    .col(
                        ColumnDef::new(ProductTypes::RequiresExpiryDate)
                            .boolean()
                            .not_null()
                            .default(true),
                    )
                    .col(
                        ColumnDef::new(ProductTypes::RequiresTemperatureControl)
                            .boolean()
                            .not_null()
                            .default(false),
                    )
                    .col(ColumnDef::new(ProductTypes::RegulatoryCategory).string())
                    .col(
                        ColumnDef::new(ProductTypes::DisplayOrder)
                            .integer()
                            .not_null()
                            .default(0),
                    )
                    .col(
                        ColumnDef::new(ProductTypes::IsActive)
                            .boolean()
                            .not_null()
                            .default(true),
                    )
                    .col(
                        ColumnDef::new(ProductTypes::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(
                        ColumnDef::new(ProductTypes::UpdatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(ColumnDef::new(ProductTypes::CreatedBy).uuid())
                    .to_owned(),
            )
            .await?;

        // Create indexes
        manager
            .create_index(
                Index::create()
                    .name("idx_product_types_code")
                    .table(ProductTypes::Table)
                    .col(ProductTypes::Code)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_product_types_active")
                    .table(ProductTypes::Table)
                    .col(ProductTypes::IsActive)
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(ProductTypes::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum ProductTypes {
    Table,
    Id,
    Name,
    Code,
    Description,
    RequiresPrescription,
    RequiresBatchTracking,
    RequiresExpiryDate,
    RequiresTemperatureControl,
    RegulatoryCategory,
    DisplayOrder,
    IsActive,
    CreatedAt,
    UpdatedAt,
    CreatedBy,
}
