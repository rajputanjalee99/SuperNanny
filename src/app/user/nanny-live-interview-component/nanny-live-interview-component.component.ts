import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/services/http/http.service';
import { environment } from 'src/environments/environment';
declare var JitsiMeetExternalAPI: any;
@Component({
  selector: 'app-nanny-live-interview-component',
  templateUrl: './nanny-live-interview-component.component.html',
  styleUrls: ['./nanny-live-interview-component.component.scss']
})
export class NannyLiveInterviewComponentComponent implements OnInit {
  // liveNanniesList: any[]=[];
  // totalRecord1: any=0;
  // limit1: any=10;
  // offset1: any=0;

  constructor(private service : HttpService, private router: Router,
    private route:ActivatedRoute,private sanitizer: DomSanitizer) { 

  }

  ngOnInit(): void {
    this.getSuperVisorProfile()
    
    // this.getLiveNannies();
  } 
  title= "Live Nannies"
  domain: string = "8x8.vc"; // For self hosted use your domain
  nannies: any[]=[]
  liveNanniesList:any = [];
  videoUrl:any =[];
  room: any;
  options: any;
  api: any;
  user: any;
  room_id: any;
  isAudioMuted = false;
  isVideoMuted = false;
  fileRecordingsEnabled = false;
  dummy:any = environment.DEFAULT_IMAGE;
  NANNY_DOC=environment.USER_PROFILE1
  limit1:number = 10;
  offset1:number = 0;


  getLiveNannies(): void{
    let obj1:any={}
    obj1 = {
  
     limit:this.limit1,
     offset:this.offset1
   }
    this.service.getLiveNanniesInterview(obj1).subscribe((resp:any) => {
      const today = new Date();
      const yesterday = new Date(today);

      yesterday.setDate(yesterday.getDate() - 1);

      this.liveNanniesList = resp?.data?.filter((res:any)=>  { return new Date(res.date) >= yesterday });
      console.log(this.liveNanniesList)
      setTimeout(() => {
        this.jitsiLiveCalls();
      },500)
    })
  }

  jitsiLiveCalls(){
    for(let i = 0 ; i<this.liveNanniesList.length; i++){
      this.jitsi(this.liveNanniesList[i].room_id,i);
    }
  }
  parenturl=environment.USER_PROFILE1
  jitsi(roomID:any,i:number){
    const obj={
      name:this.userDetail?.name,
      email:this.userDetail?.supervisor_id?.email,
      room_id:roomID,
      id:34242342423,
      avatar:''
    
    }
        this.service.getTokenOfJitsi(obj).subscribe((res:any)=>{
          if(res.code==200){
            this.token=res.token


            let id = i;
            let api:any;
            this.options = {
              configOverwrite: { prejoinPageEnabled: false,startWithAudioMuted: true },
              roomName: 'vpaas-magic-cookie-2a3922cfe4a940caae6f9f5f1ad55dcd/'+roomID,
              width: 320,
              height: 190,
              parentNode: document.querySelector('#name'+id),
              
              jwt: this.token,
            }
          api = new JitsiMeetExternalAPI(this.domain,this.options);
          }
          
        })


   
  }
  getSuperVisorProfile():void{

    this.service.getSuperVisorProfile().subscribe((resp:any) => {
      if(resp.code==200){
        this.userDetail = resp?.superVisorInfo;

        
        this.getLiveNannies();
      }

    })

  }
  token:any=''
  
  
  userDetail:any

  timeConversion(time:any){

    if(!time){
      return "-"
    }

   let time_start =time.split(':');
   let hour_start:any;
   let AmPm_start:any;
   let minute_start:any;

  
      hour_start = time_start[0] > 12 ? time_start[0]%12: time_start[0]
      minute_start = time_start[1];
      AmPm_start = time_start[0] > 12 ? 'Pm' : 'Am'

      return hour_start + ':' + minute_start +' '+ AmPm_start
  //  }
}

onImgError(event:any) { 
  event.target.src = this.dummy;
}



// getLiveNannies(): void{
//   let obj1:any={}
//    obj1 = {
 
//     limit:this.limit1,
//     offset:this.offset1
//   }
//   this.service.getLiveNanniesInterview(obj1).subscribe((resp:any) => {
    
//     this.liveNanniesList = resp?.data;
//     this.totalRecord1 =resp?.count;
//   })
// }
// paginationOptionChange1(event:any) {
//   this.limit1 = event.pageSize
//   this.offset1 = event.pageIndex * event.pageSize
//   let obj1:any={}
//    obj1 = {
 
//     limit:this.limit1,
//     offset:this.offset1
//   }
 
//   this.service.getLiveNanniesInterview(obj1).subscribe((resp:any) => {
    
//     this.liveNanniesList = resp?.data;
//     this.totalRecord1 =resp?.count;
//   })
// }

}
