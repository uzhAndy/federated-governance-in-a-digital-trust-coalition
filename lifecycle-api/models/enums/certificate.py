from enum import Enum

class SubjectComponents(Enum):
    COUNTRY = b"C"
    STATE = b"ST"
    CITY = b"L"
    ORGANIZATION = b"O"
    DOMAIN = b"CN"

class CertificateValidation(Enum):
    EV = "2.23.140.1.2.3"
    OV = "2.23.140.1.2.2"
    DV = "2.23.140.1.2.1"
    NONE = "N/A"

class AlgorithmSignature(Enum):
    ECDH = 408
    RSA = 6