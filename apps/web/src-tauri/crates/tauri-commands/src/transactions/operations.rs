use pharos_core::{Id, Result};
use pharos_infrastructure::transactions::entities::*;
use pharos_infrastructure::transactions::repositories::*;
use pharos_infrastructure::ServiceContainer;
use serde::{Deserialize, Serialize};
use tauri::State;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", content = "payload")]
pub enum TransactionOperation {
    // Held Transaction Operations
    GetHeldTransactionsByBranch(Id),
    GetHeldTransactionByHoldNumber(String),

    // Order Line Item Operations
    GetOrderLineItemsByHeldTransaction(Id),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum TransactionResponse {
    HeldTransactions(Vec<HeldTransactionModel>),
    HeldTransaction(Option<HeldTransactionModel>),
    OrderLineItems(Vec<OrderLineItemModel>),
}

#[tauri::command]
pub async fn transactions(
    container: State<'_, ServiceContainer>,
    operation: TransactionOperation,
) -> Result<TransactionResponse> {
    tracing::info!("Transaction command called with operation: {:?}", operation);

    let db = container.db();

    let response = match operation {
        TransactionOperation::GetHeldTransactionsByBranch(branch_id) => {
            let repo = HeldTransactionRepository::new(db.clone());
            let result = repo.find_by_branch(&branch_id).await?;
            TransactionResponse::HeldTransactions(result)
        }
        TransactionOperation::GetHeldTransactionByHoldNumber(hold_number) => {
            let repo = HeldTransactionRepository::new(db.clone());
            let result = repo.find_by_hold_number(&hold_number).await?;
            TransactionResponse::HeldTransaction(result)
        }
        TransactionOperation::GetOrderLineItemsByHeldTransaction(held_transaction_id) => {
            let repo = OrderLineItemRepository::new(db.clone());
            let result = repo.find_by_held_transaction(&held_transaction_id).await?;
            TransactionResponse::OrderLineItems(result)
        }
    };

    tracing::info!("Transaction operation successful");
    Ok(response)
}
