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
    // let id;
    // this.userService.getUserInfo().subscribe((user) => {
    //   id = user.profile.id;
    //   console.log(user);
    // });
    return this.http.post(`${this.apiUrl}/update/${id}`, dto);
  }
}
