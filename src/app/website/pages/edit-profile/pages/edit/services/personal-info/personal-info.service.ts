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
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }),
    };
    return this.http.post(`${this.apiUrl}/update/${id}`, dto, headers);
  }

  updatePassword(current_password, password, password_confirmation, id) {
    const dto = {
      current_password,
      password,
      password_confirmation,
    };
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }),
    };
    // dto.append('current_password', currentPassword);
    // dto.append('password', password);
    // dto.append('password_confirmation', passwordConfirmation);
    return this.http.post<any>(
      `${this.apiUrl}/update/password/${id}`,
      dto,
      headers
    );
  }

  changePrivacy(handicap, profile, id) {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      }),
    };
    return this.http.post(
      `${this.apiUrl}/update/${id}`,
      { handicap, profile },
      headers
    );
  }
}
