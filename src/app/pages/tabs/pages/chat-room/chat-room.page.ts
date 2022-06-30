import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { ChatService } from 'src/app/core/services/chat/chat.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ChatMessagesComponent } from '../../components/chat-messages/chat-messages.component';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],
})
export class ChatRoomPage implements OnInit {
  avatar: string = 'assets/img/default-avatar.png';

  rooms: any = [];
  searchedRooms: any = []
  searchValue: string = ''
  waiting: boolean;
  chats = [];
  uid: string;
  loading: boolean;
  lastMessage;
  constructor(
    private chatSvc: ChatService,
    private loadingCtrl: LoadingController,
    private firebaseService: FirebaseService,
    private modalController: ModalController
  ) { }

  async ngOnInit() {

    this.loading = true;
    this.chatSvc.getRoom().subscribe((rooms: any) => {
      this.loading = false;
      
      for (let r of rooms) {
        this.firebaseService.getCollectionConditional('messages',
          ref => ref
            .where('chatId', '==', r.sale_id)
            .orderBy('created_at')
            .limit(1))
          .subscribe(data => {

            let msg = data.map(e => {
              return {
                message: e.payload.doc.data()['message'],
              };
            });
            r.lastmsg = msg[0].message
          })
      }

      this.rooms = rooms;
      this.searchedRooms = rooms;
      console.log(rooms);

    });
  }

  searchRoom(value: string) {
    if (!(value.length >= 1)) {
      this.searchedRooms = this.rooms
    } else {
      this.searchedRooms = this.rooms.filter(room => room.user[0]?.name.includes(value))
    }
  }

  async openChat(data) {
    const modal = await this.modalController.create({
      component: ChatMessagesComponent,
      componentProps: { data },
      cssClass: 'messages-modal'
    });
    await modal.present();
  }

  getMessages(sale_id) {

    this.firebaseService.getCollectionConditional('messages',
      ref => ref
        .where('chatId', '==', sale_id)
        .orderBy('created_at')
        .limit(1))
      .subscribe(data => {

        let msg = data.map(e => {
          return {
            message: e.payload.doc.data()['message'],
          };
        });


      });
  }
}
