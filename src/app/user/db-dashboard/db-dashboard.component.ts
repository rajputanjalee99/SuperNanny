import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AssignedNannies, AssignedNanniesResponse } from 'src/app/models/model';
import { HttpService } from 'src/app/services/http/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-db-dashboard',
  templateUrl: './db-dashboard.component.html',
  styleUrls: ['./db-dashboard.component.scss']
})
export class DbDashboardComponent implements OnInit {
  url=environment.NANNY_DOC
  nannies:any = []
  env = environment
  profile_image = this.env?.USER_PROFILE
  dummy = this.env?.DEFAULT_IMAGE
  title= "Dashboard"
  bookingList:any [] = [];
  limit:number = 10;
  offset:number = 0;
  limit1:number = 10;
  offset1:number = 0;
  search:any = "";
  totalRecord :number = 0;
  totalRecord1 :number = 0;
  serviceSearchText: Subject<string> = new Subject<string>();
  serviceSearch=''
  constructor(private service : HttpService) { 
    this.serviceSearchText.pipe(debounceTime(1000), // wait 0.5 sec after the last event before emitting last event
      distinctUntilChanged() // only emit if value is different from previous value
    ).subscribe(result => {
      this.serviceSearch = result;
      this.getBookingList(); // * Call your function which calls API or do anything you would like do after a lag of 1 sec
    });
  }

  ngOnInit(): void {
    this.getEarning() 
    this.getBookingList();
    this.getAssignedNannies();
    this.getLiveNannies();

  }
  searchServices() {
    this.serviceSearchText.next(this.serviceSearch)
  }

  getAssignedNannies(): void {

    this.service.getAssignedNannies({}).subscribe((resp:AssignedNanniesResponse) => {
      console.log("resp get assigned nanny",resp)
      this.nannies = resp.data;
    })

  }
  liveNanniesList:any = [];
  onImgError(event:any) { 
    event.target.src = this.dummy;
  }
  getLiveNannies(): void{
    let obj1:any={}
     obj1 = {
   
      limit:this.limit1,
      offset:this.offset1
    }
    this.service.getLiveNanniesInterview(obj1).subscribe((resp:any) => {
      
      this.liveNanniesList = resp?.data;
      this.totalRecord1 =resp?.count;
    })
  }

  earing_data:any=[]=[];
 
  fixNumber(amount:any ){
    return amount?.toFixed(2);
  }
  getEarning() : void {
    this.service.getEarning().subscribe((resp:any) => {
     console.log("earning", resp)
     this.earing_data = resp;
    }) 
  }
  getBookingList(): void {

    let obj:any={}
     obj = {
   
      limit:this.limit,
      offset:this.offset
    }
    if(this.serviceSearch){
      obj.search=this.serviceSearch
    }
    this.service.getBookings(obj).subscribe((resp) => {
      console.log(resp)
      this.bookingList = resp?.data?.list;
      this.totalRecord =resp?.data?.count;
    })

  }
  getRating(data:any){
    return Math.round(data);
  }

  paginationOptionChange(event:any) {
    this.limit = event.pageSize
    this.offset = event.pageIndex * event.pageSize
    let obj:any={}
     obj = {
   
      limit:this.limit,
      offset:this.offset
    }
    if(this.serviceSearch){
      obj.search=this.serviceSearch
    }
    this.service.getBookings(obj).subscribe((resp) => {
      console.log(resp)
      this.bookingList = resp?.data?.list;
      this.totalRecord =resp?.data?.count;
    })
  }
  paginationOptionChange1(event:any) {
    this.limit1 = event.pageSize
    this.offset1 = event.pageIndex * event.pageSize
    let obj1:any={}
     obj1 = {
   
      limit:this.limit1,
      offset:this.offset1
    }
   
    this.service.getLiveNanniesInterview(obj1).subscribe((resp:any) => {
      
      this.liveNanniesList = resp?.data;
      this.totalRecord1 =resp?.count;
    })
  }
}
