use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("Validation error: {0}")]
    Validation(String),

    #[error("Not found: {0}")]
    NotFound(String),

    #[error("Database error: {0}")]
    Database(String),

    #[error("Permission denied")]
    PermissionDenied,

    #[error("Authentication failed")]
    AuthenticationFailed,
}

// Implement Serialize for Tauri
impl serde::Serialize for AppError {
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(&self.to_string())
    }
}
