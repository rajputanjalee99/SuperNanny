import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OTPDialog } from './otp';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [OTPDialog],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports : [OTPDialog]
})
export class OtpModule { }
