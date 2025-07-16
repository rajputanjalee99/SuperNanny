import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { HttpService } from 'src/app/services/http/http.service';
import { environment } from 'src/environments/environment';
declare var JitsiMeetExternalAPI: any;
@Component({
  selector: 'app-watch-interview',
  templateUrl: './watch-interview.component.html',
  styleUrls: ['./watch-interview.component.scss']
})
export class WatchInterviewComponent implements OnInit {
  room_id: any;
  booking_id: any;
  InterviewId: any;
  
  booking_session_id: any;
  InterviewDetails: any;
  domain: string = '8x8.vc'; // For self hosted use your domain
  room: any;
  options: any;
  api: any;
  user: any;
  booking_slot: any;
  selected_category:any;
  
  bookingData: any;
  BookingSlots: any = [];
  hours_start: any = [];
  minute_start: any = [];
  AmPm_start: any = [];
  hours_expire: any = [];
  minute_expire: any = [];
  AmPm_expire: any = [];
  observations_list:any =[];

  

  env: any = environment.NANNY_DOC;
  profile_env: any = environment.USER_PROFILE;
  dummy:any = environment.DEFAULT_IMAGE;
  USER_PROFILE1:any=environment.USER_PROFILE1
  // For Custom Controls
  isAudioMuted = false;
  isVideoMuted = false;
  fileRecordingsEnabled = false;

  

  nanny_id: string = "";
  profile: any;
  documents = <any>{
    front: {
      path: "./../../assets/img/pdf.png",
      name: "Front"
    },
    back: {
      path: "./../../assets/img/pdf.png",
      name: "Back"
    },
    verificaton: {
      path: "./../../assets/img/pdf.png",
      name: "Verification"
    }
  }
 
  notification_categories: any;
  file_type: any = "image";
  user_id: any;
  getNannyTasks: any []=[];
  task_id: any = null;

  title="Bookings"
  constructor( private router: Router,
    private route: ActivatedRoute,
    private service: HttpService,
    public commonService: CommonService,
    private _formBuilder: FormBuilder,
    private sanitize : DomSanitizer,) {
      this.getSuperVisorProfile()
     }

  ngOnInit(): void {
    this.room_id = this.route.snapshot.params.room_id;
    this.InterviewId = this.route.snapshot.params.InterviewId;
    let username: any = '';
    username = localStorage.getItem("user_details");
    username = JSON.parse(username);
    this.room = this.room_id; // Set your room name
    this.user = {
      name: username.name // Set your username
    }
    this.getInterviewDetails()
    
  }
  
  onImgError(event:any) { 
    event.target.src = this.dummy;
  }
  getDob(date:any){
    let newDate= new Date(date)
    return newDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
  }
  downloadImage(image:any){
    window.open(this.env+image,'_blank')
  }
  todaydate(){
    let currentDate =  new Date().toUTCString().slice(5, 16);
      return currentDate
  }
  getInterviewDetails(){
    let obj: any = {
      interview_id: this.InterviewId
    }
   

   
    this.service.getLiveNanniesInterviewById(obj).subscribe((resp: any) => {
      
      if (resp?.code === 200) {
        this.InterviewDetails = resp?.data
        this.profile = resp?.data?.nanny_id;
        if (this.profile.nannyInfo.front_doc) {
          this.documents.front.name = this.profile.nannyInfo.front_doc;
          if (this.profile.nannyInfo.front_doc && this.profile.nannyInfo.front_doc.split('.').pop()?.toLocaleLowerCase() != "pdf") {
            this.documents.front.path = this.env+ this.profile.nannyInfo.front_doc
  
          }
        }
  
        if (this.profile.nannyInfo.back_doc) {
          this.documents.back.name = this.profile.nannyInfo.back_doc;
          if (this.profile.nannyInfo.back_doc && this.profile.nannyInfo.back_doc.split('.').pop()?.toLocaleLowerCase() != "pdf") {
            this.documents.back.path = this.env+ + this.profile.nannyInfo.back_doc;
          }
        }
  
        if (this.profile.nannyInfo.police_verification) {
          this.documents.verificaton.name = this.profile.nannyInfo.police_verification;
          this.documents.verificaton.path = environment.PDF_IMAGE;
        }
      }

      // this.InterviewDetails.user_id.parentInfo = null

    })
    
  }
  handleClose = () => {
   
  }

  handleParticipantLeft = async (participant: any) => {
    // { id: "2baa184e" }
    const data = await this.getParticipants();
  }

  handleParticipantJoined = async (participant: any) => {
    // { id: "2baa184e", displayName: "Shanu Verma", formattedDisplayName: "Shanu Verma" }
    const data = await this.getParticipants();
  }

  handleVideoConferenceJoined = async (participant: any) => {
     // { roomName: "bwb-bfqi-vmh", id: "8c35a951", displayName: "Akash Verma", formattedDisplayName: "Akash Verma (me)"}
    const data = await this.getParticipants();
  }

  handleVideoConferenceLeft = () => {
   
    this.router.navigate(['/user/live-nannies']);
  }

  handleMuteStatus = (audio: any) => {
    // { muted: true }
  }

  handleVideoStatus = (video: any) => {
   // { muted: true }
  }

  getParticipants() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.api.getParticipantsInfo()); // get all participants
      }, 500)
    });
  }
  getSuperVisorProfile():void{

    this.service.getSuperVisorProfile().subscribe((resp:any) => {
 
     
     
      if(resp.code==200){
        this.userDetail = resp?.superVisorInfo;

        this.getJwtToken()
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
            this.token=res.token
            this.ngAfRunte()
          }
          
        })
      }



  userDetail:any
  ngAfRunte(): void {
    
    this.options = {
      roomName:'vpaas-magic-cookie-2a3922cfe4a940caae6f9f5f1ad55dcd/'+this.room,
      width: 550,
      height: 400,
      configOverwrite: { prejoinPageEnabled: false ,startWithAudioMuted: true},
     
      jwt: this.token,
      interfaceConfigOverwrite: {
        AUTO_PIN_LATEST_SCREEN_SHARE: 'remote-only',
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
        DISABLE_RINGING: false,
        HIDE_INVITE_MORE_HEADER: false,
        RECENT_LIST_ENABLED: true,
        hideParticipantsStats: true,
       
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'hangup', 'raisehand',
          'videoquality', 'recording'
        ] // ok
      },
      filmstrip: {
        
        disableStageFilmstrip: false
      },
      parentNode: document.querySelector('#jitsi-iframe'),
     
    }

    this.api = new JitsiMeetExternalAPI(this.domain, this.options);

  
    this.api.addEventListeners({
      readyToClose: this.handleClose,
      participantLeft: this.handleParticipantLeft,
      participantJoined: this.handleParticipantJoined,
      videoConferenceJoined: this.handleVideoConferenceJoined,
      videoConferenceLeft: this.handleVideoConferenceLeft,
      audioMuteStatusChanged: this.handleMuteStatus,
      videoMuteStatusChanged: this.handleVideoStatus
    });
  }

  executeCommand(command: string) {
    this.api.executeCommand(command);;
    if (command == 'hangup') {
      this.router.navigate(['/user/live-interview']);
      return;
    }

    if (command == 'toggleAudio') {
      this.isAudioMuted = !this.isAudioMuted;
    }

    if (command == 'toggleVideo') {
      this.isVideoMuted = !this.isVideoMuted;
    }
    if (command == 'toggleRecording') {
      this.isVideoMuted = !this.fileRecordingsEnabled;
    }
  }
  getRating(data:any){
    return Math.round(data);
  }
}
