import { Injectable } from '@angular/core';
import { NavLink } from '../models/nav-link';
import navLinksJson from 'src/data/nav_links.json';
import componentNavLinks from 'src/data/component_nav_links.json';

@Injectable({
  providedIn: 'root',
})
export class NavLinkService {
  navLinks: NavLink[] = [];

  constructor() {
    this.navLinks = navLinksJson;
  }

  getNavLinks(): NavLink[] {
    return this.navLinks;
  }

  getComponentNavLinks(parentRoute: string): NavLink[] {
    return componentNavLinks.filter((lnk) => lnk.parentRoute === parentRoute);
  }
}
