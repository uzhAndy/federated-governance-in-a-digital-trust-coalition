export type Schema = {
    schemaIssuerDid: string;
    schemaName: string;
    version: string;
    schemaId: string
}
export type SchemaCreatedResponse = {
  schema_ids: string[];
};

export type SchemaAttributes = {
    attrNames: string[];
    id: string;
    name: string;
    seqNo: number;
    ver: string;
    version: string;

}

export type SchemaGETResponse = {
    schema: SchemaAttributes
}