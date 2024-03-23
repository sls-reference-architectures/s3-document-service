import DocumentMetadataRepository from "../src/documentMetadataRepository";

class DatabaseTestHelpers {
  constructor() {
    this.documentMetadataKeys = [];
    this.repo = new DocumentMetadataRepository();
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
