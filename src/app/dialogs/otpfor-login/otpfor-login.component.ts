import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-otpfor-login',
  templateUrl: './otpfor-login.component.html',
  styleUrls: ['./otpfor-login.component.scss']
})
export class OTPforLoginComponent implements OnInit {
  email: any='';

 

  ngOnInit(): void {
  }
  otp: string = "";
  text1: string = "";
  text2: string = "";
  text3: string = "";
  text4: string = "";
  _id: string = ""
  canResend: boolean = false;

  mins: number = 2;
  seconds: number = 0;

  interValId: any;

  constructor(
      public dialogRef: MatDialogRef<OTPforLoginComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private sanitizer: DomSanitizer,
      private service: HttpService,
      private fb: FormBuilder) {
      console.log(data);

      if (data?.otp?.email) {

          this.email = data?.otp?.email;
          console.log(this.email,'asdada')
      }
      console.log(this.email,'asdada')
      this.setInterval();

  }

  setInterval(): void {
      this.mins = 1;
      this.seconds = 0;
      this.canResend = false
      const self = this;
      this.interValId = setInterval(function () {

          if (self.seconds == 0) {
              if (self.mins == 0) {
                  self.canResend = true
                  self.clearInterVal();
              } else {
                  self.mins = self.mins - 1;
                  self.seconds = 60;
              }
          }
          --self.seconds
      }, 1000)
  }

  clearInterVal(): void {

      clearInterval(this.interValId);
      setTimeout(() => {
          this.mins = 0;
          this.seconds = 0;
      }, 50)

  }

  keytab(event: any) {
      let nextInput = event.srcElement.nextElementSibling;
      if (nextInput == null)
          return;
      else
          nextInput.focus();
  }

  resend(): boolean {
    this.text1=''
    this.text2=''
    this.text3 =''
    this.text4=''

      if (!this.canResend) {
          return false;
      }

      if (this.email) {
        console.log('oKk')

          this.service.sendOtpForlogin({
              email: this.data?.otp?.email,
              password:this.data?.otp?.password
          }).subscribe((resp: any) => {
             
              this.service.showSuccessMessage({
                  message: "OTP resent to Email"
              })
              this.setInterval();
          })

      } 

      return true;

  }



  submit(): void {

      this.otp = this.text1 + this.text2 + this.text3 + this.text4
      if (this.otp.length == 4) {
        const obj ={
          sup_otp: this.otp,
          email:this.email
        }
        this.service.verifyOtpForlogin(obj).subscribe((res)=>{
          if(res.code==200 && res.match){
            this.dialogRef.close({
              match:true
            })
          }
          
        },(err)=>{
          this.service.showErrorMessage({
            message: err
        })
        })
          
      } else {
          this.service.showErrorMessage({
              message: "Please enter 4 digits"
          })
      }


  }


}
