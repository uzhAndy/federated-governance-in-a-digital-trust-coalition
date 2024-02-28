import { Component, Input } from '@angular/core';
import { ProofRequestStatus } from 'src/app/enums/proof-request-statust';
import {
  Attribute,
  AttributeKeyValueMap,
  ProofPresentationAttribute,
} from 'src/app/models/proof-request';


@Component({
  selector: 'app-proof-review-card-request-sent',
  templateUrl: './proof-review-card-request-sent.component.html',
  styleUrls: ['./proof-review-card-request-sent.component.scss']
})
export class ProofReviewCardRequestSentComponent {
  @Input() connectionId: string;
  @Input() state: string;
  @Input() role: string;
  @Input() updatedAt: string;
  @Input() attributes: AttributeKeyValueMap;
  @Input() verified: boolean;

  public STATE = ProofRequestStatus;

}
