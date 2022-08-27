import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChatService } from 'src/app/core/services/chat/chat.service';
import { FriendsService } from 'src/app/core/services/friends.service';

@Component({
  selector: 'app-new-member',
  templateUrl: './new-member.component.html',
  styleUrls: ['./new-member.component.scss'],
})
export class NewMemberComponent implements OnInit {

  @Input() currentMembers;
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
    this.friendsSvc.search('').subscribe(res => {
      this.chatSvc.friends$.next(res.data.filter(res => {return !this.currentMembers.includes(res.id)}));
      this.loading = false;            
    })
  }

  saveMembers(){
    let members = this.chatSvc.friends$.value.filter(f => {return f.isChecked == true});
    this.modalController.dismiss({members});
  }
}
