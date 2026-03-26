use pharos_core::{Id, Result};
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};

use crate::user::entities::staff_member::{Entity as StaffMemberEntity, Model as StaffMemberModel};

pub struct StaffMemberRepository {
    db: DatabaseConnection,
}

impl StaffMemberRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn find_by_id(&self, id: &Id) -> Result<Option<StaffMemberModel>> {
        Ok(StaffMemberEntity::find_by_id(*id).one(&self.db).await?)
    }

    pub async fn find_by_employee_id(&self, employee_id: &str) -> Result<Option<StaffMemberModel>> {
        use crate::user::entities::staff_member::Column;
        Ok(StaffMemberEntity::find()
            .filter(Column::EmployeeId.eq(employee_id))
            .one(&self.db)
            .await?)
    }

    pub async fn find_by_branch(&self, branch_id: &Id) -> Result<Vec<StaffMemberModel>> {
        use crate::user::entities::staff_member::Column;
        Ok(StaffMemberEntity::find()
            .filter(Column::BranchId.eq(*branch_id))
            .filter(Column::IsActive.eq(true))
            .all(&self.db)
            .await?)
    }
}
