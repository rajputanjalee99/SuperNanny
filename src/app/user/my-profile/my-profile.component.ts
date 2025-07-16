import { Component, OnInit } from '@angular/core';
import { EmptyResponse, GetProfileResponse, NotificationSetting, NotificationSettingResponse, SupervisorProfile } from 'src/app/models/model';
import { HttpService } from 'src/app/services/http/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  // notificationSetting!: NotificationSetting
  form1 = {
    nanny_message : false,
    nanny_live : false,
  }
  env = environment
  documents = <any> {
    front : {
      path : "./../../assets/img/pdf.png",
      name : "Front"
    },
    back : {
      path : "./../../assets/img/pdf.png",
      name : "Back"
    },
    verificaton : {
      path : "./../../assets/img/pdf.png",
      name : "Verification"
    }
  }
  profile!:SupervisorProfile
  profile_data:any;
  dummy:any = environment.DEFAULT_IMAGE;
  env_doc: any = environment.SUPERVISOR_DOC;
  title= "Profile"
  constructor(private service : HttpService) { 

  }

  address:any;

  ngOnInit(): void {
    this.getNotificationSetting();
    // this.getProfile();
    this.getSuperVisorProfile();
  }

  getNotificationSetting(): void {

    this.service.getNotificationSetting().subscribe((resp:NotificationSettingResponse) => {

      console.log("notification", resp)
      this.form1.nanny_message = resp.data.nany_message
      this.form1.nanny_live = resp.data.nanny_live

    })

  }

  onChange() : void{

    this.service.setNotificationSetting({
      nany_message : this.form1.nanny_message,
      nanny_live : this.form1.nanny_live,
    }).subscribe((resp:EmptyResponse) => {
    
    })

  }

  // getProfile(): void{

  //   this.service.getProfile({}).subscribe((resp:GetProfileResponse) => {

  //     this.profile = resp.data;
  //     console.log("this.profile", this.profile)
  //     if(this.profile.id_proof.front){
  //       this.documents.front.name = this.profile.id_proof.front;
  //       if(this.profile.id_proof.front && this.profile.id_proof.front.split('.').pop()?.toLocaleLowerCase() != "pdf"){
  //         this.documents.front.path = environment.SUPERVISOR_DOC+""+this.profile.id_proof.front

  //       }
  //     }

  //     if(this.profile.id_proof.back){
  //       this.documents.back.name = this.profile.id_proof.back;
  //       if(this.profile.id_proof.back && this.profile.id_proof.back.split('.').pop()?.toLocaleLowerCase() != "pdf" ){
  //         this.documents.back.path = environment.SUPERVISOR_DOC+""+this.profile.id_proof.back
  //       }
  //     }

  //   })

  // }

  getSuperVisorProfile():void{

    this.service.getSuperVisorProfile().subscribe((resp:any) => {
 
      this.profile_data = resp?.superVisorInfo;
      console.log("this.profile", resp)
      if(this.profile_data.police_verification){
      this.documents.verificaton.name = resp?.superVisorInfo?.police_verification;
      this.documents.verificaton.path = environment.PDF_IMAGE
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


  onImgError(event:any) { 
    event.target.src = this.dummy;
  }

  downloadImage(image:any){
    // window.location.assign(this.env_doc+image)
    var file_path = this.env_doc+image;
    var a:any = document.createElement('A');
    a.href = file_path;
    a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

}
