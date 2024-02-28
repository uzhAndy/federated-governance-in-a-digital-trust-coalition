from enum import Enum

class IssueState(Enum):
    OFFER_SENT = "offer-sent"
    REQUEST_RECEIVED = "request-received"
    CREDENTIAL_ISSUED = "credential-issued"
    DONE = "done"
    DELETED = "deleted"
    ABANDONED = "abandoned"