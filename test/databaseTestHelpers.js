import DocumentMetadataRepository from '../src/documentMetadataRepository';
import { createDocumentMetadataInput } from './testDataGenerators';

class DatabaseTestHelpers {
  constructor() {
    this.documentMetadataKeys = [];
    this.repo = new DocumentMetadataRepository();
  }

  async injectDocumentMetadata(overrideWith) {
    const input = createDocumentMetadataInput(overrideWith);
    const documentMetadata = await this.repo.create(input);
    this.trackKeyForTeardown(documentMetadata);

    return documentMetadata;
  }

  async teardown() {
    const deletePromises = this.documentMetadataKeys.map(async (key) => this.repo.delete(key));
    await Promise.all(deletePromises);
  }

  trackKeyForTeardown(key) {
    this.documentMetadataKeys.push(key);
  }
}

export default DatabaseTestHelpers;
