import DocumentMetadataRepository from '../src/documentMetadataRepository';
import DatabaseTestHelpers from './databaseTestHelpers';
import { createDocumentMetadataInput } from './testDataGenerators';

describe('When saving a document metadata', () => {
  let testHelpers;
  let documentMetadataRepository;

  beforeAll(() => {
    testHelpers = new DatabaseTestHelpers();
    documentMetadataRepository = new DocumentMetadataRepository();
  });

  afterAll(async () => {
    await testHelpers.teardown();
  });

  it('should succeed (baseline)', async () => {
    // ARRANGE
    const documentMetadataInput = createDocumentMetadataInput();

    // ACT
    const documentMetadata = await documentMetadataRepository.create(documentMetadataInput);
    testHelpers.trackKeyForTeardown(documentMetadata);

    // ASSERT
    expect(documentMetadata).toBeDefined();
    expect(documentMetadata.id).toBeString();
  });
});
