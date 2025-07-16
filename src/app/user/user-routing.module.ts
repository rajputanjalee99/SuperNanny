import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertMessagesComponent } from './alert-messages/alert-messages.component';
import { BankDetailComponent } from './bank-detail/bank-detail.component';
import { BookingManageComponent } from './booking-manage/booking-manage.component';
import { BookingViewComponent } from './booking-view/booking-view.component';
import { DbDashboardComponent } from './db-dashboard/db-dashboard.component';
import { EarningComponent } from './earning/earning.component';
import { EditNannyProfileComponent } from './edit-nanny-profile/edit-nanny-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { HelpComponent } from './help/help.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { NannyLiveComponent } from './nanny-live/nanny-live.component';
import { NannyProfileComponent } from './nanny-profile/nanny-profile.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { ProfileApprovalPageComponent } from './profile-approval-page/profile-approval-page.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { TermsConditionComponent } from './terms-condition/terms-condition.component';
import { UserUpStepComponent } from './user-up-step/user-up-step.component';
import { WatchFullScreenComponent } from './watch-full-screen/watch-full-screen.component';
import { NotificationSchedulesComponent } from './notification-schedules/notification-schedules.component';
import { CopyrightComponent } from './copyright/copyright.component';
import { NannyLiveInterviewComponentComponent } from './nanny-live-interview-component/nanny-live-interview-component.component';
import { WatchInterviewComponent } from './watch-interview/watch-interview.component';

const routes: Routes = [{
  path: "dashboard",
  component: DbDashboardComponent,
  // title: "Dashboard"
}, {
  path: "live-nannies",
  component: NannyLiveComponent,
  // title: "Live Nannies"
},
{
  path: "live-interview",
  component: NannyLiveInterviewComponentComponent,
  // title: "Live Nannies"
}, {
  path: "profile",
  component: MyProfileComponent,
  // title: "Profile"
}, {
  path: "watch/full-screen/:booking_id/:booking_slot/:room_id",
  component: WatchFullScreenComponent,
  // title: "Bookings"
},
{
  path: "watch/full-screen-interview/:InterviewId/:room_id",
  component: WatchInterviewComponent,
  // title: "Bookings"
},

{
  path: "earning",
  component: EarningComponent,
  // title: "Earnings"
},
{
  path: "privacy",
  component: PrivacyComponent,
  // title: "Privacy"
},
{
  path: "terms",
  component: TermsConditionComponent,
  // title: "Terms"
},
{
  path: "copyright",
  component: CopyrightComponent,
  // title: "copyright"
},
{
  path: "profile-approval",
  component: ProfileApprovalPageComponent,
  // title: "Profile"

},
{
  path: "help",
  component: HelpComponent,
  // title: "Help"
},
{
  path: "schedule",
  component: ScheduleComponent,
  // title: "Schedule"
},
{
  path: "edit-profile",
  component: EditProfileComponent,
  // title: "Edit Profile"
},
{
  path: "nanny-profile/:nanny_id",
  component: NannyProfileComponent,
  // title: "Nanny Profile"
},
{
  path: "edit-nanny-profile",
  component: EditNannyProfileComponent,
  // title: "Edit Nanny Profile"
},
{
  path: "step-up-nanny-profile",
  component: UserUpStepComponent,
  // title: "Step Up Nanny Profile"

},
{
  path: "booking-manage",
  component: BookingManageComponent,
  // title: "Bookings"
},
{
  path: "booking-view/:id",
  component: BookingViewComponent,
  // title: "Booking Details"
},
{
  path: "NotificationSchedules",
  component: NotificationSchedulesComponent,
  // title: "Notification Schedule"
}



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
