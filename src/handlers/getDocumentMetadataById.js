import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import eventNormalizer from '@middy/http-event-normalizer';
import ioLogger from '@middy/input-output-logger';
import DocumentMetadataRepository from '../documentMetadataRepository';
import { getSignedDownloadUrl } from '../s3Utils';

const repo = new DocumentMetadataRepository();

const handler = async (event) => {
  const {
    headers: { 'x-company-id': companyId },
    pathParameters: { id },
  } = event;
  const documentMetadata = await repo.getById({ id, companyId });
  const link = await getSignedDownloadUrl({
    key: documentMetadata.objectKey,
    fileName: documentMetadata.fileName,
  });
  documentMetadata.link = link;

  return documentMetadata;
};

export default middy(handler).use(eventNormalizer()).use(ioLogger()).use(httpErrorHandler());
