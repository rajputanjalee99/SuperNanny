import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OTPDialog } from 'src/app/dialogs/otp/otp';
import { RegisterOTPResponse } from 'src/app/models/model';
import { HttpService } from './../../services/http/http.service'

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const invalidCtrl = !!(
      control &&
      control.invalid &&
      control?.parent?.dirty
    );
    const invalidParent = !!(
      control &&
      control.parent &&
      control.parent.invalid &&
      control.parent.dirty
    );

    return invalidCtrl || invalidParent;
  }
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  isLinear: boolean = true;
  matcher = new MyErrorStateMatcher();
  otp_id: string = ""

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isEditable = false;
  registerForm: FormGroup;
  referrelInputBox:boolean = false;

  constructor(
    private _formBuilder: FormBuilder, 
    private dialog: MatDialog, 
    private service: HttpService,
    private router : Router
  ) {
    this.registerForm = this._formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      name: ['', [Validators.required]],
      confirm_email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern("^[0-9]*$"),]],
      referral_code: [''],

      otp: [''],
      otp_id: [''],
      role: ['supervisor'],
      remember_me: [true, []],
    }, { validator: [this.checkEmail, this.checkPasswords] })
  }

  checkPasswords(group: FormGroup): any {
    // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirm_password.value;

    return pass === confirmPass ? null : { notSame: true };
  }

  checkEmail(group: FormGroup): any {
    // here we have the 'passwords' group
    let email = group.controls.email.value;
    let confirm_email = group.controls.confirm_email.value;

    return email === confirm_email ? null : { notSameEmail: true };
  }

  get phone() {
    return this.registerForm.controls.phone.value
  }

  ngOnInit(): void {
  }

  sendRegisterOTP(): void {

    this.service.sendRegisterOTP({
      phone: this.phone
    }).subscribe((resp: RegisterOTPResponse) => {
      this.registerForm.controls.otp_id.setValue(resp._id);
      this.openDialog(resp.otp)

    })

  }

  openDialog(otp?:number): void {
    const dialogRef = this.dialog.open(OTPDialog, {
      height: '236px',
      data: {
        otp : otp,
      },
    });

    dialogRef.afterClosed().subscribe(result => {

      if(result.otp){
        this.registerForm.controls.otp.setValue(result.otp);

        if(result.otp_id){
          this.registerForm.controls.otp_id.setValue(result.otp_id);
        }

        this.registerUser();

      }else{
        this.service.showErrorMessage({
          message : "OTP not received"
        })
      }

      
    });
  }

  submit(): boolean {
    console.log(this.registerForm);
    
    if (!this.registerForm.valid) {
      this.registerForm.markAllAsTouched();
    } else {
      this.sendRegisterOTP();
    }

    return true
  }
  view:boolean=true
  showPassword1(id:any){
    console.log(id)
    let x: any = document.getElementById(id)
    if (x.type === "password") {
      x.type = "text";
      this.view=false
    } else {
      x.type = "password";
      this.view=true
    }
   }
   view1:boolean=true
  showPassword(id:any){
    console.log(id)
    let x: any = document.getElementById(id)
    if (x.type === "password") {
      x.type = "text";
      this.view1=false
    } else {
      x.type = "password";
      this.view1=true
    }
   }

  referralCode(event:any){
  console.log("event",event)
  this.referrelInputBox = event?.checked;
  if(event?.checked === true){
    this.registerForm.get('referral_code')?.setValidators([Validators.required]); 
    console.log("true",this.registerForm);
  }
  if(event?.checked === false){
    this.registerForm.get('referral_code')?.setErrors(null); 
    console.log("false",this.registerForm);
  }
  }

  registerUser(): void {
    const form = this.registerForm.value
    this.service.register(form).subscribe((res:any) => {

      this.service.showSuccessMessage({
        message : "LoggedIn Successfully"
      })

      localStorage.setItem('user_details', JSON.stringify(res.user));
      localStorage.setItem('token', res.token);
      localStorage.setItem('remember_me', 'yes');

      // move all session data to the user.
      // this.service.updateCart().subscribe((resp) => {});

      this.service.setCookies({
        key: 'user_type',
        value: 'supervisor',
      });

      this.router.navigate(['/auth/register-step']);

      
    },(error:HttpErrorResponse) => {
      this.service.showErrorMessage({
        message:error?.error?.errors?.msg
      })
    })

  }

}
