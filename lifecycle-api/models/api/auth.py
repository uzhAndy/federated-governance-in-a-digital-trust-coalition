from typing import Any, List, Optional
from pydantic import BaseModel, Field
from models.tables.credential import Credential

class AuthenticateUserIdRequest(BaseModel):
    sub: str
    admin: bool