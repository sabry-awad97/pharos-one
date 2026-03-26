// Inventory entities based on Prisma schema

pub mod branch_inventory;
pub mod category;
pub mod company;
pub mod location;
pub mod product;
pub mod product_batch;
pub mod product_unit_config;
pub mod unit;
pub mod unit_conversion;

// Re-export for convenience
pub use branch_inventory::{Entity as BranchInventoryEntity, Model as BranchInventoryModel};
pub use category::{Entity as CategoryEntity, Model as CategoryModel};
pub use company::{Entity as CompanyEntity, Model as CompanyModel};
pub use location::{Entity as LocationEntity, LocationType, Model as LocationModel};
pub use product::{Entity as ProductEntity, Model as ProductModel};
pub use product_batch::{Entity as ProductBatchEntity, Model as ProductBatchModel};
pub use product_unit_config::{Entity as ProductUnitConfigEntity, Model as ProductUnitConfigModel};
pub use unit::{Entity as UnitEntity, Model as UnitModel};
pub use unit_conversion::{Entity as UnitConversionEntity, Model as UnitConversionModel};
