import { S3Client } from '@aws-sdk/client-s3';

let client;

const getS3Client = () => {
  if (client) {
    return client;
  }
  client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });

  return client;
};

export default getS3Client;
