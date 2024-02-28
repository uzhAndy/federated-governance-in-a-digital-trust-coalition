
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LinkStorageService {
  private storedLink: string;

  setLink(link: string): void {
    this.storedLink = link;
  }

  getLink(): string {
    return this.storedLink;
  }
}