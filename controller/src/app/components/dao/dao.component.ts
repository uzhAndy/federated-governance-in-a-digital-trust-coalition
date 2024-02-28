import { Component } from '@angular/core';
import { NavLink } from 'src/app/models/nav-link';
import { NavLinkService } from 'src/app/services/nav-link.service';

@Component({
  selector: 'app-dao',
  templateUrl: './dao.component.html',
  styleUrls: ['./dao.component.scss']
})
export class DaoComponent {
  public componentLinks: NavLink[]

  constructor (private navLinkService: NavLinkService){}

  ngOnInit() {
    this.componentLinks = this.navLinkService.getComponentNavLinks("dao");
  }

}
