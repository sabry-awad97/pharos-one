use pharos_core::{DateTime, Id, Result};
use pharos_infrastructure::audit::entities::*;
use pharos_infrastructure::audit::repositories::*;
use pharos_infrastructure::ServiceContainer;
use serde::{Deserialize, Serialize};
use tauri::State;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", content = "payload")]
pub enum AuditOperation {
    GetAuditLogsByUser(Id),
    GetAuditLogsByResource {
        resource: String,
        resource_id: String,
    },
    GetAuditLogsByDateRange {
        start: DateTime,
        end: DateTime,
    },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum AuditResponse {
    AuditLogs(Vec<AuditLogModel>),
}

#[tauri::command]
pub async fn audit(
    container: State<'_, ServiceContainer>,
    operation: AuditOperation,
) -> Result<AuditResponse> {
    tracing::info!("Audit command called with operation: {:?}", operation);

    let db = container.db();

    let response = match operation {
        AuditOperation::GetAuditLogsByUser(user_id) => {
            let repo = AuditLogRepository::new(db.clone());
            let result = repo.find_by_user(&user_id).await?;
            AuditResponse::AuditLogs(result)
        }
        AuditOperation::GetAuditLogsByResource {
            resource,
            resource_id,
        } => {
            let repo = AuditLogRepository::new(db.clone());
            let result = repo.find_by_resource(&resource, &resource_id).await?;
            AuditResponse::AuditLogs(result)
        }
        AuditOperation::GetAuditLogsByDateRange { start, end } => {
            let repo = AuditLogRepository::new(db.clone());
            let result = repo.find_by_date_range(start, end).await?;
            AuditResponse::AuditLogs(result)
        }
    };

    tracing::info!("Audit operation successful");
    Ok(response)
}
