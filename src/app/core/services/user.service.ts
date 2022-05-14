import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { map, tap } from 'rxjs/operators';
import { UserProfileData, UserPublicData } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private id = new BehaviorSubject<number>(0);
  id$ = this.id.asObservable();

  private user = new BehaviorSubject<UserPublicData>({
    email: '',
    id: 0,
    name: '',
    profile: {},
  });
  private userPhoto = new BehaviorSubject<string>('');
  user$ = this.user.asObservable();
  userPhoto$ = this.userPhoto.asObservable();
  userName: string;
  private apiUrl = `${environment.golfpeopleAPI}/api/auth`;

  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController
  ) {}

  getUserInfo() {
    return this.http.get<any>(`${this.apiUrl}/user`);
  }

  updatePhoto(image: string) {
    this.userPhoto.next(image);
  }

  getUserInfoToSave() {
    this.http.get<any>(`${this.apiUrl}/user`).subscribe((data) => {
      this.user.next(data);
      this.userPhoto.next(data.profile.photo);
    });
  }

  getUserID() {
    this.http
      .get<any>(`${this.apiUrl}/user`)
      .pipe(
        tap((data) => {
          this.saveId(data.id);
          console.log('USER ID -->', localStorage.getItem('user_id'));
          return data;
        })
      )
      .subscribe((user) => {
        this.id.next(user.id);
      });
  }

  saveId(userId) {
    localStorage.setItem('user_id', userId);
  }
}
