# s3-document-service
A model pre-signed upload/download document service with events and metadata

## Database
### Access Patterns
1. Get Document by `id`
2. Get All Documents by Company (tenant)
3. Get All Documents by User who uploaded (and Company)
### Keys
PartitionKey: `companyId`
SortKey: `id` (ulid)
GSI1PK: `uploadedBy`
GSI1SK: `id` (ulid)