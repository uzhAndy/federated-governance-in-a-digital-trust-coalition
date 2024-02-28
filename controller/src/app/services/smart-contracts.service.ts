import { Injectable } from '@angular/core';
import Web3, { Contract } from 'web3';
import ABI from 'src/data/CredentialDAO.json';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { Observable, Subject, catchError, of, switchMap } from 'rxjs';
import { Company, MembershipApplication } from '../models/smart-contracts';
import { HttpClient } from '@angular/common/http';
import { Destination } from '../enums/hosts';
import { AuthChallengeRequestBody } from '../models/lifecycle-api/auth-challenge';

@Injectable({
  providedIn: 'root',
})
export class SmartContractsService {
  private web3js: Web3;
  private CONTRACT_ADDRESS = '0x0C3D39F44f090F0F429C798eDf8EE7A79D21Ae0B';
  private walletAddress: string;
  private contract: any;

  agentDest: Destination = Destination.AGENT;
  lifecycleDest: Destination = Destination.LIFECYCLE_API;

  constructor(private http: HttpClient) {
    if (typeof window.ethereum !== 'undefined') {
      this.web3js = new Web3(window.ethereum);
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((accounts: string[]) => {
          this.walletAddress = accounts[0];
        });
        this.contract = new this.web3js.eth.Contract(ABI, this.CONTRACT_ADDRESS);
    } else {
      console.error("Could not find a crypto wallet.")
    }
  }

  getWalletAddress() {
    return this.walletAddress;
  }

  async getActiveJoinerRequests(): Promise<MembershipApplication[]> {
    return this.contract.methods.getActiveJoinerRequests().call();
  }

  generateChallenge(
    body: AuthChallengeRequestBody,
    mocked: boolean
  ): Observable<any> {
    if (mocked) {
      return this.http
        .post<any>(`${this.lifecycleDest}/generate-mock-challenge`, body)
        .pipe(
          switchMap((resp: any) => of(resp)),
          catchError(this.handleError<any>('generate-challenge', false))
        );
    }
    return this.http
      .post<any>(`${this.lifecycleDest}/generate-challenge`, body)
      .pipe(
        switchMap((resp: any) => of(resp)),
        catchError(this.handleError<any>('generate-challenge', false))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Prevent application from completely erroring out.
      return of(result as T);
    };
  }

  async requestMembership(
    companyData: Company,
    acceleratedOnboarding: boolean = false
  ): Promise<MembershipApplication> {
    // TODO validate the a MembershipApplication is returned
    return (this.contract.methods.requestMembership as any)(
      companyData,
      acceleratedOnboarding
    ).send({ from: this.walletAddress });
  }

  async submitPassphrase(domain: string, passphrase: string) {
    (this.contract.methods.submitChallengeAnswer as any)(domain, passphrase)
      .send({ from: this.walletAddress })
      .then((result: any) => {});
  }

  getCompanyByDomain(domainName: string): Promise<Company> {
    return (this.contract.methods.getCompanyByDomain as any)(domainName)
      .call()
      .catch((error: any) => {
        console.error(
          `Could not find company with domain ${domainName}:`,
          error
        );
        return null;
      });
  }

  async castVote(
    yesVote: boolean,
    address: string
  ): Promise<MembershipApplication> {
    return (this.contract.methods.vote as any)(yesVote, address)
      .send({ from: this.walletAddress })
      .then((result: any) => {
        return true;
      });
  }
}
