import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Friend } from 'src/app/core/models/friend.interface';
import { FriendsService } from 'src/app/core/services/friends.service';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss'],
})
export class FriendComponent implements OnInit {
  @Input() user: Friend;
  @Input() friend: boolean = false;
  @Output() addedFriend = new EventEmitter<Friend>();
  myId;
  following: boolean = false;

  constructor(private friendsSvc: FriendsService) {
    this.myId = localStorage.getItem('user_id');
  }

  ngOnInit() {
    // if (this.friend) {
    //   this.following = true;
    // }

    this.friend ? (this.following = true) : (this.following = false);
    if (this.user.hasOwnProperty('to')) {
      if (this.user.to.length) {
        this.user.to.forEach((item) => {
          if (item.user_id == this.myId) {
            this.following = true;
            this.friend = true;
          }
        });
      }
    }
  }

  follow(id) {
    this.following = true;
    this.friendsSvc.follow(id).subscribe((res) => {
      console.log(res);

      this.addedFriend.emit(this.user);
    });
  }
}
