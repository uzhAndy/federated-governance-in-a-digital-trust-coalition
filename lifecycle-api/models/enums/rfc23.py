from enum import Enum

class ConnectionState(Enum):
    INVITATION_SENT = "invitation-sent"
    REQUEST_RECEIVED = "request-received"
    RESPONSE_SENT = "response-sent"
    COMPLETED = "completed"