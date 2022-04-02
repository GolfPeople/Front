/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
    email: string,
    name: string,
    password: string,
    password_confirmation: string
  ) {
    const opts = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }),
    };
    return this.http.post<SignupResponseData>(
      `${this.apiUrl}/signup`,
      { email, name, password, password_confirmation },
      opts
    );
  }
}
