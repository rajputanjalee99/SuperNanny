import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-profile-approval-page',
  templateUrl: './profile-approval-page.component.html',
  styleUrls: ['./profile-approval-page.component.scss']
})
export class ProfileApprovalPageComponent implements OnInit {
  title= "Profile Approval"
  constructor(private service : HttpService, private router : Router,private commonService : CommonService) {
    this.getSuperVisorProfile()
   }
  supervisorData:any
  ngOnInit(): void {
    
  
  }
  getSuperVisorProfile():void{

    this.service.getSuperVisorProfile().subscribe((res:any) => {
      if(res.code==200){
        this.supervisorData=res
        console.log(this.supervisorData?.user?.admin_approval)
        
        }
      })
    }
  logout(): void {
    this.commonService.logout();
    this.router.navigate(['/'])
  }
  navigate(){
    console.log('done')
    this.router.navigate(['/auth/register-step'])
  }

}
