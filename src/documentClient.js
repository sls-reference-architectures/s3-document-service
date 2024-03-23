import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

let client;

const getDynamoDbClient = () => {
  if (client) {
    return client;
  }
  const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
  client = DynamoDBDocumentClient.from(ddbClient);

  return client;
};

export default getDynamoDbClient;
