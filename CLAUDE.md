# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm t                    # unit tests (*.unit.test.js)
npm run test:int         # integration tests against real AWS (*.int.test.js)
npm run test:e2e         # end-to-end tests against deployed stack (*.e2e.test.js)
npm run lint             # ESLint
npx jest path/to/test.js # run a single test file
npx sls deploy           # deploy to AWS (requires AWS credentials)
```

Integration tests require live AWS credentials and hit real DynamoDB/S3. E2e tests additionally require a deployed CloudFormation stack — `jest.setup.e2e.js` reads the stack outputs to resolve `API_URL`.

## Architecture

Four Lambda handlers sit behind HTTP API Gateway (and one behind EventBridge):

| Handler                   | Trigger                         | What it does                                                                 |
| ------------------------- | ------------------------------- | ---------------------------------------------------------------------------- |
| `createPreSignedPost`     | `POST /pre-signed-post`         | Generates a pre-signed S3 POST URL for direct client upload                  |
| `saveDocumentMetadata`    | EventBridge (S3 Object Created) | Reads S3 object HEAD metadata and writes a record to DynamoDB                |
| `getDocumentMetadataById` | `GET /document-metadata/{id}`   | Fetches one record from DynamoDB and appends a 7-day pre-signed download URL |
| `listDocumentMetadata`    | `GET /document-metadata`        | Queries DynamoDB by company                                                  |

**Upload flow:** client calls `createPreSignedPost` → uploads directly to S3 → S3 fires an EventBridge "Object Created" event → `saveDocumentMetadata` Lambda runs and writes metadata to DynamoDB. The handler reads S3 object HEAD to pull metadata (companyId, fileName, fileId) that was embedded in the upload as `X-Amz-Meta-*` headers.

**Multi-tenancy:** all operations are scoped by `companyId`, passed as the `x-company-id` request header. DynamoDB uses `companyId` as the partition key and `id` (ULID) as the sort key. S3 object keys follow the pattern `{companyId}/{documentId}`.

**Shared infrastructure modules:**

- `src/documentClient.js` — lazy singleton DynamoDB Document Client
- `src/s3Client.js` — lazy singleton S3 Client
- `src/documentMetadataRepository.js` — all DynamoDB access (CRUD for document metadata)
- `src/s3Utils.js` — pre-signed post creation, HEAD object fetch, pre-signed download URL generation

All handlers use [Middy](https://middy.js.org/) middleware. HTTP handlers use `@middy/http-event-normalizer` and `@middy/http-json-body-parser`; `@middy/http-error-handler` is used where `http-errors` `NotFound` exceptions can be thrown.

## Testing conventions

Test IDs are prefixed with `TEST_` (e.g. `TEST_${ulid()}`) so integration test data is easily identifiable and scoped away from real data. `DatabaseTestHelpers` and `S3TestHelpers` track created resources and clean them up in `afterAll`.

Integration tests import and call production modules directly (e.g. `DocumentMetadataRepository`) against the real AWS backend — no mocks. E2e tests call the deployed HTTP API via axios.

## ESLint rules to note

- `max-params: warn 1` — functions should take a single object parameter, not multiple positional args
- `no-param-reassign` with `props: true` — don't mutate parameters or their properties
- `no-only-tests` is enforced as an error (no committed `.only`)
