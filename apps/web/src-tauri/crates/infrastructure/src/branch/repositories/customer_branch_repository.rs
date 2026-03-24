use pharos_core::{Id, Result};
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set};

use crate::branch::entities::customer_branch::{
    ActiveModel, Entity as CustomerBranchEntity, Model as CustomerBranchModel,
};

pub struct CustomerBranchRepository {
    db: DatabaseConnection,
}

impl CustomerBranchRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn find_by_customer(&self, customer_id: &Id) -> Result<Vec<CustomerBranchModel>> {
        use crate::branch::entities::customer_branch::Column;
        Ok(CustomerBranchEntity::find()
            .filter(Column::CustomerId.eq(*customer_id))
            .all(&self.db)
            .await?)
    }

    pub async fn find_primary_branch(
        &self,
        customer_id: &Id,
    ) -> Result<Option<CustomerBranchModel>> {
        use crate::branch::entities::customer_branch::Column;
        Ok(CustomerBranchEntity::find()
            .filter(Column::CustomerId.eq(*customer_id))
            .filter(Column::IsPrimary.eq(true))
            .one(&self.db)
            .await?)
    }
}
