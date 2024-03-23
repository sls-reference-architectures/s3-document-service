import { ulid } from "ulid";

const createDocumentMetadataInput = async (overrideWith) => {
  const documentMetadataInput = {
    companyId: createTestId(),
    objectKey: createTestId(),
  };

  return {
    ...documentMetadataInput,
    ...overrideWith
  };
};

createTestId = () => `TEST_${ulid()}`;

export { createDocumentMetadataInput };
