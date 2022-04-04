import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { LoginService } from '../core/services/login.service';

@Injectable({
  providedIn: 'root',
})
export class CheckLoginGuard implements CanActivate {
  isLogged: boolean;

  constructor(private loginService: LoginService, private router: Router) {}
  canActivate(): Observable<boolean> | boolean {
    this.loginService.isLogged$.subscribe((data) => {
      this.isLogged = data;
    });
    if (this.isLogged === true) {
      this.router.navigate(['/home']);
    }
    return this.isLogged;
  }
}
