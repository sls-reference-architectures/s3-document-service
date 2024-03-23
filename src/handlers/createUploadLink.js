import middy from '@middy/core';
import eventNormalizer from '@middy/http-event-normalizer';
import jsonBodyParser from '@middy/http-json-body-parser';
import { createPreSignedPost } from '../s3Utils';

const handler = async (event) => {
  console.log(event);
  const {
    headers: { 'x-company-id': companyId },
    body: { fileName, sourceType },
  } = event;
  const preSignedPost = await createPreSignedPost({ companyId, fileName, sourceType });
  console.log('preSignedPost', preSignedPost);

  return {
    statusCode: 201,
    body: JSON.stringify({ uploadUrl: 'https://example.com' }),
  };
};

export default middy(handler).use(eventNormalizer()).use(jsonBodyParser());
