import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-alert-messages',
  templateUrl: './alert-messages.component.html',
  styleUrls: ['./alert-messages.component.scss']
})
export class AlertMessagesComponent implements OnInit {

  constructor(private service : HttpService) { }
  title='Notifications'
  limit:number = 10;
  offset:number = 0;
  notifications!:any;
  totalRecords:number = 0;

  @ViewChild('tablepaginator') pagi!:MatPaginator

  ngOnInit(): void {
    this.getNotifications();
  }

  getNotifications(){

    let obj = {
      limit:this.limit,
      offset:this.offset
    }
    this.service.getNotifications(obj).subscribe((resp:any) => {
      console.log("resp", resp)
      this.notifications = resp?.data;
      this.totalRecords = resp?.count;
    })

  }

  paginationOptionChange(event:any) {
    this.limit = event.pageSize
    this.offset = event.pageIndex * event.pageSize
    this.getNotifications();
  }

}
