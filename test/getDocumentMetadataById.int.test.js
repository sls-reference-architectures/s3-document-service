import retry from 'async-retry';

import DocumentMetadataRepository from '../src/documentMetadataRepository';
import DatabaseTestHelpers from './databaseTestHelpers';
import { createTestId } from './testDataGenerators';

describe('When getting document metadata by id', () => {
  const testHelpers = new DatabaseTestHelpers();
  const documentMetadataRepository = new DocumentMetadataRepository();

  afterAll(async () => {
    await testHelpers.teardown();
  });

  describe('when document metadata exists', () => {
    it('should succeed (baseline)', async () => {
      // ARRANGE
      const { id, companyId, objectKey } = await testHelpers.injectDocumentMetadata();

      await retry(
        async () => {
          // ACT
          const documentMetadata = await documentMetadataRepository.getById({ id, companyId });

          // ASSERT
          expect(documentMetadata.objectKey).toEqual(objectKey);
        },
        { retries: 3 },
      );
    });
  });

  describe('when document metadata does not exist', () => {
    it('should throw not found', async () => {
      // ARRANGE
      const id = createTestId();
      const companyId = createTestId();

      // ACT
      const getByIdAction = () => documentMetadataRepository.getById({ id, companyId });

      // ASSERT
      await expect(getByIdAction()).rejects.toThrow(/Not found/i);
    });
  });
});
