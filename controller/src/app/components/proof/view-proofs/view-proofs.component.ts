import { Component } from '@angular/core';
import { map } from 'rxjs';
import { PresentationRequestResponse } from 'src/app/models/proof-request';
import { AgentService } from 'src/app/services/agent.service';

@Component({
  selector: 'app-view-proofs',
  templateUrl: './view-proofs.component.html',
  styleUrls: ['./view-proofs.component.scss']
})
export class ViewProofsComponent {

  public proofRequests: PresentationRequestResponse[] = [];

  constructor(private agentService: AgentService){}
  ngOnInit(){

    this.agentService.getPresentationRequestsResponse().pipe(
      map((data: PresentationRequestResponse[]) => {
        this.proofRequests = data.filter(el => el.by_format.pres_request.indy.name != "Login Request");
      })
    ).subscribe();

  }

}
