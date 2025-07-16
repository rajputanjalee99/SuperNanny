import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'SuperVisor';
  isFromBrowser:boolean = false
  
  seconds = 0;
  constructor(@Inject(PLATFORM_ID) private platform: Object,private route :Router) { 




   
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platform)) {
      //Initialise your charets here
      // alert("");
      this.isFromBrowser = true;
      // this.commonService.generateSession();
    }

  }
  
}
