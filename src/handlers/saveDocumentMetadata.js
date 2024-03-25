import middy from '@middy/core';
import ioLogger from '@middy/input-output-logger';

import DocumentMetadataRepository from '../documentMetadataRepository';
import { getHeadObject } from '../s3Utils';

const repo = new DocumentMetadataRepository();

const handler = async (event) => {
  const {
    detail: {
      object: { key },
    },
  } = event;
  const { Metadata } = await getHeadObject(key);
  const documentMetadata = {
    companyId: Metadata.companyid,
    fileName: Metadata.filename,
    id: Metadata.fileid,
    objectKey: key,
  };
  await repo.create(documentMetadata);
};

export default middy(handler).use(ioLogger());
