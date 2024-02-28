import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AgentStatus } from '../enums/agent-status';

import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, switchMap } from 'rxjs/operators';
import {
  SchemaAttributes,
  SchemaCreatedResponse,
  SchemaGETResponse,
} from '../models/schema';
import {
  CredentialDefinitionsResponseId,
  CredentialIssueBody,
  Credential,
  CredentialExchange,
  CredentialExchangeRecordNew,
  CredentialDefinitionsResponse,
  CredentialDefinition,
} from '../models/credential';
import { Response } from '../models/response';
import { Connection } from '../models/connection';
import {
  PresentationRequest,
  PresentationRequestResponse,
} from '../models/proof-request';
import { Destination } from '../enums/hosts';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  constructor(private http: HttpClient) {}

  agentDest: Destination = Destination.AGENT;
  lifecycleDest: Destination = Destination.LIFECYCLE_API;

  basicMessage(connectionId: string, message: string) {
    const messageBody = {
      content: message,
    };
    return this.http
      .post<any>(
        `${this.agentDest}/connections/${connectionId}/send-message`,
        messageBody
      )
      .pipe(
        switchMap(() => of('Successfully sent message')),
        catchError(
          this.handleError<any>(
            `${this.agentDest}/connections/${connectionId}/send-message`
          )
        )
      );
  }

  getStatus(): Observable<AgentStatus> {
    return this.http.get<any>(`${this.agentDest}/status`).pipe(
      switchMap(() => of(AgentStatus.Up)),
      catchError(this.handleError<any>('getStatus', AgentStatus.Down))
    );
  }

  getDomainReputation(body: {domain: string}){
    return this.http.post<boolean>(`${this.lifecycleDest}/check-domain-reputation`, body).pipe(
      switchMap((response: boolean) => of(response)),
      catchError(this.handleError<any>('getDomainReputation', false))
    )

  }
  getConnections(): Observable<Connection[]> {
    return this.http
      .get<Response<Connection[]>>(`${this.agentDest}/connections`)
      .pipe(
        switchMap((response: Response<Connection[]>) => of(response.results)),
        catchError(this.handleError<any[]>('getConnections', []))
      );
  }

  getConnection(connId: string): Observable<Connection> {
    return this.http.get<Connection>(`${this.agentDest}/connections/${connId}`);
  }

  getSchemas(): Observable<string[]> {
    return this.http
      .get<SchemaCreatedResponse>(`${this.agentDest}/schemas/created`)
      .pipe(
        switchMap((response: SchemaCreatedResponse) => {
          return of(response.schema_ids);
        }),
        catchError(this.handleError<any[]>('getSchemas', []))
      );
  }

  getSchema(schemaId: string): Observable<SchemaAttributes> {
    return this.http
      .get<SchemaGETResponse>(`${this.agentDest}/schemas/${schemaId}`)
      .pipe(
        switchMap((response: SchemaGETResponse) => {
          return of(response.schema);
        }),
        catchError(this.handleError<any>('getCredentialDefinitions', []))
      );
  }

  removeConnection(connectionId: string): Observable<any> {
    if (!connectionId) {
      console.error('Must provide a connection ID');
      return throwError(() => new Error('Must provide a connection ID'));
    }
    return this.http
      .post<any>(`${this.agentDest}/connections/${connectionId}/remove`, {})
      .pipe(
        switchMap(() => of(connectionId)),
        catchError(this.handleError<any>('removeConnection', null))
      );
  }

  createInvitation(alias: string): Observable<any> {
    const params: URLSearchParams = new URLSearchParams();
    params.set('alias', alias);

    return this.http
      .post<any>(
        `${this.agentDest}/connections/create-invitation?${params}`,
        {}
      )
      .pipe(
        switchMap((response: any) => of(response)),
        catchError(this.handleError<any>('createInvitation', null))
      );
  }

  receiveInvitation(invitation: any): Observable<any> {
    return this.http
      .post<any>(`${this.agentDest}/connections/receive-invitation`, invitation)
      .pipe(
        switchMap((response: any) => of(response)),
        catchError(this.handleError<any>('receiveInvitation', null))
      );
  }

  getIssuedCredentials(connectionIds: string[]) {
    return this.http
      .post<any>(`${this.lifecycleDest}/my-issued-credentials`, connectionIds)
      .pipe(
        switchMap((response: any) => {
          return of(response);
        }),
        catchError(this.handleError<any[]>('getIssuedCredentials', []))
      );
  }

  getCredentials(): Observable<Credential[]> {
    return this.http
      .get<Response<Credential[]>>(`${this.agentDest}/credentials`)
      .pipe(
        switchMap((response: Response<Credential[]>) => of(response.results)),
        catchError(this.handleError<any[]>('getCredentials', []))
      );
  }

  getCredentialExchangeRecords(): Observable<CredentialExchange[]> {
    return this.http
      .get<Response<CredentialExchangeRecordNew[]>>(
        `${this.agentDest}/issue-credential-2.0/records`
      )
      .pipe(
        switchMap((response: Response<CredentialExchangeRecordNew[]>) =>
          of(response.results)
        ),
        catchError(this.handleError<any>('getIssuedCredentials', []))
      );
  }

  getCredentialDefinitions(schemaId: string = ''): Observable<string[]> {
    const params: URLSearchParams = new URLSearchParams();
    if (schemaId.length > 0) {
      params.set('schema_id', schemaId);
    }
    return this.http
      .get<CredentialDefinitionsResponseId>(
        `${this.agentDest}/credential-definitions/created?${params}`
      )
      .pipe(
        switchMap((response: CredentialDefinitionsResponseId) =>
          of(response.credential_definition_ids)
        ),
        catchError(this.handleError<any[]>('getCredentialDefinitions', []))
      );
  }

  getCredentialDefinition(credDefId: string): Observable<CredentialDefinition> {
    return this.http
      .get<CredentialDefinitionsResponse>(
        `${this.agentDest}/credential-definitions/${credDefId}`
      )
      .pipe(
        switchMap((response: CredentialDefinitionsResponse) => {
          return of(response.credential_definition);
        }),
        catchError(this.handleError<any>('getCredentialDefinition', [{}]))
      );
  }

  issueCredential(credentialIssueBody: CredentialIssueBody): Observable<any[]> {
    return this.storeCredentialIssue(credentialIssueBody).pipe(
      concatMap((response1) => {
        return this.publishCredential(credentialIssueBody);
      }),
      catchError(this.handleError<any[]>('issueCredentials'))
    );
  }

  private storeCredentialIssue(credentialIssueBody: CredentialIssueBody) {
    return this.http
      .post<any[]>(
        `${this.lifecycleDest}/issue-credential`,
        credentialIssueBody
      )
      .pipe(
        switchMap((response: any) => {
          return of(response);
        }),
        catchError(this.handleError<any[]>('storeCredentialIssue', []))
      );
  }

  private publishCredential(credentialIssueBody: CredentialIssueBody) {
    return this.http
      .post<any[]>(
        `${this.agentDest}/issue-credential-2.0/send`,
        credentialIssueBody
      )
      .pipe(
        switchMap((response: any) => {
          return of(response);
        }),
        catchError(this.handleError<any[]>('getProofs', []))
      );
  }

  revokeCredentials(body: any) {
    return this.publishRevocation(body).pipe(
      concatMap((response1) => {
        return this.archiveRevocation(body);
      })
    );
  }

  publishRevocation(body: any) {
    return this.http
      .post<any>(`${this.agentDest}/revocation/revoke`, body)
      .pipe(
        switchMap((response: any) => of(response)),
        catchError(this.handleError<any[]>('revokeCredentials', []))
      );
  }

  archiveRevocation(body: any) {
    return this.http
      .post<any>(`${this.lifecycleDest}/my-issued-credentials/revoke`, body)
      .pipe(
        switchMap((response: any) => {
          return of(response);
        })
      );
  }

  getProofs(threadId: string = ''): Observable<PresentationRequestResponse[]> {
    const params: URLSearchParams = new URLSearchParams();
    if (threadId.length > 0) {
      params.set('thread_id', threadId);
    }
    return this.http
      .get<Response<PresentationRequestResponse[]>>(
        `${this.agentDest}/present-proof-2.0/records?${params}`
      )
      .pipe(
        switchMap((response: Response<PresentationRequestResponse[]>) => {
          return of(response.results);
        }),
        catchError(this.handleError<any[]>('getProofs', [{}]))
      );
  }

  acceptCredentialOffer(credExId: string) {
    return this.http.post(
      `${this.agentDest}/issue-credential/records/${credExId}/store`,
      {}
    );
  }

  withdrawCredentialOffer(credExId: string) {
    return this.http.post(
      `${this.agentDest}/issue-credential/records/${credExId}/remove`,
      {}
    );
  }

  submitPresentationRequest(presRequest: PresentationRequest): Observable<any> {
    return this.http
      .post(`${this.agentDest}/present-proof-2.0/send-request`, presRequest)
      .pipe(
        switchMap((response: any) => {
          return of(response);
        })
      );
  }

  createPresentationRequest(
    presRequest: PresentationRequest
  ): Observable<PresentationRequestResponse> {
    return this.http
      .post<PresentationRequestResponse>(
        `${this.agentDest}/present-proof-2.0/create-request`,
        presRequest
      )
      .pipe(
        switchMap((response: PresentationRequestResponse) => {
          return of(response);
        })
      );
  }

  getPresentationRequestsResponse(
    connectionId: string = ''
  ): Observable<PresentationRequestResponse[]> {
    const params: URLSearchParams = new URLSearchParams();
    if (connectionId.length > 0) {
      params.set('connection_Id', connectionId);
    }
    return this.http
      .get<Response<any>>(
        `${this.agentDest}/present-proof-2.0/records?${params}`
      )
      .pipe(
        switchMap((response: Response<PresentationRequestResponse[]>) =>
          of(response.results)
        ),
        catchError(
          this.handleError<any>('getPresentationRequestsResponse', undefined)
        )
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Prevent application from completely erroring out.
      return of(result as T);
    };
  }
}
