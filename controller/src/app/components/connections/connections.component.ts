import { Component } from '@angular/core';
import { NavLink } from 'src/app/models/nav-link';
import { NavLinkService } from 'src/app/services/nav-link.service';

@Component({
  selector: 'app-connections',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.scss']
})
export class ConnectionsComponent {
  public componentLinks: NavLink[]

  constructor (private navLinkService: NavLinkService){}

  ngOnInit() {
    this.componentLinks = this.navLinkService.getComponentNavLinks("connections");
  }
}
