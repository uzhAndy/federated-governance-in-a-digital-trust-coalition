from pydantic import BaseModel
from datetime import datetime
from models.enums.issue_credential_rev import IssueState

class WebhookIssueCredentialRevocation(BaseModel):
    state: IssueState
    created_at: datetime
    updated_at: datetime
    record_id: str
    cred_ex_id: str
    rev_reg_id: str
    cred_def_id: str
    cred_rev_id: str
    cred_ex_version: str