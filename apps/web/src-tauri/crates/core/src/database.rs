use sea_orm::{Database, DatabaseConnection, DbErr};

pub async fn create_connection(
    database_url: &str,
) -> std::result::Result<DatabaseConnection, DbErr> {
    Database::connect(database_url).await
}
