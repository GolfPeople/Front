/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface SignupResponseData {
  accessToken: string;
  tokenType: string;
  expiresAt: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private apiUrl = `${environment.golfpeopleAPI}/api/auth`;

  constructor(private http: HttpClient) {}

  signup(
    {email,
    name,
    username,
    password,
    password_confirmation}
  ) {
    const opts = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }),
    };
    return this.http
      .post<SignupResponseData>(
        `${this.apiUrl}/signup`,
        { email, name,username, password, password_confirmation },
        opts
      )
      .pipe(
        catchError((error) => {
          console.log(error);
          const message = error.error.errors.email[0];
          let errorMessage = message ? 'El email ya ha sido registrado.' : '';
          return throwError(message);
        })
      );
  }
}
