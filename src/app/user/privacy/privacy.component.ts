import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {
 title= "Privacy"
 data:any
  constructor(private service: HttpService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getCms()
  }
  getCms(){
    const obj={
      user_type:'supervisor',
      type:'privacy_Policies',
    }
      this.service.getCms(obj).subscribe((resp: any) => {
    console.log(resp)
    this.data=resp.data

    })

  }
}
