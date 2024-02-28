import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Attribute } from 'src/app/models/credential';

@Component({
  selector: 'app-credential-form',
  templateUrl: './credential-form.component.html',
  styleUrls: ['./credential-form.component.scss'],
})
export class CredentialFormComponent {
  @Input() attributes: Attribute[];
  @Output() activeFormAttributes: EventEmitter<boolean> = new EventEmitter();
  
  formModal: any;
  modalError: string;

  ngOnInit() {
  }

  handleRemove(attName: string) {
    const att = this.attributes.find(
      (el: Attribute) => el.name === attName
    );
    if (att != undefined) {
      (att.value = ''), (att.selected = false);
    }
    this.checkFormSubmittable();
  }

  checkFormSubmittable() {
    this.activeFormAttributes.emit(
      this.attributes.some((el) => el.selected)
    );
  }

  addAttribute(attName: string) {
    const att = this.attributes.find(
      (el: Attribute) => el.name === attName
    );
    if (att != undefined) {
      att.selected = true;
    }
    this.checkFormSubmittable();
  }
}
