/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import { faker } from '@faker-js/faker';
import { createTestId } from './testDataGenerators';

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

  it('should return pre-signed post in result', async () => {
    // ARRANGE
    const companyId = createTestId();
    const axiosOptions = {
      baseURL: process.env.API_URL,
      headers: {
        'x-company-id': companyId,
      },
      validateStatus: () => true,
    };
    const payload = { fileName: faker.system.fileName(), sourceType: faker.system.fileType() };

    // ACT
    const { data: preSignedPost } = await axios.post('/pre-signed-post', payload, axiosOptions);

    // ASSERT
    expect(preSignedPost).toHaveProperty('url');
    expect(preSignedPost).toHaveProperty('id');
    console.log('preSignedPost', preSignedPost);
    // TODO: check headers
    // expect(preSignedPost.fields['X-Amz-Meta-CompanyId']).toEqual(companyId);
    // expect(preSignedPost.fields['X-Amz-Meta-FileName']).toEqual(payload.fileName);
    // expect(preSignedPost.fields['X-Amz-Meta-SourceType']).toEqual(payload.sourceType);
  });
});
