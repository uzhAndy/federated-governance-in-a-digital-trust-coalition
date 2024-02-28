import { AcceptType, ConnectionStatus, InvitationMode, RoutingStatus } from "../enums/connection-status";

export type Connection = {
  initiator: string;
  invitation_key: string;
  routing_state: RoutingStatus;
  my_did: string;
  state: ConnectionStatus;
  connection_id: string;
  request_id: string;
  their_role: string;
  their_label: string;
  alias: string;
  error_msg: string;
  inbound_connection_id: string;
  accept: AcceptType;
  invitation_mode: InvitationMode;
  their_did: string;
  created_at: Date;
  updated_at: Date;
};


