import {
  Component,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { map } from 'rxjs';
import { ChallengeKeys } from 'src/app/enums/challenge';
import {
  AuthChallengeRequestBody,
  ChallengeECDH,
  ChallengeRSA,
} from 'src/app/models/lifecycle-api/auth-challenge';
import { Company, MembershipApplication } from 'src/app/models/smart-contracts';
import { AgentService } from 'src/app/services/agent.service';
import { SmartContractsService } from 'src/app/services/smart-contracts.service';

@Component({
  selector: 'app-request-membership',
  templateUrl: './request-membership.component.html',
  styleUrls: ['./request-membership.component.scss'],
})
export class RequestMembershipComponent {
  companyForm = this.formBuilder.group({
    companyName: ['', Validators.required],
    companyDomain: ['', Validators.required],
    contactPersonFirstname: ['', Validators.required],
    contactPersonLastname: ['', Validators.required],
    contactPersonEmail: ['', Validators.required],
    credentialDefinition: ['', Validators.required],
    walletAddress: ['', Validators.required],
  });

  challengeForm = this.formBuilder.group({
    answer: ['', Validators.required],
  });

  @ViewChild('closeModal') closeModal: ElementRef;
  @Output() newApplicationEvent = new EventEmitter<MembershipApplication>();

  loading: boolean = false;
  accelerated: boolean = false;
  acceleratedAvailable: boolean = false;
  companyFormSubmitted: boolean = false;

  challenge: ChallengeRSA | ChallengeECDH;
  keyType = ChallengeKeys;
  domainName: string;

  constructor(
    private web3Service: SmartContractsService,
    private agentService: AgentService,
    private formBuilder: FormBuilder
  ) {}

  // Recursive function to mark all form controls as touched
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  isInvalidField(field: AbstractControl<string | null, string | null> | null) {
    return field?.invalid && field?.touched;
  }

  resetForm() {
    this.companyForm.reset();
  }

  getKey(key: string) {
    if (key === ChallengeKeys.RSA) {
      const challenge = this.challenge as ChallengeRSA;
      return challenge.your_rsa_pubkey;
    } else if (key === ChallengeKeys.ECDH_ENCRYPTOR_PUB_KEY) {
      const challenge = this.challenge as ChallengeECDH;
      return challenge.my_pubkey;
    } else if (key === ChallengeKeys.ECDH_DECRYPTOR_PUB_KEY) {
      const challenge = this.challenge as ChallengeECDH;
      return challenge.your_pubkey;
    } else {
      return '';
    }
  }

  async submitChallenge() {
    this.markFormGroupTouched(this.challengeForm);
    if (this.challengeForm.valid) {
      const answer = this.challengeForm.get('answer')?.value;
      if (answer) {
        const resp = await this.web3Service.submitPassphrase(
          this.domainName,
          answer
        );
      }
    }
  }

  checkDomainReputation(){
    const domainName = this.companyForm.get("companyDomain")?.value;
    if(domainName){
      const body: {domain: string} = {
        domain: domainName
      }
      this.agentService.getDomainReputation(body).pipe(
        map((reputable: boolean) => {
          
            this.acceleratedAvailable = reputable;
          
        })
      ).subscribe();
    }
  }

  displayLoading(){
    return this.isLoading() && !this.isAcceleratedOnboarding()
  }

  isAcceleratedDisabled(){
    return !this.acceleratedAvailable;
  }

  async submitApplication(
    accelerated: boolean = false,
    mocked: boolean = true
  ) {
    this.markFormGroupTouched(this.companyForm);
    if (this.companyForm.valid) {
      this.loading = true;
      const applier = this.companyForm.value as Company;
      this.domainName = applier.companyDomain;
      this.companyForm.disable();
      
      
      const response = await this.web3Service.requestMembership(
        applier,
        accelerated
      );

      if (accelerated) {
        this.accelerated = true;
        const walletAddress = this.web3Service.getWalletAddress();
        const authChallengeRequestBody: AuthChallengeRequestBody = {
          domain: applier.companyDomain,
          walletPubKey: walletAddress,
        };
        this.web3Service
          .generateChallenge(authChallengeRequestBody, mocked)
          .pipe(
            map((res: ChallengeRSA | ChallengeECDH) => {
              this.challenge = res;
              this.accelerated = accelerated;
            })
          )
          .subscribe();
      } else {
        this.newApplicationEvent.emit(response);
        this.loading = false;
        this.closeModal.nativeElement.click();
      }
    }
  }

  isAcceleratedOnboarding() {
    return this.accelerated;
  }

  isLoading() {
    return this.loading;
  }
}
