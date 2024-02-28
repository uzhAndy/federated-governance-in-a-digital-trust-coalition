from datetime import datetime
from pydantic import BaseModel
from models.enums.presentation_proof_request import State

class WebhookProcessPresentProofRequest(BaseModel):
    connection_id: str
    role: str
    initiator: str
    auto_present: bool
    thread_id: str
    state: State
    trace: bool
    created_at: datetime
    updated_at: datetime
    pres_ex_id: str