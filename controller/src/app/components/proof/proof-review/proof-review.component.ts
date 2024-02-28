import { Component, Input } from '@angular/core';
import { ProofRequestStatus } from 'src/app/enums/proof-request-statust';
import { PresentationRequestResponse } from 'src/app/models/proof-request';

@Component({
  selector: 'app-proof-review',
  templateUrl: './proof-review.component.html',
  styleUrls: ['./proof-review.component.scss']
})
export class ProofReviewComponent {

  @Input() proof: PresentationRequestResponse;

  public STATE = ProofRequestStatus

}
