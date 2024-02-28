import logging
from fastapi import APIRouter, Request, Response, Depends
from lifecycle.credential_events import handle_issue_credential, get_issued_credentials, handle_revocation
from lifecycle.joiner_events import get_certificate_policy, generate_joiner_challenge
from models.api.credential_lifecylce import CredentialRevocationBody, CredentialIssueBody, List
from models.api.agent_lifecycle import RegisterBody, ChallengeParameters, DomainReputationRequest
from utils.auth import is_authorized


router = APIRouter()

@router.post(
        "/check-domain-reputation",
        tags=["tc-membership-lifecycle"],
        summary="Checks what certificate policy is set for a domain",
        description="Queries the provided domain and return *true* if the domain owns a valid EV or OV TLS certificate"
)
async def check_domain_reputation(body: DomainReputationRequest, response: Response):
    resp, status = await get_certificate_policy(body.domain)
    response.status_code = status
    return resp

@router.post(
        "/generate-challenge",
        tags=["tc-membership-lifecycle"],
        summary="Generates and returns an encrpyted 128-bit mnemonic phrase for the accelerated joiner process.",
        description="""This endpoint verifies whether or not there is an accelerated onboarding request in the DAO for the provided domain.
                    Provided that there is a pending request and the domain possesses a valid EV or OV TLS certificate, a challenge is 
                    published to the DAO and the challenge alongside the used public key material."""
        )
async def generate_challenge(body: ChallengeParameters, response: Response):
    resp, status = await generate_joiner_challenge(body)
    response.status_code = status
    return resp

@router.post(
        "/generate-mock-challenge",
        tags=["tc-membership-lifecycle"],
        summary="Generates and returns an encrpyted 128-bit mnemonic phrase without publishing it to the DAO.",
        description="""This enpoint retrieves the TLS certificate of the provided domain, generates a 128-bit mnemonic phrase,
                    encrypts it and returns it to the caller."""
        )
async def generate_mock_challenge(body: ChallengeParameters, response: Response):
    resp, status = await generate_joiner_challenge(body, True)
    response.status_code = status
    return resp

@router.post(
        "/issue-credential",
        tags=["vc-lifecycle"],
        summary="Persists issued verifiable credentials in the controller's database",
        description="""This endpoint accepts an AnonCreds credentials. If it is issued to a connection not listed in *controller_db.connection*, 
                        a new entry is created. Table *controller_db.credential* now persists the issued credential."""
        )
def process_issue_credential_request(body: CredentialIssueBody, response: Response):
    handle_issue_credential(body)
    resp, status = "response", 200
    response.status_code = status
    return resp

@router.post(
        "/my-issued-credentials",
        tags=["vc-lifecycle"],
        summary="Retrieves all issued credentials",
        description="""When a valid jwt is present in the *Authorization* header, this endpoint returns a list of all credentials that have been 
                    issued to the provided connections"""
        )
async def process_get_issued_credentials_request(body: List[str], response: Response, user_authorized: bool = Depends(is_authorized)):
    logging.info("process_get_issued_credentials_request" + str(body))
    resp, status = get_issued_credentials(body)
    response.status_code = status
    return resp

@router.post(
        "/my-issued-credentials/revoke",
        tags=["vc-lifecycle"],
        summary="Persist AnonCreds credentials revocation in database",
        description="This endpoint updates all credentials of the provided connection in the body and sets to to inactive with the timestamp of the request"
        )
def process_credential_revocation_request(body: CredentialRevocationBody, request: Request, response: Response, user_authorized: bool = Depends(is_authorized)):
    resp_body, status = handle_revocation(body)
    response.status_code = status
    return resp_body