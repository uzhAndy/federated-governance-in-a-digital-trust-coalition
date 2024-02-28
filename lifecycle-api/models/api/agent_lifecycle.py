from pydantic import BaseModel
from typing import Union
from models.enums.certificate import AlgorithmSignature

class RegisterBody(BaseModel):
    requester_firstname: str
    requester_lastname: str
    requester_email: str
    company_name: str
    company_industry: str
    company_domain: str

class ChallengeParameters(BaseModel):
    domain: str
    walletPubKey: str

class RSAChallenge(BaseModel):
        cipher_text: bytes
        method: AlgorithmSignature
        note: str
        your_rsa_pubkey: str

class ECDHChallenge(BaseModel):
        cipher_text: bytes
        method: AlgorithmSignature
        note: str
        my_pubkey: str
        your_pubkey: str

class Challenge(BaseModel):
      message: str
      challenge: Union[RSAChallenge, ECDHChallenge]

class DomainReputationRequest(BaseModel):
      domain: str