use pharos_core::{Id, Result};
use pharos_infrastructure::user::entities::*;
use pharos_infrastructure::user::repositories::*;
use pharos_infrastructure::ServiceContainer;
use serde::{Deserialize, Serialize};
use tauri::State;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", content = "payload")]
pub enum UserOperation {
    // User Operations
    GetUserById(Id),
    GetUserByUsername(String),
    GetActiveUsers,
    
    // Staff Member Operations
    GetStaffMemberById(Id),
    GetStaffMemberByEmployeeId(String),
    GetStaffMembersByBranch(Id),
    
    // Role Operations
    GetAllRoles,
    GetRoleByName(String),
    
    // Permission Operations
    GetAllPermissions,
    
    // Session Operations
    GetSessionByToken(String),
    GetActiveSessionsByUser(Id),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum UserResponse {
    Users(Vec<UserModel>),
    User(Option<UserModel>),
    StaffMembers(Vec<StaffMemberModel>),
    StaffMember(Option<StaffMemberModel>),
    Roles(Vec<RoleModel>),
    Role(Option<RoleModel>),
    Permissions(Vec<PermissionModel>),
    Sessions(Vec<SessionModel>),
    Session(Option<SessionModel>),
}

#[tauri::command]
pub async fn user(
    container: State<'_, ServiceContainer>,
    operation: UserOperation,
) -> Result<UserResponse> {
    tracing::info!("User command called with operation: {:?}", operation);

    let db = container.db();

    let response = match operation {
        UserOperation::GetUserById(id) => {
            let repo = UserRepository::new(db.clone());
            let result = repo.find_by_id(&id).await?;
            UserResponse::User(result)
        }
        UserOperation::GetUserByUsername(username) => {
            let repo = UserRepository::new(db.clone());
            let result = repo.find_by_username(&username).await?;
            UserResponse::User(result)
        }
        UserOperation::GetActiveUsers => {
            let repo = UserRepository::new(db.clone());
            let result = repo.find_active().await?;
            UserResponse::Users(result)
        }
        UserOperation::GetStaffMemberById(id) => {
            let repo = StaffMemberRepository::new(db.clone());
            let result = repo.find_by_id(&id).await?;
            UserResponse::StaffMember(result)
        }
        UserOperation::GetStaffMemberByEmployeeId(employee_id) => {
            let repo = StaffMemberRepository::new(db.clone());
            let result = repo.find_by_employee_id(&employee_id).await?;
            UserResponse::StaffMember(result)
        }
        UserOperation::GetStaffMembersByBranch(branch_id) => {
            let repo = StaffMemberRepository::new(db.clone());
            let result = repo.find_by_branch(&branch_id).await?;
            UserResponse::StaffMembers(result)
        }
        UserOperation::GetAllRoles => {
            let repo = RoleRepository::new(db.clone());
            let result = repo.find_all().await?;
            UserResponse::Roles(result)
        }
        UserOperation::GetRoleByName(name) => {
            let repo = RoleRepository::new(db.clone());
            let result = repo.find_by_name(&name).await?;
            UserResponse::Role(result)
        }
        UserOperation::GetAllPermissions => {
            let repo = PermissionRepository::new(db.clone());
            let result = repo.find_all().await?;
            UserResponse::Permissions(result)
        }
        UserOperation::GetSessionByToken(token) => {
            let repo = SessionRepository::new(db.clone());
            let result = repo.find_by_token(&token).await?;
            UserResponse::Session(result)
        }
        UserOperation::GetActiveSessionsByUser(user_id) => {
            let repo = SessionRepository::new(db.clone());
            let result = repo.find_active_by_user(&user_id).await?;
            UserResponse::Sessions(result)
        }
    };

    tracing::info!("User operation successful");
    Ok(response)
}
