import { Component } from '@angular/core';
import { NavLinkService } from 'src/app/services/nav-link.service';
import { NavLink } from 'src/app/models/nav-link';

@Component({
  selector: 'app-nav-card-list',
  templateUrl: './nav-card-list.component.html',
  styleUrls: ['./nav-card-list.component.scss']
})
export class NavCardListComponent {
  navLinks: NavLink[] = [];

  constructor(private navLinkService: NavLinkService) { }

  ngOnInit() {
    this.navLinks = this.navLinkService.getNavLinks();
  }
}
