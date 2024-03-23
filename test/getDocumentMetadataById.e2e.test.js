/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';

describe('When getting document metadata by id through API', () => {
  it('should return a 200', async () => {
    // ARRANGE
    const axiosClient = axios.create();
    console.log('region:', process.env.AWS_REGION);
    const axiosOptions = {
      baseURL: process.env.API_URL,
      headers: {
        'x-company-id': 'xyz',
      },
      validateStatus: () => true,
    };
    console.log('axiosOptions:', axiosOptions);

    // ACT
    const response = await axiosClient.get('/document-metadata/abc', axiosOptions);

    // ASSERT
    expect(response.status).toBe(200);
  });
});
