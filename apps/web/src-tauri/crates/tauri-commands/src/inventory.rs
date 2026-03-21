use pharos_application::inventory::{InventoryOperations, InventoryResponse};
use pharos_core::Result;
use pharos_infrastructure::ServiceContainer;
use tauri::State;

#[tauri::command]
pub async fn inventory(
    container: State<'_, ServiceContainer>,
    operation: InventoryOperations,
) -> Result<InventoryResponse> {
    tracing::info!("Inventory command called with operation: {:?}", operation);

    match container.inventory_service().execute(operation).await {
        Ok(response) => {
            tracing::info!("Inventory operation successful: {:?}", response);
            Ok(response)
        }
        Err(e) => {
            tracing::error!("Inventory operation failed: {:?}", e);
            Err(e)
        }
    }
}
