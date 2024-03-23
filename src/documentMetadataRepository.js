import { DeleteCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import getDynamoDbClient from "./documentClient";
import { ulid } from "ulid";

const {
  env: { TABLE_NAME },
} = process;

class DocumentMetadataRepository {
  constructor() {
    this.documentClient = getDynamoDbClient();
  }

  async create(documentMetadata) {
    const itemToSave = { ...documentMetadata, id: ulid() }
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
}

export default DocumentMetadataRepository;
