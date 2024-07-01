/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import retry from 'async-retry';
import DatabaseTestHelpers from './databaseTestHelpers';

describe('When getting document metadata by id through API', () => {
  const testHelpers = new DatabaseTestHelpers();

  afterAll(async () => {
    await testHelpers.teardown();
  });

  describe('when document metadata exists', () => {
    it('should return a 200', async () => {
      // ARRANGE
      const { companyId, id } = await testHelpers.injectDocumentMetadata();
      const axiosOptions = {
        baseURL: process.env.API_URL,
        headers: {
          'x-company-id': companyId,
        },
        validateStatus: () => true,
      };

      await retry(
        async () => {
          // ACT
          const response = await axios.get(`/document-metadata/${id}`, axiosOptions);

          // ASSERT
          expect(response.status).toBe(200);
        },
        { retries: 3 },
      );
    });

    it('should return the document metadata', async () => {
      // ARRANGE
      const { id, companyId, objectKey } = await testHelpers.injectDocumentMetadata();
      const axiosOptions = {
        baseURL: process.env.API_URL,
        headers: {
          'x-company-id': companyId,
        },
      };
      await retry(
        async () => {
          // ACT
          const { data } = await axios.get(`/document-metadata/${id}`, axiosOptions);

          // ASSERT
          expect(data.objectKey).toEqual(objectKey);
        },
        { retries: 3 },
      );
    });
  });

  describe('when document metadata does not exist', () => {
    it('should return a 404', async () => {
      // ARRANGE
      const axiosOptions = {
        baseURL: process.env.API_URL,
        headers: {
          'x-company-id': 'xyz',
        },
        validateStatus: () => true,
      };

      // ACT
      const response = await axios.get('/document-metadata/abc', axiosOptions);

      // ASSERT
      expect(response.status).toBe(404);
    });
  });
});
