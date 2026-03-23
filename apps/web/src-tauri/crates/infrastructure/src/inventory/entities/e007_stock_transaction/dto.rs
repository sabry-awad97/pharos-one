use pharos_core::{DateTime, Id};
use serde::{Deserialize, Serialize};

/// Data Transfer Object for Stock Transaction
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct StockTransactionDto {
    pub id: Id,
    pub inventory_item_id: Id,
    pub transaction_type: String,
    pub quantity: i32,
    pub order_id: Option<Id>,
    pub user_id: Id,
    pub reason: Option<String>,
    pub timestamp: DateTime,
    pub created_at: DateTime,
    pub created_by: Option<Id>,
}

/// Create request for new stock transaction
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct CreateStockTransactionDto {
    pub inventory_item_id: Id,
    pub transaction_type: String,
    pub quantity: i32,
    pub order_id: Option<Id>,
    pub user_id: Id,
    pub reason: Option<String>,
    pub created_by: Option<Id>,
}

/// Query filters for stock transactions
#[derive(Clone, Debug, Default, PartialEq, Serialize, Deserialize)]
pub struct StockTransactionFilters {
    pub inventory_item_id: Option<Id>,
    pub transaction_type: Option<String>,
    pub user_id: Option<Id>,
    pub timestamp_after: Option<String>,  // ISO 8601 string
    pub timestamp_before: Option<String>, // ISO 8601 string
}
