import {Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { HttpService } from 'src/app/services/http/http.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  status:string;
}

@Component({
  selector: 'app-booking-manage',
  templateUrl: './booking-manage.component.html',
  styleUrls: ['./booking-manage.component.scss']
})
export class BookingManageComponent implements OnInit {
title= "Bookings"
@ViewChild('tablepaginator') pagi!:MatPaginator
  bookingList:any [] = [];
  limit:number = 10;
  offset:number = 0;
  search:any = "";
  totalRecord :number = 0;

  displayedColumns: string[] = ['position', 'name', 'weight', 'status' , 'symbol'];
  // dataSource = new MatTableDataSource(ELEMENT_DATA);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.search = filterValue;
    this.pagi.pageIndex = 0;
    this.getBookingList();
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  constructor(private service : HttpService) { }

  ngOnInit(): void {
    this.getBookingList();
  }

  getBookingList(): void {

    let obj = {
  
      limit:this.limit,
      offset:this.offset
    }

    this.service.getBookings(obj).subscribe((resp) => {
      console.log(resp)
      this.bookingList = resp?.data?.list;
      this.totalRecord =resp?.data?.count;
    })

  }

  paginationOptionChange(event:any) {
    this.limit = event.pageSize
    this.offset = event.pageIndex * event.pageSize
    this.getBookingList();
  }

  

}
