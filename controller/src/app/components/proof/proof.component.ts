import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Connection } from 'src/app/models/connection';
import { NavLink } from 'src/app/models/nav-link';
import { AgentService } from 'src/app/services/agent.service';
import { NavLinkService } from 'src/app/services/nav-link.service';


@Component({
  selector: 'app-proof',
  templateUrl: './proof.component.html',
  styleUrls: ['./proof.component.scss'],
})
export class ProofComponent {
  public componentLinks: NavLink[];

  constructor(private navLinkService: NavLinkService, private agentService: AgentService) {}

  ngOnInit() {
    this.componentLinks =
      this.navLinkService.getComponentNavLinks('proof-requests');
  }
}
