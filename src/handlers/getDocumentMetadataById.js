import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import eventNormalizer from '@middy/http-event-normalizer';
import DocumentMetadataRepository from '../documentMetadataRepository';

const repo = new DocumentMetadataRepository();

const handler = async (event) => {
  console.log(event);
  const {
    headers: { 'x-company-id': companyId },
    pathParameters: { id },
  } = event;
  const documentMetadata = await repo.getById({ id, companyId });

  return documentMetadata;
};

export default middy(handler).use(eventNormalizer()).use(httpErrorHandler());
