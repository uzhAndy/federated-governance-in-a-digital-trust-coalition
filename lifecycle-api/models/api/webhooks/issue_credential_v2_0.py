from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from models.enums.issue_credential import IssueState

class WebhookIssueCredentialV2_0(BaseModel):
    connection_id: str
    role: str
    initiator: str
    auto_offer: bool
    auto_issue: bool
    auto_remove: bool
    thread_id: Optional[str] = None
    error_msg: Optional[str] = None
    state: IssueState
    trace: bool
    created_at: datetime
    updated_at: datetime
    cred_ex_id: str