import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterOTPResponse } from 'src/app/models/model';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  textInputFormControl = new FormControl('');
  constructor(private fb: FormBuilder, private service: HttpService, private router: Router) { }

  ngOnInit(): void {
  }


  onSubmit(): any {
    console.log('asdsa',this.textInputFormControl)
    localStorage.setItem('email',JSON.stringify(this.textInputFormControl.value) )
    const data = {
      input: this.textInputFormControl.value
    }

    this.service.sendEmailForOtp({
      email: data.input
    }).subscribe((resp: RegisterOTPResponse) => {
    
      this.router.navigate(['auth/otp'])
    },(err:any)=>{
      this.service.showSuccessMessage({
        message: err
      })
    })
     
    
  }

}
