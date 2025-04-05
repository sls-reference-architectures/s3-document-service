import axios from 'axios';
import DatabaseTestHelpers from './databaseTestHelpers';

describe('When listing document metadata through API', () => {
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
    };

    // ACT
    const response = await axios.get('/document-metadata', axiosOptions);

    // ASSERT
    expect(response.status).toBe(200);
  });

  it('should return the document metadata', async () => {
    // ARRANGE
    const { id, companyId } = await testHelpers.injectDocumentMetadata();
    const axiosOptions = {
      baseURL: process.env.API_URL,
      headers: {
        'x-company-id': companyId,
      },
    };

    // ACT
    const {
      data: { items },
    } = await axios.get(`/document-metadata`, axiosOptions);

    // ASSERT
    expect(items[0].id).toEqual(id);
  });
});
