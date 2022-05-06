import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private id = new BehaviorSubject<number>(0);
  id$ = this.id.asObservable();
  private apiUrl = `${environment.golfpeopleAPI}/api/auth`;

  constructor(private http: HttpClient) {}

  getUserInfo() {
    return this.http.get<any>(`${this.apiUrl}/user`);
  }

  getUserID() {
    return this.http
      .get<any>(`${this.apiUrl}/user`)
      .subscribe((user) => this.id.next(user.id));
  }
}
