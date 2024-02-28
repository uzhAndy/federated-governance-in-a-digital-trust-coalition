import { Component, Input } from '@angular/core';
import { map } from 'rxjs';
import { Connection } from 'src/app/models/connection';
import { CredentialDefinition } from 'src/app/models/credential';
import {
  Attribute,
  IndyPresentationRequest,
  PresentationRequest,
  PresentationRequestBody,
} from 'src/app/models/proof-request';
import { AgentService } from 'src/app/services/agent.service';

@Component({
  selector: 'app-proof-card',
  templateUrl: './proof-card.component.html',
  styleUrls: ['./proof-card.component.scss'],
})
export class ProofCardComponent {
  @Input() connection: Connection;
  @Input() credDefIds: string[];
  @Input() credDefs: CredentialDefinition[];
  private credProofAttributes: Attribute[] = [];
  private indyPresentationRequest: IndyPresentationRequest;
  constructor(private agentService: AgentService) {}

  ngOnInit() {
    this.indyPresentationRequest = {
      name: 'Authentication Request',
      version: '1.0',
      requested_attributes: {},
      requested_predicates: {},
    };
  }

  handleClick(attName: string, credDefId: string) {
    const clickedAttribute: Attribute = {
      name: attName,
      non_revoked: {
        from: Math.floor(new Date('2023-01-01T00:00:00').getTime() / 1000),
        to: Math.floor(Date.now() / 1000),
      },
      restrictions: [
        {
          cred_def_id: credDefId,
        },
      ],
    };
    const attributeId: string = credDefId.split(':')[4] + ':' + attName;
    if (this.indyPresentationRequest.requested_attributes[attributeId]) {
      delete this.indyPresentationRequest.requested_attributes[attributeId];
    } else {
      this.indyPresentationRequest.requested_attributes[attributeId] =
        clickedAttribute;
    }
  }

  handleProofRequest(comment: string, connId: string) {
    const presRequestBody: PresentationRequestBody = {
      indy: this.indyPresentationRequest,
    };
    const presRequest: PresentationRequest = {
      auto_remove: false,
      auto_verify: true,
      comment: comment,
      connection_id: connId,
      presentation_request: presRequestBody,
    };

    this.agentService
      .submitPresentationRequest(presRequest)
      .pipe(
        map((res) => {
        })
      )
      .subscribe();
  }
}
