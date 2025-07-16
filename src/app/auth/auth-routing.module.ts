import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileApprovalGuard } from '../guards/profile_approval/profile-approval.guard';
import { UserGuard } from '../guards/user/user.guard';
import { WithoutAuthGuard } from '../guards/without_auth/without_auth.guard';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { OtpComponent } from './otp/otp.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpStepComponent } from './sign-up-step/sign-up-step.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [{
  path : "login",
  component : SignInComponent,
  canActivate : [WithoutAuthGuard],
},{
  path : "register",
  component : SignUpComponent,
  canActivate : [WithoutAuthGuard],
},{
  path : "otp",
  component : OtpComponent,
  canActivate : [WithoutAuthGuard],
},{
  path : "register-step",
  component : SignUpStepComponent,
  canActivate : [UserGuard]
},
{
  path : "forget-password",
  component : ForgetPasswordComponent,
},{
  path : "new-password",
  component : NewPasswordComponent,
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
