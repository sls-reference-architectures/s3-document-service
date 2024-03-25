import { ulid } from 'ulid';
import { faker } from '@faker-js/faker';

const createDocumentMetadataInput = (overrideWith) => {
  const documentMetadataInput = {
    companyId: createTestId(),
    fileName: faker.system.fileName(),
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
