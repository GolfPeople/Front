import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { UserResponse } from '../models/user.interface';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { UserService } from './user.service';

export interface LoginResponseData {
  access_token: string;
  expires_at: string;
  message: string;
  token_type: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = `${environment.golfpeopleAPI}/api/auth`;
  private isLogged = new BehaviorSubject<boolean>(false);
  isLogged$ = this.isLogged.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private userSvc: UserService,
    private authSvc: AuthService
  ) {
    if (this.tokenService.getToken()) {
      this.isLogged.next(true);
    } else {
      this.isLogged.next(false);
    }
  }

  login({ email, password }) {
    const opts = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }),
    };
    return this.http
      .post<LoginResponseData>(
        `${this.apiUrl}/login`,
        { email, password },
        opts
      )
      .pipe(
        tap((response) => {
          this.tokenService.saveToken(response.access_token);
          this.userSvc.getUserID();
          // console.log(localStorage.getItem('token'));
          // console.log(response);
          this.isLogged.next(true);
          return response;
        }),
        catchError(({ error }) => {
          console.log(error.message);
          const message = error.message;
          return throwError(message);
        })
      );
  }

  socialLogin(driver, email, name, provider_id) {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('name', name);
    formData.append('provider_id', provider_id);

    return this.http
      .post<LoginResponseData>(
        `https://api.app.golfpeople.com/api/authorize/callback/${driver}`,
        formData
      )
      .pipe(
        tap((res) => {
          this.tokenService.saveToken(res.access_token);
          this.userSvc.getUserID();
          // console.log(localStorage.getItem('token'));
          // console.log(res);
        }),
        catchError(({ error }) => {
          console.log(error.message);
          const message = error.message;
          return throwError(message);
        })
      );
  }

  logout() {
    this.isLogged.next(false);
    this.tokenService.removeToken();
    this.authSvc.logout();
  }
}
