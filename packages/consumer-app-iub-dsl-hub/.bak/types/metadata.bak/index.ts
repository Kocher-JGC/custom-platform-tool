// export * from './metadata-mapping';
import { DataSourceRelation } from "./metadata-relation";
import { MetadataDef } from "..";

export * from './metadata';
export * from './metadata-relation';
export * from './table-metadata';

export interface MetadataCollection {
  metadata: MetadataDef[];
  metadataRelation?: {
    [tableId: string]: {
      [metadataRelationId: string]: DataSourceRelation
    }
  };
}

export default MetadataCollection;
