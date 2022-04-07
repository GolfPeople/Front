import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Step3Service {

  private apiUrl = `${environment.golfpeopleAPI}/api/auth`;


  constructor(private http: HttpClient) { }


  type(type: number) {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }),
    };
    return this.http
      .post(
        `${this.apiUrl}/profile/3`,
        {type},
        headers
      );
  }
}
