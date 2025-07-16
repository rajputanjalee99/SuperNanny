import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { ActivationEnd, Router, Event } from '@angular/router';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() data = ''
  pathnameArray: any;
  currentPath: any = '';
  current_page: any = "Dashboard"
  url: string='';
  constructor(private router: Router , @Inject(DOCUMENT) private document: Document,private service : HttpService) { 
    this.url=this.router.url
    console.log(this.router.url)

    if(this.service.getToken()){
      var selfVar = this;
     /*  const temp_id = window.setInterval(function(){
       
        ++selfVar.seconds     
        if(selfVar.seconds == 600){ // equal to 10 mins
          alert("You will be logged out for inactivity");
          localStorage.clear();
          sessionStorage.clear();
          selfVar.router.navigate(['/auth/login'])
          clearInterval(temp_id)
        }
        
  
      },1000) */
      
  
      document.body.addEventListener("keyup",function(){
  
        console.log("Key Up");
        selfVar.seconds = 0
  
      })
  
      document.body.addEventListener("mouseover",function(){
  
        console.log("Mouse Hover");
        selfVar.seconds = 0
  
      })
  
  
      this.router.events.subscribe((val) => {
       
    });
    }
   

  }
  seconds = 0;

  ngOnInit(): void {
    if(this.service.getToken()){
      this.getNotifications()
    }


  
    // if(this.service.getToken()){
      
    //   setInterval(() =>{
    //     this.getNotifications()
        
    //   }, 20000);
    // }
   
  

}

addClass(){
  if(this.document.body.classList.contains('g-sidenav-pinned')){
    this.document.body.classList.remove('g-sidenav-pinned');

  }
  else{
  this.document.body.classList.add('g-sidenav-pinned');
  }
  

}
limit:number = 10;
offset:number = 0;
notifications:any[]=[];
totalRecords:number = 0;

getNotifications(){

  let obj = {
    limit:5,
    offset:this.offset
  }
  this.service.getNotifications(obj).subscribe((resp:any) => {
    console.log("resp", resp)
    this.notifications = resp?.data;
    this.totalRecords = resp?.count;
  })
}

seenNotifications(){

  let obj = {
   
  }
  this.service.seen(obj).subscribe((resp:any) => {
   
  
  })
}
}
