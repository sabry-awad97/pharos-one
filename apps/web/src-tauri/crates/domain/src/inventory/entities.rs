use derive_getters::Getters;
use pharos_core::{DateTime, Id};
use serde::{Deserialize, Serialize};
use typed_builder::TypedBuilder;

/// Domain model - pure business logic
#[derive(Clone, Debug, Serialize, Deserialize, TypedBuilder, Getters)]
#[serde(rename_all = "snake_case")]
pub struct Medicine {
    id: Id,
    name: String,
    generic_name: String,
    unit_price: f64,
    quantity: i32,
    created_at: DateTime,
    updated_at: DateTime,
}

impl Medicine {
    pub fn is_low_stock(&self, threshold: i32) -> bool {
        self.quantity < threshold
    }

    pub fn total_value(&self) -> f64 {
        self.quantity as f64 * self.unit_price
    }
}
