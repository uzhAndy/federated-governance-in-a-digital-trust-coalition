from typing import Any, List, Optional
from pydantic import BaseModel, Field
from models.tables.credential import Credential

class CredentialAttribute(BaseModel):
    name: str
    value: str

class CredentialPreview(BaseModel):
    type: str = "issue-credential/2.0/credential-preview"
    attributes: List[CredentialAttribute]

class FilterIndy(BaseModel):
    cred_def_id: str
    issuer_did: str
    schema_id: str
    schema_issuer_did: str
    schema_name: str
    schema_version: str

class Filter(BaseModel):
    indy: FilterIndy

class CredentialIssueBody(BaseModel):
    auto_remove: Optional[bool] = True
    comment: Optional[str]
    connection_id: str
    credential_preview: CredentialPreview
    filter: Optional[Filter]
    trace: Optional[bool] = False


class CredentialRevocationBody(BaseModel):
    comment: str
    connection_id: str
    cred_ex_id: str
    notify: Any
    publish: Any
    notify_version: str
    thread_id: str

class CredentialBodyResponse:
    connection_id: str
    credentials: List[Credential]