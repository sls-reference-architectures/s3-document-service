import { DeleteCommand, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { ulid } from 'ulid';

import getDynamoDbClient from './documentClient';

const {
  env: { TABLE_NAME },
} = process;

class DocumentMetadataRepository {
  constructor() {
    this.documentClient = getDynamoDbClient();
  }

  async create(documentMetadata) {
    const itemToSave = { ...documentMetadata, id: ulid() };
    const params = {
      TableName: TABLE_NAME,
      Item: itemToSave,
    };

    await this.documentClient.send(new PutCommand(params));

    return itemToSave;
  }

  async delete({ companyId, id }) {
    const params = {
      TableName: TABLE_NAME,
      Key: { companyId, id },
    };

    await this.documentClient.send(new DeleteCommand(params));
  }

  async getById({ companyId, id }) {
    const params = {
      TableName: TABLE_NAME,
      Key: { companyId, id },
    };

    const { Item } = await this.documentClient.send(new GetCommand(params));

    return Item;
  }
}

export default DocumentMetadataRepository;
