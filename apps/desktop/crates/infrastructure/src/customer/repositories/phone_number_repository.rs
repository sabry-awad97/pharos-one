use pharos_core::{Id, Result};
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

use crate::customer::entities::phone_number::{
    Entity as PhoneNumberEntity, Model as PhoneNumberModel,
};

pub struct PhoneNumberRepository {
    db: DatabaseConnection,
}

impl PhoneNumberRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn find_by_customer(&self, customer_id: &Id) -> Result<Vec<PhoneNumberModel>> {
        use crate::customer::entities::phone_number::Column;
        Ok(PhoneNumberEntity::find()
            .filter(Column::CustomerId.eq(*customer_id))
            .all(&self.db)
            .await?)
    }

    pub async fn find_by_staff(&self, staff_id: &Id) -> Result<Vec<PhoneNumberModel>> {
        use crate::customer::entities::phone_number::Column;
        Ok(PhoneNumberEntity::find()
            .filter(Column::StaffMemberId.eq(*staff_id))
            .all(&self.db)
            .await?)
    }
}
