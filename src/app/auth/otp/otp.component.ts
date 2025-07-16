import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit {
  textInputFormControl = new FormControl('');
  constructor(private fb: FormBuilder, private service: HttpService, private router: Router) { }

  ngOnInit(): void {
  }
  sendOtp(){
    let email:any=localStorage.getItem('email')
      email=JSON.parse(email)
    const obj={
      otp_type:'register',
      email:email,
      otp:this.textInputFormControl.value
    }
    this.service.sendEmailForOtp(obj).subscribe((resp: any) => {
      this.service.showSuccessMessage({
        message: 'Otp Sent Successfully'
      })
      this.router.navigate(['auth/new-password'])
    },(err:any)=>{
      this.service.showSuccessMessage({
        message: err
      })
    })
  }

}
