import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.golfpeopleAPI}/api/auth`;

  constructor(private http: HttpClient) {}

  getUserInfo() {
    return this.http.get<any>(`${this.apiUrl}/user`);
  }
}
