import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  title= "Help"
  bookingList: any[]=[];
  totalRecord: any;
  search: any;
  limit: any=10;
  offset: any=0;
  Querie:FormGroup
  date_of_service: any;
  time_of_service: any;
  nanny_booking_id: any;
  constructor(private service : HttpService,private fb:FormBuilder) {

    this.Querie=this.fb.group({
      additional_details:['',[Validators.required]],
      was_anyone_injured:['',[Validators.required]]
    })
   }

  ngOnInit(): void {
    this.getFaq()
    this.getBookingList()
  }

  getBookingList(): void {

    let obj = {
      status:'ongoing',
      limit:Number.MAX_SAFE_INTEGER,
      offset:this.offset
    }

    this.service.getBookingsBystatus(obj).subscribe((resp) => {
      console.log(resp)
      this.bookingList = resp?.data?.list;
      this.totalRecord =resp?.data?.count;
    })

  }
  paginationOptionChange(event:any) {
    
    this.limit = event.pageSize
    this.offset = event.pageIndex * event.pageSize
    let obj = {
      status:'ongoing',
      limit:this.limit,
      offset:this.offset
    }
    this.service.getBookings(obj).subscribe((resp) => {
      console.log(resp)
      this.bookingList = resp?.data?.list;
      this.totalRecord =resp?.data?.count;
    })
  }

  faq:any[]=[]
  getFaq(){
    this.service.getFaq().subscribe((resp:any) => {
    
      if(resp?.code === 200){
        this.faq=resp.data
      
     }
     }
     ,(error:HttpErrorResponse) => {
       this.service.showErrorMessage({
         message:error?.error?.errors?.msg
       })
  })
}

sendReport(){
  if(this.Querie.valid){
    let obj={
      was_anyone_injured:this.Querie.value.was_anyone_injured,
      additional_details:this.Querie.value.additional_details,
      date_of_service:this.date_of_service,
      time_of_service:this.time_of_service,
      nanny_booking_id:this.nanny_booking_id,
    }
    this.service.sendReport(obj).subscribe((resp) => {
      this.Querie.reset()
      this.service.showSuccessMessage({message:'Send Querie Successfully'})
    },(err:any)=>{
      this.service.showSuccessMessage({message:err})
    })
  
  }else{
    this.service.showSuccessMessage({message:'please fill all fields'})
  }
  
}
viewButton(id:any,date:any,time:any){
  this.date_of_service=date
  this.time_of_service=time
  this.nanny_booking_id=id
}

selectedAccordian:any=''
selectAccordian(id:any){

this.selectedAccordian=id
console.log(this.selectedAccordian)
}
}
