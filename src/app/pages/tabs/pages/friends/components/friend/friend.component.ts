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
  @Input() isFriend: boolean = false;
  @Output() addedFriend = new EventEmitter<Friend>();
  @Output() unfollowFriend = new EventEmitter<Friend>();
  myId;
  following: boolean = false;
  avatarDefault: string = 'assets/img/default-avatar.png';
  sentFriendRequest: boolean = false;

  constructor(private friendsSvc: FriendsService) {
    this.myId = localStorage.getItem('user_id');
  }

  ngOnInit() {
    // if (this.friend) {
    //   this.following = true;
    // }
    console.log(this.user);
    this.isFriend ? (this.following = true) : (this.following = false);
    if (this.user.hasOwnProperty('to')) {
      if (this.user.to.length) {
        this.user.to.forEach((item) => {
          if (item.user_id == this.myId) {
            this.following = true;
            this.isFriend = true;
          }
        });
      }
    }

    if (this.user.friends.length) {
      console.log('Frends test -->');
      this.user.friends.forEach((friendsItem) => {
        if (friendsItem.connect.length) {
          console.log('Connect test -->');
          const friend = friendsItem;
          // console.log(friend)
          friendsItem.connect.forEach((connectItem) => {
            console.log('Connect forEach test -->');
            // console.log('connect item test -->', connectItem)

            if (connectItem.user_id == this.myId) {
              console.log('tienes conexion');
              // if (friend.connections) {
              if (friend.connections.status === 1) {
                this.sentFriendRequest = true;
                console.log('Ya has enviado una solicitud e amistad.');
              } else if (friend.connections.status === 2) {
                this.following = true;
                console.log('Solicitud de amistad aprobada');
              } else {
                this.following = false;
              }
              // } else {
              //   this.following = false;
              // }
            }
          });
        }

        // if (item.connect.connection_id === 1) {
        //     this.following = true;
        //   console.log('Eres amigo');
        // }

        // if (item.user_id == this.myId) {
        //   this.following = true;
        //   console.log('Eres amigo');
        // }
      });
    }
  }

  friendRequest() {
    this.sentFriendRequest = true;
    this.friendsSvc.friendRequest(this.user.id).subscribe((res) => {
      console.log('Id del usuario a enviar solicitud', this.user.id);
      console.log('Solicitud enviada -->', res);
    });
  }

  follow(id) {
    this.following = true;
    this.friendsSvc.follow(id).subscribe((res) => {
      console.log(res);

      this.addedFriend.emit(this.user);
    });
  }
  unfollow(id) {
    this.following = false;

    this.friendsSvc.unfollow(id).subscribe((res) => {
      console.log(res);

      this.unfollowFriend.emit(this.user);
    });
  }
}
