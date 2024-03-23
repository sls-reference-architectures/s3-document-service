import retry from 'async-retry';

import DocumentMetadataRepository from '../src/documentMetadataRepository';
import DatabaseTestHelpers from './databaseTestHelpers';

describe('When getting document metadata by company', () => {
  let testHelpers;
  let documentMetadataRepository;

  beforeAll(() => {
    testHelpers = new DatabaseTestHelpers();
    documentMetadataRepository = new DocumentMetadataRepository();
  });

  afterAll(async () => {
    await testHelpers.teardown();
  });

  it('should return only document data for the company', async () => {
    // ARRANGE
    const { id, companyId } = await testHelpers.injectDocumentMetadata();
    await testHelpers.injectDocumentMetadata();

    await retry(
      async () => {
        // ACT
        const documentMetadata = await documentMetadataRepository.getByCompany(companyId);

        // ASSERT
        expect(documentMetadata).toHaveLength(1);
        expect(documentMetadata[0].id).toEqual(id);
      },
      { retries: 3 },
    );
  });

  it('should return array of document metadata', async () => {
    // ARRANGE
    const { companyId } = await testHelpers.injectDocumentMetadata();
    await testHelpers.injectDocumentMetadata({ companyId });

    await retry(
      async () => {
        // ACT
        const documentMetadata = await documentMetadataRepository.getByCompany(companyId);

        // ASSERT
        expect(documentMetadata).toHaveLength(2);
      },
      { retries: 3 },
    );
  });
});
