from typing import List
from models.enums.issue_credential import IssueState
from models.api.webhooks.issue_credential_v2_0 import WebhookIssueCredentialV2_0
from models.tables.credential import Credential, add_all as cred_add_all, get_existing_attributes, update_existing_attributes, revoke_cred_ex
from models.tables.connection import Connection, add as conn_add, get_connection, get_connections_from_list
from models.api.credential_lifecylce import CredentialRevocationBody
import datetime
import logging

from models.api.credential_lifecylce import CredentialIssueBody, CredentialPreview

def handle_issue_credential(credential: CredentialIssueBody):
    TIMESTAMP = datetime.datetime.now()
    connection_id = credential.connection_id
    comment = credential.comment
    credential_preview = credential.credential_preview
    filter = credential.filter
    new_connection = Connection(
        connection_id=connection_id,
        comment=comment
    )
    ex_connection = get_connection(connection_id)
    conn_id: int
    if(ex_connection):
        conn_id = ex_connection.id
    else:
        conn_id = conn_add(new_connection)

    cred_attributes = extractAttributes(credential_preview, conn_id, TIMESTAMP)
    ex_cred_attributes = get_existing_attributes(conn_id)
    if(len(ex_cred_attributes) > 0):
        for cred in ex_cred_attributes:
            print("SWSSSSSSSSSSSSSSSSSSSSSSSSS", cred)
    else:
        cred_add_all(cred_attributes,)


def extractAttributes(cp: CredentialPreview, conn_id: str, ts: datetime):
    ret_list = []
    for att in cp.attributes:
        c_att = Credential(
            created_at=ts,
            name=att.name,
            value=att.value,
            connection_id=conn_id,
            is_valid=True,
            type=cp.type
        )
        ret_list.append(c_att)
    return ret_list


def get_issued_credentials(connection_ids: List[str]):
    ret_list = []
    ex_connection = get_connections_from_list(connection_ids)
    if(len(ex_connection) > 0):
        for conn in ex_connection:
            ex_cred = get_existing_attributes(conn.id)
            if(len(ex_cred) > 0):
                ret_list.append({
                    "connection_id": conn.connection_id,
                    "credentials": ex_cred
                })
                # logging.info("IIIIIIIIIIIIIII" + str(ret_list))
        return ret_list, 200
    else:
        return [], 200

def handle_revocation(cred_rev_body: CredentialRevocationBody):
    creds, status = revoke_cred_ex(cred_rev_body.cred_ex_id)
    ret_body = {
        "connection_id": cred_rev_body.connection_id,
        "credentials": creds
        }
    return ret_body, status


def handle_issue_credention_webhook(data: WebhookIssueCredentialV2_0):
    connection = get_connection(data.connection_id)
    if(connection):
        match data.state:
            case IssueState.OFFER_SENT:
                print(data.state)
                return "not implemented", 200
            case IssueState.REQUEST_RECEIVED:
                print(data.state)
                return "not implemented", 200
            case IssueState.CREDENTIAL_ISSUED:
                print(data.state)
                return "not implemented", 200
            case IssueState.DONE:
                print(data.state)
                return update_existing_attributes(connection.id, data.thread_id, data.cred_ex_id)            
            case IssueState.DELETED:
                print(data.state)
                return "not implemented", 200
            case IssueState.ABANDONED:
                print(data.state)
                return "not implemented", 200
    else:
        return "connection not found", 404