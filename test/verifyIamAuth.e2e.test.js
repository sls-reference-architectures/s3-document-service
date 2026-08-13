import axios from 'axios';

// `axios.create()` gets its own interceptor stack, so this client does NOT
// pick up the SigV4 interceptor registered in signRequests.e2e.js — which is
// exactly what we want to assert the endpoints reject unsigned callers.
const unsignedClient = axios.create();

describe('When calling the API without a SigV4 signature', () => {
  const requestOptions = { validateStatus: () => true };

  it('should reject GET /document-metadata with a 403', async () => {
    // ARRANGE
    const url = `${process.env.API_URL}/document-metadata`;

    // ACT
    const { status } = await unsignedClient.get(url, requestOptions);

    // ASSERT
    expect(status).toEqual(403);
  });

  it('should reject GET /document-metadata/{id} with a 403', async () => {
    // ARRANGE
    const url = `${process.env.API_URL}/document-metadata/abc`;

    // ACT
    const { status } = await unsignedClient.get(url, requestOptions);

    // ASSERT
    expect(status).toEqual(403);
  });

  it('should reject POST /pre-signed-post with a 403', async () => {
    // ARRANGE
    const url = `${process.env.API_URL}/pre-signed-post`;
    const payload = { fileName: 'anything.avif' };

    // ACT
    const { status } = await unsignedClient.post(url, payload, requestOptions);

    // ASSERT
    expect(status).toEqual(403);
  });
});
