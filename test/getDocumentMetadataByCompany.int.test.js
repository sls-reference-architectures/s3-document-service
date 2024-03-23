/* eslint-disable import/no-extraneous-dependencies */
import retry from 'async-retry';

import DocumentMetadataRepository from '../src/documentMetadataRepository';
import DatabaseTestHelpers from './databaseTestHelpers';

describe('When getting document metadata by company', () => {
  const testHelpers = new DatabaseTestHelpers();
  const documentMetadataRepository = new DocumentMetadataRepository();

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
        const { items } = await documentMetadataRepository.getByCompany(companyId);

        // ASSERT
        expect(items).toHaveLength(1);
        expect(items[0].id).toEqual(id);
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
        const { items } = await documentMetadataRepository.getByCompany(companyId);

        // ASSERT
        expect(items).toHaveLength(2);
      },
      { retries: 3 },
    );
  });
});
