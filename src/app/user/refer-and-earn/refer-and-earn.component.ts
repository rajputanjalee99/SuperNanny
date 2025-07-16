import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-refer-and-earn',
  templateUrl: './refer-and-earn.component.html',
  styleUrls: ['./refer-and-earn.component.scss']
})
export class ReferAndEarnComponent implements OnInit {
title='Refer & Earn'
  limit: number = 10;
  offset: number = 0;
  referred: any;
  totalRecords: number = 0;
  myreferral_code: any;
  constructor(private service: HttpService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getReferred();
    this.getSuperVisorProfile();
  }

  getReferred() {
    let obj = {
      limit: this.limit,
      offset: this.offset
    }

    this.service.getReferred(obj).subscribe((resp: any) => {
      this.referred = resp?.data;
      this.totalRecords = resp?.count;

    })

  }

  getSuperVisorProfile(): void {

    this.service.getSuperVisorProfile().subscribe((resp: any) => {
      this.myreferral_code = resp?.superVisorInfo?.supervisor_id?.referral_no;
    })

  }


  paginationOptionChange(event: any) {
    this.limit = event.pageSize
    this.offset = event.pageIndex * event.pageSize
    this.getReferred();
  }

}
