/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { User } from './user.model';

export interface LoginResponseData{
  access_token: string;
  expires_at: string;
  message: string;
  token_type: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private _userIsAuthenticated = false;

  private _user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) { }

  get userIsAuthenticated(){
    console.log('Usuario: ', this._userIsAuthenticated);
    return this._userIsAuthenticated;

  }

  login(email: string, password: string){
    const opts = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      })
    };
    this._userIsAuthenticated = true;
    return this.http.post<LoginResponseData>(
      'https://www.api.app.golfpeople.com/api/auth/login',
      {email, password},
      opts
    )
    .pipe(tap(this.setUserData.bind(this)));
  }


  logout(){
    this._userIsAuthenticated = false;
  }

  private setUserData(userData: LoginResponseData) {

    this._user.next(
      new User(
        userData.access_token,
        userData.expires_at,
        userData.message,
        userData.token_type
      )
    );
  }
}
