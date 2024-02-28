import { Component } from '@angular/core';
import { AgentService } from 'src/app/services/agent.service';

import { map } from 'rxjs/operators'
import { AgentStatus } from 'src/app/enums/agent-status';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  agentStatus = AgentStatus
  status = this.agentStatus.Loading

  constructor(private agentService: AgentService){}

  ngOnInit() {
    this.agentService.getStatus().pipe(
      map((status) => this.status = status)
    )
    .subscribe();
  }

}
