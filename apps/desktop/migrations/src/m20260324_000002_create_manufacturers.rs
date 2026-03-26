use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Manufacturers::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Manufacturers::Id)
                            .uuid()
                            .not_null()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(Manufacturers::Name)
                            .string()
                            .not_null()
                            .unique_key(),
                    )
                    .col(ColumnDef::new(Manufacturers::ShortName).string())
                    .col(ColumnDef::new(Manufacturers::Country).string())
                    .col(ColumnDef::new(Manufacturers::Phone).string())
                    .col(ColumnDef::new(Manufacturers::Email).string())
                    .col(ColumnDef::new(Manufacturers::Website).string())
                    .col(ColumnDef::new(Manufacturers::Notes).text())
                    .col(
                        ColumnDef::new(Manufacturers::IsActive)
                            .boolean()
                            .not_null()
                            .default(true),
                    )
                    .col(
                        ColumnDef::new(Manufacturers::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(
                        ColumnDef::new(Manufacturers::UpdatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(ColumnDef::new(Manufacturers::CreatedBy).uuid())
                    .to_owned(),
            )
            .await?;

        // Create indexes
        manager
            .create_index(
                Index::create()
                    .name("idx_manufacturers_name")
                    .table(Manufacturers::Table)
                    .col(Manufacturers::Name)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_manufacturers_active")
                    .table(Manufacturers::Table)
                    .col(Manufacturers::IsActive)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_manufacturers_country")
                    .table(Manufacturers::Table)
                    .col(Manufacturers::Country)
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Manufacturers::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Manufacturers {
    Table,
    Id,
    Name,
    ShortName,
    Country,
    Phone,
    Email,
    Website,
    Notes,
    IsActive,
    CreatedAt,
    UpdatedAt,
    CreatedBy,
}
