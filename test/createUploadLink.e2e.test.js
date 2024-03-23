/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';

describe('When getting document metadata by id through API', () => {
  it('should return a 201', async () => {
    // ARRANGE
    const axiosOptions = {
      baseURL: process.env.API_URL,
      headers: {
        'x-company-id': 'xyz',
      },
      validateStatus: () => true,
    };
    const payload = { fileName: 'foo.jpg', sourceType: 'bar' };

    // ACT
    const response = await axios.post('/pre-signed-post', payload, axiosOptions);

    // ASSERT
    expect(response.status).toBe(201);
  });
});
