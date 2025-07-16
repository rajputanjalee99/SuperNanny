import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-notification-schedules',
  templateUrl: './notification-schedules.component.html',
  styleUrls: ['./notification-schedules.component.scss']
})
export class NotificationSchedulesComponent implements OnInit {

  title="Notification Schedule"

  ngOnInit(): void {
  }
  toppings = new FormControl('');

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  toppings_1 = this._formBuilder.group({
    pepperoni: false,
    extracheese: false,
    mushroom: false,
  });
  constructor(private _formBuilder: FormBuilder) {}
}
