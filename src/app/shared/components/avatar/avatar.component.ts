import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
  // @Input() src;
  imageAvatarDefault;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUserInfo().subscribe(({ profile }) => {
      if (profile.photo) {
        this.imageAvatarDefault = profile.photo;
        console.log(profile.photo);
        console.log(profile);
      }
    });
  }
}
