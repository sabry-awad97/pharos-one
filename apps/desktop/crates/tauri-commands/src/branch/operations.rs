use pharos_core::{Id, Result};
use pharos_infrastructure::branch::entities::*;
use pharos_infrastructure::branch::repositories::*;
use pharos_infrastructure::ServiceContainer;
use serde::{Deserialize, Serialize};
use tauri::State;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", content = "payload")]
pub enum BranchOperation {
    // Branch Operations
    GetAllBranches,
    GetBranchById(Id),
    GetBranchByCode(String),
    GetActiveBranches,
    GetHeadquarters,

    // Customer Branch Operations
    GetCustomerBranches(Id),
    GetPrimaryBranch(Id),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum BranchResponse {
    Branches(Vec<BranchModel>),
    Branch(Option<BranchModel>),
    CustomerBranches(Vec<CustomerBranchModel>),
    CustomerBranch(Option<CustomerBranchModel>),
}

#[tauri::command]
pub async fn branch(
    container: State<'_, ServiceContainer>,
    operation: BranchOperation,
) -> Result<BranchResponse> {
    tracing::info!("Branch command called with operation: {:?}", operation);

    let db = container.db();

    let response = match operation {
        BranchOperation::GetAllBranches => {
            let repo = BranchRepository::new(db.clone());
            let result = repo.find_all().await?;
            BranchResponse::Branches(result)
        }
        BranchOperation::GetBranchById(id) => {
            let repo = BranchRepository::new(db.clone());
            let result = repo.find_by_id(&id).await?;
            BranchResponse::Branch(result)
        }
        BranchOperation::GetBranchByCode(code) => {
            let repo = BranchRepository::new(db.clone());
            let result = repo.find_by_code(&code).await?;
            BranchResponse::Branch(result)
        }
        BranchOperation::GetActiveBranches => {
            let repo = BranchRepository::new(db.clone());
            let result = repo.find_active().await?;
            BranchResponse::Branches(result)
        }
        BranchOperation::GetHeadquarters => {
            let repo = BranchRepository::new(db.clone());
            let result = repo.find_headquarters().await?;
            BranchResponse::Branch(result)
        }
        BranchOperation::GetCustomerBranches(customer_id) => {
            let repo = CustomerBranchRepository::new(db.clone());
            let result = repo.find_by_customer(&customer_id).await?;
            BranchResponse::CustomerBranches(result)
        }
        BranchOperation::GetPrimaryBranch(customer_id) => {
            let repo = CustomerBranchRepository::new(db.clone());
            let result = repo.find_primary_branch(&customer_id).await?;
            BranchResponse::CustomerBranch(result)
        }
    };

    tracing::info!("Branch operation successful");
    Ok(response)
}
