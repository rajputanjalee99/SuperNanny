import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/services/http/http.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

declare var JitsiMeetExternalAPI: any;
declare var Canvas2Image: any;
declare var html2canvas: any;
declare let $: any;


import { NannyProfile, NannyProfileResponse } from 'src/app/models/model';
import { CommonService } from 'src/app/services/common/common.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { throws } from 'assert';
import { HttpErrorResponse } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
// import html2canvas from 'html2canvas';

@Component({
  selector: 'app-watch-full-screen',
  templateUrl: './watch-full-screen.component.html',
  styleUrls: ['./watch-full-screen.component.scss']
})
export class WatchFullScreenComponent implements OnInit {

  domain: string = "8x8.vc"; // For self hosted use your domain
  room: any;
  options: any;
  api: any;
  user: any;
  room_id: any;
  booking_slot: any;
  selected_category:any;
  booking_id: any;
  bookingData: any;
  BookingSlots: any = [];
  hours_start: any = [];
  minute_start: any = [];
  AmPm_start: any = [];
  hours_expire: any = [];
  minute_expire: any = [];
  AmPm_expire: any = [];
  observations_list:any =[];

  screenshot:any='';
  addTask!:FormGroup;

  env: any = environment.NANNY_DOC;
  profile_env: any = environment.USER_PROFILE;
  dummy:any = environment.DEFAULT_IMAGE;
  USER_PROFILE1:any=environment.USER_PROFILE1
  // For Custom Controls
  isAudioMuted = false;
  isVideoMuted = false;
  fileRecordingsEnabled = false;

  food!:FormGroup;
  nap!:FormGroup;
  toilet!:FormGroup;
  play!:FormGroup;
  outdoor!:FormGroup;
  mood!:FormGroup;
  health!:FormGroup;
  safety!:FormGroup;

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
  booking_session_id: any;
  notification_categories: any;
  file_type: any = "image";
  user_id: any;
  getNannyTasks: any []=[];
  task_id: any = null;
  userDetail:any
  title="Bookings"
  getNannyTasksListing: any[]=[];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: HttpService,
    public commonService: CommonService,
    private _formBuilder: FormBuilder,
    private sanitize : DomSanitizer,
  ) {

    this.addTask = this._formBuilder.group({
      time_start:[null],
      time_end:[null],
      title:[null],
    })

    this.food = this._formBuilder.group({
      time:[null,[Validators.required]],
      type:[null,[Validators.required]],
      meal:[null,[Validators.required]],
      meal_type:[null,[Validators.required]],
      meal_item:this._formBuilder.array([
        this._formBuilder.group({
          meal_item:['']
        })
      ]),
      other_comment:[],
    })

    this.nap = this._formBuilder.group({
      time:[null,[Validators.required]],
      nap:[null,[Validators.required]],
      note:[]
    })

    this.toilet = this._formBuilder.group({
      time:[null,[Validators.required]],
      type:[null],
      diaper:[null,[Validators.required]],
      toilet:[null,[Validators.required]],
      note:[],

    })

    this.play = this._formBuilder.group({
      time:[null,[Validators.required]],
      play_learning:[null,[Validators.required]],
      note:[]

     })

    this.outdoor = this._formBuilder.group({
      time:[null,[Validators.required]],
      location:[null,[Validators.required]],
      note:[]

    })

    this.mood = this._formBuilder.group({
      time:[null,[Validators.required]],
      type:[null,[Validators.required]],
      note:[]
    })

    this.health = this._formBuilder.group({
      time:[null,[Validators.required]],
      type:[null,[Validators.required]],
      note:[]
    })

    this.safety = this._formBuilder.group({
      time:[null,[Validators.required]],
      text:[null,[Validators.required]],
      note:[]

    })

   }

   nap_start:boolean = false;
   nap_end:boolean = false;

   diaper_selected:boolean = false;
   toilet_selected:boolean = false;


   fileObj = <any> {
    file: null,
    filename: environment.DEFAULT_IMAGE
  };

   button_not_selected = 'btn btn-primary outLine w-100 mb-0';
   button_selected = 'btn btn-primary w-100 mb-0 '

   types = [{
    type:'food',
    class:this.button_not_selected},
    {type:'bottle',
    class:this.button_not_selected}]

   meals = [{
    type:'full',
    class:this.button_not_selected},
    {type:'most',
    class:this.button_not_selected},
   {type:'half',
    class:this.button_not_selected},
    {type:'small_portion',
    class:this.button_not_selected
   }] 

   diaper_arr = [{
    type:'wet',
    class:this.button_not_selected},
    {type:'potty',
    class:this.button_not_selected},
    {type:'dry',
    class:this.button_not_selected}]

    toilet_arr = [{
      type:'potty',
      class:this.button_not_selected},
      {type:'urine',
      class:this.button_not_selected}]
  

      play_arr = [{
        title:'Play Time',
        type:'play_time',
        class:this.button_not_selected},
        {title:'Learning Activity',
          type:'learning_activity',
        class:this.button_not_selected},
        ]

        nap_arr = [{
          title:'Nap Start',
          type:'nap_start',
          class:this.button_not_selected},
          {title:'Nap End',
            type:'nap_end',
          class:this.button_not_selected}]

         mood_arr = [{
          title:'Happy ',
          type:'happy',
          class:this.button_not_selected},
          {title:'Emotional',
            type:'emotional',
          class:this.button_not_selected},
          {title:'Crying',
          type:'crying',
        class:this.button_not_selected}]

        health_arr = [{
          title:'Fine',
          type:'fine',
          class:this.button_not_selected},
          {title:'Sick',
            type:'sick',
          class:this.button_not_selected},
          {title:'Injured',
          type:'injured',
        class:this.button_not_selected}]

  ngOnInit(): void {
    
    this.room_id = this.route.snapshot.params.room_id;
    this.booking_id = this.route.snapshot.params.booking_id;
    this.booking_slot = this.route.snapshot.params.booking_slot;
    this.getSuperVisorProfile()
    this.getNannyScheduleTask();
 
    
   
    
    this.startBookingSessionInfo();
    
    let username: any = '';
    username = localStorage.getItem("user_details");
    username = JSON.parse(username);
    this.room = this.room_id; // Set your room name
    this.user = {
      name: username.name // Set your username
    }

    this.getNotificationCategories();
  }


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

  getSuperVisorProfile():void{

    this.service.getSuperVisorProfile().subscribe((resp:any) => {
      if(resp.code==200){
        this.userDetail = resp?.superVisorInfo;

        this.getJwtToken()
      }
     
     

    },(err)=>{
      this.service.showErrorMessage({message:err})
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
  token:any=''
ngAfRunte(): void {
    this.options = {
      roomName: 'vpaas-magic-cookie-2a3922cfe4a940caae6f9f5f1ad55dcd/'+this.room,
      width: 550,
      height: 400,
      configOverwrite: { prejoinPageEnabled: false ,startWithAudioMuted: true, enableScreenshotCapture: true

      },
     
      jwt: this.token,
      interfaceConfigOverwrite: {
        AUTO_PIN_LATEST_SCREEN_SHARE: 'remote-only',
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
        DISABLE_RINGING: false,
        HIDE_INVITE_MORE_HEADER: false,
        RECENT_LIST_ENABLED: true,
        hideParticipantsStats: true,
        // overwrite interface properties
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

    // Event handlers
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
      this.router.navigate(['/user/live-nannies']);
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


  startBookingSessionInfo() {
    let obj: any = {
      booking_id: this.booking_id
    }
    if (this.booking_slot != 0) {
      obj["nanny_booking_slot_id"] = this.booking_slot;
    }

    this.service.startBookingSessionInfo(obj).subscribe((resp: any) => {
      this.room_id = resp?.data?.room_id;
      if (resp?.code === 200) {
        this.booking_session_id = resp?.data?._id;
        if (this.booking_session_id !== undefined) {
          this.getBoookingSessionDetail();
        }
      }

    })
  }
  starTimeForSchedule:any
  endTimeForSchedule:any
  getBookingList(): void {
    let obj = {
      id: this.booking_id
    }

    this.service.getBookings(obj).subscribe((resp) => {
      this.bookingData = resp?.data?.list[0];
      this.user_id = resp?.data?.list[0]?.user_id
     
      if (this.bookingData !== undefined) {
        this.BookingSlots = this.bookingData?.booking_slots;

        let start_time=this.BookingSlots[0]?.booking_start_time
        let end_time=this.BookingSlots[0]?.booking_expire_time
       console.log("asdadaaaqqasd",start_time,end_time)

      
         this.filteredBookings = this.getNannyTasks.filter(obj => {
          const startTime = obj.start_time;
          return startTime >= start_time && startTime <= end_time;
        });

        // this.getNannyTasksListing=this.getNannyTasks
        
        this.nanny_id = this.bookingData?.nanny_id;
        this.getNannyProfile();
        this.timeConversion();
      }
    })
  }
  filteredBookings:any[]=[]
  timeToMinutes(timeStr:any){
    if(timeStr){
      const [hour, minute] = timeStr.split(":").map(Number);
      return hour * 60 + minute;
    }
    
  }
  
  getRating(data:any){
    return Math.round(data);
  }
  
  timeConversion() {

    for (let i = 0; i < this.BookingSlots.length; i++) {
      let time_start = this.BookingSlots[i]?.booking_start_time?.split(':');
      let time_expire = this.BookingSlots[i]?.booking_expire_time?.split(':');

      if (time_start.length > 1) {
        this.hours_start.push(time_start[0] > 12 ? time_start[0] % 12 : time_start[0]);
        this.AmPm_start.push(time_start[0] > 12 ? 'Pm' : 'Am');
        this.minute_start.push(time_start[1])
      }
      if (time_expire.length > 1) {
        this.hours_expire.push(time_expire[0] > 12 ? time_expire[0] % 12 : time_expire[0]);
        this.AmPm_expire.push(time_expire[0] > 12 ? 'Pm' : 'Am');
        this.minute_expire.push(time_expire[1]);
      }
    }
  }


  getNannyProfile(): void {

    this.service.getNannyProfile({
      nanny_id: this.nanny_id
    }).subscribe((resp: any) => {
      this.profile = resp.data;
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


    })

  }

  getBoookingSessionDetail() {
    let obj = {
      booking_session_id: this.booking_session_id
    }
    this.service.getBoookingSessionDetail(obj).subscribe((resp: any) => {
    })
  }

  captureScreenshot(): void {

    const isIFrame = (input: HTMLElement | null): input is HTMLIFrameElement =>
    input !== null && input.tagName === 'IFRAME';

    var selector:any = document.body;

    let frame = document.querySelector('iframe');
    if (isIFrame(frame) && frame.contentWindow) {
      selector = frame.contentWindow;
    }

    // selector = document.getElementById("jitsi-iframe")?.contentWindow
    const self = this;
    // const jQuery = $;
    html2canvas(selector, {
      onrendered: function (canvas: any) {
        // document.body.appendChild(canvas);
        self.screenshot = canvas.toDataURL()
        $("#capture-ss").modal("show");
        // return Canvas2Image.saveAsPNG(canvas);
      }
    });
  }


  /////////////////////////////////////////// Notification Code ////////////////////////

  toppings = new FormControl('');

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  toppings_1 = this._formBuilder.group({
    pepperoni: false,
    extracheese: false,
    mushroom: false,
  });

  onSelectImageVideo(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      if (file.type.includes("image")) {
        this.file_type = "image"       
        const previewFile = this.sanitize.bypassSecurityTrustResourceUrl(URL.createObjectURL(file))
        this.fileObj.filename = previewFile;
        this.fileObj.file = file;

      }else if (file.type.includes("video")) {
        this.file_type = "video"      
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          this.fileObj.filename = (<FileReader>event.target).result;
        }
        this.fileObj.file = file;

      } else {
        alert("Image or video are required");
      }
      
      event.srcElement.value = null;

      
    }
  }


  getNotificationCategories(){

    this.service.getNotificationCategories().subscribe((resp:any) => {
      this.notification_categories = resp?.data;
    })
  }

  get meal_item(){
    return this.food.controls['meal_item'] as FormArray
  }

  add_meal_items():void{
  
      const meal_item = this._formBuilder.group({
        meal_item:['',[Validators.required]],
      })
      this.meal_item.push(meal_item)
      
    }

    remove_meal_items(i:any){

    this.meal_item.removeAt(i);
    this.food.patchValue({
      other_comment: `   "Dear ${this.bookingData?.UserDetails?.name}, your child ${this.bookingData?.UserDetails?.parentInfo.child_details.map((res:any)=> res.name).toString()} has just finished their ${this.food.value.meal_type} at ${this.food.value.time} . They had  ${this.food.value.meal} most of their ${this.food.value.type}. ${(this.food.value.meal_item[0] != ' ' ? 'The meal items included '  + (this.food.value.meal_item.map((res:any)=> res.meal_item)).toString() : '')}. Thank you for entrusting us with your child's nutrition!"`
    })
  }

  nap_time(id:any){
    if(id === 'nap_start'){
      this.nap.get('nap')?.setValue(id);
      this.nap_arr[0].class = this.button_selected
      this.nap_arr[1].class = this.button_not_selected
    }
    else if(id === 'nap_end'){
      this.nap.get('nap')?.setValue(id);
      this.nap_arr[1].class = this.button_selected
      this.nap_arr[0].class = this.button_not_selected
    }
  }

  resetImage(){
    this.fileObj.filename = environment.DEFAULT_IMAGE;
    this.file_type = "image";
  }

  
  save(type:string){

    let form_data = new FormData();
    if(type === 'food'){
      console.log(this.food)
      if(this.food.valid){
        let temp:any[] = [...this.meal_item.value]; 
        let meals:any = [];
        temp.forEach((ele:any) => {
          meals.push(ele?.meal_item)
        })
        form_data.append('booking_id',this.booking_id);
        form_data.append('title',type);
        form_data.append('body',this.food.get('other_comment')?.value);
         form_data.append('parent_id',this.user_id);
         form_data.append('routine',this.food.get('type')?.value);
         form_data.append('time',this.food.get('time')?.value);
         form_data.append('meal',this.food.get('meal')?.value);
         form_data.append('meal_type',this.food.get('meal_type')?.value);
         form_data.append('meal_items', JSON.stringify(meals));
         form_data.append('other_comments',this.food.get('other_comment')?.value);
        if(this.fileObj.file){
          if(this.file_type.includes('video')){
  
            form_data.append('media_type','video');
            form_data.append('video',this.fileObj.file );
          }
          if(this.file_type.includes('image')){
  
            form_data.append('media_type','image');
            form_data.append('image',this.fileObj.file );
          }
        }
  
       
         this.sendNotification(form_data,this.food);
         this.types.forEach((element:any) => {
         
            element.class = this.button_not_selected
         
          
          }
        );
        this.meals.forEach((element:any) => {
         
          element.class = this.button_not_selected
       
        
        }
      );
      }else{
        this.service.showErrorMessage({message:'please fill all fields'})
      }
     
    }



    if(type === 'toilet'){
      if(this.toilet.valid){
        let form_data = new FormData();
        form_data.append('time',this.toilet.get('time')?.value);
        form_data.append('title',type);
        form_data.append('booking_id',this.booking_id);
        form_data.append('body',this.toilet.get('note')?.value);
        form_data.append('parent_id',this.user_id);
        
        form_data.append('toilet',this.toilet.get('toilet')?.value);
        form_data.append('diaper',this.toilet.get('diaper')?.value);
        form_data.append('note',this.toilet.get('note')?.value);
  
        this.sendNotification(form_data,this.toilet);
        this.toilet_selected = false;
        this.diaper_selected = false;
      }else{
        this.service.showErrorMessage({message:'please fill all fields'})
      }
      
   }

   if(type === 'nap'){
    if(this.nap.valid){
      let form_data = new FormData();
      form_data.append('title',type);
      form_data.append('body',this.nap.get('note')?.value);
      form_data.append('booking_id',this.booking_id);
       form_data.append('parent_id',this.user_id);
       form_data.append('time',this.nap.get('time')?.value);
       form_data.append('nap',this.nap.get('nap')?.value);
       form_data.append('note',this.nap.get('note')?.value);

      if(this.fileObj.file){
        if(this.file_type.includes('video')){
          form_data.append('media_type','video');
          form_data.append('video',this.fileObj.file );
        }
        if(this.file_type.includes('image')){
          form_data.append('media_type','image');
          form_data.append('image',this.fileObj.file );
        }
      }

       this.sendNotification(form_data,this.nap);
       this.nap_arr[0].class = this.button_not_selected
          this.nap_arr[1].class = this.button_not_selected
    }else{
      this.service.showErrorMessage({message:'please fill all fields'})
    }
   
  }

   if(type === 'play'){
    if(this.play.valid){
      let form_data = new FormData();
      form_data.append('title',type);
      form_data.append('body',this.play.get('note')?.value);
      form_data.append('booking_id',this.booking_id);
      form_data.append('parent_id',this.user_id);
      form_data.append('time',this.play.get('time')?.value);
      form_data.append('note',this.play.get('note')?.value);
      form_data.append('activity_type',this.play.get('play_learning')?.value);
  
      if(this.fileObj.file){
        if(this.file_type.includes('video')){
  
          form_data.append('media_type','video');
          form_data.append('video',this.fileObj.file );
        }
        if(this.file_type.includes('image')){
  
          form_data.append('media_type','image');
          form_data.append('image',this.fileObj.file );
        }
      }
  
      this.sendNotification(form_data,this.play);
    }else{
      this.service.showErrorMessage({message:'please fill all fields'})
    }

    
 }

 if(type === 'outdoor'){
  if(this.outdoor.valid){
    let form_data = new FormData();
    form_data.append('title',type);
    form_data.append('booking_id',this.booking_id);
    form_data.append('body',this.outdoor.get('note')?.value);
    form_data.append('parent_id',this.user_id);
    form_data.append('time',this.outdoor.get('time')?.value);
    form_data.append('location',this.outdoor.get('location')?.value);
    form_data.append('note',this.outdoor.get('note')?.value);
  
    if(this.fileObj.file){
      if(this.file_type.includes('video')){
        form_data.append('media_type','video');
        form_data.append('video',this.fileObj.file );
      }
      if(this.file_type.includes('image')){
        form_data.append('media_type','image');
        form_data.append('image',this.fileObj.file );
      }
    }
  
     this.sendNotification(form_data,this.outdoor);
  }else{
    this.service.showErrorMessage({message:'please fill all fields'})
  }

 
}

if(type === 'mood'){
  if(this.mood.valid){
    let form_data = new FormData();
    form_data.append('title',type);
    form_data.append('booking_id',this.booking_id);
    form_data.append('body',this.mood.get('note')?.value);
    form_data.append('parent_id',this.user_id);
    form_data.append('time',this.mood.get('time')?.value);
    form_data.append('mood',this.mood.get('type')?.value);
    form_data.append('note',this.mood.get('note')?.value);
    if(this.fileObj.file){
      if(this.file_type.includes('video')){
        form_data.append('media_type','video');
        form_data.append('video',this.fileObj.file );
      }
      if(this.file_type.includes('image')){
        form_data.append('media_type','image');
        form_data.append('image',this.fileObj.file );
      }
    }
    this.sendNotification(form_data,this.mood);
  }else{
    this.service.showErrorMessage({message:'please fill all fields'})
  }
  
   
}

if(type === 'health'){
  if(this.health.valid){
    let form_data = new FormData();
    form_data.append('title',type);
    form_data.append('booking_id',this.booking_id);
    form_data.append('body',this.health.get('note')?.value);
    form_data.append('parent_id',this.user_id);
    form_data.append('observation',JSON.stringify(this.observations_list));
    form_data.append('time',this.health.get('time')?.value);
    form_data.append('health',this.health.get('type')?.value);
    form_data.append('note',this.health.get('note')?.value);
  
    if(this.fileObj.file){
      if(this.file_type.includes('video')){
        form_data.append('media_type','video');
        form_data.append('video',this.fileObj.file );
      }
      if(this.file_type.includes('image')){
        form_data.append('media_type','image');
        form_data.append('image',this.fileObj.file );
      }
    }
  
    this.sendNotification(form_data,this.health);
  }else{
    this.service.showErrorMessage({message:'please fill all fields'})
  }
  
   
}

if(type === 'safety'){
  if(this.safety.valid){
    let form_data = new FormData();
    form_data.append('booking_id',this.booking_id);
    form_data.append('title',type);
    form_data.append('body',this.safety.get('note')?.value);
    form_data.append('parent_id',this.user_id);
    form_data.append('time',this.safety.get('time')?.value);
    form_data.append('note',this.safety.get('note')?.value);
  
    if(this.fileObj.file){
      if(this.file_type.includes('video')){
        form_data.append('media_type','video');
        form_data.append('video',this.fileObj.file );
      }
      if(this.file_type.includes('image')){
        form_data.append('media_type','image');
        form_data.append('image',this.fileObj.file );
      }
    }
  
    this.sendNotification(form_data,this.safety);
     
  }else{
    this.service.showErrorMessage({message:'please fill all fields'})
  }
  
}
  }

 sendNotification(obj:any,formType:any){
   this.service.sendNotification(obj).subscribe((resp:any) => {
     this.service.showSuccessMessage({
      message: "Notification Send Successfully"
     })
     this.fileObj = {
      file: null,
      filename: environment.DEFAULT_IMAGE
    };
        formType.reset()
   },(error:HttpErrorResponse) => {
      this.service.showErrorMessage({
        message:error?.error?.errors?.msg
      })
   })
 } 

  buttonState(type:any,id:any) {
    if(id === 'types'){
    this.types.forEach((element:any) => {
      if(element?.type === type){
        element.button_status = true;
        this.food.get('type')?.setValue(type)
        element.class = this.button_selected
        this.types.forEach((element:any) => {
          if(element?.type !== type){
            element.class = this.button_not_selected
          }
        }) 
      }
    });
  }
  if(id === 'meals'){

    this.meals.forEach((element:any) => {
      if(element?.type === type){
        element.button_status = true;
        this.food.get('meal')?.setValue(type)
        element.class = this.button_selected
        
        this.meals.forEach((element:any) => {
          if(element?.type !== type){
            element.class = this.button_not_selected
          }
        }) 
      }
    });

  }
   }
   toiletType:any=''
   toilet_diaper(selected:string){
    this.toiletType=selected
   
    if(selected === 'toilet'){
      this.toilet_selected = true;
      this.diaper_selected = false;
      this.toilet.controls["toilet"].setValidators([Validators.required]);
      this.toilet.controls["toilet"].updateValueAndValidity();
      this.toilet.controls["diaper"].setValidators([]);
      this.toilet.controls["diaper"].updateValueAndValidity();
      this.toilet.patchValue({
         toilet:''
      })
      this.getValForm('toilet',this.toilet)
    }
    else if(selected === 'diaper'){
      this.toilet_selected = false;
      this.diaper_selected = true;
      this.toilet.controls["diaper"].setValidators([Validators.required]);
      this.toilet.controls["diaper"].updateValueAndValidity();
      this.toilet.controls["toilet"].setValidators([]);
      this.toilet.controls["toilet"].updateValueAndValidity();
      this.toilet.patchValue({
        diaper:''
      })
      this.getValForm('toilet',this.toilet)

    }
    
   } 

   buttonState_toilet(type:any,id:any) {
    if(id === 'toilet'){
   
   
    
    this.toilet_arr.forEach((element:any) => {
      if(element?.type === type){
        element.button_status = true;
        this.toilet.get('toilet')?.setValue(type)
        element.class = this.button_selected
       
        this.toilet_arr.forEach((element:any) => {
          if(element?.type !== type){
            element.class = this.button_not_selected
          }
        }) 
      }
    });
    this.toilet_selected = true;
    this.diaper_selected = false;
  }
  if(id === 'diaper'){
    
    this.diaper_arr.forEach((element:any) => {
      if(element?.type === type){
        element.button_status = true;
        this.toilet.get('diaper')?.setValue(type)
        element.class = this.button_selected
       
        this.diaper_arr.forEach((element:any) => {
          if(element?.type !== type){
            element.class = this.button_not_selected
          }
        }) 
      }
    });
    this.toilet_selected = false;
    this.diaper_selected = true;
  }
   }

   buttonState_play(id:any){

    if(id === 'play_time'){
      this.play.get('play_learning')?.setValue(id);
      this.play_arr[0].class = this.button_selected;
      this.play_arr[1].class = this.button_not_selected
    }

    else if(id === 'learning_activity'){
      this.play.get('play_learning')?.setValue(id);
      this.play_arr[0].class = this.button_not_selected;
      this.play_arr[1].class = this.button_selected
    }

   }

   buttonState_mood(id:any){

    if(id === 'happy'){
      this.mood.get('type')?.setValue(id);
      this.mood_arr[0].class = this.button_selected;
      this.mood_arr[1].class = this.button_not_selected
      this.mood_arr[2].class = this.button_not_selected
    }

    else if(id === 'emotional'){
      this.mood.get('type')?.setValue(id);
      this.mood_arr[0].class = this.button_not_selected;
      this.mood_arr[1].class = this.button_selected
      this.mood_arr[2].class = this.button_not_selected;
    }

    else if(id === 'crying'){
      this.mood.get('type')?.setValue(id);
      this.mood_arr[0].class = this.button_not_selected;
      this.mood_arr[1].class = this.button_not_selected;
      this.mood_arr[2].class = this.button_selected
    }

   }
   healthstatus:any=''
   buttonState_health(id:any){
    this.healthstatus=id
    if(id === 'fine'){
      this.health.get('type')?.setValue(id);
      this.health_arr[0].class = this.button_selected;
      this.health_arr[1].class = this.button_not_selected
      this.health_arr[2].class = this.button_not_selected
    }

    else if(id === 'sick'){
      this.health.get('type')?.setValue(id);
      this.health_arr[0].class = this.button_not_selected;
      this.health_arr[1].class = this.button_selected
      this.health_arr[2].class = this.button_not_selected;
    }

    else if(id === 'injured'){
      this.health.get('type')?.setValue(id);
      this.health_arr[0].class = this.button_not_selected;
      this.health_arr[1].class = this.button_not_selected;
      this.health_arr[2].class = this.button_selected
    }


   }

   observations(event:any,obser:any){
    
    if(event?.checked === true){
       this.observations_list.push(obser);
     
       this.getValForm('health',this.health)
    }

    if(event?.checked === false){
      this.observations_list = this.observations_list.filter((e:any) => e !== obser);
     
      this.getValForm('health',this.health)
    }

   }

   onImgError(event:any) { 
    event.target.src = this.dummy;
  }

  downloadImage(image:any){
    window.open(this.env+image,'_blank')
  }
   
  screenshot_byjitsi(){
    this.screenshot=''
   
    this.api.captureLargeVideoScreenshot().then((data:any) => {
      
       if(data.error){
       
         this.service.showErrorMessage({
          message:"Video Call not in a session"
         })
       }
       else{
        const image_data =  data.dataURL;
        this.screenshot = image_data;
       }
  });

  }

  save_screenshot(type:any){
    if(type=='save'){
      const downloadLink = document.createElement('a');
      const time = new Date().toString();
      const fileName = 'screenshot'+time;
  
      downloadLink.href = this.screenshot;
      downloadLink.download = fileName;
      downloadLink.click();
      this.screenshot=''
    }else{
      this.screenshot=''
    }
    
  }

  getNannyScheduleTask(){
    let obj = {
      nanny_booking_id:this.booking_id
    } 

    this.service.getNannyScheduleTask(obj).subscribe((resp:any) => {
     
      if(resp?.code === 200){
        this.getNannyTasks = resp?.result;

        this.getBookingList();
      }
    })
  }






getDob(date:any){
  let newDate= new Date(date)
  return newDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
}
  save_addTask(){
   

    if(this.booking_id !== 0){
    let obj = {
      nanny_booking_id:this.booking_id,
      title:this.addTask.get('title')?.value,
      start_time:this.addTask.get('time_start')?.value,
      end_time:this.addTask.get('time_end')?.value,
    }

    this.service.addNannyScheduleTask(obj).subscribe((resp:any) => {
     

      if(resp?.code === 200){
        this.service.showSuccessMessage({
          message:"Task is Added"
        })
        this.getNannyScheduleTask();
      }
    })
  }
  else {
    this.service.showErrorMessage({
      message:"No Booking Is Empty"
    })
  }
  }

  assignTaskID(id:any){
    
    this.task_id = id;
  }

  editNannyScheduleTask(marker:any){
    if(this.task_id !== null){
    let obj = {
      id:this.task_id,
      mark:marker
    }

    this.service.editNannyScheduleTask(obj).subscribe((resp:any)=>{
    
      if(resp?.code === 200){
        this.service.showSuccessMessage({
          message:"Task Marked as "+marker
        })
        this.getNannyScheduleTask();
      }
    })
  }
  else{
    this.service.showErrorMessage({
      message:"Task ID is Null"
    })
  }
  }

  timeConversion2(time:any){

    if(!time){
      return "--"
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

todaydate(){
  let currentDate =  new Date().toUTCString().slice(5, 16);
    return currentDate
}

getValForm(type:any,data:any){
      if(type=='food'  ){
       
        if(data.value.type && data.value.meal_type && data.value.time){
          data.patchValue({
            other_comment: `   "Dear ${this.bookingData?.UserDetails?.name}, your child ${this.bookingData?.child_obj?.name} has just finished their ${data.value.meal_type} at ${data.value.time}.They had a ${data.value.meal} portion of their ${data.value.type}. ${(data.value.meal_item[0]?.meal_item == '' ? '' : 'The meal items included '  + (data.value.meal_item.map((res:any)=> res.meal_item)).toString())}. Thank you for entrusting us with your child's nutrition!"`
          })
        
        }else{
          data.patchValue({
            other_comment: ''
          })
        }
        
      }
      
      if(type=='nap' ){
        
        if(data.value.nap  &&  data.value.time){
          if(data.value.nap=='nap_start'){
            data.patchValue({
              note: `  "Dear ${this.bookingData?.UserDetails?.name}, your child ${this.bookingData?.child_obj?.name} has just started their nap at ${data.value.time}. We will ensure they have a comfortable and restful sleep. Thank you for entrusting us with your child's well-being!"`
            })
          }else{
            data.patchValue({
              note: `  "Dear ${this.bookingData?.UserDetails?.name}, your child ${this.bookingData?.child_obj?.name} has just woken up from their nap, which ended at ${data.value.time}. They had a restful sleep and are now refreshed and ready for more activities. Thank you for entrusting us with your child's well-being!"`
            })
          }
         
        }else{
          data.patchValue({
            note: ''
          })
        }
        
      
      
      }if(type=='toilet' &&  (data.value.diaper || data.value.toilet) && data.value.time && this.toiletType){
        if(this.toiletType=='toilet'){
          if((data.value.toilet)){
            data.patchValue({
              note: `"Dear ${this.bookingData?.UserDetails?.name}, at ${data.value.time},  your child  ${this.bookingData?.child_obj?.name} used the toilet for  ${data.value.toilet} . They are doing well with their restroom habits. Thank you for entrusting us with your child's care!"`
            })
          }else{
            data.patchValue({
              note: ''
            })
          }
        }else{
          if((data.value.diaper)){
            data.patchValue({
              note: `"Dear ${this.bookingData?.UserDetails?.name}, at ${data.value.time}, we changed your child ${this.bookingData?.child_obj?.name}'s diaper. The diaper had ${data.value.diaper} prior to the change. Your child is now clean and comfortable. Thank you for entrusting us with your child's care!"`
            })
          }else{
            data.patchValue({
              note: ''
            })
          }
        }
       
       
      }if(type=='play' ){
        if(data.value.play_learning && data.value.time){
          data.patchValue({
            note: ` "Dear ${this.bookingData?.UserDetails?.name}, at ${data.value.time}, your child ${this.bookingData?.child_obj?.name} participated in  ${data.value.play_learning} with their nanny. They had a great time and enjoyed exploring new skills. Thank you for entrusting us with your child's growth and development!"`
          })
        }else{
          data.patchValue({
            note: ''
          })
        }
        
      }if(type=='outdoor'){
        if(data.value.location && data.value.time){
          data.patchValue({
            note: ` "Dear ${this.bookingData?.UserDetails?.name}, at ${data.value.time}, your child ${this.bookingData?.child_obj?.name} participated in an outdoor activity at ${data.value.location}. They had a wonderful time exploring and enjoying the fresh air. Thank you for entrusting us with your child's growth and development!"`
          })
        }else{
          data.patchValue({
            note: ''
          })
        }
        
      }if(type=='mood'){
        if(data.value.type && data.value.time){
          data.patchValue({
            note: `"Dear ${this.bookingData?.UserDetails?.name}, at ${data.value.time}, your child ${this.bookingData?.child_obj?.name} was observed to be ${data.value.type}. We are closely monitoring their mood and ensuring they receive the appropriate care and support. Thank you for entrusting us with your child's well-being!"`
          })
        }else{
          data.patchValue({
            note: ''
          })
        }
       
      }if(type=='health' && data.value.time){
        if(data.value.type){
          data.patchValue({
            note:`Dear ${this.bookingData?.UserDetails?.name}, at ${data.value.time}, we observed your child ${this.bookingData?.child_obj?.name}'s health status to be ${data.value.type} ${data.value.type=='sick with' ? this.observations_list.toString() : ''}. Thank you for entrusting us with your child's well-being!`
          })
        }else{
          data.patchValue({
            note: ''
          })
        }
        
      }if(type=='safety' && data.value.time){
        if(data.value.text){
          data.patchValue({
            note: ` Dear ${this.bookingData?.UserDetails?.name}, at ${data.value.time}, we wanted to inform you about a safety/supplies-related update: ${data.value.text}. We are committed to maintaining a secure and well-equipped environment for your child ${this.bookingData?.UserDetails?.parentInfo.child_details.map((res:any)=> res.name).toString()}. Thank you for entrusting us with their care!"`
          })
        }else{
          data.patchValue({
            note: ''
          })
        }
      
      }
    }

}

function timeToMinutes(arg0: string) {
  throw new Error('Function not implemented.');
}

