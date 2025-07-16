import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { timeoutWith } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http/http.service';
import { environment } from '../../../environments/environment' 


@Component({
  selector: 'app-booking-view',
  templateUrl: './booking-view.component.html',
  styleUrls: ['./booking-view.component.scss']
})
export class BookingViewComponent implements OnInit {
 title="Booking Details"
  bookingData:any;
  id:any;
  dummy:any = environment.DEFAULT_IMAGE;
  profile_env:any = environment.USER_PROFILE;
  hours_start:any = [];
  minute_start:any = [];
  AmPm_start:any =[];
  hours_expire:any = [];
  minute_expire:any = [];
  AmPm_expire:any = [];
  BookingSlots:any = [];
  constructor(private service : HttpService,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.getBookingDetail();
  }
  bookingDetail: any={}

  getBookingDetail() {
    const obj = {
      id: this.id
    }
    this.service.getBookings(obj).subscribe((res) =>{
      this.bookingDetail = res?.data?.list[0]
      console.log(this.bookingDetail?.nanny_data)
    }

     
    )
  
  }
  availablenanny:any[]=[]


 
  getChild(data: any) {
    if (data?.parentData) {
      return data?.parentData?.no_of_child
    } else if (data?.supervisorData) {
      return data?.supervisorData.no_of_child
    } else {
      return data?.nannyData?.no_of_child
    }
  }



  // editBooking(id:any){
    
  //   const obj ={
  //     nanny_id:id,
  //     id:this.id
      
  //   }
  //   this.service.editBookings(obj).subscribe((res)=>{
  //     console.log(res)
  //     this.myModal.nativeElement.click();
  //     this.service.showSuccessMessage({message:"Assign Successfully"})
  //   },err=>{
  //     this.service.showErrorMessage({message:err})
  //   })

  // }

//   getBookingList(): void {
//   let obj = {
//     id:this.id
//   }

//   this.service.getBookings(obj).subscribe((resp) => {
//     this.bookingData = resp?.data?.list[0];
//     console.log(this.bookingData)
//     if(this.bookingData !== undefined){
//       this.BookingSlots  = this.bookingData?.booking_slots; 
//     this.timeConversion();
//     }
//   })
// }
// timeConversion(){

//   for(let i = 0; i < this.BookingSlots.length ; i++){
//  let time_start = this.BookingSlots[i]?.booking_start_time?.split(':');
//  let time_expire = this.BookingSlots[i]?.booking_expire_time?.split(':');
//  console.log("time", time_expire,time_start)
 
//  if(time_start.length > 1){
//     this.hours_start.push(time_start[0] > 12 ? time_start[0]%12 : time_start[0]);
//     this.AmPm_start.push(time_start[0] > 12 ? 'Pm' : 'Am');
//     this.minute_start.push(time_start[1])
//     console.log("date", this.hours_start,this.AmPm_start,this.minute_start)
//  }
//  if(time_expire.length > 1){
//   this.hours_expire.push(time_expire[0] > 12 ? time_expire[0]%12 : time_expire[0]);
//   this.AmPm_expire.push(time_expire[0] > 12 ? 'Pm' : 'Am');
//   this.minute_expire.push(time_expire[1]);
// }
//   }
// }

onImgError(event:any) { 
  event.target.src = this.dummy;
}

}
