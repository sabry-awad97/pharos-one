use pharos_core::{DateTime, Id, Result};
use pharos_infrastructure::sales::entities::*;
use pharos_infrastructure::sales::repositories::*;
use pharos_infrastructure::ServiceContainer;
use serde::{Deserialize, Serialize};
use tauri::State;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", content = "payload")]
pub enum SalesOperation {
    // Sale Transaction Operations
    GetSaleTransactionsByBranch(Id),
    GetSaleTransactionByReceiptNumber(String),
    GetSaleTransactionsByDateRange {
        branch_id: Id,
        start: DateTime,
        end: DateTime,
    },

    // Register Operations
    GetRegistersByBranch(Id),
    GetRegisterByCode(String),

    // Payment Operations
    GetPaymentsBySaleTransaction(Id),
    GetPaymentsByHeldTransaction(Id),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum SalesResponse {
    SaleTransactions(Vec<SaleTransactionModel>),
    SaleTransaction(Option<SaleTransactionModel>),
    Registers(Vec<RegisterModel>),
    Register(Option<RegisterModel>),
    Payments(Vec<PaymentModel>),
}

#[tauri::command]
pub async fn sales(
    container: State<'_, ServiceContainer>,
    operation: SalesOperation,
) -> Result<SalesResponse> {
    tracing::info!("Sales command called with operation: {:?}", operation);

    let db = container.db();

    let response = match operation {
        SalesOperation::GetSaleTransactionsByBranch(branch_id) => {
            let repo = SaleTransactionRepository::new(db.clone());
            let result = repo.find_by_branch(&branch_id).await?;
            SalesResponse::SaleTransactions(result)
        }
        SalesOperation::GetSaleTransactionByReceiptNumber(receipt_number) => {
            let repo = SaleTransactionRepository::new(db.clone());
            let result = repo.find_by_receipt_number(&receipt_number).await?;
            SalesResponse::SaleTransaction(result)
        }
        SalesOperation::GetSaleTransactionsByDateRange {
            branch_id,
            start,
            end,
        } => {
            let repo = SaleTransactionRepository::new(db.clone());
            let result = repo.find_by_date_range(&branch_id, start, end).await?;
            SalesResponse::SaleTransactions(result)
        }
        SalesOperation::GetRegistersByBranch(branch_id) => {
            let repo = RegisterRepository::new(db.clone());
            let result = repo.find_by_branch(&branch_id).await?;
            SalesResponse::Registers(result)
        }
        SalesOperation::GetRegisterByCode(code) => {
            let repo = RegisterRepository::new(db.clone());
            let result = repo.find_by_code(&code).await?;
            SalesResponse::Register(result)
        }
        SalesOperation::GetPaymentsBySaleTransaction(sale_transaction_id) => {
            let repo = PaymentRepository::new(db.clone());
            let result = repo.find_by_sale_transaction(&sale_transaction_id).await?;
            SalesResponse::Payments(result)
        }
        SalesOperation::GetPaymentsByHeldTransaction(held_transaction_id) => {
            let repo = PaymentRepository::new(db.clone());
            let result = repo.find_by_held_transaction(&held_transaction_id).await?;
            SalesResponse::Payments(result)
        }
    };

    tracing::info!("Sales operation successful");
    Ok(response)
}
