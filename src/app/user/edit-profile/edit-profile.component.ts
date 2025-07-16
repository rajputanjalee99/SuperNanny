import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { retry, distinctUntilChanged } from 'rxjs/operators';
import { EmptyResponse, GetProfileResponse, SupervisorProfile } from 'src/app/models/model';
import { HttpService } from 'src/app/services/http/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup
  profile!: SupervisorProfile;
  fileObj = <any> {
    file: null,
    filename: environment.DEFAULT_IMAGE
  };
  title= "Edit Profile"
  documents = <any> {
    front : {
      path : "./../../assets/img/pdf.png",
      name : "Front",
      link : "./../../assets/img/pdf.png",
    },
    back : {
      path : "./../../assets/img/pdf.png",
      name : "Back",
      link : "./../../assets/img/pdf.png",
    },
    police_verification : {
      path : "./../../assets/img/pdf.png",
      name : "Verification",
      link : "./../../assets/img/pdf.png",
    }
  }

  constructor(
    private _formBuilder: FormBuilder, 
    private service: HttpService,
    private sanitize : DomSanitizer,private router:Router
  ) {

    this.profileForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      old_password: ['', []],
      email: [{ value: '', disabled: true }, [],],
      phone: [{ value: '', disabled: true }, []],
      new_password: ['', []],
      confirm_new_password: ['', []]
    }, {
      validator: this.checkPasswords
    });

    this.profileForm.controls.old_password.valueChanges.pipe(distinctUntilChanged()).subscribe((value: string) => {
      this.updateValidator();
      console.log("Key up")
    })

    this.profileForm.controls.new_password.valueChanges.pipe(distinctUntilChanged()).subscribe((value: string) => {
      //  this.updateValidator();
    })

    this.profileForm.controls.confirm_new_password.valueChanges.pipe(distinctUntilChanged()).subscribe((value: string) => {
      // this.updateValidator();
    })

  }

  ngOnInit(): void {
    this.getProfile();
    this.getSuperVisorProfile();
  }

  

  get oldPassword() {
    return this.profileForm.controls.old_password.value
  }

  get newPassword() {
    return this.profileForm.controls.new_password.value
  }

  get confirmNewPassword() {
    return this.profileForm.controls.confirm_new_password.value
  }

  updateValidator(): void {
    console.log('this.confirmNewPassword: ', this.confirmNewPassword);
    console.log('this.newPassword: ', this.newPassword);
    console.log('this.oldPassword: ', this.oldPassword);
    if (this.oldPassword || this.newPassword || this.confirmNewPassword) { // add validator

      console.log("Validator is inside");

      this.profileForm.controls.old_password.addValidators([
        Validators.required
      ])

      this.profileForm.controls.new_password.addValidators([
        Validators.required,
        Validators.minLength(8)
      ])

      this.profileForm.controls.confirm_new_password.addValidators([
        Validators.required
      ])

      this.profileForm.controls.old_password.updateValueAndValidity();
      this.profileForm.controls.confirm_new_password.updateValueAndValidity();
      this.profileForm.controls.new_password.updateValueAndValidity();
      // return true
      // this.profileForm.addValidators(this.checkPasswords())

    } else {
      this.profileForm.controls.old_password.clearValidators();
      this.profileForm.controls.new_password.clearValidators();
      this.profileForm.controls.confirm_new_password.clearValidators();

      this.profileForm.controls.old_password.updateValueAndValidity();
      this.profileForm.controls.confirm_new_password.updateValueAndValidity();
      this.profileForm.controls.new_password.updateValueAndValidity();


      // return true

    }

  }

  onSelectProfile(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      if (file.type.includes("image")) {

        const previewFile = this.sanitize.bypassSecurityTrustResourceUrl(URL.createObjectURL(file))
        this.fileObj.filename = previewFile;
        this.fileObj.file = file;
        // this.secondFormGroup.controls.file_1.setValue(file.name)

      } else {
        alert("Only images are required");
      }
      event.srcElement.value = null;

      console.log(file);
    }
  }

  getProfile(): void {

    this.service.getProfile().subscribe((resp: GetProfileResponse) => {
      this.profile = resp.data;

      this.profileForm.patchValue({
        email: this.profile.email,
        phone: this.profile.phone,
        name: this.profile.name
      })
      if(this.profile.image){
        this.fileObj.filename = environment.USER_PROFILE+""+this.profile.image
      }

      if(this.profile.id_proof.front){
        this.documents.front.name = this.profile.id_proof.front;
        if(this.profile.id_proof.front && this.profile.id_proof.front.split('.').pop()?.toLocaleLowerCase() != "pdf"){
          this.documents.front.path = environment.SUPERVISOR_DOC+""+this.profile.id_proof.front
        }
        this.documents.front.link = environment.SUPERVISOR_DOC+""+this.profile.id_proof.front
      }

      if(this.profile.id_proof.back){
        this.documents.back.name = this.profile.id_proof.back;
        if(this.profile.id_proof.back && this.profile.id_proof.back.split('.').pop()?.toLocaleLowerCase() != "pdf" ){
          this.documents.back.path = environment.SUPERVISOR_DOC+""+this.profile.id_proof.back
        }
        this.documents.back.link = environment.SUPERVISOR_DOC+""+this.profile.id_proof.back
      }

      if(this.profile?.police_verification){
        this.documents.police_verification.path = environment.SUPERVISOR_DOC+""+this.profile.police_verification
        this.documents.verificaton.name = this.profile.police_verification;        
        this.documents.verificaton.link = environment.SUPERVISOR_DOC+""+this.profile.police_verification
      }
      

    })

  }

  checkPasswords(group: FormGroup): any {
    // here we have the 'passwords' group
    var pass = group.controls.new_password.value;
    var confirmPass = group.controls.confirm_new_password.value;
    var oldPass = group.controls.old_password.value;

    if (!pass && !confirmPass && !oldPass) {
      return null;
    } else {
      return pass === confirmPass ? null : { notSame: true };
    }

  }


  submitForm(): boolean {

    console.log(this.profileForm)    

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return false
    }

    var form = {
      ...this.profileForm.value
    }

    var form_data = new FormData();

    for ( var key in form ) {
        form_data.append(key, form[key]);
    }

    if(this.fileObj.file){
      form_data.append("image",this.fileObj.file)
    }

    this.service.editProfile(form_data).subscribe((resp:EmptyResponse) => {
      this.service.showSuccessMessage({
        message : "Profile Updated"
      })
      this.router.navigate(['/user/profile'])
    })


    return true;

  }

  openWindow(url:string){

    window.open(url)

  }
  profile_data:any;

  getSuperVisorProfile():void{

    this.service.getSuperVisorProfile().subscribe((resp:any) => {
 
      this.profile_data = resp?.superVisorInfo;
      console.log("this.profile", resp)
      if(this.profile_data.police_verification){
      this.documents.police_verification.name = resp?.superVisorInfo?.police_verification;
      this.documents.police_verification.path =  environment.SUPERVISOR_DOC+""+this.profile_data.police_verification
      }
      console.log("address")
      if(this.profile_data.id_proof.front){
        this.documents.front.name = this.profile_data.id_proof.front;
        if(this.profile_data.id_proof.front && this.profile_data.id_proof.front.split('.').pop()?.toLocaleLowerCase() != "pdf"){
          this.documents.front.path = environment.SUPERVISOR_DOC+""+this.profile_data.id_proof.front

        }
      }

      if(this.profile_data.id_proof.back){
        this.documents.back.name = this.profile_data.id_proof.back;
        if(this.profile_data.id_proof.back && this.profile_data.id_proof.back.split('.').pop()?.toLocaleLowerCase() != "pdf" ){
          this.documents.back.path = environment.SUPERVISOR_DOC+""+this.profile_data.id_proof.back
        }
      }

    })

  }
}
