import { Injectable } from '@angular/core';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root',
})
export class QrService {
  profileUrl: string = 'https://api.app.golfpeople.com/api/profile';
  id: number;

  constructor(private userService: UserService) {}

  profileQR() {
    this.userService.getUserInfo().subscribe((res) => {
      this.id = res.id;
    });
    const qr = `${this.profileUrl}/${this.id}`;
    return qr;
  }
}
