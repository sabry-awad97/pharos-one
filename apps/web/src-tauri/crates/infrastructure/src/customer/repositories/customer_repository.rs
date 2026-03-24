use pharos_core::{Id, Result};
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set};

use crate::customer::entities::customer::{
    ActiveModel, Entity as CustomerEntity, Model as CustomerModel,
};

pub struct CustomerRepository {
    db: DatabaseConnection,
}

impl CustomerRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn find_all(&self) -> Result<Vec<CustomerModel>> {
        Ok(CustomerEntity::find().all(&self.db).await?)
    }

    pub async fn find_by_id(&self, id: &Id) -> Result<Option<CustomerModel>> {
        Ok(CustomerEntity::find_by_id(*id).one(&self.db).await?)
    }

    pub async fn find_by_email(&self, email: &str) -> Result<Option<CustomerModel>> {
        use crate::customer::entities::customer::Column;
        Ok(CustomerEntity::find()
            .filter(Column::Email.eq(email))
            .one(&self.db)
            .await?)
    }

    pub async fn find_active(&self) -> Result<Vec<CustomerModel>> {
        use crate::customer::entities::customer::Column;
        Ok(CustomerEntity::find()
            .filter(Column::IsActive.eq(true))
            .all(&self.db)
            .await?)
    }
}
