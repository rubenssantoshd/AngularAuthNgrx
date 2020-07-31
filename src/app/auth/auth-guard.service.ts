import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private authService: AuthService,
              private router: Router) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    return this.authService.authenticated()
              .pipe(tap( b => {
                             if(!b)
                                this.router.navigateByUrl('/auth/login');
              }))
  }            
   

}
