import DocumentMetadataRepository from '../documentMetadataRepository';
import { getHeadObject } from '../s3Utils';

const repo = new DocumentMetadataRepository();

const handler = async (event) => {
  console.log(event);
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
  };
  await repo.create(documentMetadata);
};

export default handler;
