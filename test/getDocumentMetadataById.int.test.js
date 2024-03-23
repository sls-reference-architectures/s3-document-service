import DocumentMetadataRepository from '../src/documentMetadataRepository';
import DatabaseTestHelpers from './databaseTestHelpers';

describe('When getting document metadata by id', () => {
  const testHelpers = new DatabaseTestHelpers();
  const documentMetadataRepository = new DocumentMetadataRepository();

  afterAll(async () => {
    await testHelpers.teardown();
  });

  it('should succeed (baseline)', async () => {
    // ARRANGE
    const { id, companyId, objectKey } = await testHelpers.injectDocumentMetadata();

    // ACT
    const documentMetadata = await documentMetadataRepository.getById({ id, companyId });

    // ASSERT
    expect(documentMetadata.objectKey).toEqual(objectKey);
  });
});
