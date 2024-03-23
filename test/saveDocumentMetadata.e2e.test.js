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
    };
    const payload = { fileName: `${createTestId()}.avif` };
    const { data: preSignedPost } = await axios.post('/pre-signed-post', payload, axiosOptions);
    await s3TestHelpers.uploadTestFile(preSignedPost);

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
      },
      { retries: 3 },
    );
  });
});
