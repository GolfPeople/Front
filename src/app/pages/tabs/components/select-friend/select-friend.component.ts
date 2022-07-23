import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChatService } from 'src/app/core/services/chat/chat.service';
import { FriendsService } from 'src/app/core/services/friends.service';

@Component({
  selector: 'app-select-friend',
  templateUrl: './select-friend.component.html',
  styleUrls: ['./select-friend.component.scss'],
})
export class SelectFriendComponent implements OnInit {
  loading: boolean;  
  constructor(
    private friendsSvc: FriendsService,
    public chatSvc: ChatService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.getFriends();
   }


  getFriends() {
    this.loading = true;
    this.friendsSvc.searchFriend('').subscribe(res => {
      this.chatSvc.friends$.next(res.data);
      this.loading = false;            
    })
  }

  savePlayers(){
    let players = this.chatSvc.friends$.value.filter(f => {return f.isChecked == true});
    this.modalController.dismiss({players});
  }
}
