import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChatService } from 'src/app/core/services/chat/chat.service';
import { FriendsService } from 'src/app/core/services/friends.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-select-friend',
  templateUrl: './select-friend.component.html',
  styleUrls: ['./select-friend.component.scss'],
})
export class SelectFriendComponent implements OnInit {
  loading: boolean;

  peopleWitHCP = [];
  search = '';

  @Input() usersId = [];
  constructor(
    private friendsSvc: FriendsService,
    public chatSvc: ChatService,
    private modalController: ModalController,
    private firebaseSvc: FirebaseService
  ) { }

  ngOnInit() {
    this.getPeopleWithHCP();
  }


  getPeopleWithHCP() {
    this.loading = true;
    this.friendsSvc.searchFriend(this.search).subscribe(res => {
      this.peopleWitHCP = res.data.filter(user => user.profile.handicap).filter(user => !this.usersId.includes(user.id));
      
      this.loading = false;
    })
  }

  savePlayers() {
    let players = this.peopleWitHCP.filter(f => { return f.isChecked == true });

    if (players.length <= 3) {
      this.modalController.dismiss({ players });
    } else {
      this.firebaseSvc.Toast('Puedes agregar máximo 3 jugadores')
    }


  }
}
