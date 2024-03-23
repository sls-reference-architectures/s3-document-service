import { AWSCreatePresignedPost } from '@aws-sdk/s3-presigned-post';
import { ulid } from 'ulid';

import getS3Client from './s3Client';

export const TenMinutesInSeconds = 600;

const createPreSignedPost = async ({ companyId, fileName, id = ulid(), sourceType }) => {
  const objectKey = createObjectKey({ companyId, id });
  const s3Client = getS3Client();
  const preSignedPost = await AWSCreatePresignedPost(s3Client, {
    Bucket: process.env.BUCKET_NAME,
    Key: objectKey,
    Conditions: createConditions({ companyId, fileName, id, sourceType }),
    Fields: createHeaderFields(companyId),
    Expires: TenMinutesInSeconds,
  });

  return preSignedPost;
};

const createObjectKey = ({ companyId, id }) => `${companyId}/${id}`;

const createConditions = ({ companyId, fileName, id, sourceType }) => {
  const conditions = [];
  conditions.push(['eq', '$X-Amz-Meta-CompanyId', companyId]);
  conditions.push(['eq', '$X-Amz-Meta-FileName', fileName]);
  conditions.push(['eq', '$X-Amz-Meta-FileId', id]);
  conditions.push(['eq', '$X-Amz-Storage-Class', 'INTELLIGENT_TIERING']);
  conditions.push(['content-length-range', 1, 10000000]); // 1 Byte - 10 MB
  if (sourceType) {
    conditions.push(['eq', '$X-Amz-Meta-SourceType', sourceType]);
  }

  return conditions;
};

const createHeaderFields = ({ companyId, fileName, id, sourceType }) => {
  const fields = {
    'X-Amz-Meta-CompanyId': companyId,
    'X-Amz-Meta-FileName': fileName,
    'X-Amz-Meta-FileId': id,
    'X-Amz-Storage-Class': 'INTELLIGENT_TIERING',
  };
  if (sourceType) {
    fields['X-Amz-Meta-SourceType'] = sourceType;
  }

  return fields;
};

export { createPreSignedPost };
