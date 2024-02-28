import { Component } from '@angular/core';
import { map } from 'rxjs';
import { ConnectionStatus } from 'src/app/enums/connection-status';
import { Connection } from 'src/app/models/connection';
import { CredentialDefinition } from 'src/app/models/credential';
import { AgentService } from 'src/app/services/agent.service';

@Component({
  selector: 'app-request-proof',
  templateUrl: './request-proof.component.html',
  styleUrls: ['./request-proof.component.scss'],
})
export class RequestProofComponent {
  public connections: Connection[] = [];
  public credDefIdS: string[] = [];
  public credDefs: CredentialDefinition[] = [];
  selectedConnectionId: string;
  selectedConnection: Connection | undefined

  constructor(private agentService: AgentService) {}
  ngOnInit() {
    this.agentService
      .getConnections()
      .pipe(
        map((connections: Connection[]) => {
          (this.connections = connections.filter(
            (connection: Connection) =>
              connection.state === ConnectionStatus.ACTIVE && connection.alias != "login connection"
          ))
        }
        
        )
      )
      .subscribe();
    this.agentService
      .getCredentialDefinitions()
      .pipe(
        map((credDefId: string[]) => {
          this.credDefIdS = credDefId;
          this.credDefIdS.forEach((credDef: string) => {
            this.agentService
              .getCredentialDefinition(credDef)
              .pipe(
                map((credDef: CredentialDefinition) => {
                  if(credDef.tag!="controller user registration"){
                    this.credDefs.push(credDef)
                  }
                })
                ).subscribe();
          });
        })
      )
      .subscribe();
  }

  logg(connId: string) {
    this.selectedConnection = this.connections.find((conn: Connection) => connId === conn.connection_id);
  }
}
