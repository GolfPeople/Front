import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class CheckLoginGuard implements CanActivate {
  isLogged: boolean;

  constructor(private router: Router) { }
  canActivate(): Observable<boolean> | boolean {
    let user_id = localStorage.getItem('user_id');

    if (user_id) {
      this.router.navigateByUrl('/tabs')
      return false;
    } else {
      return true;
    }
  }
}
