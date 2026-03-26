use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Products::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(Products::Id).uuid().not_null().primary_key())
                    .col(ColumnDef::new(Products::Name).string().not_null())
                    .col(
                        ColumnDef::new(Products::Sku)
                            .string()
                            .not_null()
                            .unique_key(),
                    )
                    .col(ColumnDef::new(Products::GenericName).string())
                    .col(ColumnDef::new(Products::ProductTypeId).uuid().not_null())
                    .col(ColumnDef::new(Products::ManufacturerId).uuid())
                    .col(ColumnDef::new(Products::CategoryId).uuid().not_null())
                    .col(ColumnDef::new(Products::Description).text())
                    .col(
                        ColumnDef::new(Products::BasePrice)
                            .decimal_len(10, 2)
                            .not_null(),
                    )
                    .col(ColumnDef::new(Products::UnitOfMeasure).string().not_null())
                    .col(
                        ColumnDef::new(Products::ReorderLevel)
                            .integer()
                            .not_null()
                            .default(0),
                    )
                    .col(
                        ColumnDef::new(Products::RequiresPrescription)
                            .boolean()
                            .not_null()
                            .default(false),
                    )
                    .col(
                        ColumnDef::new(Products::ControlledSubstance)
                            .boolean()
                            .not_null()
                            .default(false),
                    )
                    .col(
                        ColumnDef::new(Products::IsActive)
                            .boolean()
                            .not_null()
                            .default(true),
                    )
                    .col(
                        ColumnDef::new(Products::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(
                        ColumnDef::new(Products::UpdatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(ColumnDef::new(Products::CreatedBy).uuid())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_products_product_type")
                            .from(Products::Table, Products::ProductTypeId)
                            .to(ProductTypes::Table, ProductTypes::Id)
                            .on_delete(ForeignKeyAction::Restrict)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_products_manufacturer")
                            .from(Products::Table, Products::ManufacturerId)
                            .to(Manufacturers::Table, Manufacturers::Id)
                            .on_delete(ForeignKeyAction::SetNull)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_products_category")
                            .from(Products::Table, Products::CategoryId)
                            .to(Categories::Table, Categories::Id)
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
                    .name("idx_products_sku")
                    .table(Products::Table)
                    .col(Products::Sku)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_products_name")
                    .table(Products::Table)
                    .col(Products::Name)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_products_type")
                    .table(Products::Table)
                    .col(Products::ProductTypeId)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_products_manufacturer")
                    .table(Products::Table)
                    .col(Products::ManufacturerId)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_products_category")
                    .table(Products::Table)
                    .col(Products::CategoryId)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_products_active")
                    .table(Products::Table)
                    .col(Products::IsActive)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_products_prescription")
                    .table(Products::Table)
                    .col(Products::RequiresPrescription)
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Products::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Products {
    Table,
    Id,
    Name,
    Sku,
    GenericName,
    ProductTypeId,
    ManufacturerId,
    CategoryId,
    Description,
    BasePrice,
    UnitOfMeasure,
    ReorderLevel,
    RequiresPrescription,
    ControlledSubstance,
    IsActive,
    CreatedAt,
    UpdatedAt,
    CreatedBy,
}

#[derive(DeriveIden)]
enum ProductTypes {
    Table,
    Id,
}

#[derive(DeriveIden)]
enum Manufacturers {
    Table,
    Id,
}

#[derive(DeriveIden)]
enum Categories {
    Table,
    Id,
}
