import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs/promises';
import { join } from 'path';
import axios from 'axios';
import getS3Client from '../src/s3Client';

const UPLOAD_NAME = 'reach-for-the-sky.avif';
// A clean instance: the default axios carries the aws4 signing interceptor
// used for IAM-authed API calls, and a pre-signed S3 POST must not be signed.
const uploader = axios.create();

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
    // S3 pre-signed POST: every signed field first, the file strictly last.
    const form = new FormData();
    let key;
    headers.forEach((header) => {
      form.append(header.name, header.value);
      if (header.name === 'key') key = header.value;
    });
    form.append('file', new Blob([fileToUpload]), UPLOAD_NAME);
    const { status } = await uploader.post(url, form, { validateStatus: () => true });
    expect(status).toBe(204);
    this.uploadedObjectKeys.push(key);
  }
}

export default S3TestHelpers;
