import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileApprovalGuard implements CanActivate {

  constructor(private service : HttpService,private router : Router,private route:ActivatedRoute){
    
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      // alert(this.service.getCookie("profile_approval"));

      if(!this.service.isRequestFromBrowser()){
        return true
      }

      if(this.service.getCookie("profile_approval") != "approved"){
        this.service.showErrorMessage({
          message : "Please wait while admin approval"
        })
        if(this.service.isRequestFromBrowser()){
          this.router.navigate(['/user/profile-approval']);
          return false;
        }else{
          return true; // no need to check auth, because this request coming from the server side. (SSR enabled)
        }
          
        // console.log("is From Browser ->"this.service.isRequestFromBrowser())
        // if(this.service.isRequestFromBrowser()){
        //   // alert("ddd")
        //   this.router.navigate(['/user/profile-approval']);
        //   return false;
        // }else{
        //   return true; // no need to check auth, because this request coming from the server side. (SSR enabled)
        // }
      }else{
        return true;
      }
    
  }
  
}
