import { DeleteCommand, GetCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { NotFound } from 'http-errors';

import getDynamoDbClient from './documentClient';

const {
  env: { TABLE_NAME },
} = process;

class DocumentMetadataRepository {
  constructor() {
    this.documentClient = getDynamoDbClient();
  }

  async create(documentMetadata) {
    const params = {
      TableName: TABLE_NAME,
      Item: documentMetadata,
    };

    await this.documentClient.send(new PutCommand(params));

    return documentMetadata;
  }

  async delete({ companyId, id }) {
    const params = {
      TableName: TABLE_NAME,
      Key: { companyId, id },
    };

    await this.documentClient.send(new DeleteCommand(params));
  }

  async getByCompany(companyId) {
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'companyId = :companyId',
      ExpressionAttributeValues: {
        ':companyId': companyId,
      },
    };
    const { Items, LastEvaluatedKey } = await this.documentClient.send(new QueryCommand(params));

    return { items: Items, nextToken: LastEvaluatedKey };
  }

  async getById({ companyId, id }) {
    const params = {
      TableName: TABLE_NAME,
      Key: { companyId, id },
    };
    const { Item } = await this.documentClient.send(new GetCommand(params));
    if (!Item) {
      throw new NotFound(`Not Found: DocumentMetadata with companyId: ${companyId} and id: ${id}`);
    }

    return Item;
  }
}

export default DocumentMetadataRepository;
