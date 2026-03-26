use chrono::{DateTime as ChronoDateTime, Utc};
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};
use std::fmt;

/// Professional DateTime type using chrono with timezone awareness
///
/// Benefits:
/// - Timezone-aware: Always stored as UTC, converted for display
/// - Type-safe: Prevents mixing naive and aware datetimes
/// - Serializable: Works with serde and SeaORM
/// - Comparable: Natural ordering by time
#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
#[serde(transparent)]
pub struct DateTime(ChronoDateTime<Utc>);

impl DateTime {
    /// Get the current UTC time
    pub fn now() -> Self {
        Self(Utc::now())
    }

    /// Create from a chrono DateTime<Utc>
    pub fn from_chrono(dt: ChronoDateTime<Utc>) -> Self {
        Self(dt)
    }

    /// Parse from RFC3339 string (ISO 8601)
    pub fn parse_rfc3339(s: &str) -> Result<Self, chrono::ParseError> {
        Ok(Self(
            ChronoDateTime::parse_from_rfc3339(s)?.with_timezone(&Utc),
        ))
    }

    /// Get the inner chrono DateTime
    pub fn as_chrono(&self) -> &ChronoDateTime<Utc> {
        &self.0
    }

    /// Convert to chrono DateTime
    pub fn into_chrono(self) -> ChronoDateTime<Utc> {
        self.0
    }

    /// Format as RFC3339 string (ISO 8601)
    pub fn to_rfc3339(&self) -> String {
        self.0.to_rfc3339()
    }

    /// Get Unix timestamp in seconds
    pub fn timestamp(&self) -> i64 {
        self.0.timestamp()
    }

    /// Get Unix timestamp in milliseconds
    pub fn timestamp_millis(&self) -> i64 {
        self.0.timestamp_millis()
    }

    /// Check if this datetime is before another
    pub fn is_before(&self, other: &Self) -> bool {
        self.0 < other.0
    }

    /// Check if this datetime is after another
    pub fn is_after(&self, other: &Self) -> bool {
        self.0 > other.0
    }
}

impl Default for DateTime {
    fn default() -> Self {
        Self::now()
    }
}

impl fmt::Display for DateTime {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.0.to_rfc3339())
    }
}

impl From<ChronoDateTime<Utc>> for DateTime {
    fn from(dt: ChronoDateTime<Utc>) -> Self {
        Self(dt)
    }
}

impl From<DateTime> for ChronoDateTime<Utc> {
    fn from(dt: DateTime) -> Self {
        dt.0
    }
}

impl From<DateTimeWithTimeZone> for DateTime {
    fn from(dt: DateTimeWithTimeZone) -> Self {
        Self(dt.into())
    }
}

impl From<DateTime> for DateTimeWithTimeZone {
    fn from(dt: DateTime) -> Self {
        dt.0.into()
    }
}

impl From<DateTime> for sea_orm::Value {
    fn from(dt: DateTime) -> Self {
        sea_orm::Value::ChronoDateTimeUtc(Some(Box::new(dt.0)))
    }
}

impl std::str::FromStr for DateTime {
    type Err = chrono::ParseError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Self::parse_rfc3339(s)
    }
}

// Implement TryFromU64 for SeaORM compatibility
impl sea_orm::TryFromU64 for DateTime {
    fn try_from_u64(_n: u64) -> Result<Self, sea_orm::DbErr> {
        Err(sea_orm::DbErr::ConvertFromU64(
            "DateTime cannot be converted from u64",
        ))
    }
}

// Implement TryGetable for SeaORM query results
impl sea_orm::TryGetable for DateTime {
    fn try_get_by<I: sea_orm::ColIdx>(
        res: &sea_orm::QueryResult,
        idx: I,
    ) -> Result<Self, sea_orm::TryGetError> {
        let dt: DateTimeWithTimeZone = res.try_get_by(idx)?;
        Ok(Self::from(dt))
    }
}

// Implement sea_query::ValueType for SeaORM
impl sea_orm::sea_query::ValueType for DateTime {
    fn try_from(v: sea_orm::Value) -> Result<Self, sea_orm::sea_query::ValueTypeErr> {
        match v {
            sea_orm::Value::ChronoDateTimeUtc(Some(dt)) => Ok(Self(*dt)),
            _ => Err(sea_orm::sea_query::ValueTypeErr),
        }
    }

    fn type_name() -> String {
        "DateTime".to_string()
    }

    fn array_type() -> sea_orm::sea_query::ArrayType {
        sea_orm::sea_query::ArrayType::ChronoDateTimeUtc
    }

    fn column_type() -> sea_orm::sea_query::ColumnType {
        sea_orm::sea_query::ColumnType::TimestampWithTimeZone
    }
}

impl sea_orm::sea_query::Nullable for DateTime {
    fn null() -> sea_orm::Value {
        sea_orm::Value::ChronoDateTimeUtc(None)
    }
}
