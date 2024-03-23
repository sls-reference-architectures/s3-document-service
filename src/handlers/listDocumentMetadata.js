import DocumentMetadataRepository from '../documentMetadataRepository';

const repo = new DocumentMetadataRepository();

const handler = async (event) => {
  console.log(event);
  const {
    headers: { 'x-company-id': companyId },
  } = event;
  const { items, nextToken } = await repo.getByCompany(companyId);

  return { items, nextToken };
};

export default handler;
