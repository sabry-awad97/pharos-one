use pharos_core::{Id, Result};
use pharos_infrastructure::customer::entities::*;
use pharos_infrastructure::customer::repositories::*;
use pharos_infrastructure::ServiceContainer;
use serde::{Deserialize, Serialize};
use tauri::State;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", content = "payload")]
pub enum CustomerOperation {
    // Customer Operations
    GetAllCustomers,
    GetCustomerById(Id),
    GetCustomerByEmail(String),
    GetActiveCustomers,

    // Phone Number Operations
    GetPhoneNumbersByCustomer(Id),
    GetPhoneNumbersByStaff(Id),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum CustomerResponse {
    Customers(Vec<CustomerModel>),
    Customer(Option<CustomerModel>),
    PhoneNumbers(Vec<PhoneNumberModel>),
}

#[tauri::command]
pub async fn customer(
    container: State<'_, ServiceContainer>,
    operation: CustomerOperation,
) -> Result<CustomerResponse> {
    tracing::info!("Customer command called with operation: {:?}", operation);

    let db = container.db();

    let response = match operation {
        CustomerOperation::GetAllCustomers => {
            let repo = CustomerRepository::new(db.clone());
            let result = repo.find_all().await?;
            CustomerResponse::Customers(result)
        }
        CustomerOperation::GetCustomerById(id) => {
            let repo = CustomerRepository::new(db.clone());
            let result = repo.find_by_id(&id).await?;
            CustomerResponse::Customer(result)
        }
        CustomerOperation::GetCustomerByEmail(email) => {
            let repo = CustomerRepository::new(db.clone());
            let result = repo.find_by_email(&email).await?;
            CustomerResponse::Customer(result)
        }
        CustomerOperation::GetActiveCustomers => {
            let repo = CustomerRepository::new(db.clone());
            let result = repo.find_active().await?;
            CustomerResponse::Customers(result)
        }
        CustomerOperation::GetPhoneNumbersByCustomer(customer_id) => {
            let repo = PhoneNumberRepository::new(db.clone());
            let result = repo.find_by_customer(&customer_id).await?;
            CustomerResponse::PhoneNumbers(result)
        }
        CustomerOperation::GetPhoneNumbersByStaff(staff_id) => {
            let repo = PhoneNumberRepository::new(db.clone());
            let result = repo.find_by_staff(&staff_id).await?;
            CustomerResponse::PhoneNumbers(result)
        }
    };

    tracing::info!("Customer operation successful");
    Ok(response)
}
