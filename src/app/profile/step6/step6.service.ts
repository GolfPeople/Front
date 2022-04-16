import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

interface DateAndLocation {
  date: string;
  gender: number;
  location: string;
}

@Injectable({
  providedIn: 'root',
})
export class Step6Service {
  private apiUrl = `${environment.golfpeopleAPI}/api/auth`;

  constructor(private http: HttpClient) {}

  dateAndLocation(birthday, gender, adress) {
    const formData = new FormData();
    formData.append('birthday', birthday);
    formData.append('gender', gender);
    formData.append('address', adress);
    return this.http.post<DateAndLocation>(
      `${this.apiUrl}/profile/4`,
      formData
    );
  }
}
