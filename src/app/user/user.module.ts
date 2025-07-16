import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { DbDashboardComponent } from './db-dashboard/db-dashboard.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { NannyLiveComponent } from './nanny-live/nanny-live.component';
import { WatchFullScreenComponent } from './watch-full-screen/watch-full-screen.component';
import { SidebarModule } from '../common/sidebar/sidebar.module';
import { HeaderModule } from '../common/header/header.module';
import { EarningComponent } from './earning/earning.component';
import { TermsConditionComponent } from './terms-condition/terms-condition.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { ProfileApprovalPageComponent } from './profile-approval-page/profile-approval-page.component';
import {MatTableModule} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { HelpComponent } from './help/help.component';
import { ScheduleComponent } from './schedule/schedule.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { NannyProfileComponent } from './nanny-profile/nanny-profile.component';
import { EditNannyProfileComponent } from './edit-nanny-profile/edit-nanny-profile.component';
import { UserUpStepComponent } from './user-up-step/user-up-step.component';
import { MatStepperModule } from '@angular/material/stepper';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BookingManageComponent } from './booking-manage/booking-manage.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BookingViewComponent } from './booking-view/booking-view.component';
import { TimeFormatePipe } from '../pipes/12hour-format/time-formate.pipe';
// import { MatOption } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { ReferAndEarnComponent } from './refer-and-earn/refer-and-earn.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { BankDetailComponent } from './bank-detail/bank-detail.component';
import { AlertMessagesComponent } from './alert-messages/alert-messages.component';
import {MatPaginatorModule} from '@angular/material/paginator';
// import { BrowserModule } from '@angular/platform-browser';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { NotificationSchedulesComponent } from './notification-schedules/notification-schedules.component';
import { CopyrightComponent } from './copyright/copyright.component';
import { NannyLiveInterviewComponentComponent } from './nanny-live-interview-component/nanny-live-interview-component.component';
import { WatchInterviewComponent } from './watch-interview/watch-interview.component';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
 

@NgModule({
  declarations: [
    TimeFormatePipe,
    DbDashboardComponent,
    MyProfileComponent,
    NannyLiveComponent,
    WatchFullScreenComponent,
    EarningComponent,
    TermsConditionComponent,
    PrivacyComponent,
    ProfileApprovalPageComponent,
    HelpComponent,
    ScheduleComponent,
    EditProfileComponent,
    NannyProfileComponent,
    EditNannyProfileComponent,
    UserUpStepComponent,
    BookingManageComponent,
    BookingViewComponent,
    UserUpStepComponent,
    ReferAndEarnComponent,
    BankDetailComponent,
    AlertMessagesComponent,
    NotificationSchedulesComponent,
    CopyrightComponent,
    NannyLiveInterviewComponentComponent,
    WatchInterviewComponent,
    
    
  ],
  imports: [

    CommonModule,
    UserRoutingModule,
    SidebarModule,
    HeaderModule,
    MatDatepickerModule,
    MatCardModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatTimepickerModule,
    MatIconModule, 
    MatStepperModule, 
    GoogleMapsModule,
    MatChipsModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    MatSelectModule,
    MatCheckboxModule
    
    
  ],
  
})
export class UserModule { }
