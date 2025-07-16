import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OTPforLoginComponent } from 'src/app/dialogs/otpfor-login/otpfor-login.component';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  loginForm : FormGroup
  constructor(private service : HttpService, private _formBuilder : FormBuilder, private router : Router,  private dialog: MatDialog, ) { 
    this.loginForm = this._formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      password: ['', [Validators.required]],
      role: ['supervisor'],
      remember_me: [true, []],
    })
  }

  images : Array<any> = [
  ]

  ngOnInit(): void {
  }

  otpSend():any{

    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return false
    }else{
      const obj={
        email:this.loginForm.value.email,
        password:this.loginForm.value.password
      }
      this.service.sendOtpForlogin(obj).subscribe((res:any) => {
        if(res.code==200){
          let data=obj
          this.openDialog(data)
          this.service.showSuccessMessage({
            message: "OTP sent to Email"
        })
        }
      },(err)=>{
        this.service.showErrorMessage({message:err})
      })
  

   
  }
}


  openDialog(otp?:any): void {
    const dialogRef = this.dialog.open(OTPforLoginComponent, {
      height: '300x',
      data: {
        otp : otp,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if(result?.match){
        this.login()

       

      }

      
    });
  }
view:boolean=true
  getSuperVisorProfile():void{

    this.service.getSuperVisorProfile().subscribe((res:any) => {
      if(res.code==200){
      localStorage.setItem('user_details', JSON.stringify(res.user));
     

      this.service.setCookies({
        key: 'user_type',
        value: 'supervisor',
      });

      console.log("Data updated");
      this.service.setCookies({
        key : "is_profile_submitted",
        value : res.superVisorInfo.is_profile_submitted,
      });

      this.service.setCookies({
        key : "profile_approval",
        value : res.user.admin_approval,
      });
      if(res.user.admin_approval == "pending" && res.superVisorInfo.is_profile_submitted){
        this.router.navigate(['/user/profile-approval']);

      }
      else if(res.user.admin_approval != "approved"){
        if(!res.superVisorInfo.is_profile_submitted){
          this.router.navigate(['/auth/register-step']);
          this.service.showErrorMessage({message:'Please complete your profile'})
        }else{
          this.router.navigate(['/user/profile-approval']);
        }
      }else{
        this.router.navigate(['/user/dashboard']);
      }
      }
     
      


    })

  }

  login(): boolean {
    console.log(this.loginForm);
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return false
    }
    
    this.service.login_data(this.loginForm.value).subscribe((res:any) => {
      if(res.token){
        localStorage.setItem('token', res.token);
        localStorage.setItem('remember_me', 'yes');
        this.getSuperVisorProfile()
      }
    },(err:any)=>{
      this.service.showErrorMessage({message:err})
    })

    return true


  }

  showPassword(id:any){
    console.log(id)
    let x: any = document.getElementById(id)
    if (x.type === "password") {
      x.type = "text";
      this.view=false
    } else {
      this.view=true
      x.type = "password";
     
    }
   }

}
