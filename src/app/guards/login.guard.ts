import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private router: Router) { }
  canActivate(): Observable<boolean> | boolean {
    let user_id = localStorage.getItem('user_id');
    let token = localStorage.getItem('token');

    if (user_id && token) {   
      this.router.navigateByUrl('/tabs')
      return false;
    } else {
      return true;
    }
  }

}
