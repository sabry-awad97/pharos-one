use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Suppliers::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Suppliers::Id)
                            .uuid()
                            .not_null()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(Suppliers::Name)
                            .string()
                            .not_null()
                            .unique_key(),
                    )
                    .col(ColumnDef::new(Suppliers::ContactPerson).string())
                    .col(ColumnDef::new(Suppliers::Email).string())
                    .col(ColumnDef::new(Suppliers::Phone).string())
                    .col(ColumnDef::new(Suppliers::Address).text())
                    .col(
                        ColumnDef::new(Suppliers::IsActive)
                            .boolean()
                            .not_null()
                            .default(true),
                    )
                    .col(
                        ColumnDef::new(Suppliers::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(
                        ColumnDef::new(Suppliers::UpdatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(ColumnDef::new(Suppliers::CreatedBy).uuid())
                    .to_owned(),
            )
            .await?;

        // Create indexes
        manager
            .create_index(
                Index::create()
                    .name("idx_suppliers_name")
                    .table(Suppliers::Table)
                    .col(Suppliers::Name)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_suppliers_active")
                    .table(Suppliers::Table)
                    .col(Suppliers::IsActive)
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Suppliers::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Suppliers {
    Table,
    Id,
    Name,
    ContactPerson,
    Email,
    Phone,
    Address,
    IsActive,
    CreatedAt,
    UpdatedAt,
    CreatedBy,
}
