import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http/http.service';

@Component({
  selector: 'app-copyright',
  templateUrl: './copyright.component.html',
  styleUrls: ['./copyright.component.scss']
})
export class CopyrightComponent implements OnInit {
  title= "copyright"
  data:any
  constructor(private service : HttpService) { }

  ngOnInit(): void {
    this.getCms()
  }
  getCms(){
    const obj={
      user_type:'supervisor',
      type:'copy_right',
    }
      this.service.getCms(obj).subscribe((resp: any) => {
    console.log(resp)
    this.data=resp.data

    })

  }
}
