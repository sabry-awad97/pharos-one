use pharos_core::{Id, Result};
use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set};

use crate::inventory::entities::company::{
    ActiveModel, Entity as CompanyEntity, Model as CompanyModel,
};

pub struct CompanyRepository {
    db: DatabaseConnection,
}

impl CompanyRepository {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }

    pub async fn find_all(&self) -> Result<Vec<CompanyModel>> {
        Ok(CompanyEntity::find().all(&self.db).await?)
    }

    pub async fn find_by_id(&self, id: &Id) -> Result<Option<CompanyModel>> {
        Ok(CompanyEntity::find_by_id(*id).one(&self.db).await?)
    }

    pub async fn find_by_name(&self, name: &str) -> Result<Option<CompanyModel>> {
        use crate::inventory::entities::company::Column;
        Ok(CompanyEntity::find()
            .filter(Column::Name.eq(name))
            .one(&self.db)
            .await?)
    }

    pub async fn find_by_code(&self, code: &str) -> Result<Option<CompanyModel>> {
        use crate::inventory::entities::company::Column;
        Ok(CompanyEntity::find()
            .filter(Column::Code.eq(code))
            .one(&self.db)
            .await?)
    }

    pub async fn find_active(&self) -> Result<Vec<CompanyModel>> {
        use crate::inventory::entities::company::Column;
        Ok(CompanyEntity::find()
            .filter(Column::IsActive.eq(true))
            .all(&self.db)
            .await?)
    }

    pub async fn create(&self, model: CompanyModel) -> Result<CompanyModel> {
        let active_model = ActiveModel {
            id: Set(model.id),
            name: Set(model.name),
            code: Set(model.code),
            country: Set(model.country),
            website: Set(model.website),
            email: Set(model.email),
            phone: Set(model.phone),
            description: Set(model.description),
            is_active: Set(model.is_active),
            created_at: Set(model.created_at),
            updated_at: Set(model.updated_at),
        };
        Ok(active_model.insert(&self.db).await?)
    }

    pub async fn update(&self, model: CompanyModel) -> Result<CompanyModel> {
        let active_model = ActiveModel {
            id: Set(model.id),
            name: Set(model.name),
            code: Set(model.code),
            country: Set(model.country),
            website: Set(model.website),
            email: Set(model.email),
            phone: Set(model.phone),
            description: Set(model.description),
            is_active: Set(model.is_active),
            created_at: Set(model.created_at),
            updated_at: Set(model.updated_at),
        };
        Ok(active_model.update(&self.db).await?)
    }

    pub async fn delete(&self, id: &Id) -> Result<()> {
        CompanyEntity::delete_by_id(*id).exec(&self.db).await?;
        Ok(())
    }
}
