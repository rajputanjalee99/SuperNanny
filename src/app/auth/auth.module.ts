import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LazyimgModule } from '../directives/lazyImgLoad/lazyimg.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { SignUpStepComponent } from './sign-up-step/sign-up-step.component';
import { OtpComponent } from './otp/otp.component';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input'
import { MatDialogModule } from '@angular/material/dialog';
import { OtpModule } from '../dialogs/otp/otp.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { OTPforLoginComponent } from '../dialogs/otpfor-login/otpfor-login.component';

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    SignUpStepComponent,
    OtpComponent,
  NewPasswordComponent,
  OTPforLoginComponent,
    ForgetPasswordComponent
  ],
  imports: [
    
    CommonModule,
    AuthRoutingModule,
    LazyimgModule,
    NgxDropzoneModule,
    MatStepperModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    OtpModule,
    GoogleMapsModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule
  ]
})
export class AuthModule { }
