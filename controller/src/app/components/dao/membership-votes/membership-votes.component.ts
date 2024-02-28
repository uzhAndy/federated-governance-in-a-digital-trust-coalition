import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Company, MembershipApplication } from 'src/app/models/smart-contracts';
import { SmartContractsService } from 'src/app/services/smart-contracts.service';

@Component({
  selector: 'app-membership-votes',
  templateUrl: './membership-votes.component.html',
  styleUrls: ['./membership-votes.component.scss'],
})
export class MembershipVotesComponent {


  @ViewChild('closeModal') closeModal: ElementRef;
  

  public applications: MembershipApplication[] = [];

  constructor(
    private web3Service: SmartContractsService,
    private formBuilder: FormBuilder
  ) {}

  async ngOnInit() {
    this.applications = (await this.web3Service.getActiveJoinerRequests()).sort(
      (a, b) => Number(b.applicationTime) - Number(a.applicationTime)
    );
  }

  handleClick2() {
    this.web3Service.submitPassphrase("optimates.ch", "hub prepare claim alert flock exhaust crystal wish green afraid loyal document");
  }

  addApplication($event: MembershipApplication){
    this.applications.push($event)
  }


}
