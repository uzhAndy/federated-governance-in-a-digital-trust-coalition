import { Component } from '@angular/core';
import { AgentService } from 'src/app/services/agent.service';
import { filter, map } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-new-connection',
  templateUrl: './new-connection.component.html',
  styleUrls: ['./new-connection.component.scss']
})
export class NewConnectionComponent {
  public alias: string;
  public invitation: any;
  public invitationObject = '';
  public invitationUrl = '';
  public acceptInvitationUrl = '';
  error: string;

  constructor(private agentService: AgentService, private router: Router) { }

  ngOnInit() {
  }

  copy(el: HTMLInputElement | HTMLTextAreaElement) {
    el.select();
    document.execCommand('copy');
  }

  createInvitation() {

    this.agentService.createInvitation(this.alias)
      .pipe(
        // filters out error respopnses
        filter((invitation: any) => !!invitation),
        map((invitation: any) => {
          this.invitation = invitation;
          this.invitationObject = this.invitation && JSON.stringify(this.invitation.invitation, null, 4) || '';
          this.invitationUrl = this.invitation && this.invitation.invitation_url || '';
        })
      )
      .subscribe();
  }

  acceptInvitation() {
    try {
      const url = new URL(this.invitationUrl);
      const invitationParam = url.searchParams.get('c_i');
      if (!invitationParam) {
        throw new Error();
      }
      const invitation = JSON.stringify(
        JSON.parse(atob(invitationParam)),
        null,
        4
      );
      this.agentService
        .receiveInvitation(invitation)
        .pipe(map(() => this.router.navigateByUrl('/connections/my-connections')))
        .subscribe();
    } catch (e: any) {
      if (e instanceof SyntaxError) this.error = 'URL is malformed';
      else this.error = e.message;
    }
  }

}
