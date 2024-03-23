import { getHeadObject } from '../s3Utils';

const handler = async (event) => {
  console.log(event);
  const {
    detail: {
      object: { key },
    },
  } = event;
  const { Metadata } = await getHeadObject(key);
  console.log(Metadata);
  // const documentMetadata = {
  //   companyId: Metadata.
  // }
};

export default handler;
