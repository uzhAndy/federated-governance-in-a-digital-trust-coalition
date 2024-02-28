from datetime import datetime
from pydantic import BaseModel

class WebhookIssueCredentialV2_0Indy(BaseModel):
    created_at: datetime
    updated_at: datetime
    cred_ex_indy_id: str
    cred_ex_id: str
    rev_reg_id: str
    cred_rev_id: str