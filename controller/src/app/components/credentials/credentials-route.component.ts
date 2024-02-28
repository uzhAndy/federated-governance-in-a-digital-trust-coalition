import { Component } from '@angular/core';
import { NavLink } from 'src/app/models/nav-link';
import { NavLinkService } from 'src/app/services/nav-link.service';

@Component({
  selector: 'app-credentials-component',
  templateUrl: './credentials-route.component.html',
  styleUrls: ['./credentials-route.component.scss']
})
export class CredentialsRouteComponent {
  public componentLinks: NavLink[]

  constructor (private navLinkService: NavLinkService){}

  ngOnInit() {
    this.componentLinks = this.navLinkService.getComponentNavLinks("credentials");
  }
}
