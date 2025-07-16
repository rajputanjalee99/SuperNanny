import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bank-detail',
  templateUrl: './bank-detail.component.html',
  styleUrls: ['./bank-detail.component.scss']
})
export class BankDetailComponent implements OnInit {
  title= "Bank Detail"
  constructor() { }

  ngOnInit(): void {
  }

}
