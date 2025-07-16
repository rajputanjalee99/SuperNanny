import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  HttpClient,
  HttpErrorResponse,
  HttpRequest,
  HttpHandler,
  HttpResponse,
  HttpEvent,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap, finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isPlatformBrowser } from '@angular/common';

import {
  Login,
  SnackBarMessage,
  Register,
  CMS,
  AddCookie,
  Pagination,
} from '../../models/model';
import { CookieService } from 'ngx-cookie-service';
import { CommonService } from '../common/common.service';
import { routes } from '../../loader-less-routes/routes';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  rfqData(arg0: { limit: number; offset: number }) {
    throw new Error('Method not implemented.');
  }

  SERVER_URL = environment.SERVER_URL;
  sideBarHeight: number = 0;
  page: any;
  profile: any;
  isLoading: any;

  constructor(
    private loader: NgxUiLoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private cookieService: CookieService,
    private commonService: CommonService,
    @Inject(PLATFORM_ID) private platform: Object
  ) {
    // alert(env.production)
  }

  objToQueryString(obj: any): string {
    if (!obj) {
      return '';
    }

    const searchParams = new URLSearchParams();
    const params = obj;
    Object.keys(params).forEach((key) => searchParams.append(key, params[key]));

    return searchParams.toString();
  }

  isRequestFromBrowser() {
    if (!isPlatformBrowser(this.platform)) {
      // Need for SSR setup
      return false;
    } else {
      return true;
    }
  }

  getToken() {
    if (!this.isRequestFromBrowser()) {
      // Need for SSR setup
      return null;
    }

    if (
      localStorage.getItem('remember_me') &&
      localStorage.getItem('remember_me') == 'yes'
    ) {
      return localStorage.getItem('token');
    }
    if (
      localStorage.getItem('remember_me') &&
      localStorage.getItem('remember_me') == 'no'
    ) {
      return sessionStorage.getItem('token');
    } else {
      return null;
    }
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const started = Date.now();

    // check if ignore routes for disable loader
    if (!this.commonService.checkIgnoreRoute(routes, request.url)) {
      this.loader.start();
    }

    // if(this.commonService.checkIgnoreRoute(routes,request.url)){

    // }

    const headers = {
      session_id: this.getCookie('_session'),
    };

    let ok: any;
    const token = this.getToken();

    if (token) {
      // make sure token is coming,
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          ...headers,
        },
      });
    } else {
      request = request.clone({
        setHeaders: headers,
      });
    }

    return next.handle(request).pipe(
      tap(
        // Succeeds when there is a response; ignore other events
        (event) => (ok = event instanceof HttpResponse ? 'succeeded' : ''),
        // Operation failed; error is an HttpErrorResponse
        (error) => (ok = error)
      ),
      // Log when response observable either completes or errors
      finalize(() => {
        this.loader.stop();
        const elapsed = Date.now() - started;
        if (ok == 'succeeded') {
          const msg = `${request.method} "${request.urlWithParams}"
          
           ${ok} in ${elapsed} ms.`;
          //  For make sure how much time consumed
          // console.log(msg);
        } else {
          console.log(ok);
          console.log('request: ', request);
          if (ok['status'] == 401) {
            // logout from here
            this.commonService.logout();
            this.router.navigate(['/']);
            console.log(ok['status']);
          } else {
            if (request.url.search('users/bulkUploadProducts') == -1) {
              this.handleError(ok);
            }
          }
        }
      })
    );
  }

  isAuthenticated() {
    if (
      localStorage.getItem('remember_me') &&
      localStorage.getItem('remember_me') == 'yes'
    ) {
      return localStorage.getItem('isLogged') == 'true';
    }
    if (
      localStorage.getItem('remember_me') &&
      localStorage.getItem('remember_me') == 'no'
    ) {
      return localStorage.getItem('isLogged') == 'true';
    } else {
      return false;
    }
  }

  getUserType(): string {
    return this.cookieService.get('user_type');
  }

  setCookies(obj: AddCookie): void {

    const date = new Date();

    date.setDate(date.getDay() + 7);

    if (!this.cookieService.check(obj.key)) {
      this.cookieService.set(obj.key, obj.value, date, "/");
    }

    // this.cookieService.set(obj.key, obj.value);
  }

  getCookie(key: string): string {
    return this.cookieService.get(key);
  }

  deleteCookie(key: string): void {
    this.cookieService.delete(key);
  }

  loggedUserDetails() {
    if (!this.isRequestFromBrowser()) {
      // Need for SSR setup
      return null;
    }

    if (
      localStorage.getItem('remember_me') &&
      localStorage.getItem('remember_me') == 'yes'
    ) {
      return JSON.parse(localStorage.getItem('user_details') || '{}');
    }
    if (localStorage.getItem('remember_me')) {
      return JSON.parse(sessionStorage.getItem('user_details') || '{}');
    } else {
      return null;
    }
  }

  setLoggedUserDetails(object: any) {
    if (
      localStorage.getItem('remember_me') &&
      localStorage.getItem('remember_me') == 'yes'
    ) {
      localStorage.setItem('user_details', JSON.stringify(object));
    }
    if (localStorage.getItem('remember_me')) {
      sessionStorage.setItem('user_details', JSON.stringify(object));
    } else {
    }
  }

  setDataInLocalStorage(
    key: any,
    value: any,
    isObjectOrArray: boolean = false
  ) {
    if (isObjectOrArray) localStorage.setItem(key, value);

    if (isObjectOrArray) localStorage.setItem(key, JSON.stringify(value));

    return true;
  }

  getDataFromLocalStorage(key: any, isObjectOrArray: boolean = false): any {
    if (!localStorage.getItem(key)) return '';

    if (isObjectOrArray) return JSON.parse(localStorage.getItem(key) || '{}');

    return localStorage.getItem(key);
  }

  showSuccessMessage(object: SnackBarMessage) {
    this._snackBar.open(
      object.message,
      object.action ? object.action : 'CLOSE',
      {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['snackbar'],
      }
    );
  }

  showErrorMessage(object: SnackBarMessage) {
    this._snackBar.open(
      object.message,
      object.action ? object.action : 'CLOSE',
      {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['snackbarError'],
      }
    );
  }

  updateLoginDetails(details: any) {
    // whenever talent/talent edit name and name will reflect

    if (
      localStorage.getItem('remember_me') &&
      localStorage.getItem('remember_me') == 'yes'
    ) {
      return localStorage.setItem('admin_details', JSON.stringify(details));
    }
    if (localStorage.getItem('remember_me')) {
      return sessionStorage.setItem('admin_details', JSON.stringify(details));
    }
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error && error.error.errors) {
      // client-side error and server side
      if (Array.isArray(error.error.errors.msg)) {
        // validation error message

        if (error.error.errors.msg.length) {
          const ob = error.error.errors.msg[0];
          if (ob.msg == 'IS_EMPTY') {
            errorMessage = `${ob.param} missing`;
          } else {
            errorMessage = ob.msg;
          }
        }
      } else {
        errorMessage = error.error.errors.msg;
      }
    } else {
      // server-side error
      if (error.status == 401) {
        // Unauthorised
        this.commonService.logout();
        this.router.navigate(['/']);
      }

      console.log(error);
      errorMessage = `Something went wrong here`;
      // errorMessage = `${error.message}`;
    }
    console.log('I am here ', errorMessage);
    // if (this.bulkUpload(error)) {
    //   return;
    // }
    this.showErrorMessage({
      message: errorMessage,
    });
    return throwError(errorMessage);
  }

  //login
  login_data(data: Login): Observable<any> {
    const API_URL = `${this.SERVER_URL}login`;
    return this.http.post(API_URL, data).pipe(
      map((res) => {
        return res;
      })
    );
  }

  sendRegisterOTP(form: any): Observable<any> {
    const API_URL = `${this.SERVER_URL}users/generate/register/otp`;
    return this.http.post(API_URL, form).pipe(
      map((res) => {
        return res;
      })
    );
  }
  sendEmailForOtp(form: any): Observable<any> {
    const API_URL = `${this.SERVER_URL}send/otp `;
    return this.http.post(API_URL, form).pipe(
      map((res) => {
        return res;
      })
    );
  }
  verifyrOtp(form: any): Observable<any> {
    const API_URL = `${this.SERVER_URL}VarifyOtp`;
    return this.http.post(API_URL, form).pipe(
      map((res) => {
        return res;
      })
    );
  }
  forgetPassword(form: any): Observable<any> {
    const API_URL = `${this.SERVER_URL}forget/password/supervisor`;
    return this.http.post(API_URL, form).pipe(
      map((res) => {
        return res;
      })
    );
  }
  register(form: any): Observable<any> {
    const API_URL = `${this.SERVER_URL}register`;
    return this.http.post(API_URL, form).pipe(
      map((res) => {
        return res;
      })
    );
  }

  completeSupervisorProfile(form: any): Observable<any> {
    const API_URL = `${this.SERVER_URL}profile/update/supervisor`;
    return this.http.put(API_URL, form).pipe(
      map((res) => {
        return res;
      })
    );
  }

  sendLoginOTP(form: any): Observable<any> {
    const API_URL = `${this.SERVER_URL}send/otp`;
    return this.http.post(API_URL, form).pipe(
      map((res) => {
        return res;
      })
    );
  }

  getNotificationSetting(): Observable<any> {
    const API_URL = `${this.SERVER_URL}supervisor/notification/settings`;
    return this.http.get(API_URL).pipe(
      map((res) => {
        return res;
      })
    );
  }

  setNotificationSetting(form: any): Observable<any> {
    const API_URL = `${this.SERVER_URL}supervisor/notification/settings`;
    return this.http.patch(API_URL, form).pipe(
      map((res) => {
        return res;
      })
    );
  }

  getProfile(form?: any): Observable<any> {
    const API_URL = `${this.SERVER_URL}supervisor/profile`;
    return this.http.get(API_URL).pipe(
      map((res) => {
        return res;
      })
    );
  }

  editProfile(form: any): Observable<any> {
    const API_URL = `${this.SERVER_URL}supervisor/profile`;
    return this.http.put(API_URL, form).pipe(
      map((res) => {
        return res;
      })
    );
  }

  getAssignedNannies(form?: any): Observable<any> {
    const query = this.objToQueryString(form)
    const API_URL = `${this.SERVER_URL}supervisor/assigned/nannies?${query}`;
    return this.http.get(API_URL).pipe(
      map((res) => {
        return res;
      })
    );
  }

  getNannyProfile(form?: any): Observable<any> {
    const query = this.objToQueryString(form)
    const API_URL = `${this.SERVER_URL}supervisor/nanny/profile/${form.nanny_id}?${query}`;
    return this.http.get(API_URL).pipe(
      map((res) => {
        return res;
      })
    );
  }

  getTermsConditions(): Observable<any> {
    const API_URL = `${this.SERVER_URL}supervisor/terms-conditions`;
    return this.http.get(API_URL).pipe(
      map((res) => {
        return res;
      })
    );
  }

  profileApproval(form: any): Observable<any> {
    const API_URL = `${this.SERVER_URL}supervisor/profile/approval`;
    return this.http.post(API_URL, form).pipe(
      map((res) => {
        return res;
      })
    );
  }

  getBookings(form?: any): Observable<any> {
    const query = this.objToQueryString(form)
    const API_URL = `${this.SERVER_URL}supervisor/get/bookings?${query}`;
    return this.http.get(API_URL).pipe(
      map((res) => {
        return res;
      })
    );
  }
  
  getBookingsBystatus(form?: any): Observable<any> {
    const query = this.objToQueryString(form)
    const API_URL = `${this.SERVER_URL}supervisor/get/bookings?${query}`;
    return this.http.get(API_URL).pipe(
      map((res) => {
        return res;
      })
    );
  }
  sendReport(form: any): Observable<any> {
   
    const API_URL = `${this.SERVER_URL}supervisor/booking/report`;
    return this.http.post(API_URL,form).pipe(
      map((res) => {
        return res;
      })
    );
  }
  scheduleByDate(form: any): Observable<any> {
    const query = this.objToQueryString(form)
    const API_URL = `${this.SERVER_URL}supervisor/schedule/booking/videoCall?${query}`;
    return this.http.get(API_URL).pipe(
      map((res) => {
        return res;
      })
    );
  }

  getNotifications(form?: any): Observable<any> {
    const query = this.objToQueryString(form)
    const API_URL = `${this.SERVER_URL}supervisor/get/notifications?${query}`;
    return this.http.get(API_URL).pipe(
      map((res) => {
        return res;
      })
    );
  }

  getSuperVisorProfile(): Observable<any> {
    const API_URL = `${this.SERVER_URL}users/info`;
    return this.http.get(API_URL).pipe(
      map((res) => {
        return res;
      })
    );
  }
  getReferred(obj: any): Observable<any> {
    const API_URL = `${this.SERVER_URL}supervisor/get/referred/users?limit=${obj.limit}&offset=${obj.offset}`;
    return this.http.get(API_URL).pipe(
      map((res) => {
        return res;
      })
    );
  }

  getLiveNannies(): Observable<any> {
    const API_URL = `${this.SERVER_URL}supervisor/live/nannies`;
    return this.http.get(API_URL).pipe(
      map((res) => {
        return res;
      })
    );
  }
  getTokenOfJitsi(form:any): Observable<any> {
    const query = this.objToQueryString(form)
    const API_URL = `${this.SERVER_URL}supervisor/jitsi/jwt/token?${query}`;
    return this.http.get(API_URL).pipe(
      map((res) => {
        return res;
      })
    );
  }

  startBookingSessionInfo(obj: any): Observable<any> {
    const API_URL = `${this.SERVER_URL}users/start/booking/session`;
    return this.http.post(API_URL, obj).pipe(
      map((res) => {
        return res;
      })
    );
  }
  getBoookingSessionDetail(obj: any): Observable<any> {
    const API_URL = `${this.SERVER_URL}supervisor/booking/session/details/${obj.booking_session_id}`;
    return this.http.get(API_URL).pipe(
      map((res) => {
        return res;
      })
    );
  }
  getEarning(): Observable<any> {
    const API_URL = `${this.SERVER_URL}supervisor/earnings`;
    return this.http.get(API_URL).pipe(
      map((res) => {
        return res;
      })
    );
  }
  getPayment(): Observable<any> {
    const API_URL = `${this.SERVER_URL}supervisor/get/payOutList`;
    return this.http.get(API_URL).pipe(
      map((res) => {
        return res;
      })
    );
  }

  addBankAccount(obj: any): Observable<any> {
    const API_URL = `${this.SERVER_URL}supervisor/bank/account`;
    return this.http.post(API_URL, obj).pipe(
      map((res) => {
        return res;
      })
    );
  }

  editBankAccount(obj: any): Observable<any> {
    const API_URL = `${this.SERVER_URL}supervisor/edit/bank/account`;
    return this.http.patch(API_URL, obj).pipe(
      map((res) => {
        return res;
      })
    );
  }

  getBankAccountList(): Observable<any> {
    const API_URL = `${this.SERVER_URL}supervisor/get/bank/accountList`;
    return this.http.get(API_URL).pipe(
      map((res) => {
        return res;
      })
    );
  }

  deleteBankAccount(id: any): Observable<any> {
    const API_URL = `${this.SERVER_URL}delete/bank/account/${id}`;
    return this.http.delete(API_URL).pipe(
      map((res) => {
        return res;
      })
    );
  }

  getNotificationCategories(): Observable<any> {
    const API_URL = `${this.SERVER_URL}supervisor/notification/categories`;
    return this.http.get(API_URL).pipe(
      map((res) => {
        return res;
      })
    );
  }

  sendNotification(obj: any): Observable<any> {
    const API_URL = `${this.SERVER_URL}supervisor/send/notification`;
    return this.http.post(API_URL, obj).pipe(
      map((res) => {
        return res;
      })
    );
  }

  getNannyScheduleTask(obj:any): Observable<any> {
    const API_URL = `${this.SERVER_URL}supervisor/get/nannyScheduleTask?nanny_booking_id=${obj.nanny_booking_id}`;
    return this.http.get(API_URL).pipe(
      map((res) => {
        return res;
      })
    );
  }


  addNannyScheduleTask(obj: any): Observable<any> {
    const API_URL = `${this.SERVER_URL}supervisor/add/nannyScheduleTask`;
    return this.http.post(API_URL, obj).pipe(
      map((res) => {
        return res;
      })
    );
  }

  editNannyScheduleTask(obj: any): Observable<any> {
    const API_URL = `${this.SERVER_URL}supervisor/edit/nannyScheduleTask`;
    return this.http.patch(API_URL, obj).pipe(
      map((res) => {
        return res;
      })
    );
  }

  getCms(obj: any): Observable<any> {
    const API_URL = `${this.SERVER_URL}supervisor/CMS?user_type=${obj.user_type}&type=${obj.type}`;
    return this.http.get(API_URL).pipe(
      map((res) => {
        return res;
      })
    );
  }
  getFaq(): Observable<any> {
    const API_URL = `${this.SERVER_URL}supervisor/get/faq`;
    return this.http.get(API_URL).pipe(
      map((res) => {
        return res;
      })
    );
  }
  getLiveNanniesInterview(form:any): Observable<any>{
    const query = this.objToQueryString(form)
    const API_URL = `${this.SERVER_URL}supervisor/interviews?${query}`;
    return this.http.get(API_URL).pipe(
      map((res) => {
        return res;
      })
    );
  }
  getLiveNanniesInterviewById(data:any): Observable<any>{
    const API_URL = `${this.SERVER_URL}supervisor/interview/details/${data.interview_id}`;
    return this.http.get(API_URL).pipe(
      map((res) => {
        return res;
      })
    );
  }
  sendOtpForlogin(data:any): Observable<any>{
    const API_URL = `${this.SERVER_URL}supervisor/sendOtp`;
    return this.http.post(API_URL,data).pipe(
      map((res) => {
        return res;
      })
    );
  }
  verifyOtpForlogin(data:any): Observable<any>{
    const API_URL = `${this.SERVER_URL}verify/supervisorOtp`;
    return this.http.post(API_URL,data).pipe(
      map((res) => {
        return res;
      })
    );
  }
  seen(data:any): Observable<any>{
    const API_URL = `${this.SERVER_URL}supervisor/seen/notifications`;
    return this.http.post(API_URL,data).pipe(
      map((res) => {
        return res;
      })
    );
  }

  
}
