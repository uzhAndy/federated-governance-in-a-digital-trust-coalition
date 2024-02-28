import { Component, Input } from '@angular/core';
import { map } from 'rxjs';
import { Credential } from 'src/app/models/lifecycle-api/credentials';
import { AgentService } from 'src/app/services/agent.service';

@Component({
  selector: 'app-credential',
  templateUrl: './credential.component.html',
  styleUrls: ['./credential.component.scss'],
})
export class CredentialComponent {
  @Input() connectionId: string;
  @Input() credentials: Credential[];

  constructor(private agentService: AgentService) {}

  revokeCredential(threadId: string, credExId: string) {
    interface RevocationBody {
      comment: string;
      connection_id: string;
      cred_ex_id: string;
      notify: boolean;
      publish: boolean;
      notify_version: string;
      thread_id: string;
    }

    let body: RevocationBody = {
      comment: 'string',
      connection_id: this.connectionId,
      cred_ex_id: credExId,
      notify: true,
      publish: true,
      notify_version: 'v1_0',
      thread_id: threadId,
    };


    this.agentService.revokeCredentials(body).pipe(
      map((res) => {
        this.credentials = res.credentials
      })).subscribe();
  }
}
