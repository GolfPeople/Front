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
  @Input() groups;
  @Input() listPlayers = [];
  
  constructor(
    private friendsSvc: FriendsService,
    public chatSvc: ChatService,
    private modalController: ModalController,
    private firebaseSvc: FirebaseService
  ) { }

  ngOnInit() {
    console.log(this.groups)
    this.getPeople();
  }


  
  getPeople() {
    this.loading = true;

    this.friendsSvc.search(this.search).subscribe(res => {
      this.peopleWitHCP = res.data.filter(user => !this.usersId.includes(user.id));

   
      this.loading = false;
    })
  }

  // getPeopleWithHCP() {
  //   this.loading = true;
  //   this.friendsSvc.searchFriend(this.search).subscribe(res => {
  //     this.peopleWitHCP = res.data.filter(user => user.profile.handicap).filter(user => !this.usersId.includes(user.id));
      
  //     this.loading = false;
  //   })
  // }

  savePlayers() {
   
    let players: any[] = this.peopleWitHCP.filter(f => { return f.isChecked == true });
   
    let arrayData:any = [];
    for (const i in players) {
      arrayData.push(players[i]);
    }
 
    if (players.length <= 3) {
      this.modalController.dismiss({ listPlayers:arrayData, groups: this.groups, players });
    } else {
     
      this.modalController.dismiss({ listPlayers:arrayData, groups: this.groups, players: players.slice(0,3) });
      this.firebaseSvc.Toast('Puedes agregar máximo 4 jugadores por grupo. Crea un nuevo grupo')
    }


  }
}
