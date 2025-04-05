import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import util from 'util';
import fs from 'fs/promises';
import { join } from 'path';
import request from 'request';
import getS3Client from '../src/s3Client';

const UPLOAD_NAME = 'reach-for-the-sky.avif';
const requestAsync = util.promisify(request);

class S3TestHelpers {
  constructor() {
    this.bucketName = process.env.BUCKET_NAME;
    this.client = getS3Client();
    this.uploadedObjectKeys = [];
  }

  async teardown() {
    const deletePromises = this.uploadedObjectKeys.map(async (key) => {
      const deleteObjectCmdInput = {
        Bucket: this.bucketName,
        Key: key,
      };
      await this.client.send(new DeleteObjectCommand(deleteObjectCmdInput));
    });
    await Promise.all(deletePromises);
  }

  async uploadTestFile({ url, headers }) {
    const filePath = join(__dirname, 'resources', UPLOAD_NAME);
    const fileToUpload = await fs.readFile(filePath);
    const formData = {};
    headers.forEach((header) => {
      formData[header.name] = header.value;
    });
    formData.file = fileToUpload;
    const options = {
      method: 'POST',
      url,
      formData,
    };
    const { statusCode } = await requestAsync(options);
    expect(statusCode).toBe(204);
    this.uploadedObjectKeys.push(formData.key);
  }
}

export default S3TestHelpers;
