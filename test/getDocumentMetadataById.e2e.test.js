/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import DatabaseTestHelpers from './databaseTestHelpers';

describe('When getting document metadata by id through API', () => {
  const testHelpers = new DatabaseTestHelpers();

  afterAll(async () => {
    await testHelpers.teardown();
  });

  it('should return a 200', async () => {
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
    expect(response.status).toBe(200);
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

    // ACT
    const { data } = await axios.get(`/document-metadata/${id}`, axiosOptions);

    // ASSERT
    expect(data.objectKey).toEqual(objectKey);
  });
});
