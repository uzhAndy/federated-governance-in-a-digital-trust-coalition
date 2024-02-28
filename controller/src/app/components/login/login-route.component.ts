import { Component } from '@angular/core';
import { Subscription, filter, map } from 'rxjs';
import {
  Attribute,
  IndyPresentationRequest,
  PresentationRequest,
  PresentationRequestBody,
  PresentationRequestResponse,
} from 'src/app/models/proof-request';
import { AgentService } from 'src/app/services/agent.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { LinkStorageService } from 'src/app/services/link-storage.service';
import { ProofRequestStatus } from 'src/app/enums/proof-request-statust';

@Component({
  selector: 'app-login-route',
  templateUrl: './login-route.component.html',
  styleUrls: ['./login-route.component.scss'],
})
export class LoginRouteComponent {
  constructor(
    private agentService: AgentService,
    private authService: AuthService,
    private linkStorageService: LinkStorageService,
    private router: Router
  ) {}

  public alias = 'login connection';
  public invitation: any;
  public invitationObject = '';
  public invitationUrl = '';
  public connectionId: string;
  public credDefId: string =
    'FgSoXyYQzN1x6frjyBorWU:3:CL:260374:controller user registration';
  public indyPresentationRequest: IndyPresentationRequest;
  public authenticationFailed: boolean = false;
  public proofReceived: boolean = false;
  public connectionEstablished: boolean = false;
  public authorized: boolean = false;
  public validatedProof: boolean = false;

  private proofSubscription: Subscription;
  private isAlive: boolean = true;

  ngOnInit() {
    this.indyPresentationRequest = {
      name: 'Login Request',
      version: '1.0',
      requested_attributes: {},
      requested_predicates: {},
    };

    this.proofSubscription = this.agentService
      .createInvitation(this.alias)
      .pipe(
        // filters out error respopnses
        filter((invitation: any) => !!invitation),
        map((invitation: any) => {
          this.connectionId = invitation['connection_id'];
          this.invitation = invitation;
          this.invitationUrl =
            (this.invitation && this.invitation.invitation_url) || '';
          this.requestInvitationState(0);
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.isAlive = false;
    this.proofSubscription.unsubscribe();
  }

  requestProofState = (iteration: number, threadId: string) => {
    if (iteration < 50 && this.isAlive) {
      this.authService
        .getProofState(threadId)
        .pipe(
          map((resp: PresentationRequestResponse) => {
            if (resp.state === 'done') {
              this.authService
              .validateProof(resp)
              .pipe(
                map((valid: boolean) => {
                    this.proofReceived = false;
                    if (valid) {
                      this.validatedProof = true;
                      const rerouteURL = this.linkStorageService.getLink();
                      setTimeout(() => this.router.navigate([rerouteURL]), 500);
                    } else {
                      this.stopLoginFlow();
                    }
                  })
                )
                .subscribe();
            } else if (
              resp.state === ProofRequestStatus.PRESENTATION_RECEIVED
            ) {
              this.connectionEstablished = false;
              this.proofReceived = true;
              setTimeout(
                () => this.requestProofState(iteration + 1, threadId),
                2000
              );
            } else if (resp.state === ProofRequestStatus.ABOANDONED) {
              this.stopLoginFlow();
            } else {
              setTimeout(
                () => this.requestProofState(iteration + 1, threadId),
                2000
              );
            }
          })
        )
        .subscribe();
    }  else {
      this.stopLoginFlow();
    }
  };

  requestInvitationState = (iteration: number) => {
    if (iteration < 50 && this.isAlive) {
      this.authService
        .getInvitationState(this.connectionId)
        .pipe(
          map((invitation) => {
            if (invitation['state'] === 'active') {
              this.connectionEstablished = true;
              this.agentService
                .basicMessage(
                  this.connectionId,
                  'Answer the following proof request to login'
                )
                .subscribe();
              const presRequestBody: PresentationRequestBody =
                this.createProofRequest();

              const presRequest: PresentationRequest = {
                auto_remove: false,
                auto_verify: true,
                comment: 'Login Request',
                connection_id: this.connectionId,
                presentation_request: presRequestBody,
              };

              this.agentService
                .submitPresentationRequest(presRequest)
                .pipe(
                  map((resp) => {
                    this.requestProofState(0, resp['thread_id']);
                  })
                )
                .subscribe();
            } else {
              setTimeout(
                () => this.requestInvitationState(iteration + 1),
                2000
              );
            }
          })
        )
        .subscribe();
    }
  };

  stopLoginFlow(){
    this.authenticationFailed = true;
    this.connectionEstablished = false;
    this.isAlive = false;
    this.proofReceived = false;
    this.validatedProof = false;
  }

  createProofRequest() {
    const firstName: Attribute = {
      name: 'first_name',
      non_revoked: {
        from: Math.floor(new Date('2023-01-01T00:00:00').getTime() / 1000),
        to: Math.floor(Date.now() / 1000),
      },
      restrictions: [
        {
          cred_def_id: this.credDefId,
        },
      ],
    };

    const lastName: Attribute = {
      name: 'last_name',
      non_revoked: {
        from: Math.floor(new Date('2023-01-01T00:00:00').getTime() / 1000),
        to: Math.floor(Date.now() / 1000),
      },
      restrictions: [
        {
          cred_def_id: this.credDefId,
        },
      ],
    };

    const employeeId: Attribute = {
      name: 'employee_id',
      non_revoked: {
        from: Math.floor(new Date('2023-01-01T00:00:00').getTime() / 1000),
        to: Math.floor(Date.now() / 1000),
      },
      restrictions: [
        {
          cred_def_id: this.credDefId,
        },
      ],
    };

    const role: Attribute = {
      name: 'role',
      non_revoked: {
        from: Math.floor(new Date('2023-01-01T00:00:00').getTime() / 1000),
        to: Math.floor(Date.now() / 1000),
      },
      restrictions: [
        {
          cred_def_id: this.credDefId,
        },
      ],
    };

    this.indyPresentationRequest.requested_attributes[
      'controller user registration:first_name'
    ] = firstName;
    this.indyPresentationRequest.requested_attributes[
      'controller user registration:last_name'
    ] = lastName;
    this.indyPresentationRequest.requested_attributes[
      'controller user registration:employee_id'
    ] = employeeId;
    this.indyPresentationRequest.requested_attributes[
      'controller user registration:role'
    ] = role;

    return {
      indy: this.indyPresentationRequest,
    };
  }
}
