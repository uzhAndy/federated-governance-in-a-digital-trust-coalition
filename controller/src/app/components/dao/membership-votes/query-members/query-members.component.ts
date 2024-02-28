import { Component } from '@angular/core';
import { Company } from 'src/app/models/smart-contracts';
import { SmartContractsService } from 'src/app/services/smart-contracts.service';

@Component({
  selector: 'app-query-members',
  templateUrl: './query-members.component.html',
  styleUrls: ['./query-members.component.scss'],
})
export class QueryMembersComponent {
  searchTerm: string;
  displayTerm: string;
  company: Company;
  error: string | undefined;
  searched: boolean;
  constructor(private web3Service: SmartContractsService) {}

  async queryForDomain() {
    this.company = await this.web3Service.getCompanyByDomain(this.searchTerm);
    this.displayTerm = this.searchTerm;
    this.searched = true;
    if (this.company === null) {
      this.error = `Could not find domain "${this.searchTerm}" in trust coalition.`;
    }
  }

  handleKeyDown($event: any) {
    if ($event.key === 'Enter') {
      this.queryForDomain();
    } else {
      this.searched = false;
      this.error = undefined;
    }
  }
}
