import { Component, OnInit, Input } from '@angular/core';
import { Friend } from 'src/app/core/models/friend.interface';
import { FriendsService } from 'src/app/core/services/friends.service';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss'],
})
export class FriendComponent implements OnInit {
  @Input() user: Friend;
  myId;
  following: boolean = false;

  constructor(private friendsSvc: FriendsService) {
    this.myId = localStorage.getItem('user_id');
  }

  ngOnInit() {
    if (this.user.to.length) {
      this.user.to.forEach((item) => {
        if (item.user_id == this.myId) {
          this.following = true;
        }
      });
    }
  }

  follow(id) {
    this.following = true;
    this.friendsSvc.follow(id).subscribe((res) => console.log(res));
  }
}
