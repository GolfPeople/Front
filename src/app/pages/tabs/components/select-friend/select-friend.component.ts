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
  ) { }

  ngOnInit() {
    this.getPeopleWithHCP();
  }


  getPeopleWithHCP() {
    this.loading = true;
    this.friendsSvc.search(this.search).subscribe(res => {
      this.peopleWitHCP = res.data.filter(user => !this.usersId.includes(user.id));

      this.loading = false;
    })
  }
/**
 * It gets the people with HCP from the database and filters them by the users that are already in the
 * group
 */
  // getPeopleWithHCP() {
  //   this.loading = true;
  //   this.friendsSvc.searchFriend(this.search).subscribe(res => {
  //     this.peopleWitHCP = res.data.filter(user => user.profile.handicap).filter(user => !this.usersId.includes(user.id));

  //     this.loading = false;
  //   })
  // }

 /**
  * We're filtering the peopleWitHCP array to only include the people who are checked, and then we're
  * passing that array back to the modal
  */
  savePlayers() {
    let players: any[] = this.peopleWitHCP.filter(f => { return f.isChecked == true });
    this.modalController.dismiss({ players });
  }
}
