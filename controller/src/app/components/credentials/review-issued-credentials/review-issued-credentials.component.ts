import { Component } from '@angular/core';
import { map } from 'rxjs';
import { Initiator } from 'src/app/enums/roles';
import { CredentialExchange, CredentialExchangeRecordNew } from 'src/app/models/credential';
import { AgentService } from 'src/app/services/agent.service';

@Component({
  selector: 'app-review-issued-credentials',
  templateUrl: './review-issued-credentials.component.html',
  styleUrls: ['./review-issued-credentials.component.scss'],
})
export class ReviewIssuedCredentialsExchangeComponent {
  receivedCredentialRecords: CredentialExchangeRecordNew[] = [];
  issuedCredentialRecords: CredentialExchangeRecordNew[] = [];

  constructor(private agentService: AgentService) {}

  ngOnInit() {
    this.agentService
      .getCredentialExchangeRecords()
      .pipe(
        map((resp: CredentialExchange[]) => {
          resp.forEach((cr: CredentialExchange) => {
            const credExRecord = cr.cred_ex_record
            credExRecord.visible = true;
            credExRecord.initiator === Initiator.SELF
              ? this.issuedCredentialRecords.push(credExRecord)
              : this.receivedCredentialRecords.push(credExRecord);
          });
        })
      )
      .subscribe();
  }
}
