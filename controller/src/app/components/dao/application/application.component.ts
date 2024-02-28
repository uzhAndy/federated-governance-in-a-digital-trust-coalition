import { Component, Input } from '@angular/core';
import { MembershipApplication } from 'src/app/models/smart-contracts';
import { SmartContractsService } from 'src/app/services/smart-contracts.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss'],
})
export class ApplicationComponent {
  @Input() application: MembershipApplication;

  constructor(private web3service: SmartContractsService) {}
  supportApplication() {
    this.web3service
      .castVote(true, this.application.applier.walletAddress)
      .then((res: MembershipApplication) => (this.application = res));
  }

  rejectApplication() {
    this.web3service
      .castVote(false, this.application.applier.walletAddress)
      .then((res: MembershipApplication) => (this.application = res));
  }

  formatDate(timestampBigInt: bigint) {
    const timestamp = Number(timestampBigInt) * 1000;
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  activeApplication() {
    const timestamp = new Date().getTime();
    const applicationTimeEndNumber =
      Number(this.application.applicationTimeEnd) * 1000;
    return timestamp < applicationTimeEndNumber;
  }
}
