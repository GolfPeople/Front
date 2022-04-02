import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';

import { LoginService } from '../core/services/login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private loginService: LoginService, private router: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.loginService.userIsAuthenticated) {
      this.router.navigateByUrl('/login');
    }
    return this.loginService.userIsAuthenticated;
  }
}
