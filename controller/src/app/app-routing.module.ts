import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewConnectionComponent } from './components/connections/new-connection/new-connection.component';
import { ConnectionsComponent } from './components/connections/connections.component';
import { CredentialsRouteComponent } from './components/credentials/credentials-route.component';
import { RequestProofComponent } from './components/proof/request-proof/request-proof.component';
import { ViewProofsComponent } from './components/proof/view-proofs/view-proofs.component';
import { IssueCredentialsExchangeComponent } from './components/credentials/issue-credentials/issue-credentials.component';
import { ReviewIssuedCredentialsExchangeComponent } from './components/credentials/review-issued-credentials/review-issued-credentials.component';
import { ProofComponent } from './components/proof/proof.component';
import { ConnectionListComponent } from './components/connections/connection-list/connection-list.component';
import { MyCredentialsExchangeComponent } from './components/credentials/my-credentials/my-credentials.component';
import { authGuard } from './guards/auth.guard';
import { LoginRouteComponent } from './components/login/login-route.component';
import { DaoComponent } from './components/dao/dao.component';
import { MembershipVotesComponent } from './components/dao/membership-votes/membership-votes.component';
import { HomeComponent } from './components/home/home.component';
export const routeConfig: Routes = [
  {
    path: 'connections',
    component: ConnectionsComponent,
    // canActivate:[authGuard],
    // canActivateChild:[authGuard],
    children: [
      { path: '', redirectTo: 'new-connection', pathMatch: 'full' },
      { path: 'new-connection', component: NewConnectionComponent },
      { path: 'my-connections', component: ConnectionListComponent },
    ],
  },
  {
    path: 'credentials',
    component: CredentialsRouteComponent,
    // canActivate:[authGuard],
    // canActivateChild:[authGuard],
    children: [
      { path: '', redirectTo: 'issue-credentials', pathMatch: 'full' },
      {
        path: 'issue-credentials',
        component: IssueCredentialsExchangeComponent,
      },
      {
        path: 'view-credentials',
        component: ReviewIssuedCredentialsExchangeComponent,
      },
      { path: 'my-credentials', component: MyCredentialsExchangeComponent },
    ],
  },
  {
    path: 'proof-requests',
    component: ProofComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'request-proof', pathMatch: 'full' },
      { path: 'request-proof', component: RequestProofComponent },
      { path: 'view-proof-requests', component: ViewProofsComponent },
    ],
  },
  {
    path: 'dao',
    component: DaoComponent,
    // canActivate:[authGuard],
    // canActivateChild:[authGuard],
    children: [
      { path: '', redirectTo: 'membership-votes', pathMatch: 'full' },
      { path: 'membership-votes', component: MembershipVotesComponent },
    ],
  },
  {
    path: 'login',
    component: LoginRouteComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routeConfig)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
