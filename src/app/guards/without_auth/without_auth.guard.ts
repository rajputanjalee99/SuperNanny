import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from '../..//services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class WithoutAuthGuard implements CanActivate {
  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }

  constructor(private service : HttpService,private router : Router,private route:ActivatedRoute){
    
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.service.getToken()){
        if(this.service.isRequestFromBrowser()){

          if(this.service.getCookie("profile_approval") != "approved"){

            this.router.navigate(['/user/profile-approval']);
            return false;
           

          }else{
            this.router.navigate(['/user/dashboard']);
            return true;
          }

        }else{
          return true; // no need to check auth, because this request coming from the server side. (SSR enabled)
        }
        
      }else{
        return true;
      }
    
  }
  
  
}
