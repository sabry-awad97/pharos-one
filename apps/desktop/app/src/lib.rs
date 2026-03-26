use pharos_infrastructure::{create_pool, ServiceContainer};
use pharos_tauri_commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    tracing::info!("Starting Pharos application");

    // Get database URL from environment
    let database_url = std::env::var("DATABASE_URL").unwrap_or_else(|_| {
        "postgresql://pharos_one:pharos_one_dev_password@localhost:5432/pharos_one".to_string()
    });

    // Create database connection
    tracing::info!("Connecting to database: {}", database_url);
    let db = create_pool(&database_url)
        .await
        .expect("Failed to create database connection");

    // Run migrations
    tracing::info!("Running database migrations");
    match pharos_migrations::run_migrations(&db).await {
        Ok(_) => tracing::info!("Migrations completed successfully"),
        Err(e) => {
            tracing::error!("Migration failed: {:?}", e);
            panic!("Failed to run migrations: {:?}", e);
        }
    }

    // Initialize service container
    tracing::info!("Initializing service container");
    let container = ServiceContainer::from_db(db);

    tracing::info!("Starting Tauri application");
    tauri::Builder::default()
        .manage(container)
        .invoke_handler(tauri::generate_handler![
            // Unified commands (single entry point per module)
            pharos_tauri_commands::inventory,
            pharos_tauri_commands::branch,
            pharos_tauri_commands::customer,
            pharos_tauri_commands::user,
            pharos_tauri_commands::sales,
            pharos_tauri_commands::transactions,
            pharos_tauri_commands::audit,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
