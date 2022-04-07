import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class Step2Service {

  private apiUrl = `${environment.golfpeopleAPI}/api/auth`;


  constructor(private http: HttpClient) { }


  enviarHandicap(handicap: string, time_playing: number) {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }),
    };
    return this.http
      .post(
        `${this.apiUrl}/profile/2`,
        { handicap, time_playing },
        headers
      );
  }
}
