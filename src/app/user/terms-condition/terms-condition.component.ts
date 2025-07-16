import { Component, OnInit } from '@angular/core';
import { TermsResponse } from 'src/app/models/model';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-terms-condition',
  templateUrl: './terms-condition.component.html',
  styleUrls: ['./terms-condition.component.scss']
})
export class TermsConditionComponent implements OnInit {
  title= "Terms"
  content:string = "";

  constructor(private service : HttpService) { }

  ngOnInit(): void {

    this.getCms();

  }
  data:any
  getCms(){
    const obj={
      user_type:'supervisor',
      type:'terms_and_conditions',
    }
      this.service.getCms(obj).subscribe((resp: any) => {
    console.log(resp)
    this.data=resp.data

    })

  }
}
