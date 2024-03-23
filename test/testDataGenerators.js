import { ulid } from 'ulid';

const createDocumentMetadataInput = (overrideWith) => {
  const documentMetadataInput = {
    companyId: createTestId(),
    id: createTestId(),
    objectKey: createTestId(),
  };

  return {
    ...documentMetadataInput,
    ...overrideWith,
  };
};

const createTestId = () => `TEST_${ulid()}`;

export { createDocumentMetadataInput, createTestId };
