import { S3Client } from '@aws-sdk/client-s3';
// import { NodeHttpHandler } from '@aws-sdk/node-http-handler';

const S3Config = {
  region: process.env.AWS_REGION,
  // https://serverless.pub/migrating-to-aws-sdk-v3/#client-initialisation-is-different
  // requestHandler: new NodeHttpHandler({
  //   connectionTimeout: 1000,
  //   socketTimeout: 1000,
  // }),
};

let client;

const getS3Client = (config = S3Config) => {
  if (client) {
    return client;
  }
  client = new S3Client(config);

  return client;
};

export default getS3Client;
