import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../../../../../../../core/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class PersonalInfoService {
  constructor(private http: HttpClient, private userService: UserService) {}

  private apiUrl = `${environment.golfpeopleAPI}/api/auth`;

  updateInfo(dto, id) {
    return this.http.post(`${this.apiUrl}/update/${id}`, dto);
  }

  updatePassword(dto, id) {
    return this.http.post(`${this.apiUrl}/update/pasword/${id}`, dto);
  }
}
