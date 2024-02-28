import { Initiator, IssuerRole } from '../enums/roles';
import { CredentialState } from '../enums/credential-status';

export type CredentialDefinitionsResponseId = {
  credential_definition_ids: string[];
};

export type Credential = {
  referent: string;
  attrs: {
    [key: string]: { name: string };
  };
  schema_id: string;
  cred_def_id: string;
  rev_reg_id: string;
  cred_rev_id: string;
};

export type IndyFilter = {
  cred_def_id: string;
  issuer_did: string;
  schema_id: string;
  schema_issuer_did: string;
  schema_name: string;
  schema_version: string;
};

export type FilterWrapper = {
  indy: IndyFilter;
};

export type CredentialIssueBody = {
  auto_remove: boolean;
  comment: string;
  connection_id: string;
  credential_preview: CredentialProposal;
  filter: FilterWrapper;
  trace: boolean;
};

export type Attribute = {
  name: string;
  mimeType?: string;
  value: string;
  selected?: boolean;
  error?: string;
};

export type AttributesPreview = {
  name: string;
  value: string;
};

export type CredentialProposal = {
  '@type': string;
  attributes: Attribute[];
};

export type CredentialPreview = {
  '@type': string;
  attributes: AttributesPreview[];
};

export type CredentialExchangeRecordNew = {
  state: CredentialState;
  created_at: Date;
  updated_at: Date;
  trace: boolean;
  cred_ex_id: string;
  connection_id: string;
  thread_id: string;
  initiator: Initiator;
  role: IssuerRole;
  cred_preview: CredentialPreview;
  cred_proposal: {
    '@type': string;
    '@id': string;
    comment: string;
    credential_preview: CredentialPreview;
    formats: any;
    'filters~attach': any;
  };
  cred_offer: CredentialOffer;
  by_format: any;
  auto_offer: boolean;
  auto_issue: boolean;
  auto_remove: boolean;
  visible: boolean;
};

type CredentialOffer = {
  credential_preview: CredentialPreview
}


export type CredentialDefinitionsResponse = {
  credential_definition: CredentialDefinition;
};

export type CredentialDefinitionValue = {
  primary: {
    n: string;
    s: string;
    r: { [key: string]: { name: string } };
    rctxt: string;
    z: string;
  };
  revocation: any;
};

export type CredentialDefinition = {
  id: string;
  schemaId: string;
  type: string;
  tag: string;
  value: CredentialDefinitionValue;
  ver: string;
};

export type CredentialValues = {
  [key: string]: { raw: string; encoded: string };
};

export type CredentialExchange = {
  cred_ex_record: CredentialExchangeRecordNew;
  indy: any;
  visible: boolean;
  ld_prove: any;
};
