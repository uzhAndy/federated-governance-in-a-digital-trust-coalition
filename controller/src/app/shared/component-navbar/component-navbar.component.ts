import { Component, Input } from '@angular/core';
import { NavLink } from 'src/app/models/nav-link';

@Component({
  selector: 'app-component-navbar',
  templateUrl: './component-navbar.component.html',
  styleUrls: ['./component-navbar.component.scss']
})
export class ComponentNavbarComponent {
  @Input() componentLinks: NavLink[];

}
