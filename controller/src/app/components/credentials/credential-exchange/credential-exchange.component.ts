import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { Initiator, IssuerRole } from 'src/app/enums/roles';
import { Connection } from 'src/app/models/connection';
import { CredentialExchangeRecordNew } from 'src/app/models/credential';
import { AgentService } from 'src/app/services/agent.service';

@Component({
  selector: 'app-exchange-credential',
  templateUrl: './credential-exchange.component.html',
  styleUrls: ['./credential-exchange.component.scss'],
})
export class CredentialsExchangeComponent {
  @Input() credentialExchangeRecord: CredentialExchangeRecordNew;
  @Input() connection: Connection | undefined;
  CredentialInitiator = Initiator;

  constructor(private agentService: AgentService, private router: Router){}

  acceptCredential(credDefId: string){
    this.agentService.acceptCredentialOffer(credDefId).pipe(
      // map(() => this.credentialExchangeRecord.visible = false)
    ).subscribe();
  }

  withdrawCredentialOffer(credDefId: string){
    this.agentService.withdrawCredentialOffer(credDefId).subscribe();
  }
}
