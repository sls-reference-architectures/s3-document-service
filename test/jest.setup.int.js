const region = process.env.AWS_REGION || 'us-east-1';
const stage = process.env.STAGE || 'dev';
const tableName = process.env.TABLE_NAME || 's3-document-service';
const bucketName = process.env.BUCKET_NAME || 'com.reference-architecture.s3-document-service';

const setup = async () => {
  process.env.AWS_REGION = region;
  process.env.STAGE = stage;
  process.env.TABLE_NAME = tableName;
  process.env.BUCKET_NAME = bucketName;
};

export default setup;
