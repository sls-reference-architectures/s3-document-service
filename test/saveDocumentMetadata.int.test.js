import DocumentMetadataRepository from "../src/documentMetadataRepository";
import DatabaseTestHelpers from "./databaseTestHelpers";

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

  });
});