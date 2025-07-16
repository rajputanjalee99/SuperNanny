import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  url:any='/user/dashboard'
  constructor(
    private commonService : CommonService, 
    private router : Router,
    private service : HttpService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.url=this.router.url
    console.log(this.router.url)
   }

  ngOnInit(): void {
  }

  logout() : void {

    this.commonService.logout();

    this.router.navigate(['auth/login']);

    this.service.showSuccessMessage({
      message : "Logout Successful"
    })

  }

  closeSideBar(){
    console.log("clicked");
    
    this.document.body.classList.remove('g-sidenav-pinned')
  }

}
