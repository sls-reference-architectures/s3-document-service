import middy from '@middy/core';
import eventNormalizer from '@middy/http-event-normalizer';
import jsonBodyParser from '@middy/http-json-body-parser';

const handler = async (event) => {
  console.log(event);
};

export default middy(handler).use(eventNormalizer()).use(jsonBodyParser());
