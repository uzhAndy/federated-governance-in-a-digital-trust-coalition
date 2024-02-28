from typing import Optional
from pydantic import BaseModel
from models.enums.rfc23 import ConnectionState as ConnectionStateRFC
from models.enums.connection import State

class WebhookConnectionData(BaseModel):
    state: State
    created_at: str
    updated_at: str
    connection_id: str
    their_did: Optional[str] = None
    their_label: Optional[str] = None
    their_role: str
    connection_protocol: str
    rfc23_state: ConnectionStateRFC
    invitation_key: str
    accept: str
    invitation_mode: str
    alias: str