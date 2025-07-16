import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from '../..//services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
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
      if(!this.service.getToken()){
        this.service.showErrorMessage({
          message : "Please Login First"
        })
        // alert("fdsfsdfsf")
        if(this.service.isRequestFromBrowser()){
          this.router.navigate(['/'],{queryParams:{'redirectURL':state.url}});
        }else{
          return true; // no need to check auth, because this request coming from the server side. (SSR enabled)
        }

        
        return false;
      }else{
        return true;
      }
    
  }
  
  
}
