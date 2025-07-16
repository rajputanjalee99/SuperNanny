import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404Component } from './errors/error404/error404.component';
import { ProfileApprovalGuard } from './guards/profile_approval/profile-approval.guard';
import { UserGuard } from './guards/user/user.guard';
import { AlertMessagesComponent } from './user/alert-messages/alert-messages.component';
import { BankDetailComponent } from './user/bank-detail/bank-detail.component';
import { ProfileApprovalPageComponent } from './user/profile-approval-page/profile-approval-page.component';
import { ReferAndEarnComponent } from './user/refer-and-earn/refer-and-earn.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: "full",
    redirectTo: "auth/login"
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path : "user/profile-approval",
    component : ProfileApprovalPageComponent,
    // title : "Profile Approval",
    canActivate : [UserGuard]
  },
  {
    path : "user/referEarn",
    component : ReferAndEarnComponent,
    // title : "Refer and Earn",
    canActivate : [UserGuard]
  },
  {
    path : "user/Bankdetail",
    // title : "",
    component : BankDetailComponent,
    canActivate : [UserGuard]
  },
  {
    path : "user/alertMessage",
    component : AlertMessagesComponent,
    canActivate : [UserGuard]
  },
  {
    path: "user",
    loadChildren: () => import("./user/user.module").then(m => m.UserModule),
    // canActivate: [UserGuard, ProfileApprovalGuard]
  },
  {
    path: '**', pathMatch: 'full',
    component: Error404Component
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
