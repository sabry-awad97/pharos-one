use pharos_core::Id;
use pharos_domain::Medicine;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type", content = "data")]
pub enum InventoryOperations {
    GetAll,
    GetById {
        id: Id,
    },
    Create {
        name: String,
        generic_name: String,
        unit_price: f64,
        quantity: i32,
    },
    UpdateStock {
        id: Id,
        quantity_change: i32,
    },
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type", content = "data")]
pub enum InventoryResponse {
    Medicines(Vec<Medicine>),
    Medicine(Option<Medicine>),
    Success { message: String },
}
