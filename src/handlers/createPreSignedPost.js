import middy from '@middy/core';
import eventNormalizer from '@middy/http-event-normalizer';
import jsonBodyParser from '@middy/http-json-body-parser';
import { ulid } from 'ulid';

import { createPreSignedPost } from '../s3Utils';

const handler = async (event) => {
  const {
    headers: { 'x-company-id': companyId },
    body: { fileName, sourceType },
  } = event;
  const id = ulid();
  const preSignedPost = await createPreSignedPost({ companyId, fileName, id, sourceType });
  const headers = convertPreSignedPostFieldsToArray(preSignedPost.fields);

  return {
    statusCode: 201,
    body: JSON.stringify({ id, url: preSignedPost.url, headers }),
  };
};

const convertPreSignedPostFieldsToArray = (preSignedPostFields) => {
  const fieldProperties = Object.keys(preSignedPostFields);
  const headers = [];
  fieldProperties.forEach((fieldProperty) => {
    headers.push({ name: fieldProperty, value: preSignedPostFields[fieldProperty] });
  });

  return headers;
};

export default middy(handler).use(eventNormalizer()).use(jsonBodyParser());
