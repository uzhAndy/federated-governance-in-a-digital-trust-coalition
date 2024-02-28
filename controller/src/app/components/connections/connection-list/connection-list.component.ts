import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs';
import { ConnectionStatus } from 'src/app/enums/connection-status';
import { Connection } from 'src/app/models/connection';
import { AgentService } from 'src/app/services/agent.service';

@Component({
  selector: 'app-connection-list',
  templateUrl: './connection-list.component.html',
  styleUrls: ['./connection-list.component.scss']
})
export class ConnectionListComponent {
  connections: Connection[];

  constructor(private agentService: AgentService) { }

  ngOnInit() {
    this.agentService.getConnections().pipe(
      map((connections: Connection[]) => {
        this.connections = connections.filter(
          (connection: Connection) => (
            (connection.state === ConnectionStatus.ACTIVE || connection.state === ConnectionStatus.REQUESTED) && connection.alias !== 'login connection')
          )
      })
    ).subscribe()
  }

  onRemoveConnection(connection: any) {
    this.agentService.removeConnection(connection.connection_id)
      .pipe(
        filter((connectionId: string) => !!connectionId),
        map((connectionId: string) =>
          this.connections = this.connections.filter((conn: Connection) => conn.connection_id !== connectionId))
      )
      .subscribe();
  }
}
