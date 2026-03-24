pub mod customer;
pub mod phone_number;

pub use customer::{Entity as CustomerEntity, Model as CustomerModel};
pub use phone_number::{Entity as PhoneNumberEntity, Model as PhoneNumberModel, PhoneType};
