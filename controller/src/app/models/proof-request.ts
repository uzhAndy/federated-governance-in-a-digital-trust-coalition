import { ProofRequestStatus } from '../enums/proof-request-statust';

export type PresentationRequest = {
  auto_remove?: boolean;
  auto_verify?: boolean;
  comment: string;
  connection_id?: string;
  presentation_request: PresentationRequestBody;
};

export type PresentationRequestBody = {
  indy: IndyPresentationRequest;
};

type Restriction = {
  cred_def_id: string;
};

export type Attribute = {
  name: string;
  restrictions: Restriction[];
  p_type?: string;
  p_value?: string;
  non_revoked?: RevokedCondition;
};

export type RevokedCondition = {
  from?: number;
  to?: number;
}

export type IndyPresentationRequest = {
  name: string;
  version: string;
  requested_attributes: {
    [key: string]: Attribute;
  };
  requested_predicates: {
    [key: string]: Attribute;
  };
};

type Format = {
  attach_id: string;
  format: string;
};

type AttachedRequestPresentationData = {
  base64: string;
};
type AttachedRequestPresentation = {
  '@id': string;
  'mime-type': string;
  data: AttachedRequestPresentationData;
};

type PresentationRecordsResponse = {
  '@type': string;
  '@id': string;
  comment: string;
  will_confirm: boolean;
  formats: Format[];
  'request_presentations~attach': AttachedRequestPresentation[];
};

type Presentation = {
  '@type': string;
  '@id': string;
  '~thread': {
    thid: string;
  };
  '~please_ack': {
    on: string[];
  };
  formats: Format[];
  'presentations~attach': AttachedRequestPresentation[];
};

type PresentationByFormat = {
  pres_request: PresentationRequestBody;
  pres: RequestPresentation;
};

export type ProofPresentationAttribute = {
  sub_proof_index: number;
  raw: string;
  encoded: string;
};

export type AttributeKeyValueMap = {
  [key: string]: ProofPresentationAttribute | Attribute;
}

type RequestedProofBody = {
  revealed_attrs: AttributeKeyValueMap
  self_attested_attrs: AttributeKeyValueMap;
  unrevealed_attrs: ProofPresentationAttribute;
  predicates: any[];
};

type Identifier = {
  schema_id: string;
  cred_def_id: string;
  rev_reg_id: string;
  timestamp: any;
};

type RequestPresentation = {
  indy: {
    requested_proof: RequestedProofBody;
    identifiers: Identifier[];
  };
};

export type PresentationRequestResponse = {
  state: ProofRequestStatus;
  created_at: string;
  updated_at: string;
  trace: boolean;
  pres_ex_id: string;
  connection_id: string;
  thread_id: string;
  initiator: string;
  role: string;
  pres_request: PresentationRecordsResponse;
  pres: Presentation;
  by_format: PresentationByFormat;
  auto_present: boolean;
  auto_remove: boolean;
  auto_verify: boolean;
  verified?: string;
};
