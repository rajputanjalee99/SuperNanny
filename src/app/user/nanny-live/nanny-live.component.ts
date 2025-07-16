import { Component, OnInit, Pipe } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignedNannies } from 'src/app/models/model';
import { HttpService } from 'src/app/services/http/http.service';
import { environment } from 'src/environments/environment';
declare var JitsiMeetExternalAPI: any;


// @Pipe({name: 'secureUrl'})
// export class Url {

//   constructor(private sanitizer:DomSanitizer){
//     this.sanitizer = sanitizer;
//   }

//   transform(url:any) {
//         return this.sanitizer.bypassSecurityTrustResourceUrl(url);            
//   }
// }


@Component({
  selector: 'app-nanny-live',
  templateUrl: './nanny-live.component.html',
  styleUrls: ['./nanny-live.component.scss']
})
export class NannyLiveComponent implements OnInit {
  title= "Live Nannies"
  domain: string = "8x8.vc"; // For self hosted use your domain
  nannies!: AssignedNannies[]
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
  constructor(private service : HttpService, private router: Router,
    private route:ActivatedRoute,private sanitizer: DomSanitizer) { }
    userDetail: any
  ngOnInit(): void {
    this.getSuperVisorProfile()
    
  }

  getLiveNannies(): void{
    this.service.getLiveNannies().subscribe((resp:any) => {
      console.log("resp", resp);
      this.liveNanniesList = resp?.data;
      setTimeout(() => {
        this.jitsiLiveCalls();
      },500)
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
  
  getJwtToken(){
    const obj={
      name:this.userDetail?.name,
      email:this.userDetail?.supervisor_id?.email,
      room_id:this.room_id,
      id:34242342423,
      avatar:''
    
    }
        this.service.getTokenOfJitsi(obj).subscribe((res:any)=>{
          if(res.code==200){
            this.token=res?.token
          }
          
        })
      }

  jitsiLiveCalls(){
    for(let i = 0 ; i<this.liveNanniesList.length; i++){
      this.jitsi(this.liveNanniesList[i]?.room_id,i);
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
            configOverwrite: { prejoinPageEnabled: false ,startWithAudioMuted: true},
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

  timeConversion(time:any){

    if(!time){
      return "-"
    }

   let time_start =time.split(':');
   let hour_start:any;
   let AmPm_start:any;
   let minute_start:any;

  //  console.log("time",time_start)
   
  //  if(time_start.length > 1){
      hour_start = time_start[0] > 12 ? time_start[0]%12: time_start[0]
      minute_start = time_start[1];
      AmPm_start = time_start[0] > 12 ? 'Pm' : 'Am'

      return hour_start + ':' + minute_start +' '+ AmPm_start
  //  }
}

onImgError(event:any) { 
  event.target.src = this.dummy;
}
}
