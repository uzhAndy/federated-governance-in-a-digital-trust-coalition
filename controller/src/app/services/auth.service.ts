import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Destination } from '../enums/hosts';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import {
  PresentationRequestResponse,
  ProofPresentationAttribute,
} from '../models/proof-request';
import { jwtDecode } from 'jwt-decode';
import { Response } from '../models/response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private hasJWT = false;
  private jwt: string;
  lifecycleDest: Destination = Destination.LIFECYCLE_API;
  agentDest: Destination = Destination.AGENT;
  AUTH_HEADER: string = 'Bearer Token';
  public decoded: {
    sub: string;
    first_name: string;
    last_name: string;
    role: string;
    iat: string;
  };

  constructor(private http: HttpClient) {
    this.hasJWT = !!localStorage.getItem(this.AUTH_HEADER);
    this.jwt = localStorage.getItem(this.AUTH_HEADER) ?? '';
  }

  validateProof(proof: PresentationRequestResponse): Observable<boolean> {
    const sub = (
      proof.by_format.pres.indy.requested_proof.revealed_attrs[
        'controller user registration:employee_id'
      ] as ProofPresentationAttribute
    ).raw;

    if (proof.verified === "true") {
      return this.authenticate(sub).pipe(
        map((el) => {
          if (el) {
            this.decoded = jwtDecode(el);
            this.jwt = el;
            localStorage.setItem(this.AUTH_HEADER, el);
            this.hasJWT = true;
            return true;
          } else {
            return false;
          }
        })
      );
    } else {
      return of(false);
    }
  }

  isAuthenticated(): Observable<boolean> {
    this.hasJWT = !!localStorage.getItem(this.AUTH_HEADER);
    if (this.hasJWT) {
      const headers = new HttpHeaders({
        Authorization: this.jwt,
      });
      // using post because ngrok doesn't allow get requests without user consent. post are fine
      return this.http.post<boolean>(`${this.lifecycleDest}/auth/user`, {}, {
        headers,
      });
    } else {
      return new Observable<boolean>((observer) => {
        observer.next(false);
        observer.complete();
      });
    }
  }

  authenticate(sub: string, isAdmin: boolean = true) {
    return this.http
      .post<any>(`${this.lifecycleDest}/auth/is-user`, {
        sub: sub,
        admin: isAdmin,
      })
      .pipe(
        switchMap((response: any) => of(response)),
        catchError(this.handleError<any>('authenticate', false))
      );
  }

  getInvitationState(connectionId: string): Observable<any> {
    return this.http
      .get<any>(`${this.agentDest}/connections/${connectionId}`)
      .pipe(
        switchMap((response: any) => of(response)),
        catchError(
          this.handleError<any>('getInvitationState', { state: 'not-found' })
        )
      );
  }

  getProofState(threadId: string): Observable<PresentationRequestResponse> {
    const params: URLSearchParams = new URLSearchParams();
    params.set('thread_id', threadId);
    return this.http
      .get<Response<PresentationRequestResponse[]>>(
        `${this.agentDest}/present-proof-2.0/records?${params}`
      )
      .pipe(
        switchMap((response: Response<PresentationRequestResponse[]>) => {
          return of(response.results[0]);
        }),
        catchError(
          this.handleError<any>('getProofState', { state: 'not-found' })
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
