/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import retry from 'async-retry';
import { createTestId } from './testDataGenerators';
import S3TestHelpers from './s3TestHelpers';

describe('When getting document metadata by id through API', () => {
  const s3TestHelpers = new S3TestHelpers();

  afterAll(async () => {
    await s3TestHelpers.teardown();
  });

  it('should save the file metadata after upload', async () => {
    const companyId = createTestId();
    const axiosOptions = {
      baseURL: process.env.API_URL,
      headers: {
        'x-company-id': companyId,
      },
      // validateStatus: () => true,
    };
    console.log('axios options', axiosOptions);
    const payload = { fileName: `${createTestId()}.avif` };
    let preSignedPost;
    try {
      const { data, status } = await axios.post('/pre-signed-post', payload, axiosOptions);
      console.log('status', status);
      console.log('error?', preSignedPost);
      // console.log('preSignedPost', preSignedPost.url);
      await s3TestHelpers.uploadTestFile(preSignedPost);
      preSignedPost = data;
    } catch (error) {
      console.log('error', error.toJSON());
      throw error;
    }

    await retry(
      async () => {
        // ACT
        const { data, status } = await axios.get(
          `/document-metadata/${preSignedPost.id}`,
          axiosOptions,
        );

        // ASSERT
        expect(status).toBe(200);
        expect(data.companyId).toBe(companyId);
        // console.log(data);
      },
      { retries: 5 },
    );
  });
});
