import { Component, Input } from '@angular/core';
import { ProofRequestStatus } from 'src/app/enums/proof-request-statust';
import {
  Attribute,
  AttributeKeyValueMap,
  PresentationRequestResponse,
  ProofPresentationAttribute,
} from 'src/app/models/proof-request';

@Component({
  selector: 'app-proof-review-card-done',
  templateUrl: './proof-review-card-done.component.html',
  styleUrls: ['./proof-review-card-done.component.scss']
})
export class ProofReviewCardDoneComponent {
  @Input() connectionId: string;
  @Input() state: string;
  @Input() role: string;
  @Input() updatedAt: string;
  @Input() attributes: AttributeKeyValueMap;
  @Input() verified: boolean;

  public STATE = ProofRequestStatus;

  getValue(credAtt: ProofPresentationAttribute | Attribute) {
    return (credAtt as ProofPresentationAttribute).raw;
  }
}
