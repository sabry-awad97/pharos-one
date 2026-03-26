#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
// Deny dead code - unused code is not allowed
#![deny(dead_code)]
// Deny missing documentation - all public items must be documented
#![deny(missing_docs)]

//! Tauri Backend Main Entry Point
//!
//! This binary starts the Tauri desktop application with proper logging configuration.

use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Load environment variables
    if let Err(e) = dotenvy::dotenv() {
        tracing::info!("No .env file found: {}", e);
    }

    pharos_app_lib::run().await;
}
