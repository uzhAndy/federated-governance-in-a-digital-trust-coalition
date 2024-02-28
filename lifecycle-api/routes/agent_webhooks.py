import logging
from fastapi import APIRouter, Request, Response
from lifecycle.credential_events import handle_issue_credention_webhook

from models.api.webhooks.issue_credential_v2_0 import WebhookIssueCredentialV2_0
from models.api.webhooks.issue_credential_revocation import WebhookIssueCredentialRevocation
from models.api.webhooks.issue_credential_v2_0_indy import WebhookIssueCredentialV2_0Indy




router = APIRouter()


@router.post(
        "/agent-webhook/topic/issue_credential_v2_0/",
        tags=["agent-webhook (M2M)"],
        summary="Agent webhook to record issuer credential events",
        description="Receives webhooks containing internal state changes of acapy's issued credentials. When an event with type *done* is observer, \
                    the credential exchange has successfully concluded and the holder now carries the issued credential in their wallet."
        )
def process_issue_credential_webhook(body: WebhookIssueCredentialV2_0, request: Request, response: Response):
    logging.info("process_issue_credential_webhook" + str(body))
    resp, status = handle_issue_credention_webhook(body)
    response.status_code = status
    return resp


@router.post(
        "/agent-webhook/topic/present_proof_v2_0/",
        tags=["agent-webhook (M2M)"],
        summary="[unused] Agent webhook to record proof presentation events",
        description="Receives webhooks containing internal state changes of acapy's proof presentation requests. *In the future it could be used to \
                    handle authentication more securly."
    )
def process_present_proof_webhook(request: Request, response: Response):
    return "response"


@router.post(
        "/agent-webhook/topic/connections/",
        tags=["agent-webhook (M2M)"],
        summary="[unused] Agent webhook to record connection events",
        description="Receives webhooks containing internal state changes of acapy's connections."
        )
def process_connections_webhook(request: Request, response: Response):
    return "response"


@router.post(
        "/agent-webhook/topic/revocation_registry/",
        tags=["agent-webhook (M2M)"],
        summary="[unused] Agent webhook to record revocation registry events",
        description="Receives webhooks containing internal state changes of acapy's revocation registry events."
        )
def process_revocation_registry_webhook(request: Request, response: Response):
    return "response"


@router.post(
        "/agent-webhook/topic/issuer_cred_rev/",
        tags=["agent-webhook (M2M)"],
        summary="[unused] Agent webhook to record credential revocation events",
        description="Receives webhooks containing internal state changes of acapy's credential revocation."
        )
def process_issuer_cred_rev_webhook(request: Request, response: Response):
    return "response"

@router.post(
        "/agent-webhook/topic/issue_credential_v2_0_indy/",
        tags=["agent-webhook (M2M)"],
        summary="[unused] Agent webhook to record credential verificaiton events",
        description="Receives webhooks containing results from validating a verifiable credential by looking up its credential definition on indy."
    )
def process_issue_credential_indy_webhook(body: WebhookIssueCredentialV2_0Indy, request: Request, response: Response):
    return "response"