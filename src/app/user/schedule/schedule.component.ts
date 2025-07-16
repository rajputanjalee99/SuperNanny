import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { timeoutWith } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http/http.service';
import { environment } from '../../../environments/environment' 
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  
  selected: Date | null | undefined;
  schedule_Data_List : any[] = [];
  video_schedule_list : any[] = [];
  nanny_booking_list :any[] = [];

  title= "Schedule"
  constructor(private service : HttpService,private route:ActivatedRoute,public datepipe: DatePipe) { }


  ngOnInit(): void {
    console.log("selected",this.selected);
    this.selected = new Date();
    this.schedule_list()
  }

  schedule_list(){

    let obj = {
      date: this.datepipe.transform(this.selected,'yyyy-MM-dd')
    }

    this.service.scheduleByDate(obj).subscribe((resp:any) =>{
      console.log("resp", resp);
      if(resp?.code == 200)
      this.schedule_Data_List = resp?.data; 
       this.nanny_booking_list = [];
        this.video_schedule_list = [];
      for(let i = 0 ; i < this.schedule_Data_List.length ; i++){
        if(this.schedule_Data_List[i]?.nannyBooking){
          this.nanny_booking_list.push(this.schedule_Data_List[i])
          console.log("nanny booking ",this.nanny_booking_list )
        }
        else{
          this.video_schedule_list.push(this.schedule_Data_List[i])
          console.log("nanny video ",this.video_schedule_list )
        }
      }
     
    })

  }

  timeConversion(time:any){

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
}
