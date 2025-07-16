import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderRoutingModule } from './header-routing.module';
import { HeaderComponent } from './header.component';
// import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateAgoPipe } from '../dateAgo/date-ago.pipe';
@NgModule({
  declarations: [HeaderComponent,DateAgoPipe],
  imports: [
    CommonModule,
    HeaderRoutingModule
  ],
  exports:[
    HeaderComponent,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    // BrowserModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class HeaderModule { }
