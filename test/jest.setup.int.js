const setup = async () => {
  process.env.REGION = 'us-east-1';
  process.env.TABLE_NAME = 's3-document-service';
};

export default setup;
