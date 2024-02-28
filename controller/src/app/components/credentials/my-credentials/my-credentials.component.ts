import { Component } from '@angular/core';
import { map } from 'rxjs';
import { Connection } from 'src/app/models/connection';
import { Credential } from 'src/app/models/lifecycle-api/credentials';
import { AgentService } from 'src/app/services/agent.service';

@Component({
  selector: 'app-my-credentials',
  templateUrl: './my-credentials.component.html',
  styleUrls: ['./my-credentials.component.scss'],
})
export class MyCredentialsExchangeComponent {
  credentials: {"connection_id": string, "credentials": Credential[]}[] = [];

  constructor(private agentService: AgentService) {}

  ngOnInit() {
    this.agentService
      .getConnections()
      .pipe(
        map((resp: Connection[]) => {
          const conn_ids = resp.map((el: Connection) => el.connection_id);
          this.agentService
                .getIssuedCredentials(conn_ids)
                .pipe(
                  map((creds: {"connection_id": string, "credentials": Credential[]}[]) => {
                    this.credentials = creds;
                  })
                )
                .subscribe();  
        })
      )
      .subscribe();
  }
}
