import { getSignedDownloadUrl } from '../src/s3Utils';

describe('When getting pre-signed download link', () => {
  it('should return a url', async () => {
    // ARRANGE
    const key = 'foo';
    const fileName = 'bar.jpg';

    // ACT
    const link = await getSignedDownloadUrl({ key, fileName });

    // ASSERT
    expect(link).toBeString();
    expect(link).toStartWith('https://');
  });
});
