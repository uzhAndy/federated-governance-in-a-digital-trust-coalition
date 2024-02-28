import { Component, Input } from '@angular/core';
import { map } from 'rxjs';
import { Connection } from 'src/app/models/connection';
import { CredentialExchangeRecordNew } from 'src/app/models/credential';
import { AgentService } from 'src/app/services/agent.service';

@Component({
  selector: 'app-credentials-list',
  templateUrl: './credentials-exchange-list.component.html',
  styleUrls: ['./credentials-exchange-list.component.scss'],
})
export class CredentialsExchangeListComponent {
  @Input() credentialsExchangeRecords: CredentialExchangeRecordNew[];

  uniqueConnections: Connection[] = [];

  constructor(private agentService: AgentService) {}

  ngOnInit() {
    const connectionIds: string[] = [];
    this.credentialsExchangeRecords.forEach(
      (credExRec: CredentialExchangeRecordNew) => {
        connectionIds.push(credExRec.connection_id);
      }
    );
    const unique = [...new Set(connectionIds)];
    unique.forEach((connId) => {
      this.agentService
        .getConnection(connId)
        .pipe(map((el: Connection) => this.uniqueConnections.push(el)))
        .subscribe();
    });
  }

  getConnection(connId: string): Connection | undefined {
    return this.uniqueConnections.find((el) => connId === el.connection_id);
  }
}
