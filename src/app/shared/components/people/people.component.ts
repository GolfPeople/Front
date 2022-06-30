import { Component, OnInit, Input } from '@angular/core';
import { FriendsService } from 'src/app/core/services/friends.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss'],
})
export class PeopleComponent implements OnInit {
  @Input() user: any;

  following: boolean = false;
  sentRequest: boolean = false;

  avatarDefault: string = 'assets/img/default-avatar.png';

  constructor(private friendsSvc: FriendsService) {}

  ngOnInit() {}

  sendFriendRequest(userId: number) {
    this.sentRequest = true;
    this.friendsSvc.friendRequest(userId).subscribe((res) => {
      console.log(res);
    });
  }

  follow(id) {
    this.following = true;
    this.friendsSvc.follow(id).subscribe((res) => {
      console.log('res -->', res);
    });
  }

  unfollow(id) {
    this.following = false;
    this.friendsSvc.unfollow(id).subscribe((res) => {
      console.log('res -->', res);
    });
  }
}
