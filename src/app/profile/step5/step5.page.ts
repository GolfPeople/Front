import { Component, OnInit } from '@angular/core';

import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-step5',
  templateUrl: './step5.page.html',
  styleUrls: ['./step5.page.scss'],
})
export class Step5Page implements OnInit {
  imageAvatarDefault = 'assets/img/default-avatar.png';
  picture = '';
  userName: string;
  handicap: string;
  license: string;
  avatarImage;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUserInfo().subscribe((user) => {
      console.log(user);
      this.userName = user.name;
      this.handicap = user.profile.handicap;
      this.license = user.profile.license;
      this.avatarImage = user.profile.photo;
      // this.imageAvatarDefault = user.profile.photo;
      // console.log(user.profile.photo)
    });
  }
}
