import { parseTableMetadata } from './table-metadata';
import { MetadataDef, MetadataCollection } from "../types";

export const metadataParser = (metadataC: MetadataCollection) => {
  const { metadata, metadataRelation } = metadataC;

  return parseTableMetadata(metadata);
};
