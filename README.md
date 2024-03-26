# S3-document-service

A model pre-signed upload/download document service with events and metadata

## Architecture

![image](ArchDiagram.png)

### To upload a file

1.  User requests an upload link from API Gateway
2.  User receives pre-signed upload link (good for 10 minutes)
3.  User uploads file directly to S3
4.  S3 raises a "File Created" event
5.  Lambda handles the S3 event and writes metadata to DynamoDB

### To download a file

1.  User requests file information from API Gateway
2.  User receives the file metadata which includes a pre-signed download link (good for 7 days)
3.  User downloads file directly from S3

## Database

DynamoDB

### Access Patterns

1. Get Document by `id`
2. Get All Documents by Company (tenant)

### Keys

PartitionKey: `companyId`
SortKey: `id` (ulid)

## File Storage

S3

### Keys

`[companyId]/[documentId]`
