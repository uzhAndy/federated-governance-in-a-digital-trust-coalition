from enum import Enum

class State(Enum):
    REQUEST_SENT = "request-sent"
    PRESENTATION_RECEIVED = "presentation-received"
    ABANDONNED = "abandoned"