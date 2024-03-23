import DocumentMetadataRepository from "../src/documentMetadataRepository";

class DatabaseTestHelpers {
  constructor() {
    this.documentMetadataKeys = [];
    this.repo = new DocumentMetadataRepository();
  }

  async teardown() {
    const deletePromises = this.documentMetadataKeys.map(async (key) => this.repo.deleteDocumentMetadata(key));
    await Promise.all(deletePromises);
  }
}

export default DatabaseTestHelpers;
