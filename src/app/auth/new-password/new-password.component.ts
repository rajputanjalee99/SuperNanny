import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {
  registerForm:FormGroup
  constructor(private fb: FormBuilder, private service: HttpService, private router: Router) {
    this.registerForm = this.fb.group({
     
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', [Validators.required]],
      
    }, { validator: [this.checkPasswords] })
   }
   checkPasswords(group: FormGroup): any {
    // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirm_password.value;

    return pass === confirmPass ? null : { notSame: true };
  }
  ngOnInit(): void {

  }
  submit(){
    if(this.registerForm.valid){
      let email:any=localStorage.getItem('email')
      email=JSON.parse(email)
      const obj={
        email:email,
        password:this.registerForm.value.password
      }
      this.service.forgetPassword(obj).subscribe((resp: any) => {
        this.service.showSuccessMessage({
          message: 'Change Password Successfully'
        })
        localStorage.clear()
        this.router.navigate(['/auth/login'])
      },(err:any)=>{
        this.service.showSuccessMessage({
          message: err
        })
      })
    }
    
  }
}
