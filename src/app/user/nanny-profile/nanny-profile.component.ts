import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NannyProfile, NannyProfileResponse } from 'src/app/models/model';
import { CommonService } from 'src/app/services/common/common.service';
import { HttpService } from 'src/app/services/http/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nanny-profile',
  templateUrl: './nanny-profile.component.html',
  styleUrls: ['./nanny-profile.component.scss']
})
export class NannyProfileComponent implements OnInit {
 title= "Nanny Profile"
  nanny_id:string = "";
  profile : any;
  env: any = environment.NANNY_DOC;
  profile_env: any = environment.USER_PROFILE;
  dummy:any = environment.DEFAULT_IMAGE;
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

  constructor(private route : ActivatedRoute, private service : HttpService, public commonService : CommonService) { 
    this.nanny_id = this.route.snapshot.params.nanny_id;   

  }

  ngOnInit(): void {
    this.getNannyProfile();
  }
  getRating(data:any){
    return Math.round(data);
  }
  getNannyProfile(): void {

    this.service.getNannyProfile({
      nanny_id : this.nanny_id
    }).subscribe((resp : any) => {
      this.profile = resp.data;

      if (this.profile.nannyInfo.front_doc) {
        this.documents.front.name = this.profile.nannyInfo.front_doc;
        if (this.profile.nannyInfo.front_doc && this.profile.nannyInfo.front_doc.split('.').pop()?.toLocaleLowerCase() != "pdf") {
          this.documents.front.path = this.env+this.profile.nannyInfo.front_doc

        }
      }

      if (this.profile.nannyInfo.back_doc) {
        this.documents.back.name = this.profile.nannyInfo.back_doc;
        if (this.profile.nannyInfo.back_doc && this.profile.nannyInfo.back_doc.split('.').pop()?.toLocaleLowerCase() != "pdf") {
          this.documents.back.path = this.env+this.profile.nannyInfo.back_doc;
        }
      }

      if (this.profile.nannyInfo.police_verification) {
        this.documents.verificaton.name = this.profile.nannyInfo.police_verification;
        this.documents.verificaton.path = environment.PDF_IMAGE;
      }
      

    })

  }

  onImgError(event:any) { 
    event.target.src = this.dummy;
  }

  downloadImage(image:any){
    window.open(this.env+image,'_blank')
  }


}
