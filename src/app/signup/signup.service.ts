/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface SignupResponseData{
  accessToken: string;
  tokenType: string;
  expiresAt: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http: HttpClient) { }

  signup(email: string, name: string, password: string, password_confirmation: string){
    const opts = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      })
    };
    return this.http.post<SignupResponseData>(
      'https://www.api.app.golfpeople.com/api/auth/signup',
      {email, name, password, password_confirmation},
      opts
    );
  }
}
